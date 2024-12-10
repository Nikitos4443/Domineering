/* eslint-disable */
import {createContext, ReactNode, useContext, useState} from "react";

type Board = boolean[][];

interface GameContextType {
    board: Board;
    relations: Relations;
    makeRelation: (move: MovePropType) => void;
    size: number;
}

interface GameProviderProps {
    children: ReactNode;
    size: number;
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

    return (
        <GameContext.Provider value={{ board, relations, makeRelation, size }}>
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