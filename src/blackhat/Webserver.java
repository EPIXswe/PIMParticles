package blackhat;

import express.Express;
import express.middleware.Middleware;
import org.apache.commons.fileupload.FileItem;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

public class Webserver {
    private final Express express = new Express();
    private final Database db = Database.getInstance();
    private final boolean dBug = false;
    private final Sponsor sponsor = new Sponsor();
    public static final Path uploadsPath = Paths.get("src/www/uploads");
    private final Path fileNotFoundPath = Paths.get("src/www/img/FileNotFound.png");

    public Webserver() {}

    public void Start() {
//region users
        express.get("/rest/login", (request, response) -> {
            System.out.println("PING: login");
            int id = Integer.parseInt((String) request.getBody().get("id"));
            User user = db.getUserWithID(id);
        });

        //region users --------------------------------------------------------
        express.get("/rest/login/:username", (request, response) -> {
            String username = request.getParam("username");
            System.out.println("Username: " + username);
            User user = db.getUserWithName(username);
            System.out.println("User: " + user.toString());
            response.json(user);
        });

        express.post("/createUser", (request, response) -> {
            String username = (String) request.getBody().get("username");
            boolean canCreate = db.createNewUser(username);
            response.send(Boolean.toString(canCreate));
        });
        //endregion -----------------------------------------------------------


        //region notes --------------------------------------------------------
        express.get("/rest/notes/:owner-id", (request, response) -> {
            int id = Integer.parseInt(request.getParam("owner-id"));
            List<Note> notes = db.getAllNotesForUser(id);

            if(dBug) {
                for (Note note : notes) {
                    System.out.println(note);
                }
            }
            String strMessage = String.format("All the notes for user with ID %d", id);
            ServerResponse data = ServerResponse.get(strMessage, notes);

            response.json(data);
        });

        express.post("/createNote", (request, response) -> {
            System.out.println("PING: CreateNote");
            Note note = (Note)request.getBody(Note.class);

            System.out.println("New note created");

            response.send("Post OK");

            db.createNewNote(note);
        });

        express.put("/updateNote", (request, response) -> {
            Note note = (Note)request.getBody(Note.class);
            System.out.printf("Updating: %s%n", note.toString());

            db.updateNote(note);

            response.send("Post OK");
        });

        express.delete("/delete", (request, response) -> {
            int noteID = Integer.parseInt((String) request.getBody().get("id"));
            System.out.println("Deleting note with ID: " + noteID);
            db.deleteNote(noteID);
            response.send("Deleted OK");
        });

        express.post("/api/upload/:note-id", (request, response) -> {

            FileItem inputFile; // Initialiseras längre ner.
            String outputFileName = "FileNotFound.png"; // Default om filen inte kunde sparas... Mest för kul skull :P

            try {
                // Hämta filen
                inputFile = request.getFormData("file").get(0);
                int noteID = Integer.parseInt(request.getParam("note-id"));
                // Sparar filen i mappen uploads och hämtar dess nya filnamn.
                outputFileName = saveFile(inputFile, noteID);
            } catch (Exception e) {
                e.printStackTrace();
            }

            response.send(outputFileName);
        });

        //endregion -----------------------------------------------------------

        try {
            express.use(Middleware.statics(Paths.get("src/www").toString()));
        } catch (IOException e) {
            e.printStackTrace();
        }

        int port = 2001;
        express.listen(port);
        System.out.println("Your server at port " + port + " is brought to you by: " + sponsor.getSponsor());
    }

    /**
     * Saves a file to the folder src/www/uploads
     * @param file The file to be saved.
     * @param noteID The ID of the note that this file ID is connected to
     * @return the created file's name.
     */
    private String saveFile(FileItem file, int noteID) throws Exception {

        // 1. Get ID for new file
        int id = db.getUniqueID(noteID);

        // 2. get file extension
        String fileName = file.getName();
        String fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

        // 3. Get the path to where the file is going to be saved. .resolve adds a directory/file to the Path object.
        Path path = uploadsPath.resolve(id + fileExtension);

        // 4. Save file on local filesystem.
        try(var os = new FileOutputStream(path.toString())) {
            os.write(file.get());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        // 5. Return name of created file.
        return path.getFileName().toString();
    }

}