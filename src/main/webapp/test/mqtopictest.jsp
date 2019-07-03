<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="addons.samples.mq.pub.TopicProducer" %>
<%@ page import="addons.samples.mq.sub.TopicReceiver_Receive" %>
<%@ page import="addons.samples.mq.sub.TopicReceiver_Listener" %><%--
  Created by IntelliJ IDEA.
  User: zzm
  Date: 02月20日
  Time: 20:12
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>消息中间件测试-主题发布</title>
</head>
<body>
<%
    String dosometing = request.getParameter("doSomething");
    if(StringUtils.equalsIgnoreCase(dosometing,"send")){
        System.out.println("调用发送消息");
        try{
            TopicProducer.linkServerSendMsg();
        }catch (Exception e){
            e.printStackTrace();
        }
    }else if(StringUtils.equalsIgnoreCase(dosometing,"receive")){
        System.out.println("调用接收消息");
        try{
            TopicReceiver_Receive.getMsg();
        }catch (Exception e){
            e.printStackTrace();
        }
    }else if(StringUtils.equalsIgnoreCase(dosometing,"addListener")){
        System.out.println("注册事件监听器监听消息推送");
        try{
            TopicReceiver_Listener.regListenerMsg();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
%>
<div><span style="font-weight: bold;">消息中间件测试-主题发布:</span>http://localhost:8080/test/mqtopictest.jsp</div>
<div>
    <a href="./mqtopictest.jsp" target="_self">重置</a>
</div>

<div>
    <a href="./mqtopictest.jsp?doSomething=addListener" target="_self">注册事件监听器监听消息推送</a>
</div>

<div>
    <a href="./mqtopictest.jsp?doSomething=send" target="_self">调用发送消息</a>
</div>

<div>
    <a href="./mqtopictest.jsp?doSomething=receive" target="_self">调用接收消息</a>
</div>

</body>
</html>
