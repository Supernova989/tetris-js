
abstract class Shape {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected bricks: Array<Array<CELL_TYPES>>;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  setX(value: number): void {
    this.x = value;
  }
  
  setY(value: number): void {
    this.y = value;
  }
  
  getX(): number {
    return this.x;
  }
  
  getY(): number {
    return this.y;
  }
  
  protected setWidth() {
    let max = 0;
    for (let i = 0; i < this.bricks.length; i++) {
      for (let j = 0; j < this.bricks[i].length; j++) {
        if (max < j) {
          max = j;
        }
      }
    }
    this.width = max + 1;
  }
  
  protected setHeight() {
    this.height = this.bricks.length;
  }
  
  getWidth(): number {
    return this.width;
  }
  
  getHeight(): number {
    return this.height;
  }
  
  getBody(): Array<Array<CELL_TYPES>> {
    return this.bricks;
  }
  
  revolve(commit?: boolean): Array<Array<CELL_TYPES>> {
    const w = this.bricks.length;
    const h = this.bricks[0].length;
    let b:  Array<Array<CELL_TYPES>> = new Array(h);
    
    for (let y = 0; y < h; y++) {
      b[y] = new Array(w);
      
      for (let x = 0; x < w; x++) {
        b[y][x] = this.bricks[w - 1 - x][y];
      }
    }
    
    if (commit) {
      this.bricks = b;
      this.setWidth();
      this.setHeight();
    }
    return b;
  }
  toString() {
    return "I am a shape";
  }
}


class LineShape extends Shape {
  bricks = [[
    CELL_TYPES.OCCUPIED,
    CELL_TYPES.OCCUPIED,
    CELL_TYPES.OCCUPIED,
    CELL_TYPES.OCCUPIED
  ]];
  
  constructor(x: number, y: number) {
    super(x, y);
    this.setWidth();
    this.setHeight();
  }
  
  toString() {
    return "I am a line";
  }
}

class SquareShape extends Shape {
  bricks = [
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED
    ],
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED
    ]
  ];
  
  constructor(x: number, y: number) {
    super(x, y);
    this.setWidth();
    this.setHeight();
    
  }
  
  toString() {
    return "I am a square";
  }
}

class TShape extends Shape {
  bricks = [
    [
      CELL_TYPES.EMPTY,
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.EMPTY
    ],
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED
    ]
  ];
  
  constructor(x: number, y: number) {
    super(x, y);
    this.setWidth();
    this.setHeight();
    
  }
  
  toString() {
    return "I am a T-shape";
  }
}

class LShape extends Shape {
  bricks = [
    [
      CELL_TYPES.EMPTY,
      CELL_TYPES.EMPTY,
      CELL_TYPES.OCCUPIED,
    
    ],
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED
    ]
  ];
  
  constructor(x: number, y: number) {
    super(x, y);
    this.setWidth();
    this.setHeight();
    
  }
  
  toString() {
    return "I am an L-shape";
  }
}

class InvertedLShape extends Shape {
  bricks = [
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.EMPTY,
      CELL_TYPES.EMPTY,
    ],
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED
    ]
  ];
  
  constructor(x: number, y: number) {
    super(x, y);
    this.setWidth();
    this.setHeight();
    
  }
  
  toString() {
    return "I am an inverted L-shape";
  }
}

class ZShape extends Shape {
  bricks = [
    [
      CELL_TYPES.EMPTY,
      CELL_TYPES.OCCUPIED
    ],
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED
    ],
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.EMPTY
    ],
  ];
  
  constructor(x: number, y: number) {
    super(x, y);
    this.setWidth();
    this.setHeight();
    
  }
  
  toString() {
    return "I am a z-shape";
  }
}

class InvertedZShape extends Shape {
  bricks = [
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.EMPTY
    ],
    [
      CELL_TYPES.OCCUPIED,
      CELL_TYPES.OCCUPIED
    ],
    [
      CELL_TYPES.EMPTY,
      CELL_TYPES.OCCUPIED
    ],
  ];
  
  constructor(x: number, y: number) {
    super(x, y);
    this.setWidth();
    this.setHeight();
    
  }
  
  toString() {
    return "I am an inverted z-shape";
  }
}
