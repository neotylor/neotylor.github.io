var lights = {
  red: document.getElementById('red'),
  orange: document.getElementById('orange'),
  green: document.getElementById('green')
}
let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');

let currentLight = 'green';
let blinkCount = { red: 3, orange: 3, green: 3 };
let intervalId;
let isBlinking = false;

function turnOnLight(light) {
  Object.keys(lights).forEach(lightKey => {
    lights[lightKey].classList.remove('on');
  })
  if (light) {
    lights[light].classList.add('on');
  }
}

function blinkLight(light, times) {
  let count = 0;
  let blinkInterval = setInterval(() => {
    if (!isBlinking) {
      clearInterval(blinkInterval);
      return;
    }
    if (count >= times * 2) {
      clearInterval(blinkInterval);
      switchLight();
      return;
    }
    if (count % 2 === 0) {
      turnOnLight(light);
    } else {
      turnOnLight('');
    }
    count++;
  }, 500);
}

function switchLight() {
  if (!isBlinking) return;

  switch (currentLight) {
    case 'red':
      currentLight = 'orange';
      blinkLight(currentLight, blinkCount[currentLight]);
      break;
    case 'orange':
      currentLight = 'green';
      blinkLight(currentLight, blinkCount[currentLight]);
      break;
    case 'green':
      currentLight = 'red';
      blinkLight(currentLight, blinkCount[currentLight]);
      break;
  }
}

startButton.addEventListener('click', () => {
  if (isBlinking) return;
  isBlinking = true;
  currentLight = 'green';
  switchLight();
});

stopButton.addEventListener('click', () => {
  isBlinking = false;
  clearInterval(intervalId);
  Object.keys(lights).forEach(lightKey => {
    lights[lightKey].classList.remove('on');
  })
});
