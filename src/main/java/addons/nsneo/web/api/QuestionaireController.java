package addons.nsneo.web.api;

import addons.common.utils.SimpleJPABuilderPkg;
import addons.common.web.springController.ControllerReturnJson;
import addons.common.web.springController.SpringControllerBase;
import addons.nsneo.entity.*;
import addons.nsneo.pub.*;
import addons.nsneo.service.QuestionService;
import com.nsneo.utils.container.Pair;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.criteria.CriteriaBuilder;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/api/questionaire")
public class QuestionaireController extends SpringControllerBase {
    @Autowired
    private QuestionService questionService;

    /**
     * 请求问卷
     * {
     * 		"level":"已规划级",
     * 		"tradeArr":[
     * 			"生产","设计"
     * 		]
     *                }
     * 每次get请求我都会检查是否传过来一个questionaireid,如果没有,就创建, 有的话就返回此答卷id对应的答卷,
     *      *  save的时候再保存答卷
     */
    @RequestMapping(value = "/get",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String get(@RequestBody AskQuestionaireBean askQuestionaireBean,HttpServletRequest request){
        System.out.println("进入请求问卷方法,请求参数如下");
        System.out.println(askQuestionaireBean);
        //1.从请求中得到级别
        String level = askQuestionaireBean.getLevel();
        //2.从请求中得到行业数组
        String []tradeArr = askQuestionaireBean.getTradeArr();
        //3.从请求中得到答卷id
        String questionaireid = askQuestionaireBean.getQuestionaireid();
        if(questionaireid==null){ //请求中没有问卷id,那么生成一个问卷id
            questionaireid = CommonUtil.getEnterpriseIdByToken(request.getHeader("token"))+"_"+System.currentTimeMillis()+questionService.getStringLevel(level)+questionService.getStringTrade(tradeArr);
            System.out.println("生成的问卷id为"+questionaireid);
        }
        //System.out.println("questionaireid========"+questionaireid);

        QuestionaireBean questionaireBean = questionService.getQuestionaireBean(level,questionaireid,tradeArr);
        //String s = ControllerReturnJson.builder().setDatas(questionaireBean).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();//请求成功
        //System.out.println(s);
        Pair<String,QuestionaireBean>pair = new Pair<>();
        pair.setHeadKey(questionaireid);
        pair.setBodyKey(questionaireBean);

        return ControllerReturnJson.builder().setDatas(pair).setStatusMsg("请求问卷成功").toJson();
    }

    /**
     * 保存问卷
     * {
     * 		"level":"已规划级",
     * 		"answer":	[
     *                  {"questionid":"4.1.3","option":"A"},
     *                  {"questionid":"4.1.4","option":"B"}
     *
     * 					]
     * 	}
     */
    @RequestMapping(value = "/save",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String save(@RequestBody SaveRequestBean saveRequestBean,HttpServletRequest request){
        System.out.println("请求发来的saveRequestBean"+saveRequestBean);
      /* if(saveRequestBean.getQuestionaireid()==null){
           System.out.println("没有传id");
       }*/
        //将用户发送来的题目和选的答案存放在一条AnswerItem中
        if(saveRequestBean==null){
            ControllerReturnJson.builderFail("错误").setStatusMsg("您未答题").setStatusCode("104").toJson();
        }
        List<AnswerItem> answerItems = new ArrayList<AnswerItem>();
        SaveRequestBean.QuestionAnswerBean [] questionAnswerBeans = saveRequestBean.getQuestionAnswerBeans(); //1.1.3 A
        for(SaveRequestBean.QuestionAnswerBean questionAnswerBean:questionAnswerBeans){
            AnswerItem answerItem = new AnswerItem();
            SqlWhereWithParamTools sqlWhere1 = SqlWhereWithParamTools.create(Question.class);
            sqlWhere1.and("number",questionAnswerBean.getQuestionid());
            Question question = SimpleJPABuilderPkg.builder(Question.class).findFirstEntity(sqlWhere1);

            SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Answer.class);
            sqlWhere2.and("question.number",questionAnswerBean.getQuestionid());
            sqlWhere2.and("number",questionAnswerBean.getOption());
            Answer answer = SimpleJPABuilderPkg.builder(Answer.class).findFirstEntity(sqlWhere2);
            System.out.println(question);
            System.out.println(answer);
            answerItem.setQuestion(question);
            answerItem.setAnswer(answer);
            SimpleJPABuilderPkg.builder().update(answerItem);
            answerItems.add(answerItem);

        }
        //得到请求发送来的级别
        String currentLevel = saveRequestBean.getLevel();
        //得到请求的下一个级别
        String nextLevel = questionService.getNextLevel(currentLevel);
        //得到请求要保存的问卷id
        String questionaireid = saveRequestBean.getQuestionaireid();

        //根据问卷id查库,查找对应的问卷id,如果问卷id不存在,那么就创建一个新问卷
        SqlWhereWithParamTools sqlWhereByAsId = SqlWhereWithParamTools.create(AnswerSheet.class);
        sqlWhereByAsId.and("name",questionaireid);
        AnswerSheet answerSheet = SimpleJPABuilderPkg.builder(AnswerSheet.class).findFirstEntity(sqlWhereByAsId);
        if(answerSheet==null){//问卷id不存在,创建新问卷
            answerSheet = new AnswerSheet(questionaireid);
            answerSheet.setItems(answerItems);
            int count = answerItems.size();
            //得分
            double score = answerSheet.getTotalScore()/count;
            //等级
            String rank = answerSheet.getRank(score);
            answerSheet.setScore(score);
            answerSheet.setRank(rank);
            //根据token解析出企业信用代码,查找到该企业
            String enterpriseNumber = CommonUtil.getEnterpriseIdByToken(request.getHeader("token"));
            System.out.println("根据token得到的企业id为"+enterpriseNumber);
            SqlWhereWithParamTools sqlWhere12 = SqlWhereWithParamTools.create(Company.class);
            sqlWhere12.and("enterprise_number",enterpriseNumber);
            Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere12);
            //企业和问卷相互绑定
            System.out.println(company);
            company.addAnswerSheet(answerSheet);
            answerSheet.setUser(company);
            SimpleJPABuilderPkg.builder().update(answerSheet,company);
        }
        else{    //问卷id存在,说明用户以前保存过,
            System.out.println("不是第一次保存问卷了,用户做过问卷");
            //不是第一次保存答卷,就更新答卷内容
          /*  for(AnswerItem answerItem:answerItems){
                answerSheet.add(answerItem);
            }*/

//            for (int i=0;i<answerItems.size();i++){
//                String newNumber = answerItems.get(i).getQuestion().getNumber();
//                for (int j=0;j<historyItems.size();j++){
//                    if (newNumber == historyItems.get(j).getQuestion().getNumber()){
//                        historyItems.remove(j);
//                        historyItems.add(answerItems.get(i));
//                        break;
//                    }
//                }
//            }
            List<AnswerItem> historyItems = answerSheet.getItems();
            List<String> historyNumber = new ArrayList<String>();
            List<String> newNumber = new ArrayList<String>();
            for (int i=0;i<historyItems.size();i++){
                String questionnumber  = historyItems.get(i).getQuestion().getNumber();//"1.1.1"
                historyNumber.add(questionnumber);// index   1.1.1
            }
            for (int i=0;i<answerItems.size();i++){
                String questionnumber  = answerItems.get(i).getQuestion().getNumber();//"1.1.1"
                newNumber.add(questionnumber);// index   1.1.1  or 2.1.1
            }
            Boolean tag = false;//false 添加  true 修改
            for (String s:newNumber){
                if (historyNumber.contains(s)){
                    tag=true;
                    break;
                }
            }
            if (tag==true){//这里有个问题,比如用户做了已规划级和规范级的题目,当修改已规划级的题目时,规范级原先做过的就都没了.
               // answerSheet.setItems(answerItems);
                //说明这里要修改了, historyItems原先的items,answeritems是新的items
                //1.遍历旧的items,找到和新的items中题号一样的,然后根据新的items中的值修改旧的items,设置旧的items
                //遍历旧的答卷,找到要更新的items
                for(AnswerItem answerItem:historyItems){
                    for(int i=0;i<newNumber.size();i++){
                        if(answerItem.getQuestion().getNumber().equals(newNumber.get(i))){
                            AnswerItem answerItemnew = answerItems.get(i);
                            answerItem.setAnswer(answerItemnew.getAnswer());
                            SimpleJPABuilderPkg.builder().update(answerItem);
                        }
                    }
                }

            }else {
                for(AnswerItem answerItem:answerItems){
                    answerSheet.add(answerItem);
                }

            }

            // TODO: 2019/5/9  原来是把当前级别做过的题覆盖掉原来做过的题
//          answerSheet.setItems(answerItems);
            int count = answerItems.size();
            //得分
            double score = answerSheet.getTotalScore()/count;
            //等级
            String rank = answerSheet.getRank(score);
            answerSheet.setScore(score);
            answerSheet.setRank(rank);
            //根据token解析出企业信用代码,查找到该企业
            String enterpriseNumber = CommonUtil.getEnterpriseIdByToken(request.getHeader("token"));
            SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Company.class);
            sqlWhere2.and("enterprise_number",enterpriseNumber);
            Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere2);
            //企业和问卷相互绑定
            // 注释company.addAnswerSheet(answerSheet);
            answerSheet.setUser(company);
            SimpleJPABuilderPkg.builder().update(answerSheet,company);
        }

        return ControllerReturnJson.builder().setDatas(new String[]{questionaireid,currentLevel,nextLevel}).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();

    }

    /**
     * 结束填报
     * @param questionaireid
     * @return
     */
    /*@RequestMapping(value = "/end2",produces = {"application/json;charset=utf-8"},method = RequestMethod.GET)
    public String end(@RequestParam String questionaireid){
        System.out.println("请求发来的questionaireid"+questionaireid);
       //根据questionaireid得到答卷,计算总的得分
        double totalScore = questionService.getTotalScore(questionaireid);
        //计算平均分
        double avgScore = questionService.getAverageScore(questionaireid);

        System.out.println("总分"+totalScore);
        System.out.println("平均分"+avgScore);
        //得到智能化级别
        String rank = questionService.getRank(avgScore);
        System.out.println("智能化级别"+rank);
        //根据答卷id得到答卷
        AnswerSheet answerSheet = questionService.getAnswerSheet(questionaireid);
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
            }
            else if(level.equals(secondPair.getHeadKey())){
                secondPair.setBodyKey(secondPair.getBodyKey()+answer.getScore());
            }
            else if(level.equals(thirdPair.getHeadKey())){
                thirdPair.setBodyKey(thirdPair.getBodyKey()+answer.getScore());
            }
            else if(level.equals(fourPair.getHeadKey())){
                fourPair.setBodyKey(fourPair.getBodyKey()+answer.getScore());
            }
            else if(level.equals(fifthPair.getHeadKey())){
                fifthPair.setBodyKey(fifthPair.getBodyKey()+answer.getScore());
            }

        }
        secondPair.setBodyKey(secondPair.getBodyKey());
        thirdPair.setBodyKey(thirdPair.getBodyKey());
        fourPair.setBodyKey(fourPair.getBodyKey());
        fifthPair.setBodyKey(fifthPair.getBodyKey());
        //封装返回后的EndQuestionaireBean
        List<Pair<String,Double>> pairs = new ArrayList<>();
        pairs.add(firstPair);
        pairs.add(secondPair);
        pairs.add(thirdPair);
        pairs.add(fourPair);
        pairs.add(fifthPair);
        List<EndQuestionaireBean.LevelScoreBean> levelScoreBeans = new ArrayList<>();
        for(Pair<String,Double> pair:pairs){
            String levelName = pair.getHeadKey();
            double score = pair.getBodyKey();
            String s = String.format("%.2f",score);
            double d = Double.valueOf(s);
            //EndQuestionaireBean.LevelScoreBean levelScoreBean = new EndQuestionaireBean.LevelScoreBean(levelName,d);
            EndQuestionaireBean.LevelScoreBean levelScoreBean = new EndQuestionaireBean.LevelScoreBean();
            levelScoreBeans.add(levelScoreBean);
        }
        EndQuestionaireBean endQuestionaireBean = new EndQuestionaireBean(totalScore,rank,levelScoreBeans.toArray(new EndQuestionaireBean.LevelScoreBean[levelScoreBeans.size()]));



        System.out.println(firstPair.getHeadKey()+"===级别得分为==="+firstPair.getBodyKey());
        System.out.println(secondPair.getHeadKey()+"===级别得分为==="+secondPair.getBodyKey());
        System.out.println(thirdPair.getHeadKey()+"=======级别得分===="+thirdPair.getBodyKey());
        System.out.println(fourPair.getHeadKey()+"=======级别得分===="+fourPair.getBodyKey());
        System.out.println(fifthPair.getHeadKey()+"=======级别得分===="+fifthPair.getBodyKey());

        //System.out.println("级别level为"+level+"得分为"+answerSheet.getTotalScore());
        return ControllerReturnJson.builder().setDatas(endQuestionaireBean).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();

    }*/
    /**
     * 结束填报
     * @param questionaireid
     * @return
     */
    @RequestMapping(value = "/end",produces = {"application/json;charset=utf-8"},method = RequestMethod.GET)
    public String end2(@RequestParam String questionaireid){
        System.out.println("请求发来的questionaireid"+questionaireid);
       //根据questionaireid得到答卷,计算总的得分
        double totalScore = questionService.getTotalScore(questionaireid);
        //计算平均分
        double avgScore = questionService.getAverageScore(questionaireid);
        int count1=0;
        int count2=0;
        int count3=0;
        int count4=0;
        int count5=0;
        System.out.println("总分"+totalScore);
        System.out.println("平均分"+avgScore);
        //得到智能化级别
        String rank = questionService.getRank(avgScore);
        System.out.println("智能化级别"+rank);
        //根据答卷id得到答卷
        AnswerSheet answerSheet = questionService.getAnswerSheet(questionaireid);
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
        //封装返回后的EndQuestionaireBean
        List<Pair<String,Double>> pairs = new ArrayList<>();
        pairs.add(firstPair);
        pairs.add(secondPair);
        pairs.add(thirdPair);
        pairs.add(fourPair);
        pairs.add(fifthPair);
        List<EndQuestionaireBean.LevelScoreBean> levelScoreBeans = new ArrayList<>();
        for(Pair<String,Double> pair:pairs){
            String levelName = pair.getHeadKey();
            double score = pair.getBodyKey();
            //EndQuestionaireBean.LevelScoreBean levelScoreBean = new EndQuestionaireBean.LevelScoreBean(levelName,score);
            List<TradeTempBean> tradeTempBeans = questionService.getlabelNameAndScoreByLevel(questionaireid,levelName);
            EndQuestionaireBean.LevelScoreBean levelScoreBean = new EndQuestionaireBean.LevelScoreBean(levelName,score,tradeTempBeans.toArray(new TradeTempBean[tradeTempBeans.size()]));
            levelScoreBeans.add(levelScoreBean);
        }
        EndQuestionaireBean endQuestionaireBean = new EndQuestionaireBean(totalScore,rank,levelScoreBeans.toArray(new EndQuestionaireBean.LevelScoreBean[levelScoreBeans.size()]));



        System.out.println(firstPair.getHeadKey()+"===级别得分为==="+firstPair.getBodyKey());
        System.out.println(secondPair.getHeadKey()+"===级别得分为==="+secondPair.getBodyKey());
        System.out.println(thirdPair.getHeadKey()+"=======级别得分===="+thirdPair.getBodyKey());
        System.out.println(fourPair.getHeadKey()+"=======级别得分===="+fourPair.getBodyKey());
        System.out.println(fifthPair.getHeadKey()+"=======级别得分===="+fifthPair.getBodyKey());

        //System.out.println("级别level为"+level+"得分为"+answerSheet.getTotalScore());
        //endQuestionaireBean.getLevelScoreBeans()[0].labelScores[0];
        //etLabelScore()
        return ControllerReturnJson.builder().setDatas(endQuestionaireBean).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();

    }

    private double getLabelScore(String qustionaireId,String labelName) {
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(AnswerSheet.class);
        sqlWhere.and("name",qustionaireId);
        AnswerSheet answerSheet = SimpleJPABuilderPkg.builder(AnswerSheet.class).findFirstEntity(sqlWhere);


        return 0;
    }

    /**
     * 测试方法
     */
    @RequestMapping(value = "/ff",method = RequestMethod.GET)
    //List<TradeTempBean> getlabelNameAndScoreByLevel
    public  List<TradeTempBean> ff(){
       // List<EndQuestionaireBean.TradeScoreBean> tradelabelScore = questionService.getTradelabelScore("100001_1560998539738_1_6");
        List<TradeTempBean>tradeTempBeans=questionService.getlabelNameAndScoreByLevel("100001_1560998539738_1_6","已规划级");
        return tradeTempBeans;
    }

    /**
     *根据企业id得到该企业做过的所有的问卷
     */
   /* ///api/questionaire/getAll
    @RequestMapping(value = "/getAll/{enid}",produces = {"application/json;charset=utf-8"},method = RequestMethod.GET)
   public String  getAll(@PathVariable String enid){
        System.out.println("用户请求参数为"+enid);
    SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
    sqlWhere.and("enterprise_number",enid);
    Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere);
    List<AnswerSheet> answerSheets = company.getAnswerSheets();
    System.out.println(answerSheets.size());
    List<OneResultBean.ReBean> reBeans = new ArrayList<>();
    for(AnswerSheet answerSheet:answerSheets){
        OneResultBean.ReBean reBean = new OneResultBean.ReBean();
        String s = String.format("%.2f",answerSheet.getScore());
        double d = Double.valueOf(s);
        //reBean.setScore(answerSheet.getScore());
        reBean.setScore(d);
        reBean.setLevel(answerSheet.getRank());
        reBean.setDate(answerSheet.getDate());
        reBean.setSheetName(answerSheet.getName());
        reBeans.add(reBean);
    }
    OneResultBean oneResultBean = new OneResultBean(reBeans.toArray(new OneResultBean.ReBean[reBeans.size()]));
    return ControllerReturnJson.builder().setDatas(reBeans).setStatusCode("200").setStatusMsg("获取问卷").toJson();
   }*/
    /**
     *根据企业id得到该企业做过的所有的问卷
     */
    ///api/questionaire/getAll
    @RequestMapping(value = "/getAll/{enid}",produces = {"application/json;charset=utf-8"},method = RequestMethod.GET)
   public String  getAll(@PathVariable String enid){
        System.out.println("用户请求参数为"+enid);
    SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
    sqlWhere.and("enterprise_number",enid);
    Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere);
    List<AnswerSheet> answerSheets = company.getAnswerSheets();
    System.out.println(answerSheets.size());
    List<OneResultBean.ReBean> reBeans = new ArrayList<>();
    for(AnswerSheet answerSheet:answerSheets){
        OneResultBean.ReBean reBean = new OneResultBean.ReBean();
        EndLevelAndScoreBean endLevelAndScoreBean = questionService.getRankAndScoreByQuestionId(answerSheet.getName());
        reBean.setScore(endLevelAndScoreBean.getScore());
        double score = endLevelAndScoreBean.getScore();
        String lev = questionService.getRank(score);
        reBean.setLevel(lev);
        reBean.setDate(answerSheet.getDate());
        reBean.setSheetName(answerSheet.getName());
        reBeans.add(reBean);
    }
    OneResultBean oneResultBean = new OneResultBean(reBeans.toArray(new OneResultBean.ReBean[reBeans.size()]));
    return ControllerReturnJson.builder().setDatas(reBeans).setStatusCode("200").setStatusMsg("获取问卷").toJson();
   }




}
