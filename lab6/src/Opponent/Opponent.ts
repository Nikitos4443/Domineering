import {GameLogic} from "../GameLogic/GameLogic.ts";

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
    private gameLogic: GameLogic;
    private cp: string;

    constructor(depth: number | undefined, board: boolean[][], cp: string) {

        this.depth = depth === undefined ? -1 : depth;
        this.board = board;
        this.gameLogic = new GameLogic(board, board.length);
        this.cp = cp;
    }

    public BestLine():move {
        const validMoves = this.GenerateBlueValidMoves();
        if (validMoves.length === 0) {
            throw new Error("error");
        }

        let bestFirstDot: Dot = validMoves[0].firstDot;
        let bestSecondDot: Dot = validMoves[0].secondDot;
        let best = -Infinity;

        for (let i = 0; i < validMoves.length; i++) {
            this.MakeMove(validMoves[i]);
            const currValue = this.AlphaBetaPruning(this.depth, -Infinity, Infinity, false);
            this.UndoMove(validMoves[i]);

            if (currValue > best) {
                best = currValue;
                bestFirstDot = validMoves[i].firstDot;
                bestSecondDot = validMoves[i].secondDot;
            }
        }

        return { firstDot: bestFirstDot, secondDot: bestSecondDot };
    }

    private AlphaBetaPruning(depth: number, alpha: number, beta: number, isMinimize: boolean): number {
        if(depth == -1) {
            return Math.random() * 4 + 1;
        }

        if(depth == 0 || this.gameLogic.IsGameOver(isMinimize ? "red" : "blue")) {
            return this.EvaluateState();
        }

        if(!isMinimize) {
            let max = -Infinity;
            const validMoves = this.GenerateRedValidMoves();

            for(let i = 0; i < validMoves.length; i++) {
                this.MakeMove(validMoves[i]);
                const evaluation = this.AlphaBetaPruning(depth-1, alpha, beta, true);
                this.UndoMove(validMoves[i]);

                max = Math.max(max, evaluation);
                alpha = Math.max(alpha, evaluation);

                if(alpha >= beta){
                    console.log("alphabeta")
                    break;
                }
            }
            return max;

        } else {
            let min = Infinity;
            const validMoves = this.GenerateBlueValidMoves();
            for(let i = 0; i < validMoves.length; i++) {
                this.MakeMove(validMoves[i]);
                const evaluation = this.AlphaBetaPruning(depth-1, alpha, beta, false);
                this.UndoMove(validMoves[i]);

                min = Math.min(min, evaluation);
                beta = Math.min(beta, evaluation);

                if(beta <= alpha) {
                    console.log("alphabeta")
                    break;
                }

            }
            return min;
        }
    }

    private GenerateBlueValidMoves(): move[] {
        const validMoves: move[] = [];

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {

                if (!this.board[i][j]) {
                    const neighbours = this.gameLogic.GetNeighbours({row: i, col: j}, "blue");
                    for(let k = 0; k < neighbours.length; k++) {
                        const line = {firstDot: {row: i, col: j}, secondDot: {row: neighbours[k].row, col: neighbours[k].col}};

                        if(this.gameLogic.isValid(line, "red")) {
                            validMoves.push(line);
                        }

                    }
                }

            }
        }

        return validMoves;
    }

    private GenerateRedValidMoves(): move[] {
        const validMoves: move[] = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {

                if (!this.board[i][j]) {
                    const neighbours = this.gameLogic.GetNeighbours({row: i, col: j}, "red");
                    for(let k = 0; k < neighbours.length; k++) {
                        const line = {firstDot: {row: i, col: j}, secondDot: {row: neighbours[k].row, col: neighbours[k].col}};
                        if(this.gameLogic.isValid(line, "blue")) {
                            validMoves.push(line);
                        }

                    }
                }

            }
        }

        return validMoves;
    }

    private MakeMove(line: move):void {
        this.board[line.firstDot.row][line.firstDot.col] = true;
        this.board[line.secondDot.row][line.secondDot.col] = true;
    }

    private UndoMove(line: move):void {
        this.board[line.firstDot.row][line.firstDot.col] = false;
        this.board[line.secondDot.row][line.secondDot.col] = false;
    }

    private EvaluateState(): number {
        const currentPlayerMoves = this.cp === "red"
            ? this.GenerateRedValidMoves().length
            : this.GenerateBlueValidMoves().length;

        const opponentMoves = this.cp === "red"
            ? this.GenerateBlueValidMoves().length
            : this.GenerateRedValidMoves().length;

        return currentPlayerMoves - opponentMoves;
    }
}

export default Opponent;
