import sequelize from '../../../config/conexion-db.js';
import { Model, DataTypes } from 'sequelize';

const ROLE_PERMISSION_TABLE = 'role_permission';

class RolePermission extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: ROLE_PERMISSION_TABLE,
      modelName: 'RolePermission',
      timestamps: false
    };
  }
}

const RolePermissionSchema = {
  role_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'role',
      key: 'id'
    }
  },
  permission_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'permission',
      key: 'id'
    }
  }
};

//RolePermission.init(RolePermissionSchema, RolePermission.config(sequelize));

export { RolePermission, RolePermissionSchema };
