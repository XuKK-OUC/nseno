package addons.demo.web.sfDemo;


import addons.common.dataFormat.FormatObjectDataToString;
import addons.common.utils.SimpleJPABuilderPkg;
import addons.common.webBase.CtrlNamedSessionObjWithSequence;
import addons.common.webBase.DataOutforJSONCtrl;
import com.common.utils.IWebInvokeParam;
import addons.common.dataFormat.SimpleStringFormatOutBuilder;
import addons.common.webData.WebCommonUtilsFunction;
import com.nsneo.utils.sql.SqlWhereWithParamTools;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

import addons.demo.entity.SfDemoEntity;

/**
 * 脚手架生成模块数据输出控件
 * */
public class CtrlData extends DataOutforJSONCtrl {

    private static final long serialVersionUID = 1L;

    /**
     * session管理对象,处理本类的session缓存数据,为工具辅助对象
     */
    public static class DataCtrlSessionObj extends CtrlNamedSessionObjWithSequence<DataCtrlSessionObj> {
        private static final long serialVersionUID = 1L;

        public static DataCtrlSessionObj builder(IWebInvokeParam webInvokeParam) {
            return builder(DataCtrlSessionObj.class, webInvokeParam);
        }
        /**
         * 重置session中的缓存数据
         * */
        public DataCtrlSessionObj resettingCacheData(){
            super.resettingCacheData();
            return this;
        }
    }

	/**
     * 执行查询操作
     * @param webInvokeParam 页面请求的封装对象
     * @return 填入 action 对应的输出模板的内容,一般是一个json数据
     * */
    public String query(IWebInvokeParam webInvokeParam){
        try{

            String currentData = WebCommonUtilsFunction.getCurrentData(webInvokeParam);

            logger.info("执行查询,查询条件["+currentData+"]");

            //限制数据访问范围-只有本应用的数据才能访问
            SqlWhereWithParamTools sqlWhere = SqlWhereWithParamTools.create(SfDemoEntity.class);

            //增加应用编码限制
            if(StringUtils.isNotBlank(webInvokeParam.getSysAppId())){
                sqlWhere.and(SfDemoEntity.FieldName_SysAppId,webInvokeParam.getSysAppId());
            }

            //设置名称查询条件
            if (StringUtils.isNotBlank(currentData)) {
                //CommonUtilsFunction.appendStringToSqlWhere(sqlWhere, true, "name", currentData);
            }

            //执行查询
            List<SfDemoEntity> datas = SimpleJPABuilderPkg.builder(SfDemoEntity.class).findEntitys(sqlWhere);

            //格式化输出
            return FormatObjectDataToString.dataBuilder(this, SfDemoEntity.class, webInvokeParam).formatDataSetToJson(datas);
        }catch (Exception e){
            this.addCurrentDataState(webInvokeParam,e.getMessage());
            return SimpleStringFormatOutBuilder.formatJsonEmptyObjectValue();
        }
    }


    /**
     * 新增一条新纪录
     * @param webInvokeParam 框架调用执行参数
     * */
    public String add(IWebInvokeParam webInvokeParam) {

        try{
            //删除之前操作的数据
            DataCtrlSessionObj.builder(webInvokeParam).resettingCacheData();

            //加载新的数据
            SfDemoEntity dataEntity = DataCtrlSessionObj.builder(webInvokeParam).findAndCreateEntity(SfDemoEntity.class);
            dataEntity.setSysAppId(webInvokeParam.getSysAppId());

            //格式化输出
            return FormatObjectDataToString.dataBuilder(this, SfDemoEntity.class, webInvokeParam).formatDataSetToJson(dataEntity);
        }catch (Exception e){

            this.addCurrentDataState(webInvokeParam,e.getMessage());
            return SimpleStringFormatOutBuilder.formatJsonEmptyObjectValue();
        }
    }


    /**
     * 编辑
     * @param webInvokeParam 框架调用执行参数
     * */
    public String edit(IWebInvokeParam webInvokeParam) {

        try{
            //获得要加载数据对象编码
            String currentData = WebCommonUtilsFunction.getCurrentData(webInvokeParam);
            if (StringUtils.isBlank(currentData)) {
                this.addCurrentDataState(webInvokeParam, "未找到要编辑的数据对象");
                return SimpleStringFormatOutBuilder.formatJsonEmptyStringValue();
            }

            //删除之前操作的数据
            DataCtrlSessionObj.builder(webInvokeParam).resettingCacheData();

            //加载新数据
            SfDemoEntity dataEntity = DataCtrlSessionObj.builder(webInvokeParam).findAndLoadByLongKey(SfDemoEntity.class, currentData);

            //判断数据是否存在
            if (dataEntity == null) {
                this.addCurrentDataState(webInvokeParam, "未找到要编辑的数据对象");
                return SimpleStringFormatOutBuilder.formatJsonEmptyStringValue();
            }

            //格式化输出
            return FormatObjectDataToString.dataBuilder(this, SfDemoEntity.class, webInvokeParam).formatDataSetToJson(dataEntity);
        }catch (Exception e){

            this.addCurrentDataState(webInvokeParam,e.getMessage());
            return SimpleStringFormatOutBuilder.formatJsonEmptyObjectValue();
        }
    }

    /**
     * 保存
     * @param webInvokeParam 框架调用执行参数
     * */
    public String save(IWebInvokeParam webInvokeParam) {

        try{
            DataCtrlSessionObj sessionObj = DataCtrlSessionObj.builder(webInvokeParam);

            //数据实体
            SfDemoEntity dataEntity = sessionObj.findEntity(SfDemoEntity.class);
            if (dataEntity == null) {
                this.addCurrentDataState(webInvokeParam, "未找到要保存的数据对象");
                return SimpleStringFormatOutBuilder.formatJsonEmptyStringValue();
            }

            //同步数据对象
            synEnityDataFromRequest(dataEntity, webInvokeParam);

            //设置系统编码
            dataEntity.setSysAppId(webInvokeParam.getSysAppId());


            //执行保存数据
            SimpleJPABuilderPkg.builder().update(dataEntity).simpleRefresh(dataEntity);

            //格式化输出
            return FormatObjectDataToString.dataBuilder(this, SfDemoEntity.class, webInvokeParam).formatDataSetToJson(dataEntity);
        }catch (Exception e){
            this.addCurrentDataState(webInvokeParam,e.getMessage());
            return SimpleStringFormatOutBuilder.formatJsonEmptyObjectValue();
        }

    }

    /**
     * 删除
     * @param webInvokeParam 框架调用执行参数
     * */
    public String delete(IWebInvokeParam webInvokeParam) {

        try {
            //找到要删除的数据实体对象
            String currentData = WebCommonUtilsFunction.getCurrentData(webInvokeParam);
            SfDemoEntity dataEntity = SimpleJPABuilderPkg.builder(SfDemoEntity.class).findEntity(Long.parseLong(currentData));
            if(dataEntity==null){
                this.addCurrentDataState(webInvokeParam,"请选择要删除的资源对象");
                return SimpleStringFormatOutBuilder.formatJsonEmptyObjectValue();
            }

            //断开数据库关联内容
            //TODO 如果有从表的话需要手工断开数据库关联的内容

            //删除数据对象
            SimpleJPABuilderPkg.builder().simpleDeleteEnityObjs(dataEntity);

            //清空缓存对象
            DataCtrlSessionObj.builder(webInvokeParam).resettingCacheData();

            //格式化输出
            return FormatObjectDataToString.dataBuilder(this,DataCtrlSessionObj.class,webInvokeParam).formatDataSetToJson(dataEntity);

        }catch (Exception e){
            this.addCurrentDataState(webInvokeParam,e.getMessage());
            return SimpleStringFormatOutBuilder.formatJsonEmptyObjectValue();
        }


    }
}