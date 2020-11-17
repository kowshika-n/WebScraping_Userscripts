// ==UserScript==
// @name         realtor search
// @namespace    http://tampermonkey.net/
// @description  Scrape data from realtor site
// @version      0.1
// @author       kowshika-n
// @homepage     https://github.com/kowshika1
// @downloadURL  https://github.com/kowshika1/WebScraping_Userscripts/raw/master/realtor_search.user.js
// @updateURL    https://github.com/kowshika1/WebScraping_Userscripts/raw/master/realtor_search.user.js
// @include      https://www.realtor.com/realestateandhomes-search*
// @include      https://www.realtor.com/realestateandhomes-search/*
// @grant        none
// @runat        document-end
// ==/UserScript==

function has(String, search) { try { if (String.indexOf(search) > -1) { return true; } } catch (err) {} return false; }

function Search(homeurls) {
    if (document.links.length >= 100 ) {
        for(var i = document.links.length; i --> 0;) {
            if(has(document.links[i].href, 'realestateandhomes-detail') && document.links[i].hostname === location.hostname) {
                var hreference = document.links[i].href;
                if (has(hreference, "?ex=")) {
                    hreference = hreference.split("?ex=")[0];
                }
                homeurls.push(hreference);
            }
        }
    } else {
        console.log('Found only less than 100 urls')
    }

    homeurls = Array.from(new Set(homeurls));
    return homeurls;
}

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

    var homeurls = [];
    function sleep(ms) { return new Promise(res => setTimeout(res, ms)); };
    let sleepFunc = async function() { await sleep(3000); };

    document.getElementByXPath = function(sValue) { var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); if (a.snapshotLength > 0) { return a.snapshotItem(0); } };
    sleepFunc();

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            waitForElementToDisplay('.component_property-card', 3000);
            waitForElementToDisplay('.rdc-global-footer', 3000);
        }
    }
    console.log('Page loaded');

    if (document.getElementsByClassName('rdc-global-footer').length >= 1){document.getElementsByClassName('rdc-global-footer')[0].scrollIntoView(false)};
    homeurls = Search(homeurls);
    if (document.getElementByXPath("//a[@title='Go to Next Page']") != null) { document.getElementByXPath("//a[@title='Go to Next Page']").scrollIntoView(false); };



    var county = window.location.href.split("search/")[1];
    var pg = '1';
    if (has(window.location.href, 'pg-')) {
        pg = window.location.href.split("pg-")[1];
    }

    var myStrText = JSON.stringify(homeurls, null, 4);
    function saveText(filename, text) {
        var tempElem = document.createElement('a');
        tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        tempElem.setAttribute('download', filename);
        tempElem.click();
        console.log(filename + ' File downloaded');
    }

    if (myStrText.length > 10){
        saveText(county +"_pg-" + pg + ".txt", myStrText);
    } else {
        console.log('No Data found.')
    }



    if (document.getElementByXPath("//a[@title='Go to Next Page']") != null) {
        document.getElementByXPath("//a[@title='Go to Next Page']").click();
        waitForElementToDisplay('.component_property-card', 3000);

        if (has(window.location.href, 'pg-')) {
            window.location.href = window.location.href.replace(("pg-" + pg), "pg-" + (parseInt(pg, 10)+1).toString() );
        } else {
            window.location.href = window.location.href + "/pg-2";
        }
    } else {
        alert("Done.")
    }


})();
