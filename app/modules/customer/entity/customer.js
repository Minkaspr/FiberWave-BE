import { Model, DataTypes } from 'sequelize';

const CUSTOMER_TABLE = 'customer';

class Customer extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: CUSTOMER_TABLE,
      modelName: 'Customer',
      timestamps: false,
    };
  }
}

const CustomerSchema = {
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
      model: 'user', // Nombre de la tabla del modelo User
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  gender: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  birth_date: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  phone_number: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  loyalty_points: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
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

export { Customer, CustomerSchema };
