const { Btt } = require('btt');
const http = require('http')
const sleep = require('await-sleep')


const btt = new Btt({
  domain: process.env.BTT_SERVER_HOST,
  port: process.env.BTT_SERVER_PORT,
  protocol: 'http',
  version: '2.525',
});


//! NOTE it seems to be very unstable. Use another approach
const announceWinner = async (points) => {
  await btt.showHUD({ title: points[0], content: 'player 1', duration: 2, background: '(0,0,0)',}).invoke()
  await sleep(3000)
  await btt.showHUD({ title: points[1], content: 'player 2' ,duration: 2,background: '(0,0,0)' }).invoke()
  await sleep(3000)
  await btt.showHUD({ title: 'Player '+points[0]>points[1] ? '1' : '2', content: 'is the winner of round 1!', duration: 4, background: '(0,0,0)' }).invoke()
}

module.exports.announceWinner = announceWinner
