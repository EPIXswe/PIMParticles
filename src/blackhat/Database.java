package blackhat;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    Connection conn = null;

    public void connectToServer(){
        try {
            conn = DriverManager.getConnection("jdbc:sqlite:pimp.db");
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
}
