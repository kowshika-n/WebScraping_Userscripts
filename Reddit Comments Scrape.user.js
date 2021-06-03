document.getElementByXPath = function(sValue) {
    var a = this.evaluate(sValue, this, null, XPathResult
        .ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (a.snapshotLength > 0) {
        return a.snapshotItem(0);
    }
};

document.getElementsByXPath = function(sValue) {
    var aResult = new Array();
    var a = this.evaluate(sValue, this, null, XPathResult
        .ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < a.snapshotLength; i++) {
        aResult.push(a.snapshotItem(i));
    }
    return aResult;
};

var comments = document.getElementsByXPath(
    "//div[contains(@class, 'entry')]//form//div[contains(@class, 'usertext')]"
    );
var taglines = document.getElementsByXPath(
    "(//div[contains(@class, 'entry')]//form//div[contains(@class, 'usertext-body')])//..//../p[@class='tagline']"
);
var permalinks = document.getElementsByXPath(
    "(//div[contains(@class, 'entry')]//form//div[contains(@class,  'usertext-body')])//following::a[text() = 'permalink']"
);
var scores = document.getElementsByXPath(
    "(//div[contains(@class, 'entry')]//form//div[contains(@class, 'usertext-body')])//..//../p[@class='tagline']/span[contains(@class,'score unvoted')]"
);


function saveText(filename, text) {
    var tempElem = document.createElement('a');
    tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(text));
    tempElem.setAttribute('download', filename);
    tempElem.click();
    console.log(filename + ' File downloaded');
}

var textData = "";
for (var i = 0; i < permalinks.length; i++) {
    textData += taglines[i].children[1].href + " | " + permalinks[i].href +
        " | " + scores[i].textContent.split(" ")[0] + " | " + comments[i]
        .textContent.trim() + " | " + "\n\n";
    console.log(textData);
}

if (textData.length > 10) {
    saveText("Reddit.txt", textData)
}
