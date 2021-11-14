chrome.runtime.onMessage.addListener(gotMessage);

var styleContainer = document.createElement("style");
styleContainer.innerHTML = ".highlight {background-color: rgba(255,255,0,0.7) !important;}";
document.body.appendChild(styleContainer);

var _message;
chrome.storage.local.clear();
var elementAddress = {};

function gotMessage(message, sender, sendResponse) {
    _message = message;

    var el;

    $("*").bind({
        click: function(e) {
            if (_message) {
                el = this;

                chrome.storage.local.set({ elementAddress: elementAddress });

                //Highlight off
                e.target.classList.remove("highlight");
                _message = false;
                return false;
            }
        },
        mouseover: function(e) {
            if (_message) {

                //Find Selector
                var selector = $(this)
                    .parents()
                    .map(function() {
                        return this.tagName;
                    })
                    .get()
                    .reverse()
                    .concat([this.nodeName])
                    .join(">");
                /*var id = $(this).attr("id");
                if (id) {
                    selector += "#" + id;
                }*/
                /*var classNames = $(this).attr("class");
                if (classNames) {
                    selector += "." + $.trim(classNames).replace(/\s/gi, ".");
                }*/

                //Find Xpath
                /*var xpath = "";
                for (; this && this.nodeType == 1; this = this.parentNode) {
                    var id =
                        $(this.parentNode).children(this.tagName).index(this) + 1;
                    id > 1 ? (id = "[" + id + "]") : (id = "");
                    xpath = "/" + this.tagName.toLowerCase() + id + xpath;
                }*/

                //Highlight on
                e.target.classList.add("highlight");

                //store elementAddress
                elementAddress = {
                        class: ($(this).attr("class") == "" || $(this).attr("class") == undefined) ? "" : $(this).attr("class"),
                        cssSelector: selector.toLowerCase(),
                        cssSelectorWicket: ($(this).attr("wicketpath") == "" || $(this).attr("wicketpath") == undefined) ? "" : this.tagName.toLowerCase() + "[wicketpath$='" + $(this).attr("wicketpath") + "']",
                        cssSelectorClass: ($(this).attr("class") == "" || $(this).attr("class") == undefined) ? "" : '.' + $(this).attr("class").replace(' highlight', '').replace(' ', '.'),
                        cssSelector2: DOMPath.fullQualifiedSelector(this, false).replace(' ', ''),
                        id: (this.id == "" || this.id == undefined) ? "" : this.id,
                        linkText: (this.innerText == "" || this.innerText == undefined) ? "" : this.innerText,
                        name: (this.name == "" || this.name == undefined) ? "" : this.name,
                        tag: this.tagName.toLowerCase(),
                        xpath: DOMPath.xPath(this, false),
                        xpathId: (this.id == "" || this.id == undefined) ? "" : "//" + this.tagName.toLowerCase() + "[@id='" + this.id + "']",
                        xpathName: (this.name == "" || this.name == undefined) ? "" : "//" + this.tagName.toLowerCase() + "[@name='" + this.name + "']",
                        xpathContains: (this.innerText == undefined || this.innerText == "") ? "" : "//" + this.tagName.toLowerCase() + "[contains(.,'" + this.innerText + "')]",
                        xpath2: (DOMPath.xPath(this, true) == DOMPath.xPath(this, false)) ? "" : DOMPath.xPath(this, true)
                    }
                    //console.log(elementAddress);
                return false;
            }
        },
        mouseout: function(e) {
            if (_message) {
                //Highlight off
                e.target.classList.remove("highlight");
            }
        }
    });

    $(el).unbind('click');

    sendResponse({
        findOn: _message
    });
}