let activeTarget, header;
let win_rect; // window client area
let dragging;
let offset;
let colors = {
    up: "rgb(255, 254, 165)",
    down: "rgb(165, 255, 180)",
    bg: "rgb(255, 165, 165)"
}
const notes = [];

// add hit-test functionality to DOMRect
DOMRect.prototype.hit = function (x, y) {
    return x >= this.left && x <= this.right &&
        y >= this.top && y <= this.bottom;
} 

// yum
function px(n) {
    return `${n}px`;
}

function init(id) {
  // HTML elements
  const target = document.getElementById(id || "note_card");
  header = document.getElementById(id ? "header_"+id :"header");
    
  // listeners
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("resize", resize);

    // init data
  dragging = false;
  offset = {x: 0, y: 0}
  win_rect = document.body.getBoundingClientRect();

  // position div to center
  let drag_rect = target.getBoundingClientRect();
  let left = Math.round((win_rect.width / 2) - (drag_rect.width / 2));
  let top = Math.round((win_rect.height / 2) - (drag_rect.height / 2));
  target.style.left = px(left);
  target.style.top = px(top);

  //add addmore button listerner

  document.querySelector(`#header_${id} .add-more-icon`).addEventListener('click', function(e){
    addNote();
  })
}

function resize(event) {
    // keep track of changed client area dimensions 
    win_rect = document.body.getBoundingClientRect();
}

function pointerDown (event) {
  if (event?.target?.id?.startsWith('header_')) {
    activeTarget = event?.target?.id?.split('_').pop();
  } else {
    activeTarget = null;
    return;
  }
  const targetEle = document.getElementById(activeTarget);
  const header = document.getElementById("header_"+activeTarget)
  let [x, y] = [event.clientX, event.clientY];
  let drag_rect = targetEle.getBoundingClientRect();
    hit_rect = header.getBoundingClientRect();
    console.log("event?.target?.id", drag_rect, header, hit_rect)

    if (hit_rect.hit(x, y)) {
        dragging = true;
        offset.x = x - drag_rect.x;
        offset.y = y - drag_rect.y;
        // header.style.backgroundColor = colors.down;  
    }
}
    

function pointerMove(event) {
  if (!activeTarget) return 
  const target = document.getElementById(activeTarget);
    let [x, y] = [event.clientX, event.clientY];
    let drag_rect = target.getBoundingClientRect();
    if (dragging) {
        let left = x - offset.x;
        let right = left + drag_rect.width;
        let top = y - offset.y;
        let bottom = top + drag_rect.height;
        
        // prevent dragging off screen left/right
        if (left < 0) {
            left = 0;
        } else if (right > win_rect.right) {
            left = win_rect.right - drag_rect.width;
        }
        
        // prevent dragging off screen top/bottom 
        if (top < 0) {
            top = 0;
        } else if (bottom > win_rect.bottom) {
            top = win_rect.bottom - drag_rect.height;
        }
        
        target.style.left = px(left);
        target.style.top = px(top);
    }
}

function pointerUp(event) {
    dragging = false;
    activeTarget = null;
    // header.style.backgroundColor = colors.up;
}

// init();

//add listerner
function addNote(note) {
  const id = note?.id || generateUUID();
  const noteHtml = `    <div class="note_card default_note active" id="${id}">
  <div class="header" id="header_${id}">
    <div class="add-more-icon icon">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z"></path></svg>        
    </div>
    <div class="right_side">
      <div class="more-option icon">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path></svg>
      </div>
      <div class="close-icon icon">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z"></path></svg>
      </div>
    </div>
  </div>
  <div class="note-body editor" contenteditable="true" placeholder="Take a note..."></div>
  <div class="note-footer">footer</div>
</div>`;
  notes.push({
    id,
    createAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
  });
  document.querySelector('.notes_area')?.insertAdjacentHTML('beforeend', noteHtml);
  init(id);
  console.log("data live notes", notes)
}

document.querySelector('.add_new_note').addEventListener('click', function(e){
  addNote();
})
function generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && performance.now() * 1000) || 0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
  