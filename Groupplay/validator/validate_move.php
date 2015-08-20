<?php
require_once("../php/db_connection.php");
//require_once("../php/helpers.php");
require_once("validate_helper.php");

try
{
	// check if each move is valid
	if(isset($_POST['data']))
	{
		
		//$data = json_decode(stripslashes($_POST['data']));
		$data = explode(',' , $_POST['data']);	

		// $data[0] should contain the username
		$username = $data[0];
		// first, check if user is allowed to post on this turn
		// get the user's team
		$sql = "SELECT * FROM user WHERE iduser = :iduser";
		$statement = $database->prepare($sql);
		$statement->bindParam(':iduser', htmlspecialchars($username));
		$statement->execute();
		
		$query_result = $statement->fetch(PDO::FETCH_ASSOC);

		if (empty($query_result))
			exit("Failed. User doesn't exist.");
	
		$team = $query_result['team'];
		
		//// get the current turn, board, and team
		$sql = 	"SELECT * FROM turntime WHERE idturn = (SELECT max(idturn) FROM turntime)";
				
		$statement = $database->prepare($sql);
		$statement->execute();
		$query_result = $statement->fetch(PDO::FETCH_ASSOC);
		
		if (empty($query_result))
			exit("Could not contact server.");
		
		// is the player allowed to play on this turn?
		if($query_result['team'] !== $team)
			exit("Failed. Player unable to play on this turn.");
		
		// next, check if given moves are valid
		$turnid = $query_result['idturn'];
		$board = $query_result['board'];
		
		$board = checkMoves($data, $board);
		
		if($board === NULL)
			exit("Failed. Invalid move.");
			
		// if move is valid, send it to the server for this turn
		$sql = 	"INSERT INTO boardvotes (turnid, userid, boardvote, moves) VALUES (:turnid, :username, :vote, :moves) ON DUPLICATE KEY UPDATE userid = userid, turnid = turnid, boardvote = :vote2, moves = :moves2";
			
		$statement = $database->prepare($sql);
		$statement->bindParam(':username', htmlspecialchars($username));
		$statement->bindParam(':turnid', htmlspecialchars($turnid));
		$statement->bindParam(':vote', htmlspecialchars($board));
		$statement->bindParam(':vote2', htmlspecialchars($board));
		$statement->bindParam(':moves', htmlspecialchars($_POST['data']));
		$statement->bindParam(':moves2', htmlspecialchars($_POST['data']));
		$statement->execute();
		
		echo "Success";
		
		
		//echo $board;
	}
	else
	{
		echo "Failed.";	
	}
	
}
catch (PDOException $e)
{
	echo "<p>ERROR: $e</p>";
}

?>