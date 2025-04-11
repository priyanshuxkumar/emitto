class ApiError extends Error {
  public success: boolean;
  public statusCode: number;
  public data: any;
  public errors: any[];

  constructor(
    success: boolean = false,
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack?: string
  ) {
    super(message);
    this.success = success || false;
    this.statusCode = statusCode || 500;
    this.message = message || "Something went wrong";
    this.data = null;
    this.errors = errors;

    if (stack) {
      this.stack = stack
    } else{
        Error.captureStackTrace(this, this.constructor)
    }
  }
}

export { ApiError };
