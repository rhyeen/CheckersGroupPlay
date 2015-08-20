<?php

// CITE: http://stackoverflow.com/questions/16765158/date-it-is-not-safe-to-rely-on-the-systems-timezone-settings-in-codeigniter
if( ! ini_get('date.timezone') )
{
	date_default_timezone_set('GMT');
}

//// 
//	Check the server to see what time the timer has been set for.
//	From that time, we should technically have 60 seconds until the turn is over.
//	Return the amount of time we have until the turn is over + some buffer
//	
//	In practice, this isn't useful since the server ALWAYS sets these times to be
//	right after the minute mark (usually 1 to 2 seconds after the minute mark
//	with a max of 7 seconds after the minute mark).
function sqlGetTimer ($datetime)
{	


	//// check the turn time against the current time
	$now = new DateTime('now');
	$then = new DateTime($datetime);
	$request_update_in = $now->getTimestamp() - $then->getTimestamp();
	if($request_update_in < 0)
		$request_update_in = (-1) * $request_update_in;
	// give the server a 10 second buffer since not all timestamps happen in exactly 60 seconds
	$request_update_in = 60 - $request_update_in + 10;
	// if the waittime is still somehow longer, just set the waittime to 5 seconds
	if($request_update_in < 0)
		$request_update_in = 5;
	
	return $request_update_in;
}

//	Get the 60 - current time's seconds
//	Player has this many seconds left to make a choice that will guarantee 
//	to be on this turn (not taking into account latency).  
//
//	This is because the server-side timer ALWAYS expires right AFTER the 
//	minute mark (usually 1 to 2 seconds after the minute mark with a max 
//	of 7 seconds after the minute mark). 
function getTimer ()
{
	$now = new DateTime('now');

    $seconds_left = $now->format('s');
	$seconds_left = 60 - $seconds_left;
	
	return $seconds_left;
}
?>