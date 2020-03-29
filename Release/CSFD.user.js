// ==UserScript==
// @name         CSFD
// @namespace    https://github.com/Martas86/TamperMonkey
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.csfd.cz/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/CSFD.user.js
// @updateURL    https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/CSFD.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	$ = window.jQuery;

    $(document).ready(function() {
		$("#leaderboard-wrapper").hide();
    });

})();
