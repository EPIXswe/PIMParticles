let logged_user = 2;
let nList;
let dBug = true;
let nID;
let nHead;

var quill = '';

async function getNotesForLoggedUser() {
    logged_user = document.getElementById('userID').value;
    let notesObj = await fetch("/rest/notes/" + logged_user);
    let result = await notesObj.json();
    
    if(dBug)
    for(note of result) {
        console.log("Header:", note.header);
        console.log("Last update:", note.last_update);
        console.log("Content:", note.content);
        console.log("Owner:", note.owner);
        console.log("Id:", note.id);
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
                        ${note.header}
                    </button>
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

function returnHeader(id){
    for(note of nList){
        if(note.id == id){
            return note.header;
        }
    }
}

function renderNoteContent(note){
    nID = note;
    nHead = returnHeader(note);
    if(quill == ''){
            enableEditor();
    }
    quill.setText('');
    let conLi = `${returnContent(note)}`;
        quill.insertText(0, conLi);
}

function enableEditor(){
    quill = new Quill('#editor', {
        theme: 'snow'
    });
    document.getElementById('para2').style.backgroundColor = "#DCDCDC";
}

async function saveNote(){
    let updatedNote = {
        id: parseInt(nID),
        header: nHead,
        content: quill.getText(0, quill.getLength()),
        owner: parseInt(logged_user)
    };

    let result = await fetch("/updateNote", {
        method: "PUT",
        body: JSON.stringify(updatedNote)
    });

    console.log(await result.text());
}