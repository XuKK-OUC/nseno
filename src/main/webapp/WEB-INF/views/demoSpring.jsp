<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>这是第二个SpringMVC页面</title>
</head>
<body>
<div>

    <ul>
        <li>配置信息:</li>
        <li>在web.xml 中配置 springService</li>
        <li>增加类 addons.samples.springmvc.control.HomeController</li>
        <li>访问：http://localhost:8080/sgser/home/demo.html</li>
    </ul>
</div>
<p>这是第二个springmvc [Demo] 页面</p>
<p>这是ServiceBeans输出的信息[${ServiceInfo}]</p>
<p>用户管理工厂名称:${SysUserManFactory}</p>
</body>
</html>
