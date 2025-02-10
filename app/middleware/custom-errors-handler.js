export class UniqueConstraintError extends Error {
  constructor(field, message) {
    super(message || `El ${field} ya existe`);
    this.field = field;
    this.statusCode = 409;
  }
}

export class NotFoundError extends Error {
  constructor(resource, field, value) {
    super(`No se encontró ningún ${resource}. Valor de '${field}': '${value}'`);
    this.resource = resource;
    this.field = field;
    this.value = value;
    this.statusCode = 404;
  }
}

/* export class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Acceso no autorizado') {
    super(message);
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'No tienes permisos para realizar esta acción') {
    super(message);
    this.statusCode = 403;
  }
} */
