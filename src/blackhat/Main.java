package blackhat;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        Database db = new Database();
        db.connectToServer();

        Webserver webserver = new Webserver();
        webserver.Start();

    }
}