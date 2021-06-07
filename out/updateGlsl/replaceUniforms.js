"use strict";
// Replaces a select value in a glsl file for live updates. Requires that the preview supports this. glsl-canvas supports this.
// https://marketplace.visualstudio.com/items?uniform=circledev.glsl-canvas
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require('fs');
var sleep = require('sleep-promise');
var round = Math.round;
var _a = require('./errors'), throwIfNotReplaced = _a.throwIfNotReplaced, throwIfDifferentLengths = _a.throwIfDifferentLengths, throwIfMalformedFactors = _a.throwIfMalformedFactors, throwIfNotAllAreNumbers = _a.throwIfNotAllAreNumbers;
var removeNumber = require("../util/strings").removeNumber;
var getUniformType = require("../util/uniforms").getUniformType;
var deviation = 0.0000000001;
var replaceUniformValue = function (_a) {
    var path = _a.path, searchValue = _a.searchValue, replaceValue = _a.replaceValue;
    var glsl = fs.readFileSync(path, 'utf-8');
    var wasReplaced;
    var newGlsl = glsl.replace(searchValue, function () {
        wasReplaced = true;
        return replaceValue;
    });
    throwIfNotReplaced({ wasReplaced: wasReplaced, searchValue: searchValue, path: path });
    fs.writeFileSync(path, newGlsl);
};
var updatedValues = function (_a) {
    var factor = _a.factor, i = _a.i, startCondition = _a.startCondition;
    return factor * i + startCondition;
};
var getUpdatedValues = function (_a) {
    var _b;
    var i = _a.i, factors = _a.factors, startCondition = _a.startCondition;
    return ((_b = factors.map) === null || _b === void 0 ? void 0 : _b.call(factors, function (factor, j) { return updatedValues({ factor: factor, i: i, startCondition: startCondition[j] }); }))
        || updatedValues({ factor: factors, i: i, startCondition: startCondition });
};
var applyUpdates = function (_a) {
    var itterations = _a.itterations, factors = _a.factors, startCondition = _a.startCondition, path = _a.path, searchValue = _a.searchValue, getReplaceValue = _a.getReplaceValue, fps = _a.fps;
    return __awaiter(void 0, void 0, void 0, function () {
        var sleepFor, updatedValues, i, replaceValue;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sleepFor = 1000 / fps;
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < itterations)) return [3 /*break*/, 4];
                    updatedValues = getUpdatedValues({ i: i, factors: factors, startCondition: startCondition });
                    replaceValue = getReplaceValue(updatedValues);
                    replaceUniformValue({ path: path, searchValue: searchValue, replaceValue: replaceValue });
                    return [4 /*yield*/, sleep(sleepFor)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, updatedValues];
            }
        });
    });
};
var getUniformSearchValue = function (_a) {
    var type = _a.type, uniform = _a.uniform;
    return new RegExp(type + " " + uniform + "\\ +=.+;");
};
var replaceByType = {
    int: function (i) { return "" + i; },
    float: function (i) { return "" + i; },
    vec: function (vec) { return "vec" + vec.length + "( " + vec.reduce(function (acc, v, i) { return acc + ", " + v / (i === 2 ? 2000 : 1); }) + ")"; }
};
var getReplaceWith = function (_a) {
    var type = _a.type, vars = _a.vars;
    return replaceByType[removeNumber(type)](vars);
};
var getReplaceValueFn = function (_a) {
    var type = _a.type, uniform = _a.uniform;
    return function (vars) { return type + " " + uniform + " = " + getReplaceWith({ vars: vars, type: type }) + ";"; };
};
var run = function (_a) {
    var filepath = _a.filepath, uniform = _a.uniform, finalValues = _a.finalValues, factors = _a.factors, startCondition = _a.startCondition, fps = _a.fps, itterations = _a.itterations, shouldLog = _a.shouldLog;
    return __awaiter(void 0, void 0, void 0, function () {
        var path, type, searchValue, getReplaceValue, updatedValue, replaceValueFinal;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    shouldLog && console.log('Start: ' + uniform);
                    throwIfDifferentLengths({ factors: factors, startCondition: startCondition, finalValues: finalValues });
                    throwIfMalformedFactors(factors);
                    throwIfNotAllAreNumbers([factors, startCondition, finalValues]);
                    path = __dirname + filepath;
                    type = getUniformType(factors);
                    searchValue = getUniformSearchValue({ type: type, uniform: uniform });
                    getReplaceValue = getReplaceValueFn({ type: type, uniform: uniform });
                    return [4 /*yield*/, applyUpdates({ itterations: itterations, factors: factors, startCondition: startCondition, path: path, searchValue: searchValue, getReplaceValue: getReplaceValue, fps: fps })];
                case 1:
                    updatedValue = _b.sent();
                    if (finalValues) {
                        replaceValueFinal = getReplaceValueFn({ type: type, uniform: uniform })(finalValues);
                        replaceUniformValue({ path: path, searchValue: searchValue, replaceValue: replaceValueFinal });
                    }
                    shouldLog && console.log('End: ' + uniform);
                    return [2 /*return*/, updatedValue];
            }
        });
    });
};
var runAll = function (arr) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, Promise.all(arr.map(run))];
}); }); };
module.exports = { replaceUniformValue: replaceUniformValue, updatedValues: updatedValues, getUpdatedValues: getUpdatedValues, applyUpdates: applyUpdates, getUniformType: getUniformType, getReplaceWith: getReplaceWith, getReplaceValueFn: getReplaceValueFn, run: run, deviation: deviation, runAll: runAll };
