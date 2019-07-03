<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket测试页面</title>
</head>
<body>
<h1>WebSocket测试页面</h1>
<div><span style="font-weight: bold;">WebSocket测试页面:</span>http://localhost:8080/test/webSocketTest.jsp</div>

<a href="http://blog.chenzuhuang.com/archive/28.html" target="_blank">Java后端WebSocket的Tomcat实现</a><br/>
<a href="http://www.jdon.com/idea/javaee7/websocket.html" target="_blank">jdon WebSocket详解</a><br/>
<a href="http://www.cnblogs.com/davidwang456/p/4786636.html" target="_blank">WebSocket 实战</a><br/>
<a href="http://www.cnblogs.com/dtdnh520/archive/2010/11/09/1873095.html" target="_blank">一起来用Websocket</a><br/>
<a href="http://blog.csdn.net/afer198215/article/details/20401953" target="_blank">tomcat8+websocket演示</a><br/>
<a href="http://www.cnblogs.com/wei2yi/archive/2011/03/23/1992830.html" target="_blank">认识HTML5的WebSocket</a><br/>
<br/>

<div>
    Socktet地址:<input type="text" readonly="readonly" value="ws://localhost:8080/wsecho" id="socketAddress" name="socketAddress">
</div>
<div>
    需要发送的数据:<input type="text" value="这是发送的文本..." id="sendTxt" name="sendTxt">
</div>
<br/>
<button onclick="create()">创建WebSocket连接</button>
<button onclick="send()">发送数据</button>
<button onclick="closeWebSocket()">关闭Socket</button>
<div id="message"></div>
<script type="text/javascript">
    var websocket = null;

    //创建Socket连接
    function create() {
        //判断当前浏览器是否支持WebSocket
        if('WebSocket' in window){
            websocket = new WebSocket(document.getElementById('socketAddress').value);
        }
        else{
            alert('Not support websocket')
        }

        //连接发生错误的回调方法
        websocket.onerror = function(){
            setMessageInnerHTML("error");
        };

        //连接成功建立的回调方法
        websocket.onopen = function(event){
            setMessageInnerHTML("open");
        }

        //接收到消息的回调方法
        websocket.onmessage = function(event){
            setMessageInnerHTML(event.data);
        }

        //连接关闭的回调方法
        websocket.onclose = function(){
            setMessageInnerHTML("close");
        }

        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function(){
            websocket.close();
        }
    }

    //将消息显示在网页上
    function setMessageInnerHTML(innerHTML){
        document.getElementById('message').innerHTML += innerHTML + '<br/>';
    }

    //关闭连接
    function closeWebSocket(){
        websocket.close();
    }

    //发送消息
    function send(){
        var message = document.getElementById('sendTxt').value;
        websocket.send(message);
    }
</script>
</body>
</html>
