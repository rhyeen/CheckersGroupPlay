<?php
/**
 *	Make sure to use cron to have it run this code every minute
 *	on the console type:
 	$ crontab -e
 *	and add the following two lines of code:

MAILTO=""
* * * * * /usr/bin/curl -o /var/www/html/temp.txt http://uofu-cs4540-65.cloudapp.net/Projects/n3s/timer/timer.php

 */
require_once("../php/db_connection.php");
require_once("../validator/validate_helper.php");

try
{
	// get the most popular board
	$sql = "SELECT count(boardvote) AS popular, boardvotes.* FROM boardvotes WHERE turnid=(SELECT max(idturn) FROM turntime) GROUP BY boardvote ORDER BY popular DESC limit 1";
	
	$statement = $database->prepare($sql);
	$statement->execute();
	$query_result = $statement->fetch(PDO::FETCH_ASSOC);
	
	// get the current team and board
	$sql = 	"SELECT * FROM turntime WHERE idturn = (SELECT max(idturn) FROM turntime)";		
	$statement = $database->prepare($sql);
	$statement->execute();
	$query_result2 = $statement->fetch(PDO::FETCH_ASSOC);

	if (empty($query_result2))
		exit("Could not contact server.");
	
	// if query_result is null, that means no one voted, and we should wait until someone plays on this turn
	if (empty($query_result))
	{
		// keep the same team and board
		$team = $query_result2['team'];
		$board = $query_result2['board'];
		$moves = $query_result2['lastmoves'];
	}
	else
	{	
		// switch to the opposite team
		$team = 'red';
		if($query_result2['team'] === 'red')
			$team = 'blue';
		$board = $query_result['boardvote'];
		$moves = $query_result['moves'];
		// Check if game has been won
		if(isOver($board))
		{
			// reset the board, reset the team, and start a new game
			$team = 'blue';
			$board = 'XBXBXBXBBXBXBXBXXBXBXBXBXXXXXXXXXXXXXXXXRXRXRXRXXRXRXRXRRXRXRXRX';
			// $moves should be the same, so that they can see the last move that ended the game
			echo "Resetting board.";
		}
	}
	
	// send the current time and board to the server
	$sql = 	"INSERT INTO turntime (time, board, team, lastmoves) VALUES (:datetime, :board, :team, :moves)";
	$statement = $database->prepare($sql);
	$statement->bindParam(':datetime', date("Y-m-d H:i:s"));
	$statement->bindParam(':board', htmlspecialchars($board));
	$statement->bindParam(':team', htmlspecialchars($team));
	$statement->bindParam(':moves', htmlspecialchars($moves));
	$statement->execute();
	
	echo "<p>Success</p>";

}
catch (PDOException $e)
{
	echo "<p>ERROR:$e</p>";
}

?>