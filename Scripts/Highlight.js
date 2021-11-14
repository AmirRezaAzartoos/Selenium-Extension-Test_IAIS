var defaultStyle;
$(document).mouseover(function(e){
		defaultStyle = e.target.getAttribute('style');
    if (defaultStyle == null){
    	defaultStyle = '';
    } 
    e.target.setAttribute('style', 'border:2px solid red; background:yellow');
});
$(document).mouseout(function(e){
    e.target.setAttribute('style', defaultStyle);
});

