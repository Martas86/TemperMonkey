// ==UserScript==
// @name         CSFD - TV
// @namespace    https://github.com/Martas86/TamperMonkey
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.csfd.cz/televize
// @grant        none
// @xupdateURL   https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/CSFD-TV.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	$ = window.jQuery;

    $(document).ready(function() {
		var wideAdd = 1500;
		$("#page-wrapper").css("width", $("#page-wrapper").css("width") + wideAdd);
		$("#program").css("width", $("#program").css("width") + wideAdd);
		$("#program .scroller").css("width", $("#program .scroller").css("width") + wideAdd);
    });

})();
