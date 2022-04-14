function runGame(json) {
    battleLog = json;
    playAdminRound();
}

function useSettings(command) {
    $.ajax({
        type: "GET",
        url: "tourney",
        data: {
            command: command,
        },
        success: function (json) {
            if (json === true) {
                $("#tourneyState").html("Прием змей закончен, идет турнир!");
            }
            if (json === false) {
                $("#tourneyState").html("Прием змей открыт");
            }
        },
        error: function () {},
        complete: function () {},
    });
}

function loadSettings() {
    useSettings("none");
}

function playAdminRound() {
    makeMenu("debugMenu", [
        {
            name: "toggleGrid",
            text: "&nbsp;▦&nbsp;",
            click: function () {
                $("#arena").toggleClass("arena-grid");
            },
        },
        {
            name: "startBattle",
            text: "Запустить бой",
            click: function () {
                clearInterval(timer);
                timer = setInterval(oneStep, delay);
            },
        },
        {
            name: "pauseBattle",
            text: "Приостановить",
            click: function () {
                battlePause();
            },
        },
        {
            name: "initBattle",
            text: "Заново",
            click: function () {
                battlePause();
                killAll();
                startRound();
            },
        },
        {
            type: "slider",
            name: "delaySlider",
            min: 30,
            max: 1000,
            init: delay,
            width: "500px",
            change: function (value) {
                delay = value;
                if (timer) {
                    clearInterval(timer);
                    timer = setInterval(oneStep, delay);
                }
            },
        },
    ]);

    $("#tourneysSelector").addClass("hidden");
    $("#battle").removeClass("hidden");
    $("#score").css("float", "none");

    arenaReadOnly = true;

    // перекрытие умолчания для турнира
    delay = 200;

    snakes = [];
    battleLog.start.forEach(function (initSnakeState) {
        const snake = new Snake();
        snake.setName(initSnakeState.player.snake);
        snake.setAuthor(initSnakeState.player);
        snakes.push(snake);
    });

    recolorSnakes();
    killAll();
    renderScore();
    startRound();
    $(window).trigger("resize");
}
