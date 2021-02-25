// ==UserScript==
// @name         Etsy UK Product data
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download product info from etsy
// @author       Kowshika
// @match        https://www.etsy.com/uk/listing
// @match        https://www.etsy.com/uk/listing/*
// @match        https://www.etsy.com/uk/shop/
// @match        https://www.etsy.com/uk/shop/*
// @include      https://www.etsy.com/uk/listing*
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
    sleepFunc();
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            waitForElementToDisplay('#content', 5000);
            waitForElementToDisplay('#collage-footer', 5000);

            $(window).on('load', function() {

            if (has(window.location.href, '/listing/')){
                var a = document.querySelector('script[type="application/ld+json"]');
                var obj = JSON.parse(a.text);
                var category = obj.category;
                var shopname = obj.brand;
                a = document.querySelector('meta[property="etsymarketplace:shop"]');
                var shopurl = a.content;
                console.log(obj);

                textData += shopurl + " | "
                textData += shopname
                textData += " | "
                textData += shopurl
                textData += " | "
                textData += category
                textData += " | "
                textData += window.location.href.split("?")[0] + " | "

                if (textData.length > 10){
                    saveText("listingData.txt", textData);
                } else {
                    console.log('No Data found.')
                }
                window.location.href = shopurl;
            }

            if (has(window.location.href, '/shop/')){
                var owner = ""; var ownerurl = ""; var location = "";
                try {owner = document.getElementByXPath("//h2[text()='Shop owner']//following::div[@data-editable-img='user-avatar']//a/p").textContent; } catch(err) { }
                try {ownerurl = document.getElementByXPath("//h2[text()='Shop owner']//following::div[@data-editable-img='user-avatar']//a").href; } catch(err) { }
                try {location = document.getElementByXPath("//*[@data-key='user_location']").textContent; } catch(err) { }

                console.log(owner);

                textData += window.location.href.split("?")[0] + " | "
                textData += owner
                textData += " | "
                textData += ownerurl
                textData += " | "
                textData += location
                textData += " | "

                if (textData.length > 10){
                    saveText("ShopData.txt", textData);
                } else {
                    console.log('No Data found.')
                }
            }

            });
        }
    }
    console.log('Page loaded');



})();
