import { Model, DataTypes } from 'sequelize';

const ROLE_TABLE = 'role';

class Role extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: ROLE_TABLE,
      modelName: 'Role',
      timestamps: false
    };
  }
}

const RoleSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  }
};

export { Role, RoleSchema };