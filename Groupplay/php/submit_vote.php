<?php
// legacy

////
//	This code retreives the time left until the turn is over.


require_once("db_connection.php");

try
{
	if(isset($_POST['username']) && isset($_POST['vote']) && isset($_POST['turnid']))
	{
		// get the team the user is on, regardless of what the user said their team was
		$sql = "SELECT * FROM user WHERE iduser = :iduser";
		$statement = $database->prepare($sql);
		$statement->bindParam(':iduser', htmlspecialchars($_POST['username']));
		$statement->execute();
		
		$query_result = $statement->fetch(PDO::FETCH_ASSOC);

		if (empty($query_result))
			exit("Failed. User doesn't exist.");
	
		$team = $query_result['team'];
		
		//// get the current turn and team
		$sql = 	"SELECT * FROM turntime WHERE idturn = (SELECT max(idturn) FROM turntime)";
				
		$statement = $database->prepare($sql);
		$statement->execute();
		$query_result = $statement->fetch(PDO::FETCH_ASSOC);
		
		if (empty($query_result))
			exit("Could not contact server.");
	
		// is the player allowed to play on this turn?
		if($query_result['team'] !== $team)
			exit("Failed. Player unable to play on this turn.");
		else
		{
			$sql = 	"INSERT INTO boardvotes (turnid, userid, boardvote) VALUES (:turnid, :username, :vote) ON DUPLICATE KEY UPDATE userid = userid, turnid = turnid, boardvote = :vote2";
			
			$statement = $database->prepare($sql);
			$statement->bindParam(':username', htmlspecialchars($_POST['username']));
			$statement->bindParam(':turnid', htmlspecialchars($_POST['turnid']));
			$statement->bindParam(':vote', htmlspecialchars($_POST['vote']));
			$statement->bindParam(':vote2', htmlspecialchars($_POST['vote']));
			$statement->execute();
			
			echo "Success";
		}
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