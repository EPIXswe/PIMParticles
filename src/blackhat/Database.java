package blackhat;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Database {
    Connection conn = null;

    public void connectToServer(){
        try {
            conn = DriverManager.getConnection("jdbc:sqlite:pimp.db");
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    public int getAllUsers() {
        try {
            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users");
            ResultSet resultSet = stmt.executeQuery();
            while (resultSet.next()) {

            }
            return
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return ;
    }



    public List<Note> getAllNotes(){
        try {
            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM notes");
            ResultSet resultSet = stmt.executeQuery();
            List<Note> notes = new ArrayList<>();
            while (resultSet.next()) {
                int noteID = resultSet.getInt("id");
                String noteHeader = resultSet.getString("header");
                String noteContent = resultSet.getString("content");
                int noteOwner = resultSet.getInt("owner");
                notes.add(new Note(noteID, noteHeader, noteContent, noteOwner));
            }
            return notes;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }
}
