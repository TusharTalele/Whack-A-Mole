var gameRunning,columnsCount, whacksCount, totalTime, remainingTime, selectedBlocks = [], whackedBlocks = [], tries = 1,timer;

function init() {
	columnsCount = parseInt($("#columnsCount").val());
	whacksCount = parseInt($("#whacksCount").val());
	time = parseInt($("#time").val());
}

function validate() {
	init();
	var validated = true;
	if (isNaN(columnsCount) || columnsCount < 2) {
		validated = false;
		$("#columnsCount").addClass("error");
	} else {
		$("#columnsCount").removeClass("error");
	}
	if (isNaN(whacksCount) || whacksCount < 2 || whacksCount >= columnsCount * columnsCount) {
		validated = false;
		$("#whacksCount").addClass("error");
	} else {
		$("#whacksCount").removeClass("error");
	}
	if (isNaN(time) || time < 5) {
		validated = false;
		$("#time").addClass("error");
	} else {
		$("#time").removeClass("error");
	}
	if(validated){
		tries = 1;
		selectedBlocks.length = 0;
		whackedBlocks.length = 0;
	}

	return validated;
}

function startTheGame() {
	if(gameRunning) {
		return;
	}
	var validated = validate();
	if (validated) {
		gameRunning=true;
		totalTime = time * 1000;
		createGameGrid(columnsCount, whacksCount);
		startGame(totalTime);
	} else {
		$("#message").html("Invalid values supplied. Please try again.");
		gameRunning=false;
	}
}

function createColumn(id, clicked, columnWidth, clickedFn) {
	return $("<div class='game-column'></div>")
		.attr("id", id)
		.attr("clicked", clicked)
		.css({width : columnWidth, height: columnWidth})
		.click(clickedFn);
}

function fillRandomly(columnsCount, wackcolumnsCount) {
	selectedBlocks.length = 0;
	for (var i = 0; i < wackcolumnsCount; i++) {
		while(true) {
			var random = Math.floor((Math.random() * columnsCount * 10) + 2) % columnsCount;
			var randomNotAdded = true;
			for (var j = 0; j < selectedBlocks.length; j++) {
				if (random == selectedBlocks[j].id) {
					randomNotAdded = false;
					break;
				}
			}
			if (randomNotAdded) {
				selectedBlocks.push({id: random, wacked: false});
				break;
			}
		}
	}
}

function createColumns(columnsCount) {
	$("#game").children().remove();
	var columnWidth = ($("#game").width() / columnsCount-30) + 'px';
	createGrid(columnsCount, columnWidth);
	$("#game").css({display: 'block'});
}

function startGame(time) {
	for (var i = 0; i < selectedBlocks.length; i++) {
		toggleColumn(whackedBlocks[selectedBlocks[i].id], true);
	}
	remainingTime = time;
	$("#message").html('Remaining time: ' + (remainingTime / 1000));
	timer = setTimeout(countSeconds, 1000);
}

function countSeconds() {
	remainingTime -= 1000;
	$("#message").html('Remaining time: ' + (remainingTime / 1000));
	if (remainingTime == 0) {
		createGameGrid(columnsCount, whacksCount);
		++tries;
		startGame(totalTime);
	} else {
		timer = setTimeout(countSeconds, 1000);
	}
}

function createGrid(columnsCount, columnWidth) {
	for (var i = 0; i < columnsCount * columnsCount; i++) {
		whackedBlocks[i] = createColumn(i, false, columnWidth, clicked);
		$("#game").append(whackedBlocks[i]);
	}
}

function clicked(eventArg) {
	$clickedObj = $(eventArg.target);
	if ($clickedObj.attr('clicked')) {
		toggleColumn($clickedObj, false);
		if (allColumnsCompleted()) {
			clearTimeout(timer);
				alert('You are the winner in ' + tries + ' tries.');
				$("#message").html("Try Again .........................");
				$("#game").delay(1000).fadeOut(remove);
				gameRunning=false;
			}
	}
}
function remove(){
		$("#game").html="";
}

function toggleColumn($column, status) {
	if (status) {
		$column.addClass('clicked');
	} else {
		$column.removeClass('clicked');
		for (var i = 0; i < selectedBlocks.length; i++) {
			if (selectedBlocks[i].id === parseInt($column.attr('id'))) {
				selectedBlocks[i].wacked = true;
			}
		}
	}
	$column.attr('clicked', status);
	
}

function allColumnsCompleted() {
	for (var i = 0; i < selectedBlocks.length; i++) {
		if (!selectedBlocks[i].wacked) {
			return false;
		}
	}
	return true;
}

function createGameGrid(columnsCount, whacksCount) {
	createColumns(columnsCount);
	fillRandomly(columnsCount * columnsCount, whacksCount);
}


$(function() {
	$("#start").click(startTheGame);
})
