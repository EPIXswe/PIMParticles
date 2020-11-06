let user = {
    id,
    username
};

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