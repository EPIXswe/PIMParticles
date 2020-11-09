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

    public void Start(){

        //region users --------------------------------------------------------
        express.get("/rest/login", (request, response) -> {
            int id = Integer.parseInt((String) request.getBody().get("id"));
            User user = db.getUserWithID(id);
            response.json(user);
        });

        express.get("/createUser", (request, response) -> {
            String username = (String) request.getBody().get("username");
            boolean canCreate = db.createNewUser(username);
            response.send(Boolean.toString(canCreate));
        });
        //endregion -----------------------------------------------------------


        //region notes --------------------------------------------------------
        express.get("/rest/notes/:owner-id", (request, response) -> {
            int id = Integer.parseInt(request.getParam("owner-id"));
            List<Note> notes = db.getAllNotesForUser(id);

            String strMessage = String.format("All the notes for user with ID %d", id);
            ServerResponse data = ServerResponse.get(strMessage, notes);

            response.json(data);
        });

        express.post("/createNote", (request, response) -> {
            int owner = Integer.parseInt((String) request.getBody().get("owner"));
            String header = (String) request.getBody().get("header");
            String content = (String) request.getBody().get("content");

            boolean success = db.createNewNote(owner, header, content);
            String message = success ? "Note successfully created" : "Note could not be created.";
            response.send(message);
        });

        express.put("/updateNote", (request, response) -> {
            int owner = Integer.parseInt((String) request.getBody().get("owner"));
            String header = (String) request.getBody().get("header");
            String content = (String) request.getBody().get("content");
            int id = Integer.parseInt((String) request.getBody().get("id"));

            db.updateNote(owner, header, content, id);
        });

        express.delete("/delete", (request, response) -> {
            request.getParam("id");
            System.out.println("Deleting");
            int id = Integer.parseInt((String) request.getBody().get("id"));
            db.deleteNote(id);
        });
        //endregion -----------------------------------------------------------


        try {
            express.use(Middleware.statics(Paths.get("src/www").toString()));
        } catch (IOException e) {
            e.printStackTrace();
        }

        List<String> sponsors = List.of("Pizza hut", "McDonald's", "KFC", "Stadium", "");

        int port = 2001;
        express.listen(port);
        System.out.println("Your server at port " + port + " is brought to you by: Pizza hut");
    }
}