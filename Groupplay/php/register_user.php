<?php
////
//	This code retreives the time left until the turn is over.

require_once("db_connection.php");
require_once("helpers.php");

try
{
	if(isset($_POST['username']) && isset($_POST['team']))
	{
		if ($_POST['team'] === 'red' || $_POST['team'] === 'blue')
		{	
			// insert the username if not already in the db
			// TODO: request username and password to validate move
			$sql = 	"INSERT INTO user (iduser, team) VALUES (:iduser, :team) ON DUPLICATE KEY UPDATE iduser = iduser, team = :team2";
			
			$statement = $database->prepare($sql);
			$statement->bindParam(':iduser', htmlspecialchars($_POST['username']));
			$statement->bindParam(':team', htmlspecialchars($_POST['team']));
			$statement->bindParam(':team2', htmlspecialchars($_POST['team']));
			$statement->execute();
			
			echo "Success.";
		}
		else
		{
			echo "Failed. Bad team name.";
		}
	}
	else
	{
		echo "Failed. Wrong fields set.";
	}
}
catch (PDOException $e)
{
	echo "<p>ERROR: $e</p>";
}