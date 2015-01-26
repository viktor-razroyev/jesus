jQuery(document).ready(function() {

	/*----------------<RESIZE COMPLITE>----------------*/
    jQuery.fn.resizeComplete = function(func, ms){  
        var timer = null;  
        this.resize(function(){  
            if (timer){  
                clearTimeout(timer);  
            }  
            timer = setTimeout(func,ms);  
        });  
    }
	/*----------------</RESIZE COMPLITE>----------------*/


	$('.ml-keyboard-input').mlKeyboard({layout: 'ru'});

  	var $mainButton = $('.btn-enter-site'),
  		$searchBlock = $('.main-search-form'),
  		$containerForPaddingTop = $('.main-container');

	var searchBlockOffset = $searchBlock.offset().top;
	var containerForPaddingTopOffset = $containerForPaddingTop.offset().top;

  	function actionOnResize(){
		$containerForPaddingTop.css({'padding-top': $(window).height()/2 - searchBlockOffset + containerForPaddingTopOffset - $searchBlock.height()/2 +'px'}).addClass("showIt");
		$mainButton.children('span').css('background-position', '50% -'+ $mainButton.offset().top +'px');
		console.log();
  	};

	actionOnResize(searchBlockOffset - containerForPaddingTopOffset);

	$(window).resizeComplete(function(){
		actionOnResize();
	}, 100);
});