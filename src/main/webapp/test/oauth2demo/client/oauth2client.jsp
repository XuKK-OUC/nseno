<%--
  Created by IntelliJ IDEA.
  User: zzm
  Date: 18/3/30
  Time: 12:46
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>OAuth2客户端界面</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <script type="text/javascript" src="../../../resources/pages/nsneobs/jquery.js"></script>
</head>
<body>
    <div>这是一个OAuth2客户端界面</div>
    <div>初始访问地址为：http://localhost:8080/test/oauth2demo/client/oauth2client.jsp</div>
    <div>校验访问地址为[rest,json]：http://localhost:8080/sgser/oauth2democlient/login</div>
    <div>由oauth2服务器地址为[采用直接重定向方法]：http://localhost:8080/sgser/oauth2demoserver/responseCode</div>
    <div id="CurrentUserName"></div>

    <script>
        $(function () {
            console.log('jquery 页面初始化,从服务端获取登录信息...');
            try{
                $.getJSON('http://localhost:8080/sgser/oauth2democlient/login', function(result){
                    console.log('是否重定向:'+result.redirect)
                    if(result.redirect){
                        window.open(result.url,'_self')
                    }
                });
            }catch (e){
                console.log(e);
            }

        })
    </script>
</body>
</html>
