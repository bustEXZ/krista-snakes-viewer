function makeButton(button) {
	const div = document.createElement("div");
    div.classList.add("button");
	div.id = button.name;
    div.innerHTML = button.text;
    div.onclick = button.click;
	return div;
}

function makeSlider(slider) {
    const scrollDiv = document.createElement("div");
    const barDiv = document.createElement("div");
    scrollDiv.classList.add("scroll");
    barDiv.classList.add("bar");
    scrollDiv.append(barDiv);

    scrollDiv.id = slider.name;
    scrollDiv.style.width = slider.width;
    const size = slider.max - slider.min;
    barDiv.style.left = parseInt(slider.width) * (slider.init - slider.min) / size + "px";

    const applyLeft = function (left) {
        const maxLeft = scrollDiv.offsetWidth - barDiv.offsetWidth;
        left = Math.min(Math.max(left, 0), maxLeft);
        barDiv.style.left = left + "px";
        slider.change(size * left / maxLeft + slider.min);
    }

    barDiv.onmousedown = function(event) {
        let x = event.clientX - barDiv.offsetLeft;
        document.onmousemove = function (event) {
            applyLeft(event.clientX - x);
            window.getSelection().removeAllRanges();
            event.stopPropagation();
        }
    }

    scrollDiv.onmousedown = function(event) {
        applyLeft(event.clientX - scrollDiv.offsetLeft - barDiv.offsetWidth / 2);
    }

    document.onmouseup = function() {
        document.onmousemove = null;
    }

    return scrollDiv;
}

function makeMenu(menuId, elements) {
    const menu = document.getElementById(menuId);
	menu.replaceChildren();
    menu.append(makeButton({
        "name": "fullScreen",
        "text": "&nbsp;⤡&nbsp;",
        "click": toggleScreen
    }));
    for (let element of elements) {
        if (element.type === "slider") {
            menu.append(makeSlider(element));
        } else {
            menu.append(makeButton(element));
        }
	}
}

function makeTable() {
    var $table = $(document.createElement("table"));
    $table.attr({
        cellspacing : 0,
        cellpadding : 0
    });
    return $table;
}

function fullScreen() {
    var elem = document.body;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if(elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if(elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    }
}

function fullScreenCancel() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if(document.mozExitFullscreen) {
        document.mozExitFullscreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
}

function isFullScreen() {
    return window.innerHeight === screen.height;
}

function toggleScreen() {
	if (isFullScreen()) {
		fullScreenCancel();
	} else {
        fullScreen();
	}
}