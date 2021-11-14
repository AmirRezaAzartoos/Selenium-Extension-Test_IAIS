$("#row-className").hide();
$("#row-cssSelector").hide();
$("#row-cssSelector1").hide();
$("#row-cssSelector2").hide();
$("#row-cssSelector3").hide();
$("#row-id").hide();
$("#row-linkText").hide();
$("#row-name").hide();
$("#row-tag").hide();
$("#row-xpath").hide();
$("#row-xpath1").hide();
$("#row-xpath2").hide();
$("#row-xpath3").hide();
$("#row-xpath4").hide();


chrome.storage.local.get('elementAddress', function(items) {
    if (items.elementAddress != undefined) {


        if (items.elementAddress.class != "") {
            $("#row-className").show();
        } else if (items.elementAddress.class == "" || items.elementAddress.class == undefined) {
            $("#row-className").hide();
        }
        if (items.elementAddress.cssSelector != "") {
            $("#row-cssSelector").show();
        } else if (items.elementAddress.cssSelector == "" || items.elementAddress.cssSelector == undefined) {
            $("#row-cssSelector").hide();
        }
        if (items.elementAddress.cssSelectorWicket != "") {
            $("#row-cssSelector1").show();
        } else if (items.elementAddress.cssSelectorWicket == "" || items.elementAddress.cssSelectorWicket == undefined) {
            $("#row-cssSelector1").hide();
        }
        if (items.elementAddress.cssSelectorClass != "") {
            $("#row-cssSelector2").show();
        } else if (items.elementAddress.cssSelectorClass == "" || items.elementAddress.cssSelectorClass == undefined) {
            $("#row-cssSelector2").hide();
        }
        if (items.elementAddress.cssSelector2 != "") {
            $("#row-cssSelector3").show();
        } else if (items.elementAddress.cssSelector2 == "" || items.elementAddress.cssSelector2 == undefined) {
            $("#row-cssSelector3").hide();
        }
        if (items.elementAddress.id != "") {
            $("#row-id").show();
        } else if (items.elementAddress.id == "" || items.elementAddress.id == undefined) {
            $("#row-id").hide();
        }
        if (items.elementAddress.linkText != "") {
            $("#row-linkText").show();
        } else if (items.elementAddress.linkText == "" || items.elementAddress.linkText == undefined) {
            $("#row-linkText").hide();
        }
        if (items.elementAddress.name != "") {
            $("#row-name").show();
        } else if (items.elementAddress.name == "" || items.elementAddress.name == undefined) {
            $("#row-name").hide();
        }
        if (items.elementAddress.tag != "") {
            $("#row-tag").show();
        } else if (items.elementAddress.tag == "" || items.elementAddress.tag == undefined) {
            $("#row-tag").hide();
        }
        if (items.elementAddress.xpath != "") {
            $("#row-xpath").show();
        } else if (items.elementAddress.xpath == "" || items.elementAddress.xpath == undefined) {
            $("#row-xpath").hide();
        }
        if (items.elementAddress.xpathId != "") {
            $("#row-xpath1").show();
        } else if (items.elementAddress.xpathId == "" || items.elementAddress.xpathId == undefined) {
            $("#row-xpath1").hide();
        }
        if (items.elementAddress.xpathName != "") {
            $("#row-xpath2").show();
        } else if (items.elementAddress.xpathName == "" || items.elementAddress.xpathName == undefined) {
            $("#row-xpath2").hide();
        }
        if (items.elementAddress.xpathContains != "") {
            $("#row-xpath3").show();
        } else if (items.elementAddress.xpathContains == "" || items.elementAddress.xpathContains == undefined) {
            $("#row-xpath3").hide();
        }
        if (items.elementAddress.xpath2 != "") {
            $("#row-xpath4").show();
        } else if (items.elementAddress.xpath2 == "" || items.elementAddress.xpath2 == undefined) {
            $("#row-xpath4").hide();
        }

        document.getElementById("className").childNodes[0].nodeValue = items.elementAddress.class.replace('highlight', '').replace(' highlight', '');
        document.getElementById("cssSelector").childNodes[0].nodeValue = items.elementAddress.cssSelector;
        document.getElementById("cssSelector1").childNodes[0].nodeValue = items.elementAddress.cssSelectorWicket;
        document.getElementById("cssSelector2").childNodes[0].nodeValue = items.elementAddress.cssSelectorClass;
        document.getElementById("cssSelector3").childNodes[0].nodeValue = items.elementAddress.cssSelector2;
        document.getElementById("id").childNodes[0].nodeValue = items.elementAddress.id;
        document.getElementById("linkText").childNodes[0].nodeValue = items.elementAddress.linkText;
        document.getElementById("name").childNodes[0].nodeValue = items.elementAddress.name;
        document.getElementById("tag").childNodes[0].nodeValue = items.elementAddress.tag;
        document.getElementById("xpath").childNodes[0].nodeValue = items.elementAddress.xpath;
        document.getElementById("xpath1").childNodes[0].nodeValue = items.elementAddress.xpathId;
        document.getElementById("xpath2").childNodes[0].nodeValue = items.elementAddress.xpathName;
        document.getElementById("xpath3").childNodes[0].nodeValue = items.elementAddress.xpathContains;
        document.getElementById("xpath4").childNodes[0].nodeValue = items.elementAddress.xpath2;
    }
});



function logStorageChange(changes, area) {
    console.log("Change in storage area: " + area);

    let changedItems = Object.keys(changes);

    for (let item of changedItems) {

        if (changes[item].newValue.class != "") {
            $("#row-className").show();
        } else if (changes[item].newValue.class == "" || changes[item].newValue.class == undefined) {
            $("#row-className").hide();
        }
        if (changes[item].newValue.cssSelector != "") {
            $("#row-cssSelector").show();
        } else if (changes[item].newValue.cssSelector == "" || changes[item].newValue.cssSelector == undefined) {
            $("#row-cssSelector").hide();
        }
        if (changes[item].newValue.cssSelectorWicket != "") {
            $("#row-cssSelector1").show();
        } else if (changes[item].newValue.cssSelectorWicket == "" || changes[item].newValue.cssSelectorWicket == undefined) {
            $("#row-cssSelector1").hide();
        }
        if (changes[item].newValue.cssSelectorClass != "") {
            $("#row-cssSelector2").show();
        } else if (changes[item].newValue.cssSelectorClass == "" || changes[item].newValue.cssSelectorClass == undefined) {
            $("#row-cssSelector2").hide();
        }
        if (changes[item].newValue.cssSelector2 != "") {
            $("#row-cssSelector3").show();
        } else if (changes[item].newValue.cssSelector2 == "" || changes[item].newValue.cssSelector2 == undefined) {
            $("#row-cssSelector3").hide();
        }
        if (changes[item].newValue.id != "") {
            $("#row-id").show();
        } else if (changes[item].newValue.id == "" || changes[item].newValue.id == undefined) {
            $("#row-id").hide();
        }
        if (changes[item].newValue.linkText != "") {
            $("#row-linkText").show();
        } else if (changes[item].newValue.linkText == "" || changes[item].newValue.linkText == undefined) {
            $("#row-linkText").hide();
        }
        if (changes[item].newValue.name != "") {
            $("#row-name").show();
        } else if (changes[item].newValue.name == "" || changes[item].newValue.name == undefined) {
            $("#row-name").hide();
        }
        if (changes[item].newValue.tag != "") {
            $("#row-tag").show();
        } else if (changes[item].newValue.tag == "" || changes[item].newValue.tag == undefined) {
            $("#row-tag").hide();
        }
        if (changes[item].newValue.xpath != "") {
            $("#row-xpath").show();
        } else if (changes[item].newValue.xpath == "" || changes[item].newValue.xpath == undefined) {
            $("#row-xpath").hide();
        }
        if (changes[item].newValue.xpath1 != "") {
            $("#row-xpath1").show();
        } else if (changes[item].newValue.xpathId == "" || changes[item].newValue.xpathId == undefined) {
            $("#row-xpath1").hide();
        }
        if (changes[item].newValue.xpathName != "") {
            $("#row-xpath2").show();
        } else if (changes[item].newValue.xpathName == "" || changes[item].newValue.xpathName == undefined) {
            $("#row-xpath2").hide();
        }
        if (changes[item].newValue.xpathContains != "") {
            $("#row-xpath3").show();
        } else if (changes[item].newValue.xpathContains == "" || changes[item].newValue.xpathContains == undefined) {
            $("#row-xpath3").hide();
        }
        if (changes[item].newValue.xpath2 != "") {
            $("#row-xpath4").show();
        } else if (changes[item].newValue.xpath2 == "" || changes[item].newValue.xpath2 == undefined) {
            $("#row-xpath4").hide();
        }
        document.getElementById("className").childNodes[0].nodeValue = changes[item].newValue.class.replace('highlight', '').replace(' highlight', '');
        document.getElementById("cssSelector").childNodes[0].nodeValue = changes[item].newValue.cssSelector;
        document.getElementById("cssSelector1").childNodes[0].nodeValue = changes[item].newValue.cssSelectorWicket;
        document.getElementById("cssSelector2").childNodes[0].nodeValue = changes[item].newValue.cssSelectorClass;
        document.getElementById("cssSelector3").childNodes[0].nodeValue = changes[item].newValue.cssSelector2;
        document.getElementById("id").childNodes[0].nodeValue = changes[item].newValue.id;
        document.getElementById("linkText").childNodes[0].nodeValue = changes[item].newValue.linkText;
        document.getElementById("name").childNodes[0].nodeValue = changes[item].newValue.name;
        document.getElementById("tag").childNodes[0].nodeValue = changes[item].newValue.tag;
        document.getElementById("xpath").childNodes[0].nodeValue = changes[item].newValue.xpath;
        document.getElementById("xpath1").childNodes[0].nodeValue = changes[item].newValue.xpathId;
        document.getElementById("xpath2").childNodes[0].nodeValue = changes[item].newValue.xpathName;
        document.getElementById("xpath3").childNodes[0].nodeValue = changes[item].newValue.xpathContains;
        document.getElementById("xpath4").childNodes[0].nodeValue = changes[item].newValue.xpath2;
    }
}

chrome.storage.onChanged.addListener(logStorageChange);


/* Coppy to clipboard */
document.getElementById("row-className").addEventListener('click', function() {
    navigator.clipboard.writeText(document.getElementById("className").childNodes[0].nodeValue.replace('highlight', '').replace(' highlight', ''));
});
document.getElementById("row-cssSelector").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("cssSelector").childNodes[0].nodeValue);
});
document.getElementById("row-cssSelector1").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("cssSelector1").childNodes[0].nodeValue);
});
document.getElementById("row-cssSelector2").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("cssSelector2").childNodes[0].nodeValue);
});
document.getElementById("row-cssSelector3").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("cssSelector3").childNodes[0].nodeValue);
});
document.getElementById("row-id").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("id").childNodes[0].nodeValue);
});
document.getElementById("row-linkText").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("linkText").childNodes[0].nodeValue);
});
document.getElementById("row-name").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("name").childNodes[0].nodeValue);
});
document.getElementById("row-tag").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("tag").childNodes[0].nodeValue);
});
document.getElementById("row-xpath").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("xpath").childNodes[0].nodeValue);
});
document.getElementById("row-xpath1").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("xpath1").childNodes[0].nodeValue);
});
document.getElementById("row-xpath2").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("xpath2").childNodes[0].nodeValue);
});
document.getElementById("row-xpath3").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("xpath3").childNodes[0].nodeValue);
});
document.getElementById("row-xpath4").addEventListener('click', function xpath() {
    navigator.clipboard.writeText(document.getElementById("xpath4").childNodes[0].nodeValue);
});

function setup() {
    noCanvas();
    var find;
    document.getElementById('locatKey').addEventListener('click', callLocator);

    function callLocator() {
        let params = {
            active: true,
            currentWindow: true
        }
        chrome.tabs.query(params, gotTabs);

        function gotTabs(tabs) {

            // telling content script to work
            if (!find || find == undefined) {
                find = true;
            } else {
                find = false;
            }
            chrome.tabs.sendMessage(tabs[0].id, find, function(response) {
                find = response.findOn;
            });
        }
        window.close();
    }
}