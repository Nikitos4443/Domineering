/* eslint-disable */
import {createContext, ReactNode, useContext, useState} from "react";

type Board = boolean[][];

interface GameContextType {
    board: Board;
    relations: Relations;
    makeRelation: (move: MovePropType) => void;
    isValid: (move: MovePropType, cp: string) => boolean;
    size: number;
}

interface GameProviderProps {
    children: ReactNode;
    size?: number;
}

interface MovePropType {
    firstDot: {
        row: number;
        col: number;
    },
    secondDot: {
        row: number;
        col: number;
    }
}

type Relations = Record<string, { row: number; col: number }>;


const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({children, size}: GameProviderProps) => {
    const [board, setBoard] = useState<Board>(Array(size).fill(false).map(() => Array(size).fill(false)));
    const [relations, setRelations] = useState<Relations>({});


    const makeRelation = ({firstDot, secondDot}: MovePropType): void => {
        const newBoard = [...board];
        const newRelations = {...relations};

        newRelations[`${firstDot.row},${firstDot.col}`] = {row: secondDot.row, col: secondDot.col};
        newBoard[firstDot.row][firstDot.col] = true;
        newBoard[secondDot.row][secondDot.col] = true;

        setRelations(newRelations);
        setBoard(newBoard);
    }

    const isValid = ({firstDot, secondDot}: MovePropType, cp: string): boolean => {

        if(!isLimit({firstDot, secondDot})) {{
            console.log(firstDot)
            console.log(secondDot)
            return false;
        }}

        if(isExistLine({firstDot, secondDot})){
            return false;
        }

        if(!isDistanceGood({firstDot, secondDot})) {
            return false;
        }

        if(!isCurrentPlayer({firstDot, secondDot}, cp)) {
            return false;
        }

        return true;
    }

    const isLimit = ({firstDot, secondDot}: MovePropType): boolean => {
        return firstDot.row >= 0 &&
            firstDot.col >= 0 &&
            secondDot.row >= 0 &&
            secondDot.col >= 0 &&
            firstDot.row < size &&
            firstDot.col < size &&
            secondDot.row < size &&
            secondDot.col < size
    }

    const isDistanceGood = ({firstDot, secondDot}: MovePropType): boolean => {

        if(firstDot.row === secondDot.row && firstDot.col === secondDot.col) {
            return false
        }

        if(Math.abs(firstDot.row - secondDot.row) > 1 || Math.abs(firstDot.col - secondDot.col) > 1) {
            return false;
        }

        if(firstDot.row !== secondDot.row &&  firstDot.col !== secondDot.col) {
            return false;
        }

        return true;
    }

    const isExistLine = ({firstDot, secondDot}: MovePropType): boolean => {
        return board[firstDot.row][firstDot.col] || board[secondDot.row][secondDot.col]
    }

    const isCurrentPlayer = ({firstDot, secondDot}: MovePropType, currentPlayer: string):boolean => {
        if(currentPlayer === "red") {
            if(firstDot.col !== secondDot.col) {
                return false;
            }
        } else {
            if(firstDot.row !== secondDot.row) {
                return false;
            }
        }

        return true;
    }

    return (
        <GameContext.Provider value={{ board, relations, makeRelation, isValid, size }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};