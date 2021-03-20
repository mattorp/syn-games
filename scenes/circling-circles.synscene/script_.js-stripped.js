
const fs = require('fs')
const { updateUniforms } = require('../../uniforms')
// updateUniforms({ statics: {} })

function Circle({ x, y, r, vx, vy }) {
  this.x = x
  this.y = y
  this.r = r
  this.vx = vx
  this.vy = vy
  this.isColliding = false

  this.updateVelocity = ({ vx, vy }) => {
    this.vx = vx
    this.vy = vy
  }

  this.updateRadius = (dr) => {
    this.r += dr
  }

  this.updatePosition = () => {
    this.x += this.vx
    this.y += this.vy
  }
}

const circleIntersect = (a, b) => {
  // When the distance is smaller or equal to the sum
  // of the two radius, the circles touch or overlap
  const squareDistance = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)
  return squareDistance <= ((a.r + b.r) * (a.r + b.r))
}

const collisionVector = (a, b) => ({ x: b.x - a.x, y: b.y - a.y })

const circleStartConditions = [
  { r: 30, x: 300, y: 300, vx: 3, vy: 3 },
  { r: 30, x: 0, y: 0, vx: 5, vy: 3 },
  { r: 30, x: 1000, y: 1000, vx: -4, vy: -5 },
  { r: 30, x: 800, y: 400, vx: 0, vy: 0 }
]

const circles = circleStartConditions.map((c) =>
  new Circle(c))

const sleep = async ms =>
  await new Promise((resolve) => setTimeout(resolve, ms))

const detectCollisions = () => {
  circles.forEach((c1) => {
    c1.isColliding = false
    circles.forEach((c2) => {
      if (c1 !== c2) {
        if (circleIntersect(c1, c2)) {
          c1.isColliding = true
          c2.isColliding = true
        }
      }
    })
  })
}

const itterations = new Array(100).fill(0)
const itterate = async () => {
  let i = 0
  let json = {}
  for (const _ in itterations) {
    circles.forEach(({ updatePosition }) => {
      updatePosition()
    })
    await sleep(30)

    detectCollisions()
    const arr = circles.map(({ x, y, r }, i) => ({ ['u_circle_' + i]: [x, y, r] }))
    var mapped = arr.map(item => ({ [Object.keys(item)[0]]: Object.values(item)[0] }));
    var newObj = Object.assign({}, ...mapped);
    updateUniforms({ statics: newObj, json });
    i++
  }
}

const run = async () => {
  console.time('fn')
  await itterate()
  console.timeEnd('fn')
}

run()

// 