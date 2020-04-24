import {Product} from './product';
import {User} from './user';

export class Delivery {
  id: string;
  user: User;
  product: Product;
  state: string;
}
