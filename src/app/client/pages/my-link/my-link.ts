import {ChangeDetectorRef, Component, inject, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LinkService} from '../../../core/services/link';
import {DatePipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {LinkResponse} from '../../../common/models/response/link-response';
import {environment} from '../../../environments/environment';
import {LinkSearchRequest} from '../../../common/models/request/link-request';
import {Router} from '@angular/router';
import {PageResponse} from '../../../common/models/response/page-response';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-my-link',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    SlicePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './my-link.html',
  styleUrl: './my-link.scss',
})
export class MyLinkComponent implements OnInit {
  private linkService = inject(LinkService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  domain = 'http://localhost:4200';


  links: LinkResponse[] = [];

  isLoading = false;
  page = 0;
  size = 4;
  totalPages = 0;

  searchForm: FormGroup = this.fb.group({
    keyword: [''],
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

    const body: LinkSearchRequest = {
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

    this.linkService.getMyLinks(body, params).subscribe({
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

}
