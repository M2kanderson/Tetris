const GameView = require('./game_view');

$(function(){
  const rootEl = $('.tetris-game');
  new GameView(rootEl);
});
