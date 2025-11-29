export interface CreateShortLinkRequest {
  originalUrl: string;
  generateQrCode: boolean;
}

export interface CreateShortLinkResponse {
  code: string;
  shortUrl: string;
  qrCodeUrl: string;
  originalUrl: string;
}

// (Tùy chọn) Model cho danh sách link sau này
export interface Link {
  id: number;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  qrCodeUrl: string;
  clickCount: number;
  createdAt: string;
}
