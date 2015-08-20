<?php
/**
 *	Make sure to use cron to have it run this code every minute
 *	on the console type:
 	$ crontab -e
 *	and add the following two lines of code:

MAILTO=""
* * * * * /usr/bin/curl -o /var/www/html/temp.txt http://uofu-cs4540-65.cloudapp.net/Projects/n3s/timer/test.php

 */
require_once("../php/db_connection.php");

try
{
	$sql = 	"INSERT INTO test (date) VALUES (:date)";
			
	$statement = $database->prepare($sql);
	$statement->bindParam(':date', date("Y-m-d H:i:s"));
	$statement->execute();
	
	echo "<p>Success</p>";

}
catch (PDOException $e)
{
	echo "<p>ERROR:$e</p>";
}

?>