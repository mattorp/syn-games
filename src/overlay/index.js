const arr = [0,0]

function overlay() {
  const params = window.location.href.split('?')[1].split('-').flat()
  const scores = arr.map(function (_, i) {
    document.getElementById(String(i)).innerText = params[i]
    console.log(`🚀 ~ scores ~ params`, params)
  })
}

document.onload = overlay()
