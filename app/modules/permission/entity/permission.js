import sequelize from '../../../config/conexion-db.js';
import { Model, DataTypes } from 'sequelize';

const PERMISSION_TABLE = 'permission';

class Permission extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: PERMISSION_TABLE,
      modelName: 'Permission',
      timestamps: false
    };
  }
}

const PermissionSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  code: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  }
};

//Permission.init(PermissionSchema, Permission.config(sequelize));

export { Permission, PermissionSchema };
