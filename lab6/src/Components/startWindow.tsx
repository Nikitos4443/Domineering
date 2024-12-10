import React, { useState } from 'react';
import styles from './StartScreen.module.css';

interface StartScreenProps {
    onStartGame: (difficulty: number) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
    const [difficulty, setDifficulty] = useState<number | null>(null);

    const handleStartClick = () => {
        if (difficulty !== null) {
            onStartGame(difficulty);
        }
    };

    return (
        <div className={styles['start-screen']}>
            <h1 className={styles['title']}>Choose Difficulty</h1>
            <div className={styles['difficulty-options']}>
                <button
                    className={`${styles['difficulty-btn']} ${difficulty === -1 ? styles['active'] : ''}`}
                    onClick={() => setDifficulty(-1)}
                >
                    Easy
                </button>
                <button
                    className={`${styles['difficulty-btn']} ${difficulty === 0 ? styles['active'] : ''}`}
                    onClick={() => setDifficulty(0)}
                >
                    Medium
                </button>
                <button
                    className={`${styles['difficulty-btn']} ${difficulty === 1 ? styles['active'] : ''}`}
                    onClick={() => setDifficulty(1)}
                >
                    Hard
                </button>
            </div>
            <button className={styles['start-btn']} onClick={handleStartClick}>
                Start Game
            </button>
        </div>
    );
};

export default StartScreen;
