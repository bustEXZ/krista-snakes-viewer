// ==========================================================================================================
// контстанты (совсем системные); например, зависят от графики или настроек css
// не подлежат изменению в процессе работы ни при каких условиях!
// содержит только объекты и переменные! никаких функций
// не должен зависеть от других модулей
//
// группа загрузки: 0
//
// текущие зависимости: нету и не будет никогда
//
// ==========================================================================================================

// размеры и внутренняя разметка тайла
const
	cpuCols = 7,
	cpuRows = 7,

	countCPU = 9,

	startSnakeLength = 8;

const
	spritePrefix = "snake";
	logicPrefix = "logic";
	iconPrefix = "icon";

// набор базовых спрайтов змеи
// className - имя класса в css без суффикса вариантов
// variants - количество графических вариантов
const
	spriteSet = {
	"head" : {
		"className" : "head",
		"variants" : 1
	},
	"straight" : {
		"className" : "straight",
		"variants" : 1
	},
    "bent" : {
		"className" : "bent",
		"variants" : 1
	},
    "tail" : {
		"className" : "tail",
		"variants" : 1
	}
};

const
	logicSet =
	[{
		"name" : "selfHead",
		"text" : "своя голова",
		"className" : "head self",
		"variants" : 1
	},{
		"name" : "selfBody",
		"text" : "своё тело",
		"className" : "body self",
		"variants" : 1
	},{
		"name" : "selfTail",
		"text" : "свой хвост",
		"className" : "tail self",
		"variants" : 1
	},{
        "name" : "selfSomething",
        "text" : "что-то свое",
        "className" : "something self",
        "variants" : 1
    },{
		"name" : "enemyHead",
		"text" : "чужая голова",
		"className" : "head enemy",
		"variants" : 1
	},{
		"name" : "enemyBody",
		"text" : "чужое тело",
		"className" : "body enemy",
		"variants" : 1
	},{
		"name" : "enemyTail",
		"text" : "чужой хвост",
		"className" : "tail enemy",
		"variants" : 1
	},{
        "name" : "enemySomething",
        "text" : "что-то чужое",
        "className" : "something enemy",
        "variants" : 1
    },{
		"name" : "barier",
		"text" : "барьер",
		"className" : "barier",
		"variants" : 1
	},{
		"name" : "blank",
		"text" : "пустое поле",
		"className" : "empty",
		"variants" : 1
	},{
		"name" : "null",
		"text" : "любое поле",
		"className" : "null",
		"variants" : 1
	}];

const
	logicType = [
    {
        "name" : "and",
        "text" : "схема \"и\"",
        "className" : "cpu-and"
    },{
        "name" : "or",
        "text" : "схема \"или\"",
        "className" : "cpu-or"
    }];

const
	logicColor = [
	{
        "name" : "and",
        "text" : {
            "and" : "без группы \"и\"",
            "or" : "без группы \"и\""
        },
        "className" : "color group0"
	},{
        "name" : "or1",
        "text" : {
        	"and" : "группа \"или\"",
            "or" : "группа \"и\""
        },
        "className" : "color group1"
    },{
		"name" : "or2",
        "text" : {
            "and" : "группа \"или\"",
            "or" : "группа \"и\""
        },
		"className" : "color group2"
	},{
		"name" : "or3",
        "text" : {
            "and" : "группа \"или\"",
            "or" : "группа \"и\""
        },
		"className" : "color group3"
	},{
		"name" : "or4",
        "text" : {
            "and" : "группа \"или\"",
            "or" : "группа \"и\""
        },
		"className" : "color group4"
	}];

const
	logicNot = {
        "name" : "not",
        "text" : "\"кроме\"",
        "className" : "not"
    };

const
	directionDelta = {
	"up": {
		"deltaCol" : 0,
		"deltaRow" : -1
	},
	"left": {
		"deltaCol" : -1,
		"deltaRow" : 0
	},
	"right": {
		"deltaCol" : 1,
		"deltaRow" : 0
	},
	"down": {
		"deltaCol" : 0,
		"deltaRow" : 1
	},
    "none": {
        "deltaCol" : 0,
        "deltaRow" : 0
    }
};

const directionText = {
	"up": "вверх",
	"left": "влево",
	"right": "вправо",
	"down": "вниз",
	"none": "никуда"
};

const
	directionParse = [
	[null, "up", null],
	["left", null, "right"],
	[null, "down", null]
];

const
	classBodyParse = {
	"up":{
		"down": spritePrefix + " " + spriteSet.straight.className + " " + "deg0",
		"left": spritePrefix + " " + spriteSet.bent.className + " " + "deg0",
		"right": spritePrefix + " " + spriteSet.bent.className + " " +  "deg90"
		},
	"down":{
		"up": spritePrefix + " " + spriteSet.straight.className + " " + "deg0",
		"left": spritePrefix + " " + spriteSet.bent.className + " " + "deg270",
		"right": spritePrefix + " " + spriteSet.bent.className + " " + "deg180"
		},
	"right":{
		"left": spritePrefix + " " + spriteSet.straight.className + " " + "deg90",
		"up": spritePrefix + " " + spriteSet.bent.className + " " + "deg90",
		"down": spritePrefix + " " + spriteSet.bent.className + " " + "deg180"
		},
	"left":{
		"right": spritePrefix + " " + spriteSet.straight.className + " " + "deg90",
		"up": spritePrefix + " " + spriteSet.bent.className + " " + "deg0",
		"down": spritePrefix + " " + spriteSet.bent.className + " " + "deg270"
		}
};

const
	classHeadParse = {
	"up": spritePrefix + " " + spriteSet.head.className + " " + "deg180",
	"down": spritePrefix + " " + spriteSet.head.className + " " + "deg0",
	"right": spritePrefix + " " + spriteSet.head.className + " " + "deg270",
	"left": spritePrefix + " " + spriteSet.head.className + " " + "deg90"
};

const
	classTailParse = {
	"up": spritePrefix + " " + spriteSet.tail.className + " " + "deg0",
	"down": spritePrefix + " " + spriteSet.tail.className + " " + "deg180",
	"right": spritePrefix + " " + spriteSet.tail.className + " " + "deg90",
	"left": spritePrefix + " " + spriteSet.tail.className + " " + "deg270"
};
