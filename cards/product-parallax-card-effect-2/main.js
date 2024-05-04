//-------------------- Java Script --------------------//
let img = document.querySelectorAll(".img");


img.forEach((imgs) =>{

    let image_img = imgs.querySelector("#image");

    imgs.addEventListener("mousemove", (move) =>{
        const x = (move.pageX) - (imgs.offsetLeft) - (imgs.clientWidth / 2);
        const y = (move.pageY) - (imgs.offsetTop) - (imgs.clientHeight / 2);

        imgs.style.transform = `rotateX(${-y /10}deg) rotateY(${x /10}deg)`
        image_img.style.transform =  `translateX(${-x/10}px) translateY(${-y/10}px)`
    })
    imgs.addEventListener("mouseleave", () =>{
        setTimeout(()=>{
            imgs.style.transform = `rotateX(0deg) rotateY(0deg)`
            image_img.style.transform =  `translateX(0px) translateY(0px)`
        }, 2000)
       
    })



})