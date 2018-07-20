// ==UserScript==
// @name         Runtastic - Aport activities - Detail
// @namespace    https://github.com/Martas86/TamperMonkey
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.runtastic.com/cs/uzivatele/b4cbaf63-fbf3-d613-1ebc-7e8ceee7be3e/sportovni-aktivity/*
// @require      http://code.jquery.com/jquery-1.8.3.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js
// @grant        none
// @xupdateURL   https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/Runtastic-SportActivities-Detail.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	$ = window.jQuery;

    var s1=0;
    var s2=0;
    var t1=0;
    var t2=0;
    var interval;

    $(document).ready(function() {

        setTimeout(function(){


            $("rect.js-mouse-capture").on("mousedown", "", function(obj) {
                var sx = $(".multiline-chart__info span.multiline-chart__info-span").eq(0).text();
                s1=parseFloat(sx.replace("Vzdálenost: ","").replace(" km",""));

                var tx = $(".multiline-chart__info span.multiline-chart__info-span").eq(1).text();
                tx = tx.replace("Trvání: ","");
                var txArr = tx.split(":");
                var tdef = new Date(2000,1,1,0,0,0);
                var td = new Date(tdef);
                td.setHours(txArr[0],txArr[1],txArr[2]);
                t1=(td.getTime()-tdef.getTime()) / 1000 / 60 / 60;

                interval = setInterval(function(){ recalc(); }, 500);
            });

            $("rect.js-mouse-capture").on("mouseup", "", function(obj) {
                clearInterval(interval);
            });

            recalc();
        }, 1000);

    });

    function recalc()
    {
        if($("#myStats").length == 0)
        {
            var $obj = $("<div id='myStats'></div>");
            //$("<div>Moje statistiky</div>").appendTo($obj);
            $("<div><table style='width:100%;text-align:center;'><tr><th colspan=3>Moje statistiky</th></tr><tr><td><span>Vzdálenost: </span><span id='myStats_distance'></span><span> km</span></td><td><span><span>Trvání: </span><span id='myStats_duration'></span><span></span></td><td><span><span>Rychlost: </span><span id='myStats_speed'></span><span> km/h</span></td></tr></table></div>").appendTo($obj);
            $obj.appendTo(".multi-line-chart .content-box-body");
        }

        var sx = $(".multiline-chart__info span.multiline-chart__info-span").eq(0).text();
        var s = parseFloat(sx.replace("Vzdálenost: ","").replace(" km",""));

        var tx = $(".multiline-chart__info span.multiline-chart__info-span").eq(1).text();
        tx = tx.replace("Trvání: ","");
        var txArr = tx.split(":");
        var tdef = new Date(2000,1,1,0,0,0);
        var td = new Date(tdef);
        td.setHours(txArr[0],txArr[1],txArr[2]);
        var t = (td.getTime()-tdef.getTime()) / 1000 / 60 / 60;

        s2=s;
        t2=t;

        var sDiff = Math.abs(s2-s1);
        var tDiff = Math.abs(t2-t1);

        //debugger;
        //$("#myStats_agvSpeed").addClass("asdf");
        $("#myStats_distance").text((sDiff).toFixed(2));
        $("#myStats_duration").text((new Date()).clearTime().addSeconds(tDiff*60*60).toString('HH:mm:ss'));
        $("#myStats_speed").text((sDiff/tDiff).toFixed(2));
    }
})();