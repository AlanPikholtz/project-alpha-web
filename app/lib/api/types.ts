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

export type ApiError = {
  statusCode: number;
  error: string;
  messages: string[];
};
