// ==UserScript==
// @name         RunTastic - Sport activities - Add premium functions
// @namespace    https://github.com/Martas86/TamperMonkey
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.runtastic.com/cs/uzivatele/b4cbaf63-fbf3-d613-1ebc-7e8ceee7be3e/sportovni-aktivity
// @require      http://code.jquery.com/jquery-1.8.3.min.js
// @grant        none
// @xupdateURL   https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/RunTastic-SportActivities-AddPremiumFunctions.user.js
// @run-at document-start
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	$ = window.jQuery;
    //debugger;
    //alert("asdf");
    $(document).ready(function() {
        var documentWidth = $(document).width();
        var lbW = $(".leftbox").width();
        var contentWidth = (documentWidth > 1400) ? 1400 : documentWidth;
        var rbW = contentWidth-lbW-10;

        $(".wrapper").css("width", contentWidth+"px");
        $(".rightbox").css("width", rbW+"px");
        $(".rightbox").next("a").hide();
        $(".mainbox").css("width", "100%");
        $(".mainbox #calendar_js").css("width", "550px");
        $("#runsessions #calendar_overview_js").css("width", "100%").css("margin-top", "5px");

        $("#advanced_filtering").prop("disabled", false);
        //user.is_gold_user = true;

        var $multi = $("#filters_js.single").clone(true);

        $multi.attr("class", "multi");
        $("#date_single", $multi).attr("id", "date_multi");
        $(".date_single", $multi).attr("class", "date_multi");
        $("#sport_types_single", $multi).attr("id", "sport_types_multi");
        $(".sport_types_single", $multi).attr("class", "sport_types_multi");
        $("#distances_single", $multi).attr("id", "distances_multi");
        $(".distances_single", $multi).attr("class", "distances_multi");
        $("#durations_single", $multi).attr("id", "durations_multi");
        $(".durations_single", $multi).attr("class", "durations_multi");
        $("#locations_single", $multi).attr("id", "locations_multi");
        $(".locations_single", $multi).attr("class", "locations_multi");
        $("#feelings_single", $multi).attr("id", "feelings_multi");
        $(".feelings_single", $multi).attr("class", "feelings_multi");
        $("#weathers_single", $multi).attr("id", "weathers_multi");
        $(".weathers_single", $multi).attr("class", "weathers_multi");
        $("#surfaces_single", $multi).attr("id", "surfaces_multi");
        $(".surfaces_single", $multi).attr("class", "surfaces_multi");
        $("#trainingplans_single", $multi).attr("id", "trainingplans_multi");
        $(".trainingplans_single", $multi).attr("class", "trainingplans_multi");

        $("div.months a[rel=filter]", $multi).css("display","");

        $multi.insertAfter("#filters_js.single");
        //$("#advanced_filtering").trigger("click");
        //debugger;

        //$( "#calendar_overview_js" ).on("DOMSubtreeModified", "#sumtable", function(obj) {if(obj.target.nodeName != "TBODY") return;
        $("#calendar_overview_js").on("click", "thead th", function(obj) {
            //debugger;
            //alert( "Handler for .change() called." + obj.target.nodeName + " - " + $("#calendar_overview_js #sumtable tfoot td.distance").text());
            if($("#calendar_overview_js #sumtable tfoot td").eq(0).text().contains(")")) return;

            $("#runsessions #calendar_overview_js .container_js #sumtable .speed"+
              ", #runsessions #calendar_overview_js .container_js #sumtable .elevation_loss"+
              ", #runsessions #calendar_overview_js .container_js #sumtable .weather"+
              ", #runsessions #calendar_overview_js .container_js #sumtable .surface"+
              ", #runsessions #calendar_overview_js .container_js #sumtable .feeling"/*+
              ", #runsessions #calendar_overview_js .container_js #sumtable .heartrate_max"*/
            ).show();

            $("#runsessions #calendar_overview_js .container_js #sumtable .heartrate_avg").hide();

            // SUM
            var cnt = $("#calendar_overview_js #sumtable tbody tr").length;
            $("#calendar_overview_js #sumtable tfoot td").eq(0).append(" (" + cnt + ")");

            var sx = $("#calendar_overview_js #sumtable tfoot td.distance").text();
            var s = parseFloat(sx.replace(" km", ""));
            var tx = $("#calendar_overview_js #sumtable tfoot td.duration").text();
            var txArr = tx.split(":");
            var tdef = new Date(2000,1,1,0,0,0);
            var td = new Date(tdef);
            td.setHours(txArr[0],txArr[1],txArr[2]);
            var t = (td.getTime()-tdef.getTime()) / 1000 / 60 / 60;
            var kcal = parseInt($("#calendar_overview_js #sumtable tfoot td.kcal").text());
            var elevGain = parseInt($("#calendar_overview_js #sumtable tfoot td.elevation_gain").text().replace(" m", ""));
            var elevLoss = parseInt($("#calendar_overview_js #sumtable tfoot td.elevation_loss").text().replace(" m", ""));

            var pace = t/s;
            //$.each($("#calendar_overview_js #sumtable tfoot td"), function() {$(this).text($(this).text().replace("/(.+?)/g", ""));});
            $("#calendar_overview_js #sumtable tfoot td.distance").append(" (" + (s/cnt).toFixed(2) + ")");
            $("#calendar_overview_js #sumtable tfoot td.duration").append(" (" + (new Date()).clearTime().addSeconds((t*60*60/cnt)).toString('HH:mm:ss') + ")");
            $("#calendar_overview_js #sumtable tfoot td.speed").append(" (" + (s/t).toFixed(2) + ")");
            $("#calendar_overview_js #sumtable tfoot td.pace").append(" (" + (new Date()).clearTime().addSeconds(pace*60*60).toString('HH:mm:ss') + ")");
            $("#calendar_overview_js #sumtable tfoot td.kcal").append(" (" + (kcal/cnt).toFixed(2) + ")");
            $("#calendar_overview_js #sumtable tfoot td.elevation_gain").append(" (" + (elevGain/cnt).toFixed(2) + ")");
            $("#calendar_overview_js #sumtable tfoot td.elevation_loss").append(" (" + (elevLoss/cnt).toFixed(2) + ")");


            //ROW
            /*
            $.each($("#calendar_overview_js #sumtable td.pace"), function() {
                var pacex = $(this).text();
                var pacexArr = pacex.split(":");
                var v = 60.0/(((pacexArr.length == 3) ? parseInt(pacexArr[pacexArr.length-3]) : 0)*60+parseInt(pacexArr[pacexArr.length-2])+parseInt(pacexArr[pacexArr.length-1])/60.0);
                $(this).text($(this).text() + " (" + v.toFixed(2) + ")");
            });*/

            $("#runsessions #calendar_overview_js .container_js #sumtable").css("width", "100"+"%");
            //$("#runsessions #calendar_overview_js .container_js #sumtable thead tr .type").css("width", "100px");
        });
    });
})();