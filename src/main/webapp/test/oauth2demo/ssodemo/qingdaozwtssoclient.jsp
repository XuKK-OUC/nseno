<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="java.net.URI" %>
<%@ page import="org.apache.http.client.utils.URIBuilder" %>
<%@ page import="org.apache.http.client.methods.HttpGet" %>
<%@ page import="org.apache.http.impl.client.CloseableHttpClient" %>
<%@ page import="org.apache.http.impl.client.HttpClients" %>
<%@ page import="org.apache.http.client.methods.CloseableHttpResponse" %>
<%@ page import="org.apache.http.HttpEntity" %>
<%@ page import="org.apache.http.util.EntityUtils" %>
<%@ page import="java.io.IOException" %><%--
  Created by IntelliJ IDEA.
  User: zzm
  Date: 18/4/1
  Time: 7:56
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>简单单点登录实现示例</title>
</head>
<body>
<%
    //定义单点登录服务器地址
    String ssoServer = "https://puser.qingdao.gov.cn:9001/login?client_id=CLIENT_ID&response_type=code&scope=openid";
    String tokenServer = "http://117.50.19.70:9999/smart-sso-server";
    String userServer = "http://117.50.19.70:9999/smart-sso-server";
%>
<div class="titlediv">
    <table>
        <tr><td>本页地址</td><td>http://localhost:8080/test/oauth2demo/ssodemo/qingdaozwtssoclient.jsp</td></tr>
        <tr><td>服务器地址</td><td>http://117.50.19.70:9999/smart-sso-server</td></tr>
        <tr><td>登录名</td><td>test1</td></tr>
        <tr><td>密码</td><td>123123</td></tr>
    </table>
</div>

<%
    //测试是否有请求码
    String code = request.getParameter("code");
    if(StringUtils.isBlank(code)){
        //不存在请求码参数
        //需要测试是否是已经登录的

        //获得用户信息
        String user = (String)request.getSession().getAttribute("user");
        if(StringUtils.isBlank(user)){
            //未登录或者登陆后失效
            //重定向到sso登录系统
            response.setStatus(302);
            response.setHeader("location",ssoServer+"&redirect_uri=http://localhost:8080/test/oauth2demo/ssodemo/qingdaozwtssoclient.jsp");
            return;
        }else{
            //已登录,正常显示
%>
<div>
    用户已登录:用户名为<%=user%>
</div>

<%
        }

    }else{
        System.out.println("客户端获得了code:"+code);
        //存在请求码参数,从sso服务中获得token
        //String tokenRequest = tokenServer+"?code="+code;
            /*URI uri = new URIBuilder()
                    .setScheme("http")
                    .setHost("www.google.com")
                    .setPath("/search")
                    .setParameter("q", "httpclient")
                    .setParameter("btnG", "Google Search")
                    .setParameter("aq", "f")
                    .setParameter("oq", "")
                    .build();
            HttpGet httpget = new HttpGet(uri);
            System.out.println(httpget.getURI());
        */
            //从服务器中获得token值
        String tokenValue = getTokenValue(tokenServer,code);
        if(StringUtils.isBlank(tokenValue)){
            %>
<div>
    无法从服务器中获得token值
</div>
<%
        }else{
            //从服务器中获得user信息
            String user = getUser(userServer,tokenValue);
            if(StringUtils.isBlank(user)){
                %>
<div>从服务器中获得了token:<%=tokenValue%>,但是无法获得user信息</div>
<%
            }else{
                request.getSession().setAttribute("user",user);
                %>
<div>从服务器中获得了token:<%=tokenValue%>,获得user:<%=user%>,并设置了session</div>
<%
            }

        }
    }


%>

</body>
</html>
<%!
    String getUser(String userServer,String tokenValue){

        String tokenRequest = userServer+"?token="+tokenValue;
        HttpGet httpget = new HttpGet(tokenRequest);
        CloseableHttpClient httpclient = HttpClients.createDefault();
        CloseableHttpResponse httpResponse = null;
        try {
            httpResponse =  httpclient.execute(httpget);

            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                //从token服务器获得token值
                String user = EntityUtils.toString(entity);

                if(StringUtils.isNotBlank(user)&&user.length()>1000){
                    return "";
                }
                System.out.println("从服务器中获得的user为:"+user);
                return user;
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        finally {
            try {
                if(httpResponse!=null){
                    httpResponse.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return "";
    }
%>
<%!
    String getTokenValue(String tokenServer,String code){
        String tokenRequest = tokenServer+"?code="+code;
        HttpGet httpget = new HttpGet(tokenRequest);
        CloseableHttpClient httpclient = HttpClients.createDefault();
        CloseableHttpResponse httpResponse = null;
        try {
            httpResponse =  httpclient.execute(httpget);

            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                //从token服务器获得token值
                String tokenValue = EntityUtils.toString(entity);
                System.out.println("从服务器中获得的tokenValue为:"+tokenValue);

                if(StringUtils.isNotBlank(tokenValue)&&tokenValue.length()>1000){
                    return "";
                }

                return tokenValue;
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        finally {
            try {
                if(httpResponse!=null){
                    httpResponse.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return "";
    }
%>
