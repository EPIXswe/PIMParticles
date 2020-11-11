// Hämtar Username ifrån localStorage för att kunna använda den på denna sidan
let loggedUserID = localStorage.getItem("user");

// alla note-objekt från servern.
let notes;
let selectedNoteID;

// Skapar Quill redan här, för att kunna nämna den i annan kod
let quill = '';

// En funktion för att skriva ut alla notes i HTML, har ID'n "para", går bra att byta
function renderNotesList() {
    let HTMLNoteList = document.querySelector("#para");

    HTMLNoteList.innerHTML = "";
    
    for(let note of notes) {
        let noteLi = `
                <div id="notes">
                    <button onclick="noteClicked(${note.id})">
                        ${note.header}
                    </button>
                    <br>
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
}


async function updateAndRenderNotes() {
    await updateNotes();
    renderNotesList();
}

/**
 * Updates notes list (sends request to server)
 */
async function updateNotes() {
    let serverAnswer = await fetch("/rest/notes/" + loggedUserID);
    let json = await serverAnswer.json();
    notes = json.data;
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

    let strContent = getContent(selectedNoteID);
    let delta = JSON.parse(strContent);
    quill.setContents(delta);
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
      
        ['clean']                                         // remove formatting button
      ];

    quill = new Quill('#editor', {
        modules: {
          toolbar: toolbarOptions
        },
        scrollingContainer: '#scrolling-container',
        theme: "snow"
    });
}

// Spara ner en note som finns sen innan
async function saveNote() {

    // Header kommer inte att uppdateras. Måste hämta nya värdet från .note-header först.

    let savedNote = {
        id: selectedNoteID,
        header: getHeader(selectedNoteID),
        content: JSON.stringify(quill.getContents()),
        owner: loggedUserID
    };

    let result = await fetch("/updateNote", {
        method: "PUT",
        body: JSON.stringify(savedNote)
    });

    console.log(await result.text());
    updateNotes();
}

// Spara ner en ny note
async function createNewNote(){
    let newNote = {
        header: selectedNoteHeader,
        content: quill.getText(0, (quill.getLength() - 1)),
        owner: parseInt(loggedUserID)
    };

    let result = await fetch("/createnote", {
        method: "POST",
        body: JSON.stringify(newNote)
    });

    console.log(await result.text());
}