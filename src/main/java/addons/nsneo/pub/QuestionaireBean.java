package addons.nsneo.pub;

import java.util.Arrays;

/**
 * @Author: Yang Liu
 * @Date: 2019/4/20 12:05
 */
public class  QuestionaireBean {
    private String level;
    private classifyBean classifyBeans[];

    public String getLevel() {
        return level;
    }


    public void setLevel(String level) {
        this.level = level;
    }

    public QuestionaireBean(String level, classifyBean[] classifyBeans) {
        this.level = level;
        this.classifyBeans = classifyBeans;
    }

    public classifyBean[] getClassifyBeans() {
        return classifyBeans;
    }

    public void setClassifyBeans(classifyBean[] classifyBeans) {
        this.classifyBeans = classifyBeans;
    }

    @Override
    public String toString() {
        return "questionaireBean{" +
                "level='" + level + '\'' +
                ", classifyBeans=" + Arrays.toString(classifyBeans) +
                '}';
    }
    //=====================
    public static class classifyBean{
        private String classifyname;
        private labelBean labelBeans[];

        public String getClassifyname() {
            return classifyname;
        }

        public void setClassifyname(String classifyname) {
            this.classifyname = classifyname;
        }

        public labelBean[] getLabelBeans() {
            return labelBeans;
        }

        public void setLabelBeans(labelBean[] labelBeans) {
            this.labelBeans = labelBeans;
        }

        public classifyBean(String classifyname, labelBean[] labelBeans) {
            this.classifyname = classifyname;
            this.labelBeans = labelBeans;
        }

        @Override
        public String toString() {
            return "classifyBean{" +
                    "classifyname='" + classifyname + '\'' +
                    ", labelBeans=" + Arrays.toString(labelBeans) +
                    '}';
        }
    }
    public static class labelBean{
        private String labelname;
        private questionBean questionBeans[];

        public labelBean(String labelname, questionBean[] questionBeans) {
            this.labelname = labelname;
            this.questionBeans = questionBeans;
        }

        public String getLabelname() {
            return labelname;
        }

        public void setLabelname(String labelname) {
            this.labelname = labelname;
        }

        public questionBean[] getQuestionBeans() {
            return questionBeans;
        }

        public void setQuestionBeans(questionBean[] questionBeans) {
            this.questionBeans = questionBeans;
        }

        @Override
        public String toString() {
            return "labelBean{" +
                    "labelname='" + labelname + '\'' +
                    ", questionBeans=" + Arrays.toString(questionBeans) +
                    '}';
        }
    }
    public static class questionBean{
        private String name;
        private String questionid;
        private String optionselected;
        private optionBean options[];

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getQuestionid() {
            return questionid;
        }

        public void setQuestionid(String questionid) {
            this.questionid = questionid;
        }

        public String getOptionselected() {
            return optionselected;
        }

        public void setOptionselected(String optionselected) {
            this.optionselected = optionselected;
        }

        public optionBean[] getOptions() {
            return options;
        }

        public void setOptions(optionBean[] options) {
            this.options = options;
        }

        public questionBean(String questionid,String name, String optionselected, optionBean[] options) {
            this.name = name;
            this.questionid = questionid;
            this.optionselected = optionselected;
            this.options = options;
        }

        @Override
        public String toString() {
            return "questionBean{" +
                    "name='" + name + '\'' +
                    ", questionid='" + questionid + '\'' +
                    ", optionselected=" + optionselected +
                    ", options=" + Arrays.toString(options) +
                    '}';
        }
    }
    public static class optionBean{

        private String code;
        private String desc;
       //新加的
        private double score;

        public double getScore() {
            return score;
        }

        public void setScore(double score) {
            this.score = score;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getDesc() {
            return desc;
        }

        public void setDesc(String desc) {
            this.desc = desc;
        }

        public optionBean(String code, String desc) {
            this.code = code;
            this.desc = desc;
        }

        @Override
        public String toString() {
            return "optionBean{" +
                    "code='" + code + '\'' +
                    ", desc='" + desc + '\'' +
                    '}';
        }
    }
}

