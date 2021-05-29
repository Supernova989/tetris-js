function toPx(num: number): string {
  return (num || 0) + "px";
}

enum CELL_TYPES {
  EMPTY = 0,
  OCCUPIED = 1
}

interface SceneProps {
  root_id: string,
  brick_size: number,
  scene_width: number,
  scene_height: number,
}

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

function createShape(x: number, y: number) {
  const shapes = [LineShape, SquareShape, ZShape, InvertedZShape, TShape, LShape, InvertedLShape];
  
  const index = Math.ceil(Math.random() * shapes.length) - 1;
  return new shapes[index](Math.floor(x), Math.ceil(y));
}

type Row = Array<CELL_TYPES>;
type Matrix = Row[];

class Scene {
  scores: number;
  root_node: HTMLElement;
  brick_size: number;
  scene_width: number;
  scene_height: number;
  field: HTMLElement;
  matrix: Matrix;
  activeShape: Shape;
  renderInterval: NodeJS.Timeout;
  downshiftInterval: NodeJS.Timeout;
  
  constructor(props: SceneProps) {
    const {
      root_id,
      brick_size,
      scene_width,
      scene_height
    } = props;
    this.root_node = document.getElementById(root_id);
    this.brick_size = brick_size;
    this.scene_width = scene_width;
    this.scene_height = scene_height;
    
    
    this.handleControl = this.handleControl.bind(this);
    this.downshift = this.downshift.bind(this);
    this.render = this.render.bind(this);
    
    
    this.init();
    
    this.renderInterval = setInterval(() => this.render(this.activeShape), 35);
    
  }
  
  init() {
    this.scores = 0;
    // clear
    this.root_node.innerHTML = "";
    // background & field dimensions
    this.field = document.createElement("div");
    this.field.classList.add("game-field");
    this.field.style.width = toPx(this.scene_width * this.brick_size);
    this.field.style.height = toPx(this.scene_height * this.brick_size);
    this.root_node.append(this.field);
    this.populateScene();
    this.downshiftInterval = setInterval(this.downshift, 300);
    window.addEventListener("keypress", this.handleControl);
  }
  
  handleControl(e: KeyboardEvent) {
    let newPositionX;
    let newPositionY;
    if (!this.activeShape) {
      return;
    }
    switch (e.key.toLowerCase()) {
      case "w": {
        const tmp = this.activeShape.revolve(false);
  
        let tmpW = 0;
  
        for (let i = 0; i < tmp.length; i++) {
          for (let j = 0; j < tmp[i].length; j++) {
            if (tmpW < j) {
              tmpW = j;
            }
          }
        }
        tmpW += 1;
        for (let y = 0; y < tmp.length; y++) {
          for (let x = 0; x < tmpW; x++) {
            if (this.activeShape.getX() + x >= this.scene_width || this.activeShape.getY() + y >= this.scene_height) {
              return;
            }
            if (this.matrix[this.activeShape.getY() + y][this.activeShape.getX() + x] === CELL_TYPES.OCCUPIED) {
              return;
            }
          }
        }
        this.activeShape.revolve(true);
        break;
      }
      case "a": {
        newPositionX = this.activeShape.getX() - 1;
        newPositionY = this.activeShape.getY();
        
        if (newPositionX < 0) {
          return;
        }
        let brickCollision = false;
  
        for (let y = 0; y < this.activeShape.getHeight(); y++) {
          for (let x = 0; x < this.activeShape.getWidth(); x++) {
            if (this.matrix[this.activeShape.getY() + y][newPositionX + x] === CELL_TYPES.OCCUPIED) {
              brickCollision = true;
            }
          }
        }
        if (brickCollision) {
          return;
        }
        this.activeShape.setX(newPositionX);
        break;
      }
      
      case "s": {
        newPositionX = this.activeShape.getX();
        newPositionY = this.activeShape.getY() + 1;
        if (newPositionY + this.activeShape.getHeight() > this.scene_height - 1) {
          return;
        }
        let brickCollision = false;
        for (let y = 0; y < this.activeShape.getHeight(); y++) {
          for (let x = 0; x < this.activeShape.getWidth(); x++) {
            if (this.matrix[newPositionY + y][newPositionX + x] === CELL_TYPES.OCCUPIED) {
              brickCollision = true;
            }
          }
        }
        if (brickCollision) {
          return;
        }
        this.activeShape.setY(newPositionY);
        break;
      }
      
      case "d": {
        newPositionX = this.activeShape.getX() + 1;
        newPositionY = this.activeShape.getY();
        
        if (newPositionX + this.activeShape.getWidth() > this.scene_width) {
          return;
        }
        let brickCollision = false;
  
        for (let y = 0; y < this.activeShape.getHeight(); y++) {
          for (let x = 0; x < this.activeShape.getWidth(); x++) {
            if (this.matrix[this.activeShape.getY() + y][newPositionX + x] === CELL_TYPES.OCCUPIED) {
              brickCollision = true;
            }
          }
        }
        if (brickCollision) {
          return;
        }
        this.activeShape.setX(newPositionX);
        break;
      }
    }
  }
  
  downshift() {
    if (!this.activeShape) {
      this.activeShape = createShape(Math.floor(this.scene_width / 2 - 1), 0);
    }
    
    const isBorderCollision = this.activeShape.getY() + this.activeShape.getHeight() + 1 > this.scene_height;
    let isBrickCollision = false;
    
    for (let y = 0; y < this.activeShape.getHeight(); y++) {
      for (let x = 0; x < this.activeShape.getWidth(); x++) {
        if (!isBorderCollision && this.activeShape.getBody()[y][x] === CELL_TYPES.OCCUPIED && this.matrix[this.activeShape.getY() + y + 1 ][this.activeShape.getX() + x] === CELL_TYPES.OCCUPIED) {
          isBrickCollision = true;
        }
      }
    }
    
    if (isBorderCollision || isBrickCollision) {
      for (let y = 0; y < this.activeShape.getHeight(); y++) {
        for (let x = 0; x < this.activeShape.getWidth(); x++) {
          if (this.activeShape.getBody()[y][x] === CELL_TYPES.OCCUPIED) {
            this.matrix[this.activeShape.getY() + y][this.activeShape.getX() + x] = CELL_TYPES.OCCUPIED;
          }
        }
      }
      this.activeShape = createShape(this.scene_width / 2 - 1, 0);
    }
    
    // Check for built lines
    for (let line = 0; line < this.scene_height; line++) {
      let counter = 0;
      for (let cell = 0; cell < this.scene_width; cell++) {
        if (this.matrix[line][cell] === CELL_TYPES.OCCUPIED) {
          counter++;
        }
      }
      if (counter === this.scene_width) {
        this.scores += 1000;
        console.log("Score!!! Your scores now: ", this.scores);
        for (let _line = line - 1; _line > 0; _line--) {
          for (let _cell = 0; _cell < this.scene_width; _cell++) {
            this.matrix[_line + 1][_cell] = this.matrix[_line][_cell];
          }
        }
      }
    }
    
    
    this.activeShape.setY(this.activeShape.getY() + 1);
  }
  
  /**
   * Inits matrix with empty values
   */
  populateScene() {
    this.matrix = [];
    for (let line = 0; line < this.scene_height; line++) {
      const row: Row = [];
      for (let cell = 0; cell < this.scene_width; cell++) {
        row.push(CELL_TYPES.EMPTY);
      }
      this.matrix.push(row);
    }
  }
  
  render(shape?: Shape) {
    this.field.innerHTML = "";
    for (let line = 0; line < this.scene_height; line++) {
      for (let cell = 0; cell < this.scene_width; cell++) {
        let c = document.createElement("div");
        c.classList.add("cell");
        
        c.style.left = toPx(cell * this.brick_size);
        c.style.top = toPx(line * this.brick_size);
        c.style.width = toPx(this.brick_size);
        c.style.height = toPx(this.brick_size);
        
        switch (this.matrix[line][cell]) {
          case CELL_TYPES.EMPTY: {
            c.classList.add("empty");
            break;
          }
          case CELL_TYPES.OCCUPIED: {
            c.classList.add("occupied");
            break;
          }
        }
        
        this.field.append(c);
      }
    }
    
    if (shape && shape.getBody()) {
      for (let y = 0; y < shape.getHeight(); y++) {
        for (let x = 0; x < shape.getWidth(); x++) {
          if (this.matrix[shape.getY() + y][shape.getX() + x] === CELL_TYPES.OCCUPIED) {
            continue;
          }
          let c = document.createElement("div");
          c.classList.add("cell");
          
          c.style.left = toPx(x * this.brick_size + shape.getX() * this.brick_size);
          c.style.top = toPx(y * this.brick_size + shape.getY() * this.brick_size);
          c.style.width = toPx(this.brick_size);
          c.style.height = toPx(this.brick_size);
          
          switch (shape.getBody()[y][x]) {
            case CELL_TYPES.EMPTY: {
              c.classList.add("empty");
              break;
            }
            case CELL_TYPES.OCCUPIED: {
              c.classList.add("occupied");
              break;
            }
          }
          this.field.append(c);
        }
      }
      
    }
    
    
  }
  
}

export default Scene;
