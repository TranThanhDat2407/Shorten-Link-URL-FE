import {PaginationRequest} from './page-request';

export interface LinkSearchRequest extends PaginationRequest {
  userId?: string;
  email?: string;
  shortCode?: string | null;
  originalUrl?: string | null;
  createdFrom?: string | null;
  createdTo?: string | null;
}
