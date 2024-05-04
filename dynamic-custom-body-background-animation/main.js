star = ()=>{
    let div = document.createElement("div");
    let size = Math.random() * 12;
    let time = Math.random() * 3;

    div.setAttribute("class", "star");

    document.body.appendChild(div);

    div.style.left = Math.random() * + innerWidth + "px";
    div.style.width = 2 + size + "px";
    div.style.animationDuration = 2 + time + "s";



setTimeout(
    ()=>{
        document.body.removeChild(div);
    }, 5000
)
}

setInterval(
    ()=>{
        star();
    }, 300
);     