<%--
  Created by IntelliJ IDEA.
  User: zzm
  Date: 18/5/18
  Time: 11:44
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Spring MVC Restful 风格控制器前端示例</title>

    <link rel="stylesheet" href="./../../resources/pages/nsneobs/bootstrap/css/bootstrap.css" />
    <link rel="stylesheet" href="./../../resources/pages/nsneobs/bowercomponents/metisMenu.css">
    <link rel="stylesheet" href="./../../resources/pages/nsneobs/bowercomponents/font-awesome.css" />

    <script src="./../../resources/pages/nsneobs/jquery.js"></script>
    <script src="./../../resources/pages/nsneobs/bootstrap/js/bootstrap.js"></script>
</head>
<body>
<div>
    <h3>本页地址:</h3><span>http://localhost:8080/test/demo/springRestfulPost.jsp</span>
</div>
<div>
    <h3>Restful数据提交地址:</h3><span>http://localhost:8080/sgser/smrestdemo/jspRestfulJson</span>
</div>
<div id="page-wrapper">
    <div id="page-wrapper-content" style="margin: 20px;">

        <div class="row">
            <div class="panel panel-primary">
                <div class="panel-heading" style="text-align: center;"><strong>Restful接口提交</strong></div>
                <div class="panel-body">

                    <form id="mainform">
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="">名称</label>
                            <input class="form-control" type="text" id="name" name="name" value="">
                        </div>
                        <div class="col-sm-6">
                            <label class="">编码</label>
                            <input class="form-control" type="text" id="code" name="code" value="">
                        </div>
                    </div>
                    </form>

                    <div class="row" style="margin-top: 5px">
                        <div class="col-sm-12">
                            <button class="btn btn-default" type="button" id="submitToRestfulServer">
                                <i class="fa fa-search"></i>提交数据
                            </button>
                        </div>
                    </div>

                    <div id="info" class="row" style="margin: 5px;color: #0a8c68">
                        从服务器获得的数据信息
                    </div>

                </div>
            </div>
        </div>

    </div>
</div>
<script>
    var targetURL = "http://localhost:8080/sgser/smrestdemo/jspRestfulJson";

    //json对象----- >>字符串
    //JSON.stringify(obj)
    //json字符串------>>json对象
    //JSON.parse(string)

    $(function () {
       $('#submitToRestfulServer').click(function () {
           /*
           $.ajax({
               type: 'post',
               url: targetURL,
               contentType: 'application/json;charset=utf-8;',
               data: '{"name": "'+$('#name').val()+'", "code": "'+$('#code').val()+'"}',
               success: function (data) { //返回json结果
                   //alert(data);
                   console.log(data);
                   $('#info').html(JSON.stringify(data));
               }
           });*/

           $.ajax({
               type: 'post',
               url: targetURL,
               data: $("form").serialize(),
               success: function (data) { //返回json结果
                   //alert(data);
                   console.log(data);
                   $('#info').html(JSON.stringify(data));
               }
           });
       }) ;
    });
</script>
</body>
</html>
