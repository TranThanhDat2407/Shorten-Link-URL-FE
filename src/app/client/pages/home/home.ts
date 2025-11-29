import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgIf} from '@angular/common';
import {CreateShortLinkResponse} from '../../../common/models/link.model';
import {LinkService} from '../../../core/services/link';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  longUrl = '';
  result: CreateShortLinkResponse | null = null;
  isCreating = false;
  generateQrCode = false;
  error = '';

  // ⭐ Khai báo Regex để kiểm tra cú pháp (Frontend Validation)
  // Regex này chấp nhận URL có hoặc không có giao thức (http/https),
  // Ví dụ: google.com, www.google.com, http://google.com
  URL_REGEX = /^(?:(?:https?|ftp):\/\/)?(?:(?:\w|-)+\.)+\w{2,}(?:\/[\w- ./?%&=]*)?$/i;


  constructor(private linkService: LinkService,
              private cdr: ChangeDetectorRef) {}

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
        this.result = res;
        this.isCreating = false;
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
