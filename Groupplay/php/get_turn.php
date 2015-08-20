<?php
////
//	This code retreives the current turn and current team.

require_once("db_connection.php");
require_once("helpers.php");

try
{
	//// get the current turn time and id
	$sql = 	"SELECT * FROM turntime WHERE idturn = (SELECT max(idturn) FROM turntime)";
			
	$statement = $database->prepare($sql);
	$statement->execute();
	$query_result = $statement->fetch(PDO::FETCH_ASSOC);
	
	if (empty($query_result))
		exit("Could not contact server");
	
	//$request_update_in = sqlGetTimer($datetime);
	$return['seconds_left'] = getTimer();
	$return['turnid'] = $query_result['idturn'];
	$return['board'] = $query_result['board'];
	$return['team'] = $query_result['team'];
	$return['lastmoves'] = $query_result['lastmoves'];

	echo json_encode($return);

}
catch (PDOException $e)
{
	echo "<p>ERROR: $e</p>";
}

?>