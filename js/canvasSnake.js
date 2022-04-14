(function() {
    var CANVAS_HEIGHT, CANVAS_WIDTH, DOWN, FIELD_AREA, Game, HEIGHT, H_SCALE, INIT_FPS, LEFT, PathNotFoundError, Point, RIGHT, SearchState, Snake, UP, WIDTH, W_SCALE, isOpposite, randInt, rgba, _ref;

    INIT_FPS = 20;

    WIDTH = 20;

    HEIGHT = 20;

    CANVAS_WIDTH = 900;

    CANVAS_HEIGHT = 900;

    FIELD_AREA = HEIGHT * WIDTH;

    W_SCALE = CANVAS_WIDTH / WIDTH;

    H_SCALE = CANVAS_HEIGHT / HEIGHT;

    _ref = ["u", "d", "l", "r"], UP = _ref[0], DOWN = _ref[1], LEFT = _ref[2], RIGHT = _ref[3];

    rgba = function(r, g, b, a) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    };

    randInt = function(start, end) {
        return Math.floor(Math.random() * (end - start) + start);
    };

    isOpposite = function(d1, d2) {
        switch (d1) {
            case UP:
                if (d2 === DOWN) {
                    return true;
                } else {
                    return false;
                }
                break;
            case DOWN:
                if (d2 === UP) {
                    return true;
                } else {
                    return false;
                }
                break;
            case LEFT:
                if (d2 === RIGHT) {
                    return true;
                } else {
                    return false;
                }
                break;
            case RIGHT:
                if (d2 === LEFT) {
                    return true;
                } else {
                    return false;
                }
                break;
            default:
                throw new Error("Invalid direction " + d1);
        }
    };

    Point = (function() {
        function Point(_at_x, _at_y) {
            this.x = _at_x;
            this.y = _at_y;
        }

        Point.prototype.add = function(x, y) {
            return new Point(this.x + x, this.y + y);
        };

        Point.prototype.equals = function(other) {
            return this.x === other.x && this.y === other.y;
        };

        Point.prototype.toString = function() {
            return "(" + this.x + ", " + this.y + ")";
        };

        return Point;

    })();

    Snake = (function() {
        function Snake(head) {
            this.body = [head];
            this.direction = RIGHT;
        }

        Snake.prototype.head = function() {
            return this.body[0];
        };

        Snake.prototype.tail = function() {
            return this.body[this.body.length - 1];
        };

        Snake.prototype.fork = function() {
            var snake;
            snake = new Snake(new Point(0, 0));
            snake.body = this.body.slice(0);
            snake.direction = this.direction;
            return snake;
        };

        Snake.prototype.advance = function(command) {
            var nextHead;
            if (isOpposite(command, this.direction)) {
                command = this.direction;
            }
            nextHead = Game.adjacentCell(command, this.head());
            this.body.unshift(nextHead);
            return this.direction = command;
        };

        Snake.prototype.move = function(command) {
            if (isOpposite(command, this.direction)) {
                command = this.direction;
            }
            this.advance(command);
            return this.moveTail();
        };

        Snake.prototype.moveTail = function() {
            return this.body.pop();
        };

        Snake.prototype.bodyHit = function() {
            var seg, _i, _len, _ref1;
            _ref1 = this.body.slice(1, this.body.length);
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                seg = _ref1[_i];
                if (this.head().equals(seg)) {
                    return true;
                }
            }
            return false;
        };

        Snake.prototype.wallHit = function() {
            var _ref1, _ref2;
            return !((0 <= (_ref1 = this.head().x) && _ref1 < WIDTH) && (0 <= (_ref2 = this.head().y) && _ref2 < HEIGHT));
        };

        return Snake;

    })();

    PathNotFoundError = {};

    Game = (function() {
        Game.adjacentCell = function(direction, cell) {
            switch (direction.toLowerCase()) {
                case 'u':
                    return cell.add(0, -1);
                case 'd':
                    return cell.add(0, 1);
                case 'l':
                    return cell.add(-1, 0);
                case 'r':
                    return cell.add(1, 0);
                default:
                    throw new Error("Invalid direction " + direction);
            }
        };

        function Game(_at_ctx) {
            var i, j;
            this.ctx = _at_ctx;
            this.fps = INIT_FPS;
            this.food = new Point(3, 3);
            this.score = 0;
            this.snake = new Snake(new Point(1, 1));
            this.commands = [];
            this.map = (function() {
                var _i, _results;
                _results = [];
                for (j = _i = 0; 0 <= WIDTH ? _i < WIDTH : _i > WIDTH; j = 0 <= WIDTH ? ++_i : --_i) {
                    _results.push((function() {
                        var _j, _results1;
                        _results1 = [];
                        for (i = _j = 0; 0 <= HEIGHT ? _j < HEIGHT : _j > HEIGHT; i = 0 <= HEIGHT ? ++_j : --_j) {
                            _results1.push(null);
                        }
                        return _results1;
                    })());
                }
                return _results;
            })();
            this.marks = (function() {
                var _i, _results;
                _results = [];
                for (j = _i = 0; 0 <= WIDTH ? _i < WIDTH : _i > WIDTH; j = 0 <= WIDTH ? ++_i : --_i) {
                    _results.push((function() {
                        var _j, _results1;
                        _results1 = [];
                        for (i = _j = 0; 0 <= HEIGHT ? _j < HEIGHT : _j > HEIGHT; i = 0 <= HEIGHT ? ++_j : --_j) {
                            _results1.push(false);
                        }
                        return _results1;
                    })());
                }
                return _results;
            })();
        }

        Game.prototype.draw = function() {
            var i, seg, _i, _ref1;
            this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            for (i = _i = 0, _ref1 = this.snake.body.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
                seg = this.snake.body[i];
                this.ctx.fillStyle = rgba(133, 22, 88, 1 - 0.7 * (i / this.snake.body.length));
                this.ctx.fillRect(seg.x * W_SCALE, seg.y * H_SCALE, W_SCALE, H_SCALE);
            }
            this.ctx.fillStyle = "yellow";
            return this.ctx.fillRect(this.food.x * W_SCALE, this.food.y * H_SCALE, W_SCALE, H_SCALE);
        };

        Game.prototype.placeFood = function() {
            var food, _results;
            _results = [];
            while (true) {
                food = new Point(randInt(0, WIDTH), randInt(0, HEIGHT));
                if (this.snake.body.every(function(s) {
                    return !s.equals(food);
                })) {
                    this.lastFood = this.food;
                    this.food = food;
                    break;
                } else {
                    _results.push(void 0);
                }
            }
            return _results;
        };

        Game.prototype.onTick = function() {
            if (this.commands.length === 0) {
                this.commands = Array.prototype.slice.apply(this.makeMoves());
            }
            this.snake.advance(this.commands.shift());
            $(this).trigger("updateInfo", "Score: " + this.score);
            if (this.snake.head().equals(this.food)) {
                this.placeFood();
                this.score++;
            } else {
                this.snake.moveTail();
            }
            if (this.snake.wallHit() || this.snake.bodyHit()) {
                this.stop();
                $(this).trigger("updateInfo", "GAME OVER");
                return;
            }
            if (this.snake.body.length >= WIDTH * HEIGHT - 1) {
                this.stop();
                $(this).trigger("updateInfo", "Unbelievable!");
                return;
            }
            this.draw();
            return this.ticker = setTimeout(((function(_this) {
                return function() {
                    return _this.onTick();
                };
            })(this)), 1000 / this.fps);
        };

        Game.prototype.play = function() {
            return this.onTick();
        };

        Game.prototype.stop = function() {
            return clearTimeout(this.ticker);
        };

        Game.prototype.isCellFree = function(cell, snake) {
            var _ref1, _ref2;
            return (0 <= (_ref1 = cell.x) && _ref1 < WIDTH) && (0 <= (_ref2 = cell.y) && _ref2 < HEIGHT) && snake.body.every(function(s) {
                return !s.equals(cell);
            });
        };

        Game.prototype.findPathToCell = function(snake, dest) {
            var cell, dir, head, i, j, node, queue, _i, _j, _k, _len, _ref1;
            head = snake.head();
            for (j = _i = 0; 0 <= WIDTH ? _i < WIDTH : _i > WIDTH; j = 0 <= WIDTH ? ++_i : --_i) {
                for (i = _j = 0; 0 <= HEIGHT ? _j < HEIGHT : _j > HEIGHT; i = 0 <= HEIGHT ? ++_j : --_j) {
                    this.marks[j][i] = false;
                }
            }
            queue = [new SearchState(head)];
            while (queue.length !== 0) {
                node = queue.shift();
                if (this.marks[node.head.x][node.head.y] === true) {
                    continue;
                }
                this.marks[node.head.x][node.head.y] = true;
                _ref1 = [UP, DOWN, LEFT, RIGHT];
                for (_k = 0, _len = _ref1.length; _k < _len; _k++) {
                    dir = _ref1[_k];
                    cell = Game.adjacentCell(dir, node.head);
                    if (cell.equals(dest)) {
                        return node.traceCmd() + dir;
                    }
                    if (this.isCellFree(cell, snake)) {
                        queue.push(new SearchState(cell, dir, node));
                    }
                }
            }
            throw PathNotFoundError;
        };

        Game.prototype.followTail = function(snake) {
            var cell, dir, found, head, i, j, max, move, next, node, queue, tail, _i, _j, _k, _l, _len, _len1, _m, _n, _ref1, _ref2;
            head = snake.head();
            tail = snake.tail();
            for (j = _i = 0; 0 <= WIDTH ? _i < WIDTH : _i > WIDTH; j = 0 <= WIDTH ? ++_i : --_i) {
                for (i = _j = 0; 0 <= HEIGHT ? _j < HEIGHT : _j > HEIGHT; i = 0 <= HEIGHT ? ++_j : --_j) {
                    this.map[j][i] = null;
                }
            }
            this.map[tail.x][tail.y] = 0;
            for (j = _k = 0; 0 <= WIDTH ? _k < WIDTH : _k > WIDTH; j = 0 <= WIDTH ? ++_k : --_k) {
                for (i = _l = 0; 0 <= HEIGHT ? _l < HEIGHT : _l > HEIGHT; i = 0 <= HEIGHT ? ++_l : --_l) {
                    this.marks[j][i] = false;
                }
            }
            queue = [tail];
            found = false;
            while (queue.length !== 0) {
                node = queue.shift();
                if (this.marks[node.x][node.y] === true) {
                    continue;
                }
                this.marks[node.x][node.y] = true;
                _ref1 = [UP, DOWN, LEFT, RIGHT];
                for (_m = 0, _len = _ref1.length; _m < _len; _m++) {
                    dir = _ref1[_m];
                    cell = Game.adjacentCell(dir, node);
                    if (cell.equals(head)) {
                        found = true;
                    }
                    if (this.isCellFree(cell, snake)) {
                        if (this.map[cell.x][cell.y] === null) {
                            this.map[cell.x][cell.y] = this.map[node.x][node.y] + 1;
                        }
                        queue.push(cell);
                    }
                }
            }
            if (found) {
                max = -1;
                move = null;
                _ref2 = [UP, DOWN, LEFT, RIGHT];
                for (_n = 0, _len1 = _ref2.length; _n < _len1; _n++) {
                    dir = _ref2[_n];
                    next = Game.adjacentCell(dir, head);
                    if (this.isCellFree(next, snake) || next.equals(tail)) {
                        if (this.map[next.x][next.y] > max && this.map[next.x][next.y] !== null) {
                            max = this.map[next.x][next.y];
                            move = dir;
                        }
                    }
                }
                return move;
            } else {
                throw PathNotFoundError;
            }
        };

        Game.prototype.makeMoves = function() {
            var cmd, direction, e, fork, next, path, _i, _j, _len, _len1, _ref1;
            try {
                path = this.findPathToCell(this.snake, this.food);
                fork = this.snake.fork();
                for (_i = 0, _len = path.length; _i < _len; _i++) {
                    cmd = path[_i];
                    fork.advance(cmd);
                    if (!fork.head().equals(this.food)) {
                        fork.moveTail();
                    }
                }
                this.findPathToCell(fork, fork.tail());
                return path;
            } catch (_error) {
                e = _error;
                if (e === PathNotFoundError) {
                    try {
                        return this.followTail(this.snake);
                    } catch (_error) {
                        e = _error;
                        if (e === PathNotFoundError) {
                            _ref1 = [UP, DOWN, LEFT, RIGHT];
                            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                                direction = _ref1[_j];
                                next = Game.adjacentCell(direction, this.snake.head());
                                if (this.isCellFree(next, this.snake)) {
                                    return direction;
                                }
                            }
                            return this.snake.direction;
                        } else {
                            throw e;
                        }
                    }
                } else {
                    throw e;
                }
            }
        };

        return Game;

    })();

    SearchState = (function() {
        function SearchState(_at_head, _at_cmd, _at_parent) {
            this.head = _at_head;
            this.cmd = _at_cmd != null ? _at_cmd : '';
            this.parent = _at_parent != null ? _at_parent : null;
        }

        SearchState.prototype.traceCmd = function() {
            if (this.parent === null) {
                return this.cmd;
            } else {
                return this.parent.traceCmd() + this.cmd;
            }
        };

        SearchState.prototype.toString = function() {
            return this.head + ", '" + (this.traceCmd()) + "'";
        };

        return SearchState;

    })();

    $(document).ready(function() {
        var context, game;
        context = $('.main_canvas')[0].getContext('2d');
        game = new Game(context);
        $(game).on('updateInfo', function(e, info) {
            return $('#score').text(info);
        });
        return game.play();
    });

}).call(this);