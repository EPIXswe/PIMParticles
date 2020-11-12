// Hämtar Username ifrån localStorage för att kunna använda den på denna sidan
let loggedUserID = localStorage.getItem("user");

// alla note-objekt från servern.
let notes;
let selectedNoteID;

// Skapar Quill redan här, för att kunna nämna den i annan kod
let quill = '';

// Olika färger från CSS
let colFocus = getComputedStyle(document.documentElement)
.getPropertyValue('--focus-color');

let colButton = getComputedStyle(document.documentElement)
.getPropertyValue('--button-color');

// En funktion för att skriva ut alla notes i HTML, har ID'n "para", går bra att byta
function renderNotesList() {
    let HTMLNoteList = document.querySelector("#para");

    HTMLNoteList.innerHTML = "";
    
    for(let note of notes) {
        let noteLi = `
                <div id="notes">
                    <button onclick="noteClicked(${note.id})" class="header-button hover-shadow" 
                    id="header-buttons hButton${note.id}" name="hButton" data>
                        ${note.header}
                    </button>
                </div>`;

        HTMLNoteList.innerHTML += noteLi;
    }
}

// Hämta all "Content" ifrån en note
function getContent(id) {
    for(note of notes) {
        if(note.id == id) {
            return note.content;
        }
    }
}

// Hämta "Headern" från en note
function getHeader(id) {
    for(note of notes){
        if(note.id == id){
            return note.header;
        }
    }
}

function noteClicked(noteID) {
    selectedNoteID = noteID;
    renderNoteContent(noteID);
    let x = document.getElementsByName("hButton");
    for(i = 0; i < x.length; i++){
        if(x[i].getAttribute('id') == "header-buttons hButton" + noteID){
            x[i].style.background = colFocus;
        }else{
            x[i].style.background = '';
        }
    }
}

async function updateAndRenderNotes() {
    await updateNotes(false);
    renderNotesList();
}

/**
 * Updates notes list (sends request to server)
 */
async function updateNotes(isSelected) {
    let serverAnswer = await fetch("/rest/notes/" + loggedUserID);
    let json = await serverAnswer.json();
    notes = json.data;

    renderNotesList();
    if(isSelected){
        renderNoteContent(selectedNoteID);
        noteClicked(selectedNoteID);
    }
}

// Lägg till Content från vald note till Quill
//Ändrar headern ovanför quill till rätt Header
function renderNoteContent(noteID) {
    
    selectedNoteHeader = getHeader(noteID);

    let headerList = document.querySelector(".note-header");
    headerList.innerHTML = `${selectedNoteHeader}`;

    if(document.querySelector("#editor").innerHTML == "") {
        enableEditor();
    }

    try{
        let strContent = getContent(selectedNoteID);
        let delta = JSON.parse(strContent);
        quill.setContents(delta);
    }catch(err){
        quill.setContents("");
    }
}

function resetNote(){
    renderNoteContent(selectedNoteID);
}

// Visa quill
function enableEditor(){

    let toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        [ 'image' ],
      
        ['clean']                                         // remove formatting button
      ];

    quill = new Quill('#editor', {
        modules: {
          toolbar: {
              container: toolbarOptions,
              handlers: imageHandler
          }
        },
        scrollingContainer: '#scrolling-container',
        theme: "snow"
    });
}

const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async function() {
      const file = input.files[0];
      console.log('User trying to uplaod this:', file);

      const id = await uploadFile(file); // I'm using react, so whatever upload function
      const range = this.quill.getSelection();
      const link = `${ROOT_URL}/file/${id}`;

      // this part the image is inserted
      // by 'image' option below, you just have to put src(link) of img here. 
      this.quill.insertEmbed(range.index, 'image', link); 
    }.bind(this); // react thing
  }

// Spara ner en note som finns sen innan
async function saveNote() {

    // Header kommer inte att uppdateras. Måste hämta nya värdet från .note-header först.

    let savedNote = {
        id: selectedNoteID,
        header: document.querySelector(".note-header").innerHTML,
        content: JSON.stringify(quill.getContents()),
        owner: loggedUserID
    };

    let result = await fetch("/updateNote", {
        method: "PUT",
        body: JSON.stringify(savedNote)
    });

    console.log(await result.text());
    updateNotes(true);
}

// Spara ner en ny note
async function createNewNote(){
    let newNote = {
        header: "New note",
        content: "",
        owner: parseInt(loggedUserID)
    };

    let result = await fetch("/createNote", {
        method: "POST",
        body: JSON.stringify(newNote)
    });

    console.log(await result.text());
    updateNotes(false);
}

async function deleteNote(){
    let savedNote = {
        id: selectedNoteID,
    };

    let result = await fetch("/delete", {
        method: "DELETE",
        body: JSON.stringify(savedNote)
    });

    console.log(await result.text());
    updateNotes(false);
}