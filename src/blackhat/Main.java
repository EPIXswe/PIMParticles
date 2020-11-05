package blackhat;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        Database db = new Database();

        db.connectToServer();

        System.out.println(db.getUserWithID(1));

        List<Note> notes = db.getAllNotesForUser(2);
        for(Note note : notes){
            System.out.println(note);
        }
    }
}