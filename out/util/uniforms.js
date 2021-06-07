"use strict";
var isNumber = require('is-number');
var isInteger = require("is-integer");
var getUniformType = function (factors) { return isNumber(factors) ?
    (isInteger(factors) ? 'int' : 'float')
    : "vec" + factors.length; };
module.exports = { getUniformType: getUniformType };
