class ApiResponse<T = any> {
  public success: boolean;
  public statusCode: number;
  public data: T | null;
  public message?: string;

  constructor(
    success: boolean,
    statusCode: number,
    data: T | null = null,
    message?: string
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message ?? "Success";
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      ...(this.data !== null && this.data !== undefined ? { data: this.data } : {}),
      ...(this.message ? { message: this.message } : {}),
    };
  }
}

export { ApiResponse };
