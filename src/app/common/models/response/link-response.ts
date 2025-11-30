export interface LinkResponse {
  id: number;
  originalUrl: string;
  shortCode: string;
  qrCodeUrl: string | null;
  isQrGenerated: boolean;
  clickCount: number;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
  userEmail: string;
}
