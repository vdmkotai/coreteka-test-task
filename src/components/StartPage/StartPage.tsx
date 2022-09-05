import React from "react";
import {
  IBoardData,
  MIN_HEIGHT,
  MIN_HOLES,
  MIN_WIDTH,
  MAX_WIDTH,
  MAX_HEIGHT,
} from "../App";
import styles from "./StartPage.module.scss";

interface IStartPageProps {
  boardData: IBoardData;
  onChange(state: IBoardData): void;
  onStartClick(): void;
}

const getMaxPossibleHolesCount = (
  width: number,
  height: number,
  holesCount: number
) =>
  holesCount / (width * height) > 0.9
    ? Math.floor(holesCount * 0.9)
    : holesCount;

const StartPage: React.FC<IStartPageProps> = ({
  boardData,
  onChange,
  onStartClick,
}) => {
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onChange({ ...boardData, [e.target.id]: Number(value) });
  };

  const isValid = () =>
    !(
      boardData.width < MIN_WIDTH ||
      boardData.width > MAX_WIDTH ||
      boardData.height < MIN_HEIGHT ||
      boardData.height > MAX_HEIGHT ||
      boardData.holesCount < MIN_HOLES ||
      boardData.holesCount >
        getMaxPossibleHolesCount(
          boardData.width,
          boardData.height,
          boardData.holesCount
        )
    );

  return (
    <div className={styles.startPageContainer}>
      <label htmlFor="width" className={styles.label}>
        Width{" "}
        <span className={styles.info}>
          (min: {MIN_WIDTH}, max: {MAX_WIDTH}):
        </span>
        <input
          id="width"
          type="number"
          value={boardData.width}
          className={styles.input}
          min={MIN_WIDTH}
          max={MAX_WIDTH}
          onChange={onValueChange}
        />
      </label>

      <label htmlFor="height" className={styles.label}>
        Height{" "}
        <span className={styles.info}>
          (min: {MIN_HEIGHT}, max: {MAX_HEIGHT}):
        </span>
        <input
          id="height"
          type="number"
          value={boardData.height}
          className={styles.input}
          min={MIN_HEIGHT}
          max={MAX_HEIGHT}
          onChange={onValueChange}
        />
      </label>

      <label htmlFor="holesCount" className={styles.label}>
        Holes{" "}
        <span className={styles.info}>
          (min: {MIN_HOLES}, max: 90% of cells):
        </span>
        <input
          id="holesCount"
          type="number"
          value={boardData.holesCount}
          className={styles.input}
          min={MIN_HOLES}
          onChange={onValueChange}
        />
      </label>
      <button
        className={styles.button}
        onClick={onStartClick}
        disabled={!isValid()}
      >
        Start game
      </button>
    </div>
  );
};

export default StartPage;
