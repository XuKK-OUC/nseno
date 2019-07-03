package addons.nsneo.pub;

import java.io.Serializable;

/**
 * @Author: Yang Liu
 * @Date: 2019/4/23 22:10
 */
public class RedisBean implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 1899232511233819216L;

    /**
     * 企业id
     */
    private String enterpriseNumber;

    /**
     * 登录时间
     */
    private String logintime;

    /**
     * 系统类型  pc/app
     */
    private String systemtype;


    public RedisBean(){
        super();
    }


    public RedisBean(String enterpriseNumber, String logintime, String systemtype) {
        this.enterpriseNumber = enterpriseNumber;
        this.logintime = logintime;
        this.systemtype = systemtype;
    }

    public String getEnterpriseNumber() {
        return enterpriseNumber;
    }

    public void setEnterpriseNumber(String enterpriseNumber) {
        this.enterpriseNumber = enterpriseNumber;
    }

    public String getLogintime() {
        return logintime;
    }

    public void setLogintime(String logintime) {
        this.logintime = logintime;
    }

    public String getSystemtype() {
        return systemtype;
    }

    public void setSystemtype(String systemtype) {
        this.systemtype = systemtype;
    }

}
