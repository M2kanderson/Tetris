const Block = require("./block.js");


const POSS_TETRAMINOS = {
  // 0,0 0,1 0,2 0,3
  // 1,0 1,1 1,2 1,3
  // 2,0 2,1 2,2 2,3
  // 3,0 3,1 3,2 3,3

  rightHook : [

  [[0,0], [1,0], [1,1], [1,2]],
  [[0,2], [0,1], [1,1], [2,1]],
  [[1,0], [1,1], [1,2], [2,2]],
  [[2,0], [2,1], [1,1], [0,1]]
  ],

  leftHook : [

  [[1,0], [1,1], [1,2], [0,2]],
  [[0,1], [1,1], [2,1], [2,2]],
  [[1,2], [1,1], [1,0], [2,0]],
  [[2,1], [1,1], [0,1], [0,0]]
  ],

  line : [

  [[1,0], [1,1], [1,2], [1,3]],
  [[0,2], [1,2], [2,2], [3,2]],
  [[2,0], [2,1], [2,2], [2,3]],
  [[0,1], [1,1], [2,1], [3,1]]
  ],
  square : [

  [[0,1], [0,2], [1,2], [1,1]],
  [[0,2], [1,2], [1,1], [0,1]],
  [[1,2], [1,1], [0,1], [0,2]],
  [[1,1], [0,1], [0,2], [1,2]],
  ],

  // 0,0 0,1 0,2 0,3
  // 1,0 1,1 1,2 1,3
  // 2,0 2,1 2,2 2,3
  // 3,0 3,1 3,2 3,3
  ess : [

  [[1,0], [1,1], [0,1], [0,2]],
  [[0,1], [1,1], [1,2], [2,2]],
  [[1,2], [1,1], [2,1], [2,0]],
  [[2,1], [1,1], [1,0], [0,0]],
  ],
  // 0,0 0,1 0,2 0,3
  // 1,0 1,1 1,2 1,3
  // 2,0 2,1 2,2 2,3
  // 3,0 3,1 3,2 3,3
  zee : [

  [[0,0], [0,1], [1,1], [1,2]],
  [[0,2], [1,2], [1,1], [2,1]],
  [[2,2], [2,1], [1,1], [1,0]],
  [[2,0], [1,0], [1,1], [0,1]],
  ],

  tee : [

  [[1,0], [1,1], [1,2], [0,1]],
  [[0,1], [1,1], [2,1], [1,2]],
  [[1,2], [1,1], [1,0], [2,1]],
  [[2,1], [1,1], [0,1], [1,0]],
  ]
};

const TETRAMINO_COLORS = {
  rightHook: "blue",
  leftHook: "orange",
  line: "light-blue",
  square: "yellow",
  ess: "green",
  zee: "red",
  tee: "purple"
};

function _tetraminoGrid(){
  let grid = Array(4);
  for(let i = 0; i < grid.length; i++){
    grid[i]= [null,null,null,null];
  }
  return grid;
}

function _randomBlockSet(){
  let keys = Object.keys(POSS_TETRAMINOS);
  let choice = Math.floor(Math.random()*keys.length);
  let tetramino = POSS_TETRAMINOS[keys[choice]];
  let populatedTetramino = _tetraminoGrid();
  let color = TETRAMINO_COLORS[keys[choice]];
  tetramino.forEach((orientation, oIndex) =>{
    orientation.forEach((coord, cIndex) =>{
      populatedTetramino[oIndex][cIndex] = new Block(coord, color);
    });
  });
  return populatedTetramino;
}

const Tetramino = function(board){
  this.blocks = _randomBlockSet();
  this.board = board;
  this.pos = [0,3];
};

Tetramino.prototype.render = function($li){
  let blocks = this.blocks[0];
  let tetraminoPos = this.pos;
  blocks.forEach( block => {
    let pos = [block.pos[0] + tetraminoPos[0], block.pos[1] + tetraminoPos[1]];
    let color = block.color;
    const flatCoord = (pos[0] * this.board.width) + pos[1];
    $li.eq(flatCoord).addClass(color);
  });
};

Tetramino.prototype.move = function(vector){
  let yPos = this.pos[0] + vector[0];
  let xPos = this.pos[1] + vector[1];
  let newPos = [yPos, xPos];
  if(!this.board.collisionWithBlock(newPos) && this.board.withinBounds(newPos)){
    this.pos = newPos;
  }
  else if(vector[0] > 0){
    this.board.newTetramino();
  }
};

Tetramino.prototype.rotationCollisions = function(direction){
  let newOrientationBlocks = direction === "right" ?
   this.blocks[1] : this.blocks[this.blocks.length - 1];

  return newOrientationBlocks.some((block) =>{
    let pos = [block.pos[0] + this.pos[0], block.pos[1] + this.pos[1]];
    return pos[0] < 0 || pos[1] < 0
      || pos[0] >= this.board.height || pos[1] >= this.board.width
      || this.board.rotationCollisionWithBlock(pos);
  });
};

Tetramino.prototype.rotate = function(){
  if(!this.rotationCollisions("right"))
  {
    this.blocks.push(this.blocks.shift());
  }

};

Tetramino.prototype.rotateLeft = function(){
  if(!this.rotationCollisions("left"))
  {
    this.blocks.unshift(this.blocks.pop());
  }

};



module.exports = Tetramino;
