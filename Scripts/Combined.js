var defaultStyle;

$("*").mouseover(function(e){
    var selector = $(this)
        .parents()
        .map(function() { return this.tagName; })
        .get()
        .reverse()
        .concat([this.nodeName])
        .join(">");

    var id = $(this).attr("id");
    if (id) { 
      selector += "#"+ id;
    }

    var classNames = $(this).attr("class");
    if (classNames) {
      selector += "." + $.trim(classNames).replace(/\s/gi, ".");
    }
    
    element = this;
    
    var xpath = '';
    for ( ; element && element.nodeType == 1; element = element.parentNode )
    {
        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
        id > 1 ? (id = '[' + id + ']') : (id = '');
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    
    		defaultStyle = e.target.getAttribute('style');
    if (defaultStyle == null){
    	defaultStyle = '';
    } 
    e.target.setAttribute('style', 'border:2px solid red; background:yellow');
     console.log("selector: " + selector.toLowerCase());
     console.log("xpath: " + xpath);
    return false;
});


$(document).mouseout(function(e){
    e.target.setAttribute('style', defaultStyle);
});

