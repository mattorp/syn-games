"use strict";
var arr = [0, 0];
function overlay() {
    var params = window.location.href.split('?')[1].split('-').flat();
    var scores = arr.map(function (_, i) {
        document.getElementById(String(i)).innerText = params[i];
        console.log("\uD83D\uDE80 ~ scores ~ params", params);
    });
}
document.onload = overlay();
