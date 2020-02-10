import {Product} from './product';
import {User} from './user';

export class Palette {
  id: string;
  product: string;
  items: number;
  priority: string;
  date: string;
  user: User;
  place: string;
  state: string;
}
