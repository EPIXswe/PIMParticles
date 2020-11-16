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
    private final Path uploadsPath = Paths.get("src/www/uploads");
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
            System.out.println("PING: UpdateNote");
            Note note = (Note)request.getBody(Note.class);

            System.out.println(note.toString());

            db.updateNote(note);

            response.send("Post OK");
        });

        express.delete("/delete", (request, response) -> {
            Note noteToDelete = (Note)request.getBody(Note.class);
            System.out.println("Deleting");
            
            int id = noteToDelete.getId();

            db.deleteNote(id);
            response.send("Deleted OK");
        });

        express.post("/api/upload", (request, response) -> {

            FileItem inputFile; // Initialiseras längre ner.
            String outputFileName = "FileNotFound.png"; // Default om filen inte kunde sparas... Mest för kul skull :P

            try {
                // Hämta filen
                inputFile = request.getFormData("file").get(0);
                // Sparar filen i mappen uploads och hämtar dess nya filnamn.
                outputFileName = saveFile(inputFile);
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
     * Looks for a file with the specified id. Not currently used.
     * @param id The ID to search for
     * @return The name of the file.
     */
    public String getUploadWithID(int id) {
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(uploadsPath)) {
            for (Path path : stream) {
                if (!Files.isDirectory(path)) {
                    String fileName = path.getFileName().toString();
                    if(fileName.substring(0, fileName.indexOf('.')-1).equals(Integer.toString(id))) {
                        return fileName;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Saves a file to the folder src/www/uploads
     * @param file The file to be saved.
     * @return the created file's name.
     */
    private String saveFile(FileItem file) throws Exception {

        // 1. Get ID for new file
        int id = db.getUniqueID();

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