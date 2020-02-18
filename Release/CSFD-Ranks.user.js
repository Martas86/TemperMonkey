// ==UserScript==
// @name         CSFD - Ranks
// @namespace    https://github.com/Martas86/TamperMonkey
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.csfd.cz/zebricky/specificky-vyber/*
// @grant        none
// @xupdateURL   https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/CSFD-Ranks.user.js
// @updateURL   https://github.com/Martas86/TamperMonkey/raw/master/Release/CSFD-Ranks.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here....
	$ = window.jQuery;
    function rwsCntRecalc() {
        $("#xRwsCnt").text("(" + $("#results table.content tbody tr td.order:visible").length + ")");
    }

    function dofiltruj() {
        var minRatCnt = parseInt($("#xMinRatingCnt").val());
        var notRateByMe = $('#xNotRateByMe').is(':checked');
        $("#results table.content tbody tr").each(function() {
            $(this).toggle((parseInt($("td.count", this).text(), 10) >= minRatCnt) && (!notRateByMe || $("td.rating", this).html() == ""));
        });
        rwsCntRecalc();
    }

    function dofiltrujZrus() {
        $("#results table.content tbody tr").show();
        rwsCntRecalc();
    }

    $(document).ready(function() {
        $(".ct-general.th-filter").append('<div style="width: 100%;">\
<span>Min. poč. hodnocení:<span><input id="xMinRatingCnt" style="width: 50px;" type="input" value="500" />\
<span style="margin: 0px 0px 0px 10px;">Mnou nehodnoceno:<span><input id="xNotRateByMe" style="" type="checkbox" />\
<button id="xDofiltruj" style="margin: 0px 0px 0px 10px;" type=button>Dofiltruj</button><button id="xZrus" style="margin: 0px 0px 0px 10px;" type=button>Zruš</button>\
<span id="xRwsCnt" style="float: right;">()</span>\
</div>');

        $(".ct-general.th-filter").on("click", "#xDofiltruj", function(){
            dofiltruj();
        })
        .on("click", "#xZrus", function(){
            dofiltrujZrus();
        })
        ;

        rwsCntRecalc();
    });

})();
