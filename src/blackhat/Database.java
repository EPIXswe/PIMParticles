package blackhat;
import com.fasterxml.jackson.core.JsonProcessingException;
import express.utils.Utils;

import java.sql.*;
import java.util.List;

public class Database {
    private static final Database instance = new Database();
    Connection conn = null;

    private Database() {
        try {
            conn = DriverManager.getConnection(
                    "jdbc:sqlite:pimp.db");
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    public static Database getInstance() {
        return instance;
    }

    public User getUserWithID(int id) {
        try {
            PreparedStatement stmt = conn.prepareStatement(
                    "SELECT * FROM users WHERE id = ?");
            stmt.setInt(1, id);
            ResultSet resultSet = stmt.executeQuery();
            User user = null;
            user = (new User(resultSet.getInt("id"),
                    resultSet.getString("username")));
            return user;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }

    public User getUserWithName(String name) {
        try {
            PreparedStatement stmt = conn.prepareStatement(
                    "SELECT * FROM users WHERE username = ?");
            stmt.setString(1, name);
            ResultSet resultSet = stmt.executeQuery();

            User user = ((User[])Utils.readResultSetToObject(resultSet, User[].class))[0];
            return user;
        } catch (SQLException | JsonProcessingException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }

    public boolean createNewUser(String username){
        try {
            PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO users(username) VALUES(?)");
            stmt.setString(1, username);
            int res = stmt.executeUpdate();
            System.out.println(res);
            if(res > 0)
                return true;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return false;
    }

    public List<Note> getAllNotesForUser(int id){
        try {
            PreparedStatement stmt = conn.prepareStatement(
                    "SELECT * FROM notes WHERE owner = ?");
            stmt.setInt(1, id);
            ResultSet resultSet = stmt.executeQuery();

            List<Note> notes;
            notes = List.of((Note[])Utils.readResultSetToObject(resultSet, Note[].class));

            return notes;
        } catch (SQLException | JsonProcessingException throwables) {
            throwables.printStackTrace();
        }
        return null;
    }

    public void createNewNote(Note note){
        try {
            PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO notes(owner, header, content) " +
                            "VALUES(?, ?, ?)");
            stmt.setInt(1, note.getOwner());
            stmt.setString(2, note.getHeader());
            stmt.setString(3, note.getContent());
            int res = stmt.executeUpdate();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    public void updateNote(Note note){
        try {
            PreparedStatement stmt = conn.prepareStatement(
                    "UPDATE notes SET owner = ?, header = ?, " +
                            "content = ? WHERE id = ?");
            stmt.setInt(1, note.getOwner());
            stmt.setString(2, note.getHeader());
            stmt.setString(3, note.getContent());
            stmt.setInt(4, note.getId());
            int res = stmt.executeUpdate();
            System.out.println("Updated notes: " + res);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    public void deleteNote(int noteID){
        try {
            PreparedStatement stmt = conn.prepareStatement("DELETE FROM notes WHERE id = ?");
            stmt.setInt(1, noteID);
            int res = stmt.executeUpdate();
            System.out.println(res);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    /**
     * Used to create and retrieve a unique ID. The ID is saved into the database, in the table "image_ids"
     * @return a unique ID. Primarily used for file uploads.
     */
    public int getUniqueID() throws Exception {
        try {
            // Adds a row with an auto-incremented ID.
            PreparedStatement createNewID = conn.prepareStatement("INSERT INTO image_ids DEFAULT VALUES");
            int res = createNewID.executeUpdate(); // Antal uppdaterade rader... Om det är 0 så sparades inget.

            if(res == 0) {
                // Kunde av någon anledning inte skapa ett unikt ID.
                throw new Exception("Image ID could not be created! Something is seriously wrong...");
            }

            // Hämtar det nya ID:t som just skapades genom att hämta det högsta ID:t (id är auto-increment)
            PreparedStatement getNewID = conn.prepareStatement("SELECT * FROM image_ids ORDER BY id DESC LIMIT 1");
            ResultSet rs = getNewID.executeQuery();
            int lastID = rs.getInt(1);
            return lastID;

        } catch (Exception e) {
            e.printStackTrace();
        }

        throw new Exception("Could not create unique ID. Therefore cannot upload image.");
    }
}
