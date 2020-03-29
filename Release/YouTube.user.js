// ==UserScript==
// @name         YouTube
// @namespace    https://github.com/Martas86/TamperMonkey
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        none
// @require 	 https://code.jquery.com/jquery-latest.js
// @downloadURL  https://github.com/Martas86/TamperMonkey/raw/master/Release/YouTube.user.js
// @updateURL    https://github.com/Martas86/TamperMonkey/raw/master/Release/YouTube.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function() {
        setInterval(func, 1000);
    });

    function func() {
        if($(".ytp-ad-skip-button").is(":visible"))
            $(".ytp-ad-skip-button").click();
        if($("paper-button[aria-label='I understand and wish to proceed']").is(":visible"))
            $("paper-button[aria-label='I understand and wish to proceed']").click();
        if($(".ytp-ad-overlay-container").is(":visible"))
            $(".ytp-ad-overlay-close-button").click();
        if($(".yt-confirm-dialog-renderer").is(":visible"))
            $(".yt-button-renderer").click();
    }
})();