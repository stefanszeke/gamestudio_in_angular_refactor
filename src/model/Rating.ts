import { Timestamp } from "rxjs";

export interface Rating {
  id?: number;
  game: string;
  player: string;
  rating: number;
  ratedOn?: Timestamp<any>
} 