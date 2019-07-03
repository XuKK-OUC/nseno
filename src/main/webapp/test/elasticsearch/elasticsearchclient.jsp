<%--
  Created by IntelliJ IDEA.
  User: zzm
  Date: 18/3/31
  Time: 12:48
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>elasticsearch客户端</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <script type="text/javascript" src="../../resources/pages/nsneobs/jquery.js"></script>
</head>
<body>
    <h1>elasticsearch 全文检索客户端</h1>
    <a href="http://localhost:8080/test/elasticsearch/elasticsearchclient.jsp" target="_self">本页地址:http://localhost:8080/test/elasticsearch/elasticsearchclient.jsp</a>
    <div>
        启动服务器elasticsearch(E:\app\db\elasticsearch-6.2.2\bin)：$ ./bin/elasticsearch
    </div>
    <pre>
        <code style="background-color: #F4F4F4">
            IndexResponse response = client.prepareIndex("msg", "tweet", "1").setSource(XContentFactory.jsonBuilder()
                .startObject().field("userName", "张三")
                .field("sendDate", new Date())
                .field("msg", "你好李四")
                .endObject()).get();
        </code>
    </pre>

    <div>
        调用基于rest方式的springmvc服务器接口，返回处理是否成功<br>
        http://localhost:8080/sgser/elasticsearchdemo/addDataToElasticsearchServer<br>
        加入成功后,使用命令行查看数据: curl 'http://localhost:9200/msg/tweet/1?pretty=true'
    </div>
    <button id="addJsonToElasticsearch">加入json数据</button>
    <div id="statearea" style="color: red"></div>
    <script>
        $(function () {
            console.log('这是一个jquery加载绑定项');
            $('#addJsonToElasticsearch').click(function () {
                console.log('点击按钮加入json数据');

                $.getJSON('http://localhost:8080/sgser/elasticsearchdemo/addDataToElasticsearchServer',function (jsondata) {
                    if(jsondata.state=='succ'){
                        $('#statearea').html('加入成功');
                    }else{
                        $('#statearea').html('加入失败');
                    }
                })
            });
        })
    </script>
</body>
</html>
