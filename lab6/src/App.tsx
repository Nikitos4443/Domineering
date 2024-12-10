import './App.module.css';
import Field from "./Components/Field.tsx";
import styles from './App.module.css';
import React, { useState } from "react";
import { GameProvider } from "./Components/GameProcessProvider.tsx";
import StartScreen from "./Components/startWindow.tsx";

const App: React.FC = () => {
    const boardSize = 7;
    const [isStart, setIsStart] = useState(false);
    const [difficulty, setDifficulty] = useState<number>(-1);

    const handleStartGame = (selectedDifficulty: number) => {
        setDifficulty(selectedDifficulty);
        setIsStart(true);
    };

    return (
        <div className={styles['back']}>
            {!isStart ? (
                <StartScreen onStartGame={handleStartGame} />
            ) : (
                <div className={styles['main-container']}>
                    <GameProvider size={boardSize}>
                        <Field difficulty={difficulty} />
                    </GameProvider>
                </div>
            )}
        </div>
    );
};

export default App;