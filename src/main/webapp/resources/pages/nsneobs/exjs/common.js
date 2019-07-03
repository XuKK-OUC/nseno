/**
 * Created by zzm on 16/7/8.
 */
/*通用系统函数部分*/
/**************************************************************************************************************************/
//全局默认设置ajax的异步还是同步
_Common_Flag_Ajax_Async = true;

/*校验form对象中的数据是否符合要求*/
function checkFormValidationInfo(formObj) {

    if (formObj) {
        formObj.find(".required").each(function() {
            if ($(this).attr("disabled") == true || $(this).attr("disabled") == "disabled") {
            } else {
                if (!$(this).val() || $.trim($(this).val()) == "") {
                    var msg = $(this).attr("requiredinfo");
                    if (!msg || $.trim(msg) == "") {
                        msg = "数据不能为空";
                    }
                    $(this).focus();
                    throw new Error(msg);
                }
            }
        });

        formObj.find(".checkfield").each(function() {
            var fieldObj = this;
            var datatype = $(this).attr("datatype");
            var datatypeinfo = $(this).attr("datatypeinfo");

            //调用数据校验函数
            var datatypefun = $(this).attr("datatypefun");
            if (!(("undefined" == typeof datatypefun) || !datatypefun)) {
                if (!eval(datatypefun + "(fieldObj)")) {
                    throw new Error(datatypeinfo);
                }
            } else {
                if (datatype == "string") {
                    if (!checkStringField(fieldObj, datatypeinfo)) {
                        throw new Error(datatypeinfo);
                    }
                } else if (datatype == "int") {
                    if (!checkIntField(fieldObj, datatypeinfo)) {
                        throw new Error(datatypeinfo);
                    }
                } else if (datatype == "ip") {
                    if (!checkIpField(fieldObj, datatypeinfo)) {
                        throw new Error(datatypeinfo);
                    }
                }else if (datatype == "email") {

                    if (!checkEmail(fieldObj, datatypeinfo)) {
                        throw new Error(datatypeinfo);
                    }
                }else if(datatype =="plusfloat"){
                    if (!checkPlusFloatField(fieldObj, datatypeinfo)) {
                        throw new Error(datatypeinfo);
                    }
                }else if(datatype =="float"){
                    if (!checkFloatField(fieldObj, datatypeinfo)) {
                        throw new Error(datatypeinfo);
                    }
                } else {
                    if (!checkStringField(fieldObj, datatypeinfo)) {
                        throw new Error(datatypeinfo);
                    }
                }
            }

        });
    } else {
        return "";
    }

    return "";
}

/*校验form对象中的数据是否符合要求*/
function checkFormValidation(formObj) {

    if (formObj) {
        try {
            formObj.find(".required").each(function() {

                if ($(this).attr("disabled") == true || $(this).attr("disabled") == "disabled") {

                } else {
                    if (!$(this).val() || $.trim($(this).val()) == "") {
                        var msg = $(this).attr("requiredinfo");
                        if (!msg || $.trim(msg) == "") {
                            msg = "数据不能为空";
                        }
                        alert(msg);
                        $(this).focus();
                        throw new Error(msg);
                    }
                }

            });

            formObj.find(".checkfield").each(function() {
                var fieldObj = this;
                var datatype = $(this).attr("datatype");
                var datatypeinfo = $(this).attr("datatypeinfo");

                //调用数据校验函数
                var datatypefun = $(this).attr("datatypefun");
                if (!(("undefined" == typeof datatypefun) || !datatypefun)) {
                    if (!eval(datatypefun + "(fieldObj)")) {
                        throw new Error(datatypeinfo);
                    }
                } else {
                    if (datatype == "string") {
                        if (!checkStringField(fieldObj, datatypeinfo)) {
                            throw new Error(datatypeinfo);
                        }
                    } else if (datatype == "int") {
                        if (!checkIntField(fieldObj, datatypeinfo)) {
                            throw new Error(datatypeinfo);
                        }
                    } else if (datatype == "ip") {
                        if (!checkIpField(fieldObj, datatypeinfo)) {
                            throw new Error(datatypeinfo);
                        }
                    } else if (datatype == "email") {
                        if (!checkEmail(fieldObj, datatypeinfo)) {
                            throw new Error(datatypeinfo);
                        }
                    } else if(datatype =="plusfloat"){
                        if (!checkPlusFloatField(fieldObj, datatypeinfo)) {
                            throw new Error(datatypeinfo);
                        }
                    }else if(datatype =="float"){
                        if (!checkFloatField(fieldObj, datatypeinfo)) {
                            throw new Error(datatypeinfo);
                        }
                    }else {
                        if (!checkStringField(fieldObj, datatypeinfo)) {
                            throw new Error(datatypeinfo);
                        }
                    }
                }

            });

        } catch (e) {
            return false;
        }
    } else {
        return false;
    }

    return true;
}

/**校验字段值,字符串类型*/
function checkStringField(fieldObj, datatypeinfo) {
    if ($(fieldObj).attr("disabled") == true || $(fieldObj).attr("disabled") == "disabled") {
        return true;
    }

    if (!$(fieldObj).val() || $.trim($(fieldObj).val()) == "") {
        return true;
    }

    var len = 100;
    if($(fieldObj).attr("strlen")&&$.trim($(fieldObj).attr("strlen"))!=""){
        len = Number($.trim($(fieldObj).attr("strlen")));
    }

    if ($(fieldObj).val().length > len) {
        alert("请录入长度小于"+len+"的字符串数据");
        return false;
    }

    if (/[\^&\*]+/g.test($(fieldObj).val())) {
        if (!datatypeinfo || $.trim(datatypeinfo) == "") {
            datatypeinfo = "存在非法的字符";
        }
        alert(datatypeinfo);

        $(fieldObj).focus();
        return false;
    } else {
        return true;
    }
}

/**校验字段值,整数类型*/
function checkIntField(fieldObj, datatypeinfo) {

    if ($(fieldObj).attr("disabled") == true || $(fieldObj).attr("disabled") == "disabled") {
        return true;
    }

    if (!$(fieldObj).val() || $.trim($(fieldObj).val()) == "") {
        return true;
    }

    if (!/^\d+$/.test($(fieldObj).val())) {
        if (!datatypeinfo || $.trim(datatypeinfo) == "") {
            datatypeinfo = "请录入整数数据";
        }
        alert(datatypeinfo);
        $(fieldObj).focus();
        return false;
    } else {
        return true;
    }

}

/**校验字段值,IP地址类型*/
function checkIpField(fieldObj, datatypeinfo) {
    if ($(fieldObj).attr("disabled") == true || $(fieldObj).attr("disabled") == "disabled") {
        return true;
    }
    if (!$(fieldObj).val() || $.trim($(fieldObj).val()) == "") {
        return true;
    }

    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g;

    if (re.test($(fieldObj).val())) {
        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
            return true;
        }
    }

    if (!datatypeinfo || $.trim(datatypeinfo) == "") {
        datatypeinfo = "请录入IP数据";
    }
    alert(datatypeinfo);
    $(fieldObj).focus();
    return false;

}


/**校验字段值,正浮点数*/
function checkPlusFloatField(fieldObj, datatypeinfo) {

    if ($(fieldObj).attr("disabled") == true || $(fieldObj).attr("disabled") == "disabled") {
        return true;
    }

    if (!$(fieldObj).val() || $.trim($(fieldObj).val()) == "") {
        return true;
    }


    if (!/^\d+(\.\d+)?$/.test($(fieldObj).val())){
        if (!datatypeinfo || $.trim(datatypeinfo) == "") {
            datatypeinfo = "请录入正浮点数类型";
        }
        alert(datatypeinfo);
        $(fieldObj).focus();
        return false;
    } else {
        return true;
    }

}

/**校验字段值,浮点数*/
function checkFloatField(fieldObj, datatypeinfo) {

    if ($(fieldObj).attr("disabled") == true || $(fieldObj).attr("disabled") == "disabled") {
        return true;
    }

    if (!$(fieldObj).val() || $.trim($(fieldObj).val()) == "") {
        return true;
    }

    ///^(-?\d+)(\.\d+)?$/

    if (!/^(-?\d+)(\.\d+)?$/.test($(fieldObj).val())){
        if (!datatypeinfo || $.trim(datatypeinfo) == "") {
            datatypeinfo = "请录入浮点数类型";
        }
        alert(datatypeinfo);
        $(fieldObj).focus();
        return false;
    } else {
        return true;
    }

}

/**校验字段值,是否是电子邮件*/
function checkEmail(fieldObj, datatypeinfo) {

    if ($(fieldObj).attr("disabled") == true || $(fieldObj).attr("disabled") == "disabled") {
        return true;
    }

    if (!$(fieldObj).val() || $.trim($(fieldObj).val()) == "") {
        return true;
    }


    if (!testEmail($(fieldObj).val())){
        if (!datatypeinfo || $.trim(datatypeinfo) == "") {
            datatypeinfo = "请录入正确的电子邮件地址";
        }
        alert(datatypeinfo);
        $(fieldObj).focus();
        return false;
    } else {
        return true;
    }

}

//试试是否是电子邮件
function testEmail(strEmail) {
    var emailPat=/^(.+)@(.+)$/;
    var matchArray=strEmail.match(emailPat);
    if (matchArray==null) {
        return false;
    }
    return true;
}

/*测试是否是整数类型*/
function testPlusFloat(v) {
    if (!/^\d+(\.\d+)?$/.test(v)) {
        return false
    }
    return true;
}

/*测试是否是整数类型*/
function testInt(v) {
    if (!/^\d+$/.test(v)) {
        return false
    }
    return true;
}
/*将Ip地址转换为整数*/
function ipToInt(ip) {
    var REG = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var xH = "",
        result = REG.exec(ip);
    if (!result) return -1;
    return (parseInt(result[1]) << 24 | parseInt(result[2]) << 16 | parseInt(result[3]) << 8 | parseInt(result[4]));
}
/*10.10.10.0-255/24*/
function ipstoInt(ip) {
    var ips = ip.split(".");
    return parseInt(ips[0], 2) + "." + parseInt(ips[1], 2) + "." + parseInt(ips[2], 2) + "." + parseInt(ips[3], 2);
}



/*form提交数据校验部分*/
/**************************************************************************************************************************/

/*数据校验对象注册表注册表*/
var DataCheckFunctions={
    defaultObj:
    {name:"",nameFilter:function (dataCheckObj,typeName){
        return true;
    },checkFunction:function (dataCheckObj,inputObj,datatypeinfo) {
        return checkStringField(inputObj, datatypeinfo);
    }},
    mapObjs:[
        {name:"string",nameFilter:function (dataCheckObj,typeName){
            if(dataCheckObj.name==typeName){
                return true;
            }
            return false;
        },checkFunction:function (dataCheckObj,inputObj,datatypeinfo) {
            return checkStringField(inputObj, datatypeinfo);
        }},
        {name:"int",nameFilter:function (dataCheckObj,typeName){
            if(dataCheckObj.name==typeName){
                return true;
            }
            return false;
        },checkFunction:function (dataCheckObj,inputObj,datatypeinfo) {
            return checkIntField(inputObj, datatypeinfo);
        }},
        {name:"ip",nameFilter:function (dataCheckObj,typeName){
            if(dataCheckObj.name==typeName){
                return true;
            }
            return false;
        },checkFunction:function (dataCheckObj,inputObj,datatypeinfo) {
            return checkIpField(inputObj, datatypeinfo);
        }},
        {name:"email",nameFilter:function (dataCheckObj,typeName){
            if(dataCheckObj.name==typeName){
                return true;
            }
            return false;
        },checkFunction:function (dataCheckObj,inputObj,datatypeinfo) {
            return checkEmail(inputObj, datatypeinfo);
        }},
        {name:"plusfloat",nameFilter:function (dataCheckObj,typeName){
            if(dataCheckObj.name==typeName){
                return true;
            }
            return false;
        },checkFunction:function (dataCheckObj,inputObj,datatypeinfo) {
            return checkPlusFloatField(inputObj, datatypeinfo);
        }},
        {name:"float",nameFilter:function (dataCheckObj,typeName){
            if(dataCheckObj.name==typeName){
                return true;
            }
            return false;
        },checkFunction:function (dataCheckObj,inputObj,datatypeinfo) {
            return checkFloatField(inputObj, datatypeinfo);
        }}
    ]};


/*校验form对象中的数据是否符合要求,采用数据回调方式*/
function checkFormValidationInvoke(options) {
    var globaloptions = $.extend({
        formid:"",
        msgDialogId:"alertmodaldialog",
        checkFunSet:{},//校验函数集合,默认采用DataCheckFunctions
        handleRequiredError:function (inputObj,msg,globaloptions) {
            //处理请求的错误消息
            $("#"+globaloptions.msgDialogId).VisualAlertModalMsgDialog({msgcontent:msg,hidenfun:function () {
                inputObj.focus();
            }});
            //throw new Error(msg);
        },
        handleCheckError:function (inputObj,msg,globaloptions) {
            //处理校验错误消息
            $("#"+globaloptions.msgDialogId).VisualAlertModalMsgDialog({msgcontent:msg,hidenfun:function () {
                inputObj.focus();
            }});
            //throw new Error(datatypeinfo);
        },
        requiredCheck:function (globaloptions,formObj) {
            //校验必须录入字段的函数
            var inputObjSet = formObj.find(".required");
            for(var ia=0;ia<inputObjSet.length;ia++){
                var inputObj = $(inputObjSet[ia]);
                if (inputObj.attr("disabled") == true || inputObj.attr("disabled") == "disabled") {
                } else {
                    var flag = globaloptions.requiredCheckInfo(globaloptions,formObj,inputObj);
                    if(!flag){
                        return false;
                    }
                }
            }
            return true;
        },
        requiredCheckInfo: function (globaloptions,formObj,inputObj) {
            //必须录入的如果未录入需要的回调
            if (!inputObj.val() || $.trim(inputObj.val()) == "") {
                var msg = inputObj.attr("requiredinfo");
                if (!msg || $.trim(msg) == "") {
                    msg = "数据不能为空";
                }

                globaloptions.handleRequiredError(inputObj,msg,globaloptions);
                return false;
            }
            return true;
        },
        fieldCheck:function (globaloptions,formObj) {
            //需要对数据类型校验的字段
            var inputObjSet = formObj.find(".checkfield");
            for(var ij=0;ij<inputObjSet.length;ij++){
                var inputObj = $(inputObjSet[ij]);
                if (inputObj.attr("disabled") == true || inputObj.attr("disabled") == "disabled") {
                } else {
                    //alert("id="+inputObj.attr("id"));
                    var flag = globaloptions.fieldCheckInfo(globaloptions,formObj,inputObj);
                    if(!flag){
                        return false;
                    }
                }
            }
            return true;
        },
        fieldCheckInfo: function (globaloptions,formObj,inputObj) {
            //数据类型校验如果数据类型不符合,则抛出异常
            var datatype = inputObj.attr("datatype");
            var datatypeinfo = inputObj.attr("datatypeinfo");

            //调用数据校验函数
            var datatypefun = inputObj.attr("datatypefun");
            if (!(("undefined" == typeof datatypefun) || !datatypefun)) {
                if (!eval(datatypefun + "(inputObj)")) {
                    globaloptions.handleCheckError(inputObj,datatypeinfo,globaloptions);
                    return false;
                }
            } else {
                if(globaloptions.checkFunSet){
                    for(var ib=0;ib<globaloptions.checkFunSet.mapObjs.length;ib++){
                        var checkFunObj = globaloptions.checkFunSet.mapObjs[ib];
                        //alert("---------------------2--1");
                        if(checkFunObj.nameFilter(checkFunObj,datatype)){
                            //alert("---------------------2--1,name="+checkFunObj.name);
                            if(!checkFunObj.checkFunction(checkFunObj,inputObj,datatypeinfo)){
                                //alert("---------------------2--2,name="+checkFunObj.name);
                                return false;
                            }else{
                                //alert("---------------------2--3,name="+checkFunObj.name);
                                return true;
                            }
                        }
                    }
                    return globaloptions.checkFunSet.defaultObj.checkFunction(checkFunObj,inputObj,datatypeinfo);
                }
            }

            return true;
        }
    }, options);

    //找到form对象
    var formObj = $("#"+globaloptions.formid);
    if(formObj.length<=0){
        return true;
    }
    //校验必填字段
    if(!globaloptions.requiredCheck(globaloptions,formObj)){
        return false;
    }
    //校验字段数据类型
    if(!globaloptions.fieldCheck(globaloptions,formObj)){
        return false;
    }
    return true;
}

/*数据异步提交部分*/
/**************************************************************************************************************************/
/*加载系统遮罩层*/
function loadSysMaskLayer(){
	try{
        layer.load(2, {
            shade: [0.4,'#CCC'] //0.1透明度的白色背景
        });
    }catch (e){}
}

/*关闭系统遮罩层*/
function closeSysMaskLayer(){
	try{
	    layer.closeAll('loading');
	}catch (e){}
}

/*
 ajax数据提交工具类,集成ajax form submit 和 jQuery ajax 函数
 如果有文件提交则采用以下形式:
 var formData = new FormData($('#mainform')[0]);
 data : formData,
 processData: false,  // tell jQuery not to process the data
 contentType: false,
 * */
function ajaxAccessServer(options){
    var globaloptions = $.extend({
        url: "",
        formid:"",
        type:"POST",
        cache: false,
        encodeuriflag:true,
        async: _Common_Flag_Ajax_Async,
        clearForm:false,
        checkForm:true,
        checkFormFun:function (globaloptions) {
            try{
                return checkFormValidationInvoke(
                    {formid:globaloptions.formid,checkFunSet:DataCheckFunctions}
                );
            }catch (e){
                alert(e.message);
                return false;
            }
            return true;
        },
        error: function(result) {
        	closeSysMaskLayer();
            alert("服务器访问异常");
        },
        otherstirng:function(result){
        	//其他格式的数据处理
        },
        openLayer:true,
        closeLayer:true,
        success: null,
        data:"",
        successjson:function (result) {}
    }, options);

    //校验form 数据对象
    if($.trim(globaloptions.formid)!=""&&globaloptions.checkForm){
        if(!globaloptions.checkFormFun(globaloptions)){
            return;
        }
    }

    //格式化url
    if(globaloptions.encodeuriflag){
        var ourl = globaloptions.url;
        try{
            globaloptions.url= encodeURI(globaloptions.url);
        }catch (e){
            console.log(e);
            globaloptions.url= ourl;
        }
    }



    if(globaloptions.success==null){
        globaloptions.success = function (result) {

            var jsonData = {datastate:"succ"};
            try{
                //jsonData = $.parseJSON(result);
                if(typeof(result)=='string'){
                    jsonData = $.parseJSON(result);
                }else{
                    jsonData = result;
                }
            }catch (e){
            	//modify code by zzm 20160723 
            	if(typeof(result)=='string'){
            		
            		try{
            			if(checkContentIsErrorPage(result)){
            				try{
                                $(document).empty();
                                document.write(result);
                                return;
                            }catch(ef){
                            	alert(ef);
                            	return;
                            }
            			}
            		}catch(ed){
            			alert(ed);
            		}
            		
            		globaloptions.otherstirng(result);
            		return;
                }
                
                
                jsonData.datastate = ""+e.message;
                //return;
            }

            try{
                globaloptions.successjson(jsonData);
            }catch (e){
                alert(e);
            }

            if(globaloptions.closeLayer){
            	closeSysMaskLayer();
            }
        }
    }

    //打开层模板
    if(globaloptions.openLayer){
    	loadSysMaskLayer();
    }

    if($.trim(globaloptions.formid)!=""){
        $("#"+globaloptions.formid).ajaxSubmit(globaloptions);
    }else{
        //alert('jquery submit');
        $.ajax(globaloptions);
    }

}

/**针对form内容定制的,采用默认的数据协议,及数据内容中必须包含 {..,"datastate":"succ"},异常数据以弹出框的 mssage 形式呈现*/
function ajaxAccessServerEx(options){
    var globaloptions = $.extend({
        url: "",
        formid:"",
        type:"POST",
        cache: false,
        encodeuriflag:true,
        async: _Common_Flag_Ajax_Async,
        clearForm:false,
        checkForm:true,
        stdDataFormat:true,//标准数据结洗衣格式{..,"datastate":"succ"}
        msgDialogId:"alertmodaldialog",
        globalState:'succ',//全局状态
        closeLayer:true,
        openLayer:true,
        error:null,
        success: null,
        data:"",
        formCheckMsg:function (globaloptions,msg) {
            //form数据校验时的异常
            $("#"+globaloptions.msgDialogId).VisualAlertModalMsgDialog({msgcontent:msg});
        },
        errorMsg:function (globaloptions,msg) {
            //网络访问异常时的消息处理
            $("#"+globaloptions.msgDialogId).VisualAlertModalMsgDialog({msgcontent:msg});
        },
        dataLoadMsg:function (globaloptions,jsonData,msg) {
            //网络访问成功时的消息处理,包含数据加载成功的消息处理和数据加载失败的消息处理
            $("#"+globaloptions.msgDialogId).VisualAlertModalMsgDialog({msgcontent:msg});
        },
        checkFormFun:function (globaloptions) {//传入的from id不为空的时候需要进行校验
            try{
                return checkFormValidationInvoke(
                    {formid:globaloptions.formid,checkFunSet:DataCheckFunctions}
                );
            }catch (e){
                globaloptions.globalState=e.message;
                //moidfy code by zzm 20161205
                globaloptions.formCheckMsg(globaloptions,e.message);
                return false;
            }
            return true;
        },
        dataprehandle:function (result,globaloptions) {
            //对服务端返回的数据进行预处理操作,转换为一个json对象
            var jsonData = {datastate:"succ"};
            try{
                //jsonData = $.parseJSON(result);
                if(typeof(result)=='string'){
                    jsonData = $.parseJSON(result);
                }else{
                    jsonData = result;
                }
            }catch (e){
            	
            	if(typeof(result)=='string'){	
            		try{
            			if(checkContentIsErrorPage(result)){
            				try{
            					jsonData.datastate='empty';
                                $(document).empty();
                                document.write(result);
                                return null;
                            }catch(ef){
                            	alert(ef);
                            	closeSysMaskLayer();
                            	return null;
                            }
            			}
            		}catch(ed){
            			closeSysMaskLayer();
            			alert(ed);
            		}
            		
            		return null;
                }
                
                jsonData.datastate = ""+e.message;
                
            }
            return jsonData;
        },
        successjson:function (jsonData,globaloptions) {
            //json对象中的数据内容如果为 succ 则调用此函数
        },
        otherstring:function (result,globaloptions) {
            //非json 返回值,调用此方法处理
            $("#"+globaloptions.msgDialogId).VisualAlertModalMsgDialog({msgcontent:'返回的JSON数据格式异常'});
        },
        exceptionjson:function (jsonData,result,globaloptions) {
        	if(globaloptions.closeLayer){
        		closeSysMaskLayer();
            }
            //json对象中的数据内容如果不是 succ 则调用此函数
            globaloptions.globalState=jsonData.datastate;
            globaloptions.dataLoadMsg(globaloptions,jsonData,jsonData.datastate);
        }
    }, options);

    //校验form 数据对象
    if($.trim(globaloptions.formid)!=""&&globaloptions.checkForm){
        if(!globaloptions.checkFormFun(globaloptions)){
            return globaloptions.globalState;
        }
    }

    //访问错误
    if(globaloptions.error==null){
        globaloptions.error = function (result) {
        	closeSysMaskLayer();
            globaloptions.globalState='服务器访问异常';
            globaloptions.errorMsg(globaloptions,'服务器访问异常');
        }
    }

    //服务器返回数据,
    if(globaloptions.success==null){
        globaloptions.success = function (result) {
            //console.log("服务器数据:");
            //console.log(result);

            //判断是否是标准数据格式,如果不是标准数据格式,则直接调用,不进行转换
            if(globaloptions.stdDataFormat){

                //数据预处理,将数据转换为json 对象,然后返回
                var jsonData = globaloptions.dataprehandle(result,globaloptions);

                //针对预处理后的数据执行操作,如果预处理数据为空,则不进行操作
                if(jsonData!=null){
                    //判断数据是否是成功的内容
                    if($.trim(jsonData.datastate)!='succ'){
                    	
                        globaloptions.exceptionjson(jsonData,result,globaloptions);
                    }else{
                        globaloptions.successjson(jsonData,globaloptions);
                    }
                }else{
                	globaloptions.otherstring(result,globaloptions);
                }

            }else{
                globaloptions.successjson(result);
            }

            if(globaloptions.closeLayer){
            	closeSysMaskLayer();
            }
        }
    }

    //格式化url
    if(globaloptions.encodeuriflag){
        var ourl = globaloptions.url;
        try{
            globaloptions.url= encodeURI(globaloptions.url);
        }catch (e){
            console.log(e);
            globaloptions.url= ourl;
        }
    }



    //打开层模板
    if(globaloptions.openLayer){
    	loadSysMaskLayer();
    }


    try{
        if($.trim(globaloptions.formid)!=""){
            //moidfy code by zzm 20161020 增加非 form 数据提交功能
            //$("#"+globaloptions.formid).ajaxSubmit(globaloptions);
            if($("#"+globaloptions.formid).is("form")){
                //alert("serialize----"+globaloptions.formid+"----sssss:"+$("#"+globaloptions.formid).serialize());
                $("#"+globaloptions.formid).ajaxSubmit(globaloptions);
            }else{
                globaloptions.data = divDataSerialize(globaloptions.formid);//$("#"+globaloptions.formid).find(":checkbox,:radio,:text,:hidden,select,textarea").serialize();
                //alert("serialize---"+globaloptions.formid+"-----ddddd:"+globaloptions.data);
                $.ajax(globaloptions);
            }
        }else{
            $.ajax(globaloptions);
        }
    }catch (e){
    	if(globaloptions.closeLayer){
        	closeSysMaskLayer();
        }
    	globaloptions.globalState=e.message;
        globaloptions.errorMsg(globaloptions,e.message);
        
    }

    return globaloptions.globalState;
}

/**
 * 将divId内容序列化为get字符串
 * */
function divDataSerialize(divId){
    return $("#"+divId).find(":checkbox,:radio,:text,:hidden,select,textarea").serialize();
}

/**针对异步ajax消息处理Get函数*/
function ajaxGetAccessServerEx(url,succesfun,dataLoadMsg,openLayer,closeLayer,encodeuriflag){
    if(!dataLoadMsg||dataLoadMsg==null){
        dataLoadMsg = function (msg) {
            //网络访问成功时的消息处理,包含数据加载成功的消息处理和数据加载失败的消息处理
            $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:msg});
        }
    }
    
    if(typeof(openLayer) == 'undefined'||openLayer==null){
    	openLayer = true;
    }
    
    if(typeof(openLayer) == 'undefined'||closeLayer==null){
    	closeLayer = true;
    }
    
    if(openLayer){
    	loadSysMaskLayer();
    }



    //格式化url
    if(typeof(encodeuriflag) == 'undefined'||encodeuriflag==true){
        var ourl = url;
        try{
            url= encodeURI(url);
        }catch (e){
            console.log(e);
            url= ourl;
        }
    }

    try{
        /*
        $.getJSON(url, function(result){
            succesfun(result);
            
            if(closeLayer){
            	closeSysMaskLayer();
            }
            
        });*/
        $.ajax({
            url: url,
            success: function(result){

                var jsonData = {datastate:"succ"};
                try{
                    //jsonData = $.parseJSON(result);
                    if(typeof(result)=='string'){
                        jsonData = $.parseJSON(result);
                    }else{
                        jsonData = result;
                    }
                }catch (e){
                    if(typeof(result)=='string'){
                        try{
                            if(checkContentIsErrorPage(result)){
                                try{
                                    jsonData.datastate='empty';
                                    $(document).empty();
                                    document.write(result);
                                    return null;
                                }catch(ef){
                                    alert(ef);
                                    closeSysMaskLayer();
                                    return null;
                                }
                            }
                        }catch(ed){
                            closeSysMaskLayer();
                            alert(ed);
                        }

                        return null;
                    }

                    jsonData.datastate = ""+e.message;

                }
                succesfun(jsonData);
                if(closeLayer){
                    closeSysMaskLayer();
                }
            },
            error: function(result) {
                closeSysMaskLayer();
                alert("服务器访问异常");
            }
        });
    }catch (ef){
    	closeSysMaskLayer();
        dataLoadMsg(ef.message);
    }


}

/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/

/**
 * 格式化当前地址的action 访问路径
 * 向服务器提交两个数据,DoSomething,CurrentData
 * */
function formatCurrentAddressAction(actionName,optype,data) {
    var actionAddress = CurrentPageUrl+"/"+actionName;
    var getMethodDatas = new Array();
    if(optype&&optype!=null&&$.trim(optype)!=""){
        getMethodDatas[getMethodDatas.length] = {name:"DoSomething",value:optype};
    }
    if(data&&data!=null&&$.trim(data)!=""){
        getMethodDatas[getMethodDatas.length] = {name:"CurrentData",value:data};
    }
    return formatServerGetAccessAddress(actionAddress,getMethodDatas);
}


/**
 * 格式化当前地址的action 访问路径
 * 向服务器提交两个数据,DoSomething,CurrentData
 * */
function formatServerGetAccessAddressEx(actionName,datas) {
    var actionAddress = CurrentPageUrl+"/"+actionName;
    return formatServerGetAccessAddress(actionAddress,datas);
}

/**
 * 格式化服务器的server地址
 * 采用get方式访问
 * datas 为数组,
 * datas 元素为 {"name":"DoSomething","value":"query"}
 * */
function formatServerGetAccessAddress(rootPath,datas) {
    var firstLinkStr = "";
    if(rootPath.indexOf('?')>0){
        firstLinkStr = "&";
    }else{
        firstLinkStr = "?"
    }
    if(datas!=null&&datas.length>0){
        var address = rootPath;
        $.each(datas,function (index,element){
            if(index==0){
                address+=firstLinkStr+element.name+"="+element.value;
            }else{
                address+="&"+element.name+"="+element.value;
            }
        });
        return address;
    }
    return rootPath;
}

/**************************************************************************************************************************/

/**
 * 格式化访问地址
 * */
function formatAccessServerUrl(url){
    url = $.trim(url);
    //
    if(url!=""&&(url.charAt(url.length-1)=='?'||url.charAt(url.length-1)=='&')){
        url = url.substring(0,url.length);
    }
    return url;
}
/**
 * 构建针对系统的action
 * */
function builderJsonServerActionUrl(actionName,jsondata){
    //var basePath = CurrentPageUrl+"/"+actionName;

    var basePath = CurrentPageUrl;//+"/"+actionName;

    if(actionName&&actionName!=null&&$.trim(actionName)!=""){
        basePath = CurrentPageUrl+"/"+actionName;
    }

    return builderSysTokenAccessServerUrl(basePath,jsondata);
}
/**
 * 构建针对系统的action
 * */
function builderServerActionUrl(actionName,optype,data){
    var jsondata = {};
    var basePath = CurrentPageUrl;//+"/"+actionName;

    if(actionName&&actionName!=null&&$.trim(actionName)!=""){
        basePath = CurrentPageUrl+"/"+actionName;
    }

    if(optype&&optype!=null&&$.trim(optype)!=""){
        jsondata.DoSomething = optype;
    }
    if(data&&data!=null&&$.trim(data)!=""){
        jsondata.CurrentData = data;
    }

    return builderSysTokenAccessServerUrl(basePath,jsondata);
}
/**
 * 构建针对系统的
 * */
function builderSysAccessServerUrl(jsonDatas){
    return builderSysTokenAccessServerUrl(CurrentPageUrl,jsonDatas);
}
/**
 * 构建针对系统的
 * */
function builderSysTokenAccessServerUrl(basePath,jsonDatas){
    basePath = formatAccessServerUrl(basePath);

    if(basePath.indexOf('?')>0){
        firstLinkStr = "&";
    }else{
        firstLinkStr = "?"
    }

    if(basePath==""){
        firstLinkStr = "";
    }

    //增加token
    basePath = basePath+firstLinkStr+"GlobalAccessToken="+(new Date()).getTime();
    return builderAccessServerUrl(basePath,jsonDatas);
}
/*
 var jsdata ={"name":"a","val":"b"}
 for(var x in jsdata){
 alert(x+"="+jsdata[x]);
 }
 构建访问服务器的url
 传入 json 数据 构造访问url
 */
function builderAccessServerUrl(basePath,jsonDatas){
    var firstLinkStr = "";

    basePath = formatAccessServerUrl(basePath);

    if(basePath.indexOf('?')>0){
        firstLinkStr = "&";
    }else{
        firstLinkStr = "?"
    }

    //
    if(basePath==""){
        firstLinkStr = "";
    }



    //构造一个当前的时间访问字段对象
    //var serverUrl = rootPath+firstLinkStr+"GlobalAccessToken=1477790916797";
    //firstLinkStr="&";
    var serverUrl = basePath;

    if(jsonDatas&&jsonDatas!=null){
        for(var x in jsonDatas){
            serverUrl+=	(firstLinkStr+x+"="+jsonDatas[x]);
            firstLinkStr="&";
        }
    }

    return serverUrl;
}


/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/


/**
 * 通过模块的编码获得切换模块,并获得模块的访问地址
 * */
function sysSwitchAccessModuleById(options){
	
	options = $.extend({
		moduleId: "",
        appendParam:"",
        errorpagefun:function(htmlobj){
        	try{
                $(document).empty();
                document.write(htmlobj.responseText);
            }catch(ef){
            	alert(ef);
            }
        },formatSwitchUrl:function (goptions) {
            if($.trim(goptions.appendParam)==""){
                return ModuleAccessUrlById+"?ModuleId="+goptions.moduleId;
            }else{
                return ModuleAccessUrlById+"?ModuleId="+goptions.moduleId+goptions.appendParam;
            }

        },successfun:function(turl,responseTxt){
        	window.open(turl,'_self');
        }
    }, options); //这里用了$.extend方法，扩展一个对象
	
	if(!options.moduleId||$.trim(options.moduleId)==""){
		return "";
	}

    //格式化模块切换目标url
	var targeturl = options.formatSwitchUrl(options);//ModuleAccessUrlById+"?ModuleId="+options.moduleId;

    //访问模块切换管理sevlet获得目标url
	var htmlobj=$.ajax({url:targeturl,async:false});

    //modify code by zzm 20160726
    try{
		if(checkContentIsErrorPage(htmlobj.responseText)){
			options.errorpagefun(htmlobj);
			return;
		}
	}catch(ed){
		alert(ed);
	}

	//执行页面切换
    var turl = PageRootContextUrl+htmlobj.responseText;
    options.successfun(turl,htmlobj.responseText);
	
}

/**
 * 通过模块的UUID获得切换模块,并获得模块的访问地址
 * sysSwitchAccessModuleByUuid({moduleId:'12345678'});
 * 其中 12345678 代表 可访问资源的 uuid
 * */
function sysSwitchAccessModuleByUuid(options){
	
	
	options = $.extend({
		moduleId: "",
        appendParam:"",
        errorpagefun:function(htmlobj){
        	try{
                $(document).empty();
                document.write(htmlobj.responseText);
            }catch(ef){
            	alert(ef);
            }
        },formatSwitchUrl:function (goptions) {

            if($.trim(goptions.appendParam)==""){
                return ModuleAccessUrlByUuid+"?ModuleId="+goptions.moduleId;
            }else{
                return ModuleAccessUrlByUuid+"?ModuleId="+goptions.moduleId+goptions.appendParam;
            }

        },successfun:function(turl,responseTxt){
        	window.open(turl,'_self');
        }
    }, options); //这里用了$.extend方法，扩展一个对象
	
	if(!options.moduleId||$.trim(options.moduleId)==""){
		return "";
	}

	//格式化模块切换目标url
	var targeturl = options.formatSwitchUrl(options);//ModuleAccessUrlByUuid+"?ModuleId="+options.moduleId;

    //访问目标url
	var htmlobj=$.ajax({url:targeturl,async:false});
    //modify code by zzm 20160726
    try{
		if(checkContentIsErrorPage(htmlobj.responseText)){
			options.errorpagefun(htmlobj);
			return;
		}
	}catch(ed){
		alert(ed);
	}

    //执行页面切换
    var turl = PageRootContextUrl+htmlobj.responseText;
    options.successfun(turl,htmlobj.responseText);
}

/**************************************************************************************************************************/
/**************************************************************************************************************************/

//显示当前日期
function showDay(){
    return formatDateToDayStr(new Date());
}

//格式化日期
function formatDateToDayStr(today){
    var day = today.getDate();
    var strday = (day<10?'0':'')+day;
    var month = today.getMonth() + 1;
    var strmonth = (month<10?'0':'')+month;
    var year = today.getFullYear();    
    var date = year + "-" + strmonth + "-" + strday;
    return date;
}

//格式化日期
function formatDateToStr(today){
    var day = today.getDate();
    var strday = (day<10?'0':'')+day;
    var month = today.getMonth() + 1;
    var strmonth = (month<10?'0':'')+month;
    var year = today.getFullYear(); 
    
    
    var hour = today.getHours();
    var strhour = (hour<10?'0':'')+hour;
    
    var minute = today.getMinutes();
    var strminute = (minute<10?'0':'')+minute;
    
    var second = today.getSeconds();
    var strsecond = (second<10?'0':'')+second;
    
    var date = year + "-" + strmonth + "-" + strday+" "+strhour+":"+strminute+":"+strsecond;
    return date;
}

//增加日期
function addDate(date,days){ 
	d.setDate(d.getDate()+days); 
	return  d;
}

/*'yyyy-MM-dd HH:mm:ss'格式的字符串转日期*/
function stringToDateTime(str){
    var tempStrs = str.split(" ");
    var dateStrs = tempStrs[0].split("-");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10);
    var timeStrs = tempStrs[1].split(":");
    var hour = parseInt(timeStrs [0], 10);
    var minute = parseInt(timeStrs[1], 10);
    var second = parseInt(timeStrs[2], 10);
    var date = new Date(year, month, day, hour, minute, second);
    return date;
}

/*'yyyy-MM-dd'格式的字符串转日期*/
function stringToDate(str){
	var arys= new Array();
	arys=str.split('-');
	var newDate=new Date(parseInt(arys[0]),parseInt(arys[1])-1,parseInt(arys[2]));  
	return newDate;
}

/**************************************************************************************************************************/
/**
 *
 *  Base64 encode / decode
 *
 <script type="text/javascript">
             var b = new Base64();
             var str = b.encode("admin:admin");
             alert("base64 encode:" + str);
             str = b.decode(str);
             alert("base64 decode:" + str);
 </script>
 *
 */

function Base64() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}


/**************************************************************************************************************************/

//mapInputToCheckBox('.select-s','.select-v',true);
//将input 数据设置到 checkbox 中或者将 checkbox数据设置到 input 中
function mapInputToCheckBox(sourcClass,viewClass,toCheckbox) {
    var sc = sourcClass;
    var vc = viewClass;
    if(!toCheckbox){
        sc = viewClass;
        vc = sourcClass;
    }

    $(sc).each(function (index,element) {
        if(toCheckbox){
            $(vc).each(function (ti,te) {
                if($(te).data('targetinpuid')==$(element).data('targetinpuid')){
                    if($(element).val()==''){
                        $(te).prop("checked",false);
                    }else{
                        $(te).prop("checked",true);
                    }
                }
            })
        }else{
            $(vc).each(function (ti,te) {
                if($(te).data('targetinpuid')==$(element).data('targetinpuid')){
                    //alert('flag='+$(element).prop("checked")+',v='+$(element).val());
                    if($(element).prop("checked")){
                        $(te).val($(element).val());
                    }else{
                        $(te).val('');
                    }
                }
            })
        }
    });
}

/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/
/**************************************************************************************************************************/
