const GameView = require('./game_view');
const BlockView = require('./block_view');
const Tetramino = require('./tetramino');

const Tetris = function(rootEl, blockEl){
  this.rootEl = rootEl;
  this.blockEl = blockEl;
  this.gameView = new GameView(rootEl, this);
  this.blockView = new BlockView(blockEl);
  this.currentTetramino = new Tetramino(this.gameView.board);
  this.nextTetramino = new Tetramino(this.gameView.board);
  this.gameView.board.tetramino = this.currentTetramino;
  this.blockView.updateView(this.nextTetramino.blocks[0]);
};

Tetris.prototype.newGame = function(){
  this.gameView = new GameView(this.rootEl, this);
  this.blockView = new BlockView(this.blockEl);
  this.currentTetramino = new Tetramino(this.gameView.board);
  this.nextTetramino = new Tetramino(this.gameView.board);
  this.gameView.board.tetramino = this.currentTetramino;
  this.blockView.updateView(this.nextTetramino.blocks[0]);
};

Tetris.prototype.newTetramino = function(){
  let newTetramino = new Tetramino(this.gameView.board);
  this.gameView.board.checkGameOver(newTetramino);
  if(!this.gameView.board.gameOver){
    this.currentTetramino = this.nextTetramino;
    this.nextTetramino = newTetramino;
  }

  this.blockView.updateView(this.nextTetramino.blocks[0]);
  this.gameView.board.tetramino = this.currentTetramino;
};

Tetris.prototype.swapTetraminos = function(){
  let currentPos = this.currentTetramino.pos;
  let nextPos = this.nextTetramino.pos;
  let pieceToSwapIn = this.nextTetramino;
  this.nextTetramino = this.currentTetramino;
  this.nextTetramino.pos = nextPos;
  this.currentTetramino = pieceToSwapIn;
  this.currentTetramino.pos = currentPos;
  this.blockView.updateView(this.nextTetramino.blocks[0]);
  this.gameView.board.tetramino = this.currentTetramino;
};

module.exports = Tetris;
