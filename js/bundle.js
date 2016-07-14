/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	
	$(function(){
	  const rootEl = $('.tetris-game');
	  new GameView(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(2);
	
	
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Tetramino = __webpack_require__(3);
	const Block = __webpack_require__(4);
	
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
	
	const Board = function(width, height){
	  this.width = width;
	  this.height = height;
	  this.blocks = [];
	  this.score = 0;
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
	  let rowsEliminated = 0;
	  Object.keys(this.rowCount).forEach((row) =>{
	    if(parseInt(this.rowCount[row]) >= this.width){
	      rowsEliminated += 1;
	      // window.setTimeout(this.removeRow.bind(parseInt(row)), 700);
	      this.removeRow(parseInt(row));
	    }
	  });
	  this.score += 100*rowsEliminated*rowsEliminated;
	  $('.score').text(this.score);
	  let newTetramino = new Tetramino(this);
	  this.checkGameOver(newTetramino);
	  if(!this.gameOver){
	    this.tetramino = new Tetramino(this);
	  }
	};
	
	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Block = __webpack_require__(4);
	
	
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
	
	Tetramino.prototype.rotationCollisions = function(){
	  let newOrientationBlocks = this.blocks[1];
	  return newOrientationBlocks.some((block) =>{
	    let pos = [block.pos[0] + this.pos[0], block.pos[1] + this.pos[1]];
	    return pos[0] < 0 || pos[1] < 0
	      || pos[0] >= this.board.height || pos[1] >= this.board.width;
	  });
	};
	
	Tetramino.prototype.rotate = function(){
	  if(!this.rotationCollisions())
	  {
	    this.blocks.push(this.blocks.shift());
	  }
	
	};
	
	
	
	module.exports = Tetramino;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Block = function(pos, color){
	  this.pos = pos;
	  this.color = color;
	};
	
	module.exports = Block;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map