<?php

////
// leave $js_file as NULL if none, otherwise, it is an array of js files
// leave $title / $description as "" if none
//
function createHeadContent ($title, $description, $css_file, $js_files)
{
	$return .= '<meta content="utf-8" http-equiv="encoding">';
    $return .= '<title>'.$title.'</title>';
	// so devices see what we expect them to
    $return .= '<meta name="viewport" content="width=device-width">';
    $return .= '<meta name="description" content="'.$description.'">';
    $return .= '<link rel="stylesheet" type="text/css" href="'.$css_file.'">';
    
	if ($js_files !== NULL  && !empty($js_files))
	{
		foreach ($js_files as $js_file)
    		$return .= '<script type="text/javascript" src="'.$js_file.'"></script>';
    }
	return $return;
}

function createDefaultJs()
{
	$return = <<<JS_TEXT
	function goHome()
	{
		window.location.href = "index.php";
	}
	
	var game = {stopAiMove: function(){}}; 
	var player1;
	var player2;
    var checker_board;
    var animating;
	
	var move_checker_button = function()
	{
		checker_board.move_checker(parseInt($("#at_x").val()),
								   parseInt($("#at_y").val()),
								   parseInt($("#to_x").val()),
								   parseInt($("#to_y").val()));
	};
	
	var delete_checker_button = function()
	{
		checker_board.delete_checker(parseInt($("#at_x").val()),
									 parseInt($("#at_y").val()));
	};
	
	//Function to get the size of the square canvas
	//Will be whichever is smaller: width or height of the window.
	function get_canvas_size()
	{
		var canvasSize = $(window).width() < $(window).height() 
					   ? $(window).width() : $(window).height();
		//canvasSize -= 120; //Back it off a little bit...
		//var canvasSize = $("#game").width();

		if($("#game_status").is(":visible") && $(window).width() > $(window).height() - ($("#restart_button").height() + 20 + ($("#game_status").height() == 0 ? 25 : $("#game_status").height())))
			canvasSize -= $("#restart_button").height() + 20 + ($("#game_status").height() == 0 ? 25 : $("#game_status").height()) ;

		//If server play
		if($("#groupplay_start").length > 0){
			if($(window).width() - (200) < $(window).height()){
				$(".game-container").width(canvasSize);
				$("#groupplay_start").outerWidth("100%");
			}
			else{
				$("#groupplay_start").width("auto");
				$(".game-container").width($(".game-hold").outerWidth() + 200);
			}
			
		}
	
		return canvasSize;
	}
	
	//Called when the browser window is resized.
	function on_resize()
	{
		checker_board.resize(get_canvas_size());
	}
	$(window).resize(on_resize);
	
	function change_message(msg)
	{
		//60 = number of frames message is displayed
        checker_board.display_message(msg, 60, get_canvas_size());
        $("#game_status").html("<h2>"+msg+"</h2>");
	}
	
	function animate()
	{
        if (animating)
        {
            requestAnimFrame(animate);
            checker_board.animate();
        }
    }

    function start_animating()
    {
        animating = true;
        requestAnimFrame(animate);
    }

    function stop_animating()
    {
        animating = false;
    }
	
	$(function ()
	{
		var loader = new PIXI.AssetLoader(["View/checker1.png", "View/checker2.png", "View/grid1.png", "View/grid2.png","View/king1.png", "View/king2.png"]);
		//loader.onComplete = get_started;
		loader.load();
	});
JS_TEXT;
	
	return $return;	
}

?>
