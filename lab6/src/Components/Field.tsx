import styles from './field.module.css'
import {useGameContext} from "./GameProcessProvider.tsx";
import {useEffect, useRef, useState} from "react";
import { GameLogic } from '../GameLogic/GameLogic.ts'

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

const Field = () => {

    const {board, relations, makeRelation, size} = useGameContext();
    const [pressed, setPressed] = useState<PressedDots | null>();
    const ref = useRef<HTMLDivElement>(null);
    const [currentPlayer, setCurrentPlayer] = useState("red");
    const gameLogic = new GameLogic(board, size);


    useEffect(() => {
        if(pressed?.firstDot && pressed.secondDot) {

            const values = {firstDot: {row: pressed.firstDot.row, col: pressed.firstDot.col},
                secondDot: {row: pressed.secondDot.row, col: pressed.secondDot.col}}

            if(gameLogic.isValid(values, currentPlayer)) {
                makeRelation(values);
                setCurrentPlayer(prev => prev === "red" ? "blue" : "red");
            }

            setPressed(null);
        }
    }, [pressed])

    const onDotClicked = (row: number, col:number) => {
        const newPressed = { ...pressed } as PressedDots;

        if(board[row][col]) {
            return;
        }
        if (!newPressed.firstDot) {
            newPressed.firstDot = { row, col };
        } else {
            newPressed.secondDot = { row, col };
        }

        setPressed(newPressed);
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
            height: '1px',
            backgroundColor: from.row === to.row ? 'red' : 'blue',
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'left center',
        };
    };

    return (
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

            {Object.entries(relations).map(([key, point], index) => {
                const [fromRow, fromCol] = key.split(',').map(Number);
                return (
                    <div
                        key={index}
                        className={styles['line']}
                        style={calculateLineStyle({ row: fromRow, col: fromCol }, point)}
                    ></div>
                );
            })}
        </div>
    );
};

export default Field;