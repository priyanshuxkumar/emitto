/* eslint-disable @typescript-eslint/no-explicit-any */
type ApiSuccessResponse<T = any> = {
  success: boolean;
  statusCode: number;
  data?: T;
  message?: string;
  errors?: any[];
};

type ApiErrorResponse = {
  success: false;
  message: string;
};

type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

interface ValidateFormProp {
  email: string;
  password: string;
  setErrors: ({}) => void;
}

interface LoaderProp {
  color: string;
  strokeWidth: string;
  size: string;
}

export type { ApiResponse, ApiErrorResponse, ValidateFormProp, LoaderProp };
