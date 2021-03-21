
const fs = require('fs')
const { sqrt } = Math
const { runAll } = require('../../updateGlsl/replaceUniforms')


const getCirclesIntersect = (a, b) => {
  // When the distance is smaller or equal to the sum
  // of the two radius, the circles touch or overlap

  //* [x,y,r]
  const squareDistance = (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])
  return squareDistance <= ((a[2] + b[2]) * (a[2] + b[2]))
}

const getCollisionVector = (a, b) => ([b[0] - a[0], b[1] - a[1]])

const getDistance = (a, b) => sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));

const getCollisionVectorNorm = (vec, distance) => ([vec[0] / distance, vec[1] / distance])

const getRelativeVelocity = (a, b) => ([a[0] - b[0], a[1] - b[1]])

const getSpeed = (relativeVelocity, collisionVectorNorm) => relativeVelocity[0] * collisionVectorNorm[0] + relativeVelocity[1] * collisionVectorNorm[1]

const getNewFactors = (factors, speed, collisionVectorNorm) => {
  return ([
    [factors[0][1] - speed / 6 * collisionVectorNorm[0], factors[0][1] - speed / 6 * collisionVectorNorm[1]],
    [factors[1][1] - speed / 6 * collisionVectorNorm[0], factors[1][1] - speed / 6 * collisionVectorNorm[1]]
  ])
}

const getCollisions = (circles) => {
  let collisons = []
  circles.forEach((c1, i) => {
    collisons[i] = []
    circles.forEach((c2, j) => {
      if (c1 !== c2) {
        if (getCirclesIntersect(c1, c2)) {
          collisons[i] = [...collisons[i], j]
        }
      }
    })
  })
  return collisons
}

const shared = {
  itterations: 2,
  fps: 200,
  filepath: '/../scenes/2d-pong.synscene/main.glsl',
}

const startCondition = (index) => ([(index + 2) * 200, (index + 2) * 200, 20])
const factors = (index) => ([(index % 2 ? 1 : -1) * index * .20, (index % 2 ? 1 : -1) * index * .20, 0])

const circles = [
  ...new Array(7).fill(0).map((_, index) => ({
    ...shared,
    uniform: 'u_circle_' + index,
    startCondition: startCondition(index),
    factors: factors(index),
  })),
]

const main = async (circles) => {
  const updated = await runAll(circles)
  const collisions = getCollisions(updated)

  let updatedFactors = circles.map(({ factors }) => [factors[0], factors[1]])
  collisions.forEach((e, i) => e.forEach(j => {
    const vec = getCollisionVector(updated[i], updated[j])
    const distance = getDistance(updated[i], updated[j])
    const collisionVectorNorm = getCollisionVectorNorm(vec, distance)
    const relativeVelocity = getRelativeVelocity(circles[i].factors, circles[j].factors)
    const speed = getSpeed(relativeVelocity, collisionVectorNorm)
    if (speed < 0) {
      return
    }
    const newFactors = getNewFactors([circles[i].factors, circles[j].factors], speed, collisionVectorNorm)[1]
    updatedFactors[i] = newFactors

  }))
  const newCircles = circles.map((c, i) => ({ ...c, startCondition: updated[i], factors: [...updatedFactors[i], circles[i].factors[2]], }))

  main(newCircles)

}

main(circles)

// 