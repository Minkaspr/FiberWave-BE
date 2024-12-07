import sequelize from "../../config/conexion-db.js";
import { User, UserSchema } from "../user/entity/user.js";
import { Role, RoleSchema } from "../role/entity/role.js";
import { Permission, PermissionSchema } from "../permission/entity/permission.js";
import { RolePermission, RolePermissionSchema } from "../role-permission/entity/role-permission.js";
import { RefreshToken, RefreshTokenSchema } from "../auth/entity/refresh-token.js";
import { Customer, CustomerSchema } from "../customer/entity/customer.js";
import { Seller, SellerSchema } from "../seller/entity/seller.js";
import { Admin, AdminSchema } from "../admin/entity/admin.js";

// Inicializar modelos
User.init(UserSchema, User.config(sequelize));
Role.init(RoleSchema, Role.config(sequelize));
Permission.init(PermissionSchema, Permission.config(sequelize));
RolePermission.init(RolePermissionSchema, RolePermission.config(sequelize));
RefreshToken.init(RefreshTokenSchema, RefreshToken.config(sequelize));
Customer.init(CustomerSchema, Customer.config(sequelize));
Seller.init(SellerSchema, Seller.config(sequelize));
Admin.init(AdminSchema, Admin.config(sequelize));

// Configurar relaciones entre modelos
// Relación entre User y Role
User.belongsTo(Role, { as: 'role', foreignKey: 'role_id' });
Role.hasMany(User, { as: 'users', foreignKey: 'role_id' });

// Relación de muchos a muchos entre Role y Permission a través de RolePermission
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles',
});

// Relación de RolePermission con Role y Permission
RolePermission.belongsTo(Role, { as: 'role', foreignKey: 'role_id' });
RolePermission.belongsTo(Permission, { as: 'permission', foreignKey: 'permission_id' });

// Relación entre RefreshToken y User
RefreshToken.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(RefreshToken, { as: 'refreshTokens', foreignKey: 'userId' });

// Relación entre User y Customer, Seller, Admin
User.hasOne(Customer, { as: 'customer', foreignKey: 'user_id' });
Customer.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

User.hasOne(Seller, { as: 'seller', foreignKey: 'user_id' });
Seller.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

User.hasOne(Admin, { as: 'admin', foreignKey: 'user_id' });
Admin.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

// Exportar los modelos y sequelize para su uso en otras partes de la aplicación
export { sequelize, User, Role, Permission, RolePermission, RefreshToken, Customer, Seller, Admin };