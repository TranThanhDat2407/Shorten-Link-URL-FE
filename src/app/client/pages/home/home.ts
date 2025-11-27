import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgIf} from '@angular/common';
import {CreateShortLinkResponse} from '../../../common/models/link.model';
import {LinkService} from '../../../core/services/link';
import {AuthService} from '../../../core/services/auth';

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
  error = '';

  constructor(private linkService: LinkService,
              public authService: AuthService,
              private cdr: ChangeDetectorRef) {}

  shorten() {
    if (!this.longUrl) return;

    // Tự thêm https:// nếu người dùng quên
    let url = this.longUrl.trim();
    if (!url.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }

    this.isCreating = true;
    this.error = '';
    this.result = null;

    this.linkService.createShortLink({ originalUrl: url }).subscribe({
      next: (res) => {
        this.result = res;
        console.log(res);
        this.isCreating = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Không thể tạo link. Vui lòng thử lại!';
        this.isCreating = false;
        this.cdr.detectChanges();
      }
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert('Đã copy: ' + text);
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
        a.download = `QR_${this.result.code}.png`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
