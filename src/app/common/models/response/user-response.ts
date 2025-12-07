export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  pictureUrl: string | null;
  isActive: boolean;
  provider: string;
  role: number;
  totalLink: string;
  updatedAt: string;
  userEmail: string;
}
