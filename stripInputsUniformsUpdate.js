const fs = require('fs')

const main = (path) => {
  const stripped = fs.readFileSync(path, 'utf-8').split(':::')[1]
  const strippedScript = path + '-stripped.js'
  fs.writeFileSync(strippedScript, stripped)
}

module.exports = { main }
