package blackhat;

public class User {
    int id;
    String username;

    private User(){}

    public User(int id, String username){
        this.id = id;
        this.username = username;
    }

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public String toString() {
        return "User { " +
                "id=" + id +
                ", username='" + username + '\'' +
                " }";
    }
}
