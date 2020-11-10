package blackhat;

import express.Express;
import express.middleware.Middleware;
import express.utils.Utils;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

public class Webserver {
    Express express = new Express();
    Database db = Database.getInstance();
    boolean dBug = true;

    public void Start(){
//region users
        express.get("/rest/login", (request, response) -> {
            System.out.println("PING: login");
            int id = Integer.parseInt((String) request.getBody().get("id"));
            User user = db.getUserWithID(id);
            response.json(user);
        });

        express.get("/createUser", (request, response) -> {
            String username = (String) request.getBody().get("username");
            boolean canCreate = db.createNewUser(username);
            response.send(Boolean.toString(canCreate));
        });
//endregion

//region notes
        express.get("/rest/notes/:owner-id", (request, response) -> {
            System.out.println("PING: notes for user");
            int id = Integer.parseInt(request.getParam("owner-id"));
            List<Note> notes = db.getAllNotesForUser(id);

            if(dBug)
                for (Note note : notes) {
                    System.out.println(note);
                }

            response.json(notes);
        });

        express.post("/createnote", (request, response) -> {
            System.out.println("PING: CreateNote");
            Note note = (Note)request.getBody(Note.class);

            System.out.println(note.toString());

            response.send("Post OK");

            db.createNewNote(note);
        });

        express.put("/updateNote", (request, response) -> {
            System.out.println("PING: UpdateNote");
            Note note = (Note)request.getBody(Note.class);

            System.out.println(note.toString());

            response.send("Post OK");

            db.updateNote(note);
        });

        express.delete("/delete", (request, response) -> {
            request.getParam("id");
            System.out.println("Deleting");
            int id = -1;

            id = Integer.parseInt((String) request.getBody().get("id"));
            db.deleteNote(id);
        });
//endregion

        try {
            express.use(Middleware.statics(Paths.get("src/www_quilltest").toString()));
        } catch (IOException e) {
            e.printStackTrace();
        }

        int port = 2001;
        express.listen(port);
        System.out.println("Your server at port " + port + " is brought to you by: Pizza hut");
    }
}