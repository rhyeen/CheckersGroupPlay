/**
 *  CheckerBoard class - the graphical View of a checker board.
 *
 *  First, instantiate the object.
 *  Second, call this.init_board(...)
 *  
 *  In animation loop, call this.animate()
 *  In window.resize function, call this.resize(canvas_size)
 *  
 *  To display this object, append the value of get_renderer_view() 
 *      to your document.
 *
 * Uses Pixi.js
 */

function CheckerBoardView()
{
    //-------------------Private functions

    var stage;
    var renderer;
    var container;

    var checker_callback = null;
    var square_callback = null;

    var message_object;
    var message_duration = 0;
    var message_style = {
        font: "bold 100px Arial",
        fill: "white",
        stroke: "#000000",
        strokeThickness: 10,
    };

    //Holds the squares
    var square_board = new Array(8);
    for (var i=0; i<8; i++) {
    	square_board[i] = new Array(8);
    }

    //Holds the checkers
    var board = new Array(8);
    for (var i=0; i<8; i++) {
    	board[i] = new Array(8);
    }


    //-------------------Public functions
    // Control the pieces on the board with these functions
    
    
    this.move_checker = function(at_x, at_y, to_x, to_y)
    {
        //console.log("entered move_checker function");
        if (
            typeof at_x !== 'number' ||
            typeof at_y !== 'number' ||
            typeof to_x !== 'number' ||
            typeof to_y !== 'number' ||
            at_x < 0 || at_x > 63 ||
            at_y < 0 || at_y > 63 ||
            to_x < 0 || to_x > 63 ||
            to_y < 0 || to_y > 63 )
        {
            return false;
        }
    
        //Make sure a checker is there
        if (typeof board[at_x][at_y] !== 'undefined')
        {
            //Make sure a checker doesn't occupy destination
            if (typeof board[to_x][to_y] === 'undefined')
            {
                board[at_x][at_y].move(to_x, to_y);
    
                //Move piece to new space in board and delete old space
                board[to_x][to_y] = board[at_x][at_y];
                delete board[at_x][at_y];
            }
            else
                console.log("checker already exists at destination "+to_x+", "+to_y);
        }
        else
            console.log("no checker exists at "+at_x+", "+at_y);
    };

    this.delete_checker = function(at_x, at_y)
    {
        if (typeof board[at_x][at_y] !== 'undefined')
        {
            //console.log("Removing child at ("+at_x+","+at_y+")");
            container.removeChild(board[at_x][at_y]);
            delete board[at_x][at_y];
        }
    }

    this.change_checker_callback = function(at_x, at_y, callback)
    {
            board[at_x][at_y].change_callback(callback);
    };

    this.change_square_callback = function(at_x, at_y, callback)
    {
            square_board[at_x][at_y].change_callback(callback);
    };

    this.highlight_square = function(at_x, at_y)
    {
        square_board[at_x][at_y].highlight();
    };

    this.highlight_checker = function(at_x, at_y)
    {
        board[at_x][at_y].highlight();
    };

    this.unhighlight_square = function(at_x, at_y)
    {
        square_board[at_x][at_y].unhighlight();
    };

    this.unhighlight_checker = function(at_x, at_y)
    {
        board[at_x][at_y].unhighlight();
    };

    this.unhighlight_all = function()
    {
        for (var i = 0; i<8; i++)
        {
            for (var j=0; j<8; j++)
            {
                if (typeof board[i][j] !== 'undefined')
                {
                    board[i][j].unhighlight();
                }
                square_board[i][j].unhighlight();
            }
        }
    };

    //Change a pawn into a king at position (at_x, at_y)
    this.king_piece = function(at_x, at_y)
    {
        var piece = board[at_x][at_y].piece_type;

        if (piece == 'B')
            board[at_x][at_y].set_type('K');
        else if (piece == 'R')
            board[at_x][at_y].set_type('Q');
    };

    this.update_board = function(boardstring, canvas_size)
    {
        if(boardstring.length != 64)
            return false;

        var canvasSize = canvas_size;
        var multiplier = canvasSize / 1600;
        var scalar = new PIXI.Point(multiplier, multiplier);
        for(var i = 0; i < 64; i++){
            var at_x = i%8;
            var at_y = Math.floor(i/8);
            var piece = boardstring.substr(i,1);
            if(piece == 'X'){
                if (typeof board[at_x][at_y] !== 'undefined')
                {
                    //console.log("Removing child at ("+at_x+","+at_y+")");
                    container.removeChild(board[at_x][at_y]);
                    delete board[at_x][at_y];
                }
            }
            else
            {
                if (typeof board[at_x][at_y] !== 'undefined')
                {
                    board[at_x][at_y].set_type(piece);
                }
                else
                {
                    if(piece == "R" || piece == "B" || piece == "K" || piece == "Q"){
                        checker = new CheckerSprite(
                                         at_x, 
                                         at_y, 
                                         scalar, 
                                         checker_callback,
                                         piece 
                            );
                        board[at_x][at_y] = checker;
                        container.addChild(checker);
                    }
                }
            }
        }
    }

    //Show a message on the stage for 'dura' frames.
    this.display_message = function(msg, dura, canvas_size)
    {
        //console.log("message set to " + msg);
        message_object.setText(msg);
        message_object.y = Math.floor((canvas_size - message_object.height)/2);
        message_object.x = Math.floor((canvas_size - message_object.width)/2);
        message_duration = dura;
    };

    //--------------------------------------------
    //----------------End public control functions
    //--------------------------------------------

    this.resize = function(canvas_size)
    {
        var size = canvas_size;
        renderer.resize(size, size);

	    var multiplier = size / 1600;
	    var scalar = new PIXI.Point(multiplier, multiplier);

        message_object.scale = scalar;
        message_object.y = Math.floor((canvas_size - message_object.height)/2);
        message_object.x = Math.floor((canvas_size - message_object.width)/2);

        //Resize each child as well, given the new scalar based on canvas size
        for (var i=0; i < container.children.length; i++)
        {
            container.children[i].resize(scalar);
        }
    };

    /**
     *  Initialize the board using a 64-character string.
     *  Requires two callback functions for when squares/checkers are clicked.
     *  Not supplying the string will initialize the board to game starting state
     *
     */
    this.init_board = function(checker_cb, square_cb, canvas_size, checkers_string)
    {
        checker_callback = checker_cb;
        square_callback = square_cb;

    	stage = new PIXI.Stage(0x000000);
    	stage.interactive = true;
    
    	//Set the canvas to be X by X size, 
    	//where X is the smallest between the height/width of window
    	var canvasSize = canvas_size;
    	renderer = PIXI.autoDetectRenderer(canvasSize,canvasSize,null);
    
    	//Attach the renderer to the body
//    	$(".game").append(renderer.view);
    
    	//Create a container for all the sprites
    	container = new PIXI.DisplayObjectContainer();
    	stage.addChild(container);

        this.set_pieces(checker_cb, square_cb, canvasSize, checkers_string);
    };

    this.set_pieces = function(checker_cb, square_cb, canvasSize, checkers_string)
    {
    	//Create a scalar based on the size of the canvas
    	var multiplier = canvasSize / 1600;
    	var scalar = new PIXI.Point(multiplier, multiplier);

        message_object = new PIXI.Text("Red's turn", message_style);
        message_object.scale = scalar;
        message_object.y = Math.floor(canvasSize / 2);
        message_object.x = message_object.y - Math.floor(message_object.width/2);
        stage.addChild(message_object);
    
    	for (var i = 0; i < 8; i++)
    	{
    		for (var j = 0; j < 8; j++)
    		{
    			var square;
    			if ((i+j)%2 == 0)
    				square = new SquareSprite(
                        i, 
                        j, 
                        scalar, 
                        square_cb, 
                        new PIXI.Texture.fromImage("View/grid2.png")
                    );
    			else
    				square = new SquareSprite(
                        i, 
                        j, 
                        scalar, 
                        square_cb, 
                        new PIXI.Texture.fromImage("View/grid1.png")
                    );
    		
                square_board[i][j] = square;    
                container.addChild(square);
    		}
    	}
    
        //Board setup.. put the checkers in initial places
        if (typeof checkers_string !== "undefined")
        {
            if (checkers_string.length != 64)
                return "bad checkers string length";

            for (var i=0; i<64; i++)
            {
                var x = i % 8;
                var y = Math.floor(i / 8);
                var piece = checkers_string.charAt(i);
                var checker;
                if(piece == "R" || piece == "B" || piece == "K" || piece == "Q"){
            		checker = new CheckerSprite(
                                     x, 
                                     y, 
                                     scalar, 
                                     checker_cb,
                                     piece 
                        );
                    board[x][y] = checker;
            		container.addChild(checker);
                }
            }
        }
        else
        {
        	for (var i=0; i<3; i++)
        	{
                for (var j=0; j<4; j++)
                {
                    //Blue Checkers
                    var x = (j*2) - (i%2) + 1;
                    var y = i;
        			var checker = new CheckerSprite(
                        x, 
                        y, 
                        scalar, 
                        checker_cb, 
                        'B'
                    );
                    
                    board[x][y] = checker;
        			container.addChild(checker);
        
                    //Red Checkers
                    x = (j*2) + (i%2);
                    y = i+5;
        			checker = new CheckerSprite(
                        x, 
                        y, 
                        scalar, 
                        checker_cb,
                        'R' 
                    );
        
                    board[x][y] = checker;
        			container.addChild(checker);
                }
        	}
        }
    };

    this.get_renderer_view = function()
    {
        return renderer.view;
    };

    /*
     * Used to start a new game of checkers.
     */
    this.reset_board = function(checker_cb, square_cb, canvas_size, checker_string)
    {
        checker_callback = checker_cb;
        square_callback = square_cb;
        
        for (var i = container.length-1; i>=0; i--)
        {
            container.removeChildAt(i);
        }

        for (var i=0; i<8; i++)
        {
            for (var j=0; j<8; j++)
            {
                board[i][j] = undefined;
                square_board[i][j] = undefined;
            }
        }

        stage.removeChild(message_object);

        this.set_pieces(checker_cb, square_cb, canvas_size, checker_string);
    };

    this.animate = function()
    {
        for (var i = 0; i < board.length; i++)
        {
            for (var j=0; j<board[i].length; j++)
            {
                if (typeof board[i][j] !== 'undefined')
                {
                    board[i][j].animate();
                }
            }
        }

        if (message_duration > 0)
        {
            message_duration--;
            if (message_duration <= 0)
            {
                message_object.setText("");
            }
        }
	    
	    renderer.render(stage);
    };
}
