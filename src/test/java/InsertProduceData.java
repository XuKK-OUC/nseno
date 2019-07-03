import addons.common.utils.SimpleJPABuilderPkg;
import addons.nsneo.entity.Answer;
import addons.nsneo.entity.Question;
import addons.nsneo.entity.Trade;
import addons.nsneo.entity.TradeLabel;
import addons.nsneo.pub.Level;
import addons.nsneo.test.NsneoUnitTestBaseWithBeanManager;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import org.junit.Test;

/**
 * 生产行业
 */
public class InsertProduceData extends NsneoUnitTestBaseWithBeanManager {
    /**
     * 采购  已规划级
     */
    @Test
    public void test1(){
        //创建答案
        Answer answer1 = new Answer("A","所有产品度没有采购基础流程和采购计划",10);
        Answer answer2 = new Answer("B","某一个产品具有采购基础流程和采购计划",20);
        Answer answer3 = new Answer("C","大部分产品具有采购基础流程和采购计划",30);
        Answer answer4 = new Answer("D","所有产品都具有采购基础流程和采购计划",40);
        Answer answer5 = new Answer("A","所有产品都没有采购订单、采购合同以及跟踪记录",10);
        Answer answer6 = new Answer("B","某一个产品具有采购订单、采购合同以及跟踪记录",20);
        Answer answer7 = new Answer("C","大部分产品具有采购订单、采购合同以及跟踪记录 ",30);
        Answer answer8 = new Answer("D","所有产品都具有采购订单、采购合同以及跟踪记录",40);
        //创建问题
        Question question1 = new Question("2.1.1","是否具有采购基础流程和采购计划?", Level.FIRST_LEVEL);
        Question question2 = new Question("2.1.2","是否具有采购订单、采购合同以及跟踪记录?",Level.FIRST_LEVEL);
        question1.add(answer1).add(answer2).add(answer3).add(answer4);
        question2.add(answer5).add(answer6).add(answer7).add(answer8);
        answer1.setQuestion(question1);
        answer2.setQuestion(question1);
        answer3.setQuestion(question1);
        answer4.setQuestion(question1);
        answer5.setQuestion(question2);
        answer6.setQuestion(question2);
        answer7.setQuestion(question2);
        answer8.setQuestion(question2);
       TradeLabel tradeLabel = new TradeLabel("A","采购");
       tradeLabel.add(question1).add(question2);
       Trade trade = new Trade("B","生产");
       trade.add(tradeLabel);
       question1.setTradeLabel(tradeLabel);
       question2.setTradeLabel(tradeLabel);
       question1.setTrade(trade);
       question2.setTrade(trade);
        SimpleJPABuilderPkg.builder().update(answer1,answer2,answer3,answer4,answer5,answer6,answer7,answer8
                ,question1,question2,tradeLabel,trade);

    }
    /**
     * 采购  规范级
     */
    @Test
    public void  test2(){
        SqlWhereWithParamTools sqlWhere1 = SqlWhereWithParamTools.create(TradeLabel.class);
        sqlWhere1.and("name","采购");
        TradeLabel tradeLabel = SimpleJPABuilderPkg.builder(TradeLabel.class).findFirstEntity(sqlWhere1);
        SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere2.and("name","生产");
        Trade trade = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere2);
        System.out.println(tradeLabel);
        System.out.println(trade);
        //创建答案
        Answer answer1 = new Answer("A","采购流程没有规范制度",10);
        Answer answer2 = new Answer("B","采购流程有规范制度，某一个产品的采购计划基于生产计划和物料需求计划制定",20);
        Answer answer3 = new Answer("C","采购流程有规范制度, 大部分产品的采购计划基于生产计划和物料需求计划制定",30);
        Answer answer4 = new Answer("D","采购流程有规范制度, 所有产品的采购计划都基于生产计划和物料需求计划制定",40);
        Answer answer5 = new Answer("A","采购管理和供应商信息管理采用人工记录方式进行",10);
        Answer answer6 = new Answer("B","开始建立信息系统，通过信息系统初步实现采购管理和供应商管理",20);
        Answer answer7 = new Answer("C","公司主要原材料和外包商均通过信息系统实现采购管理和供应商信息管理",30);
        Answer answer8 = new Answer("D","公司所有的采购和供应商管理均通过信息系统实现",40);
        Answer answer9 = new Answer("A","不能通过信息系统实现采购部门内部数据共享",10);
        Answer answer10 = new Answer("B","能通过信息系统实现采购部门内部个别数据共享",20);
        Answer answer11= new Answer("C","能通过信息系统实现采购部门内部大部分数据共享",30);
        Answer answer12 = new Answer("D","能通过信息系统实现采购部门内部所有数据共享",40);
        //创建问题
        Question question1 = new Question("2.1.3","采购流程是否规范化管理，基于生产计划和物料需求计划制定采购计划？", Level.SECOND_LEVEL);
        Question question2 = new Question("2.1.4","是否通过企业级信息系统实现采购管理和供应商信息管理？",Level.SECOND_LEVEL);
        Question question3 = new Question("2.1.5","能否通过信息系统实现采购部门内部数据共享?",Level.SECOND_LEVEL);
        question1.add(answer1).add(answer2).add(answer3).add(answer4);
        question2.add(answer5).add(answer6).add(answer7).add(answer8);
        question3.add(answer9).add(answer10).add(answer11).add(answer12);
        answer1.setQuestion(question1);
        answer2.setQuestion(question1);
        answer3.setQuestion(question1);
        answer4.setQuestion(question1);
        answer5.setQuestion(question2);
        answer6.setQuestion(question2);
        answer7.setQuestion(question2);
        answer8.setQuestion(question2);
        answer9.setQuestion(question3);
        answer10.setQuestion(question3);
        answer11.setQuestion(question3);
        answer12.setQuestion(question3);
    tradeLabel.add(question1).add(question2).add(question3);
    trade.add(tradeLabel);
    question1.setTradeLabel(tradeLabel);
    question2.setTradeLabel(tradeLabel);
    question3.setTradeLabel(tradeLabel);
    question1.setTrade(trade);
    question2.setTrade(trade);
    question3.setTrade(trade);
    SimpleJPABuilderPkg.builder().update(answer1,answer2,answer3,answer4,answer5,answer6,
            answer7,answer8,answer9,answer10,answer11,answer12,question1,question2,question3,tradeLabel,trade);
    }

    /**
     * 计划与调度 已规划级题目插入
     */
    @Test
    public void test3(){
        //创建答案
        Answer answer1 = new Answer("A","没有主生产计划的编制基于销售订单和预测等信息",10);
        Answer answer2 = new Answer("B","某一个主生产计划的编制基于销售订单和预测等信息    ",20);
        Answer answer3 = new Answer("C","大部分主生产计划的编制基于销售订单和预测等信息",30);
        Answer answer4 = new Answer("D","所有主生产计划的编制均基于销售订单和预测等信息",40);
        Answer answer5 = new Answer("A","所有生产活动都不制定详细生产作业计划",10);
        Answer answer6 = new Answer("B","某一个生产活动制定详细生产作业计划",20);
        Answer answer7 = new Answer("C","大部分生产活动都制定详细生产作业计划",30);
        Answer answer8 = new Answer("D","所有生产活动都制定详细生产作业计划",40);
        //创建问题
        Question question1 = new Question("2.2.1","主生产计划的编制是否基于销售订单和预测等信息？", Level.FIRST_LEVEL);
        Question question2 = new Question("2.2.2","生产作业是否制定详细生产作业计划？",Level.FIRST_LEVEL);
        question1.add(answer1).add(answer2).add(answer3).add(answer4);
        question2.add(answer5).add(answer6).add(answer7).add(answer8);
        answer1.setQuestion(question1);
        answer2.setQuestion(question1);
        answer3.setQuestion(question1);
        answer4.setQuestion(question1);
        answer5.setQuestion(question2);
        answer6.setQuestion(question2);
        answer7.setQuestion(question2);
        answer8.setQuestion(question2);
        TradeLabel tradeLabel = new TradeLabel("B","计划与调度");
        tradeLabel.add(question1).add(question2);
        SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere2.and("name","生产");
        Trade trade = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere2);
        trade.add(tradeLabel);
        tradeLabel.setTrade(trade);
        question1.setTradeLabel(tradeLabel);
        question2.setTradeLabel(tradeLabel);

        question1.setTrade(trade);
        question2.setTrade(trade);

        SimpleJPABuilderPkg.builder().update(answer1,answer2,answer3,answer4,answer5,answer6,answer7,answer8,
              question1,question2,tradeLabel,trade);

    }
    /**
     * 计划与调度 规范级题目插入
     */
    @Test
    public void  test4(){
        SqlWhereWithParamTools sqlWhere1 = SqlWhereWithParamTools.create(TradeLabel.class);
        sqlWhere1.and("name","计划与调度");
        TradeLabel tradeLabel = SimpleJPABuilderPkg.builder(TradeLabel.class).findFirstEntity(sqlWhere1);
        SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere2.and("name","生产");
        Trade trade = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere2);
        System.out.println(tradeLabel);
        System.out.println(trade);
        //创建答案
        Answer answer1 = new Answer("A","没有信息系统生成生产计划",10);
        Answer answer2 = new Answer("B","某一个生产活动使用信息系统生成生产计划",20);
        Answer answer3 = new Answer("C","大部分生产活动都使用信息系统在基于生成数量、交期等约束条件下自动生成主生产计划",30);
        Answer answer4 = new Answer("D","所有生产活动都使用信息系统在基于生成数量、交期等约束条件下自动生成主生产计划",40);
        Answer answer5 = new Answer("A","在信息系统中没有对生产计划实现MRP运算",10);
        Answer answer6 = new Answer("B","在信息系统中对某一个生产计划实现MRP运算",20);
        Answer answer7 = new Answer("C","在信息系统中是否对大部分生产计划实现MRP运算",30);
        Answer answer8 = new Answer("D","在信息系统中是否所有生产计划实现MRP运算",40);
        Answer answer9 = new Answer("A","没有在信息系统中进行调度排产，生成详细生产作业计划",10);
        Answer answer10 = new Answer("B","某一个生产活动在信息系统中进行调度排产，生成详细生产作业计划",20);
        Answer answer11= new Answer("C","大部分生产活动都在信息系统中在不考虑各种能力的限制下进行调度排产，生成详细生产作业计划",30);
        Answer answer12 = new Answer("D","所有生产活动都在信息系统中在不考虑各种能力的限制下进行调度排产，生成详细生产作业计划",40);

        //创建问题
        Question question1 = new Question("2.2.3","是否用信息系统生成主生产计划？", Level.SECOND_LEVEL);
        Question question2 = new Question("2.2.4","在信息系统中是否对生产计划实现MRP运算？",Level.SECOND_LEVEL);
        Question question3 = new Question("2.2.5","是否在信息系统中进行调度排产，生成详细生产作业计划？",Level.SECOND_LEVEL);
        question1.add(answer1).add(answer2).add(answer3).add(answer4);
        question2.add(answer5).add(answer6).add(answer7).add(answer8);
        question3.add(answer9).add(answer10).add(answer11).add(answer12);
        answer1.setQuestion(question1);
        answer2.setQuestion(question1);
        answer3.setQuestion(question1);
        answer4.setQuestion(question1);
        answer5.setQuestion(question2);
        answer6.setQuestion(question2);
        answer7.setQuestion(question2);
        answer8.setQuestion(question2);
        answer9.setQuestion(question3);
        answer10.setQuestion(question3);
        answer11.setQuestion(question3);
        answer12.setQuestion(question3);
        tradeLabel.add(question1).add(question2).add(question3);
        trade.add(tradeLabel);
        tradeLabel.setTrade(trade);
        question1.setTradeLabel(tradeLabel);
        question2.setTradeLabel(tradeLabel);
        question3.setTradeLabel(tradeLabel);
        question1.setTrade(trade);
        question2.setTrade(trade);
        question3.setTrade(trade);
        SimpleJPABuilderPkg.builder().update(answer1,answer2,answer3,answer4,answer5,answer6,
                answer7,answer8,answer9,answer10,answer11,answer12,
                question1,question2,question3,tradeLabel,trade);
    }
    /**
     * 生产作业 已规划级题目插入
     */
    @Test
    public void test5(){
        //创建答案
        Answer answer1 = new Answer("A","没有生产作业相关工艺文件和作业指导书",10);
        Answer answer2 = new Answer("B","关键生产作业过程具有生产作业相关工艺文件和作业指导书",20);
        Answer answer3 = new Answer("C","大部分生产作业过程具有生产作业相关工艺文件和作业指导书",30);
        Answer answer4 = new Answer("D","所有生产作业过程具有生产作业相关工艺文件和作业指导书",40);
        Answer answer5 = new Answer("A","关键件、关键工艺信息以及过程信息不可采集",10);
        Answer answer6 = new Answer("B","部分关键件、关键工艺信息以及过程信息可采集",20);
        Answer answer7 = new Answer("C","大部分关键件、关键工艺信息以及过程信息可采集",30);
        Answer answer8 = new Answer("D","所有关键件、关键工艺信息以及过程信息可采集",40);
        //创建问题
        Question question1 = new Question("2.3.1","企业是否具有生产作业相关工艺文件和作业指导书？", Level.FIRST_LEVEL);
        Question question2 = new Question("2.3.2","是否实现生产过程中关键件、关键工艺信息以及过程信息可采集？",Level.FIRST_LEVEL);
        question1.add(answer1).add(answer2).add(answer3).add(answer4);
        question2.add(answer5).add(answer6).add(answer7).add(answer8);
        answer1.setQuestion(question1);
        answer2.setQuestion(question1);
        answer3.setQuestion(question1);
        answer4.setQuestion(question1);
        answer5.setQuestion(question2);
        answer6.setQuestion(question2);
        answer7.setQuestion(question2);
        answer8.setQuestion(question2);
        TradeLabel tradeLabel = new TradeLabel("C","生产作业");
        tradeLabel.add(question1).add(question2);
        SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere2.and("name","生产");
        Trade trade = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere2);
        trade.add(tradeLabel);
        tradeLabel.setTrade(trade);
        question1.setTradeLabel(tradeLabel);
        question2.setTradeLabel(tradeLabel);

        question1.setTrade(trade);
        question2.setTrade(trade);

        SimpleJPABuilderPkg.builder().update(answer1,answer2,answer3,answer4,answer5,answer6,answer7,answer8,
              question1,question2,tradeLabel,trade);

    }
    /**
     * 生产作业 规范级题目插入
     */
    @Test
    public void  test6(){
        SqlWhereWithParamTools sqlWhere1 = SqlWhereWithParamTools.create(TradeLabel.class);
        sqlWhere1.and("name","生产作业");
        TradeLabel tradeLabel = SimpleJPABuilderPkg.builder(TradeLabel.class).findFirstEntity(sqlWhere1);
        SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere2.and("name","生产");
        Trade trade = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere2);
        System.out.println(tradeLabel);
        System.out.println(trade);
        //创建答案
        Answer answer1 = new Answer("A","不能传输和下发与生产相关的电子图文资料到各生产单元",10);
        Answer answer2 = new Answer("B","部分工位能够实现传输和下发与生产相关的电子图文资料到各生产单元",20);
        Answer answer3 = new Answer("C","所有关键工位能传输和下发与生产相关的电子图文资料到各生产单元",30);
        Answer answer4 = new Answer("D","所有关键工位均能实现及时传输和下发与生产相关的电子图文资料到各生产单元",40);
        Answer answer5 = new Answer("A","不能实现对生产过程中关键信息的自动采集并上传",10);
        Answer answer6 = new Answer("B","生产作业过程部分能够实现对生产过程中关键信息的自动采集并上传",20);
        Answer answer7 = new Answer("C","生产作业过程大部分能够实现对生产过程中关键信息的自动采集并上传",30);
        Answer answer8 = new Answer("D","生产作业过程均能够实现对生产过程中关键信息的自动采集并上传",40);
        Answer answer9 = new Answer("A","关键工位生产过程没有实现闭环管理，过程完整数据不可查",10);
        Answer answer10 = new Answer("B","关键工位生产过程部分实现闭环管理，过程完整数据部分可查",20);
        Answer answer11= new Answer("C","关键工位生产过程大部分实现闭环管理，过程大部分完整数据可查",30);
        Answer answer12 = new Answer("D","关键工位生产过程实现闭环管理，过程完整数据可查",40);

        //创建问题
        Question question1 = new Question("2.3.3","是否能够通过信息技术手段及时传输和下发与生产相关的图纸、工艺文件、作业指导书、配方等图文资料到各生产单元？", Level.SECOND_LEVEL);
        Question question2 = new Question("2.3.4","是否实现了生产过程中对关键物料、设备、人员等资源信息自动采集，并上传到信息系统？",Level.SECOND_LEVEL);
        Question question3 = new Question("2.3.5","关键工位生产过程实现闭环管理，过程完整数据可查",Level.SECOND_LEVEL);
        question1.add(answer1).add(answer2).add(answer3).add(answer4);
        question2.add(answer5).add(answer6).add(answer7).add(answer8);
        question3.add(answer9).add(answer10).add(answer11).add(answer12);
        answer1.setQuestion(question1);
        answer2.setQuestion(question1);
        answer3.setQuestion(question1);
        answer4.setQuestion(question1);
        answer5.setQuestion(question2);
        answer6.setQuestion(question2);
        answer7.setQuestion(question2);
        answer8.setQuestion(question2);
        answer9.setQuestion(question3);
        answer10.setQuestion(question3);
        answer11.setQuestion(question3);
        answer12.setQuestion(question3);
        tradeLabel.add(question1).add(question2).add(question3);
        trade.add(tradeLabel);
        tradeLabel.setTrade(trade);
        question1.setTradeLabel(tradeLabel);
        question2.setTradeLabel(tradeLabel);
        question3.setTradeLabel(tradeLabel);
        question1.setTrade(trade);
        question2.setTrade(trade);
        question3.setTrade(trade);
        SimpleJPABuilderPkg.builder().update(answer1,answer2,answer3,answer4,answer5,answer6,
                answer7,answer8,answer9,answer10,answer11,answer12,
                question1,question2,question3,tradeLabel,trade);
    }
    @Test
    public void ztest(){
        test1();
        test2();
        test3();
        test4();
        test5();
        test6();
    }

}
