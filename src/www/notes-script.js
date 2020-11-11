// Hämtar Username ifrån localStorage för att kunna använda den på denna sidan
let username = localStorage.getItem("user");

// n = note
// för att spara variabler från notes, för att det inte fungerade annars(?)
let nList;
let nID;
let nHead;

// Skapar Quill redan här, för att kunna nämna den i annan kod
var quill = '';

// Hämtar alla notes som är länkade till användarens ID
async function getNotesForLoggedUser() {
    console.log(username);

    let notesObj = await fetch("/rest/notes/" + username);
    let answer = await notesObj.json();

    console.log(answer);

    renderNotesList(answer.data);
    nList = answer;
}

// En funktion för att skriva ut alla notes i HTML, har ID'n "para", går bra att byta
function renderNotesList(notes){
    let noteList = document.querySelector("#para");

    noteList.innerHTML = "";
    
    for(let note of notes){
        console.log();
        let noteLi = `
                <div id="notes">
                    <button onclick="renderNoteContent(${note.id})">
                        ${note.header}
                    </button>
                    <br>
                </div>
        `;

        noteList.innerHTML += noteLi;
    }
}

// Hämta all "Content" ifrån en note
function returnContent(id){
    for(note of nList.data){
        if(note.id == id){
            return note.content;
        }
    }
}

// Hämta "Headern" från en note
function returnHeader(id){
    for(note of nList.data){
        if(note.id == id){
            return note.header;
        }
    }
}

// Lägg till Content från vald note till Quill
//Ändrar headern ovanför quill till rätt Header
function renderNoteContent(note){

    nID = note;
    nHead = returnHeader(note);

    let headerList = document.querySelector(".note-header");
    headerList.innerHTML = `${nHead}`;

    ;

    if(document.querySelector("#editor").innerHTML == "") {
        enableEditor();
    }
    quill.setText('');
    let conLi = `${returnContent(JSON.parse(note))}`;
    quill.setContents(conLi);
    //quill.insertText(0, conLi);
}

// Visa quill
function enableEditor(){

    let toolbarOptions = [['bold', 'italic'], ['link', 'image']];

    quill = new Quill('#editor', {
        modules: {
          toolbar: toolbarOptions
        },
        scrollingContainer: '#scrolling-container',
        theme: "snow"
    });
}

// Spara ner en note som finns sen innan
async function updateNote(){
    console.log(JSON.stringify(quill.getContents(0, (quill.getLength() - 1))));
    let updatedNote = {
        id: parseInt(nID),
        header: nHead,
        content: JSON.stringify(quill.getContents(0, (quill.getLength() - 1))),
        owner: parseInt(username)
    };

    let result = await fetch("/updateNote", {
        method: "PUT",
        body: JSON.stringify(updatedNote)
    });

    console.log(await result.text());
}

// Spara ner en ny note
async function createNewNote(){
    let newNote = {
        header: nHead,
        content: quill.getText(0, (quill.getLength() - 1)),
        owner: parseInt(username)
    };

    let result = await fetch("/createnote", {
        method: "POST",
        body: JSON.stringify(newNote)
    });

    console.log(await result.text());
}