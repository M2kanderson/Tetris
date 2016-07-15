

const BlockView = function($el){
  this.$el = $el;
  this.setupGrid();
  this.blocks = [];
};

BlockView.prototype.setupGrid = function(){
  let html = "";
  for(let i = 0; i< 4; i++){
    html += "<ul>";
    for(let j = 0; j < 4; j++){
      html += "<li class='next-block'></li>";
    }
    html += "</ul>";
  }

  this.$el.html(html);
  this.$li = this.$el.find("li");
};

BlockView.prototype.render = function(blocks){
  let $li = this.$li;
  blocks.forEach((block) => {
    let pos = block.pos;
    let color = block.color;
    const flatCoord = ((pos[0]+1) * 4) + pos[1];
    $li.eq(flatCoord).addClass(color);

  });
};

BlockView.prototype.updateView = function(blocks) {
  this.$li.removeClass();
  this.render(blocks);

};

module.exports = BlockView;
