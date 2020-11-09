async function getNotesForLoggedUser() {
    let notesObj = await fetch("/rest/notes/" + logged_user);
    let response = await notesObj.json();

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