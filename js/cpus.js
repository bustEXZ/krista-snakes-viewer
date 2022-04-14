// ==========================================================================================================
// модуль создания микросхемы
// ==========================================================================================================
var selectedLogic = null,
	selectedColor = null,
	selectedType = null,
	selectedNot = false;

var clipboardCPU = null;

function _getClassName(cell) {
	var suffix = "empty";
	if (cell) {
		suffix = cell;
	}
	return logicPrefix + " " + suffix;	
}

function _findTypeByName(name) {
    var result = null;
    for (var i = 0; i < logicType.length; i++) {
        var type = logicType[i];
        if (type.name === name) {
            result = type;
            break;
        }
    }
    return result;
}

function _findLogicByName(name) {
	var result = null;
	for (var i = 0; i < logicSet.length; i++) {
		var logic = logicSet[i];
		if (logic.name === name) {
			result = logic;
			break;
		}
	}
	return result;
}

function _findGroupByName(name) {
	var result = null;
	for (var i = 0; i < logicColor.length; i++) {
		var color = logicColor[i];
		if (color.name === name) {
			result = color;
			break;
		}
	}
	return result;
}

function _findNotByName(name) {
    if (name === logicNot.name) {
    	return logicNot;
    } else {
    	return null;
    }
}

function cpuClick(cpu, $self) {
    var row = $self.data().x;
    var col = $self.data().y;
    if (selectedLogic.name === "selfHead") {
        removeSelfHead(cpu);
        $self.removeClass().addClass(_getClassName(selectedLogic.className + " and"));
        cpu.pattern[row][col] = selectedLogic.name + " and";
    } else {
        var notClass = "";
        var notName = "";
        if ((selectedLogic.name !== "null")&&(selectedNot)) {
            notClass = " " + logicNot.className;
            notName = " " + logicNot.name;
        }
        var combiClass = selectedLogic.className + " " + selectedColor.className + notClass;
        $self.removeClass().addClass(_getClassName(combiClass));
        cpu.pattern[row][col] = selectedLogic.name + " " + selectedColor.name + notName;
    }
}

var $cpuTable = null;
/**
 * заполняет паттерн
 */
function makeCPU(cpu, preview) {
    var $table = makeTable();
    if (preview) {
        $table.addClass("cpu-preview-table");
    } else {
        $table.addClass("cpu-table");
    }
    $table.data("cpu", cpu);
    $table.addClass(_findTypeByName(cpu.type).className);
	for (var x = 0; x < cpuRows; x++) {
		var $tr = $(document.createElement("tr"));
		$table.append($tr);
		for (var y = 0; y < cpuCols; y++) {
			var $td = $(document.createElement("td"));
			$tr.append($td);
			
			var data = cpu.pattern[x][y].split(" ");
			var logic = _findLogicByName(data[0]);
			var group = _findGroupByName(data[1]);
            var not = _findNotByName(data[2]);

			var cell = null;
			if (logic) {
				cell = logic.className;
			}
			if (group) {
				cell += " " + group.className;
			}
            if (not) {
                cell += " " + not.className;
            }

            $td.addClass(_getClassName(cell));

			if (!preview) {
                $td.data({
                    "x" : x,
                    "y" : y
                })
                .attr({
                    "x" : x,
                    "y" : y
                })
                .click(function (e) {
                    var $self = $(e.currentTarget);
                	cpuClick(cpu, $self);
                });
			}
		}
	}
	$("#cpu")
    .addClass("square")
	.empty()
	//.append("<img src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'/>")
	.append($table);

	return $table;
}

function _isBlankCPU(cpu) {
    for (let row = 0; row < cpuRows; row++) {
        for (let col = 0; col < cpuCols; col++) {
            const cparr = cpu.pattern[row][col].split(" ");
            const logic = _findLogicByName(cparr[0]);
            if (logic && (logic.name !== "null")) {
                return false;
            }
        }
    }
    return true;
}

function _findSelfHead(cpu) {
    for (var row = 0; row < cpuRows; row++) {
        for (var col = 0; col < cpuCols; col++) {
            var cparr = cpu.pattern[row][col].split(" ");
            if (cparr[0] === "selfHead") {
                return {row:row, col:col};
            }
        }
    }
    return null;
}

function removeSelfHead(cpu) {
    var head = _findSelfHead(cpu);
    if (head) {
        cpu.pattern[head.row][head.col] = "null";
        $("td[x="+head.row+"][y="+head.col+"]", $("#cpu")).removeClass().addClass(_getClassName("null"));
    }
}

function selfHeadAbsent(cpu) {
    return (_findSelfHead(cpu) === null) && (!_isBlankCPU(cpu));
}

function selectType(cpu, type) {
    if (selectedType) {
        selectedType.$tr.removeClass("selected");
        $cpuTable.removeClass(selectedType.className);
    }
    selectedType = type;
    if (selectedType) {
        selectedType.$tr.addClass("selected");
        $cpuTable.addClass(selectedType.className);
        cpu.type = type.name;
        makeColorGroup(cpu);
        selectColor(selectedColor);
    }
}

function selectLogic(logic) {
	if (selectedLogic) {
		selectedLogic.$tr.removeClass("selected");
	}
	selectedLogic = logic;
	if (selectedLogic) {
		selectedLogic.$tr.addClass("selected");
	}
}

function selectColor(color) {
    if (selectedColor) {
        selectedColor.div.classList.remove("selected");
    }
    selectedColor = color;
    if (selectedColor) {
        selectedColor.div.classList.add("selected");
    }
}

function toggleNot() {
	if (selectedNot) {
        logicNot.$tr.removeClass("selected");
        selectedNot = false;
	} else {
        logicNot.$tr.addClass("selected");
        selectedNot = true;
	}
}

var $paletteTable = null;

function makePalette() {
    var $table = makeTable();
	$table.addClass("select-table palette-table");

	for (var i = 0; i < logicSet.length; i++) {
		var logic = logicSet[i];
		var $tr = $(document.createElement("tr"));
		$table.append($tr);
		logic.$tr = $tr;

		var $td = $(document.createElement("td"));
		$tr.append($td);
		$td.addClass(_getClassName(logic.className));

		$td = $(document.createElement("td"));
		$td.addClass("name");
		$tr.append($td);
		$td.html(logic.text);
		$tr.data({
			"logic": logic
		})
		.click(function (e) {
			var $self = $(e.currentTarget);
			selectLogic($self.data().logic);
		});

	}
	$("#palette").empty().append($table);
	return $table;
}

var $typeTable = null;

function makeTypeGroup(cpu) {
    var $table = makeTable();
    $table.addClass("select-table color-table");

    for (var i = 0; i < logicType.length; i++) {
        var type = logicType[i];
        var $tr = $(document.createElement("tr"));
        $table.append($tr);
        type.$tr = $tr;

        var $td = $(document.createElement("td"));
        $tr.append($td);
        $td.addClass(_getClassName(type.className));

        $td = $(document.createElement("td"));
        $td.addClass("name");
        $tr.append($td);
        $td.html(type.text);
        $tr.data({
            "type": type
        })
        .click(function (e) {
            var $self = $(e.currentTarget);
            selectType(cpu, $self.data().type);
        });

    }
    $("#cpuType").empty().append($table);
    return $table;
}

var $colorTable = null;

function _createColorElement(type, colorGroup) {
    const div = document.createElement("div");
    div.className = "menu color element";
    div.colorGroup = colorGroup;
    div.innerHTML = `<div class="${_getClassName(colorGroup.className)}"></div>${colorGroup.text[type]}`;
    colorGroup.div = div;
    div.onclick = function (e) {
        selectColor(e.currentTarget.colorGroup);
    };
    return div;
}

function makeColorGroup(cpu) {
    const type = cpu.type || "and";

    const groups = document.createElement("div");
    groups.className = "menu color group";
    groups.innerHTML = '"и"';
    groups.append(_createColorElement(type, logicColor[0]));
    const colorGroups = document.createElement("div");
    colorGroups.className = "menu color group";
    colorGroups.innerHTML = type === "and" ? '"и"' : '"или"';
    groups.append(colorGroups);
    for (let i = 1; i < logicColor.length; i++) {
        colorGroups.append(_createColorElement(type, logicColor[i]));
    }
    $("#colors").empty().append(groups);
    return $(groups);
}

var $notTable = null;

function makeNotGroup() {
    var $table = makeTable();
    $table.addClass("select-table color-table");

    var $tr = $(document.createElement("tr"));
    $table.append($tr);
    logicNot.$tr = $tr;

    var $td = $(document.createElement("td"));
    $tr.append($td);
    $td.addClass(_getClassName(logicNot.className));

    $td = $(document.createElement("td"));
    $td.addClass("name");
    $tr.append($td);
    $td.html(logicNot.text);
    $tr.click(function () {
        toggleNot();
    });

    $("#addons").empty().append($table);
    return $table;
}

function copyCPU(cpu) {
    clipboardCPU = JSON.parse(JSON.stringify(cpu));
}

function pasteCPU(cpu) {
    if (clipboardCPU) {
        cpu.type = clipboardCPU.type; 
        for (var row = 0; row < cpuRows; row++) {
            cpu.pattern[row] = JSON.parse(JSON.stringify(clipboardCPU.pattern[row]));
        }
        return true;
    }
    return false;
}

function clearCPU(cpu) {
    for (var row = 0; row < cpuRows; row++) {
        for (var col = 0; col < cpuCols; col++) {
            cpu.pattern[row][col] = "null";
        }
    }
}

function initSelection(cpu) {
    selectType(cpu, _findTypeByName(cpu.type));
    selectLogic(_findLogicByName("selfHead"));
    selectColor(_findGroupByName("and"));
    selectedNot = false;
}

function makeCPUEditor(cpu) {
	makeMenu("cpuMenu", [{
		"name" : "cpuCopy",
		"text" : "Скопировать",
		"click" : function () {
			copyCPU(cpu);
		}
	},{
		"name" : "cpuPaste",
		"text" : "Вставить",
		"click" : function () {
			if (pasteCPU(cpu)) {
                $cpuTable = makeCPU(cpu);
			}
		}
	},{
        "name" : "cpuClear",
        "text" : "Очистить",
        "click" : function () {
            clearCPU(cpu);
            $cpuTable = makeCPU(cpu);
        }
    },{
		"name" : "cpuSave",
		"text" : "Готово",
		"click" : function () {
            if (selfHeadAbsent(cpu)) {
                alert("Паттерн должен содержать голову свой змеи!");
            } else {
                $("#cpuEditor").addClass("hidden");
                $("#snakeEditor").removeClass("hidden");
                selectSnake(selectedSnake);
                sendAllSnakes();
            }
		}
	}]);

	$cpuTable = makeCPU(cpu);

	$paletteTable = makePalette();
    $typeTable = makeTypeGroup(cpu);
	$colorTable = makeColorGroup(cpu);
    $notTable = makeNotGroup();

	initSelection(cpu);

    $(window).trigger("resize");
}
