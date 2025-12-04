export class CustomError extends Error {
  code: number;
  detail?: string;

  constructor(message: string, code = 500, detail?: string) {
    super(message);
    this.code = code;
    this.detail = detail;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
