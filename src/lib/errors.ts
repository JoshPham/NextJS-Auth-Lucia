export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super("You must be logged in to view this content");
    this.name = "AuthenticationError";
  }
}

export class EmailInUseError extends PublicError {
  constructor() {
    super("Email is already in use");
    this.name = "EmailInUseError";
  }
}

export class LoginError extends PublicError {
  constructor() {
    super("Invalid credentials");
    this.name = "LoginError";
  }
}

export class InvalidCredentialsError extends PublicError {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}