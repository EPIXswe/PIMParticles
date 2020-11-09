let logged_user = 2;
let nList;

var quill = new Quill('#editor', {
    theme: 'snow'
});

async function getNotesForLoggedUser() {
    let notesObj = await fetch("/rest/notes/" + logged_user);
    let result = await notesObj.json();
    
    for(note of result) {
        console.log("Header:", note.header);
        console.log("Last update:", note.last_update);
        console.log("Content:", note.content);
        console.log("Owner:", note.owner);
        console.log();
    }

    renderNotesList(result);
    nList = result;
}

function renderNotesList(notes){
    let noteList = document.querySelector("#para");

    noteList.innerHTML = "";
    
    for(let note of notes){
        console.log();
        let noteLi = `
                <div id="notes">
                    <button onclick="renderNoteContent(${note.id})">
                        ${note.header} <br>
                    </button>
                    ${note.id} <br>
                    <br>
                </div>
        `;

        noteList.innerHTML += noteLi;
    }
}

function returnContent(id){
    for(note of nList){
        if(note.id == id){
            return note.content;
        }
    }
}

function renderNoteContent(note){
    quill.setText('');
    let conLi = `${returnContent(note)}`;
        quill.insertText(0, conLi);
}