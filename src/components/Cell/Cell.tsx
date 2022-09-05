import React from "react";
import cx from "clsx";
import { ICellValue } from "../../types";
import styles from "./Cell.module.scss";

interface ICellProps {
  value: ICellValue;
  onClick(): void;
}

const getValue = (value: ICellValue) => {
  if (!value.isRevealed) {
    return null;
  }
  if (value.isHole) {
    return "⚫";
  }
  if (value.surrounding === 0) {
    return null;
  }
  return value.surrounding;
};

const Cell: React.FC<ICellProps> = ({ value, onClick }) => {
  const className = cx(styles.cell, {
    [styles.hidden]: !value.isRevealed,
    [styles.hole]: value.isHole,
  });

  return (
    <div onClick={onClick} className={className}>
      {getValue(value)}
    </div>
  );
};

export default Cell;
