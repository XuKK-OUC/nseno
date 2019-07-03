package addons.nsneo.entity;

import javax.persistence.*;

/**
 * 用户答题的实体类对象,组成了答卷
 */
@Entity
@Access(AccessType.FIELD)
@Table(name = "tb_answerItem")
public class AnswerItem extends  NsneoEntityBase<AnswerItem>{

    /**
     * 做的问题
     */
    @OneToOne
    private Question question;
    /**
     * 选择的答案
     */
    @OneToOne
    private Answer answer;

    public AnswerItem() {
    }

    public Question getQuestion() {
        if (question == null){
            question = new Question();
        }
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Answer getAnswer() {
        if (answer==null){
            answer = new Answer();
        }
        return answer;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    @Override
    public String toString() {
        return "AnswerItem{" +
                "question=" + question +
                ", answer=" + answer +
                '}';
    }
}
