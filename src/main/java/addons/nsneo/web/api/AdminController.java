package addons.nsneo.web.api;

import addons.common.utils.SimpleJPABuilderPkg;
import addons.common.web.springController.ControllerReturnJson;
import addons.common.web.springController.SpringControllerBase;
import addons.nsneo.entity.*;
import addons.nsneo.pub.*;
import addons.nsneo.service.AdminService;
import addons.nsneo.service.QuestionService;
import com.alibaba.fastjson.JSONObject;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import javafx.util.Pair;
import org.apache.hadoop.util.hash.Hash;
import org.checkerframework.checker.units.qual.C;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.*;

/**
 * 管理员使用的Controller
 */
@RestController
@RequestMapping(value="/api/admin")
public class AdminController  extends SpringControllerBase {
    @Autowired
    private QuestionService questionService;

    @Autowired
    private AdminService adminService;
    @PersistenceContext
    private EntityManager entityManager;
    /**
     * 得到所有企业做过的答卷
     * @return
     */
    @RequestMapping(value = "/getAll",produces = {"application/json;charset=utf-8"},method = RequestMethod.GET)
    public String getAll(){
        //得到所有企业信息
        List<Company> companys = SimpleJPABuilderPkg.builder(Company.class).findEntitys();
        System.out.println("共有企业"+companys.size());
        List<ManyResultBean.ReBean> reBeans = new ArrayList<>();
        for(Company company:companys){
            //得到每个企业所有的答卷
            for(AnswerSheet answerSheet:company.getAnswerSheets()){
                ManyResultBean.ReBean reBean = new ManyResultBean.ReBean();
                reBean.setEnterpriseNumber(company.getEnterprise_number());
                reBean.setSheetName(answerSheet.getName());
                reBean.setDate(answerSheet.getDate());
                reBean.setLevel(answerSheet.getRank());
                reBean.setScore(answerSheet.getScore());
                //增加企业名称及省市
                reBean.setEnterpriseName(company.getEnterprise_name());
                reBean.setProvince(company.getProvince());
                reBean.setCity(company.getCity());
                reBeans.add(reBean);

            }
        }
        ManyResultBean manyResultBean = new ManyResultBean(reBeans.toArray(new ManyResultBean.ReBean[reBeans.size()]));
        return ControllerReturnJson.builder().setDatas(manyResultBean).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
    }

    /**
     * 得到所有用户
     */
    @RequestMapping(value = "/getAllUser",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String getAllUser(){
        //得到所有状态是可用的企业
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
        sqlWhere.and("status",0);
        List<Company> companys = SimpleJPABuilderPkg.builder(Company.class).findEntitys(sqlWhere);
        List<CompanyInfoBean>companyInfoBeans = new ArrayList<>();
        for(Company company:companys){
            CompanyInfoBean companyInfoBean = new CompanyInfoBean(company.getEnterprise_number(),company.getEnterprise_name(),company.getPassword(),company.getPhone(),company.getEmail(),company.getEnterprise_type(),company.getIndustry_big(),company.getIndustry_small(),company.getEnterprise_scale(),company.getAnnual_income(),company.getProvince(),company.getCity(),company.getArea(),company.getBusinessType(),company.getDetailAddress(),company.getPostcode(),company.getWebSite());
            companyInfoBeans.add(companyInfoBean);
        }
        return ControllerReturnJson.builder().setDatas(companyInfoBeans).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
    }

    /**
     * 添加题目
     */
    @RequestMapping(value = "/addQuestion",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String addQuestion(@RequestBody  InsertQuestionBean insertQuestionBean){
        System.out.println("用户传来的数据"+insertQuestionBean);
        //得到答案数组
        InsertQuestionBean.OptionBean[] optionBeans = insertQuestionBean.getOptionBeans();
        List<Answer> answers = new ArrayList<>();
        for(InsertQuestionBean.OptionBean optionBean:optionBeans){
            Answer answer = new Answer(optionBean.getNumber(),optionBean.getOptionCaption(),optionBean.getScore());
            answers.add(answer);
        }
        //得到题干
        String questionCaption = insertQuestionBean.getQuestionCaption();
        //得到级别
        String level = insertQuestionBean.getLevel();
        //得到行业
        String tradeName = insertQuestionBean.getTrade();
        //得到行业子标签
        String tradeLableName = insertQuestionBean.getTradeLable();
        //根据行业和行业子标签查到题库
        List<Question> questions = adminService.getQuestions(tradeName,tradeLableName);
        //得到最大题号数  1.1.7 中的7
        int size = questions.size();
        Question q = questions.get(0);
        String s = q.getNumber(); //1.1.1
        System.out.println(s);
        String[] strs = s.split("\\.");
        //得到行业和行业子标签对应的序号 如 1.1.1中的1.1
        String spre = strs[0]+"."+strs[1];
        String qnumber = spre+"."+(size+1);
        System.out.println(qnumber);
        Question ques = new Question();
        ques.setNumber(qnumber);
        ques.setLevel(level);
        ques.setDescription(questionCaption);
        //设置问题状态为可用
        ques.setStatus(0);
        //答案和题目互相绑定
        for(Answer answer:answers){
            answer.setQuestion(ques);
            ques.add(answer);

        }
        SqlWhereWithParamTools sqlWhere1 = SqlWhereWithParamTools.create(TradeLabel.class);
        sqlWhere1.and("name",tradeLableName);
        TradeLabel tradeLabel = SimpleJPABuilderPkg.builder(TradeLabel.class).findFirstEntity(sqlWhere1);
        System.out.println("tradeLable的名字"+tradeLabel.getName());
        SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere2.and("name",tradeName);
        Trade trade = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere2);
        System.out.println("trade的名字"+trade.getName());
        //题目和行业以及行业子标签互相绑定
        tradeLabel.add(ques);
        ques.setTradeLabel(tradeLabel);
        ques.setTrade(trade);
        SimpleJPABuilderPkg.builder().update(answers,ques,tradeLabel,trade);

        return ControllerReturnJson.builder().setDatas(qnumber).setStatusCode("200").setStatusMsg("插入题目成功").toJson();
        //return ControllerReturnJson.builder().setDatas(question.getNumber()).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
    }

    /**
     * 管理员登录
     * @param adminLoginBean
     * @return
     */
    @RequestMapping(value = "/login",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String login(@RequestBody AdminLoginBean adminLoginBean){
        System.out.println(adminLoginBean);
        String name = adminLoginBean.getName();
        String password = adminLoginBean.getPassword();
        //查库
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Admin.class);
        sqlWhere.and("username",name);
        Admin admin = SimpleJPABuilderPkg.builder(Admin.class).findFirstEntity(sqlWhere);
        if(admin!=null){ //验证密码
            if(admin.getPassword().equals(password)){
                Jedis jedis = RedisUtil.getJedis();
                RedisBean redisBean = new RedisBean(adminLoginBean.getName(), password,"pc");
                //给用户jwt加密生成token
                String token = JWT.sign(redisBean, 60L* 1000L* 30L);
                Map<String,Object> result =new HashMap<String,Object>();
                result.put("token", token);
                result.put("id", adminLoginBean.getName());
                System.out.println("管理员得到的token=================="+token);

                jedis.set(token, "role-admin");

                jedis.expire(token, 60*60);//超时时间 pc  1小时   app 7天

                //用完关闭
                jedis.close();
                Map results = new HashMap<>();
                results.put("name",adminLoginBean.getName());
                results.put("token",token);
                return ControllerReturnJson.builder().setDatas(results).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();

            }
            else{
                return ControllerReturnJson.builderFail("密码错误").setStatusCode("204").setStatusMsg("密码错误").toJson();
            }
        }
        else{
            return ControllerReturnJson.builderFail("用户名不存在").setStatusCode("204").setStatusMsg("用户名错误").toJson();
        }
    }


    /**
     * 根据题目id得到题目
     */
    @RequestMapping(value = "/getQuestionInfo/{quid}",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public  String getQuestionInfo(@PathVariable String quid){
        System.out.println("用户传来的题目为"+quid);
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Question.class);
        sqlWhere.and("number",quid);
        Question question = SimpleJPABuilderPkg.builder(Question.class).findFirstEntity(sqlWhere);
        List<Answer>answers = question.getAnswers();
        List<InsertQuestionBean.OptionBean> optionBeans = new ArrayList<>();
        for(Answer answer:answers ){
            InsertQuestionBean.OptionBean optionBean = new InsertQuestionBean.OptionBean(answer.getNumber(),answer.getName(),answer.getScore());
            optionBeans.add(optionBean);
        }
        InsertQuestionBean insertQuestionBean = new InsertQuestionBean(question.getDescription(),question.getLevel(),question.getTrade().getName(),question.getTradeLabel().getName(),optionBeans.toArray(new InsertQuestionBean.OptionBean[optionBeans.size()]));
        Pair<String,InsertQuestionBean> pair = new Pair<>(quid,insertQuestionBean);
        return ControllerReturnJson.builder().setDatas(pair).setStatusCode("200").setStatusMsg("查看题目成功").toJson();
    }

    /**
     * 根据题目id得到题目后 对题目进行修改
     */
    @RequestMapping(value = "/editQuestionInfo/{quid}",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public  String editQuestionInfo(@PathVariable String quid,@RequestBody InsertQuestionBean insertQuestionBean){
        System.out.println("用户传来的题目为"+quid);
        System.out.println("sadasdasdasd"+insertQuestionBean);
        //1.根据用户传来的问题id从数据库中得到题目
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Question.class);
        sqlWhere.and("number",quid);
        sqlWhere.and("status",0);
        Question question = SimpleJPABuilderPkg.builder(Question.class).findFirstEntity(sqlWhere);
        //2.设置问题的题干
        question.setDescription(insertQuestionBean.getQuestionCaption());
        //3.得到答案数组
        InsertQuestionBean.OptionBean []optionBeans = insertQuestionBean.getOptionBeans();
        List<Answer>answers = new ArrayList<>();
        for(InsertQuestionBean.OptionBean optionBean:optionBeans){
            Answer answer = new Answer(optionBean.getNumber(),optionBean.getOptionCaption(),optionBean.getScore());
            answers.add(answer);
            //新加
            answer.setQuestion(question);
        }
        //4.设置问题的答案列表
        question.setAnswers(answers);
        SimpleJPABuilderPkg.builder().update(answers,question);

        return ControllerReturnJson.builder().setStatusCode("200").setStatusMsg("修改题目成功").toJson();
    }

    /**
     * 根据企业信用代码删除一个企业
     */
    // TODO: 2019/5/7  删除用户无法从数据库中删除,需要解决
    @RequestMapping(value = "/deleteuser/{enid}",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String deleteuser(@PathVariable String enid){
        System.out.println("要删除的企业id为"+enid);
        //根据企业信用代码得到要删除的企业
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
        sqlWhere.and("enterprise_number",enid);
        Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere);
        if(company != null) {
            //将企业的状态设置为禁用
            company.setStatus(1);
            SimpleJPABuilderPkg.builder().update(company);
            return ControllerReturnJson.builder().setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();

        }
        return  ControllerReturnJson.builderFail("企业id不存在").setStatusCode(String.valueOf(CodeMsg.NOT_FOUND.getCode())).setStatusMsg(CodeMsg.NOT_FOUND.getMsg()).toJson();
    }

    /**
     * 根据题目id 删除题目
     */
    @RequestMapping("/deletequestion/{quid}")
    public String deletequestion(@PathVariable String quid){
        System.out.println("用户要删除的问题题号为"+quid);
        //根据题号找到要删除的问题
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Question.class);
        sqlWhere.and("number",quid);
        sqlWhere.and("status",0);
        Question question = SimpleJPABuilderPkg.builder(Question.class).findFirstEntity(sqlWhere);
        if(question!=null) {
            //设置问题状态为禁用 1
            question.setStatus(1);
            SimpleJPABuilderPkg.builder().update(question);
            return ControllerReturnJson.builder().setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
        }
       return ControllerReturnJson.builderFail("此问题不存在").setStatusCode(String.valueOf(CodeMsg.QCODE_ERROR.getCode())).setStatusMsg(CodeMsg.QCODE_ERROR.getMsg()).toJson();
    }

    /**
     * 得到所有题目(状态为可用的题目)
     */
    @RequestMapping(value = "/getallquestion",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String getallquestion(){
        //查库,找到所有状态为可用的题目
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Question.class);
        sqlWhere.and("status",0);
        List<Question> questions = SimpleJPABuilderPkg.builder(Question.class).findEntitys(sqlWhere);
        List<QuestionsBean> questionsBeans = new ArrayList<>();
        for(Question question:questions){
            List<Answer> answers = question.getAnswers();
            List<QuestionsBean.OptionBean> optionBeans = new ArrayList<>();
            for(Answer answer:answers){
                QuestionsBean.OptionBean optionBean = new QuestionsBean.OptionBean(answer.getNumber(),answer.getName(),answer.getScore());
                optionBeans.add(optionBean);
            }
            QuestionsBean questionBean = new QuestionsBean(question.getNumber(),question.getDescription(),question.getLevel(),question.getTrade().getName(),question.getTradeLabel().getName(),optionBeans.toArray(new QuestionsBean.OptionBean[optionBeans.size()]));
            questionsBeans.add(questionBean);
        }
        return ControllerReturnJson.builder().setDatas(questionsBeans).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
    }

    /**
     * 根据行业得到该行业下的所有题目(状态为可用)
     */
    @RequestMapping(value = "/getallquestionByTradeName",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String getallquestionByTradeName(@RequestBody JSONObject jsonObject){
        String tradeName = jsonObject.getString("tradeName");
        System.out.println("用户要请求的行业名为"+tradeName);
        //根据行业名得到行业
        SqlWhereWithParamTools sqlWhere1 = SqlWhereWithParamTools.create(Trade.class);
        sqlWhere1.and("name",tradeName);
        Trade trade1 = SimpleJPABuilderPkg.builder(Trade.class).findFirstEntity(sqlWhere1);
        //根据行业名得到其下的行业子标签
        List<TradeLabel> labels = trade1.getLabels();
        List<QuestionsBean> questionsBeans = new ArrayList<>();
        for(TradeLabel label:labels) {
            String labelName = label.getName();
            System.out.println(labelName);
            SqlWhereWithParamTools sqlWhere2 = SqlWhereWithParamTools.create(Question.class);
            sqlWhere2.and("tradeLabel.name", labelName);
            sqlWhere2.and("status",0);
            List<Question> questions = SimpleJPABuilderPkg.builder(Question.class).findEntitys(sqlWhere2);
            System.out.println(tradeName + "下的题目数为:" + questions.size());
            for (Question question : questions) {
                List<Answer> answers = question.getAnswers();
                List<QuestionsBean.OptionBean> optionBeans = new ArrayList<>();
                for (Answer answer : answers) {
                    QuestionsBean.OptionBean optionBean = new QuestionsBean.OptionBean(answer.getNumber(), answer.getName(), answer.getScore());
                    optionBeans.add(optionBean);
                }
                QuestionsBean questionBean = new QuestionsBean(question.getNumber(), question.getDescription(), question.getLevel(), question.getTrade().getName(), question.getTradeLabel().getName(), optionBeans.toArray(new QuestionsBean.OptionBean[optionBeans.size()]));
                questionsBeans.add(questionBean);
            }
        }
        return ControllerReturnJson.builder().setDatas(questionsBeans).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
    }

    /**
     * 管理员根据问卷id得到用户做过的题和答案
     */
    @RequestMapping(value = "/getAnswerSheetById/{questionaireid}",produces = {"application/json;charset=utf-8"},method = RequestMethod.POST)
    public String getAnswerSheetById(@PathVariable String questionaireid){
        System.out.println("得到的问卷id为"+questionaireid);
       String[] levels={Level.FIRST_LEVEL,Level.SECOND_LEVEL};
       String[]tradeArr = questionService.getTradeArr(questionaireid);
       List<QuestionaireBean>questionaireBeans = new ArrayList<>();
       for(String level:levels){
           QuestionaireBean questionaireBean = questionService.getQuestionaireBean(level, questionaireid, tradeArr);
            questionaireBeans.add(questionaireBean);
       }
        return ControllerReturnJson.builder().setDatas(questionaireBeans).setStatusCode("200").setStatusMsg("查看问卷成功").toJson();
    }
}
