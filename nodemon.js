const run = ['scenes/2d-pong.synscene/run.js']
const restart = run.map(r => `pkill -f ${r} || echo ''  && node ${r}}`)

module.exports = {
  "events":
    "restart": restart
}

