<?php

////
// returns true if the game is over, and a new game should begin
function isOver ($board)
{
	// if the board contains red tokens
	if (strpos($board, 'R') !== FALSE || strpos($board, 'Q') !== FALSE)
	{
		// then it shouldn't contain blue tokens
		return !(strpos($board, 'B') !== FALSE || strpos($board, 'K') !== FALSE);
	}
	
	// otherwise, red lost
	return TRUE;	
}

////
// Checks if the set of moves are valid
// returns NULL if invalid
function checkMoves ($moves, $board)
{	
	// we have the extra username at moves[0] that we should ignore
	// at least the starting position and one move need to be made to be valid.
	if (count($moves) < 3)
		return NULL;
		
	return checkMovesDriver(1, $moves, $board, count($moves));
}

function checkMovesDriver($current_pos, $moves, $board, $count_moves)
{
	//echo "FUNCTION CALLED<br>";
	
	// if we've reached the end, the given board is already resulting board
	if (($count_moves - $current_pos) < 2)
		return $board;
		
	//echo "INDEX: " . $current_pos . "<br>";
		
	// else, check if move is valid based on given board
	// if move is valid, update the board and check the next move
	// otherwise, return null;
	$temp_board = makeMove($moves[$current_pos], $moves[$current_pos+1], $board);
	
	//echo "TEMP: " . $temp_board . "<br>";
	
	if ($temp_board != NULL)
	{
		$board = $temp_board;
		return checkMovesDriver($current_pos+1, $moves, $board, $count_moves);
	}
	else
		return NULL;
}

function makeMove($currentPosition, $move, $board)
{
	if(!(isOnBoard($currentPosition, $board)))
		return NULL;
	if(!(isOnBoard($move, $board)))
		return NULL;
		
	
	
	// check all possible scenerios based on token move
	$diff = $move - $currentPosition;
	$currentToken = $board[$currentPosition];
	$moveSpace = $board[$move];
	$jumpPiecePos = $currentPosition + ($diff/2);
	$jumpedPiece = $board[$jumpPiecePos];
	
	//echo "DIFF: " . $diff . " TOKEN: " . $currentToken . " MOVETO: " . $moveSpace . "<br>";
	
	// up
	if($diff == -9 || $diff == -7 || $diff == -18 || $diff == -14)
	{
		if($currentToken === 'R' || $currentToken === 'K' || $currentToken === 'Q')
		{
			// they must move onto an empty slot
			if($moveSpace === 'X')
			{
				// if its a move
				if($diff == -9 || $diff == -7)
				{
					$board[$currentPosition] = 'X';
					$board[$move] = $currentToken;
					// check if peice should be king'd
					if($move < 8 && $currentToken === 'R')
						$board[$move] = 'Q';
					return $board;
				}
				// if its a jump
				else if(
					(
						($jumpedPiece === 'B' || $jumpedPiece === 'K') && 
						($currentToken === 'Q' || $currentToken === 'R')
					) ||
					(
						($jumpedPiece === 'R' || $jumpedPiece === 'Q') &&
						($currentToken === 'K')
					)
				)
				{
					$board[$currentPosition] = 'X';
					// remove the jumped piece
					$board[$jumpPiecePos] = 'X';
					$board[$move] = $currentToken;
					// check if peice should be king'd
					if($move < 8 && $currentToken === 'R')
						$board[$move] = 'Q';
					return $board;
				}
				else
					return NULL;
			}
			else
				return NULL;
		}
	}
	// down
	if($diff == 9 || $diff == 7 || $diff == 18 || $diff == 14)
	{
		if($currentToken === 'B' || $currentToken === 'K' || $currentToken === 'Q')
		{
			if($moveSpace === 'X')
			{
				// if its a move
				if($diff == 9 || $diff == 7)
				{
					$board[$currentPosition] = 'X';
					$board[$move] = $currentToken;
					// check if peice should be king'd
					if($move > 55 && $currentToken === 'B')
						$board[$move] = 'K';
					return $board;
				}
				// if its a jump
				else if(
					(
						($jumpedPiece === 'B' || $jumpedPiece === 'K') && 
						($currentToken === 'Q')
					) ||
					(
						($jumpedPiece === 'R' || $jumpedPiece === 'Q') &&
						($currentToken === 'B' || $currentToken == 'K')
					)
				)
				{
					$board[$currentPosition] = 'X';
					// remove the jumped piece
					$board[$jumpPiecePos] = 'X';
					$board[$move] = $currentToken;
					// check if peice should be king'd
					if($move > 55 && $currentToken === 'B')
						$board[$move] = 'K';
					return $board;
				}
				else
					return NULL;
			}
			else
				return NULL;
		}
	}
	// if it was none of the above, the move was entirely invalid
	return NULL;
}

function isOnBoard($position, $board)
{
	if($position < 0)
		return FALSE;
	if($position > (strlen($board) - 1))
		return FALSE;
	return TRUE;
}


?>