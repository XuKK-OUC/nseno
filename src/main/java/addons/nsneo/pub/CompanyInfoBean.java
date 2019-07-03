package addons.nsneo.pub;

import javax.persistence.Column;

/**
 * 用户登录后返回的用户注册信息
 */
public class CompanyInfoBean {
    /**
     * 企业机构社会信用代码
     */
    private String enterprise_number;

    /**
     * 企业名称
     */
    private String enterprise_name;

    /**
     * 密码
     */
    private String password;

    /**
     * 手机号码
     */
    private String phone;

    /**
     * 电子邮件
     */
    private String email;

    /**
     * 企业类型
     */
    private String enterprise_type;

    /**
     * 行业大类
     */
    private String industry_big;

    /**
     * 行业小类
     */
    private String industry_small;

    /**
     * 企业规模
     */
    private String enterprise_scale;

    /**
     * 年销售收入
     */
    private double annual_income;

    /**
     * 所属省份
     */
    private String province;

    /**
     * 所属市
     */
    private String city;

    /**
     * 所属区域
     */
    private String area;

    /**
     * 商业类别
     */
    private String businessType; //如离散,采掘

    /**
     * 详细地址
     */
    private String detailAddress;


    /**
     * 邮政编码
     */
    private String postcode;

    /**
     * 公司网址
     */
    private String webSite;

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

    public String getEnterprise_number() {
        return enterprise_number;
    }

    public void setEnterprise_number(String enterprise_number) {
        this.enterprise_number = enterprise_number;
    }

    public String getEnterprise_name() {
        return enterprise_name;
    }

    public void setEnterprise_name(String enterprise_name) {
        this.enterprise_name = enterprise_name;
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

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public CompanyInfoBean() {
    }

    public CompanyInfoBean(String enterprise_number, String enterprise_name, String password, String phone, String email, String enterprise_type, String industry_big, String industry_small, String enterprise_scale, double annual_income, String province, String city, String area, String businessType, String detailAddress, String postcode, String webSite) {
        this.enterprise_number = enterprise_number;
        this.enterprise_name = enterprise_name;
        this.password = password;
        this.phone = phone;
        this.email = email;
        this.enterprise_type = enterprise_type;
        this.industry_big = industry_big;
        this.industry_small = industry_small;
        this.enterprise_scale = enterprise_scale;
        this.annual_income = annual_income;
        this.province = province;
        this.city = city;
        this.area = area;
        this.businessType = businessType;
        this.detailAddress = detailAddress;
        this.postcode = postcode;
        this.webSite = webSite;
    }

    public CompanyInfoBean(String enterprise_number, String enterprise_name, String password, String phone, String email, String enterprise_type, String industry_big, String industry_small, String enterprise_scale, double annual_income, String province, String city, String area, String businessType) {
        this.enterprise_number = enterprise_number;
        this.enterprise_name = enterprise_name;
        this.password = password;
        this.phone = phone;
        this.email = email;
        this.enterprise_type = enterprise_type;
        this.industry_big = industry_big;
        this.industry_small = industry_small;
        this.enterprise_scale = enterprise_scale;
        this.annual_income = annual_income;
        this.province = province;
        this.city = city;
        this.area = area;
        this.businessType = businessType;
    }
}
