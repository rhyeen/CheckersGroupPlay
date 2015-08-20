<?php
$folder_ext = "";
require_once $folder_ext . 'php/helper.php';
$js_array = array(
"jquery-1.11.2.min.js", 
"js/controller.js", 
"js/ai.js", 
"View/pixi.dev.js",
"View/square.js",
"View/checker.js",
"View/CheckerBoardView.js",
"Groupplay/js/timer.js");

$head_input = createHeadContent("Checkers VS AI", "", "css/style.css", $js_array);
$js_input = createDefaultJs();

echo <<<HTML_TEXT
<!DOCTYPE html>
<html>
<head>
$head_input

<script type="text/javascript">
$js_input

var gameMode;

	function runGame(difficulty) { $(function ()
	{
		gameMode = difficulty;
		checker_board = new CheckerBoardView();
		game.stopAiMove();
		game = new CheckersGame(checker_board, gameMode, {msgfunc: change_message});
		

		$("#game_status").show();
        $("#restart_button").show();

		checker_board.init_board(game.clickPiece, game.clickSquare, get_canvas_size());
	
		$("#difficultyPicker").hide();
		$("#game").html(checker_board.get_renderer_view());
		$("#game").show();
		

		$("#gamepicker").hide();
		$("#gametable").show();

		//get_canvas_size();
	
        //Begin animation
        if (!animating) 
            start_animating();
	
		game.startGame();
	});
    }

    function restart_game()
    {
    	$("#game").show();
        $("#difficultyChanger").hide();
    	$("#restart_button").show();
    	$("#game_status").show();
    	game.stopAiMove();
		game = new CheckersGame(checker_board, gameMode, {msgfunc: change_message});
		checker_board.reset_board(game.clickPiece, game.clickSquare, get_canvas_size());
	
        $("#game").html(checker_board.get_renderer_view());

		game.startGame();
    }

    function changeDifficulty()
    {
    	$("#game").hide();
    	$("#restart_button").hide();
    	$("#game_status").hide();
    	$("#difficultyChanger").show();
    }
</script>
</head>
<body class="game-container">
<center>
<div id="difficultyPicker">
	<h1 style="text-align: center;">Pick Your Difficulty</h1>
    <div style="text-align: center;">
        <button style="margin-right:40px;" class="button" onclick="runGame(2)">Easy</button> <button style="margin-right:40px;" class="button" onclick="runGame(4)">Hard</button>
        <button class="button" onclick="goHome()">Main Menu</button>
	</div>
</div>
<div id="difficultyChanger" style="display: none;">
	<h1 style="text-align: center;">Pick Your Difficulty</h1>
    <div style="text-align: center;">
        <button style="margin-right:40px;" class="button" onclick="gameMode=2; restart_game();">Easy</button> <button style="margin-right:40px;" class="button" onclick="gameMode=4; restart_game();">Hard</button>
        <button class="button" onclick="goHome()">Main Menu</button>
	</div>
</div>
<div id="game">
    
</div>
<div id="game_status"></div>
<div id="restart_button" style="display:none;">
    <button class="button" style="margin-top:20px; margin-bottom:20px" onclick="restart_game()">Restart Game</button>
    <button class="button" onclick="changeDifficulty()" style="margin-left:20px;">Change Difficulty</button>
    <button class="button" onclick="goHome()" style="margin-left:20px;">Main Menu</button>
</div>

</center>
</body>
</html>
HTML_TEXT;
?>
