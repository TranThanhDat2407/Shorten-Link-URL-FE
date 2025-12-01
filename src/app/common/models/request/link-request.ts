import {PaginationRequest} from './page-request';

export interface LinkSearchRequest extends PaginationRequest {
  userId?: string;
  shortCode?: string | null;
  originalUrl?: string | null;

  createdFrom?: string | null;
  createdTo?: string | null;
}
