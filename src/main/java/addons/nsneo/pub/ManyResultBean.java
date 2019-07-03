package addons.nsneo.pub;

import java.util.Date;

/**
 * 管理员得到所有企业及所有的答卷
 */
public class ManyResultBean {
    private ReBean[] reBeans;

    public ManyResultBean(ReBean[] reBeans) {
        this.reBeans = reBeans;
    }

    public ReBean[] getReBeans() {
        return reBeans;
    }

    public void setReBeans(ReBean[] reBeans) {
        this.reBeans = reBeans;
    }

    public static class ReBean {
        private String level;         //答卷等级
        private double score;        //答卷分数
        private Date date;           //答卷试卷
        private String sheetName;    //试卷号
        private String enterpriseNumber;  //企业信用代码

        //新加的数据
        private String enterpriseName; //企业名称
        private String province;//企业所属的省
        private String city;//企业所属的市

        public String getEnterpriseName() {
            return enterpriseName;
        }

        public ReBean(String level, double score, Date date, String sheetName, String enterpriseNumber, String enterpriseName, String province, String city) {
            this.level = level;
            this.score = score;
            this.date = date;
            this.sheetName = sheetName;
            this.enterpriseNumber = enterpriseNumber;
            this.enterpriseName = enterpriseName;
            this.province = province;
            this.city = city;
        }

        public void setEnterpriseName(String enterpriseName) {
            this.enterpriseName = enterpriseName;
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

        public ReBean() {
        }

        public String getLevel() {
            return level;
        }

        public void setLevel(String level) {
            this.level = level;
        }

        public double getScore() {
            return score;
        }

        public void setScore(double score) {
            this.score = score;
        }

        public Date getDate() {
            return date;
        }

        public void setDate(Date date) {
            this.date = date;
        }

        public String getSheetName() {
            return sheetName;
        }

        public void setSheetName(String sheetName) {
            this.sheetName = sheetName;
        }

        public String getEnterpriseNumber() {
            return enterpriseNumber;
        }

        public void setEnterpriseNumber(String enterpriseNumber) {
            this.enterpriseNumber = enterpriseNumber;
        }
    }
}

