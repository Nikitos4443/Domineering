interface move {
    firstDot: {
        row: number;
        col: number;
    },
    secondDot: {
        row: number;
        col: number;
    }
}

interface Dot {
    row: number;
    col: number;
}

class Opponent {

    private readonly depth: number;
    private board: boolean[][];

    constructor(depth: number, board: boolean[][]) {
        this.depth = depth;
        this.board = board;
    }

    private GenerateRedValidMoves(): move[] {
        const validMoves: move[];

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (!this.board[i][j]) {

                }
            }
        }
    }

    private GetNeighbours(dot: Dot): Dot[] {
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

        for (let i = 0; i < 4; i++) {
            const neighbor = {row: dot.row + directions[i][0], col: dot.col + directions[i][1]};

        }
    }
}

export default Opponent;