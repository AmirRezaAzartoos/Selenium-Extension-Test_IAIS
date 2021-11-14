$("*").on("click", function() {
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

  alert(selector);
  return false;
});