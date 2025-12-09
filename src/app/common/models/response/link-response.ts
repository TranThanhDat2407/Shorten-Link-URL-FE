export interface LinkResponse {
  id: number;
  title: string | null;
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
