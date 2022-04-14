const outEvents = {
    ready: "READY",
    start: "START",
    end: "END",
    pageDown: "PAGE_DOWN"
}

const comingEvents = {
    startGame: "START_GAME",
    pauseGame: "PAUSE_GAME",
}

function sendParentMessage(data) {
    window.parent.postMessage(JSON.stringify(data), '*');
}

const frameFactory = (event) => () => {
    sendParentMessage({
        event,
    })
}

function frameReadyNotifier() {
    frameFactory(outEvents.ready)();
}

function framePageDownNotifier() {
    frameFactory(outEvents.pageDown)();
}

function startGameNotifier() {
    frameFactory(outEvents.start)();
}

function stopGameNotifier() {
    frameFactory(outEvents.end)();
}

window.addEventListener('message', function (e) {
    const data = e.data;

    const comingEventsMap = {
        [comingEvents.startGame]: battleStart,
        [comingEvents.pauseGame]: battleEnd,
    }

    try {
        const decoded = JSON.parse(data);

        console.log("FRAME EVENT", decoded.event);
        comingEventsMap[decoded.event]?.();
    } catch (e) {
    }
});