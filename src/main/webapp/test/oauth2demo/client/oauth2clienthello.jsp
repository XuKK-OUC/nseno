<%--
  Created by IntelliJ IDEA.
  User: zzm
  Date: 18/3/30
  Time: 13:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>oauth2服务端访问成功的回调页面</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <script type="text/javascript" src="../../../resources/pages/nsneobs/jquery.js"></script>
</head>
<body>
    <div>
        oauth2服务端访问成功的回调页面,code=<%=request.getParameter("code")%>
    </div>
    <div>
        <a href="http://localhost:8080/test/oauth2demo/client/oauth2client.jsp" target="_self">重新访问首页:http://localhost:8080/test/oauth2demo/client/oauth2client.jsp</a>
    </div>
    <div>
        token获得url:http://localhost:8080/sgser/oauth2democlient/callbackCode
    </div>
    <div>
        token 值:<span id="tokenvalue"></span>
    </div>

    <div>
        访问用户名：<span id="username"></span>
    </div>

    <script>
        $(function () {
            console.log('jquery 页面初始化,从服务端获取登录信息...');
            try{
                $.getJSON('http://localhost:8080/sgser/oauth2democlient/callbackCode?code=<%=request.getParameter("code")%>', function(result){
                    console.log('accessToken:'+result.accessToken)
                    $('#tokenvalue').html(result.accessToken);

                    //执行获得用户名
                    $.getJSON('http://localhost:8080/sgser/oauth2democlient/accessToken?accessToken='+result.accessToken, function(jsondata){
                        console.log('username:'+jsondata.username)
                        $('#username').html(jsondata.username);
                    });
                });
            }catch (e){
                console.log(e);
            }

        })
    </script>
</body>
</html>
