export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  fullName: string;
  role: string;
  pictureUrl: string | null;
}
