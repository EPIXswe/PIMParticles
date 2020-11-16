package blackhat;

/**
 * <p>
 * A class that allows you to easily send a message with some data to the clients.<br>
 * If only a message is being sent, you could just use {@code response.send("Your message");}
 * </p>
 *
 * <p>
 * To use this class, use one of the static {@code get} methods: {@code get(String message, Object data)} or {@code get(String message)}.<br>
 * The boolean {@code hasData} will be set automatically.
 * </p>
 *
 * <p>
 * {@code get(String message, Object data)} is (maybe) pretty useful if you don't know if the data to be sent is null or not.
 * </p>
 */
public class ServerResponse {

    /**
     * The message to be sent to the client(s).
     */
    private String message;

    private boolean hasData;

    /**
     * Data to be sent to the client(s).
     */
    private Object data;


    ////////// CONSTRUCTORS //////////
    private ServerResponse() {}

    /**
     * Instantiates a ServerResponse. It's used so that you can send both a message and eventually some additional data.
     * @param message Message to be sent to client.
     * @param hasData If data is attached or not.
     * @param data Data to be sent, for example a list of notes.
     */
    private ServerResponse(String message, boolean hasData, Object data) {
        this.message = message;
        this.hasData = hasData;
        this.data = data;
    }


    ////////// GETTERS/SETTERS //////////
    public String getMessage() {
        return message;
    }

    public boolean isHasData() {
        return hasData;
    }

    public Object getData() {
        return data;
    }


    ////////// FACTORY METHODS //////////
    public static ServerResponse get(String message, Object data) {
        return new ServerResponse(message, data != null, data);
    }

    public static ServerResponse get(String message) {

        // TRY IF IT'S FINE TO SEND NULL VALUE INSTEAD
        return new ServerResponse(message, false, NoData.get());
    }


    ////////// CLASSES //////////
    /**
     * Used to symbolize empty data. It's just an empty object.
     * Not sure if it's needed? Can you send null values?
     */
    private static class NoData {
        private NoData() {}

        protected static NoData get() {
            return new NoData();
        }
    }

}
