import { TETROMINOS_DATA, shapeName } from "./TetrominosShapes";

export class Tetromino {
    shape: number[][];
    name: shapeName;
    IRotated: boolean;

    constructor(name: shapeName, IRotated: boolean = false) {
        this.name = name
        this.shape = TETROMINOS_DATA.find(tetromino => tetromino.name === name)!.shape;
        this.IRotated = IRotated;
    }

    rotate() {
        const IShape1 = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
        const IShape2 = [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        if (this.name === "I" && !this.IRotated) {
            this.shape = IShape2;
            this.IRotated = true;
            return;
        }
        if (this.name === "I" && this.IRotated) {
            this.shape = IShape1;
            this.IRotated = false;
            return;
        }

        let rotatedShape = Array.from({ length: this.shape.length }, () => Array(this.shape.length).fill(0))

        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                rotatedShape[j][this.shape[i].length - 1 - i] = this.shape[i][j];
            }
        }
        this.shape = rotatedShape;
    }

}