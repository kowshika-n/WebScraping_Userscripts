// ==UserScript==
// @name         Crunchbase
// @namespace    crunchbase.script
// @version      0.1
// @description  Scrape pubic data from crunchbase
// @author       Kowshika
// @match        https://crunchbase.com/*
// @match        https://www.crunchbase.com/*
// @runat        document-end
// @grant        none

// ==/UserScript==

function has(String, search) { try { if (String.indexOf(search) > -1) { return true; } } catch (err) {} return false; }

function waitForElementToDisplay(selector, time) {
    if(document.querySelector(selector) != null) {
        console.log(selector + ' found');
        return;
    }
    else {
        setTimeout(function() {
            waitForElementToDisplay(selector, time);
        }, time);
    }
}

function waitForElementToDisplayWithXpath(xpath, time) {
    document.getElementByXPath = function(sValue) { var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); if (a.snapshotLength > 0) { return a.snapshotItem(0); } };
    if(document.getElementByXPath(xpath) != null) {
        console.log(xpath + ' found');
        return;
    }
    else {
        setTimeout(function() {
            waitForElementToDisplayWithXpath(xpath, time);
        }, time);
    }
}




(function() {

    var textData = "";

    function saveText(filename, text) {
        var tempElem = document.createElement('a');
        tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        tempElem.setAttribute('download', filename);
        tempElem.click();
        console.log(filename + ' File downloaded');
    }

    function sleep(ms) { return new Promise(res => setTimeout(res, ms)); };
    let sleepFunc = async function() { await sleep(3000); };

    document.getElementByXPath = function(sValue) { var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); if (a.snapshotLength > 0) { return a.snapshotItem(0); } };
    document.getElementsByXPath = function(sValue){ var aResult = new Array();var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);for ( var i = 0 ; i < a.snapshotLength ; i++ ){aResult.push(a.snapshotItem(i));}return aResult;};

    sleepFunc();

    waitForElementToDisplay('.profile-name', 5000);
    waitForElementToDisplay('page-footer', 5000);
    waitForElementToDisplay('anchored-values', 5000);

    if (has(window.location.href, 'organization')){

        var company_name = document.getElementByXPath('//*[@class="profile-name"]').textContent.trim()
        var company_url = ""
        var headquarters = ""
        var Sector = ""
        var type = ""
        var symbol = ""
        var funding= ""
        var amount = ""
        var phone = ""

        if (document.getElementByXPath('(//a[@role="link"])[1]') != null) {
            company_url = document.getElementByXPath('(//a[@role="link"])[1]').getAttribute('href');
        }

        if (document.getElementByXPath("//a[contains(@href, '/field/organizations/location_identifiers')]") != null) {
            headquarters = document.getElementByXPath("(//a[contains(@href, '/field/organizations/location_identifiers')])//..//..//span").textContent;
        }

        if (document.getElementByXPath("//mat-chip") != null) {
            var count = document.getElementsByXPath("//mat-chip").length;
            for (var i=1; i <= count; i ++){
                Sector += document.getElementByXPath("(//mat-chip)[" + i.toString() + "]").textContent + ", ";
            }
            Sector = Sector.replace(/,\s*$/, "");
        }

        if (document.getElementByXPath("//*[@title='Public']") != null){
            type = "Public"
        } else {
            type = "Private"
        }

        waitForElementToDisplayWithXpath("//*[text() = 'Stock ']//..//..//..//a | //*[text() = 'Stock Symbol']//..//..//..//blob-formatter/span", 2000);
        if (document.getElementByXPath("//*[text() = 'Stock ']//..//..//..//a | //*[text() = 'Stock Symbol']//..//..//..//blob-formatter/span") != null){
            symbol = document.getElementByXPath("//*[text() = 'Stock ']//..//..//..//a | //*[text() = 'Stock Symbol']//..//..//..//blob-formatter/span").textContent.trim();
        }

        if (document.getElementByXPath("//span[text()='Phone Number']//..//..//..//blob-formatter/span") != null){
            phone = document.getElementByXPath("(//span[text()='Phone Number']//..//..//..//span)[last()]").textContent.trim()
        }

        if (document.getElementByXPath("(//a[contains(@href, 'organizations/last_funding_type')])[1]") != null){
            funding = document.getElementByXPath("(//a[contains(@href, 'organizations/last_funding_type')])[1]").textContent.trim()
        }

        if (document.getElementByXPath("(//span[contains(@class, 'field-type-money')])[1]") != null){
            amount = document.getElementByXPath("(//span[contains(@class, 'field-type-money')])[1]").textContent.trim()
        }

        textData += headquarters + " | "
        textData += Sector + " | "
        textData += type + " | "
        textData += symbol + " | "
        textData += funding + " | "
        textData += amount + " | "
        textData += company_name + " | "
        textData += company_url + " | "
        textData += window.location.href + " | "
        textData += phone

        if (textData.length > 10){
            saveText("listingData.txt", textData);
        } else {
            console.log('No Data found.')
        }

    }
    console.log('Page loaded');

})();
