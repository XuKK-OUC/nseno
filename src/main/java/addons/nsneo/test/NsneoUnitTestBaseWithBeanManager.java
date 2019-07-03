package addons.nsneo.test;

import com.common.CommonStaticInfoGlobalPath;
import com.common.debug.UnitTestBaseWithBeanManager;

/**
 * 针对工程的单元测试基类
 * @author 周志明
 * 创建时间：18/8/12 19:23
 */
public class NsneoUnitTestBaseWithBeanManager extends UnitTestBaseWithBeanManager {
    static {
        //CommonStaticInfoGlobalPath.CommonStaticInfo_Global_ProjectFolderName = "demo";
        //本地工程路径,工程目录更改后,需要更改此参数,以便单元测试
        CommonStaticInfoGlobalPath.CommonStaticInfo_Global_Path_Win = "F:\\newstar\\nsneo0625";
        CommonStaticInfoGlobalPath.CommonStaticInfo_Global_ProjectFolderName_Resources ="src/main/resources";
    }

    public static NsneoUnitTestBaseWithBeanManager buidler(){
        return new NsneoUnitTestBaseWithBeanManager();
    }

    public static NsneoUnitTestBaseWithBeanManager buidler(String globlPath){
        NsneoUnitTestBaseWithBeanManager baseWithBeanManager = new NsneoUnitTestBaseWithBeanManager(globlPath,null);
        return baseWithBeanManager;
    }

    public NsneoUnitTestBaseWithBeanManager() {
    }

    public NsneoUnitTestBaseWithBeanManager(String globalPath,String projectName) {
        super(globalPath,projectName);
    }
}
