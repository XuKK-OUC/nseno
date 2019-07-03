<%@ page import="org.springframework.SpringContextUtil" %>
<%@ page import="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>这是一个SpringMVC页面</title>
</head>
<body>

<div>

    <ul>
        <li>配置信息:</li>
        <li>在web.xml 中配置 springService</li>
        <li>增加类 addons.samples.springmvc.control.HomeController</li>
        <li>访问：http://localhost:8080/sgser/home/hello</li>
    </ul>
</div>

<p>这是一个springmvc 页面</p>
<p>这是ServiceBeans输出的信息[${ServiceInfo}]</p>
<p>用户管理工厂名称:${SysUserManFactory}</p>

<%
if(SpringContextUtil.getApplicationContext()==null){


%>
<p>用户系统应用程序上下文对象为空</p>
<%


}else{
%>
<p>用户系统应用程序上下文对象不为空:<%=SpringContextUtil.getApplicationContext().hashCode()%></p>
<%
        LocalContainerEntityManagerFactoryBean containerEntityManagerFactoryBean = SpringContextUtil.getApplicationContext().getBean(LocalContainerEntityManagerFactoryBean.class);
        if(containerEntityManagerFactoryBean!=null){
%>
<p>找到Spring容器管理的JPA实体管理器对象:<%=containerEntityManagerFactoryBean.hashCode()%></p>
<%
        }else{
%>
<p>未找到Spring容器管理的JPA实体管理器对象</p>

<%
        }
}
%>

</body>
</html>
