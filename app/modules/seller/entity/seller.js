import { Model, DataTypes } from 'sequelize';

const SELLER_TABLE = 'seller';

class Seller extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: SELLER_TABLE,
      modelName: 'Seller',
      timestamps: false,
    };
  }
}

const SellerSchema = {
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
  reference: {
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
  nationality: {
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

export { Seller, SellerSchema };
