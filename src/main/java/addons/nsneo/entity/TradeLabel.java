package addons.nsneo.entity;

import org.checkerframework.checker.units.qual.C;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * 行业子标签
 */
@Entity
@Access(AccessType.FIELD)
@Table(name = "tb_tradeLabel")
public class TradeLabel extends NsneoEntityBase<TradeLabel> {
    /**
     * 本标签下的问题合集
     */
    @OneToMany
    private List<Question> questions;

    /**
     * 标签名称
     */
    @Column(length = 50)
    private String name;

    /**
     * 标签序号
     */
    @Column(length = 50)
    private String number;

    @ManyToOne
    private Trade trade;

    public Trade getTrade() {
        return trade;
    }

    public void setTrade(Trade trade) {
        this.trade = trade;
    }

    public TradeLabel() {
    }

    public TradeLabel(String number,String name) {
        this.number = number;
        this.name = name;

    }

    public String getName() {
        if (name == null) {
            return "";
        }
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public List<Question> getQuestions() {

        if (this.questions == null) {
            this.questions = new ArrayList<>();

        }
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }


    /**
     * 加入问题
     */
    public TradeLabel add(Question question) {
        if(question != null){
            if(!this.existQuestion(question)){
                this.getQuestions().add(question);
            }
        }
        return this;
    }
    /**
     * 判断某道题是否存在于此行业标签
     */
    public boolean existQuestion(Question question) {
        if (question == null) {
            return false;
        }
        for (Question q : this.getQuestions()) {
            if (q.getNumber().equals(question.getNumber())) {
                return true;
            }
        }
        return false;
    }


    /**
     * 得到排序后的问题
     */
    public List<Question> orderAndLoadQuestion() {


        List<Question> lt = new ArrayList<>();
        lt.addAll(this.getQuestions());

        Collections.sort(lt, new Comparator<Question>() {
            @Override
            public int compare(Question o1, Question o2) {
                return o1.getNumber().compareTo(o2.getNumber());
            }
        });

        return lt;

    }

    @Override
    public String toString() {
        return "TradeLabel{" +
                "questions=" + questions +
                ", name='" + name + '\'' +
                ", trade=" + trade +
                '}';
    }

    /**
     * 约束为 某行业下的某问题标签
     * 行业标签下的题和题库中的题取交集
     * 加载本标签下对应题库的问题合集
     *
     * @param lib 题库对象
     */
    public List<Question> loadQuesetion(QuestionLib lib) {

        List<Question> lt = new ArrayList<>();
        //加载本标签下的题库
        List<Question> lableLibs = this.orderAndLoadQuestion();
        if (lib == null) {
            lt.addAll(lableLibs);
        } else {
            for (Question q : lableLibs) {
                if (lib.existQuestion(q)) {
                    lt.add(q);
                }
            }
        }
        return lt;
    }
}
