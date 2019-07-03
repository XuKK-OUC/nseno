package addons.nsneo.pub;

import java.io.Serializable;

public class jwtBean implements Serializable {
    private static final long serialVersionUID = 1899232511233819216L;
    private String a;

    public String getA() {
        return a;
    }

    public jwtBean(String a) {
        this.a = a;
    }
   public jwtBean()
 {
       ////super();
   }
    @Override
    public String toString() {
        return "jwtbean{" +
                "a='" + a + '\'' +
                '}';
    }

    public void setA(String a) {
        this.a = a;
    }
}
