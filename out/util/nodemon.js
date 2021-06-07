"use strict";
var run = ['scenes/2d-pong.synscene/run.js'];
var restart = run.map(function (r) { return "pkill -f " + r + " || echo ''  && node " + r + "}"; });
module.exports = {
    "events": { "restart": restart, }
};
