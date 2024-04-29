const pre = document.querySelector('pre');

document.addEventListener('mousemove', e => {
  rotateElement(e, pre)
})
function rotateElement(event, element) {
  // get mouse position
  const x = event.clientX;
  const y = event.clientY;

  console.log(x, y);

  // find the middle 
  const middleX = window.innerWidth / 2;
  const middleY = window.innerHeight / 2;

  // get offset from middle
  const offsetX = ((x - middleX) / middleX) * 45; // max value "* 100% = 100" => 100deg
  const offsetY = ((y - middleY) / middleY) * 45; // max value "* 100% = 100"

  console.log(offsetX, offsetY)

  element.style.setProperty("--rotateX", -1 * offsetY + "deg")
  element.style.setProperty("--rotateY", offsetX + "deg")
}