"use strict";
var isNumber = require('is-number');
var differentProps = function (_a) {
    var arr = _a.arr, key = _a.key;
    return arr.filter(function (e) { return e; }).some(function (v, _, a) { return v[key] !== a[0][key]; });
};
var differentLengths = function (arr) { return differentProps({ arr: arr, key: 'length' }); };
var throwIfNotANumber = function (e) {
    if (!isNumber(e)) {
        throw new Error(e + " is not a number");
    }
};
var throwIfNotAllAreNumbers = function (arr) { return arr.filter(function (e) { return e; }).flat(Infinity).map(throwIfNotANumber); };
var throwIfDifferentLengths = function (_a) {
    var factors = _a.factors, startCondition = _a.startCondition, finalValues = _a.finalValues;
    if (differentLengths([factors, startCondition, finalValues])) {
        throw new Error("factors, startCondition and finalValues length must match\n    factors           : " + factors.length + "\n    finalValues       : " + (finalValues === null || finalValues === void 0 ? void 0 : finalValues.length) + "\n    startCondition    : " + startCondition.length + "\n    ");
    }
};
var throwIfNotReplaced = function (_a) {
    var wasReplaced = _a.wasReplaced, searchValue = _a.searchValue, path = _a.path;
    if (!wasReplaced) {
        throw new Error("Could not find regex: \n    " + searchValue + "\n    in\n    " + path + "\n\n    Make sure the types match.\n    Floats in js cannot end on .0 -- if using floats add a small deviation e.g: .0000000001\n    This deviation is exported from replaceUniforms\n");
    }
};
var throwIfMalformedFactors = function (factors) {
    if (!isNumber(factors)) {
        var n = factors.length;
        if (n < 2 || n > 4)
            throw new Error('Vector length must be between 2 and 4');
    }
};
module.exports = {
    throwIfNotReplaced: throwIfNotReplaced,
    throwIfDifferentLengths: throwIfDifferentLengths,
    throwIfNotReplaced: throwIfNotReplaced,
    throwIfMalformedFactors: throwIfMalformedFactors,
    throwIfNotANumber: throwIfNotANumber,
    throwIfNotAllAreNumbers: throwIfNotAllAreNumbers
};
