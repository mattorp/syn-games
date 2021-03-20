const { run } = require('./glslReplace')
const deviation = 0.0000000001

const shared = {
  itterations: 800,
  fps: 600,
  filepath: '/scenes/2d-pong.synscene/main.glsl',
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
  0, 1,
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

const int = () => run({ ...shared, ...v_int })
const float = () => run({ ...shared, ...v_float })
const vec = (n) => {
  if (n < 2 || n > 4) throw new Error('Vector length must be between 2 and 4')
  run({ ...shared, ...v_vec[n] })
}

int()
float()
vec(2)
vec(3)
vec(4)
