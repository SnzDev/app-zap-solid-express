export class Exception extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }

  getStatusCode() {
    return this.statusCode;
  }
}
