import {ChangeDetectorRef, Component, inject, NgZone, OnInit} from '@angular/core';
import {LinkResponse} from '../../../common/models/response/link-response';
import {LinkClickLogResponse} from '../../../common/models/response/link-click-log.response';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {LinkService} from '../../../core/services/link';
import {HttpParams} from '@angular/common/http';
import {PageResponse} from '../../../common/models/response/page-response';
import {DatePipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UpdateLinkRequest} from '../../../common/models/request/update-link-request';

@Component({
  selector: 'app-link-details',
  imports: [
    DatePipe,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    SlicePipe
  ],
  templateUrl: './link-details.html',
  styleUrl: './link-details.scss',
})
export class LinkDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private linkService = inject(LinkService);
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

  loadLinkDetails(): void {
    this.linkService.getLinkDetails(this.linkId).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.linkDetails = res;
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
}
