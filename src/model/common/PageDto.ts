export interface PageDto<T> {
  size: number;
  page: number;
  totalPages: number;
  totalElements: number;
  data: T[];
}
