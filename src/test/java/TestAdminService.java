import addons.nsneo.entity.Question;
import addons.nsneo.service.AdminService;
import addons.nsneo.service.QuestionService;
import addons.nsneo.test.NsneoUnitTestBaseWithBeanManager;
import org.junit.Test;

import java.util.List;

public class TestAdminService extends NsneoUnitTestBaseWithBeanManager {
    QuestionService questionService = new QuestionService();
    @Test
    public void test1(){
        AdminService adminService = new AdminService();
        List<Question> questions = adminService.getQuestions("设计", "产品设计");
        for(Question question:questions){
            System.out.println(question);
        }
        Question question = questions.get(0);
        String s = question.getNumber(); //1.1.1
        System.out.println(s);
        String[] strs = s.split("\\.");
        String s12 = strs[0]+"."+strs[1];
        System.out.println(s12);


    }
    @Test
    //测试根据级别得到字符串
    public void test2(){

        System.out.println("已规划级对应的字符串为"+questionService.getStringLevel("引领级"));
    }
    @Test
    //测试根据行业数组得到字符串
    public void test3(){
      String[]arr = new String[]{"设计","生产","物流"};
        System.out.println(questionService.getStringTrade(arr));
    }
}
