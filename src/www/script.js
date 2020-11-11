let user;

async function login() {
    // 1. Hämta text från textfältet
    // 2. Hämta användare från servern med användarnamnet
    // 3. Logga in användare

    let HTMLTextField = document.getElementById("input");
    let fieldValue = HTMLTextField.value;

    let webAnswer = await fetch("/rest/login/" + fieldValue);
    user = await webAnswer.json();

    console.log("userid = " + user.id);
    localStorage.setItem("user", user.id);

    window.open("/MainPage.html", "_self");
}

async function register() {
    // 1. Hämta texten i textfältet
    // 2. Försök skapa användare med användarnamn som texten.
    // 3. Meddela om det gick bra eller inte.

    let HTMLusername = document.getElementById("input");
    let username = HTMLusername.value;

    let theBody = {
        username: username
    }

    let webAnswer = await fetch("/createUser", {
        body: JSON.stringify(theBody),
        method: 'POST' 
    });
    let success = await webAnswer.json();

    alert("User created: " + success);
}














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
    document.getElementById('note-main-grid').style.backgroundColor = "#DCDCDC";
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