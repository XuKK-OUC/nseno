package addons.nsneo.pub;

public class LoginBean {
    private String enterprise_number;
    private String password;
    private String code;
    private String enterprise_name;
    private  String token;  //生成的token
    private String systemType;  //app/pc

    public String getSystemType() {
        return systemType;
    }

    public void setSystemType(String systemType) {
        this.systemType = systemType;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LoginBean() {
    }

    public LoginBean(String enterprise_number, String password, String code, String enterprise_name) {
        this.enterprise_number = enterprise_number;
        this.password = password;
        this.code = code;
        this.enterprise_name = enterprise_name;
    }

    public LoginBean(String enterprise_number, String password, String code, String enterprise_name, String token, String systemType) {
        this.enterprise_number = enterprise_number;
        this.password = password;
        this.code = code;
        this.enterprise_name = enterprise_name;
        this.token = token;
        this.systemType = systemType;
    }

    public String getEnterprise_number() {
        return enterprise_number;
    }

    public void setEnterprise_number(String enterprise_number) {
        this.enterprise_number = enterprise_number;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEnterprise_name() {
        return enterprise_name;
    }

    public void setEnterprise_name(String enterprise_name) {
        this.enterprise_name = enterprise_name;
    }

    @Override
    public String toString() {
        return "LoginBean{" +
                "enterprise_number='" + enterprise_number + '\'' +
                ", password='" + password + '\'' +
                ", code='" + code + '\'' +
                ", enterprise_name='" + enterprise_name + '\'' +
                '}';
    }
}
