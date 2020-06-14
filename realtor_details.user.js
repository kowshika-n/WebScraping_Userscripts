// ==UserScript==
// @name         realtor details
// @namespace    http://tampermonkey.net/
// @version      kowshika-n
// @description  Scrape data from realtor sire
// @author       You
// @include      https://www.google.com/url?sa*
// @include      https://www.realtor.com/realestateandhomes-detail*
// @include      https://www.realtor.com/realestateandhomes-detail/*
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
            waitForElementToDisplay('.business-card-content', 3000);
            waitForElementToDisplay('.business-card-broker', 3000);
        }
    }
    console.log('Page loaded');

    if (has(window.location.href, 'google.')){
        document.getElementByXPath("//a[1]").click();
    }

    if (document.getElementsByClassName('.business-card-broker').length >= 1){document.getElementsByClassName('.business-card-broker')[0].scrollIntoView(false)};

    function saveText(filename, text) {
        var tempElem = document.createElement('a');
        tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        tempElem.setAttribute('download', filename);
        tempElem.click();
        console.log(filename + ' File downloaded');
    }

    textData = window.location.href.split("?ex=")[0] + " | "
    textData += document.getElementByXPath("//*[contains(@class,'business-card-agent')]").textContent.replace(/\n/g, " ").trim()
    textData += " | "
    textData += document.getElementByXPath("//*[contains(@class,'business-card-broker')]").textContent.replace(/\n/g, " ").trim();

    if (textData.length > 50){
        saveText("realestateandhomes-detail.txt", textData);
    } else {
        console.log('No Data found.')
    }


})();
