package blackhat;

public class User {
    int id;
    String username;

    public User(int id, String username){
        this.id = id;
        this.username = username;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                '}';
    }
}
