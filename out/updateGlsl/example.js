"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var _a = require('./replaceUniforms'), deviation = _a.deviation, runAll = _a.runAll;
var shared = {
    itterations: 800,
    fps: 600,
    filepath: '/../scenes/2d-pong.synscene/main.glsl',
    uniform: 'u_circle_0',
};
var v_float = {
    finalValues: 2 + deviation,
    factors: 2 + deviation,
    startCondition: 2 + deviation,
};
var v_int = {
    finalValues: 2,
    factors: 2,
    startCondition: 2,
};
var v_vec = [
    {
        finalValues: [1, 2],
        factors: [1, 2],
        startCondition: [1, 2],
    },
    {
        finalValues: [300, 600, 10],
        factors: [1, 2, 0],
        startCondition: [1, 2, 10],
    },
    {
        finalValues: [1, 2, 3, 1],
        factors: [1, 2, 3, 3],
        startCondition: [1, 2, 3, 2],
    }
];
var all = __spreadArray([v_float, v_int], v_vec).map(function (e) { return (__assign(__assign({}, shared), e)); });
runAll(all);
