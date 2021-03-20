
// Replaces a select value in a glsl file for live updates. Requires that the preview supports this. glsl-canvas supports this.
// https://marketplace.visualstudio.com/items?uniform=circledev.glsl-canvas

const fs = require('fs')
const { round } = Math

const differentLengths = (arr) => arr.some((v, _, a) => v.length !== a[0].length)

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
    Note that ints and floats must be wrappend in int() or float() in glsl,
    and floats in js cannot end on .0 -- if using floats add a small deviation e.g: .0000000001
`)
  }
}

const sleep = async ms =>
  await new Promise((resolve) => setTimeout(resolve, ms))

const isNumber = (factors) => Number(factors) === factors
const isInt = (i) => `${i}`.indexOf('.') === -1

const getType = (factors) => isNumber(factors) ?
  (isInt(factors) ? 'int' : 'float')
  : `vec${factors.length}`

const replace = ({ path, searchValue, replaceValue }) => {
  const string = fs.readFileSync(path, 'utf-8')

  let wasReplaced
  const newString = string.replace(searchValue, () => {
    wasReplaced = true
    return replaceValue
  })

  throwIfNotReplaced({ wasReplaced, searchValue, path })

  fs.writeFileSync(path, newString)
}

const getSearchValue = ({ type, uniform }) =>
  new RegExp(`${type} ${uniform}\ ?=.+;`)

const getReplaceValueFn = ({ type, uniform }) => {
  const int = (i) => `${i}`
  const float = (i) => `${i}.`
  const vecs = (vec) => `${type}( ${vec.reduce((acc, v) => `${acc}, ${v}`)})`
  const replaceByType = {
    int, float,
    vec2: vecs, vec3: vecs, vec4: vecs
  }

  return (vars) => `${type} ${uniform} = ${replaceByType[type](vars)};`
}

const getUpdatedValues = ({ i, factors, startCondition }) =>
  factors.map?.((factor, j) => factor * i + startCondition[j])
  || factors * i + startCondition

const itterate = async ({ itterations, factors, startCondition, path, searchValue, getReplaceValue, fps }) => {
  const sleepFor = 1000 / fps

  for (let i = 0; i < itterations; i++) {
    const updatedValues = getUpdatedValues({ i, factors, startCondition })
    const replaceValue = getReplaceValue(updatedValues)
    replace({ path, searchValue, replaceValue })
    await sleep(sleepFor)
  }

}

const run = async ({ filepath, uniform, finalValues, factors, startCondition, fps, itterations }) => {
  throwIfDifferentLengths({ factors, startCondition, finalValues })

  const path = __dirname + filepath
  const type = getType(factors)
  const searchValue = getSearchValue({ type, uniform })
  const getReplaceValue = getReplaceValueFn({ type, uniform })

  await itterate({ itterations, factors, startCondition, path, searchValue, getReplaceValue, fps })


  if (finalValues) {
    const replaceFinal = getReplaceValueFn({ type, uniform })(finalValues)
    replace({ path, searchValue, replaceValue: replaceFinal })
  }
}

module.exports = { run }
