package addons.nsneo.entity;

import org.checkerframework.checker.units.qual.C;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 管理员实体类
 */
@Entity
@Table(name = "tb_admin")
public class Admin extends  NsneoEntityBase<Admin>{
    /**
     * 用户名
     */
    @Column(length = 50)
    private String username;
    /**
     * 密码
     */
    @Column(length = 50)
    private String password;

    /**
     * 管理员可以查看多个企业答卷信息
     */
    @OneToMany
    private List<Company> companys;

    public List<Company> getCompanys() {
        if(companys==null){
            companys = new ArrayList<>();
        }
        return companys;
    }

    public void setCompanys(List<Company> companys) {
        this.companys = companys;
    }

    public Admin() {
    }

    public Admin(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    /**
     * 添加公司的方法
     */
    /**
     * 添加题目的方法
     */
    public Admin add(Company company){
        if(company != null){
            this.getCompanys().add(company);
        }
        return  this;
    }
}
