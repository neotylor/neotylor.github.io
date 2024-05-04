document.addEventListener("mousemove", paral);

function paral(m){
    this.querySelectorAll(".move").forEach(move =>{
        const speed = move.getAttribute("speed");

        const x = (window.innerWidth - m.pageX*speed)/100;
        const y = (window.innerHeight - m.pageY*speed)/100;

        move.style.transform = `translateX(${x}px) translateY(${y}px) `
    })
}      