const { deviation, runAll } = require('../../updateGlsl/replaceUniforms')

const shared = {
  itterations: 800,
  fps: 600,
  filepath: '/../scenes/2d-pong.synscene/main.glsl',
  uniform: 'u_circle_0',
}

const v_float = {
  finalValues: 2 + deviation,
  factors: 2 + deviation,
  startCondition: 2 + deviation,
}

const v_int = {
  finalValues: 2,
  factors: 2,
  startCondition: 2,
}

const v_vec = [
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
]

const all = [v_float, v_int, ...v_vec].map(e => ({ ...shared, ...e }))
runAll(all)
