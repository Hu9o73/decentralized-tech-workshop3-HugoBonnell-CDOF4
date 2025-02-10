import { DataTypes, Model } from 'sequelize';
import sequelize from '../ConfigFiles/dbConfig';
import { CartProduct } from './CartProduct';

class Cart extends Model {
  public userId!: number;
  public products!: CartProduct[];
  public totalPrice!: number;
}

Cart.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'carts',
  }
);

export default Cart;
