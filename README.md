# Fiberwave Backend 🌐

Fiberwave es una solución en desarrollo para la gestión de suscripciones de servicios de Internet. Este repositorio contiene el backend, diseñado para proporcionar una API robusta y escalable que soporta la administración de clientes, suscripciones, planes y pagos. Construido con Node.js y Express, este backend está optimizado para integrarse perfectamente con la interfaz de usuario del frontend y manejar solicitudes de manera eficiente.

La arquitectura del backend está centrada en proporcionar un servicio seguro y modular, con soporte para autenticación basada en tokens (JWT), manejo de roles de usuario y extensibilidad para futuras integraciones.

Para más información técnica y detalles sobre la implementación, consulta la [documentación completa aquí](https://spiral-math-ce8.notion.site/FiberWave-11a5180ecce9809ab7b0c1f4b99123b8?pvs=73).

---

## 🚀 Estado del Proyecto

Actualmente, el proyecto **Fiberwave** se encuentra en desarrollo. Hasta el momento, se ha implementado las siguientes funcionalidades en el backend y frontend.

### 📋 Funcionalidades Implementadas

#### Backend
- **Base de datos:**
  - Arquitectura en **PostgreSQL**.
  - Tablas principales: `user`, `role`, `permission`, `refresh_token`, `customer`, `seller`, `admin`, `history`.
  - Relaciones entre tablas utilizando claves foráneas.

- **API (Node.js con Express):**
  - **Autenticación:**
    - Registro y login con validaciones y protección con **JSON Web Tokens (JWT)**.
    - Manejo de **tokens de refresco** para sesiones persistentes.
    - Endpoints protegidos con middleware de autenticación.
  - **Gestión de usuarios:**
    - CRUD de usuarios con roles (`admin`, `customer`, `seller`).
    - Filtros avanzados: por rol, estado, y término de búsqueda.
    - Actualización de perfil y contraseña.
  - **Roles y permisos:**
    - Tabla de permisos asignados a roles.
    - Endpoint para consultar roles y permisos disponibles.

#### Frontend *(Pendiente de integración)*
- En el lado del frontend falta consumir todos los endpoints disponibles del backend hasta el momento.

---

## 🛠️ Tecnologías Utilizadas

- **Backend:**
  - Node.js con Express.
  - Sequelize para el ORM.
  - Validaciones con librerías personalizadas y middleware.

- **Base de Datos:**
  - PostgreSQL.
  - Arquitectura normalizada con timestamp automático para auditorías.

- **Autenticación:**
  - JSON Web Tokens (JWT).
  - Tokens de refresco para sesiones persistentes.

---

## ✅ Lista de Progreso

### Backend
- [x] Configuración inicial del proyecto (Node.js, Express, Sequelize).
- [x] Implementación de autenticación con JWT.
- [x] CRUD básico de usuarios.
- [x] Base de datos estructurada con roles, permisos y relaciones.
- [ ] Implementación de auditorías en la tabla `history`.

### Documentación
- [x] Creación del README inicial.
- [x] Documentación de endpoints ([aquí](https://spiral-math-ce8.notion.site/FiberWave-11a5180ecce9809ab7b0c1f4b99123b8?pvs=73)).
- [ ] Guía de configuración local para desarrolladores.

---

## 💡 Próximos Pasos

- **Integración del Frontend:**
  - Iniciar el diseño y la implementación del cliente.
- **Pruebas:**
  - Verificar si existe inconsistencias entre el frontend y backend.

---

## 📝 Cómo Ejecutar el Proyecto

### Requisitos Previos
- **Node.js** (versión 16 o superior).
- **PostgreSQL** (configurar la estructura de tablas - [Consultar aquí](https://spiral-math-ce8.notion.site/FiberWave-11a5180ecce9809ab7b0c1f4b99123b8?pvs=73)).

### Instalación
1. Clonar el repositorio:
  ```bash
    git clone https://github.com/Minkaspr/FiberWave-BE.git
  ```
2. Instalar dependencias:
  ```bash
    npm install
  ```

3. Configurar el archivo .env:
  ```dotenv
    JWT_SECRET = ''
    JWT_REFRESH_SECRET = ''
    PORT = 3000
    DB_USER = 'admin'
    DB_PASSWORD= ''
    DB_HOST = 'localhost'
    DB_NAME = 'fiberwave'
    DB_PORT = '5432'
    CLIENT_URL=''
    NODE_ENV=development
  ```

4. Ejecutar migraciones de la base de datos:
```bash
  npx sequelize-cli db:migrate
```

5. Iniciar el servidor:
```bash
  npm run dev
```
