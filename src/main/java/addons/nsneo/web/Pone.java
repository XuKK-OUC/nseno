package addons.nsneo.web;

public class Pone {
  private  String name="" ;
  private Integer code = 0;

    public Pone() {
    }

    public Pone(String name, Integer code) {
        this.name = name;
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;

    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;

    }
}
