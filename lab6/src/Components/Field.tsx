import styles from './field.module.css'
import {useGameContext} from "./GameProcessProvider.tsx";
import {CSSProperties, useEffect, useRef, useState} from "react";
import {GameLogic} from '../GameLogic/GameLogic.ts'
import Opponent from "../Opponent/Opponent.ts";

interface PressedDots {
    firstDot: {
        row: number;
        col: number;
    },
    secondDot: {
        row: number;
        col: number;
    }
}

const Field = ({ cp, difficulty }: { cp?: string; difficulty?: number }) => {

    const {board, relations, makeRelation, size} = useGameContext();
    const [pressed, setPressed] = useState<PressedDots | null>();
    const ref = useRef<HTMLDivElement>(null);
    const currentPlayer = cp || "blue";
    const [isGameOver, setIsGameOver] = useState<string | null>(null);
    const gameLogic = useRef(new GameLogic(board, size)).current;

    useEffect(() => {
        if (pressed?.firstDot && pressed.secondDot) {
            const values = {
                firstDot: {row: pressed.firstDot.row, col: pressed.firstDot.col},
                secondDot: {row: pressed.secondDot.row, col: pressed.secondDot.col},
            };

            if (gameLogic.isValid(values, currentPlayer)) {
                makeRelation(values);

                const updatedBoard = [...board];
                updatedBoard[values.firstDot.row][values.firstDot.col] = true;
                updatedBoard[values.secondDot.row][values.secondDot.col] = true;

                if (gameLogic.IsGameOver(currentPlayer === "red" ? "blue": "red")) {
                    setIsGameOver(currentPlayer);
                }

                if (gameLogic.IsGameOver(currentPlayer)) {
                    setIsGameOver(currentPlayer === "red" ? "blue": "red");
                }

                const opponentMove = new Opponent(difficulty, updatedBoard, "blue").BestLine();

                makeRelation(opponentMove);

                if (gameLogic.IsGameOver(currentPlayer)) {
                    setIsGameOver(currentPlayer === "red" ? "blue": "red");
                }

                if (gameLogic.IsGameOver(currentPlayer === "red" ? "blue": "red")) {
                    setIsGameOver(currentPlayer);
                }
            }

            setPressed(null);
        }
    }, [pressed, board, currentPlayer]);

    const onDotClicked = (row: number, col: number) => {
        const newPressed = {...pressed} as PressedDots;

        if (board[row][col]) {
            return;
        }
        if (!newPressed.firstDot) {
            newPressed.firstDot = {row, col};
        } else {
            newPressed.secondDot = {row, col};
        }

        setPressed(newPressed);
    }

    const restartGame = () => {
        window.location.reload();
    }

    const calculateLineStyle = (from: { row: number; col: number }, to: { row: number; col: number }) => {
        if (!ref.current) return {};

        const containerWidth = ref.current.offsetWidth;
        const containerHeight = ref.current.offsetHeight;

        const cellWidth = containerWidth / size;
        const cellHeight = containerHeight / size;

        const startX = (from.col + 0.5) * cellWidth;
        const startY = (from.row + 0.5) * cellHeight;
        const endX = (to.col + 0.5) * cellWidth;
        const endY = (to.row + 0.5) * cellHeight;

        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

        return {
            position: 'absolute',
            left: `${startX}px`,
            top: `${startY}px`,
            width: `${length}px`,
            height: '2px',
            backgroundColor: from.row === to.row ? 'red' : 'blue',
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'left center',
        } as CSSProperties;
    };

    return (
        <>
            {isGameOver &&
                <div className={styles['game-over-window']}>
                    {isGameOver} Wins!!
                    <br />
                    <button onClick={restartGame}>Restart</button>
                </div>
            }
            <div ref={ref} className={styles['field-main-container']}>
                {board.flatMap((row, rowIndex) =>
                    row.map((_, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`${styles['dot']} ${pressed?.firstDot.row === rowIndex && pressed?.firstDot.col === colIndex ? styles['active-dot'] : ''}`}
                            onClick={() => onDotClicked(rowIndex, colIndex)}
                        ></div>
                    ))
                )}

                {relations.map(({firstDot, secondDot}, index) => {
                    return (
                        <div
                            key={index}
                            className={styles['line']}
                            style={calculateLineStyle({row: firstDot.row, col: firstDot.col}, {
                                row: secondDot.row,
                                col: secondDot.col
                            })}
                        ></div>
                    );
                })}
            </div>
        </>
    );
};

export default Field;
