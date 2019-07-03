package addons.nsneo.service;

import addons.common.utils.SimpleJPABuilderPkg;
import addons.nsneo.entity.Question;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 管理员使用的service
 */
@Service
public class AdminService {
    /**
     *根据行业和行业子标签得到问题
     **/
    public List<Question> getQuestions(String tradeName, String tradeLabelName){

        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Question.class);
        sqlWhere.and("trade.name",tradeName);
        sqlWhere.and("tradeLabel.name",tradeLabelName);
        sqlWhere.and("status",0);
        sqlWhere.and(sqlWhere);
        List<Question> questions = SimpleJPABuilderPkg.builder(Question.class).findEntitys(sqlWhere);
        return questions;
    }
}
