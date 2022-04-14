let selectedSnake = null;
let mySnakes = [];
const mainListLink = "$list";

function selectSnake (snake) {
	if (selectedSnake) {
		selectedSnake[mainListLink].removeClass("selected");
	}
    if (tourneySnake) {
        tourneySnake[mainListLink].removeClass("selected");
    }
	selectedSnake = snake;
	if (selectedSnake) {
		selectedSnake[mainListLink].addClass("selected");
	} else {
        $("#properties").empty();
        $("#patterns").empty();
    }
	makeSnakeProperties(selectedSnake);
	makePatternsList(selectedSnake);
}

function selectTourneySnake () {
    if (selectedSnake) {
        selectedSnake[mainListLink].removeClass("selected");
    }
    selectedSnake = null;
    if (tourneySnake) {
        tourneySnake[mainListLink].addClass("selected");
    }
    makeSnakeProperties(tourneySnake, true);
    makePatternsList(tourneySnake, true);
}

function getSnakeDOM(menu, snake, attr, func) {
    const $el = $(document.createElement("div"));
    const $icon = $(document.createElement("span"));
    $icon.addClass(menu.icon)
    .css({
        "filter" : "hue-rotate(" + menu.colorShift + "deg)"
    });
    $el.append($icon);

    const $caption = $(document.createElement("span"));
    $caption.addClass("name")
    .html(menu.caption);
    $el.append($caption);

    if ((attr)&&(attr !== "")) {
        snake[attr] = $el;
    }

    $el.addClass("element")
    .data({
        "snake": snake
    })
    .click(func);

    return $el;
}

function getMySnakesDOM(snakesList, func, nullable, addable, attr) {
    if ((snakesList.length === 0)&&(!nullable)&&(!addable)) return;
    const $div = $(document.createElement("div"));
    $div.addClass("select-list snakes-list");

    for (let i = 0; i < snakesList.length; i++) {
        const snake = snakesList[i];
        $div.append(getSnakeDOM({
            "caption" : snake.getName(),
            "colorShift" : snake.getColorShift(),
            "icon" : iconPrefix + " head"
        }, snake, attr, func));
    }

    if (nullable) {
        $div.append("<hr/>").append(getSnakeDOM({
            "caption" : "Змея отсутствует",
            "colorShift" : -120,
            "icon" : iconPrefix + " cross"
        }, null, "", func));
    }

    if (addable) {
        $div.append("<hr/>").append(getSnakeDOM({
            "caption" : "Новая змея",
            "colorShift" : 120,
            "icon" : iconPrefix + " plus"
        }, null, "", function () {
            const snake = new Snake();
            mySnakes.push(snake);
            makeSnakesList();
            selectSnake(snake);
            sendAllSnakes();
        }));
    }

    return $div;
}

function makeSnakesList() {
	$("#snakes").empty().append(getMySnakesDOM(mySnakes, function (e) {
        const $self = $(e.currentTarget);
        selectSnake($self.data().snake);
    }, false, true, mainListLink));
    const tourneySnakes = [];
    if (tourneySnake) {
        tourneySnakes.push(tourneySnake);
        $("#snakes")
        .append("<br/><div class='tsnake'>Турнирная змея:</div>")
        .append(getMySnakesDOM(tourneySnakes, function () {
            selectTourneySnake();
        }, false, false, mainListLink));
    }
}

function makePatternsList(snake, readonly) {
    if (!snake) return;
	$("#patterns").empty();
	for (let i = 0; i < snake.getCPUsCount(); i++) {
        const cpu = snake.getCPU(i);
        const $table = makeCPU(cpu, true);
        if (!readonly) {
            $table
            .attr("cpu", i)
            .data({
                "snake": snake,
                "cpu": cpu
            })
            .click(function (e) {
                const $self = $(e.currentTarget);
                const cpu = $self.data().cpu;
                $("#snakeEditor").addClass("hidden");
                $("#cpuEditor").removeClass("hidden");
                makeCPUEditor(cpu);
            });
        }
        $("#patterns").append($table);
	}
    if (!readonly) {
        $("#patterns").sortable({
            helper: "clone",
            update: function() {
                const newOrder = $(this).sortable("toArray", {attribute: "cpu"});
                const newCPUs = [];
                for (let i=0; i<newOrder.length; i++) {
                    newCPUs.push(snake.getCPU(newOrder[i]));
                }
                snake.setCPUs(newCPUs);
                sendAllSnakes();
                makePatternsList(snake, false);
            }
        });
	}
}

function makeSnakeProperties(snake, readonly) {
	if ((!snake)||(readonly)) {
	    return;
    }
    const prop = document.getElementById("properties");
    prop.replaceChildren();
    const nameInput = document.createElement("input");
    nameInput.id = "snakeName";
    nameInput.type = "text";
    nameInput.classList.add("input");
    nameInput.value = snake.getName();
    prop.append(nameInput);

    prop.append(makeButton({
        "name" : "saveName",
        "text" : "Переименовать",
        "click" : function (e) {
            snake.setName(nameInput.value);
            makeSnakesList();
            selectSnake(snake);
            sendAllSnakes();
        }
    }));

    prop.append(makeButton({
        "name" : "deleteSnake",
        "text" : "Удалить",
        "click" : function (e) {
            deleteSnake(snake);
            sendAllSnakes();
        }
    }));

    prop.append(makeButton({
        "name" : "tourney",
        "text" : "На турнир",
        "click" : function (e) {
            snake.setName(nameInput.value);
            makeSnakesList();
            selectSnake(snake);
            sendAllSnakes();
            sendToTourney(snake);
        }
    }));
}

function getSnakesData(snakes) {
    return Array.from({length: 4}, (_, i) => snakes[i]?.getData() || null);

    /*const snakesData = [];
    for (let i = 0; i < snakes.length; i++) {
    	let snake = snakes[i];
    	if (snake) {
            snakesData.push(snakes[i].getData());
	    } else {
            snakesData.push(null);
	    }
    }
    return snakesData;*/
}

function getAllSnakesData(snakes) {
    const snakesData = [];
    for (let i = 0; i < snakes.length; i++) {
    	let snake = snakes[i];
    	if (snake) {
            snakesData.push(snake.getData());
	    }
    }
    return snakesData;
}

function sendAllSnakes() {
    const snakesData = getAllSnakesData(mySnakes);
    $.ajax({
        type: 'POST',
        url: 'mysnakes',
        data: {
            "snakes": JSON.stringify(snakesData)
        },
        success: function() {
        },
        error: function() {
        },
        complete : function() {
        }
    });
}

function sendToTourney(snake) {
    const snakesData = snake.getData();
    $.ajax({
        type: 'POST',
        url: 'tourney',
        data: {
            "command" : "put",
            "snake": JSON.stringify(snakesData)
        },
        success: function(json) {
            tourneySnake = null;
            if (json) {
                tourneySnake = new Snake(json);
            }
            makeSnakesList();
            selectSnake(snake);
        },
        error: function() {
        },
        complete : function() {
        }
    });
}

function ignoreTourney() {
    $.ajax({
        type: 'POST',
        url: 'tourney',
        data: {
            "command" : "delete"
        },
        success: function() {
            tourneySnake = null;
            makeSnakesList();
            selectSnake(mySnakes[0]);
        },
        error: function() {
        },
        complete : function() {
        }
    });
}

let tourneySnake;

function loadTourneySnake() {
    $.ajax({
        type: 'GET',
        url: 'tourney',
        success: function(json) {
            tourneySnake = null;
            if (json) {
                tourneySnake = new Snake(json);
            }
            makeSnakesList();
            selectSnake(mySnakes[0]);
        },
        error: function() {
        },
        complete : function() {
        }
    });

}

function loadAllSnakes() {
    $.ajax({
        type: 'GET',
        url: 'mysnakes',
        success: function(json) {
            mySnakes = [];
            for (let i = 0; i < json.length; i++) {
                mySnakes.push(new Snake(json[i]));
            }
            makeSnakesList();
            selectSnake(mySnakes[0]);
        },
        error: function() {
        },
        complete : function() {
        }
    });
}

function findSnakeIndex(snake) {
    for (let i = 0; i < mySnakes.length; i++) {
    	if (mySnakes[i] === snake) {
    		return i;
	    }
    }
    return -1;
}

function deleteSnake(snake) {
    if (snake) {
        const index = findSnakeIndex(snake);
        if (index>=0) {
        	mySnakes.splice(index, 1);
            makeSnakesList();
            selectSnake(mySnakes[0]);
        }
    }
}

function makeSnakesEditor() {
	makeMenu("snakeMenu", [{
		"name" : "snakeDebug",
		"text" : "Отладка",
		"click" : function () {
			$("#snakeEditor").addClass("hidden");
			$("#battle").removeClass("hidden");
			makeArena();
		}
	},{
		"name" : "snakeDismis",
		"text" : "Отказаться от турнира",
		"click" : function () {
            ignoreTourney();
		}
    }]);

    if (!tourneySnake) {
        loadTourneySnake();
    }
    if (mySnakes.length === 0) {
        loadAllSnakes();
    }
    $("#snakeEditor").removeClass("hidden");
}
