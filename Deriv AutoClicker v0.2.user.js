// ==UserScript==
// @name         Deriv AutoClicker
// @namespace    Deriv_AutoClicker_Script
// @version      0.2
// @description  Click on Purchase when matching conditions
// @author       Nivetha
// @match        https://smarttrader.deriv.app/en/trading.html
// @match        https://smarttrader.deriv.app/en/trading.html*
// @include      https://smarttrader.deriv.app/en/trading.html*
// @match        https://smarttrader.deriv.*/en/trading.html
// @include      https://smarttrader.deriv.*/en/trading.html*
// excludes      *
// @icon            https://smarttrader.deriv.app/images/common/logos/icon_deriv.svg
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @license         MIT
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at       document-end
// ==/UserScript==

function has(String, search) { try { if (String.indexOf(search) > -1) { return true; } } catch (err) {} return false; }
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); };
let sleepFunc = async function() { await sleep(5000); };

function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
    var targetNodes, btargetsFound;
    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
            .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
        are new.
    */
        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
            }, 300);
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}


function mainMethod(jNode) {
    setTimeout(function () {
        sleepFunc();
        console.clear();
        console.log('Page loaded');
        document.getElementByXPath = function(sValue) { var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); if (a.snapshotLength > 0) { return a.snapshotItem(0); } };
        if (document.getElementByXPath("//*[@id='underlying_component']//div/span[text()='Volatility 100 Index']") == null){
            document.getElementByXPath("//*[@id='underlying_component']//div[contains(@class, 'market_current')]").click();
            document.getElementByXPath("//*[@id='R_100']").click();
            console.log("Selected Volatility 100 Index");
        }
        if (document.getElementByXPath("//*[@id='contract_component']//div/span[text()='Higher/Lower']") == null){
            document.getElementByXPath("//*[@id='contract_component']//div[contains(@class, 'contract_current')]").click();
            document.getElementByXPath("//*[@id='contract_component']//div[text()='Higher/Lower']").click();
            console.log("Selected Higher/Lower");
        }

        sleepFunc();
        waitForKeyElements("#spot", checkChart);

    }, 5000)
}


function checkChart(jNode){

    var match_digits = 4;
    var time = 1;
    var max = 2000000;
    console.clear();
    var error = false;
    var matchedList = GM_getValue("matchList", "");
    if (!matchedList) {
        console.log("Error calculating matchList from memory. Auto Clicker Script Not Running.");
        alert("Auto Clicker Script Not Running. Click on Set Match List button.");
        error = true;
    } else {

        var matchList = matchedList.split(",").map(item => item.trim());
        console.log(matchList);
        if (matchList.length == 1 ){
            if (matchList[0].length <= 0){
                console.log("Error calculating matchList from memory. Auto Clicker Script Not Running.");
                alert("Auto Clicker Script Not Running. Click on Set Match List button.");
                error = true;
            }
        }


        var interval = setInterval(function() {
            if (!error && matchList && time <= max) {
                var spot = document.getElementById('spot');
                if (spot != null && spot.getAttribute('class')=='price_moved_up'){
                    var amount = spot.textContent;
                    var matched_digits = amount.substr(amount.length - match_digits);
                    if (matchList.includes(matched_digits)){

                        if (document.getElementByXPath("//div[contains(@class, 'contract_purchase') and contains(@class, 'disabled')]") == null
                            && document.getElementById('spot').getAttribute('class')=='price_moved_up'){
                            clickHigherPurchaseBtn();
                            console.log("Blue : " + matched_digits + " from " + amount + " matched with list " + matchList);
                            sleepFunc();
                            clickcloseBtn();
                            sleepFunc();
                        }

                    } else {
                        console.log("Blue : but " + matched_digits + " did not match with list " + matchList);
                    }
                    clickcloseBtn();
                } else {
                    clickcloseBtn();
                }
                time++;
            } else { clearInterval(interval); }
        }, 1000);
    }
}

function clickcloseBtn() {
    try{
        if (document.getElementByXPath("//*[@id='contract_confirmation_container' and contains(@style, 'none')]") == null){
            document.getElementById('contract_confirmation_container').click();
            document.getElementById('close_confirmation_container').click();
        }
    } catch(err) {}
}

function clickHigherPurchaseBtn(){
    try{
        document.getElementById('purchase_button_top').click();
    } catch(err) {}
}


function ButtonClickAction(zEvent) {
    GM_setValue("matchList", "");
    var matchList = prompt('To update your matching numbers list, enter last 3 digits comma separated. For example 2.40,2.80,1.02,8.40 etc...', '');
    if (matchList) {
        GM_setValue("matchList", matchList);
        console.log("Stored matchList : " + matchList);
        GM_setValue("UserCancelledPrompt", false);
        // reload
        self.location.assign(location);
    }
    else {
        GM_setValue("UserCancelledPrompt", true);
        console.log("User Cancelled prompt to update matchList.");
    }
}

function AddButton() {
    // Add a button element on div
    var zNode = document.createElement('div');
    zNode.innerHTML = '<button id="myButton" title="To update your stored matching numbers list, Click me" type="button">Set Higher Match List</button>';
    zNode.setAttribute('id', 'myContainer');
    document.body.appendChild(zNode);

    //--- Activate the newly added button.
    document.getElementById("myButton").addEventListener("click", ButtonClickAction, false);

    //--- Style our newly added element using CSS.
    GM_addStyle(`
#myContainer{position:fixed;bottom:30px;left:0;font-size:10px;margin:0;opacity:.75}#myButton{cursor:pointer;background-color:lightgrey;color:black}
#myButton:hover{background-color:#555;color:white;box-shadow:0 2px 6px 0 rgba(0,0,0,.24),0 5px 10px 0 rgba(0,0,0,.19);opacity:1}
`);

}


(async function() {

    sleepFunc();
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            sleepFunc();
            AddButton();
            console.clear();
            waitForKeyElements("span.market", mainMethod);
        };
    }


})();