//#region VARIABLER
// Hämtar user.id samt username ifrån localStorage för att kunna använda den på denna sidan
let loggedUserID = localStorage.getItem("user");
let loggedUserName = localStorage.getItem("username");

// alla note-objekt från servern.
let notes;
let selectedNoteID;

// Skapar Quill redan här, för att kunna nämna den i annan kod
let quill = null;

// Importerar olika färger från CSS
let colFocus = getComputedStyle(document.documentElement)
    .getPropertyValue('--header-button-selected');
let colFocus2 = getComputedStyle(document.documentElement)
    .getPropertyValue('--header-button-selected-hover');
let colBlackText = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-black');
let colMedEmphText = getComputedStyle(document.documentElement)
    .getPropertyValue('--selected-button-text-color');
//#endregion

//#region UPPDATERA, SORTERA OCH VISA NOTES 
// Uppdaterar ändringar, och visar alla notes
async function updateAndRenderNotes() {
    if(quill == null) {
        initializeEditor();
    }
    await updateNotes(false);
}

// Uppdaterar listan med alla notes genom att kontakta servern
// för att få ut dom från databasen
async function updateNotes(isSelected) {
   let serverAnswer = await fetch("/rest/notes/" + loggedUserID);
   let json = await serverAnswer.json();
   notes = json.data;
   
   sortNotesList();

   renderNotesList();
   if(isSelected){
       renderNoteContent(selectedNoteID, isSelected);
       noteClicked(selectedNoteID);
   }
}

// Lägg till Content från vald note till Quill
//Ändrar headern ovanför quill till rätt Header
function renderNoteContent(noteID, isSelected) {
    
    selectedNoteHeader = getHeader(noteID);

    let headerList = document.querySelector(".note-header");
    headerList.innerHTML = `${selectedNoteHeader}`;
    if(isSelected){
        try {
            let strContent = getContent(selectedNoteID);
            let delta = JSON.parse(strContent);
            quill.setContents(delta);
        } catch(err) {
            quill.setContents("");
        }
    }else{
        headerList.innerHTML = "";
        quill.setContents("");
    }
}

// En funktion för att skriva ut alla notes i HTML, har ID'n "para", går bra att byta
function renderNotesList() {
    let navHeader = document.querySelector(".nav-header");

    navHeader.innerHTML = loggedUserName + "'s notes";

    // Hämtar elementet som har id'n #para
    let HTMLNoteList = document.querySelector("#para");

    // innerHTML beskriver vad som finns i ett visst element
    // Så att man kan ändra HTML med hjälp av javascript
    HTMLNoteList.innerHTML = "";
    
    for(let note of notes) {
        let noteLi = `
                <div id="note">
                    <button title="${note.last_update}" onclick="noteClicked(${note.id})" class="header-button" 
                    id="header-buttons hButton${note.id}" name="hButton" onmouseover="buttonHover(this, true)" onmouseout="buttonHover(this, false)" data-id="${note.id}" data-header="${note.header}">
                        ${note.header}
                    </button>
                </div>`;

        HTMLNoteList.innerHTML += noteLi;
    }

    // Hämtar alla knappar som lagts till i sidenav (#para)
    let htmlNotes = document.getElementsByName("hButton");
    // Så länge det finns minst en note, hämta ID:t för denna och läs in den i Quill.
    if(htmlNotes.length > 0) {
        let topNoteID = htmlNotes[0].dataset.id;
        renderNoteContent(topNoteID, true);
        noteClicked(topNoteID);
    }

}

// Sortera listan av notes efter datum
function sortNotesList(){
    notes.sort(GetSortOrder("last_update"));
}

// Funktionen för att sortera
function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return -1;    
        } else if (a[prop] < b[prop]) {    
            return 1;    
        }    
        return 0;    
    }
}

// Funktion för att rita upp Save och Reset knappen, så att dom inte renderas från start
function renderSaveResetButtons(){
    let srButtons = document.querySelector("#buttons-container");
    srButtons.innerHTML = `
    <button class="standard-button save-button" onclick="saveNote()" title="Hover text">
        Save<div class="fa fa-save"></div>
    </button>
    <button class="standard-button" onclick="resetNote()">
        Reset<div class="fa fa-refresh" title="Hover text"></div>
    </button>
    `;
}
//#endregion

//#region EDITOR
// Definierar Quill
function initializeEditor() {
    /*
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
      ];*/

    quill = new Quill('#quill-editor', {
        modules: {
          toolbar: {
              container: "#toolbar-container",
              handlers: {
                'image': imageHandler
              }
          }
        },
        theme: "snow"
    });

    var Parchment = Quill.import("parchment");

    let CustomClass = new Parchment.Attributor.Class('custom', 'ql-custom', {
      scope: Parchment.Scope.INLINE
    });
    Quill.register(CustomClass, true);

    var customButton = document.querySelector('#attach-file-button');
    customButton.addEventListener('click', function() {attachFile()});

    toggleEditor(false);
}

function attachFile() {
    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '*');
    input.click();
    input.onchange = async function() {

        let file = input.files[0];
        // fileURL = länk till den nyligen uppladdade filen
        let fileURL = await uploadAndGetURL(file); // Viktigt med await för annars går programmet vidare utan att filen hunnit sparas.

        let range = quill.getSelection();

        // this part the link is inserted
        // by 'link' option below, you just have to put link here. 
        quill.insertText(range.index, 'LINK', {
            'italic': false,
            'code': true,
            'bold': true,
            'color': '#FFA500',
            'link': fileURL,
            'background': "#000000",
            'indent': true
        });
        quill.setSelection(range + 1);


        // Sparar anteckningen för annars kommer ju bilden bara vara på servern utan anledning om man glömmer att spara.
        saveNote();
        
    }.bind(this); // react thing
}

// Toggle som styr om Quill ska visas eller inte
function toggleEditor(isHidden){
    let x = document.getElementById("quill-editor");
    if(isHidden){
        x.style.display = "block";
    }else{
        x.style.display = "none";
    }
}

// Constant för att kunna spara en bild från en URL
const imageHandler = () => {
    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async function() {

        let file = input.files[0];
        // fileURL = länk till den nyligen uppladdade filen
        let fileURL = await uploadAndGetURL(file); // Viktigt med await för annars går programmet vidare utan att filen hunnit sparas.

        let range = quill.getSelection();

        // this part the image is inserted
        // by 'image' option below, you just have to put src(link) of img here. 
        quill.insertEmbed(range.index, 'image', fileURL);

        // Sparar anteckningen för annars kommer ju bilden bara vara på servern utan anledning om man glömmer att spara.
        saveNote();
        
    }.bind(this); // react thing
}
//#endregion

async function uploadAndGetURL(file) {

    let formData = new FormData();
    formData.set("file", file);
    
    let answer = await fetch("/api/upload", {
        method: 'POST',
        body: formData
    });
    let fileName = await answer.text();

    let fileURL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/uploads/${fileName}`;
    return fileURL;
    
}

//#region GETTERS
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
//#endregion

//#region HEADER KNAPPAR SPECIELLA FUNKTIONER
// Vad som händer när man trycker på en note
// Uppdaterar vilken note som är vald, och bytar färg till --header-button-selected
function noteClicked(noteID) {
    toggleEditor(true);
    selectedNoteID = noteID;
    renderNoteContent(noteID, true);
    renderSaveResetButtons();
    
    let x = document.getElementsByName("hButton");
    for(i = 0; i < x.length; i++){
        if(x[i].getAttribute('id') == "header-buttons hButton" + noteID){
            x[i].style.background = colFocus2;
            x[i].style.color = colMedEmphText;
            x[i].style.border = "1px solid black";
            x[i].style.fontSize = "110%";
        }else{
            x[i].style.background = '';
            x[i].style.color = colBlackText;
            x[i].style.border = "none";
            x[i].style.fontSize = "100%";
        }
    }
}

// Funktion för att göra så att den valda knappen blir highlighted när man drar musen över den
function buttonHover(x, isHovering){
    if(x.id == "header-buttons hButton"+selectedNoteID){
        if(isHovering)
            x.style.background = colFocus2;
            else
            x.style.background = colFocus;
    }
}
//#endregion

//#region FUNKTIONER FÖR ATT GÖRA ÄNDRINGAR I NOTES
// Återställer alla osparade ändringar
function resetNote(){
    renderNoteContent(selectedNoteID, true);
}

// Sparar den markerade noten
async function saveNote() {
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

// Skapa en ny note
async function createNewNote(){
    let noteButtons = document.getElementsByName("hButton");

    let headers = [];

    // Sparar alla rubriker i listan headers
    for(i = 0; i < noteButtons.length; i++) {
        // Lägg till headern
        headers[i] = noteButtons[i].dataset.header;
    }

    let newHeader = "Untitled Note";

    let amountOfDuplicateHeaders = 0;
    if(headers.length > 0) {
        for(i = 0; i < headers.length; i++) {
            if(headers[i].indexOf(newHeader) == 0) {
                amountOfDuplicateHeaders++;
            }
        }

        if(amountOfDuplicateHeaders > 0) {
            newHeader = newHeader + " (" + amountOfDuplicateHeaders + ")";
        }
    }

    // Definierar vad en note är för något
    let newNote = {
        header: newHeader,
        content: "",
        owner: parseInt(loggedUserID)
    };

    // Skickar en request till servern om att skapa en ny note
    let result = await fetch("/createNote", {
        method: "POST",
        body: JSON.stringify(newNote)
    });

    // Skriver ut response från servern om allt gått bra
    console.log(await result.text());

    // Uppdaterar notes listan
    updateNotes(false);
}

// Tar bort den markerade noten
async function deleteNote(){
    let savedNote = {
        id: selectedNoteID,
    };

    let result = await fetch("/delete", {
        method: "DELETE",
        body: JSON.stringify(savedNote)
    });

    console.log(await result.text());

    toggleEditor(false);

    updateNotes(false);
}
//#endregion

function toggleSidenavCollapse() {
    let sidenavHTML = document.querySelector("#sidenav");
    let notesBodyHTML = document.querySelector("#notes-body");
    let collapseButton = document.querySelector("#collapse-sidenav-button");

    let isCollapsed = sidenavHTML.dataset.collapsed;
    if(isCollapsed == "true") {
        console.log("Showing...");
        notesBodyHTML.style.gridTemplateColumns = "20% auto";
        sidenavHTML.style.display = "inline-block";
        sidenavHTML.dataset.collapsed = "false";
        collapseButton.classList.toggle("fa-bars");
        collapseButton.classList.toggle("fa-expand-arrows-alt");
    } else if(isCollapsed == "false") {
        console.log("Hiding...");
        notesBodyHTML.style.gridTemplateColumns = "auto";
        sidenavHTML.style.display = "none";
        sidenavHTML.dataset.collapsed = "true";
        collapseButton.classList.toggle("fa-bars");
        collapseButton.classList.toggle("fa-expand-arrows-alt");
    } else {
        console.log("Invalid value");
    }
}