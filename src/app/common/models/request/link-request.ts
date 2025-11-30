import {PaginationRequest} from './page-request';

export interface LinkSearchRequest extends PaginationRequest {
  userId?: string;
  shortCode?: string | null;
  originalUrl?: string | null;

  // Instant format: "2025-11-30T00:00:00Z"
  createdFrom?: string | null;
  createdTo?: string | null;
}
