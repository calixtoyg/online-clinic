import {Schedule} from './schedule';

export interface Calendar {
  id: string;
  year: number;
  month: number;
  day: number;
  schedule?: Schedule[];
}
