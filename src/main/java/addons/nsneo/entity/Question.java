package addons.nsneo.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * 问题实体类对象
 */
@Entity
@Access(AccessType.FIELD)
@Table(name = "tb_question")
public class Question extends NsneoEntityBase<Question> {

    /**
     * 该问题对应的级别 如设计
     */
    @Column(length = 50)
    private String level;

    /**
     * 一个问题属于哪个行业子标签 如工艺设计
     */
    @ManyToOne
    private TradeLabel tradeLabel;


    /**
     * 一个问题属于哪个行业标签 如设计
     */
    @ManyToOne
    private Trade trade;

    public Trade getTrade() {
        return trade;
    }

    public void setTrade(Trade trade) {
        this.trade = trade;
    }

    public TradeLabel getTradeLabel() {
        return tradeLabel;
    }

    public void setTradeLabel(TradeLabel tradeLabel) {
        this.tradeLabel = tradeLabel;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    /**
     * 问题序号 例如1.1.1
     */
    @Column(length = 100)
    private String number;

    /**
     * 题干  例如产品设计过程中是否有设计策划方案？
     */
    @Column(length = 200)
    private String description;

    /**
     * 选项答案
     * A 没有策划方案
     * B 部分产品具有策划方案
     */

    @OneToMany
    private List<Answer> answers;

    /**
     * 题目状态 默认是0,禁用是1
     * @return
     */
    @Column
    private int status;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getNumber() {
        if (number == null) {
            return "";
        }
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getDescription() {
        if (description == null) {
            return "";
        }
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Answer> getAnswers() {
        if (answers == null) {
            answers = new ArrayList<>();
        }
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public Question(String number, String description) {
        this.number = number;
        this.description = description;
    }

    public Question() {
    }

    public Question( String number, String description,String level) {
        this.level = level;
        this.number = number;
        this.description = description;
    }

    /**
     * 加入问题答案
     */
    public Question add(Answer answer) {
        if(answer!=null){
            //判断答案是否在问题中重复
            if(!this.existAnswer(answer)) {
                this.getAnswers().add(answer);
            }
        }
        return this;
    }

    /**
     * 判断一个答案是否在问题中重复出现
     */
    public boolean existAnswer(Answer answer){
        if(answer==null){
            return  false;
        }
       for(Answer a:this.getAnswers()){
           if(a.getNumber().equals(answer.getNumber())){
               return true;
           }
       }
       return  false;
    }
    /**
     * 得到排序后的答案
     */
    public List<Answer> orderAndLoadAnswer(){
        List<Answer> lt = new ArrayList<>();
        lt.addAll(this.getAnswers());
        Collections.sort(lt, new Comparator<Answer>() {
            @Override
            public int compare(Answer o1, Answer o2) {
                return o1.getNumber().compareTo(o2.getNumber());
            }
        });
        return  lt;
    }

    @Override
    public String toString() {
        return "Question{" +
                "level='" + level + '\'' +
                ", number='" + number + '\'' +
                ", description='" + description + '\'' +
                ", answers=" + answers +
                '}';
    }
}
