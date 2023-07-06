export type shapeName = 'I' | 'J' | 'L' | 'O' | 'S' | 'Z' | 'T';

export enum TetrisMoves {
    LEFT = 'left',
    RIGHT = 'right',
    DOWN = 'down',
}

export const TETROMINOS_DATA: { name: shapeName; shape: number[][]; blockNumber: number }[] = [
    {
      name: 'I',
      shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      blockNumber: 1,
    },
    {
      name: 'J',
      shape: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
        blockNumber: 2,
    },
    {
      name: 'L',
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
        blockNumber: 3,
    },
    {
      name: 'O',
      shape: [
        [1, 1],
        [1, 1],
      ],
        blockNumber: 4,
    },
    {
      name: 'S',
      shape: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
        blockNumber: 5,
    },
    {
      name: 'Z',
      shape: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      blockNumber: 6,
    },
    {
      name: 'T',
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
        blockNumber: 7,
    },
  ];
  