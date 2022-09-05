import React from "react";
import { IBoardData } from "../App";
import {
  createEmptyArray,
  getDeepCopy,
  getHiddenCells,
  setHoles,
  TBoardStateData,
} from "../../utils";
import { ICellValue } from "../../types";
import Cell from "../Cell";
import styles from "./BoardPage.module.scss";

interface IBoardPageProps {
  boardData: IBoardData;
  onRestartClick(): void;
}

const BoardPage: React.FC<IBoardPageProps> = ({
  boardData,
  onRestartClick,
}) => {
  // looks for surrounding cells and returns them
  const traverseBoard = (x: number, y: number, data: TBoardStateData) => {
    const el = [];

    // up
    if (x > 0) {
      el.push(data[x - 1][y]);
    }

    // down
    if (x < boardData.height - 1) {
      el.push(data[x + 1][y]);
    }

    // left
    if (y > 0) {
      el.push(data[x][y - 1]);
    }

    // right
    if (y < boardData.width - 1) {
      el.push(data[x][y + 1]);
    }

    // top left
    if (x > 0 && y > 0) {
      el.push(data[x - 1][y - 1]);
    }

    // top right
    if (x > 0 && y < boardData.width - 1) {
      el.push(data[x - 1][y + 1]);
    }

    // bottom right
    if (x < boardData.height - 1 && y < boardData.width - 1) {
      el.push(data[x + 1][y + 1]);
    }

    // bottom left
    if (x < boardData.height - 1 && y > 0) {
      el.push(data[x + 1][y - 1]);
    }

    return el;
  };

  /* Get number of surrounding holes for each board cell */
  const getSurroundingCells = (
    data: TBoardStateData,
    height: number,
    width: number
  ) => {
    const updatedData = getDeepCopy(data);

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (!data[i][j].isHole) {
          let hole = 0;
          const area = traverseBoard(data[i][j].x, data[i][j].y, data);
          area.forEach((value: ICellValue) => {
            if (value.isHole) {
              hole++;
            }
          });
          if (hole === 0) {
            updatedData[i][j].isEmpty = true;
          }
          updatedData[i][j].surrounding = hole;
        }
      }
    }

    return updatedData;
  };

  const initBoard = (boardData: IBoardData) => {
    const emptyBoard = createEmptyArray(boardData.height, boardData.width);
    const dataWithHoles = setHoles(
      emptyBoard,
      boardData.height,
      boardData.width,
      boardData.holesCount
    );
    return getSurroundingCells(
      dataWithHoles,
      boardData.height,
      boardData.width
    );
  };

  const [boardState, setBoardState] = React.useState<TBoardStateData>(
    initBoard(boardData)
  );
  const [status, setStatus] = React.useState("In progress");
  // const [holesCount, setHolesCount] = React.useState(boardData.holesCount);

  // reveals the whole board
  const revealBoard = () => {
    const updatedData: TBoardStateData = getDeepCopy(boardState);

    updatedData.forEach((dataRow) => {
      dataRow.forEach((dataItem) => {
        dataItem.isRevealed = true;
      });
    });

    setBoardState(updatedData);
  };

  /* reveal logic for empty cell */
  const revealEmpty = (x: number, y: number, data: TBoardStateData) => {
    const updatedData = data;

    const area = traverseBoard(x, y, data);

    area.forEach((value) => {
      if (!value.isRevealed && (value.isEmpty || !value.isHole)) {
        data[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          revealEmpty(value.x, value.y, data);
        }
      }
    });

    return updatedData;
  };

  const handleCellClick = (x: number, y: number) => {
    // check if revealed. return if true.
    if (boardState[x][y].isRevealed) {
      return null;
    }

    // check if the cell has a hole
    if (boardState[x][y].isHole) {
      setStatus("You lost!");
      revealBoard();
      return;
    }

    let updatedData: TBoardStateData = getDeepCopy(boardState);
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = revealEmpty(x, y, updatedData);
    }

    if (getHiddenCells(updatedData).length === boardData.holesCount) {
      revealBoard();
      setStatus("You win!");
      return;
    }

    setBoardState(updatedData);
  };

  return (
    <div>
      <div className={styles.game}>
        <div className={styles.gameInfo}>
          <h1 className={styles.info}>{status}</h1>
          <button onClick={onRestartClick}>Restart</button>
        </div>

        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${boardData.width}, 1fr)`,
            gridTemplateRows: `repeat(${boardData.height}, 1fr)`,
          }}
        >
          {boardState.map((dataRow) =>
            dataRow.map((dataItem) => (
              <Cell
                key={dataItem.x * dataRow.length + dataItem.y}
                onClick={() => handleCellClick(dataItem.x, dataItem.y)}
                value={dataItem}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
