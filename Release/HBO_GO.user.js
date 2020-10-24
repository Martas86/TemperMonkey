// ==UserScript==
// @name         HBO GO
// @namespace    https://github.com/Martas86/TamperMonkey
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://hbogo.cz/*
// @grant        GM_addStyle
// @require 	 https://code.jquery.com/jquery-latest.js
// @downloadURL  https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/HBO-GO.user.js
// @updateURL    https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/HBO-GO.user.js
// ==/UserScript==

GM_addStyle ( `
    div.csfd {
position: absolute;
z-index:10;
margin-top: -15px;
padding:1px 3px 1px 3px;
font: 300 14px "Gotham SSm A","Gotham SSm B",Arial,Helvetica,sans-serif;
font-weight:bold;
    }
` );

(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery;

    function dofiltruj() {
        var rokOd = $("#xRokOd").val() == "" ? 0 : parseInt($("#xRokOd").val());
        var rokDo = $("#xRokDo").val() == "" ? 2999 : parseInt($("#xRokDo").val());
        var imdbOd = $("#xImdbOd").val() == "" ? 0 : parseInt($("#xImdbOd").val());
        var imdbDo = $("#xImdbDo").val() == "" ? 10 : parseInt($("#xImdbDo").val());

        $(".grid-item").each(function() {
            var nazev = $(".title", this).text();
            var rok = $(".year", this).text();
            var imdb = $(this).attr("data-imdb");
            $(this).toggle((rok >= rokOd && rok <= rokDo) && (imdb >= imdbOd && imdb<= imdbDo));
            csfdInfoAdd(this);
        });
    }

    function dofiltrujZrus() {
        $(".grid-item").each(function() {
            $(this).show();
        });
    }

    function csfdInfoFill(movieContainer, data)
    {
        var csfdHtml, movie, href, name, rankingColor, ratingValue, ratingCount;

        var responseUrl = $(data).filter("link[rel='canonical']").attr("href");
        csfdHtml = $(data);
        movie = $(data).find('#pg-web-film')[0];
        href = responseUrl;
        name = $("h1[itemprop='name']", movie).text();
        var bodyClass = data.substring(data.indexOf("<body class="), data.indexOf(" id=", data.indexOf("<body class=")));
        rankingColor = bodyClass.includes("th-1") ? "#b01" : bodyClass.includes("th-2") ? "#658db4" : bodyClass.includes("th-3") ? "#535353" : "#ccc";
        ratingValue = $("#rating meta[itemprop='ratingValue']", movie).prop("content") || "?";
        ratingCount = $("#rating meta[itemprop='ratingCount']", movie).prop("content") || "?";

        var csfdElmTxt = "<div class='csfd' style='background-color:" + rankingColor + ";'><a href='" + href + "'>" + "CSFD" + " / " + ratingValue + "% / " + ratingCount + "</a></div>";
         $(movieContainer).append(csfdElmTxt);
    }

    function csfdFindMovie(movieContainer)
    {
        var nazevEng = $(movieContainer).attr("data-eng-title");
        var nazev = $(".title", movieContainer).text();
        var rok = $(".year", movieContainer).text();
        var responseUrl;
        var csfdHtml, movie, href, name, rankingColor, ratingValue, ratingCount;
        $.get("https://www.csfd.cz/hledat/?q="+nazevEng+" " + rok).done(function (data)
        {
            responseUrl = $(data).filter("link[rel='canonical']").attr("href");
            if(responseUrl.includes("/film/")) // přímo film
            {
                csfdInfoFill(movieContainer, data);
            }
            else // vysledek hledani
            {
                csfdHtml = $(data);
                movie = $(data).find('#search-films ul li')[0];
                href = "https://www.csfd.cz/" + $("a", movie).attr("href");
                $.get(href).done(function (data2)
                {
                    csfdInfoFill(movieContainer, data2);
                });
            }
        });
    }

    function csfdInfoAdd(selector)
    {
        $(selector).each(function() {
            var movieContainer = $(this);
            var nazevEng = $(movieContainer).attr("data-eng-title");
            var nazev = $(".title", movieContainer).text();
            var rok = $(".year", movieContainer).text();

            var top_of_element = $(movieContainer).offset().top;
            var bottom_of_element = $(movieContainer).offset().top + $(movieContainer).outerHeight();
            var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
            var top_of_screen = $(window).scrollTop();

            if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element) && $(".csfd", $(movieContainer)).length == 0 && nazevEng !== undefined)
            {
                csfdFindMovie(movieContainer);
            }
        });
    }

    $(document).ready(function() {
        $("body").append('<div style="width: 350px;position: fixed; top: 100px; left: 0px;">\
<table style="margin: 0 auto;">\
<tr>\
<th>Rok:</th><td><input id="xRokOd" type="text" style="width:40px;"></input> - <input id="xRokDo" type="text" style="width:40px;"></input></td>\
</tr>\
<tr>\
<th>IMDb:</th><td><input id="xImdbOd" type="text" style="width:40px;"></input> - <input id="xImdbDo" type="text" style="width:40px;"></input></td>\
</tr>\
<tr>\
<td colspan="2" style="text-align: center;"><button id="xDofiltruj" style="margin: 0px 0px 0px 5px;" type=button>Dofiltruj</button><button id="xZrus" style="margin: 5px 0px 0px 10px;" type=button>Zruš</button></td>\
</tr>\
</table>\
</div>');

        $("body").on("click", "#xDofiltruj", function(){
            dofiltruj();
        })
        .on("click", "#xZrus", function(){
            dofiltrujZrus();
        })
        ;
    });

    setTimeout(function() {
        csfdInfoAdd(".grid-item");
        csfdInfoAdd(".shelf-item");
    }, 250);
    $(window).scroll(function() {
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
            csfdInfoAdd(".grid-item");
            csfdInfoAdd(".shelf-item");
            //console.log("Haven't scrolled in 250ms!");
        }, 250));
    });

})();