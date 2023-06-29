import { Timestamp } from "rxjs";

 export interface Comment {
    id?: number;
    game: string;
    player: string;
    comment: string;
    commentedOn?: Timestamp<any>
 } 