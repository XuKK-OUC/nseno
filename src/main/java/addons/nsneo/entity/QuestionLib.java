package addons.nsneo.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 题库
 */
@Entity
@Access(AccessType.FIELD)
@Table(name = "tb_questionLib")
public class QuestionLib extends NsneoEntityBase<QuestionLib> {
    /**
     * 题库名称  例如山东地区题库
     */
    @Column(length = 50)
    private String name;

    /**
     * 题库中的所有题目
     */
    @OneToMany
    private List<Question> questions;

    public String getName() {
        if (name == null) {
            return "";
        }
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Question> getQuestions() {
        if (questions == null) {
            this.questions = new ArrayList<>();
        }
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    /**
     * 向题库中添加题目
     */
    public QuestionLib addQuestion(Question question) {
        if(question != null){
            if(!this.existQuestion(question)){
                this.getQuestions().add(question);
            }
        }
        return this;
    }

    /**
     * 判断某道题是否存在于此题库
     */
    public boolean existQuestion(Question question) {
        if(question==null){
            return false;
        }
        for(Question q:this.questions){
            if(q.getNumber().equals(question.getNumber())){
                return  true;
            }
        }
        return false;
    }

    public QuestionLib() {
    }

    public QuestionLib(String name) {
        this.name = name;
    }
}
