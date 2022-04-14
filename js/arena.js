// ==========================================================================================================
// модуль поддержки арены и ее генерации
//
// ==========================================================================================================

// глобальные переменные
// инициализировать и обнулять в случе надобности по месту обязательно!!!
const passports = [];
let stepLink = null;
let snakes = [];
let arenaReadOnly = false;

let battleLog;
let currentStep = 0;

let delay = 100;

window.onresize = function () {
    $(".square").each(function (i, el) {
        const content = $(el).parents(".content").get(0);
        el.style.height = "0px";
        el.style.width = "0px";
        const size = content.offsetHeight > content.offsetWidth ? content.offsetWidth : content.offsetHeight;
        el.style.height = "calc(" + size + "px - 1vmin)";
        el.style.width = "calc(" + size + "px - 1vmin)";
    });
}

function recolorSnakes() {
    let colorShift = getRandomInt(0, 359);
    const shiftDelta = 60;
    snakes.forEach(snake => snake?.setColorShift(colorShift += shiftDelta));
}

/**
 * Рендер статуса змей
 */
function renderScore() {
    stepLink = $("#step");

    const scoreLink = $("#score");
    scoreLink.empty()
    for (let i = 0; i < 4; i++) {
        passports[i] = new Passport(snakes[i]);

        passports[i].$getDOM().data({
            "pos": i
        });

        if (!arenaReadOnly) {
            passports[i].$getDOM().click(function (e) {
                if (timer !== undefined) {
                    return;
                }
                const $self = $(e.currentTarget);
                $("#snakeSelector").removeClass("hidden");
                $("#battle").addClass("hidden");
                makeSnakeSelector($self.data().pos);
            })
        }
        scoreLink.append(passports[i].$getDOM());
    }
}

function updateScore() {
    stepLink.html(currentStep);
    const logStep = getLogStep(currentStep);
    passports.forEach((passport, i) => passport.updatePassport(snakes[i], logStep ? parseSnakeStep(logStep[i]) : undefined));
}

function clearArena() {
    currentStep = 0;
    battleLog = undefined;
    killAll();
    renderScore();
    updateScore();
}

function battlePause() {
    clearInterval(timer);
    timer = undefined;
}

function battleEnd() {
    battlePause();
    window.stopGameNotifier?.();
}

function battleStart() {
    clearInterval(timer);
    timer = setInterval(oneStep, delay);
    window.startGameNotifier?.();
}

function getLogStep(stepNumber) {
    if ((battleLog) && (stepNumber >= 0) && (stepNumber < battleLog.log.length)) {
        return battleLog.log[stepNumber];
    }
    return undefined;
}

function oneStep() {
    if (currentStep === battleLog.log.length) {
        window.stopGameNotifier?.();
    }

    if ((battleLog) && (currentStep <= battleLog.log.length)) {
        const logPreStep = getLogStep(currentStep - 1);
        postStep(logPreStep);
        const logStep = getLogStep(currentStep);
        if (logStep) {
            preStep(logStep);
        } else {
            battlePause();
        }
        updateScore();
        currentStep++;
    }
}

function backStep() {
    if (currentStep > 0) {
        currentStep--;
        const logStep = getLogStep(currentStep);
        preBackStep(logStep);
        currentStep--;
        const logPreStep = getLogStep(currentStep);
        if (logPreStep) {
            postBackStep(logPreStep);
            updateScore();
        }
        // ох... не задавайте мне вопросов. так надо.
        currentStep++;
    }
}

function parseSnakeStep(snakeStep) {
    if (!snakeStep) {
        return null;
    }
    if (snakeStep.victimNumber >= 0) {
        snakeStep.victim = snakes[snakeStep.victimNumber];
    }
    snakeStep.stepNumber = currentStep;
    return snakeStep;
}

function preStep(logStep) {
    uniStep(logStep, true, 1);
}

function postStep(logStep) {
    uniStep(logStep, false, 1);
}

function preBackStep(logStep) {
    uniStep(logStep, true, -1);
}

function postBackStep(logStep) {
    uniStep(logStep, false, -1);
}

function prepareLogStep(logStep, direction) {
    return logStep.map((x, i) => {
        if (!x) {
            x = {order : 5};
        }
        x.index = i;
        return x;
    }).sort((a, b) => direction * (a.order - b.order));
}

function uniStep(logStep, preFlag, direction) {
    if (!logStep) {
        return;
    }
    prepareLogStep(logStep, direction).forEach(log => {
        const snake = snakes[log.index];
        if ((snake) && (preFlag ^ (log.order >= logStep[0].order))) {
            if (direction === 1) {
                snake.logStep(parseSnakeStep(log));
            } else {
                snake.backStep(parseSnakeStep(log));
            }
        }
    });
}

function startRound() {
    currentStep = 0;
    snakes.forEach((snake, i) => snake?.place($("#arena").get(0), battleLog.start[i].pos, battleLog.start[i].dir));
    updateScore();
    // чтобы избежать лишнего клика при отладке, когда змея ходит первая
    if ((battleLog) && (battleLog.log[0][0].order === 0)) {
        currentStep++;
    }
}

function sendToServer() {
    const snakesData = getSnakesData(snakes);
    $.ajax({
        type: 'POST',
        url: 'debug',
        data: {
            "snakes": JSON.stringify(snakesData)
        },
        success: function (json) {
            battleLog = json;
            startRound()
        },
        error: function () {
        },
        complete: function () {
        }
    });
}

function killAll() {
    snakes.forEach(snake => snake?.kill())
    $("#arena").empty();
}

let timer;

function makeArena() {
    makeMenu("debugMenu", [{
        "name": "toggleGrid",
        "text": "&nbsp;▦&nbsp;",
        "click": function () {
            $("#arena").toggleClass("arena-grid");
        }
    },{
        "name": "initBattle",
        "text": "Новый бой",
        "click": function () {
            battlePause();
            sendToServer();
        }
    }, {
        "name": "startBattle",
        "text": "Запустить",
        "click": function () {
            battleStart()
        }
    }, {
        "name": "pauseBattle",
        "text": "Приостановить",
        "click": function () {
            battlePause();
        }
    }, {
        "name": "backStepBattle",
        "text": "Шаг назад",
        "click": function () {
            battlePause();
            backStep();
        }
    }, {
        "name": "stepBattle",
        "text": "Шаг вперед",
        "click": function () {
            battlePause();
            oneStep();
        }
    }, {
        "name": "exitBattle",
        "text": "Закончить бой",
        "click": function () {
            battlePause();
            $("#battle").addClass("hidden");
            $("#snakeEditor").removeClass("hidden");
            makeSnakesEditor();
        }
    }]);

    arenaReadOnly = false;
    snakes = [];
    if (mySnakes[0]) {
        // инициализация первой змеи в отладке
        snakes.push(new Snake(mySnakes[0].getData()));
    }
    recolorSnakes();
    clearArena();

    $(window).trigger("resize");
}
