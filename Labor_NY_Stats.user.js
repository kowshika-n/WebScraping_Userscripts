// ==UserScript==
// @name         Labor NY Stats
// @namespace    http://tampermonkey.net/
// @description  Scrape data from realtor site
// @version      0.1
// @author       kowshika-n
// @homepage     https://github.com/kowshika1
// @downloadURL  https://github.com/kowshika1/WebScraping_Userscripts/raw/master/Labor_NY_Stats.user.js
// @updateURL    https://github.com/kowshika1/WebScraping_Userscripts/raw/master/Labor_NY_Stats.user.js
// @match        https://labor.ny.gov/stats/directb5.asp?id=*
// @grant        none
// @runat        document-end
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


(async function() {
    'use strict';
    var textData = "";
    function sleep(ms) { return new Promise(res => setTimeout(res, ms)); };
    let sleepFunc = async function() { await sleep(3000); };

    document.getElementByXPath = function(sValue) { var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); if (a.snapshotLength > 0) { return a.snapshotItem(0); } };
    sleepFunc();
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            waitForElementToDisplay('.last-child', 3000);
        }
    }
    console.log('Page loaded');


    function saveText(filename, text) {
        var tempElem = document.createElement('a');
        tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        tempElem.setAttribute('download', filename);
        tempElem.click();
        console.log(filename + ' File downloaded');
    }

    textData = window.location.href + " | "
    textData += document.getElementByXPath("//*[contains(text(), 'Company Name')]//..//../td[last()]").textContent.trim();
    textData += " | "
    textData += document.getElementByXPath("//*[contains(text(), 'Address')]//..//../td[last()]").textContent.trim();
    textData += " | "
    textData += document.getElementByXPath("//*[contains(text(), 'Contact')]//..//../td[last()]").textContent.trim();
    textData += " | "
    textData += document.getElementByXPath("//*[contains(text(), 'Phone')]//..//../td[last()]").textContent.trim();
    textData += " | "
    textData += document.getElementByXPath("//*[contains(text(), 'URL')]//..//../td[last()]").textContent.trim();
    textData += " | "
    textData += document.getElementByXPath("//*[contains(text(), 'Employment Range')]//..//../td[last()]").textContent.trim();
    textData += " | "

    if (textData.length > 10){
        saveText("BusinessDirectory.txt", textData);
    } else {
        console.log('No Data found.')
    }


})();
