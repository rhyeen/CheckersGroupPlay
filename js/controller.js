
/* Helper Namespaces */

(function(BoardPosition, $, undefined){
	BoardPosition.getLocation = function(row,column){
		return (8*row) + column;
	};

	BoardPosition.row = function(position){
		return Math.floor(position / 8);
	};

	BoardPosition.column = function(position){
		return position % 8;
	};
}(window.BoardPosition = window.BoardPosition || {}, jQuery));

/* End helper namespaces */


/* Model of board */

function CheckersBoard(){
	this.board = [
		[{"team": "none","status": "empty"},{"team": "blue","status": "regular"},
		{"team": "none","status": "empty"},{"team": "blue","status": "regular"},
		{"team": "none","status": "empty"},{"team": "blue","status": "regular"},
		{"team": "none","status": "empty"},{"team": "blue","status": "regular"}],
		[
		{"team": "blue","status": "regular"},{"team": "none","status": "empty"},
		{"team": "blue","status": "regular"},{"team": "none","status": "empty"},
		{"team": "blue","status": "regular"},{"team": "none","status": "empty"},
		{"team": "blue","status": "regular"},{"team": "none","status": "empty"}],
		[{"team": "none","status": "empty"},{"team": "blue","status": "regular"},
		{"team": "none","status": "empty"},{"team": "blue","status": "regular"},
		{"team": "none","status": "empty"},{"team": "blue","status": "regular"},
		{"team": "none","status": "empty"},{"team": "blue","status": "regular"}],
		[{"team":"none","status":"empty"},{"team":"none","status":"empty"},
		{"team":"none","status":"empty"},{"team":"none","status":"empty"},
		{"team":"none","status":"empty"},{"team":"none","status":"empty"},
		{"team":"none","status":"empty"},{"team":"none","status":"empty"}],
		[{"team":"none","status":"empty"},{"team":"none","status":"empty"},
		{"team":"none","status":"empty"},{"team":"none","status":"empty"},
		{"team":"none","status":"empty"},{"team":"none","status":"empty"},
		{"team":"none","status":"empty"},{"team":"none","status":"empty"}],
		[{"team": "red","status": "regular"},{"team": "none","status": "empty"},
		{"team": "red","status": "regular"},{"team": "none","status": "empty"},
		{"team": "red","status": "regular"},{"team": "none","status": "empty"},
		{"team": "red","status": "regular"},{"team": "none","status": "empty"}],
		[{"team": "none","status": "empty"},{"team": "red","status": "regular"},
		{"team": "none","status": "empty"},{"team": "red","status": "regular"},
		{"team": "none","status": "empty"},{"team": "red","status": "regular"},
		{"team": "none","status": "empty"},{"team": "red","status": "regular"}],
		[{"team": "red","status": "regular"},{"team": "none","status": "empty"},
		{"team": "red","status": "regular"},{"team": "none","status": "empty"},
		{"team": "red","status": "regular"},{"team": "none","status": "empty"},
		{"team": "red","status": "regular"},{"team": "none","status": "empty"}]
	];

	this.setBoard = function(board){
		for(var i = 0; i < 8; i++){
			for(var j = 0; j < 8; j++){
				var piecetype = board.substr(BoardPosition.getLocation(j,i),1);
				if(piecetype == "B"){
					this.board[j][i] = {
						"team": "blue",
						"status": "regular"
					};
				}
				else if(piecetype == "R"){
					this.board[j][i] = {
						"team": "red",
						"status": "regular"
					};
				}
				else if(piecetype == "K"){
					this.board[j][i] = {
						"team": "blue",
						"status": "king"
					};
				}
				else if(piecetype == "Q"){
					this.board[j][i] = {
						"team": "red",
						"status": "king"
					};
				}
				else if(piecetype == "X"){
					this.board[j][i] = {
						"team": "none",
						"status": "empty"
					};
				}
			}
		}
	};
}

CheckersBoard.prototype.getBoard = function(){
	var tempboard = "";
	for(var i = 0; i < 8; i++){
		for(var j = 0; j < 8; j++){
			if(this.board[i][j].team == "none"){
				tempboard = tempboard + "X";
			}
			else if(this.board[i][j].team == "red"){
				if(this.board[i][j].status == "regular")
					tempboard = tempboard + "R";
				else if(this.board[i][j].status == "king")
					tempboard = tempboard + "Q";
				else
					tempboard = tempboard + "?";
			}
			else if(this.board[i][j].team == "blue"){
				if(this.board[i][j].status == "regular")
					tempboard = tempboard + "B";
				else if(this.board[i][j].status == "king")
					tempboard = tempboard + "K";
				else
					tempboard = tempboard + "?";
			}
			else{
				tempboard = tempboard + "?";
			}
		}
	}
	return tempboard;
};

/* End Model */



/* Controller of Board */

function CheckersGame(checkerView, game_type, options){
	var board = new CheckersBoard();
	if(typeof options.board !== 'undefined')
		board.setBoard(options.board);

	var view = checkerView;

	function getPossibleJumps(location, color){
		if(color != turnColor)
			return [];

		if(serverturn == 0 && gameType == "groupplay" && color != teamColor)
			return [];
		
		if(turn.length !== 0){
			if(turn[turn.length -1] != location){
				return [];
			}
		}

		var moves = [];
		var row = BoardPosition.row(location);
		var column = BoardPosition.column(location);

		if(board.board[row][column].team != turnColor)
			return [];

		if(board.board[row][column].team == "red"){
			if(column > 1 && row > 1 && board.board[row - 1][column - 1].team == "blue" && board.board[row - 2][column - 2].status == "empty"){
				moves.push(BoardPosition.getLocation(row - 2, column - 2));
			}

			if(column < 6 && row > 1 && board.board[row - 1][column + 1].team == "blue" && board.board[row - 2][column + 2].status == "empty"){
				moves.push(BoardPosition.getLocation(row - 2, column + 2));
			}

			if(board.board[row][column].status == "king"){
				if(column > 1 && row < 6 && board.board[row + 1][column - 1].team == "blue" && board.board[row + 2][column - 2].status == "empty"){
					moves.push(BoardPosition.getLocation(row + 2, column - 2));
				}

				if(column < 6 && row < 6 && board.board[row + 1][column + 1].team == "blue" && board.board[row + 2][column + 2].status == "empty"){
					moves.push(BoardPosition.getLocation(row + 2, column + 2));
				}
			}
		}
		else if(board.board[row][column].team == "blue"){
			if(column > 1 && row < 6 && board.board[row + 1][column - 1].team == "red" && board.board[row + 2][column - 2].status == "empty"){
				moves.push(BoardPosition.getLocation(row + 2, column - 2));
			}

			if(column < 6 && row < 6 && board.board[row + 1][column + 1].team == "red" && board.board[row + 2][column + 2].status == "empty"){
				moves.push(BoardPosition.getLocation(row + 2, column + 2));
			}

			if(board.board[row][column].status == "king"){
				if(column > 1 && row > 1 && board.board[row - 1][column - 1].team == "red" && board.board[row - 2][column - 2].status == "empty"){
					moves.push(BoardPosition.getLocation(row - 2, column - 2));
				}

				if(column < 6 && row > 1 && board.board[row - 1][column + 1].team == "red" && board.board[row - 2][column + 2].status == "empty"){
					moves.push(BoardPosition.getLocation(row - 2, column + 2));
				}
			}
		}

		return moves;
	}

	function getPossibleMoves(location, color){
		if(turn.length !== 0)
			return [];

		if(color != turnColor)
			return [];

		if(serverturn == 0 && gameType == "groupplay" && color != teamColor)
			return [];

		var moves = [];
		var row = BoardPosition.row(location);
		var column = BoardPosition.column(location);

		if(board.board[row][column].team != turnColor)
			return [];

		if(board.board[row][column].team == "red"){
			if(column > 0 && row > 0 && board.board[row - 1][column - 1].status == "empty"){
				moves.push(BoardPosition.getLocation(row - 1, column - 1));
			}

			if(column < 7 && row > 0 && board.board[row - 1][column + 1].status == "empty"){
				moves.push(BoardPosition.getLocation(row - 1, column + 1));
			}

			if(board.board[row][column].status == "king"){
				if(column > 0 && row < 7 && board.board[row + 1][column - 1].status == "empty"){
					moves.push(BoardPosition.getLocation(row + 1, column - 1));
				}

				if(column < 7 && row < 7 && board.board[row + 1][column + 1].status == "empty"){
					moves.push(BoardPosition.getLocation(row + 1, column + 1));
				}
			}
		}
		else if(board.board[row][column].team == "blue"){
			if(column > 0 && row < 7 && board.board[row + 1][column - 1].status == "empty"){
				moves.push(BoardPosition.getLocation(row + 1, column - 1));
			}

			if(column < 7 && row < 7 && board.board[row + 1][column + 1].status == "empty"){
				moves.push(BoardPosition.getLocation(row + 1, column + 1));
			}

			if(board.board[row][column].status == "king"){
				if(column > 0 && row > 0 && board.board[row - 1][column - 1].status == "empty"){
					moves.push(BoardPosition.getLocation(row - 1, column - 1));
				}

				if(column < 7 && row > 0 && board.board[row - 1][column + 1].status == "empty"){
					moves.push(BoardPosition.getLocation(row - 1, column + 1));
				}
			}
		}

		return moves;


	}

	function movePiece(start,finish,color){
		if(start < 0 || start > 63 || finish < 0 || finish > 63)
			return false;

		//Make sure it is the correct turn
		if(color != turnColor)
			return false;

		if(serverturn == 0 && gameType == "groupplay" && color != teamColor)
			return false;

		//Make sure the piece being moved is the correct color
		if(board.board[BoardPosition.row(start)][BoardPosition.column(start)].team != color)
			return false;

		//Make sure the position being moved to is empty
		if(board.board[BoardPosition.row(finish)][BoardPosition.column(finish)].status != "empty")
			return false;

		//Get possible moves
		var possibleMoves = getPossibleMovesWrapper(start, color);

		//Check to make sure it is a possible move
		for(var i = 0; i < possibleMoves.length; i++){
			if(possibleMoves[i] == finish){
				var startRow = BoardPosition.row(start);
				var startColumn = BoardPosition.column(start);
				var endRow = BoardPosition.row(finish);
				var endColumn = BoardPosition.column(finish);
				
				view.unhighlight_all();

				if(Math.abs(startRow - endRow) == 1){
					board.board[endRow][endColumn] = board.board[startRow][startColumn];
					board.board[startRow][startColumn] = {"team":"none","status":"empty"};

					//send move
					view.move_checker(startColumn,startRow,endColumn,endRow);

					if((endRow == 0 && turnColor == "red") || (endRow == 7 && turnColor == "blue")){
						board.board[endRow][endColumn].status = "king";

						//send kingme
						view.king_piece(endColumn,endRow);
					}

					turn.push(start);
					turn.push(finish);

					if(gameType == "groupplay"){
						if(serverturn == 0)
							submitMoves(turn);
						return true;
					}

					changeTurn();
					return true;

				}
				if(Math.abs(startRow - endRow) == 2){
					board.board[endRow][endColumn] = board.board[startRow][startColumn];
					board.board[startRow][startColumn] = {"team":"none","status":"empty"};

					//send move
					view.move_checker(startColumn,startRow,endColumn,endRow);

					var middleRow = (startRow + endRow) / 2;
					var middleColumn = (startColumn + endColumn) / 2;
					board.board[middleRow][middleColumn] = {"team":"none","status":"empty"};

					//send delete 
					view.delete_checker(middleColumn,middleRow);
					
					if(turn.length == 0){
						turn.push(start);
					}
					turn.push(finish);
					highlightMovablePieces();

					if((endRow == 0 && turnColor == "red") || (endRow == 7 && turnColor == "blue")){
						board.board[endRow][endColumn].status = "king";

						//send kingme
						view.king_piece(endColumn,endRow);

						if(gameType == "groupplay"){
							if(serverturn == 0)
								submitMoves(turn);
							return true;
						}

						changeTurn();
						return true;
					}

					if(getPossibleJumps(finish, color).length == 0){
						if(gameType == "groupplay"){
							if(serverturn == 0)
								submitMoves(turn);
							return true;
						}

						changeTurn();
						return true;
					}
				}

				
			}
		}

		return false;
	}

	function redMove(start,finish){
		return movePiece(start,finish,"red");
	}

	function blueMove(start,finish){
		return movePiece(start,finish,"blue");
	}

	function determineWinner(){}

	function checkEndGame(){
		serverturn = 1;
		var moves = getMovablePieces(turnColor);
		if(moves.length === 0){
			if(turnColor == "blue"){
				msgfunc(redWinMsg);
			}
			else if(turnColor == "red"){
				msgfunc(blueWinMsg);
			}
			//msgfunc("End game");
			serverturn = 0;
			return true;
		}
		serverturn = 0;
		return false;
	}

	function changeTurn(){
		turn = [];
		//check endgame
		if(turnColor == "red"){
			turnColor = "blue";
			// msgfunc(blueTurnMsg);
			// If the game is against the AI, tell the computer to play its turn.
			// if (gameType == 'AI' && turnColor === 'blue') {
			// 	// window.setInterval(function(){
			// 		playBestMove(skillLevel);
			// 	// }, 1000);
			// }
		}
		else if(turnColor == "blue"){
			turnColor = "red";
			// msgfunc(redTurnMsg);
		}

		if(!checkEndGame()){
			if(turnColor == "red"){
				msgfunc(redTurnMsg);
			}
			else if(turnColor == "blue"){
				msgfunc(blueTurnMsg);
				if (gameType == 'AI') {
					aitimeout = setTimeout(function(){
						playBestMove(skillLevel);
					}, 1000);
					return;
				}
			}
			highlightMovablePieces();
		}


		
	}

	function getMovablePieces(color){
		if(color != turnColor)
			return [];

		if(serverturn == 0 && gameType == "groupplay" && color != teamColor)
			return [];

		var pieces = [];

		//Check for jumps first
		for(var i = 0; i < 8; i++){
			for(var j = 0; j < 8; j++){
				if(board.board[i][j].team == turnColor){
					if(getPossibleJumps(BoardPosition.getLocation(i,j),color).length > 0){
						pieces.push(BoardPosition.getLocation(i,j));
					}
				}
			}
		}

		if(pieces.length > 0){
			return pieces;
		}

		//No jumps, check for regular moves
		for(var i = 0; i < 8; i++){
			for(var j = 0; j < 8; j++){
				if(board.board[i][j].team == turnColor){
					if(getPossibleMoves(BoardPosition.getLocation(i,j),color).length > 0){
						pieces.push(BoardPosition.getLocation(i,j));
					}
				}
			}
		}
		return pieces;
	}

	function getPossibleMovesWrapper(location, color){
		var pieces = getMovablePieces(color);
		for(var i = 0; i < pieces.length; i++){
			if(pieces[i] == location){
				var moves = getPossibleJumps(location, color);
				if(moves.length > 0)
					return moves;
				moves = getPossibleMoves(location, color);
				return moves;
			}
		}
		return [];
	}

	function redMovablePieces(){
		return getMovablePieces("red");
	}

	function blueMovablePieces(){
		return getMovablePieces("blue");
	}

	function redPossibleMoves(location){
		return getPossibleMovesWrapper(location,"red");
	}

	function bluePossibleMoves(location){
		return getPossibleMovesWrapper(location,"blue");
	}

	this.getLastTurn = function(moves){
		//alert(moves);	
		turn = [];
		var movesarray = moves.split(",");
		board.setBoard(currentBoard);
		//view.init_board(this.clickPiece, this.clickSquare, get_canvas_size(), currentBoard);
		view.update_board(currentBoard, get_canvas_size());
		serverturn = 1;
		for(var i = 1; i < movesarray.length - 1; i++){
			var startRow = BoardPosition.row(movesarray[i]);
			var startColumn = BoardPosition.column(movesarray[i]);
			var endRow = BoardPosition.row(movesarray[i+1]);
			var endColumn = BoardPosition.column(movesarray[i+1]);
			movePiece(movesarray[i],movesarray[i+1], turnColor);
		}
		serverturn = 0;
		currentBoard = board.getBoard();
		changeTurn();
	};

	function getBoard(){
		return board.getBoard();
	}

	function highlightMovablePieces(){
		highlightedPieces = getMovablePieces(turnColor);
		for(var i = 0; i < highlightedPieces.length; i++){
			view.highlight_checker(BoardPosition.column(highlightedPieces[i]),BoardPosition.row(highlightedPieces[i]));
		}
	}

	function removePieceHighlights(){
		if(typeof highlightedPieces !== 'undefined'){
			for(var i = 0; i < highlightedPieces.length; i++){
				view.unhighlight_checker(BoardPosition.column(highlightedPieces[i]),BoardPosition.row(highlightedPieces[i]));
			}
		}
	}

	function highlightSquares(location){
		highlightedSquares = getPossibleMovesWrapper(location,turnColor);
		for(var i = 0; i < highlightedSquares.length; i++){
			view.highlight_square(BoardPosition.column(highlightedSquares[i]),BoardPosition.row(highlightedSquares[i]));
		}
	}

	function removeSquareHighlights(){
		if(typeof highlightedSquares !== 'undefined'){
			for(var i = 0; i < highlightedSquares.length; i++){
				view.unhighlight_square(BoardPosition.column(highlightedSquares[i]),BoardPosition.row(highlightedSquares[i]));
			}
		}
	}

	/**
	* @author Joel Saupe
	*
	* Uses the AI to calculate and play the best possible move for the current player.
	* 
	@param {string} skill level of play to make. ('Easy', 'Hard')
	*/
	function playBestMove(skill) {
		// Save the current player color for later.
		var currentColor = turnColor;
		// Build a dictionary of functions the AI requires.
		var fns = {
			getMovablePieces: getMovablePieces,
			getPossibleMoves: getPossibleMoves,
			getPossibleJumps: getPossibleJumps,
			BoardPosition: BoardPosition
		}
		// Calculate the best move. and move the player
		var bestMove = calculateBestMove(fns, skill, turnColor, board);
		movePiece(bestMove.from, bestMove.to, turnColor);
		/*
		 	If the player has another turn to make, call playBestMove again.
		 	Note: the 1000ms sleep is to remove glitches in the view and to allow player
			to watch multiple moves.
		*/
		if (turnColor === currentColor) {
			aitimeout = setTimeout(function(){		
				playBestMove(skill);
			}, 1000);
		}
		
	}

	this.startGame = function(){
		if(gameType != "groupplay"){
			turnColor = "red";

			msgfunc(redTurnMsg);
		}
		else{
			if(turnColor == "red")
				msgfunc(redTurnMsg);
			else if(turnColor == "blue")
				msgfunc(blueTurnMsg);
			else
				msgfunc("");
		}
		highlightMovablePieces();
	};

	this.clickPiece = function(location){
		selectedPieceRow = this.pos_y;
		selectedPieceColumn = this.pos_x;
		removeSquareHighlights();
		highlightSquares(BoardPosition.getLocation(this.pos_y,this.pos_x));
	};
	this.clickSquare = function(location){

		if(typeof selectedPieceRow !== 'undefined' && typeof selectedPieceColumn !== 'undefined' && selectedPieceRow >= 0 && selectedPieceRow < 8 && selectedPieceColumn >= 0 && selectedPieceColumn < 8){
			var selColor = board.board[selectedPieceRow][selectedPieceColumn].team;
			if(selColor == "red"){
				redMove(BoardPosition.getLocation(selectedPieceRow,selectedPieceColumn),BoardPosition.getLocation(this.pos_y,this.pos_x));
			}
			else if(selColor == "blue"){
				blueMove(BoardPosition.getLocation(selectedPieceRow,selectedPieceColumn),BoardPosition.getLocation(this.pos_y,this.pos_x));
			}
		}
	};

	this.stopAiMove = function(){
		clearTimeout(aitimeout);
	}

	var turnColor;
	var teamColor;
	if(typeof options.currentTeam !== 'undefined'){
		turnColor = options.currentTeam;
	}

	if(typeof options.userTeam !== 'undefined'){
		teamColor = options.userTeam;
	}

	var selectedPieceRow;
	var selectedPieceColumn;
	var highlightedPieces;
	var highlightedSquares;
	var turn = [];

	var redTurnMsg = "Red's turn.";
	var blueTurnMsg = "Blue's turn.";
	var redWinMsg = "Red wins!";
	var blueWinMsg = "Blue wins!";

	var aitimeout;
	var gameType;
	var skillLevel;
	if(game_type == 1)
		gameType = "local";
	else if(game_type == 2) {
		gameType = "AI";
		skillLevel = 'Easy';
	}
	else if (game_type == 4) {
		gameType = "AI";
		skillLevel = 'Hard';
	}
	else if(game_type == 3)
		gameType = "groupplay";

	function msgfunc(msg){}
	function submitMoves(moves){}

	if(typeof options.msgfunc !== 'undefined'){
		msgfunc = options.msgfunc;
	}

	if(typeof options.submitmoves !== 'undefined'){
		submitMoves = options.submitmoves;
	}

	var currentBoard;
	if(gameType == "groupplay")
		currentBoard = board.getBoard();

	var serverturn = 0;
}

/* End board controller */
