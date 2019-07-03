package addons.nsneo.service;

import addons.common.utils.SimpleJPABuilderPkg;
import addons.common.web.springController.ControllerReturnJson;
import addons.nsneo.entity.*;
import addons.nsneo.pub.*;
import com.nsneo.utils.container.Pair;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import org.springframework.data.annotation.Persistent;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
@Service
public class QuestionService {
    @PersistenceContext
    private EntityManager entityManager;


    /**
     * 根据问卷id,得到每一个级别 的行业子标签的平均分
     * 已规划级	仓储与配送	0.43
     * 已规划级	运输管理	0.50
     * 规范级	仓储与配送	0.93
     * 规范级	运输管理	0.32
     */
    public List<EndQuestionaireBean.TradeScoreBean> getTradelabelScore(String questionaireid){
        String sql = "select lev, TNAME,Round(AVG(SCORE),2) as AVGS from (select lev,TNAME,SCORE from(select lev,TNAME,SCORE from(select t8.AID AS AID,t8.lel as lev,NAME as TNAME from tb_tradeLabel,(select t7.AID,TRADELABEL_ID,t7.lev as lel from tb_question,(select t11.AID,QUESTION_ID,t11.lev as lev from tb_question_tb_answer,(select t5.ANSWER_ID AS AID,t6.`LEVEL` As lev from tb_question t6,(select ANSWER_ID,QUESTION_ID from (select items_ID from (select ID from tb_answerSheet where NAME='"+questionaireid+"') t1 ,tb_answerSheet_tb_answerItem t2 where t1.ID=t2.AnswerSheet_ID) t3, tb_answerItem t4 where t3.items_ID=t4.ID) t5 where t5.QUESTION_ID=t6.ID) t11 where tb_question_tb_answer.answers_ID=AID) t7 where tb_question.ID=t7.QUESTION_ID) t8 where tb_tradeLabel.ID=t8.TRADELABEL_ID) t13,tb_answer where t13.AID=tb_answer.ID)t14,(select NAME from tb_tradeLabel)t15 where t14.TNAME=t15.`NAME`)t16 group by lev,TNAME";
        Query nativeQuery = entityManager.createNativeQuery(sql);
        List<EndQuestionaireBean.TradeScoreBean> tradeScoreBeanList=new ArrayList<>();
        List <Object>resultList = nativeQuery.getResultList();
        System.out.println(resultList.size());
        for(Object s:resultList){
            Object []cells = (Object[]) s;
            System.out.println("level-->"+cells[0]);
            System.out.println("TNAME-->"+cells[1]);
            System.out.println("avgScore-->"+cells[2]);
            EndQuestionaireBean.TradeScoreBean tradeScoreBean = new EndQuestionaireBean.TradeScoreBean((String)cells[0],(String)cells[1],(double)cells[2]);
            tradeScoreBeanList.add(tradeScoreBean);
        }
        return tradeScoreBeanList;
    }

    /**
     * 根据级别得到某一级别下的行业子标签及其平均分
     *
     * **/
    public List<TradeTempBean> getlabelNameAndScoreByLevel(String quesid,String level){
        List<EndQuestionaireBean.TradeScoreBean> tradeScoreBeanList=getTradelabelScore(quesid);
        List<TradeTempBean> tradeTempBeans = new ArrayList<>();
        for(EndQuestionaireBean.TradeScoreBean tradeScoreBean:tradeScoreBeanList){
            if(tradeScoreBean.getLevel().equals(level)){
                TradeTempBean tradeTempBean = new TradeTempBean(tradeScoreBean.getTradeName(),tradeScoreBean.getAvgScore());
                tradeTempBeans.add(tradeTempBean);
            }
        }
        return tradeTempBeans;
    }


    /**
     * 根据级别和用户所选的行业数组获取问卷
     * @param level  级别 如已规划级
     * @param trades  行业数组  如用户多选为 生产和设计
     * @return
     *
     */
    public  QuestionaireBean  getQuestionaireBean(String level,String questionaireid,String[]trades){
        boolean findselected = false;
        if (questionaireid!=null && questionaireid.equals("") == false ){
            findselected = true;//需要查之前选择的选项
        }

        List<QuestionaireBean.classifyBean> classifyBeans = new ArrayList<QuestionaireBean.classifyBean>();
        for(String trade:trades){
            //根据行业名称得到行业子标签名称
            System.out.println(trade+"trade==========");
            SqlWhereWithParamTools sqlWhere1 = SqlWhereWithParamTools.create(Trade.class);
            sqlWhere1.and("name",trade);
            Trade trade1 = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere1);
            if (trade1==null) System.out.println("trad1  null=========");
            System.out.println(trade1.getName());
            List<TradeLabel> labels = trade1.getLabels();
            System.out.println("labels"+labels.size());
            List<QuestionaireBean.labelBean> labelBeans = new ArrayList<>();
            for(TradeLabel label:labels){
                String labelName = label.getName();
                System.out.println(labelName);
                SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Question.class);
                sqlWhere2.and("tradeLabel.name",labelName);
                sqlWhere2.and("level",level);
                // TODO: 2019/5/9   得到题目状态为0
                sqlWhere2.and("status",0);
                List<Question> questions = SimpleJPABuilderPkg.builder(Question.class).findEntitys(sqlWhere2);
                List<QuestionaireBean.questionBean> questionBeans = new ArrayList<>();
                System.out.println("QQQQQQQsize"+questions.size());
                for(Question q:questions){
                    String optionSelected = "0";
                    System.out.println("QQQQQQQQQQ"+trade1.getName()+label.getName()+q.getNumber()+"--"+q.getDescription());
                    List<Answer> answers = q.getAnswers();
                    List<QuestionaireBean.optionBean> optionBeans = new ArrayList<QuestionaireBean.optionBean>();//封装QuestionaireBean.optionBean
                    for(Answer answer:answers){
                        System.out.println(answer.getNumber()+"--"+answer.getName());
                        //封装 QuestionaireBean.optionBean
                        QuestionaireBean.optionBean optionBean = new QuestionaireBean.optionBean(answer.getNumber(),answer.getName());
                        optionBean.setScore(answer.getScore());
                        optionBeans.add(optionBean);
                    }
                    //封装QuestionaireBean.questionBean
                    // 通过题目id查询他之前选的选项
                    if (findselected){
                        System.out.println(questionaireid+"====="+q.getNumber()+"======");
//                        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create();
                        String sqlToFindSelected = "select NUMBER from tb_question t6,(select QUESTION_ID from (select items_ID " +
                                "from (select ID from tb_answerSheet where NAME='"+questionaireid+"') t1 ,tb_answerSheet_tb_answerItem t2 " +
                                "where t1.ID=t2.AnswerSheet_ID) t3, tb_answerItem t4 where t3.items_ID=t4.ID) t5 where t5.QUESTION_ID=t6.ID";
//                        String sqlToFindOptionSelected = "select NUMBER from tb_answer t8,(select t5.ANSWER_ID from tb_question t6,(select ANSWER_ID,QUESTION_ID from (select items_ID from (select ID from tb_answerSheet where NAME='100005_1557370742249_1_2_1') t1 ,tb_answerSheet_tb_answerItem t2 where t1.ID=t2.AnswerSheet_ID) t3, tb_answerItem t4 where t3.items_ID=t4.ID) t5 where number='1.1.3' and t5.QUESTION_ID=t6.ID) t7 where t7.ANSWER_ID=t8.ID";
                        String sqlToFindOptionSelected = "select NUMBER from tb_answer t8,(select t5.ANSWER_ID from tb_question t6,(select ANSWER_ID,QUESTION_ID from (select items_ID " +
                                "from (select ID from tb_answerSheet where NAME='"+questionaireid+"') t1 ,tb_answerSheet_tb_answerItem t2 " +
                                "where t1.ID=t2.AnswerSheet_ID) t3, tb_answerItem t4 where t3.items_ID=t4.ID) t5 where number='"+q.getNumber()+"' and t5.QUESTION_ID=t6.ID) t7 where t7.ANSWER_ID=t8.ID";
////
//                        String query = sqlWhere.createQuerySql();
//                        String sqlToFindOptionSelected = "select NUMBER from tb_answer t4,(select ANSWER_ID from tb_answerItem t2,(select ID from tb_question where NUMBER='"+q.getNumber()+"') t1 where t1.ID=t2.QUESTION_ID) t3 where t3.ANSWER_ID=t4.ID";
                        Query nativeQuerySelected = entityManager.createNativeQuery(sqlToFindSelected);
                        Query nativeQueryOptionSelected = entityManager.createNativeQuery(sqlToFindOptionSelected);
                        List<String> resultList = nativeQuerySelected.getResultList();
                        if (resultList.contains(q.getNumber())){
                            optionSelected = (String)nativeQueryOptionSelected.getSingleResult();
                            System.out.println(optionSelected);
                        }

                    }

                    QuestionaireBean.questionBean questionBean = new QuestionaireBean.questionBean(q.getNumber(),q.getDescription(),optionSelected,optionBeans.toArray(new QuestionaireBean.optionBean[optionBeans.size()]));
                    questionBeans.add(questionBean);
                }
                System.out.println("kkkkkkkkkkkkkkkkk"+ControllerReturnJson.builder().setDatas(questionBeans).toJson());
                //  封装QuestionaireBean.labelBean
                QuestionaireBean.labelBean labelBean = new QuestionaireBean.labelBean(labelName,questionBeans.toArray(new QuestionaireBean.questionBean[questionBeans.size()]));
                labelBeans.add(labelBean);
            }
            //封装QuestionaireBean.classifyBean
            QuestionaireBean.classifyBean classifyBean = new QuestionaireBean.classifyBean(trade,labelBeans.toArray(new QuestionaireBean.labelBean[labelBeans.size()]));
            classifyBeans.add(classifyBean);
        }
        //构造最终的QuestionaireBean
        QuestionaireBean questionaireBean = new QuestionaireBean(level,classifyBeans.toArray(new QuestionaireBean.classifyBean[classifyBeans.size()]));
        System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$================================================================");
       // System.out.println(questionaireBean);


        return questionaireBean;

    }
    /**
     * 根据当前级别获得用户的下一级别
     */
    public String getNextLevel(String currLevel){
        String nextLevel = "";
        switch (currLevel){
            case Level.FIRST_LEVEL:
               nextLevel = Level.SECOND_LEVEL;
               break;
            case Level.SECOND_LEVEL:
               nextLevel = Level.THIRD_LEVEL;
               break;
            case Level.THIRD_LEVEL:
               nextLevel = Level.FOURTH_LEVEL;
               break;
            case Level.FOURTH_LEVEL:
               nextLevel = Level.FIFTH_LEVEL;
               break;
               default:
                   nextLevel="您已达到最后一个级别";
        }
        return nextLevel;

    }

    /**
     * 根据答卷id得到答卷并计算总分
     */
    public  double getTotalScore(String questionaireid){
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(AnswerSheet.class);
        sqlWhere.and("name",questionaireid);
        AnswerSheet answerSheet = SimpleJPABuilderPkg.builder(AnswerSheet.class).findFirstEntity(sqlWhere);
       double totalScore = answerSheet.getTotalScore();
        String s = String.format("%.2f",totalScore);
        double d = Double.valueOf(s);
        return d;
    }
    /**
     * 根据答卷id得到答卷并计算平均分
     */
    public  double getAverageScore(String questionaireid){
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(AnswerSheet.class);
        sqlWhere.and("name",questionaireid);
        AnswerSheet answerSheet = SimpleJPABuilderPkg.builder(AnswerSheet.class).findFirstEntity(sqlWhere);
        int count = answerSheet.getItems().size();
        System.out.println("answerSheet共"+count+"条记录");
        double averageScore = answerSheet.getTotalScore()/count;
        String s = String.format("%.2f",averageScore);
        double d = Double.valueOf(s);
        return d;
    }
    /**
     * 根据平均分区间范围评定等级
     *//*
    public String  getRank(double averageScore){
       *//* if(50<=averageScore && averageScore<60){
            return Level.FIFTH_LEVEL;
        }
        else if(50<=averageScore && averageScore<60){
            return Level.FOURTH_LEVEL;
        }
        else if(50<=averageScore && averageScore<60){
            return Level.THIRD_LEVEL;
        }
        else if(20<=averageScore && averageScore<25){
            return Level.SECOND_LEVEL;
        }*//*
       //新添加
        if(1.8<=averageScore && averageScore<2.8){
            return Level.SECOND_LEVEL;
        }else if(2.8<=averageScore && averageScore<3.8){
            return Level.THIRD_LEVEL;
        }else if(3.8<=averageScore && averageScore<4.8){
            return Level.FOURTH_LEVEL;
        }else if(4.8<=averageScore && averageScore<5){
            return Level.FIFTH_LEVEL;
        }
        return Level.FIRST_LEVEL;
    }*/

    /**
     * 根据平均分区间范围评定等级
     */
    public String  getRank(double averageScore){
        if(0.8<=averageScore && averageScore<1.8){
            return Level.FIRST_LEVEL;
        }
        else if(1.8<=averageScore && averageScore<2.8){
            return Level.SECOND_LEVEL;
        }else if(2.8<=averageScore && averageScore<3.8){
            return Level.THIRD_LEVEL;
        }else if(3.8<=averageScore && averageScore<4.8){
            return Level.FOURTH_LEVEL;
        }else if(4.8<=averageScore && averageScore<5){
            return Level.FIFTH_LEVEL;
        }
        return "无";
    }

    /**
     * 根据答卷id得到答卷
     */
    public  AnswerSheet getAnswerSheet(String questionaireid){
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(AnswerSheet.class);
        sqlWhere.and("name",questionaireid);
        AnswerSheet answerSheet = SimpleJPABuilderPkg.builder(AnswerSheet.class).findFirstEntity(sqlWhere);
        return answerSheet;
    }

    /**
     *根据级别得到字符串 已规划级 _1, 规范级_2
     */
    public String getStringLevel(String level){
        switch (level){
            case Level.FIRST_LEVEL:
                return "_1";
            case Level.SECOND_LEVEL:
                return "_2";
            case Level.THIRD_LEVEL:
                return "_3";
            case Level.FOURTH_LEVEL:
                return "_4";
            case Level.FIFTH_LEVEL:
                return "_5";
        }
        return ControllerReturnJson.builder().setStatusMsg("级别错误").toJson();
    }
    //根据行业数组得到行业字符串, 比如 设计_1,生产_2,物流_3
    //行业数组["设计","生产"] 得到 _1_2
    public String getStringTrade(String[]tradeArr){
        String tradeStr = "";
        for(String s:tradeArr){
            switch (s){
                case "人员":
                    tradeStr+="_1";
                    break;
                case "技术":
                    tradeStr+="_2";
                    break;
                case "资源":
                    tradeStr+="_3";
                    break;
                case "设计":
                    tradeStr+="_4";
                    break;
                case "生产":
                    tradeStr+="_5";
                    break;
                case "物流":
                    tradeStr+="_6";
                    break;
                case "销售":
                    tradeStr+="_7";
                    break;
                case "服务":
                    tradeStr+="_8";
                    break;

            }
        }
        return tradeStr;
    }
    /**
     * 根据答卷id,得到用户的行业数组 如 100002_1557403495830_1_1_2
     */
    public String[] getTradeArr(String questionaireid){

        String[] splitTrade = questionaireid.split("_");
        String []tradeArrNum=new String[splitTrade.length-3];
        for(int i=3;i<splitTrade.length;i++){
            tradeArrNum[i-3]=splitTrade[i];
        }
        List<String> list = new ArrayList<>();
        for(String s:tradeArrNum){
            System.out.println(s);
            if(s.equals("1")){
                list.add("人员");
            }else if(s.equals("2")){
                list.add("技术");
            }else if(s.equals("3")){
                list.add("资源");
            }else if(s.equals("4")){
                list.add("设计");
            } else if(s.equals("5")){
                list.add("生产");
            }else if(s.equals("6")){
                list.add("物流");
            }else if(s.equals("7")){
                list.add("销售");
            }else if(s.equals("8")){
                list.add("服务");
            }
        }
        //把list转化成数组
        String[] tradeArr = list.toArray(new String[list.size()]);
        for(String s:tradeArr){
            System.out.println(s);
        }
        return tradeArr;
    }


    /**
     * 根据问卷id得到用户最后一个级别和对应的分数
     */
    public EndLevelAndScoreBean getRankAndScoreByQuestionId(String questionaireid){
        int count1=0;
        int count2=0;
        int count3=0;
        int count4=0;
        int count5=0;
        //根据答卷id得到答卷
        AnswerSheet answerSheet = getAnswerSheet(questionaireid);
        //五种级别对应的得分
        Pair<String,Double> firstPair = new Pair<>();
        firstPair.setHeadKey(Level.FIRST_LEVEL);
        firstPair.setBodyKey(0.0);
        Pair<String,Double> secondPair = new Pair<>();
        secondPair.setHeadKey(Level.SECOND_LEVEL);
        secondPair.setBodyKey(0.0);
        Pair<String,Double> thirdPair = new Pair<>();
        thirdPair.setHeadKey(Level.THIRD_LEVEL);
        thirdPair.setBodyKey(0.0);
        Pair<String,Double> fourPair = new Pair<>();
        fourPair.setHeadKey(Level.FOURTH_LEVEL);
        fourPair.setBodyKey(0.0);
        Pair<String,Double> fifthPair = new Pair<>();
        fifthPair.setHeadKey(Level.FIFTH_LEVEL);
        fifthPair.setBodyKey(0.0);
        String level = "";
        for(AnswerItem answerItem:answerSheet.getItems()){
            //得到每道题目和对应的答案
            Question question = answerItem.getQuestion();
            Answer answer = answerItem.getAnswer();
            System.out.println("问题是"+question);
            System.out.println("答案是"+answer);
            //得到每道题目的级别
            //根据不同的级别,更新对应级别的总分
            level = question.getLevel();
            if(level.equals(firstPair.getHeadKey())){
                firstPair.setBodyKey(firstPair.getBodyKey()+answer.getScore());
                count1=count1+1;
            }
            else if(level.equals(secondPair.getHeadKey())){
                secondPair.setBodyKey(secondPair.getBodyKey()+answer.getScore());
                count2=count2+1;
            }
            else if(level.equals(thirdPair.getHeadKey())){
                thirdPair.setBodyKey(thirdPair.getBodyKey()+answer.getScore());
                count3=count3+1;
            }
            else if(level.equals(fourPair.getHeadKey())){
                fourPair.setBodyKey(fourPair.getBodyKey()+answer.getScore());
                count4=count4+1;
            }
            else if(level.equals(fifthPair.getHeadKey())){
                fifthPair.setBodyKey(fifthPair.getBodyKey()+answer.getScore());
                count5=count5+1;
            }

        }
        //求每个级别的平均分,保存两位小数
        String s1 = String.format("%.2f",firstPair.getBodyKey()/count1);
        double firs = Double.valueOf(s1);
        firstPair.setBodyKey(firs);
        if(count2!=0) {
            String s2 = String.format("%.2f", secondPair.getBodyKey() / count2);
            double sec = Double.valueOf(s2);
            secondPair.setBodyKey(sec);
        }
        if(count3!=0) {
            String s3 = String.format("%.2f", thirdPair.getBodyKey() / count3);
            double third = Double.valueOf(s3);
            thirdPair.setBodyKey(third);
        }
        if(count4!=0) {
            String s4 = String.format("%.2f", fourPair.getBodyKey() / count4);
            double four = Double.valueOf(s4);
            fourPair.setBodyKey(four);
        }
        if(count5!=0) {
            String s5 = String.format("%.2f", fifthPair.getBodyKey() / count5);
            double fif = Double.valueOf(s5);
            fifthPair.setBodyKey(fif);
        }
        //2级 平均分1开头, 3级2开头
        if(secondPair.getBodyKey()>0){
            secondPair.setBodyKey(secondPair.getBodyKey()+1.0);
        }
        if(thirdPair.getBodyKey()>0){
            thirdPair.setBodyKey(thirdPair.getBodyKey()+2.0);
        }
        if(fourPair.getBodyKey()>0){
            fourPair.setBodyKey(fourPair.getBodyKey()+3.0);
        }
        if(fifthPair.getBodyKey()>0){
            fifthPair.setBodyKey(fifthPair.getBodyKey()+4.0);
        }

        //得到这张试卷最后的级别和对应的分数
        if(fifthPair.getBodyKey()>0){
            return new EndLevelAndScoreBean(fifthPair.getHeadKey(),fifthPair.getBodyKey());
        }
        if(fourPair.getBodyKey()>0){
            return new EndLevelAndScoreBean(fourPair.getHeadKey(),fourPair.getBodyKey());
        }
        if(thirdPair.getBodyKey()>0){
            return new EndLevelAndScoreBean(thirdPair.getHeadKey(),thirdPair.getBodyKey());
        }
        if(secondPair.getBodyKey()>0){
            return new EndLevelAndScoreBean(secondPair.getHeadKey(),secondPair.getBodyKey());
        }
        return new EndLevelAndScoreBean(firstPair.getHeadKey(),firstPair.getBodyKey());
    }
}
