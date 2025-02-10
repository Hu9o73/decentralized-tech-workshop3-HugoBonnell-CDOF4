// src/models/Order.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../ConfigFiles/dbConfig';

interface OrderProduct {
  productId: number;
  quantity: number;
}

class Order extends Model {
  public id!: number;
  public userId!: number;
  public products!: OrderProduct[];
  public totalPrice!: number;
  public status!: string;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'orders',
  }
);

export default Order;
