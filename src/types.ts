export interface ICellValue {
  isEmpty: boolean;
  isRevealed: boolean;
  isHole: boolean;
  surrounding: number;
  x: number;
  y: number;
}
