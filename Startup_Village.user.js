// ==UserScript==
// @name         Startup Village
// @namespace    http://tampermonkey.net/
// @description  Scrape data from startup village
// @version      0.1
// @author       kowshika-n
// @homepage     https://github.com/kowshika1
// @downloadURL  https://github.com/kowshika1/WebScraping_Userscripts/raw/master/Startup_Village.user.js
// @updateURL    https://github.com/kowshika1/WebScraping_Userscripts/raw/master/Startup_Village.user.js
// @match        https://startupvillage.ru/*
// @include      https://startupvillage.ru/*
// @grant        none
//@run-at        document-end
// ==/UserScript==

function saveText(filename, text) {
    var tempElem = document.createElement('a');
    tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    tempElem.setAttribute('download', filename);
    tempElem.click();
    console.log(filename + ' File downloaded');
}


(function() {
    'use strict';
    var textData = "";
    var i;
    document.getElementsByXPath = function(sValue){ var aResult = new Array();var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);for ( var i = 0 ; i < a.snapshotLength ; i++ ){aResult.push(a.snapshotItem(i));}return aResult;};
    var filename = document.getElementsByXPath("//*[contains(@for, 'industry')]//..//option[@selected='selected']")[0].textContent.trim();
    if (filename == null || filename == "") {filename = "NoIndustry"}

    for (i = 0; i < document.getElementsByXPath('//*[@class="d-block"]').length; i+=2){
        textData += (document.getElementsByXPath('//*[@class="d-block"]')[i].textContent.trim() + "," + document.getElementsByXPath('//*[@class="d-block"]')[i+1].textContent.trim()) + "\n";
    }
    for (i = 0; i < document.getElementsByXPath('//*[contains(@class, "participants-item-position")]').length; i++){
        textData += (document.getElementsByXPath('//*[contains(@class, "participants-item-position")]')[i].textContent.trim()) + "\n";
    }

    if (textData.length > 10){
        saveText((filename + ".txt"), textData);
    } else {
        console.log('No Data found.')
    }

})();
