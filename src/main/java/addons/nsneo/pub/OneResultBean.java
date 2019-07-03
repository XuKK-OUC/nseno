package addons.nsneo.pub;

import java.util.Date;

/**
 * 一个用户得到它所有的试卷
 */
public class OneResultBean {
    private ReBean[] reBeans;

    public OneResultBean(ReBean[] reBeans) {
        this.reBeans = reBeans;
    }

    public ReBean[] getReBeans() {
        return reBeans;
    }

    public void setReBeans(ReBean[] reBeans) {
        this.reBeans = reBeans;
    }

    public static class ReBean{
        private String level;         //答卷等级
        private double score;        //答卷分数
        private Date date;           //答卷时间
        private String sheetName; //试卷号

        public String getSheetName() {
            return sheetName;
        }

        public void setSheetName(String sheetName) {
            this.sheetName = sheetName;
        }

        public ReBean() {
        }

        public ReBean(String level, double score, Date date, String sheetName) {
            this.level = level;
            this.score = score;
            this.date = date;
            this.sheetName = sheetName;
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
    }
}
