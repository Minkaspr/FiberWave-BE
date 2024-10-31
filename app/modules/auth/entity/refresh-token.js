import sequelize from '../../../config/conexion-db.js';
import { Model, DataTypes } from 'sequelize';

const REFRESH_TOKEN_TABLE = 'refresh_token';

class RefreshToken extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: REFRESH_TOKEN_TABLE,
      modelName: 'RefreshToken',
      timestamps: false
    }
  }
}

const RefreshTokenSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'user', // Nombre de la tabla del modelo User
      key: 'id'
    },
    field: 'user_id'
  },
  token: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  expiresAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'expires_at'
  },
  isRevoked: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_revoked'
  },
  lastUsedAt: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'last_used_at'
  }
}

RefreshToken.init(RefreshTokenSchema, RefreshToken.config(sequelize));

export { RefreshToken, RefreshTokenSchema };