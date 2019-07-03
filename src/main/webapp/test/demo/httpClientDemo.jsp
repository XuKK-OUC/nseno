
<%@page contentType="text/html;charset=UTF-8" language="java" %>
<%@page import="com.sun.xml.ws.client.BindingProviderProperties"%>
<%@page import="java.util.*"%>
<%@page import="java.io.*"%>
<%@page import="org.apache.commons.httpclient.*"%>
<%@page import="org.apache.commons.httpclient.methods.*"%>
<%
    request.setCharacterEncoding("UTF-8");
    String url = request.getParameter("url")==null?"":request.getParameter("url");
    String message = request.getParameter("message")==null?"":request.getParameter("message");
    String result = "";

    try {
        //call service
        if(url!=null && !"".equals(url)) {
            PostMethod postMethod = new PostMethod(url);
            byte[] bytes = message.getBytes("UTF-8");
            InputStream inputStream = new ByteArrayInputStream(bytes, 0,
                    bytes.length);
            RequestEntity requestEntity = new InputStreamRequestEntity(inputStream,
                    bytes.length, "application/soap+xml; charset=utf-8");
            postMethod.setRequestEntity(requestEntity);
            //设置header
            postMethod.setRequestHeader("OperationCode","com.mss.jt.cf.interfaces.SI_CF_YCHD_BALANCE_OUT_SynService");
            postMethod.setRequestHeader("ClientId","com.mss.js.cf");
            postMethod.setRequestHeader("TransactionId","B6B7B99D928B8581F92C4CBAEF3075F31508DB7F0BF856736A8AEBC25ADE69A0");
            // 用户名密码：zpiappluser:zpiappl

            //设置 Authorization
            postMethod.setRequestHeader("Authorization", " Basic "
                    + (new sun.misc.BASE64Encoder()).encode("zpiappluser:zpiappl"
                    .getBytes()));
            HttpClient httpClient = new HttpClient();

            int statusCode = httpClient.executeMethod(postMethod);
            bytes = postMethod.getResponseBody();
            result = new String(bytes,"UTF-8");
        }
    }catch(Exception e) {
        e.printStackTrace();
        result= "异常："+e.getMessage();
    }
%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
    <META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
    <META HTTP-EQUIV="Expires" CONTENT="0">
</head>
<body>
<form id="form1" name="form1" method="POST" action="./test3.jsp">
    url:<input type="text" name="url" style="width:600px" value="<%=(url!=null && !"".equals(url))?url:"http://132.228.26.15:29200/jt/wl/SDMS_ESB_INTEGRATION?wsdl"%>" ><p>
    message:<textArea name="message"  cols="100" rows="5"><%=message%></textArea>
    <p>
        result:<textArea name="result" cols="100" rows="5"><%=result%></textArea>
    <p>
        <button type="button" onclick="javascript:return dosubmit();" >提交</button>
</form>
</body>
<script type="text/javascript">
    <!--
    function dosubmit() {
        if(document.form1.url.value=="") {
            alert("请输入url！");
            document.form1.url.focus();
            return;
        }
        document.form1.submit();
    }
    //-->
</script>
</html>