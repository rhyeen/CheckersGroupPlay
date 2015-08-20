CheckerSprite.prototype = Object.create(PIXI.Sprite.prototype);
CheckerSprite.prototype.constructor = CheckerSprite;

//Code snippet taken from HTML5GameDevs.com
//http://www.html5gamedevs.com/topic/7507-how-to-move-the-sprite-to-the-top/
//
//Used to move a sprite to the front
PIXI.Sprite.prototype.bringToFront = function() 
{
        if (this.parent) {
            var parent = this.parent;
            parent.removeChild(this);
            parent.addChild(this);
        }
}

function CheckerSprite(pos_x, pos_y, scalar, click_callback, type)
{
    PIXI.Sprite.call(this);

    var ANIMATION_SPEED = 10; //How many frames it takes to move between spaces
    var animationQueue = [];

    //Event method for when mouse leaves the square
	var checker_out_handler = function(event)
	{
        if (!this.is_highlighted)
        {
		    var checker = event.target;
	    	checker.tint = 0xffffff;
        }
	}.bind(this);
	
    //Event method for when mouse enters the square
	var checker_hover_handler = function(event)
	{
        if (!this.is_highlighted)
        {
    		var checker = event.target;
		    checker.tint = 0x88ff88;
        }
	}.bind(this);

    var is_highlighted = false;
    this.highlight = function()
    {
        this.tint = 0x88ff88;
        this.is_highlighted = true;
    };
    
    this.unhighlight = function()
    {
        this.tint = 0xffffff;
        this.is_highlighted = false;
    };

    //Move this checker to (x,y) on the checkerboard
    //Works by adding a number of points equal to ANIMATION_SPEED to a queue
    //The checker moves to these points by calling the animate function
    this.move = function(dest_x, dest_y) 
    {
        //First convert dest coords to pixel coords
        var to_x = dest_x*(200*this.scale.x);
        var to_y = dest_y*(200*this.scale.y);
        
        //Find the difference between destination and current position
        var diff_x = to_x - this.x;
        var diff_y = to_y - this.y;

        //Divide by animation speed
        diff_x /= ANIMATION_SPEED;
        diff_y /= ANIMATION_SPEED;

        //Move_x/y will be the position added to the queue
        var move_x = this.x;
        var move_y = this.y;
        for (var i = 0; i < ANIMATION_SPEED-1; i++) //note ANIMATION_SPEED-1
        {
            //Add the diff variable to the current point
            move_x += diff_x;
            move_y += diff_y;

            //Push the point on the queue
            var point = [move_x, move_y];
            animationQueue.push(point);
        }

        //Last point will be the original desination
        var point = [to_x, to_y];
        animationQueue.push(point);

        this.update_position(dest_x, dest_y);
        this.bringToFront();
    };

    //Animate function called by animation loop; do not call otherwise!
    //Pops (or rather shifts) a point off the queue, and sets this checker's
    //  x/y position to that point.
    //To be called once per frame of animation.
    this.animate = function() 
    {
        if (animationQueue.length > 0)
        {
            var point = animationQueue.shift(); //shift takes from start of array
            this.x = point[0];
            this.y = point[1];
        }
    };

    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.update_position = function(ax, ay)
    {
        this.pos_x = ax;
        this.pos_y = ay;
    };

    //Change what type of piece this checker is
    //Takes a single character
    this.set_type = function(ct)
    {
        //Character that specifies B, R, K, or Q
        if (ct == 'B')
        {
            this.setTexture(new PIXI.Texture.fromImage("View/checker1.png"));
            this.piece_type = ct;
        }
        else if (ct == 'R')
        {
            this.setTexture(new PIXI.Texture.fromImage("View/checker2.png"));
            this.piece_type = ct;
        }
        else if (ct == 'K')
        {
            this.setTexture(new PIXI.Texture.fromImage("View/king1.png"));
            this.piece_type = ct;
        }
        else if (ct == 'Q')
        {
            this.setTexture(new PIXI.Texture.fromImage("View/king2.png"));
            this.piece_type = ct;
        }
        else
            console.log("Invalid piece type in set_type: " + ct);
    };
    var piece_type = type; //Type of piece this checker is
    this.set_type(piece_type);

    this.scale = scalar; //Scales the sprite size
    this.x = pos_x*(200*this.scale.x); //Sets x/y based on scale
    this.y = pos_y*(200*this.scale.y);

    //Function resizes the checker sprite given a PIXI.Point object for scale
    this.resize = function(s)
    {
        var scale_diff = {
            x: s.x / this.scale.x, 
            y: s.y / this.scale.y
        };
        this.scale = s;
        this.x = this.pos_x*(200*s.x);
        this.y = this.pos_y*(200*s.y);
        for (var i=0; i<animationQueue.length; i++)
        {
            animationQueue[i][0] *= scale_diff.x;
            animationQueue[i][1] *= scale_diff.y;
        }
    };

    //First check the callback is not null
    if (typeof click_callback !== 'undefined')
    {
        //Bind the callback and set it to the mousedown
        click_callback.bind(this);
        this.click = this.tap = click_callback;
    }

    this.change_callback = function(cb)
    {
        cb.bind(this);
        this.click = this.tap = click_callback;
    };

    this.buttonMode = true;
    this.interactive = true;

	this.mouseout =  checker_out_handler;
	this.mouseover = checker_hover_handler;

    
}
