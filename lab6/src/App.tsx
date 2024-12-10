import './App.module.css'
import Field from "./Components/Field.tsx";
import styles from './App.module.css'
import React from "react";
import {GameProvider} from "./Components/GameProcessProvider.tsx";

const App: React.FC = () => {
    const boardSize = 7;

    return (
        <>
            <div className={styles['main-container']}>
                <GameProvider size={boardSize}>
                    <Field></Field>
                </GameProvider>
            </div>
        </>
    )
}

export default App
