<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

require_once("php/db_connection.php");
require_once("php/helpers.php");

$error = "";
$seconds_left = "200";
$turnid = "-1";
$counter_start = "0";

$board_html = "";

try
{
	//// get the current turn time and id
	$sql = 	"SELECT * FROM turntime WHERE idturn = (SELECT max(idturn) FROM turntime)";
			
	$statement = $database->prepare($sql);
	$statement->execute();
	$query_result = $statement->fetch(PDO::FETCH_ASSOC);
	
	if (empty($query_result))
		exit("Could not contact server");

	$datetime = $query_result['time'];
	$turnid = $query_result['idturn'];
	$board = $query_result['board'];
	$team = $query_result['team'];
	$moves = $query_result['lastmoves'];
	
	//$request_update_in = sqlGetTimer($datetime);
	//echo "<p>Time left: $request_update_in on turn $turnid until request server update</p>";
	$seconds_left = getTimer();

	//echo "<p>Player has $seconds_left seconds left to make a choice that will guarantee to be on this turn (not taking into account latency)</p>";
	
	// create checkbox board
	for ($i = 0; $i < 8; $i++)
	{
		for ($j = 0; $j < 8; $j++)
		{
			$index = $i * 8 + $j;
			
			$style = 'style="background-color:';
			if($board[$index] === 'B')
				$style .= 'blue; color: blue"';
			else if($board[$index] === 'R')
				$style .= 'red; color: red"';
			else if($board[$index] === 'Q')
				$style .= 'orange; color: orange"';
			else if($board[$index] === 'K')
				$style .= 'green; color: green"';
			else
				$style .= 'black; color: black"';
			
			$board_html .= '<input id='. $index .'" type="checkbox" name="moves" value="'. $index .'"><span '. $style .'>X</span>';
		}
		$board_html .= '<br>';
	}

}
catch (PDOException $e)
{
	$error = "<p>ERROR:$e</p>";
}

echo <<<HTML_TEXT
<!doctype html> 
<html>
<head>
    <style type="text/css"></style>
	<meta charset="UTF-8">
    <title></title>
    <meta name="viewport" content="width=device-width">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script type="text/javascript" src="js/timer.js"></script>
     <script type="text/javascript">
		$(function(){	
			var time_left = $seconds_left;	
			startTimer(time_left);
			setInterval(countdown, 1000);
			
			setTurn($turnid);
		});		
    </script>
</head>
<body>
	<div class="page-container">
		<p>Time left: <span id="time"></span></p>
        <p>Turn: <span id="turn">$turnid</span></p>
        <p>Board: <span id="board">$board</span></p>
        <p>Team: <span id="team">$team</span></p>
        <p>Last move: <span id="moves">$moves</span></p>
        <p>Failed attemps: <span id="counter">$counter_start</span></p>
        <form>
        	<h3>Register user</h3>
			<label>Enter username:</label>
            <input id="usernameRegister" type="text" name="username" size="20" maxlength="64" value="">
            <label>Team:</label>
            <input id="teamRegister1" type="radio" name="teamInput" value="red">red
            <input id="teamRegister2" type="radio" name="teamInput" value="blue">blue
			<input class="button button-submit" name="button-submit" type="button" value="Submit vote" onClick="registerUser()">
		</form>
        
        <!--<form>
        	<h3>Vote on move</h3>
			<label>Enter username:</label>
            <input id="usernameForm" type="text" name="username" size="20" maxlength="45" value="">
            <label>Enter vote:</label>
            <input id="voteForm" type="text" name="vote" size="20" maxlength="64" value="">
			<input class="button button-submit" name="button-submit" type="button" value="Submit vote" onClick="submitVote()">
		</form>-->
        
        <form>
        	<h3>Make moves</h3>
            <label>Enter username:</label>
            <input id="usernameMoves" type="text" name="username" size="20" maxlength="45" value=""><br />
            <label>Enter moves:</label>
            <input id="movesMoves" type="text" name="moves" size="20" maxlength="45" value=""><br />
            
            $board_html
            <input class="button button-submit" name="button-submit" type="button" value="Check moves" onClick="checkMoves()">
			<input class="button button-submit" name="button-submit" type="button" value="Submit vote" onClick="submitMoves()">
            
		</form>
        <p id="error">$error</p>
    </div>
</body>
</html>
HTML_TEXT;

?>