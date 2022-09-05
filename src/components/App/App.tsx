import React from "react";

import StartPage from "../StartPage";
import BoardPage from "../BoardPage";

import styles from "./App.module.css";

export interface IBoardData {
  width: number;
  height: number;
  holesCount: number;
}

export const MIN_WIDTH = 8;
export const MIN_HEIGHT = 8;
export const MAX_WIDTH = 25;
export const MAX_HEIGHT = 25;
export const MIN_HOLES = 1;

const initialBoardData: IBoardData = {
  width: MIN_WIDTH,
  height: MIN_HEIGHT,
  holesCount: MIN_HOLES,
};

const App: React.FC = () => {
  const [step, setStep] = React.useState(0);

  const [boardData, setBoardData] =
    React.useState<IBoardData>(initialBoardData);

  const handleStartClick = () => {
    setStep(1);
  };

  const handleRestartClick = () => {
    setBoardData(initialBoardData);
    setStep(0);
  };

  return (
    <div className={styles.app}>
      {step === 0 && (
        <StartPage
          boardData={boardData}
          onChange={setBoardData}
          onStartClick={handleStartClick}
        />
      )}
      {step === 1 && (
        <BoardPage boardData={boardData} onRestartClick={handleRestartClick} />
      )}
    </div>
  );
};

export default App;
