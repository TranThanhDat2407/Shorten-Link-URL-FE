export interface PageMetadata {
  size: number; // Kích thước trang
  number: number; // Số trang hiện tại (page number)
  totalElements: number; // Tổng số phần tử
  totalPages: number; // Tổng số trang
}

export interface PageResponse<T> {
  content: T[];
  page: PageMetadata; // CHÍNH XÁC: Đối tượng lồng 'page'
}
