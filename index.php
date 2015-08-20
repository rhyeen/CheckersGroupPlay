<?php
$folder_ext = "";
require_once $folder_ext . 'php/helper.php';

$head_input = createHeadContent("Checkers", "", "css/style.css", NULL);

echo <<<HTML_TEXT
<!DOCTYPE html>
<html>
<head>
$head_input
</head>
<body>
<div id="page-container">
	<header>
		<h1>Welcome to Checkers!</h1>
		<p>There are three different gameplay type of this classic game.  Click on a category below to begin playing.</p>
	</header>
	<section class="selection-container">
		<section class="play-group">
			<a href="local.php">
				<h2>Local Play</h2>
				<p>Play against a buddy on the same computer.  Each player will take a turn and wait for the other player to complete their turn.</p>
				<div class="button">Play Local Game</div>
			</a>
		</section>
		<section class="play-group">
			<a href="ai.php">
				<h2>AI Play</h2>
				<p>Compete against the computer in this AI driven game.  The AI is set to medium difficulty and plays the blue team.</p>
				<div class="button">Play Against AI</div>
			</a>
		</section>
		<section class="play-group">
			<a href="group.php">
				<h2>Group Play</h2>
				<p>Choose a team, and play with people all around the world as everyone plays the same time-based checkers game.</p>
				<div class="button">Play Group Play</div>
			</a>
		</section>
	</section>
	<section class="bottom-container">
		<h2>How to Play</h2>
		<p>After starting one of the three game modes, on your turn you may play any valid checkers token.  A valid token is one that is highlighted with a yellow tint.  After selecting a valid token, valid moves will be highlighted on the board.  Click on a valid move location to move your selected token to that location.</p>
		<p>If a token can jump another token, it must jump.  If multiple jumps are possible, you should continue to move the token until it is no longer able to jump.</p>
		<br>
		<h2>Group Play Specifics</h2>
		<p>The rules of Group Play are somewhat different from that of the conventional game. You first need to pick a team and a username.  When it is your team's turn, play a move to submit it as a vote.  The most popular move after the timer expires will be the chosen move for that team.  If no one votes after the timer expires, the timer resets and the team has another 60 seconds to decide.  If no one is playing on the other team but you'd like to demo Group Play, we invite you to open another browser tab and play the opposing team on that tab.</p>
	</section>
</div>
</body>
</html>
HTML_TEXT;
?>
