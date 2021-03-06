// ==UserScript==
// @name         Livesport - Highlighter
// @namespace    https://github.com/Martas86/TamperMonkey
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      https://www.livesport.cz/*
// @exclude      https://www.livesport.cz/zapas/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @updateURL    https://github.com/Martas86/TamperMonkey/raw/master/Release/Livesport-Highlighter.user.js
// @downloadURL  https://github.com/Martas86/TamperMonkey/raw/master/Release/Livesport-Highlighter.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	$ = window.jQuery;
    $(document).ready(function() {
        //alert($("#mc").attr("class"));
        $("#mc").on('hide', '#fs_overlay', function() {
            //alert('#foo is hidden');
            highlight();
        });
        $("#mc").on('click', '.tournament-pages-link', function() {
            //alert('#foo is hidden');
            highlight();
        });
        //$("span.flag fl_62").closest('tr').css('color','blue');
    });

    function highlight() {
        setTimeout(function(){
            $("span.flag.fl_62, span.padl:contains('(Cze)')").closest('tr').css('color','crimson');
        }, 500);
    }

    (function ($) {
        $.each(['show', 'hide'], function (i, ev) {
            var el = $.fn[ev];
            $.fn[ev] = function () {
                this.trigger(ev);
                return el.apply(this, arguments);
            };
        });
    })(window.jQuery);
})();
