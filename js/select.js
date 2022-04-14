function takeSnake(pos, snake) {
    $("#snakeSelector").addClass("hidden");
    $("#battle").removeClass("hidden");
    if ((snake)&&(snake.init)) {
        snakes[pos] = new Snake(snake.getData());
    } else {
        snakes[pos] = null;
    }
    recolorSnakes();
    clearArena();
}

function makeSnakesSelect(pos) {
    $("#snakesSelect").empty().append(getMySnakesDOM(mySnakes, function (e) {
        const $self = $(e.currentTarget);
        takeSnake(pos, $self.data().snake);
    }, true));
}

function makeSnakeSelector(pos){
    makeSnakesSelect(pos);
}