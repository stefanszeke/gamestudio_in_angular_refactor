export interface IGame1024Tile {
    value: number;
    hidden: boolean;
    mergeWith(other: IGame1024Tile): boolean;
    isEmpty(): boolean;
}