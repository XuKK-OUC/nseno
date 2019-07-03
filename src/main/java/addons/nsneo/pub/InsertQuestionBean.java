package addons.nsneo.pub;

import java.util.Arrays;

/**
 * 添加题目的bean
 */
public class InsertQuestionBean {
        private String questionCaption; //题干  如:有没有实现自动化车间
        private String level;     //级别   如:已规划级
        private String  trade;    //行业   如:设计
        private String tradeLable;  //行业子标签 如:工艺设计
        private OptionBean[] optionBeans;  //选项数组

    public InsertQuestionBean() {
    }

    public InsertQuestionBean( String questionCaption, String level, String trade, String tradeLable, OptionBean[] optionBeans) {
        this.questionCaption = questionCaption;
        this.level = level;
        this.trade = trade;
        this.tradeLable = tradeLable;
        this.optionBeans = optionBeans;
    }

    @Override
    public String toString() {
        return "InsertQuestionBean{" +
                "  questionCaption='" + questionCaption + '\'' +
                ", level='" + level + '\'' +
                ", trade='" + trade + '\'' +
                ", tradeLable='" + tradeLable + '\'' +
                ", optionBeans=" + Arrays.toString(optionBeans) +
                '}';
    }

    public OptionBean[] getOptionBeans() {
        return optionBeans;
    }

    public void setOptionBeans(OptionBean[] optionBeans) {
        this.optionBeans = optionBeans;
    }

    public String getQuestionCaption() {
        return questionCaption;
    }

    public void setQuestionCaption(String questionCaption) {
        this.questionCaption = questionCaption;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getTrade() {
        return trade;
    }

    public void setTrade(String trade) {
        this.trade = trade;
    }

    public String getTradeLable() {
        return tradeLable;
    }

    public void setTradeLable(String tradeLable) {
        this.tradeLable = tradeLable;
    }

    public static class OptionBean{
        private String number ;  //如选A
        private String OptionCaption;  //答案描述,如:没有实现自动化车间
        private double score;

        public OptionBean() {
        }

        public OptionBean(String number, String optionCaption, double score) {
            this.number = number;
            OptionCaption = optionCaption;
            this.score = score;
        }

        public String getNumber() {
            return number;
        }

        public void setNumber(String number) {
            this.number = number;
        }

        public String getOptionCaption() {
            return OptionCaption;
        }

        public void setOptionCaption(String optionCaption) {
            OptionCaption = optionCaption;
        }

        public double getScore() {
            return score;
        }

        public void setScore(double score) {
            this.score = score;
        }

        @Override
        public String toString() {
            return "OptionBean{" +
                    "number='" + number + '\'' +
                    ", OptionCaption='" + OptionCaption + '\'' +
                    ", score=" + score +
                    '}';
        }
    }

}
