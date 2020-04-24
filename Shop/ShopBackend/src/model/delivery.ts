import Product from './product';
import User from './user';

export class Delivery {
  public id: string;
  public user: User;
  public product: Product;
  public state: string;
}
