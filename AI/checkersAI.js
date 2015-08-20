// (function(){
	// OnDocumentReady
	document.addEventListener('DOMContentLoaded', onReady, false);

	function onReady() {
		var player = 'red';

		/**

		 	Situations to test:
		 		opening move
		 		basic overtake opportunity
		 		basic king-me opportunity
		 		overtake to king-me opportunity
		 		move leaves another piece vulnerable
		 		move to block a vulnerable piece.
		 		two overtake opportunities, one leads to danger, one doesn't

		*/

		var board = [
			'R', 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null,
			null, 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R',
			'R', 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null,
			null, 	null, 	null, 	'B', 	null, 	null, 	null, 	null, 
			null, 	null, 	null, 	null, 	null, 	null, 	'R', 	null,
			null, 	'B', 	null, 	'B', 	null, 	'B', 	null, 	'B',
			'B', 	null, 	'B', 	null, 	'B', 	null, 	'B', 	null,
			null, 	'B', 	null, 	'B', 	null, 	'B', 	null, 	'B',
		];
		console.warn(calculateBestMove(board, player));

		// board = [
		// 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null,
		// 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R',
		// 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null,
		// 	null, 	null, 	null, 	null, 	null, 	null, 	null, 	null, 
		// 	null, 	null, 	null, 	null, 	null, 	null, 	null, 	null,
		// 	null, 	'B', 	null, 	'B', 	null, 	'B', 	null, 	'B',
		// 	'B', 	null, 	'B', 	null, 	'B', 	null, 	'B', 	null,
		// 	null, 	'B', 	null, 	'B', 	null, 	'B', 	null, 	'B',
		// ];
		// console.warn(calculateBestMove(board, player));

		// board = [
		// 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null,
		// 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R',
		// 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null,
		// 	null, 	null, 	null, 	null, 	null, 	'B', 	null, 	null, 
		// 	null, 	null, 	null, 	null, 	null, 	null, 	null, 	null,
		// 	null, 	null, 	null, 	null, 	null, 	null, 	null, 	null, 
		// 	null, 	null, 	null, 	null, 	null, 	null, 	null, 	null,
		// 	null, 	'B', 	null, 	'B', 	null, 	'B', 	null, 	'B',
		// ];
		// console.warn(calculateBestMove(board, player));

		// board = [
		// 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null,
		// 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R',
		// 	'R', 	null, 	'R', 	null, 	'R', 	null, 	'R', 	null,
		// 	null, 	null, 	null, 	null, 	null, 	null, 	null, 	'B', 
		// 	null, 	null, 	null, 	null, 	null, 	null, 	'R', 	null,
		// 	null, 	null, 	null, 	null, 	null, 	'B', 	null, 	null, 
		// 	null, 	null, 	null, 	null, 	null, 	null, 	null, 	null,
		// 	null, 	'B', 	null, 	'B', 	null, 	'B', 	null, 	'B',
		// ];
		// console.warn(calculateBestMove(board, player));
	}
	// Initialize global variables.
	var invalidScore = -2;
	var vulnerableSpotScore = -1;
	var backRowScore = 0;
	var normalMoveScore = 2;
	var killScore = 3;
	var kingMeScore = 4;
	var redPlayer = 'red';
	var redPawn = 'R';
	var bluePawn = 'B';
	var redKing = 'KR';
	var blueKing = 'KB';

	/***
	*	@author: Joel Saupe
	*
	*	Function calculates the best move for a given player based on the given board.
	*	@returns {position:<string>, move:<string>, score:<int>}
	*/
	function calculateBestMove(board, player) {
		var pawn = (player == redPlayer) ? redPawn : bluePawn;
		var king = (player == redPlayer) ? redKing : blueKing;
		var playerDirection = (player == redPlayer) ? 'down' : 'up';
		runTests(); // Comment out in production.

		// create the initial best move, initialize as invalid.
		var bestMove = {position: -1, move: -1, score: invalidScore};

		// Loop through all pieces to find current player's pieces and calculate possible moves.
		for (var position = 0; position < board.length; position++) {	
			var piece = board[position];

			// If this isn't one of the player's pieces then keep looking.
			if (piece != pawn && piece != king) {
				continue;
			}
			// Find where the move to the upper left would be and calculate its score.
			// If this move is better than the current previous, then update the best move.
			var upLeftMove = calculateMove(position, true, false);
			// console.log(upLeftMove);
			if (upLeftMove.score > bestMove.score) {
				bestMove = upLeftMove;
			}

			// Find where the move to the upper right would be and calculate its score.
			// If this move is better than the current previous, then update the best move.
			var upRightMove = calculateMove(position, true, true);
			// console.log(upRightMove);
			if (upRightMove.score > bestMove.score) {
				bestMove = upRightMove;
			}

			// Find where the move to the bottom left would be and calculate its score.
			// If this move is better than the current previous, then update the best move.
			var downLeftMove = calculateMove(position, false, false);
			// console.log(downLeftMove);
			if (downLeftMove.score > bestMove.score) {
				bestMove = upLeftMove;
			}

			// Find where the move to the bottom right would be and calculate its score.
			// If this move is better than the current previous, then update the best move.
			var downRightMove = calculateMove(position, false, true);
			// console.log(downRightMove);
			if (downRightMove.score > bestMove.score) {
				bestMove = downRightMove;
			}
		}

		// If the spot being checked is currently in danger of attack then we will increase
		// its score by 2. This is so that it will be considered over regular moves.
		if (spotIsVulnerable(position)) {
			bestMove.score -=2;
		}
		// We should jave the best move calculated so lets return it.
		return bestMove;

		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Calculates a move for the current postion.
		*	@param: position {number}
		*	@param: movingUp {bool} - true if calculating a move up.
		*	@param: movingRight {bool} - true if calculating a move to the right.
		*/
		function calculateMove(position, movingUp, movingRight) {
			var checkPosition = position;
			var piece = board[position]; 
			// Initialize this move's results.
			var possibleMove = {
				score: invalidScore,
				position: position,
				move: -1
			};

			// calculate the amount any position change will increment by
			var incrementAmount = 7;
			if ((playerDirection == 'up') && movingUp) {
				incrementAmount = movingRight ? 7 : 9;
			} else if (playerDirection == 'up' && piece != king) {
				return possibleMove;
			}
			 else if (movingUp && playerDirection != 'up' && piece != king) {
				return possibleMove;
			} else {
				incrementAmount = movingRight ? 9 : 7;
			}

			if (movingUp) {
				incrementAmount *= -1;
			}

			// If the piece is on the left wall and trying to move left or if on the right wall and moving right
			// then return an invalid move.
			if ((!movingRight && onLeftEdge(position)) || movingRight && onRightEdge(position)) {
				return possibleMove;
			}

			// Find the square in the next position;
			checkPosition += incrementAmount;
			var checkPiece = board[checkPosition];

			// If the space is empty then set the move as possible.
			if (isEmpty(checkPosition)) {
				possibleMove.move = checkPosition;
				// If the new spot is vulnerable to being attacked.
				if (spotIsVulnerable(checkPosition, position)) {
					possibleMove.score = vulnerableSpotScore;
				}
				// If the piece will be kinged by moving here.
				else if (movingUp && onUpperEdge(checkPosition) && piece != king) {
					possibleMove.score = kingMeScore;
				}
				// Otherwise a normal move.
				else {
					possibleMove.score = normalMoveScore;
				}
			}

			// If the piece in the upper left is an opponent, check to see if it can be jumped.
			else if (isOpponent(checkPosition)) {
				// If opponent is on the left edge then return the invalid move.
				if ((!movingRight && onLeftEdge(checkPosition)) || (movingRight && onRightEdge(checkPosition))) {
					return possibleMove;
				}
				// Check to see if the space is empty.
				var jumpPosition = checkPosition + incrementAmount;
				// If the position behind the opponent is empty then this will be a valid position.
				if (isEmpty(jumpPosition)) {
					// console.log(position, jumpPosition, board[jumpPosition]);
					possibleMove.score = killScore;
					possibleMove.move = jumpPosition;
				}
			}
			// if (position == 27) {
			// 	console.debug(possibleMove);
			// }

			if (spotIsVulnerable(possibleMove.position) && !spotIsVulnerable(possibleMove.position, possibleMove.move)) {
				possibleMove.score += 2;
			}
			return possibleMove;
		}


		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Calculates to see if a position is in dnager of being overtaken by the opponent.
		*	@param: position {number}
		*	@return {bool}
		*/
		function spotIsVulnerable(position, previous) {
			// If the lower left spot is empty or is the previous spot of a potential move (thus would be free)
			// then check to see if the spot in the upper right contains a piece that would be capable of 
			// destroying the player's piece.
			if (isEmpty(position + 9) || (previous != null && previous == position + 9)) {
				if ((playerDirection == 'up' && isOpponent(position - 9)) || isOpponentKing(position - 9)) {
					return true;
				}
			}

			// If the lower right spot is empty or is the previous spot of a potential move (thus would be free)
			// then check to see if the spot in the upper left contains a piece that would be capable of 
			// destroying the player's piece.
			if (isEmpty(position + 7) || (previous != null && previous == position + 7)) {
				if ((playerDirection == 'up' && isOpponent(position - 7)) || isOpponentKing(position - 7)) {
					return true;
				}
			}

			// If the upper left spot is empty or is the previous spot of a potential move (thus would be free)
			// then check to see if the spot in the lower right contains a piece that would be capable of 
			// destroying the player's piece.
			if (isEmpty(position - 9) || (previous != null && previous == position - 9)) {
				if ((playerDirection != 'up' && isOpponent(position + 9)) || isOpponentKing(position + 9)) {
					return true;
				}
			}

			// If the upper right spot is empty or is the previous spot of a potential move (thus would be free)
			// then check to see if the spot in the upper right contains a piece that would be capable of 
			// destroying the player's piece.
			if (isEmpty(position - 7) || (previous != null && previous == position - 7)) {
				if ((playerDirection != 'up' && isOpponent(position + 7)) || isOpponentKing(position + 7)) {
					return true;
				}
			}

			return false;
		}

		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Checks to see if the given position is empty.
		*	@param: position {number}
		*	@return {bool}
		*/
		function  isEmpty(position) {
			var piece = board[position];
			// if (position == 9) {
			// 	console.warn(piece, piece == null);
			// }
			return (piece == null);
		}

		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Checks to see if the given position contains an opponent.
		*	@param: position {number}
		*	@return {bool}
		*/
		function isOpponent(position) {
			var piece = board[position];
			if (piece == null) {
				return false;
			}
			return (piece != pawn && piece != king);
		}

		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Checks to see if the given position contains an opponent's king.
		*	@param: position {number}
		*	@return {bool}
		*/
		function isOpponentKing(position) {
			var piece = board[position];
			if (!isOpponent(position)) {
				return false;
			}
			return (piece == redKing || piece == blueKing);
		}

		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Checks to see if given position is on the left edge of the board.
		*	@param: position {number}
		*	@return {bool}
		*/
		function onLeftEdge(position) {
			return (position + 1) % 8 == 1;
		}

		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Checks to see if given position is on the right edge of the board.
		*	@param: position {number}
		*	@return {bool}
		*/
		function onRightEdge(position) {
			return (position + 1) % 8 == 0;
		}

		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Checks to see if given position is on the upper edge of the board.
		*	@param: position {number}
		*	@return {bool}
		*/
		function onUpperEdge(position) {
			return position < 8;
		}

		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Checks to see if given position is on the bottom edge of the board.
		*	@param: position {number}
		*	@return {bool}
		*/
		function onBottomEdge(position) {
			return position > 55;
		}

		/**
		*	@author: Joel Saupe
		*	@private
		*	
		*	Simple tests to help make sure Checkers AI is working properly.
		*	Prints results to the console.
		*/
		function runTests() {
			console.log('');
			console.log('Test to make sure left edges are calculated correctly.');
			console.log('TEST onLeftEdge(0) Result:', onLeftEdge(0) ? 'PASSED' : 'FAILED');
			console.log('TEST onLeftEdge(7) Result:', !onLeftEdge(7) ? 'PASSED' : 'FAILED');
			console.log('TEST onLeftEdge(48) Result:', onLeftEdge(48) ? 'PASSED' : 'FAILED');
			
			console.log('');
			console.log('Test to make sure right edges are calculated correctly.');
			console.log('TEST onRightEdge(15) Result:', onRightEdge(15) ? 'PASSED' : 'FAILED');
			console.log('TEST onRightEdge(7) Result:', onRightEdge(7) ? 'PASSED' : 'FAILED');
			console.log('TEST onRightEdge(33) Result:', !onRightEdge(33) ? 'PASSED' : 'FAILED');

			console.log('');
			console.log('Test to make sure upper edges are calculated correctly.');
			console.log('TEST onUpperEdge(1) Result:', onUpperEdge(1) ? 'PASSED' : 'FAILED');
			console.log('TEST onUpperEdge(7) Result:', onUpperEdge(7) ? 'PASSED' : 'FAILED');
			console.log('TEST onUpperEdge(63) Result:', !onUpperEdge(63) ? 'PASSED' : 'FAILED');

			console.log('');
			console.log('Test to make sure bottom edges are calculated correctly.');
			console.log('TEST onBottomEdge(1) Result:', !onBottomEdge(1) ? 'PASSED' : 'FAILED');
			console.log('TEST onBottomEdge(7) Result:', !onBottomEdge(7) ? 'PASSED' : 'FAILED');
			console.log('TEST onBottomEdge(63) Result:', onBottomEdge(63) ? 'PASSED' : 'FAILED');
			
			console.log('');
			console.log('Test to make sure opponents are correctly detected.');
			console.log('TEST isOpponent(0) Result:', !isOpponent(0) ? 'PASSED' : 'FAILED');
			console.log('TEST isOpponent(8) Result:', !isOpponent(8) ? 'PASSED' : 'FAILED');
			console.log('TEST isOpponent(63) Result:', isOpponent(63) ? 'PASSED' : 'FAILED');

			console.log('');
			console.log('Test to make sure empty squares are correctly detected.');
			console.log('TEST isEmpty(1) Result:', isEmpty(1) ? 'PASSED' : 'FAILED');
			console.log('TEST isEmpty(7) Result:', isEmpty(7) ? 'PASSED' : 'FAILED');
			console.log('TEST isEmpty(63) Result:', !isEmpty(63) ? 'PASSED' : 'FAILED');

			console.log('');
			console.log('Test piece on left wall so can\'t move left.');
			console.log('TEST calculateMove(0, false, false) Position Result:', (calculateMove(0, false, false).move == -1) ? 'PASSED' : 'FAILED');
			console.log('TEST calculateMove(0, false, false) Score Result:', (calculateMove(0, false, false).score == invalidScore) ? 'PASSED' : 'FAILED');

			console.log('');
			console.log('Test piece on right wall so can\'t move right.');
			console.log('TEST calculateMove(47, true, true) Position Result:', (calculateMove(47, true, true).move == -1) ? 'PASSED' : 'FAILED');
			console.log('TEST calculateMove(47, true, true) Score Result:', (calculateMove(47, true, true).score == invalidScore) ? 'PASSED' : 'FAILED');

			console.log('');
			console.log('Test piece that is blocked so should not be able to move.');
			console.log('TEST calculateMove(2, false, true) Position Result:', (calculateMove(2, false, true).move == -1) ? 'PASSED' : 'FAILED');
			console.log('TEST calculateMove(2, false, true) Score Result:', (calculateMove(2, false, true).score == invalidScore) ? 'PASSED' : 'FAILED');

			console.log('');
			console.log('Test piece that can make a normal move.');
			console.log('TEST calculateMove(22, false, true) Position Result:', (calculateMove(22, false, true).move == 31) ? 'PASSED' : 'FAILED');
			console.log('TEST calculateMove(22, false, true) Score Result:', (calculateMove(22, false, true).score == normalMoveScore) ? 'PASSED' : 'FAILED');
			console.log('TEST calculateMove(22, false, false) Position Result:', (calculateMove(22, false, false).move == 29) ? 'PASSED' : 'FAILED');
			console.log('TEST calculateMove(22, false, false) Score Result:', (calculateMove(22, false, false).score == normalMoveScore) ? 'PASSED' : 'FAILED');

			console.log('');
			console.log('Test piece that is capable of jumping an opponent piece.');
			console.log('TEST calculateMove(45, true, true) Position Result:', (calculateMove(18, false, true).move == 36) ? 'PASSED' : 'FAILED');
			console.log('TEST calculateMove(45, true, true) Score Result:', (calculateMove(18, false, true).score == killScore) ? 'PASSED' : 'FAILED');
			console.log('TEST calculateMove(47, true, true) Position Result:', (calculateMove(20, false, false).move == 34) ? 'PASSED' : 'FAILED');
			console.log('TEST calculateMove(47, true, true) Score Result:', (calculateMove(20, false, false).score == killScore) ? 'PASSED' : 'FAILED');

			console.log('');
			console.log('Test to make sure vulnerabilities are tested correctly.');
			console.log('TEST spotIsVulnerable(38) Result:', spotIsVulnerable(38) ? 'PASSED' : 'FAILED');
			console.log('TEST spotIsVulnerable(45, 52) Result:', spotIsVulnerable(45, 52) ? 'PASSED' : 'FAILED');
			console.log('TEST spotIsVulnerable(63) Result:', !spotIsVulnerable(63) ? 'PASSED' : 'FAILED');
			console.log('TEST spotIsVulnerable(28) Result:', !spotIsVulnerable(28) ? 'PASSED' : 'FAILED');

		}
	}

// })();