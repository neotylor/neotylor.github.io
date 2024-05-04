let cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (m)=>{
    cursor.style.top = m.pageY + "px";
    cursor.style.left = m.pageX + "px";
});