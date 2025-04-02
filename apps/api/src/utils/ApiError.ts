class ApiError extends Error {
  public success: boolean;
  public statusCode: number;
  
  constructor(success: boolean = false, statusCode: number, message: string) {
    super(message);
    this.success = success || false;
    this.statusCode = statusCode || 500;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };