import {PaginationRequest} from './page-request';

export interface UserRequest {
  email?: string;
  fullName?: string | null;
  isActive?: string | null;
  provider?: string | null;
  totalLink?: number | null;
}
