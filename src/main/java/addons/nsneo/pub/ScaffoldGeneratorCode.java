package addons.nsneo.pub;

import addons.common.utils.scaffold.yaml.builder.SampleTable;
import addons.common.utils.scaffold.yaml.builder.SampleTableColumn;
import addons.common.utils.scaffold.yaml.builder.ScaffoldGeneratorCodeBuilder;
import addons.nsneo.test.NsneoUnitTestBaseWithBeanManager;

/**
 * 脚手架生成对象
 * @author 周志明
 * 创建时间：19/1/14 1:23
 */
public class ScaffoldGeneratorCode {

    //脚手架配置文件的根路径
    public static String ScaffoldConfigFileRootPath = "file:E:\\work\\prog\\nsneoidea\\prototype\\java新技术\\mvn\\singleweb\\nsneo\\scaffold";

    /**
     * 脚手架生成模块代码
     * */
    public static void main(String[] args){
        //环境配置
        NsneoUnitTestBaseWithBeanManager.buidler();

        //需要生成脚手架的表定义
        //需要定义表名称,表的列,以及从表
        SampleTable table = SampleTable.builder("sfSample","测试脚手架")//创建主表
                .add(SampleTableColumn.builder("code","[varchar2](100)","代码主表中的代码字段"))//创建主表从属的列
                .add(SampleTable
                        .builder("sfSampleDetail","测试脚手架从表")//创建从表,并加入到主表的从表集合中
                        .add(SampleTableColumn.builder("dcode","[varchar2](100)","代码明细表中的代码字段"))//创建从表从属的列
                );

        //调用脚手架配置文件生成基础模块代码
        String ymlFile = ScaffoldConfigFileRootPath+"\\SampleScaffoldConfigDyn_mt.yml";
        ScaffoldGeneratorCodeBuilder.builder(ymlFile,true).generatorCode(table);
    }
}
