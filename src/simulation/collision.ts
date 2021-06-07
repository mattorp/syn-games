import {runAll} from '../updateGlsl/replaceUniforms'
const {sqrt} = Math


type Vec2 = [number, number]
type Vec3 = [number, number, number]

// Check if the circles are colliding
const getCirclesIntersect: (a: Vec3, b: Vec3) => boolean = (a, b) => {
  // When the distance is smaller or equal to the sum
  // of the two radius, the circles touch or overlap

  //* [x,y,r]
  const squareDistance = (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])
  return squareDistance <= ((a[2] + b[2]) * (a[2] + b[2]))
}

// Gets the resulting vetor of the collision
const getCollisionVector: (a: Vec2, b: Vec2) => Vec2 = (a, b) => ([b[0] - a[0], b[1] - a[1]])

// Distance between the circle centers
const getDistance: (a: Vec2, b: Vec2) => number = (a, b) => sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));

// Gets the normalized vector (length 1) of the circle collision
const getCollisionVectorNorm: (vec: Vec2, distance: number) => Vec2 =
  (vec, distance) => ([vec[0] / distance, vec[1] / distance])

// Vec2 of the velocity of the circles combined
const getRelativeVelocity: (a: Vec2, b: Vec2) => Vec2 = (a, b) => ([a[0] - b[0], a[1] - b[1]])

// Speed of the collision
const getSpeed: (relativeVelocity: Vec2, collisionVectorNorm: Vec2) => number = (relativeVelocity, collisionVectorNorm) => relativeVelocity[0] * collisionVectorNorm[0] + relativeVelocity[1] * collisionVectorNorm[1]

// returns update vectors for both objects after collision
const getVectorsPostCollision: (factors: [Vec2, Vec2], speed: number, collisionVectorNorm: Vec2) => [Vec2, Vec2] = (factors, speed, collisionVectorNorm) => {
  const newFactors: [Vec2, Vec2] = ([
    [factors[0][0] - speed * collisionVectorNorm[0], factors[0][1] - speed * collisionVectorNorm[1]],
    [factors[1][0] + speed * collisionVectorNorm[0], factors[1][1] + speed * collisionVectorNorm[1]]
  ])

  return newFactors
}

// Gets the speed of the faster object, letting it bounce of a static object. The conservation defines the energy conservation: 1 is no loss 0 is full loss.
const bounce: (a: Vec2, b: Vec2, conservation?: number) => number = (a, b, conservation = 1) => conservation * Math.max(
  sqrt(Math.abs(a[0]) + Math.abs(a[1])),
  sqrt(Math.abs(b[0]) + Math.abs(b[1])),
)

// Gets an array of Vec3 for all collisions between circles at their current position and size
const getCollisions: (circles: Vec3[]) => number[][] = (circles) => {
  const collisions: number[][] = []
  circles.forEach((c1, i) => {
    collisions[i] = []
    circles.forEach((c2, j) => {
      if (c1 !== c2 && !collisions[j]?.includes(i)) {
        if (getCirclesIntersect(c1, c2)) {
          collisions[i] = [...collisions[i], j]
        }
      }
    })
  })
  return collisions
}

const main = async (circles) => {
  const updated = await runAll(circles)
  const collisions = getCollisions(updated)

  let updatedFactors = circles.map(({factors}) => [factors[0], factors[1]])
  collisions.forEach((e, i) => e.forEach(j => {
    const vec = getCollisionVector(updated[i], updated[j])
    const distance = getDistance(updated[i], updated[j])
    const collisionVectorNorm = getCollisionVectorNorm(vec, distance)
    const relativeVelocity = getRelativeVelocity(circles[i].factors, circles[j].factors)

    let speed = getSpeed(relativeVelocity, collisionVectorNorm)
    if (speed < 0.001) {
      speed = bounce(circles[i].factors, circles[j].factors, 1)
    }
    const newFactors = getVectorsPostCollision([circles[i].factors, circles[j].factors], speed, collisionVectorNorm)

    updatedFactors[i] = newFactors[0]
    updatedFactors[j] = newFactors[1]


  }))
  const newCircles = [circles[0], ...circles.map((c, i) => ({...c, startCondition: updated[i], factors: [...updatedFactors[i], circles[i].factors[2]], })).splice(1, 7), circles[8]]


  main(newCircles)

}

export {main}
