import {Product} from './product';
import {User} from './user';

export class Palette {
  id: string;
  product: string;
  items: number;
  place: string;
  priority: string;
  date: string;
  state: string;
  user: User;
}
