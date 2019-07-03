/**初始化脚本,scriptUtils 是系统注入的工具,有一个接口函数 exucteUpdate*/
scriptUtils.println("这是一个初始化脚本,负责在系统初始的时候进行系统初始化操作,如创建视图等...开始");

/*
var viewddls=new Array();
viewddls[0] = "CREATE OR REPLACE VIEW NSNEO_MD_TOBACMAINDATAVIEW AS " +
    " select a.*,b.pname as tobacGrdCdCaption,c.pname as tobacKindCaption,d.pname as tobacOrigThirdCaption" +
    " from NSNEO_MD_TOBACMAINDATA a " +
    " left join NSNEO_MD_TOBACBASEPROPERTY b on b.PCODE=a.tobacGrdCd and b.CTYPE='1' " +
    " left join NSNEO_MD_TOBACBASEPROPERTY c on c.PCODE=a.tobacKind and c.CTYPE='3' " +
    " left join NSNEO_MD_TOBACBASEPROPERTY d on d.PCODE=a.tobacOrigThird and d.CTYPE='2'";

scriptUtils.excuteUpdate(viewddls[0]);
*/

scriptUtils.println("这是一个初始化脚本,负责在系统初始的时候进行系统初始化操作,如创建视图等...结束");