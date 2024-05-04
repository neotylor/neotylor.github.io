const columns = document.querySelectorAll(".column");

const frontHeight = "8";

highlight = (column, d)=>{
    let numbers = columns[column].querySelectorAll(".number");
    numbers[d].classList.add("highlight");

    setTimeout(() => {
        numbers[d].classList.remove("highlight");
    }, 950);
}

slider = (column, number)=>{
    let d1 = Math.floor(number / 10);
    let d2 = number % 10;

    columns[column].style.transform = `translateY(${d1 * - frontHeight}rem)`;
    highlight(column, d1);


    columns[column + 1].style.transform = `translateY(${d2 * - frontHeight}rem)`;
    highlight(column + 1, d2);
}

setInterval(()=>{
    const time = new Date();


    const hours = time.getHours();
    const mins = time.getMinutes();
    const secs = time.getSeconds();

    slider(0, hours);
    slider(2, mins);
    slider(4, secs);

}, 1000);  