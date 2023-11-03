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

// Data Table
export interface IColumn {
  field: string;
  label: string;
  align?: "left" | "right" | "center" | "justify" | "inherit";
  render?: (row: any) => JSX.Element | string;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  handleChangePage: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => void;
  handleChangePageSize: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export interface IError {
  response: {
    data: {
      success: boolean;
      message: string;
      errorMessages: IErrorMessage[];
      status: number;
      statusText: string;
    };
  };
}

export interface IErrorMessage {
  path: string;
  message: string;
}
