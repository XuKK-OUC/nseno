<%--
  Created by IntelliJ IDEA.
  User: zzm
  Date: 03月23日
  Time: 11:56
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Web页面聊天示例,基于WebSocket和MQ实现</title>
    <link rel="stylesheet" href="./../../resources/pages/nsneobs/bootstrap/css/bootstrap.css" />
    <link rel="stylesheet" href="./../../resources/pages/nsneobs/bowercomponents/metisMenu.css">
    <link rel="stylesheet" href="./../../resources/pages/nsneobs/bowercomponents/font-awesome.css" />
    <link rel="stylesheet" href="./../../resources/pages/nsneobs/nsneobs.css" />
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <style>
        .root-div{
            margin: 10px;
        }
        h5{
            margin-top: 0px; margin-bottom: 0px;
        }
        .p-error{
            color: red;
        }
        .p-send{
            color: green;
        }
        .p-recevice{
            color: #0d6aad;
        }
    </style>
</head>
<body>

<div class="root-div">

    <div class="row">
        <div class="col-lg-6">
            <div><span style="font-weight: bold;">Web页面聊天示例-基于WebSocket和MQ实现:</span>http://localhost:8080/test/msg/webMsgDemo.jsp</div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-6">

            <div class="panel panel-primary">
                <div class="panel-heading">
                    <h5>发送的数据</h5>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-lg-12">
                            <textarea id="SendMsgData" class="form-control" placeholder="写入发送的数据" style="height: 188px"></textarea>
                        </div>
                    </div>
                </div>
            </div>


        </div>

        <div class="col-lg-6">

            <div class="panel panel-green">
                <div class="panel-heading">
                    <h5>设置</h5>
                </div>
                <div class="panel-body">

                    <div class="row">

                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="Setting-ServerAddress">服务器地址</label>
                                <input type="text" class="form-control" name="Setting-ServerAddress" id="Setting-ServerAddress" value="ws://localhost:8080/DemoWebMsgSocketService"/>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="Setting-MsgTitle">消息主题</label>
                                <input type="text" class="form-control" name="Setting-MsgTitle" id="Setting-MsgTitle" value="chat"/>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="Setting-Sender">发送人</label>
                                <input type="text" class="form-control" name="Setting-Sender" id="Setting-Sender" value="周志明"/>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="Setting-Receiver">接收人</label>
                                <input type="text" class="form-control" name="Setting-Receiver" id="Setting-Receiver" value="李松"/>
                            </div>
                        </div>


                    </div>

                    <div class="row">
                        <div class="col-lg-12">
                            <button id="OpenServerBtn" class="btn btn-primary" type="button">建立连接</button>
                            <button id="CloseServerBtn" class="btn btn-danger" disabled="disabled" type="button">关闭连接</button>
                            <button id="SendDataBtn" class="btn btn-info" disabled="disabled" type="button">发送数据</button>
                            <button id="CleanDataBtn" class="btn btn-default" type="button">清除接收数据</button>
                        </div>
                    </div>

                </div>
            </div>

        </div>


    </div>



    <div class="panel panel-info">
        <div class="panel-heading">
            <h5>接收的数据</h5>
        </div>
        <div class="panel-body">
            <div id="recevice-data-div" class="">
                <p class="p-info">未接收到数据...</p>
            </div>
        </div>
    </div>
</div>


<script src="./../../resources/pages/nsneobs/jquery.js"></script>
<script src="./../../resources/pages/nsneobs/bootstrap/js/bootstrap.js"></script>
<script>

    var websocket = null;

    function outMessageToHtml(msg,type) {
        $("#recevice-data-div").append("<p class='"+type+"'>"+msg+"</p>");
    }

    $(function() {

        //本页面函数
        $("#OpenServerBtn").click(function () {
            //判断当前浏览器是否支持WebSocket
            if('WebSocket' in window){
                if(websocket==null){
                    try {

                        var url = $("#Setting-ServerAddress").val()+"?title="+$("#Setting-MsgTitle").val()+"&sender="+$("#Setting-Sender").val();
                        //$("#OpenServerBtn").popover({title:'消息',content:'连接的服务器地址是:'+url});

                        websocket = new WebSocket(url);

                        //连接发生错误的回调方法
                        websocket.onerror = function(){
                            outMessageToHtml("调用出错","p-error");
                        };

                        //连接成功建立的回调方法
                        websocket.onopen = function(event){
                            outMessageToHtml("打开socket链接","p-open");
                        }

                        //接收到消息的回调方法
                        websocket.onmessage = function(event){
                            outMessageToHtml(event.data,"p-recevice");
                        }

                        //连接关闭的回调方法
                        websocket.onclose = function(){
                            outMessageToHtml("关闭socket链接","p-close");
                        }

                        //$(this).popover({title:'我的消息',content:'我的消息'})
                        $("#OpenServerBtn").prop("disabled",true);
                        $("#CloseServerBtn").prop("disabled",false);
                        $("#SendDataBtn").prop("disabled",false);

                        //服务器地址禁用
                        $("#Setting-ServerAddress").prop("disabled",true);
                        //主题禁用
                        $("#Setting-MsgTitle").prop("disabled",true);
                        //发送者禁用
                        $("#Setting-Sender").prop("disabled",true);

                    }catch (e){
                        //$("#OpenServerBtn").popover({title:'消息',content:'发生连接错误:'+e.message});
                        outMessageToHtml('发生连接错误:'+e.message,"p-error");
                        $("#OpenServerBtn").prop("disabled",false);
                        $("#CloseServerBtn").prop("disabled",true);
                        $("#SendDataBtn").prop("disabled",true);


                        $("#Setting-ServerAddress").prop("disabled",false);
                        $("#Setting-MsgTitle").prop("disabled",false);
                        $("#Setting-Sender").prop("disabled",false);
                    }
                }else{
                    //$("#OpenServerBtn").popover({title:'消息',content:'已经建立远程连接,不能再次建立远程连接'});
                    outMessageToHtml('已经建立远程连接,不能再次建立远程连接',"p-error");
                    $("#OpenServerBtn").prop("disabled",true);
                    $("#CloseServerBtn").prop("disabled",false);
                    $("#SendDataBtn").prop("disabled",false);

                    $("#Setting-ServerAddress").prop("disabled",true);
                    $("#Setting-MsgTitle").prop("disabled",true);
                    $("#Setting-Sender").prop("disabled",true);

                }
            }
        })

        //关闭远程websocket连接
        $("#CloseServerBtn").click(function () {
            if(websocket!=null){
                try{
                    websocket.close();
                }catch (e){}
                websocket = null;
            }
            $("#OpenServerBtn").prop("disabled",false);
            $("#CloseServerBtn").prop("disabled",true);
            $("#SendDataBtn").prop("disabled",true);

            $("#Setting-ServerAddress").prop("disabled",false);
            $("#Setting-MsgTitle").prop("disabled",false);
            $("#Setting-Sender").prop("disabled",false);
        });

        $("#SendDataBtn").click(function () {
            try{
                var message=$("#SendMsgData").val();
                //$("#SendDataBtn").popover('hide');
                //alert(message);
                if($.trim(message)==""){
                    //$("#SendDataBtn").popover({title:'消息',trigger:'manual',content:'请输入发送的数据'});
                    //$("#SendDataBtn").popover('show');
                    outMessageToHtml('请输入发送的数据',"p-error");
                    return;
                }
                if(websocket!=null){
                    var msgstr = '{"title":"'+$("#Setting-MsgTitle").val()+'","sender":"'+$("#Setting-Sender").val()+'","receiver":"'+$("#Setting-Receiver").val()+'","message":"'+message+'"}'
                    websocket.send(msgstr);
                    outMessageToHtml('客户端发送的数据['+msgstr+']',"p-send");
                }
            }catch (e){
                //$("#SendDataBtn").popover({title:'消息',content:'数据发送错误:'+e.message});
                outMessageToHtml('数据发送错误:'+e.message,"p-error");
            }
        })


        //清除数据
        $("#CleanDataBtn").click(function () {
            $("#recevice-data-div").empty();
            $("#recevice-data-div").append("<p class='p-info'>未接收到数据...</p>");
        })
    });

</script>
</body>
</html>
