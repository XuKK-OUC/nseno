package addons.nsneo.pub;

public class Err {
    private String code;
    private String location;
    private String caption;

    public Err(String code, String location, String caption) {
        this.code = code;
        this.location = location;
        this.caption = caption;
    }
}
