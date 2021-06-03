function has(a, b) {
    try {
        if (a.indexOf(b) > -1) {
            return true
        }
    } catch (c) {}
    return false
}
document.getElementByXPath = function(c) {
    var b = this.evaluate(c, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (b.snapshotLength > 0) {
        return b.snapshotItem(0)
    }
};
document.getElementsByXPath = function(e) {
    var d = new Array();
    var b = this.evaluate(e, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var c = 0; c < b.snapshotLength; c++) {
        d.push(b.snapshotItem(c))
    }
    return d
};

function waitForElementToDisplay(a, b) {
    if (document.querySelector(a) != null) {
        console.log(a + " found");
        return
    } else {
        setTimeout(function() {
            waitForElementToDisplay(a, b)
        }, b)
    }
}

function waitForElementToDisplayWithXpath(a, b) {
    if (document.getElementByXPath(a) != null) {
        console.log(a + " found");
        return
    } else {
        setTimeout(function() {
            waitForElementToDisplayWithXpath(a, b)
        }, b)
    }
};

function getVal(e) {
    return multiplier = e.substr(-1).toLowerCase(), "k" == multiplier ? 1e3 * parseFloat(e) : "m" == multiplier ? 1e6 * parseFloat(e) : void 0
}

//*[@id='metadata-line']//*[contains(text(), 'views')]
a = document.getElementsByXPath("//*[@id='metadata-line']//*[contains(text(), 'views')]")
for (var i = 0; i < a.length; i++) {
    console.log(getVal(a[i].textContent.replace(' views', '')),
        document.getElementByXPath("(//a[@id='video-title' and contains(@href, 'watch?')])[" + (i + 1).toString() + "]").href)
}
