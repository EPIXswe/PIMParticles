package blackhat;

import java.sql.Date;

public class Note {
    private int id;
    private String header;
    private String last_update;
    private String content;
    private int owner;


    private Note(){}

    public Note(int id, String header, String last_update, String content,
                int owner){
        this.id = id;
        this.header = header;
        this.content = content;
        this.owner = owner;
    }

    public String getLast_update() {
        return last_update;
    }

    public void setLast_update(String last_update) {
        this.last_update = last_update;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getOwner() {
        return owner;
    }

    public void setOwner(int owner) {
        this.owner = owner;
    }

    @Override
    public String toString() {
        return "Note{" +
                "id=" + id +
                ", header='" + header + '\'' +
                ", content='" + content + '\'' +
                ", owner=" + owner +
                '}';
    }
}
