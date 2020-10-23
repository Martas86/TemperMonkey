// ==UserScript==
// @name         Netflix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.netflix.com/*
// @grant        none
// @require 	 https://code.jquery.com/jquery-latest.js
// @downloadURL  https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/Netflix.user.js
// @updateURL    https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/Netflix.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery;

    function csfdInfoAddOne(elm)
    {
        var movieContainer = $(elm);
        //var nazevEng = $(movieContainer).attr("data-eng-title");
        var nazev = $("div a", movieContainer).attr("aria-label");
        //var rok = $(".year", movieContainer).text();

        var top_of_element = $(movieContainer).offset().top;
        var bottom_of_element = $(movieContainer).offset().top + $(movieContainer).outerHeight();
        var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
        var top_of_screen = $(window).scrollTop();

        if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element) && $(".csfd", $(movieContainer)).length == 0 && nazev !== undefined)
        {
            $.get("https://www.csfd.cz/hledat/?q="+nazev).done(function (data) {
                //debugger;
                var responseUrl = $(data).filter("link[rel='canonical']").attr("href");
                var csfdHtml, movie, href, name, rankingColor;
                if(responseUrl.includes("/film/")) // přímo film
                {
                    csfdHtml = $(data);
                    movie = $(data).find('#pg-web-film')[0];
                    href = responseUrl;
                    name = $("h1[itemprop='name']", movie).text();
                    var bodyClass = data.substring(data.indexOf("<body class="), data.indexOf(" id=", data.indexOf("<body class=")));
                    rankingColor = bodyClass.includes("th-1") ? "#b01" : bodyClass.includes("th-2") ? "#658db4" : bodyClass.includes("th-3") ? "#535353" : "#ccc";
                }
                else // vysledek hledani
                {
                    csfdHtml = $(data);
                    movie = $(data).find('#search-films ul li')[0];
                    href = "https://www.csfd.cz/" + $("a", movie).attr("href");
                    name = $("a.film", movie).text();
                    rankingColor = $("a.film", movie).hasClass("c1") ? "#b01" : $("a.film", movie).hasClass("c2") ? "#658db4" : $("a.film", movie).hasClass("c3") ? "#535353" : "#ccc";
                }
                var csfdElmTxt = "<div class='csfd' style='position: absolute; z-index:10; margin-top: 1px; background-color:" + rankingColor + "'><a href='" + href + "'>" + "CSFD" + "</a></div>";
                if ($(movieContainer).find(".csfd").length > 0)
                    $(movieContainer).find(".csfd").replaceWith(csfdElmTxt);
                else
                    $(movieContainer).after(csfdElmTxt);
            });
        }
    }

    function csfdInfoAdd(selector)
    {
        $(selector).each(function() {
            csfdInfoAddOne($(this));
        });
    }

    $(document).ready(function() {
        $('body').on('DOMSubtreeModified', '.title-card div', function(){
            csfdInfoAddOne($(this).closest('.title-card'));
        });
    });

    setTimeout(function() {
        csfdInfoAdd(".title-card");
    }, 250);
    $(window).scroll(function() {
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
            csfdInfoAdd(".title-card");
            //console.log("Haven't scrolled in 250ms!");
        }, 250));
    });

})();