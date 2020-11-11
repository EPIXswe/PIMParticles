let username = localStorage.getItem("user");
let nList;
let nID;
let nHead;

var quill = '';

async function getNotesForLoggedUser() {
    console.log(username);

    let notesObj = await fetch("/rest/notes/" + username);
    let answer = await notesObj.json();

    console.log(answer);

    renderNotesList(answer.data);
    nList = answer;
}

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

function returnContent(id){
    for(note of nList.data){
        if(note.id == id){
            return note.content;
        }
    }
}

function returnHeader(id){
    for(note of nList.data){
        if(note.id == id){
            return note.header;
        }
    }
}

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
    let conLi = `${returnContent(note)}`;
        quill.insertText(0, conLi);
}

function enableEditor(){

    let toolbarOptions = [['bold', 'italic'], ['link', 'image']];

    quill = new Quill('#editor', {
        modules: {
          toolbar: toolbarOptions
        },
        theme: "snow"
    });
      
}

async function updateNote(){
    let updatedNote = {
        id: parseInt(nID),
        header: nHead,
        content: quill.getText(0, (quill.getLength() - 1)),
        owner: parseInt(username)
    };

    let result = await fetch("/updateNote", {
        method: "PUT",
        body: JSON.stringify(updatedNote)
    });

    console.log(await result.text());
}

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