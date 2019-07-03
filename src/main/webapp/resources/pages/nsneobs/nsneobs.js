/*小设备的宽度*/
var _globalMinWinWidth = typeof(_globalMinWinWidth_out)=='undefined'?768:_globalMinWinWidth_out;
var _globalLeftMenuWidth = typeof(_globalLeftMenuWidth_out)=='undefined'?250:_globalLeftMenuWidth_out;
var _globalLeftMenuHeightOffset = typeof(_globalLeftMenuHeightOffset_out)=='undefined'?0:_globalLeftMenuHeightOffset_out;
var _globalLeftMenuHeight = typeof(_globalLeftMenuHeight_out)=='undefined'?50:_globalLeftMenuHeight_out;

var _autoMoveSettiingNavbar = typeof(_autoMoveSettiingNavbar_out)=='undefined'?true:_autoMoveSettiingNavbar_out;

var _NsNeoCookieContextTheme ="NsNeoCookieContextTheme";
/**
 * 校验内容是否是错误页面
 * */
function checkContentIsErrorPage(content){
    if(!content){
        return false;
    }

    if(/<meta\s+pagetype="error"\s*/gi.test(content)){
        return true;
    }

    return false;
}

$(function() {

	/*创建侧边菜单*/
    createSideMenu();

    //初始化主题函数
    initThemeSelect();

	/*初始化定制数据,针对界面框架 sbadmin 定制的功能*/
    sbadmin2init();

    //调用jQuery 初始化函数
    if(typeof(jqInitPageInvoke)!='undefined'){
        try{
            jqInitPageInvoke();
        }catch(e){
            alert(e);
        }
    }
    //
    //settingLogo();

    //hackerSetting();
});

//TODO modify code by zzm 20170625
//云南中烟要求去掉顶部导航
function hackerSetting() {
    $('#MainNavbar').height(0);
    $('#MainNavbar').removeClass('navbar');
    $('#title-navbar').remove();
    $('#settiing-navbar').remove();
}

/*
 function settingLogo() {
 if (typeof(_globalUserGroupId) != "undefined") {
 //alert(_globalUserGroupId);
 if(_globalUserGroupId=='Y600'){
 $("#title-navbar-content").removeClass("title-nav-brand-bg-cus-theme");//.css("background-image","url('./images/sys_log_white.png')");
 $("#title-navbar-content").addClass("title-nav-brand-bg-cus-theme-y600");
 }else{

 }
 }
 }*/

//初始化主题选择功能
function initThemeSelect() {
    $(".themeselectlink").click(function () {
        if(window.confirm("切换主题需要刷新页面,可能导致数据丢失,确定要切换主题吗?")){

            var themevalue = $(this).attr("themevalue");

            //选择主题值
            //alert("当前选择的主题值是:"+themevalue);

            //将主题存储到cookie 中
            if(!themevalue||$.trim(themevalue)==""){
                themevalue = "";
            }
            $.cookie(_NsNeoCookieContextTheme,themevalue,{ path: "/"});
            //刷新页面
            //alert(window.location.href);
            window.location.reload();
        }
    })
}



/*创建侧边菜单*/
function createSideMenu() {
	/*根据JSON对象绘制菜单,依赖全局的菜单数据定义:MenuJSON 和 ModuleAccessUrl*/
    try {
        if ($('#sidebar-menudiv').length > 0) {
            $('#sidebar-menudiv').PFLeftMenu({
                menuDataJson: MenuJSON,
                moduleAccessUrl: ModuleAccessUrl,
                rootContextUrl:PageRootContextUrl
            });
        }
    } catch (e) {
        alert(e.message);
    }

	/*根据窗口大小合并菜单或者展开侧边栏菜单*/
    try {
        //设置菜单信息
        if ($('#side-menu').length > 0) {
            $('#side-menu').metisMenu();
            //$(".sidebar").width(_globalLeftMenuWidth);
            var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
            if (width < _globalMinWinWidth) {
                $(".sidebar").css("width","100%");
                $("#PfLeftSideBarMenu").css("margin-top","0px");

            } else {
                $(".sidebar").width(_globalLeftMenuWidth);
                $("#PfLeftSideBarMenu").css("margin-top",""+_globalLeftMenuHeight+"px");
            }
        }
    } catch (e) {}


	/*active 菜单设置激活标记*/
    try {
        settingMenuActive();
    } catch (e) {
        alert(e.message);
    }

	/*设定页面标题,依赖于 global.js 中的 desktopUrl 变量,和html页面中的title-navbar-content*/
    //初始化向导条
    try{
        initNavBarHeadClickLink();
    }catch (e){
        alert(e.message);
    }
}

/*active 菜单设置激活,展开当前菜单*/
function settingMenuActive() {
	/*
	 var url = window.location;
	 var element = $('ul.nav a').filter(function() {
	 var targeturl = $(this).attr("targeturl");
	 var childaddress = $(this).attr("childaddress");
	 if(!childaddress||$.trim(childaddress)==""){
	 childaddress = "";
	 }
	 if (typeof(targeturl) != "undefined" && targeturl != "") {
	 if(childaddress!=""){
	 //alert("childaddress:"+childaddress)
	 var reg=new RegExp(childaddress,'gi');

	 if(reg.test(url.href)){
	 return true;
	 }
	 }

	 targeturl = targeturl.replace("/./", "/");
	 return (targeturl == url || url.href.indexOf(targeturl) >= 0);
	 }
	 return false;
	 });*/

    var element = $("#"+UserCurrentMenuKey);
    //alert(element);
    if(element.length<=0){
        return;
    }

    //激活
    element.addClass('active');

    element = element.parent().parent();
    element.addClass('in');
    element = element.parent();

    if (element.is('li')) {
        element.addClass('active');
        element.children("ul").addClass("in");

        var ppelement = element.parent().parent();
        if (ppelement.is('li')) {
            ppelement.addClass("active");
            ppelement.children("ul").addClass("in");

            //增加4级激活
            var pppelement = element.parent().parent().parent().parent();
            if (pppelement.is('li')) {
                pppelement.addClass("active");
                pppelement.children("ul").addClass("in");

                //增加 5级激活
                var ppppelement = element.parent().parent().parent().parent().parent().parent();
                if (ppppelement.is('li')) {
                    ppppelement.addClass("active");
                    ppppelement.children("ul").addClass("in");
                }
            }
        }
    }
}

function initNavBarHeadClickLink(){
    try {
        $(document).attr("title", Pf_SysName);
        $("#title-navbar-content").html(Pf_SysName);
        $("#title-navbar-content").click(function() {
            var targeturl = ModuleAccessUrl+"?ModuleId="+$(this).attr("targeturl");
            var htmlobj=$.ajax({url:targeturl,async:false});
            var turl = PageRootContextUrl+htmlobj.responseText;
            window.open(turl,'_self');
        });
    } catch (e) {
        alert(e.message);
    }
}


/*初始化页面数据*/
function sbadmin2init() {


    /**初始化 查询结果页面*/
    try {
        initRSPanel();
    } catch (e) {
        alert(e.message);
    }

	/*设置页面尺寸*/
    try {
        settingHtmPageSize();
    } catch (e) {
        alert(e.message);
    }

    //标记文档中的必须录入的数据
    try {
        formReqireField();
    } catch (e) {
        alert(e.message);
    }
}

//绑定激活显示左侧面板
function bindShowRSPanelLeft() {

    //$("#RSPanel_Left").css("display", "none");
    var defualtshow = $("#RSPanel_Left").attr("defualtshow");
    if(defualtshow&&defualtshow=="true"){
        $("#RSPanel_Left").css("display", "block");
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        if (width < _globalMinWinWidth) {
            $("#RSPanel_Right").removeClass("col-lg-12 col-md-12 col-sm-12");
            $("#RSPanel_Right").addClass("col-lg-10 col-md-10 col-sm-10");
        } else {
            $("#RSPanel_Left").height($("#RSPanel_Left").parent().height() + 15);
            $("#RSPanel_Right").removeClass("col-lg-12 col-md-12 col-sm-12");
            $("#RSPanel_Right").addClass("col-lg-10 col-md-10 col-sm-10");
        }
    }else{
        $("#RSPanel_Left").css("display", "none");
        $("#RSPanel_Right").removeClass("col-lg-10 col-md-10 col-sm-10");
        $("#RSPanel_Right").addClass("col-lg-12 col-md-12 col-sm-12");
    }

    $("#ToolbarCrumb_ShowRSPanelLeft").click(function() {
        if ($("#RSPanel_Left").css("display") == "none") {
            var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            if (width < _globalMinWinWidth) {
                $("#RSPanel_Right").removeClass("col-lg-12 col-md-12 col-sm-12");
                $("#RSPanel_Right").addClass("col-lg-10 col-md-10 col-sm-10");
                $("#RSPanel_Left").css("display", "block");
            } else {
                $("#RSPanel_Left").height($("#RSPanel_Left").parent().height() + 15);
                $("#RSPanel_Right").removeClass("col-lg-12 col-md-12 col-sm-12");
                $("#RSPanel_Right").addClass("col-lg-10 col-md-10 col-sm-10");
                $("#RSPanel_Left").css("display", "block");
            }

            try{
                if (typeof(pfCusShowAndHideSilder) != "undefined") {
                    pfCusShowAndHideSilder(true);
                }
            }catch(e){
                alert(e);
            }

        } else {
            $("#RSPanel_Left").css("display", "none");
            $("#RSPanel_Right").removeClass("col-lg-10 col-md-10 col-sm-10");
            $("#RSPanel_Right").addClass("col-lg-12 col-md-12 col-sm-12");

            try{
                if (typeof(pfCusShowAndHideSilder) != "undefined") {
                    pfCusShowAndHideSilder(false);
                }
            }catch(e){
                alert(e);
            }
        }

        try{
            //jquery 模拟调用,界面尺寸重绘
            //modify code by zzm 20170317 调整性能
            //$(window).resize();
            //模拟window事件调用
            /*if( document.createEvent) {
             var event = document.createEvent ("HTMLEvents");
             event.initEvent("resize", true, true);
             window.dispatchEvent(event);
             } else if(document.createEventObject){
             window.fireEvent("onresize");
             }*/
            //采用jQuery 插件方式调用
            //$("#RSPanel_Right").simulate("resize");
        }catch(e){
            alert(e.message);
        }
    });
}

function initRSPanel() {
    if ($("#RSPanel").length > 0) {



        if ($("#RSPanel_Left").length > 0) {

            //绑定激活显示左侧面板
            bindShowRSPanelLeft();
        }else{
            //modify code by zzm 20170317
            if ($("#RSPanel_Right").length > 0) {
                $("#RSPanel_Right").removeClass("col-lg-10 col-md-10 col-sm-10");
                $("#RSPanel_Right").addClass("col-lg-12 col-md-12 col-sm-12");
            }
        }

    }

}

function resizeRSPanel() {
    if ($("#RSPanel").length > 0) {
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < _globalMinWinWidth) {

            $("body").css("overflow", "auto");
            $("#RSPanel_Right").css("overflow", "hidden");
            return;
        } else {
            //$("#RSPanel_Right").css("overflow", "auto");
            var scrollFlag = $("#RSPanel_Right").attr("singledyngrid");
            if(scrollFlag&&scrollFlag!=null&&scrollFlag!=""){
                $("#RSPanel_Right").css("overflow", "hidden");
            }else{
                $("#RSPanel_Right").css("overflow", "auto");
            }
        }


        $("#page-wrapper-content").css("overflow", "hidden");

        //标题高度变量
        var topOffset = 0;
        if ($("#title-navbar").length > 0) {
            if ($("#title-navbar").parent().length > 0) {
                topOffset = $("#title-navbar").parent().height();
            } else {
                topOffset = $("#title-navbar").height();
            }
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height);
        var oldheight = height;
        height = height - topOffset - $("#ToolbarCrumb").innerHeight() - 1;

        if (height < 1) height = 1;

        if (height > topOffset) {
            $("#RSPanel").css("min-height", (height) + "px");
            $("#RSPanel").css("height", (height) + "px");
        }
        $("#RSPanel").children("div").height($("#RSPanel").height());
    }

}

function resizeEDPanel() {
    if ($("#EDPanel").length > 0) {
        //标题高度变量
        var topOffset = 0;
        if ($("#title-navbar").length > 0) {
            if ($("#title-navbar").parent().length > 0) {
                topOffset = $("#title-navbar").parent().height();
            } else {
                topOffset = $("#title-navbar").height();
            }
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height)-1;
        var oldheight = height;
        height = height - topOffset - $("#ToolbarCrumb").innerHeight()-1;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#EDPanel").css("min-height", (height) + "px");
            $("#EDPanel").css("height", (height) + "px");
        }
        $("#EDPanel").children("div").height($("#EDPanel").height());
    }
}

function settingCommonContentPageSize() {
    try {
        resizeRSPanel();
    } catch (e) {
        alert(e.message);
    }

    try {
        resizeEDPanel();
    } catch (e) {
        alert(e.message);
    }

}

function showAndHideSilder() {

    if($("#PfLeftSideBarMenu").length==0){
        return ;
    }

    $("#HiddenMenuLI").blur();
    $("#HiddenMenuLI").find('a').blur();

    try {
        if ($("#PfLeftSideBarMenu").is(":hidden")) {
            $("#PfLeftSideBarMenu").show();
            //fa-compress
            //fa-expand
            //removeClass()
            $("#HiddenMenuLI").find("i").removeClass("fa-expand");
            $("#HiddenMenuLI").find("i").addClass("fa-compress");
            //alert("---------------1");
            $.cookie('PfLeftSideBarMenu_HSFlag','1',{ path: "/"});
            $("#page-wrapper").css("margin-left", _globalLeftMenuWidth+"px");
            $(".content-area-automarginleft").css("margin-left", _globalLeftMenuWidth+"px");

            try{
                if (typeof(pfCusShowAndHideSilder) != "undefined") {
                    pfCusShowAndHideSilder(true);
                }
            }catch(e){
                alert(e);
            }

            $(window).resize();
        } else {
            $("#PfLeftSideBarMenu").hide();
            //fa-compress
            //fa-expand
            //addClass()
            $("#HiddenMenuLI").find("i").removeClass("fa-compress");
            $("#HiddenMenuLI").find("i").addClass("fa-expand");
            //alert("---------------2");

            //var ind = $.cookie('PfLeftSideBarMenu_HSFlag');
            //alert('setting pre ind='+ind);
            $.cookie('PfLeftSideBarMenu_HSFlag', '', { expires: -1,path: "/" }); // 删除 cookie
            $.cookie('PfLeftSideBarMenu_HSFlag','0',{ path: "/"});
            //ind = $.cookie('PfLeftSideBarMenu_HSFlag');
            //alert('setting after ind='+ind);
            $("#page-wrapper").css("margin-left", "0px");
            $(".content-area-automarginleft").css("margin-left", "0px");
            //window.alert("setting left 0px");

            try{
                if (typeof(pfCusShowAndHideSilder) != "undefined") {
                    pfCusShowAndHideSilder(false);
                }
            }catch(e){
                alert(e);
            }

            $(window).resize();
        }
    } catch (e) {
        alert(e.message);
    }
}


/*设置页面高度和宽度相关的数据*/
function settingHtmPageSize() {
    $(window).bind("load resize", function() {

        //if($("#PfLeftSideBarMenu").length>0){
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;

        if($("#PfLeftSideBarMenu").length>0){
            if (width < _globalMinWinWidth) {
                //$('div.navbar-collapse').addClass('collapse');
                $('div#sidebar-menudiv').addClass('collapse');
            } else {
                //$('div.navbar-collapse').removeClass('collapse');
                $('div#sidebar-menudiv').removeClass('collapse');
            }
        }


        //
        if (width < _globalMinWinWidth) {
            $("body").css("overflow", "");
        } else {
            $("body").css("overflow", "hidden");
        }

        if (width < _globalMinWinWidth) {
            $("#PfLeftSideBarMenu").css("height", '');
            $("#PfLeftSideBarMenu").css("overflow", "");

            if(_autoMoveSettiingNavbar){
                $("#settiing-navbar").insertAfter($("#title-navbar-content"));
            }

            $("#page-wrapper").css("overflow", "");
            $(".sidebar").css("width","100%");
            $("#PfLeftSideBarMenu").css("margin-top","0px");
        } else {
            $("#PfLeftSideBarMenu").css("overflow", "auto");

            if(_autoMoveSettiingNavbar){
                $("#settiing-navbar").insertAfter($("#title-navbar"));
            }

            $(".sidebar").width(_globalLeftMenuWidth);
            $("#PfLeftSideBarMenu").css("margin-top",""+_globalLeftMenuHeight+"px");
        }


        //标题高度变量
        var topOffset = 0;
        if ($("#title-navbar").length > 0) {
            if ($("#title-navbar").parent().length > 0) {
                topOffset = $("#title-navbar").parent().height();
            } else {
                topOffset = $("#title-navbar").height();
            }
        }

        //设置高度
        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height);
        var oldheight = height;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");

            if (width < _globalMinWinWidth) {
                $("body").css("overflow", "auto");
            } else {
                $("body").css("overflow", "hidden");
            }

            settingSidebarHeight(width, height);
            settingPageWrapperHeight(width, height);
        }

        if (width < _globalMinWinWidth) {
            //删除顶部的放大缩小元素
            $("#HiddenMenuLI").remove();
            $("#page-wrapper").css("margin-left", "0px");
        } else {

            //加入元素
            var leftWidth = _globalLeftMenuWidth+"px";
            if($("#PfLeftSideBarMenu").length<=0){
                leftWidth = "0px";
            }


            //加入元素
            if ($("#HiddenMenuLI").length <= 0) {
                if($("#PfLeftSideBarMenu").length>0){
                    $("#UserDropdown").after("<li id='HiddenMenuLI' style='margin-right: 5px;'><a href='#' class='nav-title-compress nav-title-text-color-theme'><i class='fa fa-compress'></i></a></li>");
                    $("#HiddenMenuLI").click(showAndHideSilder);
                }


                var ind = $.cookie('PfLeftSideBarMenu_HSFlag');
                if(ind&&ind=='0'){
                    //alert("隐藏菜单");
                    //$("#HiddenMenuLI").trigger('click');
                    $("#PfLeftSideBarMenu").hide();
                    $("#page-wrapper").css("margin-left", "0px");
                    $(".content-area-automarginleft").css("margin-left", "0px");
                    $(this).find("i").removeClass("fa-compress");
                    $(this).find("i").addClass("fa-expand");
                }else{
                    $("#page-wrapper").css("margin-left", leftWidth);
                    $(".content-area-automarginleft").css("margin-left", leftWidth);
                }
            }else{
                var ind = $.cookie('PfLeftSideBarMenu_HSFlag');
                //alert('ind='+ind);
                if(ind&&ind=='0'){
                    $("#page-wrapper").css("margin-left", "0px");
                    $(".content-area-automarginleft").css("margin-left", "0px");
                }else{
                    $("#page-wrapper").css("margin-left", leftWidth);
                    $(".content-area-automarginleft").css("margin-left", leftWidth);
                }
            }
        }
        //}

        //设置通用页面尺码
        settingCommonContentPageSize();

		/*调用其他函数初始化高度宽度数据*/
        try {
            if (typeof(pfSettingWithAndHeight) != "undefined") {

                var offsetToolbarCrumb = 0;
                if($("#ToolbarCrumb").length>0){
                    offsetToolbarCrumb = $("#ToolbarCrumb").outerHeight();
                }
                pfSettingWithAndHeight(width, height-offsetToolbarCrumb);
            }
        } catch (e) {
            alert(e.message);
        }

        //滚动到指定位置
        try{
            //$('#PfLeftSideBarMenu').animate({scrollTop:$('#PfLeftSideBarMenu').height()},'slow');
            var menua = $('#PfLeftSideBarMenu').find("a.modulelink.active");
            if(menua.length>0){
                $('#PfLeftSideBarMenu').animate({scrollTop:menua.offset().top-_globalLeftMenuHeight},'slow');
            }
        }catch(e){
            alert(e);
        }
    });
}


/*设置侧边栏的高度*/
function settingSidebarHeight(width, height) {
    if (width < _globalMinWinWidth) {
        $("#PfLeftSideBarMenu").removeAttr("height");
        $("#PfLeftSideBarMenu").css("height", '');
    } else {
        $("#PfLeftSideBarMenu").height(height+_globalLeftMenuHeightOffset);
    }
}

/*设置页面内容区域的高度,指的是 page-wrapper*/
function settingPageWrapperHeight(width, height) {
    if (width < _globalMinWinWidth) {
        $("#page-wrapper").removeAttr("overflow");
        $("#page-wrapper").css("padding", '0px');
    } else {
        $("#page-wrapper").height(height);
        $("#page-wrapper").css("overflow", "auto");
        $("#page-wrapper").css("padding", '0px');
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 设置form 的必填字段标记
 * */
function formReqireField() {
    $(".requiredflag").each(function() {
        //$(this).after("<span style='position:relative;top:5px;color:red;font-size:15px;'>&nbsp;*</span>");
        //$(this).after("<span class='requiredflag-input'>&nbsp;*</span>");
        $(this).css("color","red");
    });
    // 必填项浅底色显示 只需在input的class 中添加required  Ryan 添加2016-07-02
    //$(".required").each(function() {
    //	$(this).css("background-color","#FFF8DC")
    //});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
