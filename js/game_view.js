const Board = require("./board.js");



const GameView = function($el, game){
  this.$el = $el;
  this.game = game;
  this.board = new Board(10, 20, game);
  this.setupGrid();
  this.paused = false;

  this.intervalId = window.setInterval(
  this.step.bind(this),
  GameView.STEP_MILLIS
  );
  $(window).on("keydown", this.handleKeyEvent.bind(this));
  $(window).on("keyup", this.handleKeyUpEvent.bind(this));
};

GameView.STEP_MILLIS = 200;

GameView.prototype.setupGrid = function(){
  let html = "";
  for(let i = 0; i< this.board.height; i++){
    html += "<ul>";
    for(let j = 0; j < this.board.width; j++){
      html += "<li></li>";
    }
    html += "</ul>";
  }

  this.$el.html(html);
  this.$li = this.$el.find("li");
};

GameView.prototype.step = function(){
  // console.log(this.board.gameOver());
  if(this.board.gameOver){
    window.clearInterval(this.intervalId);
    window.clearInterval(this.downIntervalId);
    this.downIntervalId = null;
    $(".game-over").addClass("show");
  }

  this.board.tetramino.move([1,0]);
  this.render([1,0]);
};

GameView.prototype.updateClasses = function() {
  this.$li.removeClass();
  this.board.render(this.$li);

};

GameView.prototype.render = function (delta) {
  this.updateClasses();
};

// GameView.prototype.newTetramino = function(){
//   this.game.newTetramino();
// };

GameView.KEYS = {
  37: "left",
  39: "right",
  38: "rotate",
  40: "down",
  80: "pause"
};

GameView.prototype.handleKeyUpEvent = function(event){
  switch (GameView.KEYS[event.keyCode]) {
  case "down":
    window.clearInterval(this.downIntervalId);
    this.downIntervalId = null;
    break;
  }
};

GameView.prototype.togglePause = function(){
  if(this.intervalId){
    window.clearInterval(this.intervalId);
    this.intervalId = null;
    this.paused = true;
    $(".pause-menu").addClass('show');
  }else {
    this.intervalId = window.setInterval(
    this.step.bind(this),
    GameView.STEP_MILLIS
    );
    this.paused = false;
    $(".pause-menu").removeClass('show');
  }
};

GameView.prototype.handleKeyEvent = function(event){
  switch (GameView.KEYS[event.keyCode]) {
    case "left":
      event.preventDefault();
      if(!this.paused){
        this.board.tetramino.move([0,-1]);
        this.render([0,-1]);
      }
      break;
    case "right":
      event.preventDefault();
      if(!this.paused){
        this.board.tetramino.move([0,1]);
        this.render([0,1]);
      }
      break;
    case "rotate":
      event.preventDefault();
      if(!this.paused){
        this.board.tetramino.rotate();
      }
      break;
    case "down":
      event.preventDefault();
      if(!this.downIntervalId && !this.board.gameOver && !this.paused){
        this.downIntervalId = window.setInterval(
        this.step.bind(this),
        50
        );
      }
      break;
    case "pause":
      this.togglePause();

      break;

  }
};

module.exports = GameView;
