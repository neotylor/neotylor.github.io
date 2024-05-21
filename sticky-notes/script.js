const notes = [];
let activeTarget, header, activeNote;
let win_rect; // window client area
let dragging;
let offset;
let colors = {
    up: "rgb(255, 254, 165)",
    down: "rgb(165, 255, 180)",
    bg: "rgb(255, 165, 165)"
}

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

  const currentNote = findActiveNote(id);
  if (currentNote) {
    currentNote.left = left;
    currentNote.top = top;
  }
  //add addmore button listerner
  document.querySelector(`#header_${id} .add-more-icon`).addEventListener('click', function(e){
    addNote();
  })
  //add addmore button listerner
  target.querySelector(`[contenteditable="true"]`).addEventListener('input', e => editNote(e, id), false)
  document.querySelector(`[data-id="${id}"] .delete-note`).addEventListener('click', e => removeNote(e, id), false)
  document.querySelector(`[data-id="${id}"] .open-note`).addEventListener('click', e => openNote(e, id), false)
  document.querySelector(`[data-id="${id}"] .close-note`).addEventListener('click', e => closeNote(e, id), false)
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
  activeNote = findActiveNote(activeTarget);
  const targetEle = document.getElementById(activeTarget);
  const header = document.getElementById("header_"+activeTarget)
  let [x, y] = [event.clientX, event.clientY];
  let drag_rect = targetEle.getBoundingClientRect();
    hit_rect = header.getBoundingClientRect();
    console.log("event?.target?.id", drag_rect, header, hit_rect)
    console.log("active Note", activeNote)

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
        if (activeNote) {
          activeNote.left = left;
          activeNote.top = top;
        }
    }
}

function pointerUp(event) {
    dragging = false;
    activeTarget = null;
    // header.style.backgroundColor = colors.up;
}

function findActiveNote(id) {
  return notes.find(note => note.id === id)  
}

function editNote(e, id) {
  const target = document.querySelector(`[data-id="${id}"] .editor`);
  activeNote = findActiveNote(id);
  target.innerText = e.target.innerText;
  activeNote.data = e.target.innerText;
  console.log(e.target.innerText, activeNote, id, target)
  // editable.addEventListener("DOMNodeInserted", listener, false);
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
  const noteListHtml = `          <div class="note_card open1" data-id="${id}">
  <div class="header" data-id="header_${id}">
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
  <div class="menu-wrapper">
    <ul class="menu">
      <li>
        <a href="#" class="more-option icon">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path></svg>
        </a>
        
        <ul>
          <li><a href="#" class="open-note">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" x2="21" y1="10" y2="3"></line><line x1="3" x2="10" y1="21" y2="14"></line></svg>
            Open note
          </a></li>
          <li><a href="#" class="close-note">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" x2="21" y1="10" y2="3"></line><line x1="3" x2="10" y1="21" y2="14"></line></svg>
            Close note
          </a></li>
          <li><a href="#" class="delete-note">
            <svg fill=#000000 height="1em" id=Layer_1 version=1.1 viewBox="0 0 512 512" width="1em" xml:space=preserve xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink><g><g><path d="M465.423,48.241h-137.61V23.955C327.813,10.746,317.082,0,303.893,0h-95.785c-13.19,0-23.92,10.746-23.92,23.955V48.24    H46.577c-6.655,0-12.049,5.394-12.049,12.049c0,6.655,5.394,12.049,12.049,12.049h22.332l15.228,396.396    C85.069,492.995,104.818,512,129.099,512h253.804c24.281,0,44.03-19.006,44.96-43.267l15.228-396.396h22.332    c6.653,0,12.049-5.394,12.049-12.049C477.472,53.635,472.078,48.241,465.423,48.241z M208.285,24.097h95.43v24.143h-95.43V24.097z     M403.784,467.809c-0.433,11.268-9.605,20.094-20.882,20.094H129.099c-11.276,0-20.448-8.827-20.882-20.095L93.025,72.338h325.952    L403.784,467.809z"/></g></g><g><g><path d="M182.63,181.571c-0.127-6.575-5.494-11.817-12.042-11.817c-0.078,0-0.158,0-0.236,0.002    c-6.652,0.128-11.943,5.626-11.815,12.278l3.781,196.634c0.126,6.575,5.495,11.817,12.042,11.817c0.078,0,0.158,0,0.236-0.002    c6.653-0.128,11.943-5.624,11.815-12.278L182.63,181.571z"/></g></g><g><g><path d="M255.998,169.753c-6.654,0-12.049,5.394-12.049,12.049v196.634c0,6.654,5.394,12.049,12.049,12.049    c6.655,0,12.049-5.394,12.049-12.049V181.802C268.047,175.148,262.653,169.753,255.998,169.753z"/></g></g><g><g><path d="M341.645,169.756c-6.628-0.147-12.151,5.162-12.278,11.815l-3.781,196.634c-0.129,6.653,5.162,12.15,11.815,12.278    c0.078,0.001,0.158,0.002,0.236,0.002c6.546,0,11.916-5.244,12.042-11.817l3.781-196.634    C353.588,175.38,348.299,169.883,341.645,169.756z"/></g></g></svg>
            Delete note
          </a></li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="note-body editor" contenteditable="true" placeholder="Take a note..."></div>
</div>
`;
if (!findActiveNote(id)) {
  notes.push({
    id,
    createAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
    open: true,
    data: "",
  });
 }
  document.querySelector('.notes_area')?.insertAdjacentHTML('beforeend', noteHtml);
  document.querySelector('.notes__list')?.insertAdjacentHTML('beforeend', noteListHtml);
  init(id);
  console.log("data live notes", notes)
}
function openNote(e, id) {
  e.preventDefault();
  const note = findActiveNote(id)
  if (note) addNote(note);
}
function closeNote(e, id) {
  e.preventDefault();
  const note = findActiveNote(id)
  if (note) {
    note.open = false;
    document.getElementById(id).remove();
  }
}
function removeNote(e, id) {
  e.preventDefault();
  const note = findActiveNote(id)
  const index = notes.indexOf(note);
  if (index > -1) { // only splice notes when item is found
    notes.splice(index, 1); // 2nd parameter means remove one item only
  }
  document.getElementById(id).remove();
  document.querySelector(`[data-id="${id}"]`).remove()
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
  