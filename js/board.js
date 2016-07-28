const Tetramino = require('./tetramino');
const Block = require('./block');

const createBoard = function(width, height){
  let grid = new Array(height);

  for (let i = 0; i < height; i++) {
    let row = [];
    for(let j = 0; j < width; j++){
      row.push(null);
    }
    grid[i] = row;
  }
  return grid;
};

const Board = function(width, height, game){
  this.width = width;
  this.height = height;
  this.game = game;
  this.blocks = [];
  this.score = 0;
  this.linesCompleted = 0;
  this.updateFallSpeed = false;
  this.removingRows = false;
  this.rowsEliminated = {};
  $(".score").text(this.score);
  this.rowCount = {0: 0, 1: 0, 2: 0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0,
                  10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0, 19:0};
  this.grid = createBoard(width, height);
  this.tetramino = new Tetramino(this);
  this.gameOver = false;
};

Board.prototype.render = function($li){
  this.tetramino.render($li);
  this.blocks.forEach((block) => {
    let pos = block.pos;
    let color = block.color;
    const flatCoord = (pos[0] * this.width) + pos[1];
    $li.eq(flatCoord).addClass(color);
  });
};

Board.prototype.flashRemovedRows = function($el){
  let $li = $el.find("li");
  $li.removeClass();
  this.blocks.forEach((block) => {
    let color;
    if(this.rowsEliminated[block.pos[0]]){
      color = "gray";
    } else{
      color = block.color;
    }
    // debugger;
    // let pos = block.pos;
    const flatCoord = (block.pos[0] * this.width) + block.pos[1];
    $li.eq(flatCoord).addClass(color);
  });
};

Board.prototype.removeRow = function(row){
  this.rowCount = {0: 0, 1: 0, 2: 0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0,
                  10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0, 19:0};

  let newBlocks =[];
  this.blocks.forEach((block) =>{
    // check if the block is in the row to be eliminated
    if(block.pos[0] !== row){
      // then we'll check to see if it's above the row that is to be elimated
      if(block.pos[0] < row){
        block.pos[0] += 1;
      }
      this.rowCount[block.pos[0]] += 1;
      newBlocks.push(block);
    }
  });
  // console.log(newBlocks.length);
  this.blocks = newBlocks;

};

Board.prototype.addBlocks = function(){
  this.tetramino.blocks[0].forEach((block) =>{
    let pos = [block.pos[0] + this.tetramino.pos[0],block.pos[1] + this.tetramino.pos[1]];
    this.grid[pos[0]][pos[1]] = block;
    let newBlock = new Block(pos, block.color);
    this.blocks.push(newBlock);
    this.rowCount[pos[0]] += 1;
  });
  // console.log(this.rowCount);
};

Board.prototype.collisionWithBlock = function(pos){
  return this.tetramino.blocks[0].some((tetBlock) =>{
    return this.blocks.some((block) =>{
      return block.pos[0] === tetBlock.pos[0] + pos[0] && block.pos[1] === tetBlock.pos[1] + pos[1];
    });
  });

};

Board.prototype.rotationCollisionWithBlock = function(pos){
    return this.blocks.some((block) =>{
      return block.pos[0] === pos[0] && block.pos[1] === pos[1];
    });
};

Board.prototype.withinBounds = function(pos){
  return this.tetramino.blocks[0].every((block) =>{
    let nextBlockPos = [block.pos[0] +pos[0], block.pos[1] + pos[1]];
    return nextBlockPos[1] >= 0 && nextBlockPos[1] < this.width &&
     nextBlockPos[0] >= 0 && nextBlockPos[0] < this.height;
  });
};

// Board.prototype.fallingCollision = function(){
//   return this.tetramino.blocks[0].some((block) =>{
//     let nextBlockPos = [block.pos[0] +this.tetramino.pos[0] + 1, block.pos[1] +this.tetramino.pos[1]];
//     return nextBlockPos[0] >= this.height || this.collisionWithBlock(nextBlockPos);
//   });
// };
//
// Board.prototype.checkCollisions = function(delta){
//   if(delta[0] > 0){
//     if(this.fallingCollision()){
//       this.tetramino.blocks[0].forEach((block) =>{
//         let pos = [block.pos[0] + this.tetramino.pos[0],block.pos[1] + this.tetramino.pos[1]];
//         this.grid[pos[0]][pos[1]] = block;
//         let newBlock = new Block(pos, block.color);
//         this.blocks.push(newBlock);
//       });
//       this.tetramino = new Tetramino(this);
//     }
//   }
// };


Board.prototype.checkGameOver = function(newTetramino){
  this.gameOver = newTetramino.blocks[0].some((newBlock) =>{
    return this.blocks.some((oldBlock) =>{
      return newBlock.pos[0] + newTetramino.pos[0] === oldBlock.pos[0]
       && newBlock.pos[1] + + newTetramino.pos[1] === oldBlock.pos[1];
    });
  });
};

Board.prototype.newTetramino = function(){
  this.addBlocks();
  let rowsEliminated = [];
  Object.keys(this.rowCount).forEach((row) =>{
    if(parseInt(this.rowCount[row]) >= this.width){
      this.rowsEliminated[row]= true;
      // window.setTimeout(this.removeRow.bind(parseInt(row)), 700);
    }
  });
  let rowElimCount = Object.keys(this.rowsEliminated).length;
  if(rowElimCount > 0){
    this.removingRows = true;
  }
  if(this.removingRows){
    this.game.gameView.paused = true;
    this.flashRemovedRows(this.game.rootEl);
    window.setTimeout(()=>{
      Object.keys(this.rowsEliminated).forEach((row) =>{
        this.removeRow(parseInt(row));
      });
      this.game.gameView.paused = false;
      this.removingRows = false;
      this.rowsEliminated = {};

      this.score += 100*rowElimCount*rowElimCount;
      this.linesCompleted += rowElimCount;
      if(rowElimCount > 0 &&
        (this.linesCompleted - rowElimCount) % 10 > this.linesCompleted % 10){
        this.updateFallSpeed = true;
      }
      $('.lines').text(this.linesCompleted);
      $('.score').text(this.score);
      this.game.newTetramino();
    }, 600);
  } else {
    this.game.newTetramino();
  }


};

module.exports = Board;
