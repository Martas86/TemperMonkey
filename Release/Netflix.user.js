// ==UserScript==
// @name         Netflix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.netflix.com/*
// @grant        GM_addStyle
// @require 	 https://code.jquery.com/jquery-latest.js
// @downloadURL  https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/Netflix.user.js
// @updateURL    https://raw.githubusercontent.com/Martas86/TemperMonkey/master/Release/Netflix.user.js
// ==/UserScript==

GM_addStyle ( `
    div.csfd {
position: absolute;
z-index:10;
margin-top: 1px;
padding:1px 3px 1px 3px;
font: 300 14px "Gotham SSm A","Gotham SSm B",Arial,Helvetica,sans-serif;
font-weight:bold;
    }
` );

(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery;

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
        if ($(movieContainer).parent().find(".csfd").length > 0)
            $(movieContainer).parent().find(".csfd").replaceWith(csfdElmTxt);
        else
            $(movieContainer).after(csfdElmTxt);
    }

    function csfdFindMovie(movieContainer)
    {
        var nazev = $("div a", movieContainer).attr("aria-label");
        var responseUrl;
        var csfdHtml, movie, href, name, rankingColor, ratingValue, ratingCount;
        $.get("https://www.csfd.cz/hledat/?q="+nazev).done(function (data)
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
            csfdFindMovie(movieContainer);
        }
    }

    function csfdInfoAdd(selector)
    {
        $(selector).each(function() {
            if($(this).is(":visible"))
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
        }, 250));
    });

})();