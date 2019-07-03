import addons.nsneo.entity.Admin;
import addons.nsneo.pub.EndLevelAndScoreBean;
import addons.nsneo.pub.JWT;
import addons.nsneo.pub.jwtBean;
import addons.nsneo.service.QuestionService;
import addons.nsneo.test.NsneoUnitTestBaseWithBeanManager;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class TestJWT extends NsneoUnitTestBaseWithBeanManager{

    @Test
    //测试加密和解密算法
    public void test1(){
//        Admin admin = new Admin("zhangsan","12345");
        jwtBean jwtbean1 = new jwtBean("asas");
        String token = JWT.sign(jwtbean1,1000L*60L*60L);
        System.out.println("生成的token为"+token);
        System.out.println("解密后");
        jwtBean j = JWT.unsign(token, jwtBean.class);
        System.out.println(j.toString());
    }
    @Test
    //根据答卷id,得到用户的行业数组 如 100002_1557403495830_1_1_2
    public void test2(){
        String questionaireid = "100002_1557403495830_1_1_2";
        String tradeStr = questionaireid.substring(22,questionaireid.length()); // _1_2
        System.out.println(tradeStr);
        String []tradeArrNum =  tradeStr.split("_");  //得到 1 2
        List<String> list = new ArrayList<>();
        for(String s:tradeArrNum){
            System.out.println(s);
            if(s.equals("1")){
                list.add("设计");
            }else if(s.equals("2")){
                list.add("生产");
            }else if(s.equals("3")){
                list.add("物流");
            }
        }
        for(String s:list){
            System.out.println(s);
        }
        //把list转化成数组
        String[] tradeArr = list.toArray(new String[list.size()]);
        for(String s:tradeArr){
            System.out.println(s);
        }
    }

    @Test
    public void test3(){
        double a = 0.833333333;
        System.out.println(String.format("%.2f",a));
        //String.format("%.2f",a);
       String s = String.format("%.2f",a);
       double d = Double.valueOf(s);
        System.out.println(d);
    }
    @Test
    public void test4(){
        QuestionService questionService = new QuestionService();
        questionService.getTradelabelScore("100001_1560998539738_1_6");
    }
@Test
    public void test5(){
        QuestionService questionService = new QuestionService();
        EndLevelAndScoreBean rankAndScoreByQuestionId = questionService.getRankAndScoreByQuestionId("100001_1560998539738_1_6");
        System.out.println(rankAndScoreByQuestionId);
    }



}
