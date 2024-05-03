//-------------------- Java Script --------------------//
let profileImage = document.getElementById("pro-image")
let input = document.getElementById("input")

input.addEventListener('change', () => {
    profileImage.src = URL.createObjectURL(input.files[0])
})      