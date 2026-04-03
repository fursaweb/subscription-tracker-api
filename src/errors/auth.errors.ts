export class EmailAlreadyInUseError extends Error {
  constructor(message = "Email already in use") {
    super(message);
    this.name = "EmailAlreadyInUseError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "Unauthorized";
  }
}
