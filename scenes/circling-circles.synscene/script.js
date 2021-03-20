'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = require('fs');

var _require = require('../../glslCanvsUniforms'),
  updateUniforms = _require.updateUniforms;
// updateUniforms({ statics: {} })

function Circle(_ref) {
  var _this = this;

  var x = _ref.x,
    y = _ref.y,
    r = _ref.r,
    vx = _ref.vx,
    vy = _ref.vy;

  this.x = x;
  this.y = y;
  this.r = r;
  this.vx = vx;
  this.vy = vy;
  this.isColliding = false;

  this.updateVelocity = function (_ref2) {
    var vx = _ref2.vx,
      vy = _ref2.vy;

    _this.vx = vx;
    _this.vy = vy;
  };

  this.updateRadius = function (dr) {
    _this.r += dr;
  };

  this.updatePosition = function () {
    _this.x += _this.vx;
    _this.y += _this.vy;
  };
}

var circleIntersect = function circleIntersect(a, b) {
  // When the distance is smaller or equal to the sum
  // of the two radius, the circles touch or overlap
  var squareDistance = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
  return squareDistance <= (a.r + b.r) * (a.r + b.r);
};

var collisionVector = function collisionVector(a, b) {
  return { x: b.x - a.x, y: b.y - a.y };
};

var circleStartConditions = [{ r: 30, x: 300, y: 300, vx: 3, vy: 3 }, { r: 30, x: 0, y: 0, vx: 5, vy: 3 }, { r: 30, x: 1000, y: 1000, vx: -4, vy: -5 }, { r: 30, x: 800, y: 400, vx: 0, vy: 0 }];

var circles = circleStartConditions.map(function (c) {
  return new Circle(c);
});

var sleep = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ms) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new Promise(function (resolve) {
              return setTimeout(resolve, ms);
            });

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function sleep(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var detectCollisions = function detectCollisions() {
  circles.forEach(function (c1) {
    c1.isColliding = false;
    circles.forEach(function (c2) {
      if (c1 !== c2) {
        if (circleIntersect(c1, c2)) {
          c1.isColliding = true;
          c2.isColliding = true;
        }
      }
    });
  });
};

var itterations = new Array(100).fill(0);
var itterate = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var i, json, _, arr, mapped, newObj;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            i = 0;
            json = {};
            _context2.t0 = regeneratorRuntime.keys(itterations);

          case 3:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 16;
              break;
            }

            _ = _context2.t1.value;

            circles.forEach(function (_ref5) {
              var updatePosition = _ref5.updatePosition;

              updatePosition();
            });
            _context2.next = 8;
            return sleep(30);

          case 8:

            detectCollisions();
            arr = circles.map(function (_ref6, i) {
              var x = _ref6.x,
                y = _ref6.y,
                r = _ref6.r;
              return _defineProperty({}, 'u_circle_' + i, [x, y, r]);
            });
            mapped = arr.map(function (item) {
              return _defineProperty({}, Object.keys(item)[0], Object.values(item)[0]);
            });
            newObj = Object.assign.apply(Object, [{}].concat(_toConsumableArray(mapped)));

            updateUniforms({ statics: newObj, json: json });
            i++;
            _context2.next = 3;
            break;

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function itterate() {
    return _ref4.apply(this, arguments);
  };
}();

var run = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.time('fn');
            _context3.next = 3;
            return itterate();

          case 3:
            console.timeEnd('fn');

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function run() {
    return _ref9.apply(this, arguments);
  };
}();

run();

//
