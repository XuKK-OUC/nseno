package addons.nsneo.entity;

import addons.nsneo.pub.Level;
import org.checkerframework.checker.units.qual.C;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 答卷实体类对象
 */
@Entity
@Access(AccessType.FIELD)
@Table(name = "tb_answerSheet")
public class AnswerSheet extends NsneoEntityBase<AnswerSheet> {


    /**
     * 每个答卷属于唯一的用户
     */
    @ManyToOne
    private Company user;

    /**
     * 一份答卷有多道做的题和对应的答案
     */
    @OneToMany
    private List<AnswerItem> items;

    /**
     * 答卷的名字 如海大第一次答卷
     */
    @Column(length = 50)
    private String name;


    /**
     * 答卷的时间
     */
    @Column()
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    //新加的数据,答卷的得分和等级
    /**
     * 答卷的得分
     */
    @Column
    private Double score;

    @Column
    private String rank;

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public AnswerSheet() {
    }

    public AnswerSheet(String name) {
        this.name = name;
        this.date = new Date();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        if(date==null){
            date = new Date();
        }

        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

   public Company getUser() {
        return user;
    }

    public void setUser(Company user) {
        this.user = user;
    }

    public List<AnswerItem> getItems() {
        if(items == null){
            items = new ArrayList<>();
        }
        return items;
    }

    public void setItems(List<AnswerItem> items) {
        this.items = items;
    }
    /**
     * 添加题目的方法
     */
    public AnswerSheet add(AnswerItem answerItem){
        if(answerItem != null){
            this.getItems().add(answerItem);
        }
        return  this;
    }

    @Override
    public String toString() {
        return "AnswerSheet{" +
                "user=" + user +
                ", items=" + items +
                ", name='" + name + '\'' +
                ", date=" + date +
                '}';
    }

    /**
     * 得到此张答卷的总分数
     */
    public double getTotalScore(){
        double sum = 0;
        List<AnswerItem> answerItems = this.getItems();

        for(AnswerItem answerItem:answerItems){
           Answer answer = answerItem.getAnswer();
            //System.out.println(answer.getScore());
            System.out.println(answer);
            sum += answer.getScore();
            System.out.println(sum+"======");
        }

        return  sum;
    }
    /**
     * 得到此张答卷的级别
     */
    public String  getRank(double averageScore){
        double average = Double.valueOf(getTotalScore()+"");
        if(35<=averageScore && averageScore<40){
            return Level.FIFTH_LEVEL;
        }
        else if(30<=averageScore && averageScore<35){
            return Level.FOURTH_LEVEL;
        }
        else if(25<=averageScore && averageScore<30){
            return Level.THIRD_LEVEL;
        }
        else if(20<=averageScore && averageScore<25){
            return Level.SECOND_LEVEL;
        }
        return Level.FIRST_LEVEL;
    }

}
