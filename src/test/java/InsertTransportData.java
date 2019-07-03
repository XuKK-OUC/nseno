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
 * 物流行业
 */
public class   InsertTransportData extends NsneoUnitTestBaseWithBeanManager {
    /**
     * 仓储与配送  已规划级
     */
    @Test
    public void test1(){
        //创建答案
        Answer answer1 = new Answer("A","没有仓库管理系统",10);
        Answer answer2 = new Answer("B","具有仓库管理系统实现部分产品出入库管理、盘点和安全库存等功能",20);
        Answer answer3 = new Answer("C","具有仓库管理系统实现大部分产品出入库管理、盘点和安全库存等功能",30);
        Answer answer4 = new Answer("D","具有仓库管理系统实现全部分产品出入库管理、盘点和安全库存等功能",40);
        Answer answer5 = new Answer("A","没有管理分类和认证规范",10);
        Answer answer6 = new Answer("B","部分物料的管理分类和认证规范实现仓储合理管理",20);
        Answer answer7 = new Answer("C","大部分物料的管理分类和认证规范实现仓储合理管理",30);
        Answer answer8 = new Answer("D","所有物料的管理分类和认证规范实现仓储合理管理",40);
        //创建问题
        Question question1 = new Question("3.1.1","是否具有仓库管理系统实现出入库管理、盘点和安全库存等功能？", Level.FIRST_LEVEL);
        Question question2 = new Question("3.1.2","是否具有管理分类和认证规范实现仓储合理管理？",Level.FIRST_LEVEL);
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
        //创建答案
        Answer answer11 = new Answer("A","不能记录",10);
        Answer answer12 = new Answer("B","部分原材料和中间产品配送可跟踪记录",20);
        Answer answer13 = new Answer("C","大部分原材料和中间产品配送可跟踪记录",30);
        Answer answer14 = new Answer("D","全部原材料和中间产品配送可跟踪记录",40);
        //创建问题
        Question question3 = new Question("3.1.3","是否能跟踪记录原材料和中间产品配送？", Level.FIRST_LEVEL);
        question3.add(answer11).add(answer12).add(answer13).add(answer14);
        answer11.setQuestion(question3);
        answer12.setQuestion(question3);
        answer13.setQuestion(question3);
        answer14.setQuestion(question3);
       TradeLabel tradeLabel = new TradeLabel("A","仓储与配送");
       tradeLabel.add(question1).add(question2).add(question3);
       Trade trade = new Trade("C","物流");
       trade.add(tradeLabel);
       tradeLabel.setTrade(trade);
       question1.setTradeLabel(tradeLabel);
       question2.setTradeLabel(tradeLabel);
       question3.setTradeLabel(tradeLabel);
       question1.setTrade(trade);
       question2.setTrade(trade);
       question3.setTrade(trade);
        SimpleJPABuilderPkg.builder().update(answer1,answer2,answer3,answer4,answer5,answer6,answer7,answer8,
                answer11,answer12,answer13,answer14,question1,question2,question3,
                tradeLabel,trade);

    }
    /**
     * 仓储与配送  规范级
     */
    @Test
    public void  test2(){
        SqlWhereWithParamTools sqlWhere1 = SqlWhereWithParamTools.create(TradeLabel.class);
        sqlWhere1.and("name","仓储与配送");
        TradeLabel tradeLabel = SimpleJPABuilderPkg.builder(TradeLabel.class).findFirstEntity(sqlWhere1);
        SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere2.and("name","物流");
        Trade trade = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere2);
        System.out.println(tradeLabel);
        System.out.println(trade);
        //创建答案
        Answer answer1 = new Answer("A","不具备条码管理等数字化技术实现自动或半自动入库管理",10);
        Answer answer2 = new Answer("B","部分产品能够通过条码管理等数字化技术实现自动或半自动入库管理",20);
        Answer answer3 = new Answer("C","大部分产品能够通过条码管理等数字化技术实现自动或半自动入库管理",30);
        Answer answer4 = new Answer("D","全部分产品能够通过条码管理等数字化技术实现自动或半自动入库管理",40);
        Answer answer5 = new Answer("A","仓储管理系统无模型",10);
        Answer answer6 = new Answer("B","仓储管理系统有固定模型",20);
        Answer answer7 = new Answer("C","仓储管理系统部分货模型参数可自定义",30);
        Answer answer8 = new Answer("D","仓储管理系统全部货模型参数可自定义",40);
        Answer answer9 = new Answer("A","无信息系统支撑物料配送",10);
        Answer answer10 = new Answer("B","基于信息系统实现部分物料配送请求并提示及时配送",20);
        Answer answer11= new Answer("C","基于信息系统实现大部分物料配送请求并提示及时配送",30);
        Answer answer12 = new Answer("D","基于信息系统实现全部物料配送请求并提示及时配送",40);
        //创建问题
        Question question1 = new Question("3.1.5","是否具有统一条码管理标识货物，使用网络设备实现自动和半自动出入库管理？", Level.SECOND_LEVEL);
        Question question2 = new Question("3.1.6","具有仓储管理系统、货物管理模型，比如ABC算法模型？",Level.SECOND_LEVEL);
        Question question3 = new Question("3.1.7","能否基于信息系统实现实际物料情况发起配送请求并提示及时配送？",Level.SECOND_LEVEL);
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
            answer7,answer8,answer9,answer10,answer11,answer12,question1,question2,question3,tradeLabel,trade);
    }

    /**
     * 运输管理 已规划级题目插入
     */
    @Test
    public void test3(){
        //创建答案
        Answer answer1 = new Answer("A","未管理物流运输订单信息",10);
        Answer answer2 = new Answer("B","采用纸质记录管理物流运输订单信息",20);
        Answer answer3 = new Answer("C","采用电子结构化数据管理物流运输订单信息的",30);
        Answer answer4 = new Answer("D"," 采用电子台账（可导入系统）等手段管理物流运输订单信息",40);
        Answer answer5 = new Answer("A","未管理运输计划和配置调度信息",10);
        Answer answer6 = new Answer("B","采用纸质记录管理运输计划和配置调度",20);
        Answer answer7 = new Answer("C","采用电子结构化数据管理运输计划和配置调度",30);
        Answer answer8 = new Answer("D","采用电子台账（可导入系统）等手段管理运输计划和配置调度",40);
        //创建问题
        Question question1 = new Question("3.2.1","是否采用信息化手段管理物流运输订单信息？", Level.FIRST_LEVEL);
        Question question2 = new Question("3.2.2","是否通过信息化手段管理运输计划和配置调度？",Level.FIRST_LEVEL);
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
        //创建答案
        Answer answer11 = new Answer("A","未实现",10);
        Answer answer12 = new Answer("B"," 通过电话等方式确认货物到达",20);
        Answer answer13 = new Answer("C","通过电话等方式确认货物到达详细信息（时间、签收人、货物完整性、入库信息等）",30);
        Answer answer14 = new Answer("D","货物到达的详细信息反馈给客户",40);

        //创建问题
        Question question3 = new Question("3.2.3","是否实现对物流信息的简单跟踪？", Level.FIRST_LEVEL);
        question3.add(answer11).add(answer12).add(answer13).add(answer14);
        answer11.setQuestion(question3);
        answer12.setQuestion(question3);
        answer13.setQuestion(question3);
        answer14.setQuestion(question3);
        TradeLabel tradeLabel = new TradeLabel("B","运输管理");
        tradeLabel.add(question1).add(question2).add(question3);
        SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere2.and("name","物流");
        Trade trade = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere2);
        trade.add(tradeLabel);
        tradeLabel.setTrade(trade);
        question1.setTradeLabel(tradeLabel);
        question2.setTradeLabel(tradeLabel);
        question3.setTradeLabel(tradeLabel);
        question1.setTrade(trade);
        question2.setTrade(trade);
        question3.setTrade(trade);
        SimpleJPABuilderPkg.builder().update(answer1,answer2,answer3,answer4,answer5,answer6,answer7,answer8,
               answer11,answer12,answer13,answer14,question1,question2,question3,tradeLabel,trade);

    }
    /**
     * 运输管理 规范级题目插入
     */
    @Test
    public void  test4(){
        SqlWhereWithParamTools sqlWhere1 = SqlWhereWithParamTools.create(TradeLabel.class);
        sqlWhere1.and("name","运输管理");
        TradeLabel tradeLabel = SimpleJPABuilderPkg.builder(TradeLabel.class).findFirstEntity(sqlWhere1);
        SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere2.and("name","物流");
        Trade trade = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere2);
        System.out.println(tradeLabel);
        System.out.println(trade);
        //创建答案
        Answer answer1 = new Answer("A","未使用信息系统管理物流运输订单",10);
        Answer answer2 = new Answer("B","系统具有自动导入订单的功能",20);
        Answer answer3 = new Answer("C","系统具有自动导入订单与纠错、订单审核、订单打印、订单跟踪等功能",30);
        Answer answer4 = new Answer("D","系统具有自动导入订单与纠错、订单审核、订单打印、订单跟踪、订单结算等功能",40);
        Answer answer5 = new Answer("A","无相应的信息系统",10);
        Answer answer6 = new Answer("B","通过信息系统实现运输计划管理",20);
        Answer answer7 = new Answer("C","通过信息系统自动生成运输计划，人工进行调度并通过系统打印调度派车单",30);
        Answer answer8 = new Answer("D","通过信息系统自动生成运输计划，自动进行调度",40);
        Answer answer9 = new Answer("A","未实现",10);
        Answer answer10 = new Answer("B","通过电话、短信等方式反馈关键节点物流信息",20);
        Answer answer11= new Answer("C","通过电话、短信等方式反馈关键节点物流信息，并录入系统",30);
        Answer answer12 = new Answer("D","系统具有管理人员录入的关键节点的跟踪信息，客户可查询",40);
        Answer answer13 = new Answer("A","无相应的信息系统",10);
        Answer answer14 = new Answer("B","通过信息系统对部分运力资源进行管理",20);
        Answer answer15= new Answer("C","通过信息系统对大部分运力资源进行管理",30);
        Answer answer16 = new Answer("D","通过信息系统对所有运力资源进行管理",40);
        //创建问题
        Question question1 = new Question("3.2.4","是否具有工艺设计规范和标准，可指导计算机辅助工艺规划及工艺设计？", Level.SECOND_LEVEL);
        Question question2 = new Question("3.2.5","是否具有工艺设计文件或数据的管理机制，可满足查阅/执行/记录的要求？",Level.SECOND_LEVEL);
        Question question3 = new Question("3.2.6","基于自定义的仿真模型进行工艺设计仿真优化的范围",Level.SECOND_LEVEL);
        Question question4 = new Question("3.2.7","工艺设计与工装设计、工具设计等内部协同的应用情况",Level.SECOND_LEVEL);
        question1.add(answer1).add(answer2).add(answer3).add(answer4);
        question2.add(answer5).add(answer6).add(answer7).add(answer8);
        question3.add(answer9).add(answer10).add(answer11).add(answer12);
        question4.add(answer13).add(answer14).add(answer15).add(answer16);
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
        answer13.setQuestion(question4);
        answer14.setQuestion(question4);
        answer15.setQuestion(question4);
        answer16.setQuestion(question4);
        tradeLabel.add(question1).add(question2).add(question3).add(question4);
        trade.add(tradeLabel);
        tradeLabel.setTrade(trade);
        question1.setTradeLabel(tradeLabel);
        question2.setTradeLabel(tradeLabel);
        question3.setTradeLabel(tradeLabel);
        question4.setTradeLabel(tradeLabel);
        question1.setTrade(trade);
        question2.setTrade(trade);
        question3.setTrade(trade);
        question4.setTrade(trade);
        SimpleJPABuilderPkg.builder().update(answer1,answer2,answer3,answer4,answer5,answer6,
                answer7,answer8,answer9,answer10,answer11,answer12,answer13,answer14,answer15,answer16,
                question1,question2,question3,question4,tradeLabel,trade);
    }
    @Test
    public void ztest(){
        test1();
        test2();
        test3();
        test4();
    }
}
