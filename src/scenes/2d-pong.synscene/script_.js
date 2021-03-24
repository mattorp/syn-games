// :::
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
  const newFactors = ([
    [factors[0][0] - speed * collisionVectorNorm[0], factors[0][1] - speed * collisionVectorNorm[1]],
    [factors[1][0] + speed * collisionVectorNorm[0], factors[1][1] + speed * collisionVectorNorm[1]]
  ])

  return newFactors
}

const getCollisions = (circles) => {
  let collisons = []
  let count = 0
  circles.forEach((c1, i) => {
    collisons[i] = []
    circles.forEach((c2, j) => {
      if (c1 !== c2 && !collisons[j]?.includes(i)) {
        if (getCirclesIntersect(c1, c2)) {
          collisons[i] = [...collisons[i], j]
          count++
        }
      }
    })
  })

  if (count > 0) {
  }
  return collisons
}

const shared = {
  itterations: 2,
  fps: 60,
  filepath: '/../scenes/2d-pong.synscene/main.glsl',
}

const startCondition = (index) => ([(index + 2) * 200 + index, (index + 2) * 200, 70])
const factors = (index) => ([(index % 2 === 0 ? 1 : -1) * 1 * (index % 8), (index % 2 === 0 ? 1 : -1) * 1 * (index % 8), 0])

const circles = [
  ...new Array(9).fill(0).map((_, index) => ({
    ...shared,
    uniform: 'u_circle_' + index,
    startCondition: startCondition(index),
    factors: factors(index),
  })),
]
const bounce = (a, b, conservation = 1) => conservation * Math.max(
  sqrt(Math.abs(a.factors[0]) + Math.abs(a.factors[1])),
  sqrt(Math.abs(b.factors[0]) + Math.abs(b.factors[1])),
)

const main = async (circles) => {
  const updated = await runAll(circles)
  const collisions = getCollisions(updated)

  let updatedFactors = circles.map(({ factors }) => [factors[0], factors[1]])
  let checked = []
  collisions.forEach((e, i) => e.forEach(j => {
    collided = true
    const vec = getCollisionVector(updated[i], updated[j])
    const distance = getDistance(updated[i], updated[j])
    const collisionVectorNorm = getCollisionVectorNorm(vec, distance)
    const relativeVelocity = getRelativeVelocity(circles[i].factors, circles[j].factors)

    let speed = getSpeed(relativeVelocity, collisionVectorNorm)
    if (speed < 0.001) {
      speed = bounce(circles[i], circles[j], 1)
    }
    const newFactors = getNewFactors([circles[i].factors, circles[j].factors], speed, collisionVectorNorm)

    updatedFactors[i] = newFactors[0]
    updatedFactors[j] = newFactors[1]


  }))
  const newCircles = [circles[0], ...circles.map((c, i) => ({ ...c, startCondition: updated[i], factors: [...updatedFactors[i], circles[i].factors[2]], })).splice(1, 7), circles[8]]


  main(newCircles)

}

main(circles)

// :::


