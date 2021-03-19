
// Replaces a select value in a glsl file for live updates. Requires that the preview supports this. glsl-canvas supports this.
// https://marketplace.visualstudio.com/items?uniform=circledev.glsl-canvas

const fs = require('fs')
const { round } = Math

const throwIfLengthsDontMatch = ({ factor, startCondition, resetValues }) => {
  if ([factors, startCondition, resetValues].some((v, _, a) => {
    return v.length !== a[0].length
  }
  )) {
    throw new Error(`factors, startCondition and resetValues length must match
    factors           : ${factors.length}
    resetValues       : ${resetValues.length}
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

const getSearchValue = ({ type, uniform }) => new RegExp(`${type} ${uniform}\ ?=\ ?${type}\(.+\);`)

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
  factors.map?.((factor, j) => factor * i + startCondition[j]) || factors * i + startCondition

const run = async ({ filepath, uniform, resetValues, factors, startCondition, fps, iterations }) => {
  throwIfLengthsDontMatch({ factors, startCondition, resetValues })

  const path = __dirname + filepath
  const sleepFor = 1000 / fps
  const type = getType(factors)
  const searchValue = getSearchValue({ type, uniform })
  const getReplaceValue = getReplaceValueFn({ type, uniform })

  if (resetValues) {
    const replaceValue = getReplaceValueFn({ type, uniform })(resetValues)
    replace({ path, searchValue, replaceValue })
  }

  for (let i = 0; i < iterations; i++) {
    const updatedValues = getUpdatedValues({ i, factors, startCondition })
    const replaceValue = getReplaceValue(updatedValues)
    replace({ path, searchValue, replaceValue })
    await sleep(sleepFor)
  }
}

const deviation = 0.0000000001

module.exports = { run, deviation }

// * Examples below. 
// TODO Comment out or remove the following when not testing
throw new Error('Make sure to remove the following lines if calling run outside thhs file! Comment me out if using the examples below\n')

const vec = [
  null, null,
  {
    resetValues: [1, 2],
    factors: [1, 2],
    startCondition: [1, 2],
  },
  {
    resetValues: [1, 2, 3],
    factors: [1, 2, 3],
    startCondition: [1, 2, 3],
  },
  {
    resetValues: [1, 2, 3, 1],
    factors: [1, 2, 3, 3],
    startCondition: [1, 2, 3, 2],
  }
]

const float = {
  resetValues: 2 + deviation,
  factors: 2 + deviation,
  startCondition: 2 + deviation,
}

const int = {
  resetValues: 2,
  factors: 2,
  startCondition: 2,
}

const {
  resetValues,
  factors,
  startCondition,
} =
  // int
  // float
  vec[4]
// vec[3]
// vec[4]

const iterations = 800
const fps = 600
const filepath = '/scenes/2d-pong.synscene/main.glsl'
const uniform = 'u_circle_0'

run({ filepath, uniform, resetValues, factors, startCondition, iterations, fps })
