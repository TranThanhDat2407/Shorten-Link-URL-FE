import {ChangeDetectorRef, Component, inject, NgZone, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LinkService} from '../../../core/services/link';
import {LinkResponse} from '../../../common/models/response/link-response';
import {LinkSearchRequest} from '../../../common/models/request/link-request';
import {HttpParams} from '@angular/common/http';
import {PageResponse} from '../../../common/models/response/page-response';
import {UpdateLinkRequest} from '../../../common/models/request/update-link-request';
import {RouterLink} from '@angular/router';
import {AdminAnalyzeService} from '../../../core/services/admin-analyze';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-links',
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SlicePipe,
    RouterLink
  ],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class AdminLinkComponent implements OnInit{
  private linkService = inject(LinkService);
  private adminService = inject(AdminAnalyzeService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  domain = environment.frontEndUrl;

  URL_REGEX = /^(?:(?:https?|ftp):\/\/)?(?:(?:\w|-)+\.)+\w{2,}(?:\/[\w- ./?%&=]*)?$/i;

  links: LinkResponse[] = [];

  isLoading = false;
  page = 0;
  size = 4;
  totalPages = 0;

  searchForm: FormGroup = this.fb.group({
    keyword: [''],
    userId: [''],
    email: [''],
    guestOnly: [false],
    createdFrom: [''],
    createdTo: [''],
  });


  ngOnInit() {
    this.loadLinks(0);
  }

  private toUtcStartOfDay(dateStr: string): string {
    const date = new Date(dateStr);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
  }

  private toUtcEndOfDay(dateStr: string): string {
    const date = new Date(dateStr);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)).toISOString();
  }

  loadLinks(page: number): void {
    this.isLoading = true;
    const val = this.searchForm.value;
    const keyword = val.keyword?.trim() || null;
    const userId = val.guestOnly ? 0 : (val.userId || null);
    const email = val.guestOnly ? null : (val.email || null);

    const body: LinkSearchRequest = {
      userId: userId,
      email: email,
      shortCode: keyword || null,
      originalUrl: keyword || null,
      createdFrom: val.createdFrom ? this.toUtcStartOfDay(val.createdFrom) : null,
      createdTo: val.createdTo ? this.toUtcEndOfDay(val.createdTo) : null,
      page,
      size: this.size,
      sort: 'createdAt,DESC'
    };

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', this.size.toString())
      .set('sort', 'createdAt,DESC');

    this.adminService.getLinks(body, params).subscribe({
      next: (res: PageResponse<LinkResponse>) => {
        this.links = res.content;
        this.page = res.page.number;
        this.totalPages = res.page.totalPages;
        this.size = res.page.size;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load links failed', err);
        this.links = [];
        this.totalPages = 0;
        this.isLoading = false;
      }
    });
  }

  onFilter(): void {
    this.loadLinks(0);
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    console.log(page)
    this.loadLinks(page);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
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
        this.closeDeleteModal(); // ✅ Đóng modal
        this.zone.run(() => {
          this.loadLinks(this.page);

          this.cdr.detectChanges();
        });
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
    const title: string = this.updateForm.value.title;
    const requestBody: UpdateLinkRequest = { originalUrl: updatedUrl , title: title };

    this.linkService.updateLink(requestBody, this.selectedLink.id).subscribe({
      next: () => {
        this.zone.run(() => {
          this.closeUpdateModal(); // ✅ Đóng modal
          this.loadLinks(this.page);
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Update link failed', err);
        alert('Failed to update link.');
        this.closeUpdateModal(); // ✅ Đóng modal
      }
    });
  }
}
