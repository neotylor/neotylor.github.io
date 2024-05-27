const div = document.getElementById("movableDiv");

let startX = 0;
let startY = 0;

function moveDiv(event) {
	var x = event.clientX;
	var y = event.clientY;
	div.style.left = x + "px";
	div.style.top = y + "px";
}

document.addEventListener("pointermove", moveDiv);
