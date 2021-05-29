import {cloneDeep} from "lodash";
import {LineShape, SquareShape, ZShape, InvertedZShape, TShape, LShape, InvertedLShape, Shape} from "../models/shapes";
import { CELL_TYPES, toPx } from "./shared";

interface SceneProps {
  root_id: string,
  brick_size: number,
  scene_width: number,
  scene_height: number,
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
  preview: HTMLElement;
  scoreCounter: HTMLElement;
  matrix: Matrix;
  activeShape: Shape;
  nextShape: Shape;
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
  
    if (!this.nextShape) {
      this.nextShape = createShape(Math.floor(this.scene_width / 2 - 1), 0);
    }
    if (!this.activeShape) {
      this.activeShape = createShape(Math.floor(this.scene_width / 2 - 1), 0);
    }
    
    // clear
    this.root_node.innerHTML = "";
    
    const container = document.createElement("div");
    container.classList.add("container");
    
    const sidebar = document.createElement("div");
    sidebar.classList.add("sidebar");
    const sidebarTop = document.createElement("div");
    const sidebarBottom = document.createElement("div");
  //  sidebarTop.classList.add("sidebar");
    
    sidebar.append(sidebarTop);
    sidebar.append(sidebarBottom);
    this.scoreCounter = document.createElement("div");
    this.scoreCounter.classList.add("score");
    const scoreLabel = document.createElement("div");
    scoreLabel.innerText = "SCORE:";
  
    this.preview = document.createElement("div");
    this.preview.classList.add("preview-field");
    this.preview.style.width = toPx(4 * this.brick_size);
    this.preview.style.height = toPx(4 * this.brick_size);
    
    sidebarTop.append(this.preview);
    sidebarTop.append(scoreLabel);
    sidebarTop.append(this.scoreCounter);
  
  
    this.field = document.createElement("div");
    this.field.classList.add("game-field");
    this.field.style.width = toPx(this.scene_width * this.brick_size);
    this.field.style.height = toPx(this.scene_height * this.brick_size);
  
    
    container.append(this.field);
    container.append(sidebar);
    this.root_node.append(container);
    this.populateScene();
    
    this.downshiftInterval = setInterval(this.downshift, 300);
    this.scoreCounter.innerText = this.scores.toString();
    window.addEventListener("keypress", this.handleControl);
  }
  
  handleControl(e: KeyboardEvent) {
    let newPositionX;
    let newPositionY;
    if (!this.activeShape) {
      return;
    }
    switch (e.code) {
      case "KeyW": {
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
      case "KeyA": {
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
      
      case "KeyS": {
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
      
      case "KeyD": {
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
    const isBorderCollision = this.activeShape.getY() + this.activeShape.getHeight() + 1 > this.scene_height;
    let isBrickCollision = false;
    
    for (let y = 0; y < this.activeShape.getHeight(); y++) {
      for (let x = 0; x < this.activeShape.getWidth(); x++) {
        if (!isBorderCollision && this.activeShape.getBody()[y][x] === CELL_TYPES.OCCUPIED && this.matrix[this.activeShape.getY() + y + 1 ][this.activeShape.getX() + x] === CELL_TYPES.OCCUPIED) {
          isBrickCollision = true;
        }
      }
    }
    
    let gameover = false;
    
    for (let cell = 0; cell < this.scene_width; cell++) {
      if (this.matrix[0][cell] === CELL_TYPES.OCCUPIED) {
        gameover = true;
      }
    }
    
    if (gameover) {
      clearInterval(this.downshiftInterval);
      const screen = document.createElement("div");
      const label = document.createElement("div");
      label.classList.add("text");
      label.innerText = "Game Over"
      screen.append(label);
      screen.id = "gameover";
      document.body.append(screen);
      return;
    }
    
    if (isBorderCollision || isBrickCollision) {
      for (let y = 0; y < this.activeShape.getHeight(); y++) {
        for (let x = 0; x < this.activeShape.getWidth(); x++) {
          if (this.activeShape.getBody()[y][x] === CELL_TYPES.OCCUPIED) {
            this.matrix[this.activeShape.getY() + y][this.activeShape.getX() + x] = CELL_TYPES.OCCUPIED;
          }
        }
      }
      this.activeShape = cloneDeep(this.nextShape);
      this.nextShape = createShape(this.scene_width / 2 - 1, -1);
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
        this.scoreCounter.innerText = this.scores.toString();
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
    this.preview.innerHTML = "";
  
    let wrap = document.createElement("div");
    wrap.classList.add("wrap");
    
    if (this.nextShape && this.nextShape.getBody()) {
      for (let y = 0; y < this.nextShape.getHeight(); y++) {
        for (let x = 0; x < this.nextShape.getWidth(); x++) {
          if (this.nextShape.getBody()[y][x] !== CELL_TYPES.OCCUPIED) {
            continue;
          }
          
          let c = document.createElement("div");
          c.classList.add("cell");
          c.style.left = toPx(x * this.brick_size );
          c.style.top = toPx(y * this.brick_size);
          c.style.width = toPx(this.brick_size);
          c.style.height = toPx(this.brick_size);
          c.classList.add("occupied");
  
          wrap.append(c);
        }
      }
      wrap.style.width = toPx(this.nextShape.getWidth() * this.brick_size);
      wrap.style.height = toPx(this.nextShape.getHeight() * this.brick_size);
      this.preview.append(wrap);
    }
    
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
