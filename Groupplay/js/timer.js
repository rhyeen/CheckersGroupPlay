/**
 * Ryan Saunders
 */
// on page load...
$(function(){	
	//setInterval(countdown(), 1000);
	
	
	//startTimer(time_left);
	
});

//// submit the vote to the db for the current turn under the given user
function registerUser()
{
	var username = $("#usernameRegister").val();
	var team = $('input[name=teamInput]:checked').val();
	//$("#error").html(team);
	requestRegisterUser(username, team);
}

function registerUserAndGetBoard()
{
	var username = $("#usernameRegister").val();
	var team = $('input[name=teamInput]:checked').val();
	
	if(!validateTeam(team))
	{
		$("#error-input").html('Invalid team');
		return;
	}
	
	if(!validateUsername(username))
	{
		$("#error-input").html('Invalid username');
		return;
	}

	setYourTeam(team);
	setYourUsername(username);

	//$("#error").html(team);
	requestRegisterUserAndGetBoard(username, team);
}

function setYourUsername(username)
{
	$("#yourusername").html(username);
}

function validateUsername(username)
{
	if(username !== null && typeof username !== 'undefined' && username !== "")
		return true;
	return false;
}

function validateTeam(team)
{
	if(team === 'red' || team === 'blue')
		return true;
	return false;	
}

function submitMoves(moves)
{
	var username = $("#usernameRegister").val();
	
	var movesstring = moves.join();
	//var moves = $('input:checkbox:checked').map(function() {
    //	return this.value;
	//}).get().join(',');
	
	requestMoveSubmission(username, moves);
	
}

function checkMoves()
{	
	var moves = $('input:checkbox:checked').map(function() {
    	return this.value;
	}).get().join(',');
	
	$("#error").html(moves);
}

//// submit the vote to the db for the current turn under the given user
function submitVote()
{
	var username = $("#usernameForm").val();
	var vote = $("#voteForm").val();
	//var turn = $("#turn").text();
	
	//requestVoteSubmission(username, vote, turn);
	requestMoveSubmission(username, vote);
}

//// set the turn element
function setTurn(turn)
{
	$("#turn").html(turn);
}

//// set the moves element
function setMoves(moves)
{
	$("#moves").html(moves);	
}

//// set the board element
function setBoard(board)
{
	$("#board").html(board);
}

//// set the team element
function setTeam(team, moves)
{
	var current_team = $("#team").text();
	
	// it is the next team's turn only on this condition:
	// is current_team empty (hasn't been set yet
	if (!(!current_team) && current_team !== team)
	{
		informController(moves, team);
	}
	$("#team").html(team);
}

function setYourTeam(team)
{
	$("#yourteam").html(team);
}

function checkTurn(turn, board, team, moves)
{
	// check if the turn has changed
	var current_turn = $("#turn").text();
	// if the current turn is not the updated turn, great!  We have the new turn's board
	if (current_turn !== turn)
	{
		setTurn(turn);
		setBoard(board);
		setTeam(team, moves);
		setMoves(moves);
		return;
	}
	// if they are equal, we must contact the server again until the turn updates
	setTimeout(requestTurnUpdate, 1000);
}

// inform the controller that the time has expired and they should update
// the current game to match the voted move
function informController(moves, team)
{
	//var current_team = $("#team").text();
	//var your_team = $("#yourteam").text();
	// call function only if team has changed to user's team

	game.getLastTurn(moves);
}

// starts the timer at a given time
function startTimer(time_left)
{	
	$("#time").html(time_left);
	// give a 2 second (2000 millisecond) buffer between when the time is up and when we request the next board
	var mUpdate_in = time_left * 1000 + 2000;
	setTimeout(requestUpdate, mUpdate_in);
}

// begin a countdown until the turn has expired
function countdown()
{
	var time = $("#time").text();
	time = time - 1;
	if(time < 0)
		time = 0;
	$("#time").html(time);
}

// register user to a team
function requestRegisterUser(username, team)
{
	$.ajax(
	{
		type:'POST',
		url: 'Groupplay/php/register_user.php',
		data: {username: username, team: team},
		// expected return type
		dataType: "html",
		success: function(response)
		{
			$("#error").html(response);
		},
		error: function( response, options, error )
		{
			$("#error").html("ERROR: " + error + "");
		}
	});

    // return false to disable the submit button
    return false;
}

// same as requestRegisterUser, except we request the board after successfully
// connecting the user
function requestRegisterUserAndGetBoard(username, team)
{
	$.ajax(
	{
		type:'POST',
		url: 'Groupplay/php/register_user.php',
		data: {username: username, team: team},
		// expected return type
		dataType: "html",
		success: function(response)
		{
			$("#error").html(response);
			
			// get the board
			requestBoard();
		},
		error: function( response, options, error )
		{
			$("#error").html("ERROR: " + error + "");
		}
	});

    // return false to disable the submit button
    return false;
}

// called to submit a move to the server
function requestMoveSubmission(username, moves)
{
	var data = username + ',' + moves;
	
	$.ajax(
	{
		type:'POST',
		url: 'Groupplay/validator/validate_move.php',
		data: {data: data},
		// expected return type
		dataType: "html",
		success: function(response)
		{
			$("#error").html(response);
		},
		error: function( response, options, error )
		{
			$("#error").html("ERROR: " + error + "");
		}
	});

    // return false to disable the submit button
    return false;
}

// legacy
// called to submit a vote
function requestVoteSubmission(username, vote, turn)
{
	$.ajax(
	{
		type:'POST',
		url: 'Groupplay/php/submit_vote.php',
		data: {username: username, vote: vote, turnid: turn},
		// expected return type
		dataType: "html",
		success: function(response)
		{
			$("#error").html(response);
		},
		error: function( response, options, error )
		{
			$("#error").html("ERROR: " + error + "");
		}
	});

    // return false to disable the submit button
    return false;
}

// called when we expect the server to actually give us the correct turn
function requestUpdate()
{	
	// restart the clock
	$.ajax(
	{
		url: 'Groupplay/php/get_turn.php',
		dataType: "json",
		success: function(response)
		{	
			startTimer(response['seconds_left']);
			checkTurn(response['turnid'], response['board'], response['team'], response['lastmoves']);
		},
		error: function( response, options, error )
		{
			$("#error").html("ERROR: " + error + "");
		}
	});

    // return false to disable the submit button
    return false;
}

// set up the view and timers for groupplay
function setupGroupPlay(turn, board, team, seconds_left, moves)
{
	startTimer(seconds_left);
	setTurn(turn);
	setBoard(board);
	setTeam(team, moves);
	setInterval(countdown, 1000);
}

// get the current board, turn, and team from the server
function requestBoard()
{	
	$.ajax(
	{
		url: 'Groupplay/php/get_turn.php',
		dataType: "json",
		success: function(response)
		{	
			setupGroupPlay(response['turnid'], response['board'], response['team'], response['seconds_left'], response['lastmoves']);		
			startGroupPlay(response['board'], response['team']);
			checkTurn(response['turnid']-1, response['board'], response['team'], response['lastmoves']);
		},
		error: function( response, options, error )
		{
			$("#error").html("ERROR: " + error + "");
		}
	});

    // return false to disable the submit button
    return false;
}

// called when we need to check if the turn has really changed
function requestTurnUpdate()
{	
	testCounter();
	// restart the clock
	$.ajax(
	{
		url: 'Groupplay/php/get_turn.php',
		dataType: "json",
		success: function(response)
		{			
			checkTurn(response['turnid'], response['board'], response['team'], response['lastmoves']);
		},
		error: function( response, options, error )
		{
			$("#error").html("ERROR: " + error + "");
		}
	});

    // return false to disable the submit button
    return false;
}

// see how many times something is called using this counter.
function testCounter()
{
	var counter = $("#counter").text();
	//
	counter = counter - 0 + 1;
	$("#counter").html(counter);
}