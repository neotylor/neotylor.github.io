let circleOutter = document.querySelector(".circle-outer");
let circleInner= document.querySelector(".circle-inner");
let header = document.querySelector("h1");


document.addEventListener("mousemove", (move)=>{
    let x = (window.innerWidth / 2 -move.pageX) /100*5;
    let y = (window.innerHeight / 2 -move.pageY) /100*6;

    circleOutter.style.transform = `translateX(${x * 4}px) translateY(${y * 4}px)`
    circleInner.style.transform = `translateX(${-x * 1.5}px) translateY(${-y * 1.5}px)`
    header.style.textShadow = `${x/2}px 50px 10px #1b1b1b55`
})