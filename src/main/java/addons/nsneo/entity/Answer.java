package addons.nsneo.entity;

import addons.common.web.springController.dataPull.SimpleDataPull;
import org.apache.hadoop.yarn.webapp.hamlet.Hamlet;

import javax.persistence.*;

/**
 * 选项答案实体类
 */
@SimpleDataPull
@Entity
@Access(AccessType.FIELD)
@Table(name = "tb_answer")
public class Answer extends NsneoEntityBase<Answer> {


    /**
     * 答案编号 例如ABCD
     */
    @Column(length = 50)
    private String number;

    /**
     * 答案名字 如没有策划方案
     */
    @Column(length = 100)
    private String name;

    /**
     * 得分 选A得10分选B得20分
     */
    @Column(length = 50)
    private double score;

    /**
     * 答案属于哪一个问题
     * @return
     */
    @ManyToOne
    private Question question;

    public String getNumber() {
        if(number==null){
            return "";
        }
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getName() {
        if(name==null){
            return "";
        }
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
    public Answer(){

    }
    public Answer(String number, String name, double score) {
        this.number = number;
        this.name = name;
        this.score = score;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    @Override
    public String toString() {
        return "Answer{" +
                "number='" + number + '\'' +
                ", name='" + name + '\'' +
                ", score=" + score +
                '}';
    }
}
