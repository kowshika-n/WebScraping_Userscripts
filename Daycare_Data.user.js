// ==UserScript==
// @name         GA Daycares data
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scrape daycare info
// @author       Kowshika N
// @match        https://families.decal.ga.gov/ChildCare/detail/*
// @match        http://families.decal.ga.gov/ChildCare/detail/*
// @include      https://families.decal.ga.gov/ChildCare/detail/*
// @include      http://families.decal.ga.gov/ChildCare/detail/*
// @include      https://families.decal.ga.gov/ChildCare/Results*
// @match        https://families.decal.ga.gov/ChildCare/Results*
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


(function() {
    'use strict';
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
    sleepFunc();

    function getText(xpath){
        var text = ""
        if (document.getElementByXPath(xpath) != null){ text = document.getElementByXPath(xpath).textContent }
        return text
    }

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            waitForElementToDisplay('#Content_Main_lblFacilityName', 5000);
            waitForElementToDisplay('#Content_Main_imgPreK', 5000);

            if (has(window.location.href, '/Results')){
                function keeploading(){
                    document.getElementById('pnlLoadMore').scrollIntoView();
                    document.getElementById('pnlLoadMore').click();
                }

                function heavyWork(){
                    for (var i=0; i<10; i++){
                        console.log(i);
                        var interval = setInterval((function(x){
                            return function(){
                                keeploading();
                            };
                        })(i), 5000);
                        if (document.getElementById('pnlLoadMore').style.display == "none"){
                            window.clearInterval(interval);
                        }
                    }
                }

                heavyWork();
                document.getElementById('pnlSortBy').scrollIntoView();
            }

            if (has(window.location.href, '/detail/')){

                var DaycareName = getText("//*[contains(@id, 'FacilityName')]")
                var Address = getText("//address").replace(/(?:\r\n|\r|\n|\s\s)/g, ' ').replace(/\s+/g, ' ').replace('Get Directions', '').trim()
                var ContactName = getText("//*[contains(@id, 'Admin')]")
                var PhoneNumber = getText("//*[contains(@id, 'Phone')]")
                var Website = ""
                if (document.getElementByXPath("//*[contains(@id, 'Website')]//a") != null) {
                    Website = document.getElementByXPath("//*[contains(@id, 'Website')]//a").href
                }
                var Facebook = ""
                if (document.getElementByXPath("//*[contains(@id, 'Facebook')]") != null) {
                    Facebook = document.getElementByXPath("//*[contains(@id, 'Facebook')]").href
                }
                var Type = getText("//*[contains(@id, 'ProgramType')]")
                var Capacity = getText("//*[contains(@id, 'lblCapacity')]")

                textData += DaycareName + " | "
                textData += Address + " | "
                textData += ContactName + " | "
                textData += PhoneNumber + " | "
                textData += Website + " | "
                textData += Facebook + " | "
                textData += Type + " | "
                textData += Capacity + " | "
                textData += window.location.href + " | "

                if (textData.length > 20){
                    saveText("listingData.txt", textData);
                } else {
                    console.log('No Data found.')
                }
            }
        }
    }

})();
