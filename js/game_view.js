const Board = require("./board.js");



const GameView = function($el, game){
  this.$el = $el;
  this.game = game;
  this.board = new Board(10, 20, game);
  this.setupGrid();
  this.paused = false;
  $(".start-menu").addClass('show');
  $(".start-button").on("click", this.startGame.bind(this));
  $(".restart-button").on("click", this.restartGame.bind(this));
};

GameView.STEP_MILLIS = 500;

GameView.prototype.startGame = function(){
  $(".start-menu").removeClass('show');
  this.intervalId = window.setInterval(
  this.step.bind(this),
  GameView.STEP_MILLIS
  );
  $(window).on("keydown", this.handleKeyEvent.bind(this));
  $(window).on("keyup", this.handleKeyUpEvent.bind(this));
};

GameView.prototype.restartGame = function(){
  $(".game-over").removeClass('show');
  this.board.gameOver = false;
  this.game.newGame();
};

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
  if(this.board.gameOver){
    window.clearInterval(this.intervalId);
    window.clearInterval(this.downIntervalId);
    this.downIntervalId = null;
    $(".game-over").addClass("show");
  }
  if(this.board.updateFallSpeed){
    this.updateFallSpeed();
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

GameView.prototype.updateFallSpeed = function(){
  this.board.updateFallSpeed = false;
  let stepMillis = 500;
  let level = Math.floor(this.board.linesCompleted / 10) + 1;
  switch (level) {
    case 1:
      stepMillis = 500;
      break;
    case 2:
      stepMillis = 450;
      break;
    case 3:
      stepMillis = 400;
      break;
    case 4:
      stepMillis = 350;
      break;
    case 5:
      stepMillis = 300;
      break;
    case 6:
      stepMillis = 250;
      break;
    case 7:
      stepMillis = 200;
      break;
    case 8:
      stepMillis = 150;
      break;
    case 9:
      stepMillis = 100;
      break;
    default:
      stepMillis = 50;
      break;


  }
  window.clearInterval(this.intervalId);
  this.intervalId = window.setInterval(
  this.step.bind(this),
  stepMillis
  );
};

module.exports = GameView;
