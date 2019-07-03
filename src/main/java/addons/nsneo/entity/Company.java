package addons.nsneo.entity;


import org.checkerframework.checker.units.qual.C;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 用户登录实体类
 */
@Entity
@Access(AccessType.FIELD)
@Table(name = "tb_user")
public class Company extends NsneoEntityBase<Company> {

    /**
     * 企业机构社会信用代码
     */
    @Column(length = 50)
    private String enterprise_number;

    /**
     * 企业名称
     */
    @Column(length = 50)
    private String enterprise_name;

    /**
     * 密码
     */
    @Column(length = 50)
    private String password;

    /**
     * 手机号码
     */
    @Column(length = 50)
    private String phone;

    /**
     * 电子邮件
     */
    @Column(length = 50)
    private String email;



    /**
     * 企业类型
     */
    @Column(length = 50)
    private String enterprise_type;

    /**
     * 行业大类
     */
    @Column(length = 50)
    private String industry_big;

    /**
     * 行业小类
     */
    @Column(length = 50)
    private String industry_small;

    /**
     * 企业规模
     */
    @Column(length = 50)
    private String enterprise_scale;

    /**
     * 年销售收入
     */
    @Column(length = 50)
    private double annual_income;

    /**
     * 所属省份
     */
    @Column(length = 50)
    private String province;

    /**
     * 所属市
     */
    @Column(length = 50)
    private String city;

    /**
     * 所属区域
     */
    @Column(length = 50)
    private String area;

    /**
     * 商业类别
     */
    @Column(length = 50)
    private String businessType; //如离散,采掘
    /**
     * 一个用户可以做多份试卷
     */
    @OneToMany
    private List<AnswerSheet> answerSheets;

    //新增加的字段=========================================
    /**
     * 详细地址
     */
    @Column
    private String detailAddress;


    /**
     * 邮政编码
     */
    @Column
    private String postcode;

    /**
     * 公司网址
     */
    @Column
    private String webSite;

    //新加用户状态
    /**
     * 用户状态
     */
    @Column
    private int status;  //默认是0,禁用是1

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getDetailAddress() {
        return detailAddress;
    }

    public void setDetailAddress(String detailAddress) {
        this.detailAddress = detailAddress;
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    public String getWebSite() {
        return webSite;
    }

    public void setWebSite(String webSite) {
        this.webSite = webSite;
    }

    public Company() {
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEnterprise_name() {
        return enterprise_name;
    }

    public void setEnterprise_name(String enterprise_name) {
        this.enterprise_name = enterprise_name;
    }

    public String getEnterprise_number() {
        return enterprise_number;
    }

    public void setEnterprise_number(String enterprise_number) {
        this.enterprise_number = enterprise_number;
    }

    public String getEnterprise_type() {
        return enterprise_type;
    }

    public void setEnterprise_type(String enterprise_type) {
        this.enterprise_type = enterprise_type;
    }

    public String getIndustry_big() {
        return industry_big;
    }

    public void setIndustry_big(String industry_big) {
        this.industry_big = industry_big;
    }

    public String getIndustry_small() {
        return industry_small;
    }

    public void setIndustry_small(String industry_small) {
        this.industry_small = industry_small;
    }

    public String getEnterprise_scale() {
        return enterprise_scale;
    }

    public void setEnterprise_scale(String enterprise_scale) {
        this.enterprise_scale = enterprise_scale;
    }

    public double getAnnual_income() {
        return annual_income;
    }

    public void setAnnual_income(double annual_income) {
        this.annual_income = annual_income;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public List<AnswerSheet> getAnswerSheets() {
        if (answerSheets == null) {
            answerSheets = new ArrayList<>();
        }
        return answerSheets;

    }

    public void setAnswerSheets(List<AnswerSheet> answerSheets) {
        this.answerSheets = answerSheets;
    }

    @Override
    public String toString() {
        return "Company{" +
                "enterprise_number='" + enterprise_number + '\'' +
                ", enterprise_name='" + enterprise_name + '\'' +
                ", password='" + password + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", enterprise_type='" + enterprise_type + '\'' +
                ", industry_big='" + industry_big + '\'' +
                ", industry_small='" + industry_small + '\'' +
                ", enterprise_scale='" + enterprise_scale + '\'' +
                ", annual_income=" + annual_income +
                ", province='" + province + '\'' +
                ", city='" + city + '\'' +
                ", area='" + area + '\'' +
                ", businessType='" + businessType + '\'' +
                ", answerSheets=" + answerSheets +
                ", detailAddress='" + detailAddress + '\'' +
                ", postcode='" + postcode + '\'' +
                ", webSite='" + webSite + '\'' +
                '}';
    }

    /**
     * 为公司添加答卷的方法
     */
    public Company addAnswerSheet(AnswerSheet answerSheet){
        if(answerSheet!=null){
            this.getAnswerSheets().add(answerSheet);
        }
        return  this;
    }
}
