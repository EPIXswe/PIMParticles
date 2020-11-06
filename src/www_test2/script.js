let logged_user = 1;

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

}