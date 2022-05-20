export class AppError extends Error {
  data?: any;

  constructor(name: string, message?: string, data?: any) {
    super(message);
    this.name = name;
    this.data = data;
  }

  toString(): string {
    return `${this.message && ' '}[${this.name}]`;
  }
}
