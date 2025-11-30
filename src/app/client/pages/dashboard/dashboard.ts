import {ChangeDetectorRef, Component, inject, NgZone} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {CreateShortLinkResponse} from '../../../common/models/link.model';
import {LinkService} from '../../../core/services/link';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class UserDashboardComponent {
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  // Ví dụ: google.com, www.google.com, http://google.com
  URL_REGEX = /^(?:(?:https?|ftp):\/\/)?(?:(?:\w|-)+\.)+\w{2,}(?:\/[\w- ./?%&=]*)?$/i;

  longUrl = '';
  result: CreateShortLinkResponse | null = null;
  isCreating = false;
  generateQrCode = false;
  error = '';

  constructor(private linkService: LinkService
              ) {}

  // ⭐ Hàm chuẩn hóa URL (Tương tự như trong Java, để đảm bảo gửi lên API)
  private standardizeUrl(url: string): string {
    url = url.trim();
    // Nếu không bắt đầu bằng http:// hoặc https:// (không phân biệt chữ hoa/thường)
    if (!url.toLowerCase().match(/^https?:\/\//i)) {
      return 'http://' + url;
    }
    return url;
  }

  shorten() {
    if (!this.longUrl) return;

    // ⭐ Chuẩn hóa URL trước khi gửi đi
    const url = this.standardizeUrl(this.longUrl);

    this.isCreating = true;
    this.error = '';
    this.result = null;

    this.linkService.createShortLink({
      originalUrl: url ,
      generateQrCode: this.generateQrCode
    },).subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.result = res;
          this.isCreating = false;
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        // ⭐ Sửa thông báo lỗi sang tiếng Anh
        this.error = err.error?.message || 'Failed to create link. Please try again!';
        this.isCreating = false;
        this.cdr.detectChanges();
      }
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert('copy: ' + text);
  }

  downloadQR() {
    if (!this.result?.qrCodeUrl) return;

    fetch(this.result.qrCodeUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // @ts-ignore
        a.download = `ShortIT_${this.result.code}.png`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
