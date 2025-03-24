export class Result<T, E = Error> {
  private readonly isSuccess: boolean;

  private constructor(
    private readonly value: T | null,
    private readonly error: E | null
  ) {
    this.isSuccess = error === null;
  }

  static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(value, null);
  }

  static err<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(null, error);
  }

  isOk(): boolean {
    return this.isSuccess;
  }

  isErr(): boolean {
    return !this.isSuccess;
  }

  unwrap(): T {
    if (this.isSuccess && this.value !== null) {
      return this.value;
    }
    throw this.error || new Error("Called unwrap on Error value");
  }

  unwrapOr(defaultValue: T): T {
    return this.isSuccess && this.value !== null ? this.value : defaultValue;
  }

  unwrapErr(): E {
    if (!this.isSuccess && this.error !== null) {
      return this.error;
    }
    throw new Error("Called unwrapErr on Ok value");
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.isSuccess && this.value !== null
      ? Result.ok(fn(this.value))
      : Result.err(this.error!);
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return this.isSuccess
      ? Result.ok(this.value!)
      : Result.err(fn(this.error!));
  }

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.isSuccess && this.value !== null
      ? fn(this.value)
      : Result.err(this.error!);
  }
}
