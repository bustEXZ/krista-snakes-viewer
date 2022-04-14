// ==========================================================================================================
// модуль класса змея
//
// ==========================================================================================================

/**
 * класс змеи
 */
function Snake(data) {
	let _name = "dummy",
        _displayName = "Змейка",
        _dead = false,
		_colorShift = getRandomInt(0, 359),
		_body = [],
		_CPUs = [],
		_bloodLinks = [],
		_tailHistory = [],
		_author = undefined,
		_arenaLink;

	this.getName = function () {
		return _name;
	}
	this.setName = function (name) {
		_name = name;
	}
	this.isDead = function () {
		return _dead;
	}
	this.getLength = function () {
		return _dead ? 0 : _body.length;
	}
	this.getCPU = function (index) {
		return _CPUs[index];
	}
	this.getCPUsCount = function () {
		return _CPUs.length;
	}
	this.setCPU = function (index, cpu) {
		_CPUs[index] = cpu;
	}
	this.setCPUs = function (CPUs) {
		_CPUs = CPUs;
	}
	this.getColorShift = function () {
		return _colorShift;
	}
	this.setColorShift = function (colorShift) {
		_colorShift = colorShift;
	}
	this.setAuthor = function (author) {
		_author = author;
	}
	this.getAuthor = function () {
		return _author;
	}
	/**
	 * Возвращает подготовленную пустую микросхему
	 * @returns {{pattern: *[], type: string}}
	 * @private
	 */
	const _getBlankCPU = function () {
		return {
			type: "and",
			pattern: Array.from({length: cpuRows}, () => new Array(cpuCols).fill("null"))
		};
	};

	const _parseDirection = function (prevSegment, segment, nextSegment) {
		const prevRowDelta = 1 + (prevSegment ? prevSegment.row - segment.row : 0);
		const prevColDelta = 1 + (prevSegment ? prevSegment.col - segment.col : 0);
		const nextRowDelta = 1 + (nextSegment ? nextSegment.row - segment.row : 0);
		const nextColDelta = 1 + (nextSegment ? nextSegment.col - segment.col : 0);
		return [directionParse[prevRowDelta][prevColDelta], directionParse[nextRowDelta][nextColDelta]];
	}

	const _parseClass = function (part, prevSegment, segment, nextSegment) {
		const prevNextDir = _parseDirection(prevSegment, segment, nextSegment);
		let className = "";
		if (part === "body") {
			className = classBodyParse[prevNextDir[0]][prevNextDir[1]];
		}
		if (part === "head") {
			className = classHeadParse[prevNextDir[1]];
		}
		if (part === "tail") {
			className = classTailParse[prevNextDir[0]];
		}
		return className + " " + prevNextDir[0] + prevNextDir[1];
	}

	const _getColorFilter = function () {
		return `hue-rotate(${_colorShift}deg)`;
	};

	const _getGridArea = function (row, col) {
		return `${row + 1} / ${col + 1} / ${row + 2} / ${col + 2}`;
	};

	const _createBodySegmentDOM = function (segment) {
		segment.link = document.createElement("div");
		segment.link.style.gridArea = _getGridArea(segment.row, segment.col);
		segment.link.style.filter = _getColorFilter();
		_arenaLink?.appendChild(segment.link);
	};

	this.createBlood = function () {
		if (_body.length >= 1) {
			const segment = _body[_body.length - 1]
			if (_bloodLinks.length > 5) {
				_bloodLinks[0].remove();
				_bloodLinks.shift();
			}
			const bloodDiv = document.createElement("div");
			bloodDiv.classList.add("blood");
			bloodDiv.style.transform = `rotate(${getRandomInt(0, 359)}deg)  scale(${getRandom(0.65, 1.35)})`;
			bloodDiv.style.gridArea = _getGridArea(segment.row, segment.col);
			bloodDiv.style.filter = _getColorFilter();
			_bloodLinks.push(bloodDiv);
			_arenaLink?.appendChild(bloodDiv);
			//setInterval(function () {bloodDiv.classList.add("blood-end")}, 100);
			let dummy = bloodDiv.clientHeight;// борьба с глюками в Хроме, заодно позволяет отказаться от отложенного изменения класса
			bloodDiv.classList.add("blood-end");
		}
	}

	const _createBodySegment = function (row, col) {
		const segment =  {
			row : row,
			col : col,
			link : undefined
		};
		_createBodySegmentDOM(segment);
		return segment;
	};

	const _updateBodySegment = function (index) {
		if (_dead) {
			return;
		}
		const segment = _body[index];
		let part = (index === 0) ? "head" : (index === (_body.length - 1)) ? "tail" : "body";
		segment.link.className = _parseClass(part, _body[index - 1], segment, _body[index + 1]);
	};

	/**
	 * Располагет тело змеи на арене
	 * @param start
	 * @param direction
	 * @private
	 */
	const _initBody = function (start, direction) {
		_tailHistory = [];
		_body.forEach(segment => segment.link?.remove())
		_body = [];
		for (let i = 0, row = start.row, col = start.col; i < startSnakeLength; i++) {
			_body.push(_createBodySegment(row, col));
			col += directionDelta[direction].deltaCol;
			row += directionDelta[direction].deltaRow;
		}
	};

	const _updateBody = function () {
		_body.forEach((_, i) => _updateBodySegment(i));
	}

	/**
	 * Инициализирует мозги змени набором пустых микросхем
	 * @private
	 */
	const _initCPUs = function () {
		_CPUs = Array.from({length: countCPU}, _getBlankCPU);
	};

	this.place = function (arenaLink, start, direction) {
		_dead = false;
		_initBody(start, direction);
		_arenaLink = arenaLink;
		_body.forEach(segment => _arenaLink?.appendChild(segment.link));
		_updateBody();
	};

	this.init = function () {
		_initCPUs();
		_initBody({row: 0, col: 0}, "right");
		_updateBody();
	};

	this.getData = function () {
		return {
			"name" : _name,
            "displayName" : _displayName,
			"CPUs" : _CPUs
		}
	};

	this.kill = function () {
		_body.forEach(segment => segment.link?.remove());
		_dead = true;
	};

	this.resurrect = function () {
		_dead = false;
		_body.forEach((segment, i) => {
			_createBodySegmentDOM(segment)
			_updateBodySegment(i);
		});
	};

	this.applyData = function (data) {
		if (!data) {
			return;
		}
		_name = data.name;
		_displayName = data.displayName;

		for (let i = 0; i < countCPU; i++) {
			const cpu = data.CPUs[i];
			if (cpu) {
				if (Array.isArray(cpu)) {
					_CPUs[i].type = "and";
					_CPUs[i].pattern = cpu;
				} else {
					_CPUs[i] = cpu;
				}
			}
		}
	};

	this.shrink = function () {
		if (_body.length > 2) {
			_body[_body.length - 1].link.remove();
			_tailHistory.push(_body.pop());
			_updateBodySegment(_body.length - 1);
		} else {
			this.kill();
		}
	};

	this.grow = function () {
		if (_dead) {
			this.resurrect();
		} else {
			const segment = _tailHistory.pop();
			_createBodySegmentDOM(segment);
			_body.push(segment)
			_updateBodySegment(_body.length - 2);
			_updateBodySegment(_body.length - 1);
		}
	};

	this.logStep = function (stepData) {
		if (_dead) {
			return;
		}
		const col = _body[0].col + directionDelta[stepData.dir].deltaCol;
		const row = _body[0].row + directionDelta[stepData.dir].deltaRow;

		if (stepData.dir !== "none") {
			_body.unshift(_createBodySegment(row, col));
			_updateBodySegment(0);
			_updateBodySegment(1);
			if (stepData.victim) {
				stepData.victim.createBlood();
				stepData.victim.shrink();
			} else {
				this.shrink();
			}
		}
	};
	this.backStep = function (stepData) {
		if (_dead) {
			return;
		}
		if (stepData.dir !== "none") {
			_body[0].link.remove();
			_body.shift();
			_updateBodySegment(0);
			if (stepData.victim) {
				stepData.victim.grow();
			} else {
				this.grow();
			}
		}
	};
	this.init();
	this.applyData(data);
}

/**
 * Пасспорт змеи
 */

function Passport(snake, step) {
	let _snake = snake;
	let _step = step;
	let _links = {};
	let _tourneyMode = false;

	this.$getDOM = function () {
		return _links.$passport;
	};

	const _makeBlankPassport = function (tourneyMode) {
		if (_links.$passport) {
			return;
		}
		_tourneyMode = tourneyMode;
		if (_tourneyMode) {
			_makeTourneyPassport();
		} else {
			_makeDebugPassport();
		}
	};

	const _makeDebugPassport = function () {
		const $snakePassportDOM = $(`
        <div class="snake-passport">
            <div class="${iconPrefix} cross"></div>
            <div class="passport-name">Змея отсутствует</div>
            <div class="passport-pattern"></div>
            <div class="passport-title">очередь</div>
            <div class="passport-title">направление</div>
            <div class="passport-title">длина</div>
            <div class="passport-order"></div>
            <div class="passport-direction"></div>
            <div class="passport-score"></div>
        </div>
        `);
		_links = {
			$passport : $snakePassportDOM,
			$head : $(`.${iconPrefix}.cross`, $snakePassportDOM),
			$name : $(".passport-name", $snakePassportDOM),
			$score : $(".passport-score", $snakePassportDOM),
			$cpu : $(".passport-pattern", $snakePassportDOM),
			$order : $(".passport-order", $snakePassportDOM),
			$direction : $(".passport-direction", $snakePassportDOM)
		};
	};

	const _makeTourneyPassport = function () {
		const $snakePassportDOM = $(`
        <div class="snake-passport-short">
            <div class="passport-rhomb">
            	<div>
		            <div class="passport-number"></div>
	    	        <div class="passport-score"></div>
	        	</div>
			</div>
            <div class="passport-name"></div>
            <div class="passport-user"></div>
            <div class="passport-city"></div>
        </div>
        `);
		_links = {
			$passport : $snakePassportDOM,
			$number : $(".passport-number", $snakePassportDOM),
			$rhomb : $(".passport-rhomb", $snakePassportDOM),
			$score : $(".passport-score", $snakePassportDOM),
			$name : $(".passport-name", $snakePassportDOM),
			$user : $(".passport-user", $snakePassportDOM),
			$city : $(".passport-city", $snakePassportDOM),
		};
	};

	this.updatePassport = function(snake, step) {
		_snake = snake;
		_step = step;

		_updateCommonPassport();
		if (_tourneyMode) {
			_updateTourneyPassport();
		} else {
			_updateDebugPassport();
		}
	};
	const _updateCommonPassport = function() {
		_links.$name.html(_snake?.getName() ?? "Змея отсутствует");
		_links.$score.html(_snake?.getLength() ?? "");

		/*_links.$passport.removeClass("inactive-passport");
        if (data.logStep[i].order < data.logStep[0].order) {
            _links.$passport.addClass("inactive-passport");
        }*/
	};

	const _updateTourneyPassport = function() {
		_links.$rhomb.css({
			"backgroundColor": _snake ? "#FF7F7F" : "transparent",
			"filter": "hue-rotate(" + (_snake?.getColorShift() ?? 0) + "deg)"
		});
		_links.$user.html(_snake?.getAuthor()?.displayName ?? "неизвестный автор");
		_links.$city.html(_snake?.getAuthor()?.city ?? "");
		_links.$number.html(_snake?.getAuthor()?.index ?? "??");
	};

	const _updateDebugPassport = function() {
		_links.$head.removeClass("cross").removeClass("head").addClass(_snake ? "head" : "cross");
		_links.$head.css("filter", "hue-rotate(" + (_snake?.getColorShift() ?? 0) + "deg)");

		_links.$order.html(_step?.order ?? "");
		_links.$direction.html(_step ? directionText[_step.dir] : "");

		const cpu = _snake?.getCPU(_step?.cpu);
		_links.$cpu.empty();
		if (cpu) {
			_links.$cpu.append(makeCPU(cpu, true));
		}
	};

	_makeBlankPassport(arenaReadOnly);
	this.updatePassport(snake, step);
}
