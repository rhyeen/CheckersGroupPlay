SquareSprite.prototype = Object.create(PIXI.Sprite.prototype);
SquareSprite.prototype.constructor = SquareSprite;


/** SquareSprite class : Erich Newey, Spring 2015
 *
 * Used to represent a square on a checker/chess board.
 * Assumes an image 200x200 in resolution.
 *
 * Parameters:
 * pos_x / pos_y: the x,y position of the square on the checkerboard. (ie 0,0 is top-left)
 * scalar: a Point that scales the image size
 * click_callback: Function pointer for when the mouse is clicked on this square
 * image: Texture used for this Sprite.
 */
function SquareSprite(pos_x, pos_y, scalar, click_callback, image)
{
	PIXI.Sprite.call(this); //Super constructor call

//	var square_press_handler = function(event)
//	{
//		var square = event.target;
//		square.tint = 0x88ff88;
//	}.bind(this);
    
    //Event method for when mouse leaves the square
	var square_out_handler = function(event)
	{
        if (!this.is_highlighted)
        {
	    	var square = event.target;
    		square.tint = 0xffffff;
        }
	}.bind(this);
	
    //Event method for when mouse enters the square
	var square_hover_handler = function(event)
	{
        if (!this.is_highlighted)
        {
		    var square = event.target;
		    square.tint = 0xffff88;
        }
	}.bind(this);

    var is_highlighted = false;
    this.highlight = function()
    {
        this.tint = 0xffff88;
        this.is_highlighted = true;
    };
    
    this.unhighlight = function()
    {
        this.tint = 0xffffff;
        this.is_highlighted = false;
    };

	this.scale = scalar; //Used to scale sprite/image size

    this.pos_x = pos_x;
    this.pos_y = pos_y;
    //Position of Sprite on stage based on image size (200x200) and scalar input
	this.x = pos_x*(200*scalar.x);
	this.y = pos_y*(200*scalar.y);

    this.resize = function(s)
    {
        this.scale = s;
        this.x = this.pos_x*(200*s.x);
        this.y = this.pos_y*(200*s.y);
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

    //Interaction levels
	this.buttonMode = true;
	this.interactive = true;

    //Setting event handlers
	this.mouseout = square_out_handler;
	this.mouseover = square_hover_handler;

    //Set Sprite image as texture received
    this.setTexture(image);
       
}
