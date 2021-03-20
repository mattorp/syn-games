
// Replaces a select value in a glsl file for live updates. Requires that the preview supports this. glsl-canvas supports this.
// https://marketplace.visualstudio.com/items?uniform=circledev.glsl-canvas

const fs = require('fs')
const sleep = require('sleep-promise')
const { round } = Math
const { throwIfNotReplaced, throwIfDifferentLengths, throwIfMalformedFactors } = require('./errors')
const { removeNumber } = require("../util/strings")
const { getUniformType } = require("../util/uniforms")

const deviation = 0.0000000001

const replaceUniformValue = ({ path, searchValue, replaceValue }) => {
  const glsl = fs.readFileSync(path, 'utf-8')

  let wasReplaced
  const newGlsl = glsl.replace(searchValue, () => {
    wasReplaced = true
    return replaceValue
  })

  throwIfNotReplaced({ wasReplaced, searchValue, path })

  fs.writeFileSync(path, newGlsl)
}

const updatedValues = ({ factors, i, startCondition }) => factors * i + startCondition

const getUpdatedValues = ({ i, factors, startCondition }) =>
  factors.map?.((factor, j) => updatedValues({ factors, i, startCondition: startCondition[j] }))
  || updatedValues({ factors, i, startCondition })

const applyUpdates = async ({ itterations, factors, startCondition, path, searchValue, getReplaceValue, fps }) => {
  const sleepFor = 1000 / fps

  for (let i = 0; i < itterations; i++) {
    const updatedValues = getUpdatedValues({ i, factors, startCondition })
    const replaceValue = getReplaceValue(updatedValues)
    replaceUniformValue({ path, searchValue, replaceValue })
    await sleep(sleepFor)
  }
}

const getUniformSearchValue = ({ type, uniform }) =>
  new RegExp(`${type} ${uniform}\ +=.+;`)

const replaceByType = {
  int: (i) => `${i}`,
  float: (i) => `${i}.`,
  vec: (vec) => `vec${vec.length}( ${vec.reduce((acc, v) => `${acc}, ${v}`)})`
}

const getReplaceWith = ({ type, vars }) => replaceByType[removeNumber(type)](vars)

const getReplaceValueFn = ({ type, uniform }) => (vars) => `${type} ${uniform} = ${getReplaceWith({ vars, type })};`

const run = async ({ filepath, uniform, finalValues, factors, startCondition, fps, itterations, shouldLog }) => {
  shouldLog && console.log('Start: ' + uniform)

  throwIfDifferentLengths({ factors, startCondition, finalValues })
  throwIfMalformedFactors(factors)

  const path = __dirname + filepath
  const type = getUniformType(factors)

  const searchValue = getUniformSearchValue({ type, uniform })
  const getReplaceValue = getReplaceValueFn({ type, uniform })

  await applyUpdates({ itterations, factors, startCondition, path, searchValue, getReplaceValue, fps })

  if (finalValues) {
    const replaceValueFinal = getReplaceValueFn({ type, uniform })(finalValues)
    replaceUniformValue({ path, searchValue, replaceValue: replaceValueFinal })
  }

  shouldLog && console.log('End: ' + uniform)
}

const runAll = async (arr) => {
  await Promise.all(arr.map(run))
  console.log('Done replacing uniforms')
}


module.exports = { run, deviation, runAll }
