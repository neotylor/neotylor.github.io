// speed-coded re-code of experiment from 2003

const canvas = document.createElement('canvas')
const c = canvas.getContext('2d')

document.body.append(canvas)

let lastRand = Math.random()

function zrand() {
  if (Math.random() < .8) return lastRand;

  lastRand = Math.random()
  return lastRand
}

let mx = 0
let my = 0
onpointermove = e => {
  mx = e.clientX
  my = e.clientY
}

let hw
let hh

function resize() {

  w = innerWidth * 2
  h = innerHeight * 2
  hw = w / 2
  hh = h / 2
  canvas.width = w
  canvas.height = h
  canvas.style.width = innerWidth + 'px'
}
resize()

const S = 4;

function sprite(p) {
  p = Object.assign({
    x: 0,
    y: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    fill: 'gray',
    stroke: 'black',
    width: 100,
    height: 100,
    center: true
  }, p)
  p.sx = p.x
  p.sy = p.y
  return () => {
    c.save()
    c.translate(p.x, p.y)
    c.rotate(p.rotation)
    c.scale(p.scaleX, p.scaleY)

    if (p.center) c.translate(-p.width / 2, -p.height / 2)

    c.fillStyle = p.fill

    c.strokeStyle = p.stroke
    p.draw(p)
    c.restore()
  }
}

let line = sprite({
  x: w / 2,
  y: h / 2,
  width: 1,
  t: zrand() * 100,
  center: false,
  rotation: zrand() * 7,
  stroke: 'rgba(0, 0, 0, .02)',
  draw(p) {
    if (zrand() < .7) {
      p.stroke = 'rgba(255, 255, 255, .5)'
    } else {
      p.stroke = 'rgba(0, 0, 0, .25)'
    }

    p.x = 100 + p.sx + (hw) * Math.tan(p.t);
    p.y = p.sy + S * 20 * Math.cos(p.t);
    p.rotation += 1

    p.t = (+new Date() * Math.PI / 180) / .02500000001;

    c.beginPath()
    c.moveTo(0, 0)
    c.lineTo(0, h / 1.5)
    c.stroke()
  }
})


let circle = sprite({
  x: hw,
  y: hh,
  t: 0,
  width: Math.min(hh, hw) * .6,
  height: 100,
  center: false,
  stroke: `rgba(0, 22, 70, .5)`,
  draw(p) {

    let ax
    let ay

    p.t = (+new Date() * Math.PI / 180) / .02500000001;

    if (zrand() < .05) {
      ax = S * 2 * Math.tan(-p.t)
      ay = S * 12 * Math.cos(p.t);
      p.stroke = 'rgba(255, 255, 255, .5)'
      c.lineWidth = 5
    } else {
      p.stroke = `rgba(0, 22, 70, .3)`
      c.lineWidth = 6
      ax = S * 2.5 * Math.tan(p.t)
      ay = S * 2.5 * Math.sin(p.t);
    }
    p.x = p.sx + ax;
    p.y = p.sy + ay;
    p.scaleX = 1 + ax / 1000
    p.scaleY = 1 + ay / 1000
    p.rotation += .1

    c.beginPath()
    c.arc(0, 0, p.width, 0, 7)
    c.stroke()
  }
})

c.fillStyle = 'rgba(245, 245, 245, 1)'
c.fillRect(0, 0, w, h)

setInterval(() => {

  c.globalAlpha = 1
  line()
  circle()

  if (zrand() < .5) {
    c.globalAlpha = .55
    let cc = Math.min(w, h) * .003
    c.drawImage(canvas, 0, 0, w + ~~(Math.random() * cc), h + cc)
  }

  if (zrand() < .1) {
    c.fillStyle = 'rgba(255, 255, 255, .04)'
    c.fillRect(0, 0, w, h)
  }
}, 16)