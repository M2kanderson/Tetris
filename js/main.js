const GameView = require('./game_view');
const BlockView = require('./block_view');
const Tetramino = require('./tetramino');

const Tetris = function(rootEl, blockEl){
  this.gameView = new GameView(rootEl, this);
  this.blockView = new BlockView(blockEl);
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

$(function(){
  const rootEl = $('.tetris-game');
  const blockEl = $('.next-blocks');
  new Tetris(rootEl, blockEl);
});
