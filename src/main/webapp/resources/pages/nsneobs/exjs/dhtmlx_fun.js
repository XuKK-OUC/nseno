/**
 * Created by zzm on 16/6/28.
 */



/**********************************************************************************************************************/
/*针对dhtmlx 表格对象的创建部分*/
/**************************************************************************************************************************/
/*创建基于dhtmlx的表格对象,依赖于 dthmlx 和 jquery,由数据对象创建grid*/
function createDhtmlxGridByJson(options,jsondata){
    var globaloptions = $.extend({
        boxid:"",
        dataFormat:"json",
        gridoutsucc:function (dtmlxgridobj,result,globaloptions){},
        initsetting:function (dtmlxgridobj,result,globaloptions) {
            /*
             if(result.imagePath&&$.trim(result.imagePath)!="") {
             dtmlxgridobj.setImagePath(result.imagePath);
             }*/

            if(result.imagePath&&$.trim(result.imagePath)!=""){
                dtmlxgridobj.setImagePath(result.imagePath);
            }
            if(result.header&&$.trim(result.header)!=""){
                dtmlxgridobj.setHeader(result.header);
            }
            if(result.initWidths&&$.trim(result.initWidths)!=""){

                //过滤带有加号的头宽度
                var initWidthstring = result.initWidths;
                initWidthstring = initWidthstring.replace(/\+/g,'');
                //console.log('old string='+result.initWidths+", new string="+initWidthstring);
                //可以按照如下代码实现带有加号的自动扩展的表头
                /*
                ,gridoutsucc:function(dtmlxgridobj,result,globaloptions){
									var initWidthstring = result.initWidths;
									//console.log('1-----initWidthstring='+initWidthstring);

									if(initWidthstring.indexOf('+')>0){
										//执行设置
										headws = initWidthstring.split(',');
										var lt = new Array();
										for(i=0;i<headws.length;i++){
											if(headws[i].indexOf('+')>0){
												lt[lt.length]={index:i,minWidth:headws[i].replace(/\+/g,'')}
											}
										}

										//for(i=0;i<lt.length;i++){
										//	console.log(lt[i].index+',w='+lt[i].minWidth);
										//}
										//console.log('总宽度为:'+$('#gridbox-total').width());
										//console.log('表头宽度为:'+$('#gridbox-total').find('.hdr').width());
										if(lt.length>0){
											var lastlt = lt[0];
											if($('#gridbox-total').find('.hdr').width()<$('#gridbox-total').width()){
												var tw = parseInt(lastlt.minWidth)+($('#gridbox-total').width()-$('#gridbox-total').find('.hdr').width());
												dtmlxgridobj.setColWidth(lastlt.index,tw);
												//console.log('改变表头宽度为:'+$('#gridbox-total').find('.hdr').width());
											}
										}
									}

								}
                */

                dtmlxgridobj.setInitWidths(initWidthstring);
            }
            if(result.colAlign&&$.trim(result.colAlign)!=""){
                dtmlxgridobj.setColAlign(result.colAlign);
            }
            if(result.colTypes&&$.trim(result.colTypes)!=""){
                dtmlxgridobj.setColTypes(result.colTypes);
            }
            if(result.colSorting&&$.trim(result.colSorting)!=""){
                dtmlxgridobj.setColSorting(result.colSorting);
            }

            if(result.pageSetting&&result.pageSetting!=null){
                //dtmlxgridobj.enablePaging(true,20,10,"pagingArea",true,"recinfoArea");
                dtmlxgridobj.enablePaging(result.pageSetting[0],result.pageSetting[1],result.pageSetting[2],result.pageSetting[3],result.pageSetting[4],result.pageSetting[5]);
            }

            if(result.pagingSkin&&$.trim(result.pagingSkin)!=""){
                dtmlxgridobj.setPagingSkin(result.pagingSkin);
            }

            if(result.pageSettingWT&&result.pageSettingWT!=null){
                //dtmlxgridobj.setPagingWTMode(true,true,true,[20,60,90,120]);
                dtmlxgridobj.setPagingWTMode(result.pageSettingWT[0],result.pageSettingWT[1],result.pageSettingWT[2],result.pageSettingWT[3]);
            }

            if(result.enableCollSpan){
                dtmlxgridobj.enableCollSpan(true);
            }

            if(result.enableRowspan){
                dtmlxgridobj.enableRowspan(true);
            }
            //
            //myGrid.enableCollSpan(true);
            //myGrid.enableRowspan(true);


            if(result.attachHeader){
                if(result.attachHeader instanceof Array){
                    for(var i=0;i<result.attachHeader.length;i++){
                        dtmlxgridobj.attachHeader(result.attachHeader[i]);
                    }
                }else{
                    if($.trim(result.attachHeader)!=""){
                        dtmlxgridobj.attachHeader(result.attachHeader);
                    }
                }
            }

            //设置数据类型
            if(result.serverDataFormat&&result.serverDataFormat!=null&&$.trim(result.serverDataFormat)!=""){
                globaloptions.dataFormat = result.serverDataFormat;
            }

        },
        initpre:function (dtmlxgridobj,result,globaloptions) {
            //自定义初始化设置,如事件绑定等
            /*wlgrid.attachEvent("onRowSelect", function(id, ind) {
             alert("选择行:id="+id)
             });*/
        },
        initafter:function (dtmlxgridobj,result,globaloptions) {
        },

        success: function (dtmlxgridobj,result,globaloptions) {
            /*if(globaloptions.isJsonData){
             dtmlxgridobj.parse(result.data, function(){},"json");
             }*/
            dtmlxgridobj.parse(result.data, function(){},globaloptions.dataFormat);
            //设置全局回调数据
            globaloptions.gridoutsucc(dtmlxgridobj,result,globaloptions);
        }
    }, options);


    //alert("jsondata="+jsondata);
    var dhtmlxgrid =  new dhtmlXGridObject(globaloptions.boxid);
    globaloptions.initsetting(dhtmlxgrid,jsondata,globaloptions);
    globaloptions.initpre(dhtmlxgrid,jsondata,globaloptions);


    dhtmlxgrid.init();

    //默认标题居中
    //$('.hdrcell').css("text-align","center");
    //$(".hdr").find("td").css("vertical-align", "middle");

    globaloptions.initafter(dhtmlxgrid,jsondata,globaloptions);
    globaloptions.success(dhtmlxgrid,jsondata,globaloptions);

    return dhtmlxgrid;
}

/*创建基于dhtmlx的表格对象,依赖于 dthmlx 和 jquery,同步获得数据信息,创建grid*/
function createDhtmlxGrid(options){

    var globaloptions = $.extend({
        url:"",
        boxid:"",
        dataFormat:"json",
        gridoutsucc:function (dtmlxgridobj,result,globaloptions){},
        initsetting:function (dtmlxgridobj,result) {

            /*
             if(result.imagePath&&$.trim(result.imagePath)!="") {
             dtmlxgridobj.setImagePath(result.imagePath);
             }*/

            if(result.imagePath&&$.trim(result.imagePath)!=""){
                dtmlxgridobj.setImagePath(result.imagePath);
            }
            if(result.header&&$.trim(result.header)!=""){
                dtmlxgridobj.setHeader(result.header);
            }
            if(result.initWidths&&$.trim(result.initWidths)!=""){

                //过滤带有加号的头宽度
                var initWidthstring = result.initWidths;
                initWidthstring = initWidthstring.replace(/\+/g,'');
                //console.log('old string='+result.initWidths+", new string="+initWidthstring);
                //可以按照如下代码实现带有加号的自动扩展的表头
                /*
                ,gridoutsucc:function(dtmlxgridobj,result,globaloptions){
									var initWidthstring = result.initWidths;
									//console.log('1-----initWidthstring='+initWidthstring);

									if(initWidthstring.indexOf('+')>0){
										//执行设置
										headws = initWidthstring.split(',');
										var lt = new Array();
										for(i=0;i<headws.length;i++){
											if(headws[i].indexOf('+')>0){
												lt[lt.length]={index:i,minWidth:headws[i].replace(/\+/g,'')}
											}
										}

										//for(i=0;i<lt.length;i++){
										//	console.log(lt[i].index+',w='+lt[i].minWidth);
										//}
										//console.log('总宽度为:'+$('#gridbox-total').width());
										//console.log('表头宽度为:'+$('#gridbox-total').find('.hdr').width());
										if(lt.length>0){
											var lastlt = lt[0];
											if($('#gridbox-total').find('.hdr').width()<$('#gridbox-total').width()){
												var tw = parseInt(lastlt.minWidth)+($('#gridbox-total').width()-$('#gridbox-total').find('.hdr').width());
												dtmlxgridobj.setColWidth(lastlt.index,tw);
												//console.log('改变表头宽度为:'+$('#gridbox-total').find('.hdr').width());
											}
										}
									}

								}
                */

                dtmlxgridobj.setInitWidths(initWidthstring);
            }
            if(result.colAlign&&$.trim(result.colAlign)!=""){
                dtmlxgridobj.setColAlign(result.colAlign);
            }
            if(result.colTypes&&$.trim(result.colTypes)!=""){
                dtmlxgridobj.setColTypes(result.colTypes);
            }
            if(result.colSorting&&$.trim(result.colSorting)!=""){
                dtmlxgridobj.setColSorting(result.colSorting);
            }

            if(result.pageSetting&&result.pageSetting!=null){
                //dtmlxgridobj.enablePaging(true,20,10,"pagingArea",true,"recinfoArea");
                dtmlxgridobj.enablePaging(result.pageSetting[0],result.pageSetting[1],result.pageSetting[2],result.pageSetting[3],result.pageSetting[4],result.pageSetting[5]);
            }

            if(result.pagingSkin&&$.trim(result.pagingSkin)!=""){
                //dtmlxgridobj.setPagingSkin("toolbar");
                dtmlxgridobj.setPagingSkin(result.pagingSkin);
            }

            if(result.pageSettingWT&&result.pageSettingWT!=null){
                //dtmlxgridobj.setPagingWTMode(true,true,true,[20,60,90,120]);
                dtmlxgridobj.setPagingWTMode(result.pageSettingWT[0],result.pageSettingWT[1],result.pageSettingWT[2],result.pageSettingWT[3]);
            }


            if(result.enableCollSpan){
                dtmlxgridobj.enableCollSpan(true);
            }

            if(result.enableRowspan){
                dtmlxgridobj.enableRowspan(true);
            }

            if(result.attachHeader){
                if(result.attachHeader instanceof Array){
                    for(var i=0;i<result.attachHeader.length;i++){
                        dtmlxgridobj.attachHeader(result.attachHeader[i]);
                    }
                }else{
                    if($.trim(result.attachHeader)!=""){
                        dtmlxgridobj.attachHeader(result.attachHeader);
                    }
                }
            }

            //设置数据类型
            if(result.serverDataFormat&&result.serverDataFormat!=null&&$.trim(result.serverDataFormat)!=""){
                globaloptions.dataFormat = result.serverDataFormat;
            }
        },
        initpre:function (dtmlxgridobj,result) {
            //自定义初始化设置,如事件绑定等
            /*wlgrid.attachEvent("onRowSelect", function(id, ind) {
             alert("选择行:id="+id)
             });*/
        },
        initafter:function (dtmlxgridobj,result) {
        },

        success: function (dtmlxgridobj,result) {
            //dtmlxgridobj.parse(result.data, function(){},"json");

            dtmlxgridobj.parse(result.data, function(){},globaloptions.dataFormat);
            //设置全局回调数据
            globaloptions.gridoutsucc(dtmlxgridobj,result,globaloptions);
        }
    }, options);

    var dhtmlxgrid = null;
    $.ajax({
        url:globaloptions.url,
        type:"POST",
        cache: false,
        async: false,
        success:function (result) {
            dhtmlxgrid=createDhtmlxGridByJson(globaloptions,$.parseJSON(result));
        }
    });

    return dhtmlxgrid;
}


/**************************************************************************************************************************/
/**
 * 序列化表格数据
 * */
function serialDhtmlxGridToJson(gridObj,colIndexs){
    var jsonString ="";
    if(gridObj!=null){
        
        gridObj.forEachRow(function(id){
            var rowstr = "{\"rowId\":"+JSON.stringify(id)+"";

            if(colIndexs&&colIndexs.length>0){
                rowstr+=",";

                rowstr+="\"colData\":{";


                for(var i=0;i<colIndexs.length;i++){
                    var col = colIndexs[i];
                    var tempvalue = "";
                    var tempname = "";
                    if(typeof(col)=='object'){
                        tempvalue = gridObj.cellById(id, col.index).getValue();
                        tempname = col.name;
                    }else{
                        tempvalue = gridObj.cellById(id, col).getValue();
                        tempname = ""+col;
                    }
                    rowstr+=""+JSON.stringify(tempname)+":"+JSON.stringify(tempvalue)+"";

                    if(i<colIndexs.length-1){
                        rowstr+=",";
                    }
                }

                rowstr+="}";
            }

            rowstr+="}";

            if(jsonString==""){
                jsonString+=rowstr;
            }else{
                jsonString+=","+rowstr;
            }
        });

        jsonString="["+jsonString+"]";

    }

    return jsonString;
}

/**
 * 改变表格中的数据状态,接收 dhtmlx 数据表格对象
 * addressFactory 访问地址工厂
 * submitFormId 需要提交的form对象
 * dataGridObj 数据表格对象
 * opInvoke 操作回调函数,数据操作成功后执行回调操作,接收json数据
 * 成功则返回 true,失败返回false,
 *
 * */
function changeGridDataState(addressFactory,submitFormId,dataGridObj,opInvoke) {


    if(dataGridObj==null){
        $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:'数据表格为空,不符合要求'});
        return;
    }

    var selectedId=dataGridObj.getSelectedRowId();
    if(selectedId==null||$.trim(selectedId)==""){
        $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:'请选择要改变的数据记录'});
        return;
    }

    //通过地址工厂构建服务地址
    var serverUrl = addressFactory(selectedId);
    if(serverUrl==null||$.trim(serverUrl)==""){
        $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:'服务器地址为空,不符合要求'});
        return;
    }

    //访问服务器,获得改变后的数据内容,填充至当前选择行
    try{
        ajaxAccessServer({
            url:serverUrl,
            formid:submitFormId,
            successjson: function(jsonData) {
                if(jsonData.datastate=="succ"){
                    var rowdata = jsonData.data.rows[0].data;
                    for(var i=0;i<rowdata.length;i++){
                        dataGridObj.cells(selectedId,i).setValue(rowdata[i]);
                    }

                    if(opInvoke&&opInvoke!=null){
                        return opInvoke(jsonData);
                    }
                    return true;
                }else{
                    $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:jsonData.datastate});
                    return false;
                }
            }
        });

    }catch (e){
        alert(e);
    }

    return false;
}



/**
 * 删除数据表格中的数据,接收 dhtmlx 数据表格对象
 * addressFactory 访问地址工厂
 * dataGridObj 数据表格对象
 * opInvoke 操作回调函数,数据操作成功后执行回调操作,接收json数据
 * 成功则返回 true,失败返回false,
 * */
function deleteGridDataRecord(addressFactory,dataGridObj,opInvoke) {


    if(dataGridObj==null){
        $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:'数据表格为空,不符合要求'});
        return;
    }

    var selectedId=dataGridObj.getSelectedRowId();
    if(selectedId==null||$.trim(selectedId)==""){
        $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:'请选择要改变的数据记录'});
        return;
    }

    //通过地址工厂构建服务地址
    var serverUrl = addressFactory(selectedId);
    if(serverUrl==null||$.trim(serverUrl)==""){
        $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:'服务器地址为空,不符合要求'});
        return;
    }

    //访问服务器,获得改变后的数据内容,填充至当前选择行
    try{
        ajaxAccessServer({
            url:serverUrl,
            successjson: function(jsonData) {
                if(jsonData.datastate=="succ"){
                    dataGridObj.deleteRow(selectedId);

                    if(opInvoke&&opInvoke!=null){
                        return opInvoke(jsonData);
                    }

                    return true;
                }else{
                    $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:jsonData.datastate});
                    return false;
                }
            }
        });

    }catch (e){
        alert(e);
    }

    return false;
}



/**
 * 从地址中查询数据,填充表格
 * addressFactory 访问地址工厂
 * submitFormId 需要提交的form对象
 * dataGridObj 数据表格对象
 * opInvoke 操作回调函数,数据操作成功后执行回调操作,接收json数据
 * 成功则返回 true,失败返回false,
 * */
function queryGridDataRecord(addressFactory,submitFormId,dataGridObj,opInvoke) {

    //校验地址
    if(dataGridObj==null){
        $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:'数据表格为空,不符合要求'});
        return;
    }

    //通过地址工厂构建服务地址
    var serverUrl = addressFactory();
    if(serverUrl==null||$.trim(serverUrl)==""){
        $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:'服务器地址为空,不符合要求'});
        return;
    }


    //访问服务器,获得改变后的数据内容,填充至当前选择行
    try{
        ajaxAccessServer({
            url:serverUrl,
            formid:submitFormId,
            successjson: function(jsonData) {
                if(jsonData.datastate=="succ"){

                    dataGridObj.clearAll();
                    dataGridObj.parse(jsonData.data,"json");

                    if(opInvoke&&opInvoke!=null){
                        return opInvoke(jsonData);
                    }

                    return true;
                }else{
                    $("#alertmodaldialog").VisualAlertModalMsgDialog({msgcontent:jsonData.datastate});
                    return false;
                }
            }
        });

    }catch (e){
        alert(e);
    }

    return false;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//动态设置表格宽度
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//动态设置带有+号的dhtmlx表头的宽度
function dynSettingDhtmlxHeadWidthPlus(areaId,dtmlxgridobj,result,globaloptions) {
    var initWidthstring = result.initWidths;
    console.log('1-----initWidthstring='+initWidthstring);

    if(initWidthstring.indexOf('+')>0){
        //执行设置
        headws = initWidthstring.split(',');
        var lt = new Array();
        for(i=0;i<headws.length;i++){
            if(headws[i].indexOf('+')>0){
                lt[lt.length]={index:i,minWidth:headws[i].replace(/\+/g,'')}
            }
        }

        //for(i=0;i<lt.length;i++){
        //	console.log(lt[i].index+',w='+lt[i].minWidth);
        //}
        //console.log('总宽度为:'+$('#gridbox-total').width());
        //console.log('表头宽度为:'+$('#gridbox-total').find('.hdr').width());
        if(lt.length>0){
            var lastlt = lt[0];
            if($(areaId).find('.hdr').width()<$(areaId).width()){
                var tw = parseInt(lastlt.minWidth)+($(areaId).width()-$(areaId).find('.hdr').width());
                dtmlxgridobj.setColWidth(lastlt.index,tw);
                //console.log('改变表头宽度为:'+$('#gridbox-total').find('.hdr').width());
            }
        }
    }
}