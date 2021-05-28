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
  
  set setX(value: number) {
    this.x = value;
  }
  
  set setY(value: number) {
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
    console.log("this.bricks", this.bricks);
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

function createShape(x: number, y: number) {
  const shapes = [LineShape, SquareShape];
  
  const index = Math.ceil(Math.random() * shapes.length) - 1;
  return new shapes[index](x, y);
}

type Row = Array<CELL_TYPES>;
type Matrix = Row[];

class Scene {
  root_node: HTMLElement;
  brick_size: number;
  scene_width: number;
  scene_height: number;
  field: HTMLElement;
  matrix: Matrix;
  activeShape: Shape;
  
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
    this.init();
    this.renderCells();
  }
  
  init() {
    // clear
    this.root_node.innerHTML = "";
    // background & field dimensions
    this.field = document.createElement("div");
    this.field.classList.add("game-field");
    this.field.style.width = toPx(this.scene_width * this.brick_size);
    this.field.style.height = toPx(this.scene_height * this.brick_size);
    this.root_node.append(this.field);
    this.populateScene();
    
    setTimeout(() => {
      this.activeShape = createShape(Math.floor(this.scene_width / 2), 0);
      console.log("=> " + this.activeShape);
      this.renderCells(this.activeShape);
      
      
    }, 1000);
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
  
  renderCells(shape?: Shape) {
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
    
    if (shape) {
      console.log(shape);
      for (let y = 0; y < shape.getHeight(); y++) {
        for (let x = 0; x < shape.getWidth(); x++) {
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
