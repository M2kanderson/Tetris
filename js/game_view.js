const Board = require("./board.js");



const GameView = function($el){
  this.$el = $el;
  this.board = new Board(10, 20);
  this.setupGrid();

  this.intervalId = window.setInterval(
  this.step.bind(this),
  GameView.STEP_MILLIS
  );

  $(window).on("keydown", this.handleKeyEvent.bind(this));
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

GameView.KEYS = {
  37: "left",
  39: "right",
  38: "rotate",
  40: "down"
};

GameView.prototype.handleKeyEvent = function(event){
  switch (GameView.KEYS[event.keyCode]) {
    case "left":
      this.board.tetramino.move([0,-1]);
      this.render([0,-1]);
      break;
    case "right":
      this.board.tetramino.move([0,1]);
      this.render([0,1]);
      break;
    case "rotate":
      this.board.tetramino.rotate();
      break;

  }
};

module.exports = GameView;
