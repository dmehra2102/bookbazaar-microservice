import { CustomError } from "./custom-error";

export class RateLimitError extends CustomError {
  statusCode = 429;

  constructor() {
    super("Too many requests, please try again later.");

    Object.setPrototypeOf(this, RateLimitError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: "Too many requests, please try again later." }];
  }
}
