const isNumber = require('is-number');
const isInteger = require("is-integer");

const getUniformType = (factors) => isNumber(factors) ?
  (isInteger(factors) ? 'int' : 'float')
  : `vec${factors.length}`

module.exports = { getUniformType }
