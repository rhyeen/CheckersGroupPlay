<?php

include 'db_config.php';
	
// when dealing with database and PDOs, put everything in try/catch blocks
try
{
	// build the database connection
	// CITE: In class example.  w3schools doesn't include charset, but it makes sense
	$database = new PDO("mysql:host=$server_name;dbname=$db_name;charset=utf8", $db_user_name, $db_password);
	$database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	// Needed for the prepare and execute stuff and for verifying the content.
	// CITE reference: http://stackoverflow.com/questions/10113562/pdo-mysql-use-pdoattr-emulate-prepares-or-not
	$database->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
}
catch (PDOException $e)
{
	$course_list = "<p>Something went wrong: Error Num 404. Contact the webmaster and provide the following error:<br>
					$e</p>";
}

?>

