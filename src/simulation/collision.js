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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.main = void 0;
var sqrt = Math.sqrt;
var runAll = require('../updateGlsl/replaceUniforms').runAll;
// Check if the circles are colliding
var getCirclesIntersect = function (a, b) {
    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    //* [x,y,r]
    var squareDistance = (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]);
    return squareDistance <= ((a[2] + b[2]) * (a[2] + b[2]));
};
// Gets the resulting vetor of the collision
var getCollisionVector = function (a, b) { return ([b[0] - a[0], b[1] - a[1]]); };
// Distance between the circle centers
var getDistance = function (a, b) { return sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])); };
// Gets the normalized vector (length 1) of the circle collision
var getCollisionVectorNorm = function (vec, distance) { return ([vec[0] / distance, vec[1] / distance]); };
// Vec2 of the velocity of the circles combined
var getRelativeVelocity = function (a, b) { return ([a[0] - b[0], a[1] - b[1]]); };
// Speed of the collision
var getSpeed = function (relativeVelocity, collisionVectorNorm) { return relativeVelocity[0] * collisionVectorNorm[0] + relativeVelocity[1] * collisionVectorNorm[1]; };
// returns update vectors for both objects after collision
var getVectorsPostCollision = function (factors, speed, collisionVectorNorm) {
    var newFactors = ([
        [factors[0][0] - speed * collisionVectorNorm[0], factors[0][1] - speed * collisionVectorNorm[1]],
        [factors[1][0] + speed * collisionVectorNorm[0], factors[1][1] + speed * collisionVectorNorm[1]]
    ]);
    return newFactors;
};
// Gets the speed of the faster object, letting it bounce of a static object. The conservation defines the energy conservation: 1 is no loss 0 is full loss.
var bounce = function (a, b, conservation) {
    if (conservation === void 0) { conservation = 1; }
    return conservation * Math.max(sqrt(Math.abs(a[0]) + Math.abs(a[1])), sqrt(Math.abs(b[0]) + Math.abs(b[1])));
};
// Gets an array of Vec3 for all collisions between circles at their current position and size
var getCollisions = function (circles) {
    var collisions = [];
    circles.forEach(function (c1, i) {
        collisions[i] = [];
        circles.forEach(function (c2, j) {
            var _a;
            if (c1 !== c2 && !((_a = collisions[j]) === null || _a === void 0 ? void 0 : _a.includes(i))) {
                if (getCirclesIntersect(c1, c2)) {
                    collisions[i] = __spreadArray(__spreadArray([], collisions[i]), [j]);
                }
            }
        });
    });
    return collisions;
};
var main = function (circles) { return __awaiter(void 0, void 0, void 0, function () {
    var updated, collisions, updatedFactors, newCircles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runAll(circles)];
            case 1:
                updated = _a.sent();
                collisions = getCollisions(updated);
                updatedFactors = circles.map(function (_a) {
                    var factors = _a.factors;
                    return [factors[0], factors[1]];
                });
                collisions.forEach(function (e, i) { return e.forEach(function (j) {
                    var vec = getCollisionVector(updated[i], updated[j]);
                    var distance = getDistance(updated[i], updated[j]);
                    var collisionVectorNorm = getCollisionVectorNorm(vec, distance);
                    var relativeVelocity = getRelativeVelocity(circles[i].factors, circles[j].factors);
                    var speed = getSpeed(relativeVelocity, collisionVectorNorm);
                    if (speed < 0.001) {
                        speed = bounce(circles[i].factors, circles[j].factors, 1);
                    }
                    var newFactors = getVectorsPostCollision([circles[i].factors, circles[j].factors], speed, collisionVectorNorm);
                    updatedFactors[i] = newFactors[0];
                    updatedFactors[j] = newFactors[1];
                }); });
                newCircles = __spreadArray(__spreadArray([circles[0]], circles.map(function (c, i) { return (__assign(__assign({}, c), { startCondition: updated[i], factors: __spreadArray(__spreadArray([], updatedFactors[i]), [circles[i].factors[2]]) })); }).splice(1, 7)), [circles[8]]);
                main(newCircles);
                return [2 /*return*/];
        }
    });
}); };
exports.main = main;
