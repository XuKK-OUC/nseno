package addons.nsneo.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * 问题所属行业,如设计,物流,生产,销售
 *
 */
@Entity
@Access(AccessType.FIELD)
@Table(name="tb_trade")
public class Trade extends NsneoEntityBase<Trade>{
    /**
     * 行业编号
     */
    @Column(length = 50)
    private String number;

    /**
     * 本行业的子标签合集,一个行业底下有多个行业子标签,如设计下有产品设计和工艺设计
     * */
    @OneToMany
    private List<TradeLabel> labels;

    /**
     * 行业名称
     * */
    @Column(length = 50)
    private String name;

    public Trade(){}

    public Trade( String number,String name) {
        this.number = number;
        this.name = name;
    }

    @Override
    public String toString() {
        return "Trade{" +
                "labels=" + labels +
                ", name='" + name + '\'' +
                '}';
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
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

    public List<TradeLabel> getLabels() {
        if(labels==null){
            labels = new ArrayList<>();
        }
        return labels;
    }

    public void setLabels(List<TradeLabel> labels) {
        this.labels = labels;
    }



    /**
     * 添加行业子标签
     * */
    public Trade add(TradeLabel label){
        if(label!=null){
            if(!this.existTradeLabel(label)){
                this.getLabels().add(label);
            }
        }
        return this;
    }
    /**
     * 判断某行业子标签是否存在于此行业
     */
    public boolean existTradeLabel(TradeLabel tradeLabel){
        if(tradeLabel==null){
            return  false;
        }
        for(TradeLabel t:this.getLabels()){
            if(t.getNumber().equals(tradeLabel.getNumber())){
                return  true;
            }
        }
        return false;
    }
    /**
     * 得到排序后的标签
     * */
    public List<TradeLabel> orderAndLoadLabel(){


        List<TradeLabel> lt = new ArrayList<>();
        lt.addAll(this.getLabels());

        Collections.sort(lt,new Comparator<TradeLabel>(){
            @Override
            public int compare(TradeLabel o1, TradeLabel o2) {
                return o1.getNumber().compareTo(o2.getNumber());
            }
        });

        return lt;

    }
}
