const Tetris = require('./tetris');


$(function(){
  const rootEl = $('.tetris-game');
  const blockEl = $('.next-blocks');
  new Tetris(rootEl, blockEl);
});
