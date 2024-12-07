import { Model, DataTypes } from 'sequelize';

const ADMIN_TABLE = 'admin';

class Admin extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: ADMIN_TABLE,
      modelName: 'Admin',
      timestamps: false,
    };
  }
}

const AdminSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  user_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  address: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  city: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  department: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  gender: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  birth_date: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  identity_document: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

export { Admin, AdminSchema };
