package blackhat;

import java.sql.Date;

public class Note {
    int id;
    String header;
    String content;
    int owner;

    public Note(int id, String header, String content,
                int owner){
        this.id = id;
        this.header = header;
        this.content = content;
        this.owner = owner;
    }
}
