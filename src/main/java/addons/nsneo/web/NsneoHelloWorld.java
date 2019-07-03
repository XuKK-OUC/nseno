package addons.nsneo.web;

import addons.common.utils.SimpleJPABuilderPkg;
import addons.common.web.springController.ControllerReturnJson;
import addons.common.web.springController.SpringControllerBase;

import addons.nsneo.entity.Answer;
import com.nsneo.pub.logger.ILogger;
import com.nsneo.pub.logger.LoggerFactory;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;


@RestController
@RequestMapping({"/nsneohelloworld"})
public class NsneoHelloWorld extends SpringControllerBase {
    public static final ILogger logger = LoggerFactory.getInstance().createLogger(NsneoHelloWorld.class);
    @RequestMapping(
            value = {"/hello"},
            produces = {"application/json;charset=utf-8"}
    )
    public String hello() {
        return ControllerReturnJson.builderFail("原因") //出错原因
                .setStatusCode("408")  //状态码
                .setDatas(new Pone[]{new Pone("A",15),new Pone("B",25)}).toJson();



    }
    @RequestMapping(
            value = {"/addAnswer"},
            produces = {"application/json;charset=utf-8"}
    )
    public String addAnswer(@RequestBody Answer answer, HttpServletRequest request, HttpServletResponse response) {
            //数据库操作模板
        try {
            SimpleJPABuilderPkg.builder().update(answer);//增加答案

            return ControllerReturnJson.builder().toJson();
        }catch (Exception e){
            logger.error(e);
            return ControllerReturnJson.builderFail(e.getMessage()).toJson();
        }



    }
    @RequestMapping(
            value = {"/find"},
            produces = {"application/json;charset=utf-8"}
    )
    public String find(@RequestBody AnswerCondition answerCondition) {
        //数据库操作模板 - 条件查询

        try {
            SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Answer.class);
            sqlWhere.and("name",answerCondition.getName());
           List<Answer> answerList = SimpleJPABuilderPkg.builder(Answer.class).findEntitys(sqlWhere);

            return ControllerReturnJson.builder().setDatas(answerList).toJson();
        }catch (Exception e){
            logger.error(e);
            return ControllerReturnJson.builderFail(e.getMessage()).toJson();
        }



    }
    @RequestMapping(
            value = {"/value/{id}"},
            produces = {"application/json;charset=utf-8"}
    )
    public String delete(@PathVariable Long id) {
        //数据库操作模板 - 删除

        try {


         SimpleJPABuilderPkg.builder(Answer.class).delete(id);

            return ControllerReturnJson.builder().toJson();
        }catch (Exception e){
            logger.error(e);
            return ControllerReturnJson.builderFail(e.getMessage()).toJson();
        }



    }
}
