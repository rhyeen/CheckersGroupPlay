/**
* @author Joel Saupe
*
* Compares all possible moves for the current player and calculates
* which move would be the best based on the specified skill level.
* Function returns its findings to the caller.
* 
* @param {object} helper functions used by this function (getMovablePieces, getPossiblesMoves, getPossibleJumps)
* @param {string} skill level of play to make. ('Easy', 'Hard')
* @param {string} color of player to calculate.
*
* @returns {object{from: {string}, to: {string}, score: {Number}}}
*/
function calculateBestMove(fns, skill, color, board) {
	var bestMove = {
		from: null,
		to: null,
		score: null
	};
	// Grab all of the moves that the player is legally allowed to make.
	var possibleMoveLocations = fns.getMovablePieces(color);
	// Loop through each possible move to calculate the best.
	for (var i = 0; i < possibleMoveLocations.length; i++) {
		var location = possibleMoveLocations[i];
		var moves = fns.getPossibleJumps(location, color);
		if (moves.length < 1) {
			moves = fns.getPossibleMoves(location, color);
		}
	
		for (var j = 0; j < moves.length; j++) {
			var move = moves[j];
			var moveScore = scoreMove(location, move);
			if (moveScore > bestMove.score || bestMove.score == null) {
				bestMove = {
					from: location,
					to: move,
					score: moveScore
				};
			}
		}
	}

	return bestMove;

	/**
	* @author Joel Saupe
	*
	* Calculates the score for the given move based on various factors:
	* 1) If the move leads to a doublejump.
	* 2) If the move results in a King-Me.
	* 3) If the move results in vulernability of self.
	* 4) If the move results in vulnerability of team member.
	* 
	* @param {string} position moving from.
	* @param {string} position moving to.
	*
	* @returns {Number} calculated score.
	*/
	function scoreMove(from, to) {
		// If they want hard, calculate based on certain criteria.
		if (skill == 'Hard') {
			if (onBackRow(from)) {
				return -3;
			}
			if (inDanger(from, to)) {
				return -2;
			}
			if (willBecomeKing(to, from)) {
				return 10;
			}
			if (hugsWall(to)) {
				return 2;
			}
			return 1;
		}

		// Just return a random score to move a random piece.
		return Math.floor((Math.random() * 10) + 1);;	
	}


	/**
	* @author Joel Saupe
	*
	* Checks to see if the position is on the defensive back row for the given color.
	* This is so the AI can avoid moving from the back.
	* 
	* @param {string} board position
	*
	* @returns {bool} true if position on defensive back row for given color.
	*/
	function onBackRow(currentPosition) {
		var row = BoardPosition.row(currentPosition);
		if (color == 'blue' && row == 0 || color == 'red' && row == 7) {
			return true;
		}
		return false;
	}

	/**
	* @author Joel Saupe
	*
	* Checks to see if the position is on the walls of the board.
	* 
	* @param {string} board position
	*
	* @returns {bool}
	*/
	function hugsWall(position) {
		var column = BoardPosition.column(position);
		if (column == 0 || column == 7) {
			return true;
		}
		return false;
	} 


	/**
	* @author Joel Saupe
	*
	* Checks to see if the position will result in a piece becoming a king piece.
	* 
	* @param {string} position the piece might move to.
	* @param {string} current piece position (used to calculate piece's status)
	*
	* @returns {bool}
	*/
	function willBecomeKing(possiblePosition, currentPosition) {
		var currRow = BoardPosition.row(currentPosition);
		var currColumn = BoardPosition.column(currentPosition);
		var status = board.board[currRow][currColumn].status;
		if (status == 'king') {
			return false;
		}
		var row = BoardPosition.row(possiblePosition);
		if (color == 'blue' && row == 7 || color == 'red' && row == 0) {
			return true;
		}
		return false;
	}

	/**
	* @author Joel Saupe
	*
	* Checks to see if a move would result in this piece's imminent death.
	* 
	* @param {string} current position
	* @param {string} possible position
	*
	* @returns {bool}
	*/
	function inDanger(from, to) {
		var toRow = BoardPosition.row(to);
		var toColumn = BoardPosition.column(to);
		var fromRow = BoardPosition.row(from);
		var fromColumn = BoardPosition.column(from);

		// Currently only supports blue side calculations.
		if(color != "blue"){
			return false;
		}
		// Check to make sure the next position will be on the inner body of the board.
		if(toColumn > 0 && toColumn < 7 && toRow > 0 && toRow < 7) {
			// Bottom Left
			if (board.board[toRow + 1][toColumn - 1].team == "red" && (board.board[toRow - 1][toColumn + 1].status == "empty" || (fromRow == toRow -1 && fromColumn == toColumn + 1))) {
				return true;
			}
			// Bottom Right
			if (board.board[toRow + 1][toColumn + 1].team == "red" && (board.board[toRow - 1][toColumn - 1].status == "empty" || (fromRow == toRow -1 && fromColumn == toColumn - 1))) {
				return true;
			}
			// Upper Left
			if (board.board[toRow - 1][toColumn - 1].team == "red" && board.board[toRow - 1][toColumn - 1].status == "king" && (board.board[toRow + 1][toColumn + 1].status == "empty" || (fromRow == toRow + 1 && fromColumn == toColumn + 1))) {
				return true;
			}
			// Upper Right
			if (board.board[toRow - 1][toColumn + 1].team == "red" && board.board[toRow - 1][toColumn + 1].status == "king" && (board.board[toRow + 1][toColumn - 1].status == "empty" || (fromRow == toRow + 1 && fromColumn == toColumn - 1))) {
				return true;
			}
		}
		
		return false;
	}

}