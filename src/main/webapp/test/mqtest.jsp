<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="addons.samples.mq.pub.Sender" %>
<%@ page import="addons.samples.mq.sub.Receiver" %>
<%@ page import="addons.samples.mq.SpringSender" %>
<%@ page import="addons.samples.mq.SpringReceiver" %><%--
  Created by IntelliJ IDEA.
  User: zzm
  Date: 02月20日
  Time: 20:12
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>消息中间件测试</title>
</head>
<body>
<%
    String dosometing = request.getParameter("doSomething");
    if(StringUtils.equalsIgnoreCase(dosometing,"send")){
        System.out.println("调用发送消息");
        try{
            Sender.linkServerSendMsg();
        }catch (Exception e){
            e.printStackTrace();
        }
    }else if(StringUtils.equalsIgnoreCase(dosometing,"receive")){
        System.out.println("调用接收消息");
        try{
            Receiver.getMsg();
        }catch (Exception e){
            e.printStackTrace();
        }
    }else if(StringUtils.equalsIgnoreCase(dosometing,"addListener")){
        System.out.println("注册事件监听器监听消息推送");
        try{
            Receiver.regListenerMsg(true,"","");
        }catch (Exception e){
            e.printStackTrace();
        }
    }else if(StringUtils.equalsIgnoreCase(dosometing,"springsend")){
        System.out.println("Spring调用发送消息");
        try{
            SpringSender.linkServerSendMsg();
        }catch (Exception e){
            e.printStackTrace();
        }
    }else if(StringUtils.equalsIgnoreCase(dosometing,"springreceive")){
        System.out.println("Spring调用接收消息");
        try{
            SpringReceiver.getMsg();
        }catch (Exception e){
            e.printStackTrace();
        }
    }else if(StringUtils.equalsIgnoreCase(dosometing,"springsenttopic")){
        System.out.println("Spring调用发送发布者订阅者消息");
        try{
            SpringSender.linkServerSendTopicMsg();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
%>
<div><span style="font-weight: bold;">消息中间件测试地址:</span>http://localhost:8080/test/mqtest.jsp</div>
<div>
    <a href="./mqtest.jsp" target="_self">重置</a>
</div>

<div>
    <a href="./mqtest.jsp?doSomething=addListener" target="_self">注册事件监听器监听消息推送</a>
</div>

<div>
    <a href="./mqtest.jsp?doSomething=send" target="_self">调用发送消息</a>
</div>

<div>
    <a href="./mqtest.jsp?doSomething=receive" target="_self">调用接收消息</a>
</div>

<hr/>

<div>
    <a href="./mqtest.jsp?doSomething=springsend" target="_self">Spring调用发送消息</a>
</div>

<div>
    <a href="./mqtest.jsp?doSomething=springreceive" target="_self">Spring调用接收消息</a>
</div>

<div>
    <a href="./mqtest.jsp?doSomething=springsenttopic" target="_self">Spring调用发送发布者订阅者消息</a>
</div>

</body>
</html>
