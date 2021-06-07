"use strict";
var fs = require('fs');
var main = function (path) {
    var stripped = fs.readFileSync(path, 'utf-8').split(':::')[1];
    var strippedScript = path + '-stripped.js';
    fs.writeFileSync(strippedScript, stripped);
};
module.exports = { main: main };
