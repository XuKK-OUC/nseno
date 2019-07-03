package addons.nsneo.pub;

import java.util.Arrays;

/**
 * 请求试卷bean
 */
public class AskQuestionaireBean {
    private String level;
    private String questionaireid;
    private String[] tradeArr;

    public AskQuestionaireBean() {
    }

    public AskQuestionaireBean(String level, String questionaireid, String[] tradeArr) {
        this.level = level;
        this.questionaireid = questionaireid;
        this.tradeArr = tradeArr;
    }

    public AskQuestionaireBean(String level, String[] tradeArr) {
        this.level = level;
        this.tradeArr = tradeArr;
    }

    public String getQuestionaireid() {
        return questionaireid;
    }

    public void setQuestionaireid(String questionaireid) {
        this.questionaireid = questionaireid;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String[] getTradeArr() {
        return tradeArr;
    }

    public void setTradeArr(String[] tradeArr) {
        this.tradeArr = tradeArr;
    }

    @Override
    public String toString() {
        return "AskQuestionaireBean{" +
                "level='" + level + '\'' +
                ", questionaireid='" + questionaireid + '\'' +
                ", tradeArr=" + Arrays.toString(tradeArr) +
                '}';
    }
}

