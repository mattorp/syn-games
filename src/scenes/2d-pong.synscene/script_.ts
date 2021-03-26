// :::

import {main} from '../../simulation/collision'

const shared = {
  itterations: 2,
  fps: 60,
  filepath: '/../scenes/2d-pong.synscene/main.glsl',
}

const startCondition = (index) => ([(index + 2) * 150 + index, (index + 2) * 150, 100])
const factors = (index) => ([(index % 2 === 0 ? -1 : 1) * 1 / 10 * (index % 8), (index % 2 === 0 ? -1 : 1) * 1 / 10 * (index % 8), 0])

const circles = [
  ...new Array(9).fill(0).map((_, index) => ({
    ...shared,
    uniform: 'u_circle_' + index,
    startCondition: startCondition(index),
    factors: factors(index),
  })),
]


main(circles)


// :::


