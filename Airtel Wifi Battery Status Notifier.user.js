// ==UserScript==
// @name         Airtel Wifi Battery Status Notifier
// @version      0.1
// @author       kowshika
// @match        http://airtel.4g.wi-fi
// @match        http://airtel.4g.wi-fi/*
// @match        https://airtel.4g.wi-fi
// @grant        GM_notification
// @grant        window.focus
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleepFunc() {
    await sleep(3000);
}

function has(String, search) {
    try {
        if (String.indexOf(search) > -1) {
            return true;
        }
    }
    catch (err) {}
    return false;
}


(async function() {
    'use strict';

    setTimeout(() => { sleepFunc(); }, 3000);
    if (has(window.location.href, 'index')){
        if (document.getElementById('spnWanNetworkName') != null){
            document.getElementById('spnWanNetworkName').click();
            sleepFunc();
        }

        if (document.getElementById('f_password') != null){
            document.getElementById('f_password').click();
            document.getElementById('f_password').value = 'admin';
        }

        if (document.getElementById('f_submit_login') != null){
            document.getElementById('f_submit_login').click();
            sleepFunc();
        }
    }

    if (has(window.location.href, 'connectionStatus')){
        if (document.getElementById('ibatterylvl') != null){
            var b = document.getElementById('ibatterylvl').textContent
            if (b != null && b != '' && b != ' ' && b < 20) {
                console.log ('Sending notification');
                shim_GM_notification();
                var notificationDetails = {
                    text:       'Battery Low : '.concat(b, '%'),
                    title:      'Airtel Wifi',
                    timeout:    3000,
                    onclick:    function () {
                        console.log ("Notice clicked.");
                        window.focus ();
                    }
                };
                GM_notification (notificationDetails);

            }
            else {
                console.log('Wifi Battery is at a healthy ' + b + '%');
            }
        }

        setTimeout(() => { window.location.reload(); }, 120000);
        setTimeout(() => { sleepFunc(); }, 20000);

    }

    /*--- Cross-browser Shim code follows:
*/
    function shim_GM_notification () {
        if (typeof GM_notification === "function") {
            return;
        }
        window.GM_notification = function (ntcOptions) {
            checkPermission ();

            function checkPermission () {
                if (Notification.permission === "granted") {
                    fireNotice ();
                }
                else if (Notification.permission === "denied") {
                    alert ("User has denied notifications for this page/site!");
                    return;
                }
                else {
                    Notification.requestPermission ( function (permission) {
                        console.log ("New permission: ", permission);
                        checkPermission ();
                    } );
                }
            }

            function fireNotice () {
                if ( ! ntcOptions.title) {
                    console.log ("Title is required for notification");
                    return;
                }
                if (ntcOptions.text  &&  ! ntcOptions.body) {
                    ntcOptions.body = ntcOptions.text;
                }
                var ntfctn  = new Notification (ntcOptions.title, ntcOptions);

                if (ntcOptions.onclick) {
                    ntfctn.onclick = ntcOptions.onclick;
                }
                if (ntcOptions.timeout) {
                    setTimeout ( function() {
                        ntfctn.close ();
                    }, ntcOptions.timeout);
                }
            }
        }
    }

})();
