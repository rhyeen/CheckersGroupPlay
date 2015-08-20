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

$head_input = createHeadContent("Checkers Local", "", "css/style.css", $js_array);
$js_input = createDefaultJs();

echo <<<HTML_TEXT
<!DOCTYPE html>
<html>
<head>
$head_input

<script type="text/javascript">
$js_input

var gameMode;

	$(function ()
	{
		gameMode = 1;
		checker_board = new CheckerBoardView();
		game = new CheckersGame(checker_board, gameMode, {msgfunc: change_message});
		checker_board.init_board(game.clickPiece, game.clickSquare, get_canvas_size());
	
		$("#game").html(checker_board.get_renderer_view());
        $("#restart_button").show();
	
        //Begin animation
		start_animating();
	
		game.startGame();
    });

    function restart_game()
    {
		game = new CheckersGame(checker_board, gameMode, {msgfunc: change_message});
		checker_board.reset_board(game.clickPiece, game.clickSquare, get_canvas_size());
	
//		$("#game").html(checker_board.get_renderer_view());

		game.startGame();
    }
</script>
</head>
<body>
<div class="game-container">
<div id="game"></div>
<div id="game_status"></div>
<div id="restart_button" style="display: none; text-align: center;">
    <button class="button" style="margin-top:20px; margin-bottom:20px;" onclick="restart_game()">Restart Game</button>
    <button class="button" onclick="goHome()" style="margin-left:20px;">Main Menu</button>
</div>
</div>
</body>
</body>
</html>
HTML_TEXT;
?>
