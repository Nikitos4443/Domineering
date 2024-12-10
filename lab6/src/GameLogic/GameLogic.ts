interface Move {
    firstDot: { row: number; col: number };
    secondDot: { row: number; col: number };
}

interface Dot {
    row: number;
    col: number;
}

export class GameLogic {
    public board: boolean[][];
    private size: number;

    constructor(board: boolean[][], size: number) {
        this.board = board;
        this.size = size;
    }

    public isValid(move: Move, cp: string): boolean {
        const {firstDot, secondDot} = move;

        if (!this.isLimit(firstDot, secondDot)) return false;
        if (this.isExistLine(firstDot, secondDot)) return false;
        if (!this.isDistanceGood(firstDot, secondDot)) return false;
        if (!this.isCurrentPlayer(firstDot, secondDot, cp)) return false;

        return true;
    }

    private isLimit(firstDot: Dot, secondDot: Dot): boolean {
        return (
            firstDot.row >= 0 &&
            firstDot.col >= 0 &&
            secondDot.row >= 0 &&
            secondDot.col >= 0 &&
            firstDot.row < this.size &&
            firstDot.col < this.size &&
            secondDot.row < this.size &&
            secondDot.col < this.size
        );
    }

    private isExistLine(firstDot: Dot, secondDot: Dot): boolean {
        return this.board[firstDot.row][firstDot.col] || this.board[secondDot.row][secondDot.col];
    }

    private isDistanceGood(firstDot: Dot, secondDot: Dot): boolean {
        if (firstDot.row === secondDot.row && firstDot.col === secondDot.col) return false;
        if (Math.abs(firstDot.row - secondDot.row) > 1 || Math.abs(firstDot.col - secondDot.col) > 1) return false;
        if (firstDot.row !== secondDot.row && firstDot.col !== secondDot.col) return false;
        return true;
    }

    private isCurrentPlayer = (firstDot: Dot, secondDot: Dot, currentPlayer: string): boolean => {
        if (currentPlayer === "red") {
            if (firstDot.col !== secondDot.col) {
                return false;
            }
        } else {
            if (firstDot.row !== secondDot.row) {
                return false;
            }
        }

        return true;
    }

    public IsGameOver(cp: string): boolean {
        const validMoves = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {

                if (!this.board[i][j]) {
                    const neighbours = this.GetNeighbours({row: i, col: j}, cp);
                    for (let k = 0; k < neighbours.length; k++) {
                        const line = {
                            firstDot: {row: i, col: j},
                            secondDot: {row: neighbours[k].row, col: neighbours[k].col}
                        };

                        if (this.isValid(line, cp === "red" ? "blue" : "red")) {
                            validMoves.push(line);
                        }
                    }
                }

            }
        }
        return validMoves.length === 0;
    }

    public GetNeighbours(dot: Dot, player: string): Dot[] {
        let directions;
        if (player === "red") {
            directions = [[0, -1], [0, 1]];
        } else {
            directions = [[1, 0], [-1, 0]];
        }

        const neighbours: Dot[] = [];

        for (let i = 0; i < directions.length; i++) {
            neighbours.push({row: dot.row + directions[i][0], col: dot.col + directions[i][1]});
        }

        return neighbours;
    }
}