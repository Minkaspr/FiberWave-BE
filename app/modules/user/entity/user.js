import sequelize from '../../config/conexion-db.js';
import { Model, DataTypes } from 'sequelize';

const USER_TABLE = 'user';

class User extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  surname: {
    allowNull: false,
    type: DataTypes.STRING
  },
  role_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'role', // Nombre de la tabla del modelo Role
      key: 'id'
    }
  },
  is_active: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}

User.init(UserSchema, User.config(sequelize));

export { User, UserSchema };