export class CredentialError extends Error {
  constructor(message = 'Credenciales inválidas') {
      super(message);
      this.field = 'credential-error';
      this.statusCode = 401; // Unauthorized
  }
}

export class AuthorizationError extends Error {
  constructor(field = 'authorization-error', message = 'No estás autorizado para acceder a este recurso') {
      super(message);
      this.field = field;
      this.statusCode = 403; // Forbidden
  }
}

export class PermissionError extends Error {
  constructor(message = 'No tienes permiso para realizar esta acción') {
      super(message);
      this.field = 'permission-error';
      this.statusCode = 403; // Forbidden
  }
}