<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.nsneo.pub.sysConfig.SysConfigMan" %>
<%@ page import="com.nsneo.pub.sysConfig.SysConfigSet" %>
<%@ page import="com.nsneo.pub.sysConfig.SysRootUser" %>
<%@ page import="com.nsneo.pub.acl.user.SysUserManFactory" %>
<%@ page import="com.nsneo.pub.acl.user.ISysUser" %>
<%@ page import="com.nsneo.pub.acl.accessResources.arNode.ARItem" %>
<%@ page import="com.nsneo.pub.LoginMan" %>
<%@ page import="com.nsneo.pub.web.IWebContext" %>
<%@ page import="com.nsneo.pub.web.imp.WebContextImp" %>
<%@ page import="com.nsneo.pub.web.imp.HttpRequestMethod" %>
<%!
    private static long accessCounter = 0;
%>
<html>
<head>
    <title>系统测试页面</title>
</head>
<body>
<div><span style="font-weight: bold;">系统测试页面:</span>http://localhost:8080/test/test.jsp</div>
<div>
    访问次数:<%=accessCounter++%>
</div>
<div>
    测试日志:
    <%
        com.nsneo.pub.logger.LoggerFactory.getInstance().createLogger(this).info("这是测试页面调用日志输出");
    %>
</div>
<div>
    测试位置缺省上下文对象[LocaleContext]:
    <%

    %>
</div>


<div>
    测试缺省用户对象[LocaleContext]:
    <%
        SysConfigSet scs = SysConfigMan.getInstance().createSysConfig();
        if(scs!=null){
            if(scs.getSysRootAppOrgUser()!=null&&scs.getSysRootAppOrgUser().getRootUser()!=null){

                SysRootUser sysRootUser = scs.getSysRootAppOrgUser().getRootUser();
    %>
    <%=sysRootUser.getUserName()%>
    <%
        SysUserManFactory.getInstance().checkSysUser(sysRootUser.getUserLoginName(),sysRootUser.getUserDefaultPwd());
    }else{
    %>
    无法找到缺省用户
    <%
        }
    }else{
    %>
    无法找到配置文件
    <%
        }
    %>
</div>

<div>
    测试用户信息:
    <%
        ISysUser sysUser = SysUserManFactory.getInstance().loadSysUserByLoginName("zzm");
        if(sysUser==null){
    %>
    未找到用户
    <%
        }else{
            out.println(sysUser.getUserEntity().getUserName());
        }
    %>
</div>

<div>
    当前操作模块编码:
    <%
        IWebContext webContext = new WebContextImp(request,response, HttpRequestMethod.Post);
        String info="";
        ISysUser currentUser = LoginMan.getInstance().getWebLoginUser(webContext);
        if(currentUser!=null){
            ARItem arItem = currentUser.loadUserCurrentARItem(webContext);
            if(arItem!=null){
                info = "当前模块项["+arItem.getName()+"],["+arItem.getARItemFullId()+"]";
            }else{
                info="无当前模块!";
            }
        }else{
            info="无当前访问用户";
        }

    %>
    <%=info%>
</div>
</body>
</html>
