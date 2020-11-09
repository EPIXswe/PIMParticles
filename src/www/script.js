async function getNotesForLoggedUser() {
    let notesObj = await fetch("/rest/notes/" + logged_user);
    let response = await notesObj.json();
let user = {
    id,
    username
};

    let message = response.message;
    let theData = response.data;

    console.log(message);

    for(note of theData) {
        console.log("Header:", note.header);
        console.log("Last update:", note.last_update);
        console.log("Content:", note.content);
        console.log("Owner:", note.owner);
        console.log();
    }
}
let notes = {
    id,
    header,
    body,
    owner
};

renderPreviewList() {
    for(note of notes) {

        let tmpButtonHTML = document.createElement("a");
        tmpButtonHTML.setAttribute("onclick" ,  )
        tmpButtonHTML.className = "sideButton";
        tmpButtonHTML.innerHTML = note.header;
        tmpButtonHTML.dataset.id = note.id;
        tmpButtonHTML.dataset.name = "Robin";

        let sidenavHTML = document.getElementsByClassName("sidenav");
        sidenavHTML.innerHTML += sidenavHTML;

    }
}

clicked(button) {
    let noteID = button.dataset.id;

}