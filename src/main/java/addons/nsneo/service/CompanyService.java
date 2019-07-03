package addons.nsneo.service;

import addons.common.utils.SimpleJPABuilderPkg;
import addons.common.web.springController.ControllerReturnJson;
import addons.nsneo.entity.Company;
//import addons.nsneo.pub.Err;
//import addons.nsneo.pub.ErrGlobalManager;
//import addons.nsneo.pub.ErrorCode;
import addons.nsneo.pub.CodeMsg;
import com.alibaba.fastjson.JSONObject;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import org.checkerframework.checker.units.qual.C;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.HashMap;
import java.util.List;

@Service
public class CompanyService {
//    private HashMap<String, ErrorCode> hashMap;
//    @Autowired
//    private ErrGlobalManager manager;

    /**
     * 判断企业信用代码是否唯一
     */
    public boolean isUniqueSocialNumber(String enterpriseNumber) {
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
        sqlWhere.and("enterprise_number", enterpriseNumber);
        Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere);
        if (company == null) {
            return true;
        }
        return false;
    }

    /**
     * 向数据库保存一个用户
     */
    public void save(Company company) {
        SimpleJPABuilderPkg.builder().update(company);
    }

    /**
     * 根据企业信用代码得到企业名称
     */
    public String getEnterpriseNameFromNumber(String number) {
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
        sqlWhere.and("enterprise_number", number);
        Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere);
        return company.getEnterprise_name();
    }

    /**
     * 根据企业信用代码及新密码修改密码
     */
    public String updatePassword(String enterpriseNumber, String password) {
        SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(Company.class);
        sqlWhere.and("enterprise_number", enterpriseNumber);
        Company company = SimpleJPABuilderPkg.builder(Company.class).findFirstEntity(sqlWhere);
        if(company!=null){
            company.setPassword(password);
            SimpleJPABuilderPkg.builder().update(company);
            return ControllerReturnJson.builder().setDatas(enterpriseNumber).setStatusCode(String.valueOf(CodeMsg.SUCCESS.getCode())).setStatusMsg(CodeMsg.SUCCESS.getMsg()).toJson();
        }
        return ControllerReturnJson.builderFail("不存在此用户").setStatusCode(String.valueOf(CodeMsg.NOT_FOUND.getCode())).setStatusMsg(CodeMsg.NOT_FOUND.getMsg()).toJson();

    }





}
