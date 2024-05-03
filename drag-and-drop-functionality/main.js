//-------------------- Java Script --------------------//
let items = document.querySelectorAll(".item");
let left = document.querySelector(".left");
let mid = document.querySelector(".mid");
let right = document.querySelector(".right");


items.forEach((item)=>{
    item.addEventListener("dragstart", (e) =>{
        let select = e.target;


        left.addEventListener("dragover", (e)=>{
            e.preventDefault();
        })
        left.addEventListener("drop", ()=>{
            left.appendChild(select);
            select = null;
        })


        mid.addEventListener("dragover", (e)=>{
            e.preventDefault();
        })
        mid.addEventListener("drop", ()=>{
            mid.appendChild(select);
            select = null;
        })


        right.addEventListener("dragover", (e)=>{
            e.preventDefault();
        })
        right.addEventListener("drop", ()=>{
            right.appendChild(select);
            select = null;
        })



    })
})