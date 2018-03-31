/*jslint browser: true*/
/*global $*/

//new api endpoint
steem.api.setOptions({ url: 'https://api.steemit.com' });

// error handling function
function error(id, text) {
    $("#" + id).text(" - " + text);
    $("#" + id).show();
    $(".loader").fadeOut("slow");
}
//function for single-page transition
function pageTransition(distance) {
    $("#send_button").animate({
        right: distance + "vw"
    });
    $("#back").fadeToggle("fast");
    $("#transfer_page").slideToggle("slow");
    $("#history_page").fadeToggle("slow");
    $("#send_button").toggle();
}
//function to drop last decimal of SBD balance without rounding
function toFixed(variable, d) {
    "use strict";
    var v = parseFloat(variable);
    return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
}
//convert current vw to px
function vw(value) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth

    var result = (x*value)/100;
    return result;
}
