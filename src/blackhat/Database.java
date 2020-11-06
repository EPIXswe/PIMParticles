package blackhat;

import com.fasterxml.jackson.core.JsonProcessingException;
import express.utils.Utils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Database {
    Connection conn = null;

    public void connectToServer(){
        try {
            conn = DriverManager.getConnection(
                    "jdbc:sqlite:pimp.db");
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
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
                    "SELECT * FROM users WHERE id = ?");
            stmt.setString(1, name);
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

    public void createNewNote(int owner, String header, String content){
        try {
            PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO notes(owner, header, content) " +
                            "VALUES(?, ?, ?)");
            stmt.setInt(1, owner);
            stmt.setString(2, header);
            stmt.setString(3, content);
            int res = stmt.executeUpdate();
            System.out.println("Created notes: " + res);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    public void updateNote(int owner, String newHeader,
                           String newContent, int noteID){
        try {
            PreparedStatement stmt = conn.prepareStatement(
                    "UPDATE notes SET owner = ?, header = ?, " +
                            "content = ? WHERE id = ?");
            stmt.setInt(1, owner);
            stmt.setString(2, newHeader);
            stmt.setString(3, newContent);
            stmt.setInt(4, noteID);
            int res = stmt.executeUpdate();
            System.out.println("Created notes: " + res);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    public void deleteNote(int noteID){
        try {
            PreparedStatement stmt = conn.prepareStatement("DELETE FROM notes " +
                    "WHERE id = ?");
            stmt.setInt(1, noteID);
            int res = stmt.executeUpdate();
            System.out.println(res);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
}
