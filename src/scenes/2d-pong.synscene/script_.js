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
exports.__esModule = true;
// :::
var sqrt = Math.sqrt;
var collision_1 = require("../../simulation/collision");
var shared = {
    itterations: 2,
    fps: 60,
    filepath: '/../scenes/2d-pong.synscene/main.glsl'
};
var startCondition = function (index) { return ([(index + 2) * 200 + index, (index + 2) * 200, 70]); };
var factors = function (index) { return ([(index % 2 === 0 ? 1 : -1) * 1 * (index % 8), (index % 2 === 0 ? 1 : -1) * 1 * (index % 8), 0]); };
var circles = __spreadArray([], new Array(9).fill(0).map(function (_, index) { return (__assign(__assign({}, shared), { uniform: 'u_circle_' + index, startCondition: startCondition(index), factors: factors(index) })); }));
collision_1.main(circles);
// :::
