<%@ page import="com.nsneo.pub.web.IWebContext" %>
<%@ page import="com.nsneo.pub.LoginMan" %>
<%@ page import="com.nsneo.pub.acl.user.ISysUser" %>
<%@ page import="com.nsneo.pub.web.imp.WebContextImp" %>
<%@ page import="com.nsneo.pub.web.imp.HttpRequestMethod" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<%
    IWebContext webContext = new WebContextImp(request,response, HttpRequestMethod.Post);
%>
<body>
<div>
    当前系统登录用户:<span style="color: red">
      <%
          ISysUser user = LoginMan.getInstance().getWebLoginUser(webContext);
          if(user!=null){
              out.print(user.getUserEntity().getUserName());
          }else{
              out.print("未找到登录用户！");
          }
      %>
      </span>
</div>
</body>
</html>
