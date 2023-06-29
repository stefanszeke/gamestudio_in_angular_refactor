export type Tile = {
    value: string;
    status: TileStatus;
}

export type TileStatus = 'hidden' | 'visible' | 'flagged';