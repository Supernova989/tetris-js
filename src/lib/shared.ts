export function toPx(num: number): string {
  return (num || 0) + "px";
}

export enum CELL_TYPES {
  EMPTY = 0,
  OCCUPIED = 1
}
