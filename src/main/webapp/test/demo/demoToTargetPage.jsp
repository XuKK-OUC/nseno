<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>目标提交页面</title>
</head>
<body>


<div style="border:1px solid #c0c0c0;margin-top: 10px">
    <h2>测试 超链接 non-blocking servlet 提交</h2>
    <a href="http://localhost:8080/asyncServletdemo?name=zzm">提交地址为：http://localhost:8080/asyncServletdemo?name=zzm</a>

</div>

<div style="border:1px solid #c0c0c0;margin-top: 10px">
    <h2>测试 文本提交，失败 non-blocking servlet 提交</h2>
    <h4>访问地址为：http://localhost:8080/test/demo/demoToTargetPage.jsp</h4>
    <h4>提交地址为：http://localhost:8080/asyncServletdemo</h4>

    <form action="/asyncServletdemo" method="post">
        <input type="text" name="name" value="zzm">
        <input type="submit" value="提交">
    </form>
</div>

<div style="border:1px solid #c0c0c0;margin-top: 10px">
    <h2>测试 二进制流提交[multipart/form-data] 失败 non-blocking servlet 提交</h2>
    <h4>访问地址为：http://localhost:8080/test/demo/demoToTargetPage.jsp</h4>
    <h4>提交地址为：http://localhost:8080/asyncServletdemo</h4>

    <form enctype="multipart/form-data" action="/asyncServletdemo" method="post">
        <input type="text" name="name" value="zzm">
        <input type="submit" value="提交">
    </form>
</div>

<hr>

<div style="border:1px solid #c0c0c0;margin-top: 10px">
    <h2>测试 超链接 non-blocking servlet 提交</h2>
    <a href="http://localhost:8080/asyncServletWorkdemo?name=zzm">提交地址为：http://localhost:8080/asyncServletWorkdemo?name=zzm</a>

</div>

<div style="border:1px solid #c0c0c0;margin-top: 10px">
    <h2>测试 文本提交，失败 non-blocking servlet 提交</h2>
    <h4>访问地址为：http://localhost:8080/test/demo/demoToTargetPage.jsp</h4>
    <h4>提交地址为：http://localhost:8080/asyncServletWorkdemo</h4>

    <form action="/asyncServletWorkdemo" method="post">
        <input type="text" name="name" value="zzm">
        <input type="submit" value="提交">
    </form>
</div>

<div style="border:1px solid #c0c0c0;margin-top: 10px">
    <h2>测试 二进制流提交[multipart/form-data] 失败 non-blocking servlet 提交</h2>
    <h4>访问地址为：http://localhost:8080/test/demo/demoToTargetPage.jsp</h4>
    <h4>提交地址为：http://localhost:8080/asyncServletWorkdemo</h4>

    <form enctype="multipart/form-data" action="/asyncServletWorkdemo" method="post">
        <input type="text" name="name" value="zzm">
        <input type="submit" value="提交">
    </form>
</div>

<hr>

<div style="border:1px solid #c0c0c0;margin-top: 10px">
    <h2>测试 二进制流提交[multipart/form-data] non-blocking servlet 提交</h2>
    <h4>访问地址为：http://localhost:8080/test/demo/demoToTargetPage.jsp</h4>
    <h4>提交地址为：http://localhost:8080/DemoNonBlockUploadServlet</h4>

    <form enctype="multipart/form-data" method="post" action="/DemoNonBlockUploadServlet">
        <label>文件上传</label>
        <input type="file" name="fileToUpload" onchange="fileSelected();">
        <div id="fileName"></div>
        <div id="fileType"></div>
        <div id="fileSize"></div>
        <div>
            <input type="submit" value="上传">
        </div>
    </form>
    <script type="text/javascript">
        function fileSelected() {
            var file = document.getElementById('fileToUpload').files[0];
            if (file) {
                var fileSize = 0;
                if (file.size > 1024 * 1024)
                    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                else
                    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
                document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
                document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
            }
        }
    </script>
</div>


<div style="border:1px solid #c0c0c0;margin-top: 10px">
    <h2>测试 二进制流提交[multipart/form-data] non-blocking servlet 提交</h2>
    <h4>访问地址为：http://localhost:8080/test/demo/demoToTargetPage.jsp</h4>
    <h4>提交地址为：http://localhost:8080/DemoNonBlockUploadServlet</h4>

    <form action="/DemoNonBlockUploadServlet" method="post">
        <input type="text" name="name" value="zzm">
        <input type="submit" value="提交">
    </form>
</div>

</body>
</html>
