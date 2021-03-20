const isNumber = require('is-number')

const differentProps = ({ arr, key }) => arr.some((v, _, a) => v[key] !== a[0][key])
const differentLengths = (arr) => differentProps({ arr, key: 'length' })

const throwIfNotANumber = (e) => {
  if (!isNumber(e)) {
    throw new Error(`${e} is not a number`)
  }
}

const throwIfNotAllAreNumbers = (arr) => arr.flat(Infinity).map(throwIfNotANumber)


const throwIfDifferentLengths = ({ factors, startCondition, finalValues }) => {
  if (differentLengths([factors, startCondition, finalValues])) {
    throw new Error(`factors, startCondition and finalValues length must match
    factors           : ${factors.length}
    finalValues       : ${finalValues.length}
    startCondition    : ${startCondition.length}
    `)
  }
}

const throwIfNotReplaced = ({ wasReplaced, searchValue, path }) => {
  if (!wasReplaced) {
    throw new Error(`Could not find regex: 
    ${searchValue}
    in
    ${path}

    Make sure the types match.
    Floats in js cannot end on .0 -- if using floats add a small deviation e.g: .0000000001
    This deviation is exported from replaceUniforms
`)
  }
}

const throwIfMalformedFactors = (factors) => {
  if (!isNumber(factors)) {
    const n = factors.length
    if (n < 2 || n > 4) throw new Error('Vector length must be between 2 and 4')
  }
}


module.exports = {
  throwIfNotReplaced,
  throwIfDifferentLengths,
  throwIfNotReplaced,
  throwIfMalformedFactors,
  throwIfNotANumber,
  throwIfNotAllAreNumbers
}
