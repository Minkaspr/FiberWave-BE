export class UniqueConstraintError extends Error {
  constructor(field, message) {
    super(message || `El ${field} ya existe`);
    this.field = field;
    this.statusCode = 409;
  }
}