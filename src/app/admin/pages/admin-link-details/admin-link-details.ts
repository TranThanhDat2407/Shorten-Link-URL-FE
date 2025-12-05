import {ChangeDetectorRef, Component, inject, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LinkService} from '../../../core/services/link';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {LinkResponse} from '../../../common/models/response/link-response';
import {LinkClickLogResponse} from '../../../common/models/response/link-click-log.response';
import {HttpParams} from '@angular/common/http';
import {PageResponse} from '../../../common/models/response/page-response';
import {UpdateLinkRequest} from '../../../common/models/request/update-link-request';
import {DatePipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {AdminAnalyzeService} from '../../../core/services/admin-analyze';
import {AdminLinkDetailsResponse} from '../../../common/models/response/admin-link-details-response';
import {Chart, registerables} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-admin-link-details',
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SlicePipe
  ],
  templateUrl: './admin-link-details.html',
  styleUrl: './admin-link-details.scss',
})
export class AdminLinkDetailsComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private linkService = inject(LinkService);
  private adminAnalyzeService = inject(AdminAnalyzeService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private zone = inject(NgZone);

  // Link ID được lấy từ URL
  linkId!: number;

  domain = 'http://localhost:4200';

  URL_REGEX = /^(?:(?:https?|ftp):\/\/)?(?:(?:\w|-)+\.)+\w{2,}(?:\/[\w- ./?%&=]*)?$/i;

  // Dữ liệu Link chi tiết
  linkDetails: LinkResponse | null = null;

  // Dữ liệu Log Click
  clickLogs: LinkClickLogResponse[] = [];

  // Trạng thái phân trang
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  isLoading = true;

  ngOnInit(): void {
    this.linkId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.linkId) {
      this.loadLinkDetails();
      this.loadClickLogs(this.currentPage);
    }

  }

  analytics!: AdminLinkDetailsResponse | null;

  loadAnalytics(shortCode: string): void {
    this.adminAnalyzeService.getAdminLinkDetails(shortCode).subscribe({
      next: res => {
        this.analytics = res;
        this.initChart();
        this.cdr.detectChanges();
      },
      error: err => console.log(err)
    });
  }

  loadLinkDetails(): void {
    this.linkService.getLinkDetails(this.linkId).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.linkDetails = res;
          this.loadAnalytics(res.shortCode);
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Failed to load link details', err);
      }
    });
  }

  loadClickLogs(page: number): void {
    this.isLoading = true;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', this.pageSize.toString())
      .set('sort', 'clickedAt,DESC'); // Sắp xếp theo thời gian click mới nhất

    this.linkService.getLinkClickLogs(this.linkId, params).subscribe({
      next: (res: PageResponse<LinkClickLogResponse>) => {
        this.zone.run(() => {
          this.clickLogs = res.content;
          this.currentPage = res.page.number;
          this.totalPages = res.page.totalPages;
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Failed to load click logs', err);
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadClickLogs(page);
    }
  }

  getShortLink(code: string): string {
    return `${this.domain}/${code}`;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied!');
    });
  }

  isDeleteModalOpen: boolean = false;
  isUpdateModalOpen: boolean = false;

  // Trạng thái cho Link đang được chọn
  selectedLink: LinkResponse | null = null;

  openDeleteModal(link: LinkResponse): void {
    this.selectedLink = link;
    this.isDeleteModalOpen = true;
  }

  // Đóng modal
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedLink = null;
  }

  // Xử lý xác nhận xóa
  confirmDelete(): void {
    if (!this.selectedLink) return;

    this.linkService.deleteLink(this.selectedLink.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.router.navigate(['/user/my-link']);
      },
      error: (err) => {
        console.error('Delete link failed', err);
        alert('Failed to delete link.');
        this.closeDeleteModal(); // ✅ Đóng modal
      }
    });
  }


  updateForm: FormGroup = this.fb.group({
    originalUrl: [''],
  });

  // Mở modal
  openUpdateModal(link: LinkResponse): void {
    this.selectedLink = link;
    this.updateForm.patchValue({
      originalUrl: link.originalUrl // Điền URL cũ vào form
    });
    this.isUpdateModalOpen = true;
  }

  // Đóng modal
  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
    this.selectedLink = null;
    this.updateForm.reset();
  }

  // Xử lý cập nhật
  confirmUpdate(): void {
    if (!this.selectedLink || this.updateForm.invalid) {
      return;
    }

    const updatedUrl: string = this.updateForm.value.originalUrl;
    const requestBody: UpdateLinkRequest = { originalUrl: updatedUrl };

    this.linkService.updateLink(requestBody, this.selectedLink.id).subscribe({
      next: () => {
        this.zone.run(() => {
          this.closeUpdateModal();
          this.loadLinkDetails();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Update link failed', err);
        alert('Failed to update link.');
        this.closeUpdateModal();
      }
    });
  }


  generateDateRange(start: string, end: string): string[] {
    const range: string[] = [];
    const current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      range.push(current.toISOString().substring(0, 10));
      current.setDate(current.getDate() + 1);
    }

    return range;
  }


  addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().substring(0, 10);
  }


  initChart() {
    if (!this.analytics) return;

    const clicks = this.analytics.dailyClicks;

    // Generate full date range
    let  start = clicks[0].date;
    let end = clicks[clicks.length - 1].date;


    if (clicks.length <= 1) {
      end = this.addDays(start, 5);
    }

    const labels = this.generateDateRange(start, end);

    const map = new Map(clicks.map(d => [d.date, d.clicks]));

    // Fill missing days
    const data = labels.map(day => map.get(day) || 0);

    const maxValue = Math.max(...data);

    new Chart("dailyClickChart", {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Daily Clicks',
          data,
          borderWidth: 2,
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13,110,253,0.1)',
          tension: 0.3
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          datalabels: {
            align: 'end',
            anchor: 'end',
            color: '#6c757d',
            font: { size: 10, weight: 'bold' },
            formatter: v => v.y
          }
        },
        scales: {
          x: {
            offset: true,
            ticks: {
              padding: 10
            }
          },
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
            suggestedMax: maxValue * 1.2,
          }
        }
      }
    });
  }



}
