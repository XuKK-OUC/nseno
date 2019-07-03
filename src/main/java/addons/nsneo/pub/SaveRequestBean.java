package addons.nsneo.pub;

import addons.nsneo.entity.Answer;

import java.util.Arrays;

public class SaveRequestBean {
    private String level;  //级别
    private String questionaireid;
    private QuestionAnswerBean[] answer;

    public SaveRequestBean() {
    }

    public SaveRequestBean(String level, String questionaireid, QuestionAnswerBean[] questionAnswerBeans) {
        this.level = level;
        this.questionaireid = questionaireid;
        this.answer = questionAnswerBeans;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getQuestionaireid() {
        return questionaireid;
    }

    public void setQuestionaireid(String questionaireid) {
        this.questionaireid = questionaireid;
    }

    public QuestionAnswerBean[] getQuestionAnswerBeans() {
        return answer;
    }

    public void setQuestionAnswerBeans(QuestionAnswerBean[] questionAnswerBeans) {
        this.answer = questionAnswerBeans;
    }

    @Override
    public String toString() {
        return "SaveRequestBean{" +
                "level='" + level + '\'' +
                ", questionaireid='" + questionaireid + '\'' +
                ", answer=" + Arrays.toString(answer) +
                '}';
    }

    public static class QuestionAnswerBean{
        private String questionid;  //如3.1.1
        private String option;  //如选A

        public QuestionAnswerBean() {
        }

        public QuestionAnswerBean(String questionid, String option) {
            this.questionid = questionid;
            this.option = option;
        }

        public String getQuestionid() {
            return questionid;
        }

        public void setQuestionid(String questionid) {
            this.questionid = questionid;
        }

        public String getOption() {
            return option;
        }

        public void setOption(String option) {
            this.option = option;
        }

        @Override
        public String toString() {
            return "QuestionAnswerBean{" +
                    "questionid='" + questionid + '\'' +
                    ", option='" + option + '\'' +
                    '}';
        }
    }

}

