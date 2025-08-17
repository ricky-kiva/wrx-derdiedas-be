export interface PagedDTO<T> {
  items: T[];
  page: number;
  totalPages: number;
}
