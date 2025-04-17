export interface PagedDataResponse<T> {
  data: T;
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PagedQueryParams {
  limit?: number;
  page?: number;
}
