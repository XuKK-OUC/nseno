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

import java.util.List;

@RestController
@RequestMapping("/mycontroller")
public class MyController extends SpringControllerBase {
    public static final ILogger logger = LoggerFactory.getInstance().createLogger(MyController.class);

    /**
     * 增加答案和更新答案
     * @param answer
     * @return
     */
    @RequestMapping( value = "/add",produces = {"application/json;charset=utf-8"})
    public String add(@RequestBody  Answer answer){
        try{
            SimpleJPABuilderPkg.builder().update(answer);
            return ControllerReturnJson.builder().toJson();
        }catch (Exception e){
            logger.error(e);
            return ControllerReturnJson.builderFail(e.getMessage()).toJson();
        }
    }
    /**
     * 根据答案名字进行条件查询,得到答案列表,存入json中返回
     * @param answerCondition
     * @return String
     */
    @RequestMapping( value = "/findAll",produces = {"application/json;charset=utf-8"})
    public String findAll(@RequestBody  AnswerCondition answerCondition){
        try{
            SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Answer.class);
            sqlWhere.and("name",answerCondition.getName());
            List<Answer> answerList = SimpleJPABuilderPkg.builder(Answer.class).findEntitys(sqlWhere);
            return ControllerReturnJson.builder().setDatas(answerList).toJson();
        }catch (Exception e){
            logger.error(e);
            return ControllerReturnJson.builderFail(e.getMessage()).toJson();
        }
    }
    /**
     * 根据id删除答案
     * @param id
     * @return String
     */
    @RequestMapping( value = "/deleteById/{id}",produces = {"application/json;charset=utf-8"})
    public String findAll(@PathVariable  int id){
        try{
           SimpleJPABuilderPkg.builder(Answer.class).delete(id);
            return ControllerReturnJson.builder().toJson();
        }catch (Exception e){
            logger.error(e);
            return ControllerReturnJson.builderFail(e.getMessage()).toJson();
        }
    }

}
