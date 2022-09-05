// get random number given a dimension
import { ICellValue } from "../types";

export type TBoardStateData = ICellValue[][];

export const getDeepCopy = (data: TBoardStateData) =>
  data.map((arr) => arr.slice());

/* Get random number given a dimension */
export const getRandomNumber = (dimension: number) =>
  Math.floor(Math.random() * 1000 + 1) % dimension;

export const createEmptyArray = (height: number, width: number) => {
  let data = [] as TBoardStateData;

  for (let i = 0; i < height; i++) {
    data.push([]);
    for (let j = 0; j < width; j++) {
      data[i][j] = {
        x: i,
        y: j,
        isHole: false,
        surrounding: 0,
        isRevealed: false,
        isEmpty: false,
      };
    }
  }
  return data;
};

/* Plant holes on the board */
export const setHoles = (
  data: TBoardStateData,
  height: number,
  width: number,
  holesCount: number
) => {
  const updatedData: TBoardStateData = getDeepCopy(data);
  let holesMade = 0;

  while (holesMade < holesCount) {
    const randomX = getRandomNumber(height);
    const randomY = getRandomNumber(width);

    if (!updatedData[randomX][randomY].isHole) {
      updatedData[randomX][randomY].isHole = true;
      holesMade++;
    }
  }

  return updatedData;
};

/* Get hidden cells */
export const getHiddenCells = (data: TBoardStateData) => {
  let hiddenCellArray = [] as ICellValue[];

  data.forEach((dataRow) => {
    dataRow.forEach((dataItem) => {
      if (!dataItem.isRevealed) {
        hiddenCellArray.push(dataItem);
      }
    });
  });

  return hiddenCellArray;
};
