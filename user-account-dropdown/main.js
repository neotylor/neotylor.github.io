let profile = document.querySelector(".profile");

let toggleMenu = document.querySelector(".menu");

profile.addEventListener("click", ()=>{
    toggleMenu.classList.toggle("js-active");
})