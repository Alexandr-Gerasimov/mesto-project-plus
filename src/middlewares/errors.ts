export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class NotValidError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class AuthorizationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class wrongAddressError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}