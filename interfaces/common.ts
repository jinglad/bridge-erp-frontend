export interface IAllGetResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
}

export interface IGetResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
