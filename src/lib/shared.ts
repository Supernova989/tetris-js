function toPx(num: number): string {
  return (num || 0) + "px";
}

enum CELL_TYPES {
  EMPTY = 0,
  OCCUPIED = 1
}
