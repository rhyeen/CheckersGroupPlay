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

$head_input = createHeadContent("Checkers Group Play", "", "css/style.css", $js_array);
$js_input = createDefaultJs();

echo <<<HTML_TEXT
<!DOCTYPE html>
<html>
<head>
$head_input

<script type="text/javascript">
$js_input	
	function startGroupPlay(board, team)
	{
		checker_board = new CheckerBoardView();
		game = new CheckersGame(checker_board, 3, {msgfunc: change_message, submitmoves: submitMoves, board: board, currentTeam: team, userTeam: $('input[name=teamInput]:checked').val()});
		checker_board.init_board(game.clickPiece, game.clickSquare, get_canvas_size(), board);
	
	
		//document.getElementById("move_it").onclick = move_checker_button;
		//document.getElementById("delete_it").onclick = delete_checker_button;
		$("#game").html(checker_board.get_renderer_view());
	
		$("#gamepicker").hide();
		$("#gametable").show();
        get_canvas_size();
		$("#groupplay_start").show();
		$("#groupplay").hide();
		$("#main_menu").show();
	
        //Begin animation
        start_animating();
	
		game.startGame();
	}
</script>
</head>
<body>
<div id="groupplay">	
	<header>
    	<h1>Register user</h1>
        <p>If you are a returning user, just provide your information.</p>
        <p class="note">*For demoing purposes, users are not validated so you may pick any user and even change a user's team.</p>
    </header>
	<form>
        
        <label>Enter username:</label>
        <input id="usernameRegister" type="text" name="username" size="20" maxlength="64" value="Test Red">
        <br>
        <label>Team:</label>
        <input id="teamRegister1" type="radio" name="teamInput" value="red" checked><label for="teamRegister1" class="red-label">RED</label>
        <input id="teamRegister2" type="radio" name="teamInput" value="blue"><label for="teamRegister2" class="blue-label">BLUE</label>
        <br>
        <input class="button button-submit" name="button-submit" type="button" value="Let's Play!" onClick="registerUserAndGetBoard()">
        <input class="button" type="button" style="margin-left:40px;" onclick="goHome()" value="Main Menu">
    </form>
    <p id="error-input"></p>
</div>
<div class="game-container">
    <section class="game-hold">
        <div id="game"></div>
        <div id="game_status" style="display:none"></div>
    </section>
    <div id="groupplay_start" style="display:none">
        <section class="top-groupplay">
            <h2>Time left: <span id="time"></span></h2>
            <p>Team <span id="team"></span>'s turn.</p>
        </section>
        <section class="mid-groupplay">
            <p>Username: <span id="yourusername"></span></p>
            <p>Your Team: <span id="yourteam"></span></p>
        </section>
        <section>
            <p style="display:none">Turn: <span id="turn"></span></p>
            <p style="display:none">Board: <span id="board"></span></p>
            <p style="display:none">Last move: <span id="moves"></span></p>
            <p style="display:none">Failed attemps: <span id="counter"></span></p>
        </section>
        <p id="error">$error</p>
        <button id="main_menu" class="button" onclick="goHome()" style="margin-top:20px; display:none;">Main Menu</button>
    </div>
</div>
</body>
</body>
</html>
HTML_TEXT;
?>
