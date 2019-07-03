<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@ page import="addons.haier.sensors.imps.forJX.MainRun" %>
<%@ page import="addons.haier.sensors.imps.forJX.DigitalSensorsPackageImp" %>
<%@ page import="addons.haier.sensors.imps.forJX.DigitalSensorsBodyJinXiang" %>
<%@ page import="addons.haier.sensors.imps.forJX.DigitalSensorsValue" %>
<%@ page import="addons.haier.sensors.SensorsRTData" %>
<%@ page import="addons.haier.sensors.SensorsLocationData" %>
<%@ page import="addons.common.utils.hbase.HBaseManager" %>
<%@ page import="java.util.*" %>
<%@ page import="addons.haier.pub.CommonUtilFunction" %>
<%@ page import="addons.common.utils.hbase.IHBaseDataBase" %><%--
  Created by IntelliJ IDEA.
  User: zzm
  Date: 18/5/14
  Time: 15:07
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>HBase功能测试JPS页面</title>
</head>
<body>
<%
    String opType = request.getParameter("opType");
    if(StringUtils.isBlank(opType)){
        opType = "空";
    }

    String valueString = "";

    if(StringUtils.equalsIgnoreCase("add",opType)){
        try {
            insertDataToHbase();
        }catch (Exception e){
            e.printStackTrace();
            valueString = e.getMessage();
        }
    }else if(StringUtils.equalsIgnoreCase("query",opType)){
        valueString = queryDatas();
    }else{
        valueString = "未知或者空操作";
    }
%>
<div>
    <a href="http://localhost:8080/test/demo/hbasetest.jsp" target="_self">刷新-空操作</a>
    <br/>
    <a href="http://localhost:8080/test/demo/hbasetest.jsp?opType=add" target="_self">向hbase数据库中插入操作</a>
    <br/>
    <a href="http://localhost:8080/test/demo/hbasetest.jsp?opType=query" target="_self">从Hbase数据库查询操作</a>
</div>
<div>
    当前操作类型<h3 style="color: red"><%=opType%></h3>
</div>
<div>
    当前的结果值为:<br>
    <div style="color: #0a6ebd">
        <%=valueString%>
    </div>
</div>
</body>
</html>
<%!
    public void insertDataToHbase(){
        String uploadClientId= MainRun.DeviceId;//设备
        String uploadClientImei="161a3797c83db4e6f84";//设备
        String uploadClientSecret= MainRun.ClientSecret_Test;//一般不上传，存在本地,设备发放时和设备、本代码关联


        DigitalSensorsPackageImp dataPkg = new DigitalSensorsPackageImp();
        dataPkg.loadHeader().setUploadClientId(uploadClientId);
        dataPkg.loadHeader().setUploadClientImei(uploadClientImei);

        //设置上传时间YYYYMMDDHHMMSS
        dataPkg.loadHeader().setUploadTimestamp("20180418214388");
        //设置消息编码
        dataPkg.loadHeader().setMsgId(UUID.randomUUID().toString());

        //增加上传的数据对象
        DigitalSensorsBodyJinXiang body = new DigitalSensorsBodyJinXiang();
        body.setUnit("C");
        body.setSensorKey("AAA");
        body.getValues().add(new DigitalSensorsValue("20180418214388",1));
        body.getValues().add(new DigitalSensorsValue("20180418214388",2));

        dataPkg.getBodys().add(body);

        SensorsRTData rtData = new SensorsRTData(dataPkg.getHeader().getUploadClientId());
        rtData.getMainColFamily().getBodyKey().getSensorDatas().setBodyKey(dataPkg.simpleToJson());

        //将数据设置到位置库中
        List<SensorsLocationData> locationDataList = new ArrayList<>();

        for(DigitalSensorsBodyJinXiang jinXiang:dataPkg.getBodys()){
            SensorsLocationData locationData = new SensorsLocationData(jinXiang.getSensorPositionKey());
            locationData.getMainColFamily().getBodyKey().getSensorsId().setBodyKey(jinXiang.getSensorKey());
            locationData.getMainColFamily().getBodyKey().getLocationCaption().setBodyKey(jinXiang.simpleToJson());
        }

        //保存运行时数据表和位置表
        HBaseManager.builder().insert(rtData).insertlt(locationDataList).end();
    }
%>
<%!
    String queryDatas(){
        SensorsRTData hBaseData = new SensorsRTData(MainRun.DeviceId);

        Calendar cd = Calendar.getInstance();
        cd.set(Calendar.DAY_OF_MONTH,cd.get(Calendar.DAY_OF_MONTH)-1);
        BitSet bitSet = new BitSet(7);
        bitSet.set(0,false);//毫秒
        bitSet.set(1,false);//秒
        bitSet.set(2,false);//分
        bitSet.set(3,false);//时
        bitSet.set(4,true);//日
        bitSet.set(5,true);//月
        bitSet.set(6,true);//年
        String beginTime = CommonUtilFunction.timeFormatTimestamp(cd,bitSet);
        Calendar ecd = Calendar.getInstance();
        ecd.set(Calendar.DAY_OF_MONTH,ecd.get(Calendar.DAY_OF_MONTH)+1);

        String endTime = CommonUtilFunction.timeFormatTimestamp(ecd,bitSet);

        String beginRowKey = hBaseData.formatRowKey(MainRun.DeviceId,"",beginTime);
        String endRowKey = hBaseData.formatRowKey(MainRun.DeviceId,"",endTime);

        //
        System.out.println("开始:"+beginRowKey+",结束:"+endRowKey);

        List<? extends SensorsRTData> lt = HBaseManager.builder().queryTableByCondition(hBaseData.getClass(),beginRowKey,endRowKey);
        System.out.println("lt.size="+lt.size());
        StringBuilder sb = new StringBuilder();
        for(IHBaseDataBase currentData:lt){
            System.out.println("sensor id:"+currentData.getEntityKey()+",rowkey:"+currentData.getRowKey());
            sb.append("sensor id:"+currentData.getEntityKey()+",rowkey:"+currentData.getRowKey()+"<br/>\n");

        }
        return sb.toString();
    }
%>
