/***********************************************************************************************************************/
/**
 * string 操作类
 * var buffer = new StringBuffer ();
 * buffer.append("hello ");
 * buffer.append("world");
 var result = buffer.toString();
 * */
function StringBuffer () {
    this._strings_ = new Array();
}
StringBuffer.prototype.append = function(str) {
    this._strings_.push(str);
};
StringBuffer.prototype.toString = function() {
    return this._strings_.join("");
};

//校验参数对象有效
//如果有效则返回10
//否则返回小于 9 的数据
function _checkParamValid9(paramObj){
    if(typeof(paramObj)=='undefined'){
        return 0;
    }

    if(paramObj==null){
        return 1;
    }

    return 10;
}
/***********************************************************************************************************************/

/***********************************************************************************************************************/
/***********************************************************************************************************************/
/***********************************************************************************************************************/
/***********************************************************************************************************************/

/*!
 * jquery.base64.js 0.1 - https://github.com/yckart/jquery.base64.js
 * Makes Base64 en & -decoding simpler as it is.
 *
 * Based upon: https://gist.github.com/Yaffle/1284012
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/10
 **/
;(function($) {

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        a256 = '',
        r64 = [256],
        r256 = [256],
        i = 0;

    var UTF8 = {

        /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
        encode: function(strUni) {
            // use regular expressions & String.replace callback function for better efficiency
            // than procedural approaches
            var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
                function(c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
                })
                .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
                    function(c) {
                        var cc = c.charCodeAt(0);
                        return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
                    });
            return strUtf;
        },

        /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
        decode: function(strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
                function(c) { // (note parentheses for precence)
                    var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                })
                .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
                    function(c) { // (note parentheses for precence)
                        var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                        return String.fromCharCode(cc);
                    });
            return strUni;
        }
    };

    while(i < 256) {
        var c = String.fromCharCode(i);
        a256 += c;
        r256[i] = i;
        r64[i] = b64.indexOf(c);
        ++i;
    }

    function code(s, discard, alpha, beta, w1, w2) {
        s = String(s);
        var buffer = 0,
            i = 0,
            length = s.length,
            result = '',
            bitsInBuffer = 0;

        while(i < length) {
            var c = s.charCodeAt(i);
            c = c < 256 ? alpha[c] : -1;

            buffer = (buffer << w1) + c;
            bitsInBuffer += w1;

            while(bitsInBuffer >= w2) {
                bitsInBuffer -= w2;
                var tmp = buffer >> bitsInBuffer;
                result += beta.charAt(tmp);
                buffer ^= tmp << bitsInBuffer;
            }
            ++i;
        }
        if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
        return result;
    }

    var Plugin = $.base64 = function(dir, input, encode) {
        return input ? Plugin[dir](input, encode) : dir ? null : this;
    };

    Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
        plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
        plain = code(plain, false, r256, b64, 8, 6);
        return plain + '===='.slice((plain.length % 4) || 4);
    };

    Plugin.atob = Plugin.decode = function(coded, utf8decode) {
        coded = String(coded).split('=');
        var i = coded.length;
        do {--i;
            coded[i] = code(coded[i], true, r64, a256, 6, 8);
        } while (i > 0);
        coded = coded.join('');
        return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
    };
}(jQuery));

/***********************************************************************************************************************/
/*
 * jquery.simulate - simulate browser mouse and keyboard events
 * Copyright (c) 2009 Eduardo Lundgren (eduardolundgren@gmail.com)
 * and Richard D. Worth (rdworth@gmail.com
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */
;(function($) {

    $.fn.extend({
        simulate: function(type, options) {
            return this.each(function() {
                var opt = $.extend({}, $.simulate.defaults, options || {});
                new $.simulate(this, type, opt);
            });
        }
    });

    $.simulate = function(el, type, options) {
        this.target = el;
        this.options = options;

        if (/^drag$/.test(type)) {
            this[type].apply(this, [this.target, options]);
        } else {
            this.simulateEvent(el, type, options);
        }
    };

    $.extend($.simulate.prototype, {
        simulateEvent: function(el, type, options) {
            var evt = this.createEvent(type, options);
            this.dispatchEvent(el, type, evt, options);
            return evt;
        },
        createEvent: function(type, options) {
            if (/^mouse(over|out|down|up|move)|(dbl)?click$/.test(type)) {
                return this.mouseEvent(type, options);
            } else if (/^key(up|down|press)$/.test(type)) {
                return this.keyboardEvent(type, options);
            }else if(/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/.test(type)){
                return this.htmlEvent(type, options);
            }
        },
        mouseEvent: function(type, options) {
            var evt;
            var e = $.extend({
                bubbles: true, cancelable: (type != "mousemove"), view: window, detail: 0,
                screenX: 0, screenY: 0, clientX: 0, clientY: 0,
                ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
                button: 0, relatedTarget: undefined
            }, options);

            var relatedTarget = $(e.relatedTarget)[0];

            if ($.isFunction(document.createEvent)) {
                evt = document.createEvent("MouseEvents");
                evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
                    e.screenX, e.screenY, e.clientX, e.clientY,
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                    e.button, e.relatedTarget || document.body.parentNode);
            } else if (document.createEventObject) {
                evt = document.createEventObject();
                $.extend(evt, e);
                evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
            }
            return evt;
        },
        keyboardEvent: function(type, options) {
            var evt;

            var e = $.extend({ bubbles: true, cancelable: true, view: window,
                ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
                keyCode: 0, charCode: 0
            }, options);

            if ($.isFunction(document.createEvent)) {
                try {
                    evt = document.createEvent("KeyEvents");
                    evt.initKeyEvent(type, e.bubbles, e.cancelable, e.view,
                        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                        e.keyCode, e.charCode);
                } catch(err) {
                    evt = document.createEvent("Events");
                    evt.initEvent(type, e.bubbles, e.cancelable);
                    $.extend(evt, { view: e.view,
                        ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
                        keyCode: e.keyCode, charCode: e.charCode
                    });
                }
            } else if (document.createEventObject) {
                evt = document.createEventObject();
                $.extend(evt, e);
            }
            if (($.browser !== undefined) && ($.browser.msie || $.browser.opera)) {
                evt.keyCode = (e.charCode > 0) ? e.charCode : e.keyCode;
                evt.charCode = undefined;
            }
            return evt;
        },

        htmlEvent: function(type, options) {
            var evt;
            /*
             if( document.createEvent) {
             var event = document.createEvent ("HTMLEvents");
             event.initEvent("resize", true, true);
             window.dispatchEvent(event);
             } else if(document.createEventObject){
             window.fireEvent("onresize");
             }
             */
            var e = $.extend({ bubbles: true, cancelable: true, view: window,
                ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
                keyCode: 0, charCode: 0
            }, options);

            if ($.isFunction(document.createEvent)) {
                try {
                    evt = document.createEvent("HTMLEvents");
                    evt.initEvent(type, true,true);
                } catch(err) {
                    evt = document.createEvent("Events");
                    evt.initEvent(type, e.bubbles, e.cancelable);
                    $.extend(evt, { view: e.view,
                        ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
                        keyCode: e.keyCode, charCode: e.charCode
                    });
                }
            } else if (document.createEventObject) {
                evt = document.createEventObject();
                $.extend(evt, e);
            }
            return evt;
        },

        dispatchEvent: function(el, type, evt) {
            if (el.dispatchEvent) {
                el.dispatchEvent(evt);
            } else if (el.fireEvent) {
                el.fireEvent('on' + type, evt);
            }
            return evt;
        },

        drag: function(el) {
            var self = this, center = this.findCenter(this.target),
                options = this.options,	x = Math.floor(center.x), y = Math.floor(center.y),
                dx = options.dx || 0, dy = options.dy || 0, target = this.target;
            var coord = { clientX: x, clientY: y };
            this.simulateEvent(target, "mousedown", coord);
            coord = { clientX: x + 1, clientY: y + 1 };
            this.simulateEvent(document, "mousemove", coord);
            coord = { clientX: x + dx, clientY: y + dy };
            this.simulateEvent(document, "mousemove", coord);
            this.simulateEvent(document, "mousemove", coord);
            this.simulateEvent(target, "mouseup", coord);
        },
        findCenter: function(el) {
            var el = $(this.target), o = el.offset();
            return {
                x: o.left + el.outerWidth() / 2,
                y: o.top + el.outerHeight() / 2
            };
        }
    });

    $.extend($.simulate, {
        defaults: {
            speed: 'sync'
        },
        VK_TAB: 9,
        VK_ENTER: 13,
        VK_ESC: 27,
        VK_PGUP: 33,
        VK_PGDN: 34,
        VK_END: 35,
        VK_HOME: 36,
        VK_LEFT: 37,
        VK_UP: 38,
        VK_RIGHT: 39,
        VK_DOWN: 40
    });

})(jQuery);

/***********************************************************************************************************************/

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));

/***********************************************************************************************************************/

/*单选对象 checkbox*/
(function($) {
    $.fn.extend({
        "SingleCheckBoxTools": function(options) {
            options = $.extend({
                IdFieldTag: 'rci',
                NameFieldTag: 'rcn',
                InvokeFun: null,
                checkboxSelectedFun: function(inputObj, allInputObjs,globaloptions) {
                    try {
                        if (inputObj.is(':checked')) {
                            var cv = inputObj.val();
                            var cvn = inputObj.attr("showName");
                            idObj.val(cv);
                            nameObj.val(cvn);

                            allObjs.each(function() {
                                var ccv = $(this).val();
                                if (ccv != cv) {
                                    $(this).attr("checked", false);
                                } else {
                                    $(this).attr("checked", true);
                                }
                            });
                        } else {
                            idObj.val("");
                            nameObj.val("");
                        }
                    } catch (e) {
                        alert(e.message);
                    }
                },
                rowSelectFun: function(inputObj,allInputObjs,globaloptions) {
                    /*
                     if ($(inputObj).parents("tr:first").length > 0) {
                     $(inputObj).parents("tr:first").dblclick(function() {
                     //alert("选择行对象");
                     });
                     }*/
                }
            }, options); //这里用了$.extend方法，扩展一个对象
            var idObj = $("#" + options.IdFieldTag);
            var nameObj = $("#" + options.NameFieldTag);
            //var InvokeFun = options.InvokeFun;



            var allObjs = this;

            this.each(
                function() {
                    //绑定行选择函数
                    options.rowSelectFun($(this),allObjs,options);


                    if (idObj.val() == $(this).val()) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                    $(this).click(
                        function(event) {

                            options.checkboxSelectedFun($(this), allObjs,options)

                            try {
                                if (("undefined" == typeof(options.InvokeFun)) || !options.InvokeFun) {

                                } else {
                                    options.InvokeFun(this);
                                }
                            } catch (e) {
                                alert(e.message);
                            }

                            event.stopPropagation();
                        }
                    );

                }

            );
            return this;
        }
    });
})(jQuery);

/***********************************************************************************************************************/

/*
 单选对象 radio
 */
(function ($) {
    $.fn.extend({"SingleRadioTools": function (options) {
        options = $.extend({
            IdFieldTag: 'rci',
            NameFieldTag: 'rcn',
            InvokeFun:null
        }, options); //这里用了$.extend方法，扩展一个对象
        var idObj = $("#" + options.IdFieldTag);
        var nameObj = $("#" + options.NameFieldTag);

        this.each(
            function(){

                if(idObj.val()==$(this).val()){
                    $(this).attr("checked",true);

                }else{
                    $(this).attr("checked",false);
                }

                $(this).click(
                    function(){
                        if ($(this).is(':checked')) {
                            idObj.val($(this).val());
                            nameObj.val($(this).attr("showName"));
                        }
                        try{
                            if(("undefined" == typeof(options.InvokeFun))||!options.InvokeFun){

                            }else{
                                options.InvokeFun(this);
                            }
                        }catch(e){alert(e.message);}
                    }
                );

            }

        );
        return this;//return为了保持jQuery的链式操作
    }
    });
})(jQuery);

/***********************************************************************************************************************/

/*级联操作对象*/
function InitULCheckBoxCascadeTools(rootUL,ParentUL){
    $(ParentUL).children("li").each(function(){
        var liobj = this;
        $(liobj).children("input[type='checkbox']").click(function(){
            //绑定本级的checkbox
            if ($(this).is(':checked')) {
                //将子节点的checkbox全部选择为true
                $(liobj).children("ul").find("input[type='checkbox']").attr("checked", true);
                //设置所有的上级节点为选择标记
                var pu = ParentUL;
                //var i=0;
                while($(pu)[0]!=$(rootUL)[0]){
                    //alert("ddddd----"+$(pu).attr("id")+",rootul="+$(rootUL).attr("id"));

                    $(pu).parent().children("input[type='checkbox']").attr("checked", true);
                    pu = $(pu).parent().parent();

                    //i++;
                    //if(i>3){
                    //	break;
                    //}
                }
            }else{
                $(liobj).children("ul").find("input[type='checkbox']").attr("checked", false);

                //查看上级元素数据
                var pu = ParentUL;
                while($(pu)[0]!=$(rootUL)[0]){

                    var flag = true;
                    $(pu).parent().children("input[type='checkbox']").attr("checked", false);
                    $(pu).parent().find("input[type='checkbox']").each(function(){
                        if($(this).attr("checked") == "checked"){
                            flag = false;
                        }
                    });

                    if(!flag){
                        $(pu).parent().children("input[type='checkbox']").attr("checked", true);
                    }

                    pu = $(pu).parent().parent();
                }
            }
        });

        //绑定下级UL
        $(liobj).children("ul").each(function(){
            InitULCheckBoxCascadeTools(rootUL,this);
        })
    });
}
(function($) {
    $.fn.extend({"ULCheckBoxCascadeTools": function(options) {
        var rootObjs = this;
        rootObjs.each(function(){
            //找到子节点
            /*$(this).children("li").children("input[type='checkbox']").each(function(){
             alert($(this).val());
             });*/
            InitULCheckBoxCascadeTools(this,this)

        });
    }
    });
})(jQuery);


/***********************************************************************************************************************/

/*选择控件初始化对象 SelectCtrlDelayInit*/
(function($) {
    $.fn.extend({"SelectCtrlDelayInit": function() {

        var allObjs = this;

        this.each(
            function() {
                var currentValue = $(this).attr("currentValue");
                if(currentValue){
                    $(this).val(currentValue);
                }
            }
        );
        return this;
    }
    });
})(jQuery);

/***********************************************************************************************************************/
/*
 *显示页面的错误消息
 */
(function ($) {
    $.fn.extend({
        "VisualAlertPageErrorMsg": function (options){
            options = $.extend({
                MsgInfoSourceId: 'PageMsg'
            }, options); //这里用了$.extend方法，扩展一个对象

            //消息源区域
            var msgInfoSource = $("#" + options.MsgInfoSourceId);
            if(msgInfoSource&&msgInfoSource.length>0){
                var msgSetObj = msgInfoSource.children();
                if (msgSetObj && msgSetObj.length > 0) {
                    var mhtml = "<div class='alert alert-warning' role='alert'>";
                    mhtml += "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";

                    msgSetObj.each(function(){
                        mhtml += $(this).html();
                    });

                    mhtml += "</div>";
                    $(this).empty();
                    $(this).append(mhtml);
                }
            }

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

function commonBtnConfirmClick(elementObj,btnGroupArea,globalOptions,btnOutParamObj){
    if(confirm(btnOutParamObj.confirm)){
        return true;
    }
    return false;
}

/***********************************************************************************************************************/
//基于bootstrap的模式对话框,警告信息
(function ($) {
    $.fn.extend({
        "VisualAlertPageErrorModalMsg": function (options){
            options = $.extend({
                MsgInfoSourceId: 'PageMsg',
                zindex:-1
            }, options); //这里用了$.extend方法，扩展一个对象

            //消息输出区域
            var msgbody =  $($(this).find(".modal-body"));
            //消息源区域
            var msgInfoSource = $("#" + options.MsgInfoSourceId);
            if(msgInfoSource&&msgInfoSource.length>0){
                var msgSetObj = msgInfoSource.children();
                if (msgSetObj && msgSetObj.length > 0) {
                    var mhtml = "";
                    msgSetObj.each(function(){
                        mhtml += $(this).html();
                    });
                    msgbody.empty();
                    msgbody.append(mhtml);

                    //设置显示层级
                    if(options.zindex>0){
                        //需要设值显示层级
                        $(this).css("z-index",""+options.zindex);
                    }

                    $(this).modal();
                }
            }

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
//基于bootstrap的模式对话框,警告信息
(function ($) {
    $.fn.extend({
        "VisualAlertModalMsgDialog": function (options){
            options = $.extend({
                msgcontent: '',
                zindex:-1,
                clickbtnid:"",//"alertmodaldialog-close",
                clickfun:null,
                settingfun:function(objelement,option){
                    //设置内容
                    if(option.msgcontent&&$.trim(option.msgcontent)!=""){
                        var msgbody = $(objelement.find(".modal-body"));
                        msgbody.empty();
                        msgbody.append(option.msgcontent);

                    }
                    //设置显示层级
                    if(option.zindex>0){
                        //需要设值显示层级
                        objelement.css("z-index",""+option.zindex);
                    }
                },
                showmodal:function(objelement,option){
                    objelement.modal();
                },
                showfun:function(objelement,goptions,e){},
                shownfun:function(objelement,goptions,e){},
                hidefun:function(objelement,goptions,e){},
                hidenfun:function(objelement,goptions,e){}
            }, options); //这里用了$.extend方法，扩展一个对象

            var objelement = $(this);


            var btnprefixstr = 'alertmodaldialog';
            if(objelement.attr('id')&&$.trim(objelement.attr('id'))!=""){
                btnprefixstr = objelement.attr('id');
            }

            if($.trim(options.clickbtnid)==""){
                options.clickbtnid = btnprefixstr+'-close';
            }

            //绑定按钮信息
            if(options.clickfun!=null){
                $("#"+options.clickbtnid).unbind();
                $("#"+options.clickbtnid).click(function(){
                    options.clickfun(options,objelement);
                });
            }

            //其他设置
            options.settingfun(objelement,options);

            //解除事件绑定
            objelement.off('show.bs.modal');
            objelement.off('shown.bs.modal');
            objelement.off('hide.bs.modal');
            objelement.off('hidden.bs.modal');

            //绑定事件
            objelement.on('show.bs.modal', function (e) {
                options.showfun(objelement,options,e);
            });
            objelement.on('shown.bs.modal', function (e) {
                options.shownfun(objelement,options,e);
            });
            objelement.on('hide.bs.modal', function (e) {
                options.hidefun(objelement,options,e);
            });
            objelement.on('hidden.bs.modal', function (e) {
                options.hidenfun(objelement,options,e);
            });

            //显示对话框
            options.showmodal(objelement,options);

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
//基于bootstrap的模式对话框,确定取消
(function ($) {
    $.fn.extend({
        "VisualConfirmModalMsgDialog": function (options){
            options = $.extend({
                msgcontent: '',
                zindex:-1,
                confirmbtnid:"",//"confirmmodaldialog-confirm",
                cancelbtnid:"",//"confirmmodaldialog-cancel",
                confirmfun:null,
                cancelfun:null,
                settingfun:function(objelement,option){
                    //设置内容
                    if(option.msgcontent&&$.trim(option.msgcontent)!=""){
                        var msgbody = $(objelement.find(".modal-body"));
                        msgbody.empty();
                        msgbody.append(option.msgcontent);

                    }
                    //设置显示层级
                    if(option.zindex>0){
                        //需要设值显示层级
                        objelement.css("z-index",""+option.zindex);
                    }
                },
                showmodal:function(objelement,option){
                    objelement.modal();
                },
                showfun:function(objelement,goptions,e){},
                shownfun:function(objelement,goptions,e){},
                hidefun:function(objelement,goptions,e){},
                hidenfun:function(objelement,goptions,e){}
            }, options); //这里用了$.extend方法，扩展一个对象

            var objelement = $(this);


            var btnprefixstr = 'confirmmodaldialog';
            if(objelement.attr('id')&&$.trim(objelement.attr('id'))!=""){
                btnprefixstr = objelement.attr('id');
            }

            if($.trim(options.confirmbtnid)==""){
                options.confirmbtnid = btnprefixstr+'-confirm';
            }

            if($.trim(options.cancelbtnid)==""){
                options.cancelbtnid = btnprefixstr+'-cancel';
            }

            //绑定按钮信息
            if(options.confirmfun!=null){
                $("#"+options.confirmbtnid).unbind();
                $("#"+options.confirmbtnid).click(function(){
                    options.confirmfun(options,objelement);
                });
            };

            //绑定取消按钮信息
            if(options.cancelfun!=null){
                $("#"+options.cancelbtnid).unbind();
                $("#"+options.cancelbtnid).click(function(){
                    options.cancelfun(options,objelement);
                });
            };

            //其他设置
            options.settingfun(objelement,options);


            //解除事件绑定
            objelement.off('show.bs.modal');
            objelement.off('shown.bs.modal');
            objelement.off('hide.bs.modal');
            objelement.off('hidden.bs.modal');

            //绑定事件
            objelement.on('show.bs.modal', function (e) {
                options.showfun(objelement,options,e);
            });
            objelement.on('shown.bs.modal', function (e) {
                options.shownfun(objelement,options,e);
            });
            objelement.on('hide.bs.modal', function (e) {
                options.hidefun(objelement,options,e);
            });
            objelement.on('hidden.bs.modal', function (e) {
                options.hidenfun(objelement,options,e);
            });

            //显示对话框
            options.showmodal(objelement,options);

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
//基于bootstrap的模式对话框,输入框
(function($) {
    $.fn.extend({
        "VisualModalInputDialog": function(options) {
            options = $.extend({
                msgcontent: '',
                zindex:-1,
                confirmbtnid:"",//"inputmodaldialog-confirm",
                cancelbtnid:"",//"inputmodaldialog-cancel",
                confirmfun:null,
                cancelfun:null,
                initsetting:{},//初始设置选项
                settingfun:function(objelement,option){
                    //设置内容
                    if(option.msgcontent&&$.trim(option.msgcontent)!=""){
                        var msgbody = $(objelement.find(".modal-body"));
                        msgbody.empty();
                        msgbody.append(option.msgcontent);
                    }
                    //设置显示层级
                    if(option.zindex>0){
                        //需要设值显示层级
                        objelement.css("z-index",""+option.zindex);
                    }
                },
                showmodal:function(objelement,option){
                    return objelement.modal();
                },
                fullParentWin:false,
                fullParentWinFun:function (objelement,goptions) {//自动填充父窗口高度
                    //alert($(window).height()+","+$(document).height());
                    //alert("h="+$(this).find(".modal-header").outerHeight(true));
                    //alert("f="+$(this).find(".modal-footer").outerHeight(true));
                    //modal-body
                    objelement.on('shown.bs.modal', function (e) {
                        var bh = $(document).height();

                        var modalContentObj =objelement.children(".modal-dialog").children(".modal-content");

                        if(modalContentObj.children(".modal-header").length>0){
                            bh = bh-modalContentObj.children(".modal-header").outerHeight(true);
                        }
                        if(modalContentObj.children(".modal-footer").length>0){
                            bh = bh-modalContentObj.children(".modal-header").outerHeight(true);
                        }

                        //相对位移
                        bh = bh-100;
                        modalContentObj.children(".modal-body").height(bh);
                        modalContentObj.children(".modal-body").css("overflow","auto");

                        //
                        goptions.fullParentShownfun(objelement,goptions,bh);
                    });
                },
                fullParentShownfun:function(objelement,goptions,height){
                },
                showfun:function(objelement,goptions,e){},
                shownfun:function(objelement,goptions,e){},
                hidefun:function(objelement,goptions,e){},
                hidenfun:function(objelement,goptions,e){}
            }, options); //这里用了$.extend方法，扩展一个对象


            var objelement = $(this);

            var btnprefixstr = 'inputmodaldialog';
            if(objelement.attr('id')&&$.trim(objelement.attr('id'))!=""){
                btnprefixstr = objelement.attr('id');
            }

            if($.trim(options.confirmbtnid)==""){
                options.confirmbtnid = btnprefixstr+'-confirm';
            }

            if($.trim(options.cancelbtnid)==""){
                options.cancelbtnid = btnprefixstr+'-cancel';
            }

            //绑定按钮信息
            if(options.confirmfun!=null){
                $("#"+options.confirmbtnid).unbind();
                $("#"+options.confirmbtnid).click(function(){
                    options.confirmfun(options,objelement);
                });
            };

            //绑定取消按钮信息
            if(options.cancelfun!=null){
                $("#"+options.cancelbtnid).unbind();
                $("#"+options.cancelbtnid).click(function(){
                    options.cancelfun(options,objelement);
                });
            };

            //其他设置
            options.settingfun(objelement,options);

            //初始化对话框数据
            //modify code by zzm 20160820
            var initsettingparam = $.extend({
                initsettingfun:function (initsettingparam) {
                    if($.trim(initsettingparam.formid)!=""){
                        if(initsettingparam.clearflag){
                            //alert('清除from:'+initsettingparam.formid);
                            $("#"+initsettingparam.formid).cusClearForm();
                        }
                        //alert('设置from:'+initsettingparam.formid);
                        $("#"+initsettingparam.formid).JsonToFormFastJson(initsettingparam);
                    }
                },
                formid:"",
                clearflag:false,
                json:{},
                namespace:"",
                initsettingfunAfter:function (initsettingparam) {
                    
                }
            },options.initsetting);
            //调用初始化函数数据
            initsettingparam.initsettingfun(initsettingparam);
            //调用数据初始化后的函数
            initsettingparam.initsettingfunAfter(initsettingparam);



            //解除事件绑定
            objelement.off('show.bs.modal');
            objelement.off('shown.bs.modal');
            objelement.off('hide.bs.modal');
            objelement.off('hidden.bs.modal');

            //设置高度
            if(options.fullParentWin){
                options.fullParentWinFun(objelement,options);
            }

            //绑定事件
            objelement.on('show.bs.modal', function (e) {
                options.showfun(objelement,options,e);
            });
            objelement.on('shown.bs.modal', function (e) {
                options.shownfun(objelement,options,e);
            });
            objelement.on('hide.bs.modal', function (e) {
                options.hidefun(objelement,options,e);
            });
            objelement.on('hidden.bs.modal', function (e) {
                options.hidenfun(objelement,options,e);
            });

            //显示对话框
            options.showmodal(objelement,options);

            return this; //return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
/**
 * 通用按钮点击函数
 * */
function commonBtnClick(elementObj,globalOptions,btnGroupArea){
    var btnOutParam = elementObj.attr("webOutParam");
    //alert("这是服务端输出的参数:"+btnOutParam);
    var btnOutParamObj = null;
    try{
        if(btnOutParam&& $.trim(btnOutParam)!=""){
            btnOutParamObj = $.parseJSON("{"+btnOutParam.replace(/\'/g,'"')+"}");
        }
    }catch (e){
        alert("服务器输出参数异常:"+e.message);
    }

    if(elementObj){
        //alert("elementObj.name="+elementObj.name);
        var clickfunstr = elementObj.attr("clickfun");
        if(clickfunstr&&$.trim(clickfunstr)!=""){
            try {
                eval(clickfunstr + "(elementObj,globalOptions,btnOutParamObj,btnGroupArea)");
                return;
            } catch (e) {
                alert(e.message);
                return;
            }
        }

        //确定函数
        var confirmfunstr = elementObj.attr("confirmfun");
        if (confirmfunstr && $.trim(confirmfunstr) != "") {
            try {
                if (!eval(confirmfunstr + "(elementObj,globalOptions,btnOutParamObj,btnGroupArea)")) {
                    return;
                }
            } catch (e) {
                alert(e.message);
                return;
            }

        }
    }

    if(btnOutParamObj!=null){
        //点击函数
        if(btnOutParamObj.clickfun&& $.trim(btnOutParamObj.clickfun)!=""){
            try{
                eval(btnOutParamObj.clickfun+"(elementObj,globalOptions,btnOutParamObj,btnGroupArea)");
                return;
            }catch(e){
                alert(e.message);
                return;
            }
        }
        //确定函数
        if(btnOutParamObj.confirmfun&& $.trim(btnOutParamObj.confirmfun)!=""){
            try{
                if(!eval(btnOutParamObj.confirmfun+"(elementObj,globalOptions,btnOutParamObj,btnGroupArea)")){
                    return;
                }
            }catch(e){
                alert(e.message);
                return;
            }
        }
    }
    //if(btnOutParam)

    //获得需要提交的FormID
    var reqFormObjId = "";//btnGroupArea.attr("formId");
    if(btnGroupArea&&btnGroupArea!=null){
        reqFormObjId = btnGroupArea.attr("formId");
    }
    if(!reqFormObjId||$.trim(reqFormObjId)==""){
        reqFormObjId = globalOptions.formObjId;
    }
    //按钮组需要提交的URL
    var formTargetUrl = "";//btnGroupArea.attr("formTargetUrl");
    if(btnGroupArea&&btnGroupArea!=null){
        formTargetUrl = btnGroupArea.attr("formTargetUrl");
    }
    var formObj;
    if(!reqFormObjId||$.trim(reqFormObjId)==""){
        formObj=$(elementObj.parents("form")[0]);
    }else{
        formObj = $($("#"+reqFormObjId)[0]);
    }

    //查看服务器端请求参数

    //缺省情况下校验form提交的函数
    if(!globalOptions.checkform(formObj,elementObj,btnGroupArea)){
        return;
    }
    if(formObj&&formObj!=null){
        //设置form提交的路径
        if(!formTargetUrl||$.trim(formTargetUrl)==""){
            //alert("提交路径:"+formObj.attr("targeturl")+elementObj.attr("targetActionName"));
            formObj.attr("action",formObj.attr("targeturl")+elementObj.attr("targetActionName"));
        }else{
            formObj.attr("action",formTargetUrl+elementObj.attr("targetActionName"));
        }
        //提交form
        formObj.submit();
    }else{
        alert("未找到form对象");
    }

}

/*
 * 按钮提交对象
 */
(function ($) {
    $.fn.extend({
        "FormBtnsOp": function (options){
            options = $.extend({
                formObjId:"",
                btnClick:function(elementObj,globalOptions){//按钮的点击函数
                    commonBtnClick(elementObj,globalOptions);
                },
                checkform:function(formObj,elementObj){
                    return true;
                }
            }, options); //这里用了$.extend方法，扩展一个对象


            var globalOptions = options;
            var allBtns = $(this);

            allBtns.each(function(){

                //绘制按钮区域
                var btnObj = $(this);

                btnObj.click(function(){
                    try{
                        //执行事件函数
                        globalOptions.btnClick(btnObj,globalOptions);
                    }catch(e){
                        alert(e.message);
                    }
                });

            });

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);
/*
 *根据Json数据在特定区域中显示提交按钮
 */
(function ($) {
    $.fn.extend({
        "VisualFormBtnGroup": function (options){
            options = $.extend({
                CmdDataObjs: [],
                formObjId:"",
                btnClass:"pageopbtn",
                btnPositionType:"",resPowers:[],
                formatbtn:function(elementobj,btnClass,btnareaobj){

                    var btnclassstr = "";//"btn-default";
                    if(elementobj.btnclass&&$.trim(elementobj.btnclass)!=""){
                        btnclassstr = elementobj.btnclass;
                    }

                    //
                    var btnCaption = elementobj.caption;
                    if (!btnCaption || $.trim(btnCaption) == "") {
                        btnCaption = "";
                    }

                    if($.trim(btnclassstr)==""){
                        if(btnareaobj.attr("btnclass")){
                            btnclassstr = btnareaobj.attr("btnclass");
                        }
                    }

                    if($.trim(btnclassstr)==""){
                        btnclassstr = "btn btn-default";
                    }
                    //clickfun
                    //confirmfun

                    var clickfunstr = "";
                    if(elementobj.clickfun&&$.trim(elementobj.clickfun)!=""){
                        clickfunstr=" clickfun=\""+elementobj.clickfun+"\"";
                    }

                    var confirmfunstr = "";
                    if(elementobj.confirmfun&&$.trim(elementobj.confirmfun)!=""){
                        confirmfunstr=" confirmfun=\""+elementobj.confirmfun+"\"";
                    }

                    //过滤是否是需要自定义点击函数
                    if(elementobj.clickfunobj&&elementobj.clickfunobj!=null){
                        //alert("过滤 id="+elementobj.id);
                        btnClass = "";
                    }

                    var htmlstr = "<button "+clickfunstr+" "+confirmfunstr+" id=\""+elementobj.id+"\" type=\"button\" class=\""+btnclassstr+" "+btnClass+"\" webOutParam=\""+elementobj.outParam+"\" targetActionName=\""+elementobj.actionName+"\" serverParam=\""+elementobj.webBtnParam+"\" title=\""+btnCaption+"\">"+elementobj.name+"</button>"

                    //alert(elementobj.webBtnParam);
                    btnareaobj.append(htmlstr);
                },
                btnClick:function(elementObj,globalOptions,btnGroupArea){//按钮的点击函数
                    commonBtnClick(elementObj,globalOptions,btnGroupArea);
                },
                checkform:function(formObj,elementObj,currentBtnArea){
                    return true;
                },
                resPowerFilter:function(resPowers,elementobj){
                    //alert("reqPowers.length="+elementobj.reqPowers.length);
                    if(!elementobj.reqPowers||elementobj.reqPowers.length==0){
                        return true;
                    }

                    if(!resPowers||resPowers.length==0){
                        return false;
                    }

                    /*
                    for(i=0;i<elementobj.reqPowers.length;i++){
                        hasflag = false;
                        for(j=0;j<resPowers.length;j++){
                            if(elementobj.reqPowers[i]==resPowers[j]){
                                hasflag = true;
                                break;
                            }
                        }

                        if(!hasflag){
                            return false;
                        }
                    }


                    return true;*/
                    return regexp_vsp_m(resPowers,elementobj.reqPowers);
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            //清空区域中的所有按钮
            var btnareaobj = $(this);
            btnareaobj.empty();

            var globalOptions = options;

            this.each(function(){

                //绘制按钮区域
                var btnGroupArea = $(this);

                //按钮组请求的类型
                var positionType = $.trim(globalOptions.btnPositionType);//

                if(positionType==""){
                    btnGroupArea.attr("positionType");
                    if(!positionType){
                        positionType = "";
                    }
                }

                positionType = $.trim(positionType);


                //创建按钮内容
                globalOptions.CmdDataObjs.forEach(function(elementobj){

                    if(globalOptions.resPowerFilter(globalOptions.resPowers,elementobj)){
                        if(elementobj.positionType){
                            if($.trim(elementobj.positionType)==""){//适用于所有的位置
                                globalOptions.formatbtn(elementobj,globalOptions.btnClass,btnGroupArea);
                            }else{
                                gm = $.trim(elementobj.positionType).split(";");
                                if(checkValueInGroup(positionType,gm)>0){
                                    globalOptions.formatbtn(elementobj,globalOptions.btnClass,btnGroupArea);
                                }
                            }
                        }else{
                            globalOptions.formatbtn(elementobj,globalOptions.btnClass,btnGroupArea);
                        }
                    }


                    /*
                     if(elementobj.positionType&&elementobj.positionType!=positionType){
                     //
                     }else{
                     globalOptions.formatbtn(elementobj,btnareaobj,globalOptions.btnClass);
                     }*/
                });

                $("."+globalOptions.btnClass).click(function(){
                    try{
                        //执行事件函数
                        globalOptions.btnClick($(this),globalOptions,btnGroupArea);
                    }catch(e){
                        alert(e.message);
                    }
                });

                //针对自定义函数创建调用点击函数
                //这个按钮必须有id属性
                globalOptions.CmdDataObjs.forEach(function(elementobj) {

                    if(elementobj.clickfunobj&&elementobj.clickfunobj!=null){
                        var btnObj = $("#"+elementobj.id);
                        if(btnObj&&btnObj.length>0){
                            btnObj.click(function(){
                                elementobj.clickfunobj(btnObj,elementobj);
                            });
                        }

                    }

                });

            });

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);


/*
 *根据Json数据在特定区域中显示提交按钮,图标按钮
 */
(function ($) {
    $.fn.extend({
        "VisualFormIconBtnGroup": function (options){
            options = $.extend({
                CmdDataObjs: [],
                formObjId:"",
                btnClass:"pageopbtn",
                btnPositionType:"",resPowers:[],
                formatbtn:function(elementobj,btnClass,btnareaobj){

                    var btnIcon = elementobj.icon;
                    var btnShowText = elementobj.btnShowText;
                    if (!btnIcon || $.trim(btnIcon) == "") {
                        //btnIcon = "fa-edit";
                        if (!btnShowText || $.trim(btnShowText) == "") {
                            btnIcon = "fa-edit";
                        }
                    }

                    if (!btnShowText || $.trim(btnShowText) == "") {
                        btnShowText = "";
                    }
                    //
                    var btnCaption = elementobj.caption;
                    if (!btnCaption || $.trim(btnCaption) == "") {
                        btnCaption = "";
                    }

                    //
                    var btnImage = "";
                    //<i class='" + btnIcon + "'></i>
                    if($.trim(btnIcon) == ""){
                        btnImage = btnShowText;
                    }else{
                        if($.trim(btnShowText) == ""){
                            btnImage = "<i class='" + btnIcon + "'></i>"+btnShowText;
                        }else{
                            btnImage = "<i class='" + btnIcon + " cust-btn-imgtxt'></i>"+btnShowText;
                        }

                    }

                    var btnclassstr = "";//"btn-default";

                    if(elementobj.btnclass&&$.trim(elementobj.btnclass)!=""){
                        btnclassstr = elementobj.btnclass;
                    }

                    if($.trim(btnclassstr)==""){
                        if(btnareaobj.attr("btnclass")){
                            btnclassstr = btnareaobj.attr("btnclass");
                        }
                    }

                    if($.trim(btnclassstr)==""){
                        btnclassstr = "btn btn-default";
                    }
                    //clickfun
                    //confirmfun

                    var clickfunstr = "";
                    if(elementobj.clickfun&&$.trim(elementobj.clickfun)!=""){
                        clickfunstr=" clickfun=\""+elementobj.clickfun+"\"";
                    }

                    var confirmfunstr = "";
                    if(elementobj.confirmfun&&$.trim(elementobj.confirmfun)!=""){
                        confirmfunstr=" confirmfun=\""+elementobj.confirmfun+"\"";
                    }


                    //过滤是否是需要自定义点击函数
                    if(elementobj.clickfunobj&&elementobj.clickfunobj!=null){
                        //alert("过滤 id="+elementobj.id);
                        btnClass = "";
                    }

                    var htmlstr = "<button "+clickfunstr+" "+confirmfunstr+" id=\""+elementobj.id
                        +"\" type=\"button\" class=\""+btnclassstr+" "
                        +btnClass+"\" webOutParam=\""
                        +elementobj.outParam+"\" targetActionName=\""
                        +elementobj.actionName+"\" serverParam=\""
                        +elementobj.webBtnParam+"\" title=\""+btnCaption+"\">"+btnImage+"</button>";

                    btnareaobj.append(htmlstr);
                },
                btnClick:function(elementObj,globalOptions,btnGroupArea){//按钮的点击函数
                    commonBtnClick(elementObj,globalOptions,btnGroupArea);
                },
                checkform:function(formObj,elementObj,currentBtnArea){
                    return true;
                },
                resPowerFilter:function(resPowers,elementobj){
                    //alert("reqPowers.length="+elementobj.reqPowers.length);
                    if(!elementobj.reqPowers||elementobj.reqPowers.length==0){
                        return true;
                    }

                    if(!resPowers||resPowers.length==0){
                        return false;
                    }

                    /*
                    for(i=0;i<elementobj.reqPowers.length;i++){
                        hasflag = false;
                        for(j=0;j<resPowers.length;j++){
                            if(elementobj.reqPowers[i]==resPowers[j]){
                                hasflag = true;
                                break;
                            }
                        }

                        if(!hasflag){
                            return false;
                        }
                    }


                    return true;*/
                    return regexp_vsp_m(resPowers,elementobj.reqPowers);
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            //清空区域中的所有按钮
            var btnareaobj = $(this);
            btnareaobj.empty();

            var globalOptions = options;

            btnareaobj.each(function(){

                //绘制按钮区域
                var btnGroupArea = $(this);

                //按钮组请求的类型
                var positionType = $.trim(globalOptions.btnPositionType);//

                if(positionType==""){
                    btnGroupArea.attr("positionType");
                    if(!positionType){
                        positionType = "";
                    }
                }

                positionType = $.trim(positionType);


                //创建按钮内容
                globalOptions.CmdDataObjs.forEach(function(elementobj){

                    if(globalOptions.resPowerFilter(globalOptions.resPowers,elementobj)){
                        if(elementobj.positionType){
                            if($.trim(elementobj.positionType)==""){//适用于所有的位置
                                globalOptions.formatbtn(elementobj,globalOptions.btnClass,btnGroupArea);
                            }else{
                                gm = $.trim(elementobj.positionType).split(";");
                                if(checkValueInGroup(positionType,gm)>0){
                                    globalOptions.formatbtn(elementobj,globalOptions.btnClass,btnGroupArea);
                                }
                            }
                        }else{
                            globalOptions.formatbtn(elementobj,globalOptions.btnClass,btnGroupArea);
                        }
                    }
                });

                //创建按钮对象的点击函数
                $("."+globalOptions.btnClass).click(function(){
                    try{
                        //执行事件函数
                        globalOptions.btnClick($(this),globalOptions,btnGroupArea);
                    }catch(e){
                        alert(e.message);
                    }
                });

                //针对自定义函数创建调用点击函数
                //这个按钮必须有id属性
                globalOptions.CmdDataObjs.forEach(function(elementobj) {

                    if(elementobj.clickfunobj&&elementobj.clickfunobj!=null){
                        var btnObj = $("#"+elementobj.id);
                        if(btnObj&&btnObj.length>0){

                            btnObj.click(function(){
                                try{
                                    //alert("ddd,bind click fun");
                                    elementobj.clickfunobj(btnObj,elementobj);
                                    //alert("ddd,bind click fundd");
                                }catch (e){alert(e.message)};

                            });
                        }

                    }

                });

            });

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);


//校验值是否在值组中,v 值,g 值数组,matchFun 匹配函数
function checkValueInGroup(v,g,matchFun){
    var matchCount=0;
    for(var key in g)
    {
        if(matchFun){
            if(matchFun(v,key)){
                matchCount++;
            }
        }else{
            if(key==v){
                matchCount++;
            }
        }
    }

    return matchCount;
}



/***********************************************************************************************************************/
/*
 *根据Json数据在特定区域中显示翻页按钮区的按钮
 */
(function($) {
    $.fn.extend({
        "VisualPaggingBtnGroup": function(options) {
            options = $.extend({
                dataObj: {},
                baseUrl: "",
                formObjId: "",
                btnClass: "pagingbtn_grouparea_a"
            }, options); //这里用了$.extend方法，扩展一个对象

            //清空区域中的所有按钮
            var drawAreaObj = $(this);
            drawAreaObj.empty();

            var globalOptions = options;

            //按钮组需要提交的form
            var currentFormObjId = drawAreaObj.attr("formId");
            if (!currentFormObjId || currentFormObjId == "") {
                currentFormObjId = globalOptions.formObjId;
            }



            if (!globalOptions.dataObj || !globalOptions.dataObj.TotalPageNum || globalOptions.dataObj.TotalPageNum <= 0) {
                var htmlstring = "<nav><ul class='pagination pagination_panel_footer'>"
                    + "<li class='disabled'><a href='#' aria-label='Previous' title='首页,共"
                    + globalOptions.dataObj.TotalPageNum + "页'><span aria-hidden='true'>&laquo;</span></a></li>"
                    + "<li class='disabled'><a href='#' aria-label='Next' title='尾页,共"
                    + globalOptions.dataObj.TotalPageNum + "页'><span aria-hidden='true'>&raquo;</span></a></li>"
                    + "</ul></nav>";

                drawAreaObj.append(htmlstring);

            } else if (globalOptions.dataObj.TotalPageNum <= 7) {

                var htmlstring = "<nav><ul class='pagination pagination_panel_footer'>";
                for (var i = 0; i < globalOptions.dataObj.TotalPageNum; i++) {
                    if (i == globalOptions.dataObj.CurrentPageNo) {
                        htmlstring += "<li class='active'><a class='"+globalOptions.btnClass+"' href='#' targethref='" + globalOptions.baseUrl + "=" + i + "'>" + (i + 1) + "</a></li>";
                    } else {
                        htmlstring += "<li><a class='"+globalOptions.btnClass+"' href='#' targethref='" + globalOptions.baseUrl + "=" + i + "'>" + (i + 1) + "</a></li>";
                    }
                }
                htmlstring += "</ul></nav>";


                drawAreaObj.append(htmlstring);

            } else {

                var htmlheadstring = "<nav><ul class='pagination pagination_panel_footer'>"
                    + "<li><a class='"+globalOptions.btnClass+"'  href='#' targethref='"
                    + globalOptions.baseUrl + "=0' aria-label='Previous' title='首页,共"
                    + globalOptions.dataObj.TotalPageNum + "页'><span aria-hidden='true'>&laquo;</span></a></li>"
                    + "<li><a class='"+globalOptions.btnClass+"' href='#' targethref='"
                    + globalOptions.baseUrl + "=" + (globalOptions.dataObj.CurrentPageNo - 1) + "' aria-label='Previous' title='前一页'><span aria-hidden='true'>&lt;</span></a></li>";

                var ppindex = globalOptions.dataObj.CurrentPageNo - 1;
                var pindex = globalOptions.dataObj.CurrentPageNo;
                var peindx = globalOptions.dataObj.CurrentPageNo + 1;

                if (ppindex < 0) {
                    ppindex = 0;
                    pindex = ppindex + 1;
                    peindx = pindex + 1;
                }

                if (peindx >= globalOptions.dataObj.TotalPageNum) {
                    peindx = globalOptions.dataObj.CurrentPageNo;
                    pindex = peindx - 1;
                    ppindex = pindex - 1;
                }

                var htmlstr = "";
                if (ppindex == globalOptions.dataObj.CurrentPageNo) {
                    htmlstr += "<li class='active'><a class='"+globalOptions.btnClass+"' href='#' targethref='" + globalOptions.baseUrl + "=" + ppindex + "'>" + (ppindex + 1) + "</a></li>";
                } else {
                    htmlstr += "<li><a class='"+globalOptions.btnClass+"' href='#' targethref='" + globalOptions.baseUrl + "=" + ppindex + "'>" + (ppindex + 1) + "</a></li>";
                }
                if (pindex == globalOptions.dataObj.CurrentPageNo) {
                    htmlstr += "<li class='active'><a class='"+globalOptions.btnClass+"' href='#' targethref='" + globalOptions.baseUrl + "=" + pindex + "'>" + (pindex + 1) + "</a></li>";
                } else {
                    htmlstr += "<li><a class='"+globalOptions.btnClass+"' href='#' targethref='" + globalOptions.baseUrl + "=" + ppindex + "'>" + (pindex + 1) + "</a></li>";
                }
                if (peindx == globalOptions.dataObj.CurrentPageNo) {
                    htmlstr += "<li class='active'><a class='"+globalOptions.btnClass+"' href='#' targethref='" + globalOptions.baseUrl + "=" + peindx + "'>" + (peindx + 1) + "</a></li>";
                } else {
                    htmlstr += "<li><a class='"+globalOptions.btnClass+"' href='#' targethref='" + globalOptions.baseUrl + "=" + peindx + "'>" + (peindx + 1) + "</a></li>";
                }



                var htmltailstring = "<li><a class='"+globalOptions.btnClass+"' href='#' targethref='"
                    + globalOptions.baseUrl + "=" + (globalOptions.dataObj.CurrentPageNo + 1) + "' aria-label='Previous' title='后一页'><span aria-hidden='true'>&gt;</span></a></li>"
                    + "<li><a class='"+globalOptions.btnClass+"' href='#' targethref='" + globalOptions.baseUrl + "=" + (globalOptions.dataObj.TotalPageNum - 1) + "' aria-label='Next' title='尾页,共"
                    + globalOptions.dataObj.TotalPageNum + "页'><span aria-hidden='true'>&raquo;</span></a></li></ul></nav>";


                drawAreaObj.append(htmlheadstring + htmlstr + htmltailstring);
            }


            //
            if (!currentFormObjId || currentFormObjId == "") {
                $("."+globalOptions.btnClass).each(function(){
                    $(this).attr("href",$(this).attr("targethref"));
                });
            }else{
                var formObj = $("#"+currentFormObjId);

                if(formObj&&formObj.length>0){

                    $("."+globalOptions.btnClass).click(function(){
                        //alert("form url="+$(this).attr("targethref"));
                        formObj.attr("action",$(this).attr("targethref"));

                        //alert("form url="+formObj.attr("action"));
                        formObj.submit();
                    });
                }
            }

            return this; //return为了保持jQuery的链式操作
        }
    });
})(jQuery);


/***********************************************************************************************************************/
/*
 *根据Json数据在特定区域中显示翻页按钮区的按钮
 */
(function($) {
    $.fn.extend({
        "VisualPaggingHeadBtnGroup": function(options) {
            options = $.extend({
                dataObj: {},
                baseUrl: "",
                formObjId: "",
                invokeflag:false,
                preinvokefun:function (){},
                nextinvokefun:function (){},
                toinvokefun:function(){},
                btnClass: "pagingbtn-grouparea-a",
                selectBtnClass: "pagingbtn-grouparea-s"
            }, options); //这里用了$.extend方法，扩展一个对象

            //清空区域中的所有按钮
            var drawAreaObj = $(this);
            drawAreaObj.empty();

            var globalOptions = options;

            //按钮组需要提交的form
            var currentFormObjId = drawAreaObj.attr("formId");
            if (!currentFormObjId || currentFormObjId == "") {
                currentFormObjId = globalOptions.formObjId;
            }


            var btnclassstr = "";//"btn-default";

            if(drawAreaObj.attr("btnclass")){
                btnclassstr = drawAreaObj.attr("btnclass");
            }

            if($.trim(btnclassstr)==""){
                btnclassstr = "btn-default";
            }



            if (!globalOptions.dataObj || !globalOptions.dataObj.TotalPageNum || globalOptions.dataObj.TotalPageNum <= 0) {
                var htmlstring = "<button disabled='disabled' type='button' class='btn "+btnclassstr+"'><i class='fa fa-backward'></i></button>" + "<button disabled='disabled' type='button' class='btn btn-default'><i class='fa fa-forward'></i></button>";

                drawAreaObj.append(htmlstring);
            } else {

                var ppindex = globalOptions.dataObj.CurrentPageNo - 1;
                var pindex = globalOptions.dataObj.CurrentPageNo;
                var peindx = globalOptions.dataObj.CurrentPageNo + 1;


                var htmlstr = ""; //


                if (ppindex < 0) {
                    htmlstr += "<a disabled='disabled' type='button' class='btn "+btnclassstr+" " + globalOptions.btnClass+" "+globalOptions.btnClass+"-pre '><i class='fa fa-backward'></i></a>";
                } else {
                    htmlstr += "<a type='button' title='前一页' class='btn "+btnclassstr+" " + globalOptions.btnClass+" "+globalOptions.btnClass+"-pre '  href='#' targethref='" + globalOptions.baseUrl + "=" + ppindex + "'  target='_self'><i class='fa fa-backward'></i></a>";
                }



                if (globalOptions.dataObj.TotalPageNum > 0) {
                    htmlstr += "<select class='btn "+btnclassstr+" " + globalOptions.selectBtnClass + "' currentValue='" + globalOptions.dataObj.CurrentPageNo + "'>";
                    for (vcounter = 0; vcounter < globalOptions.dataObj.TotalPageNum; vcounter++) {
                        htmlstr += "<option value='" + vcounter + "'>" + (vcounter + 1) + "</option>";
                    }
                    htmlstr += "</select>"
                }


                if (peindx >= globalOptions.dataObj.TotalPageNum) {
                    htmlstr += "<a disabled='disabled' type='button' class='btn "+btnclassstr+" " + globalOptions.btnClass+" "+globalOptions.btnClass+"-next '><i class='fa fa-forward'></i></a>";
                } else {
                    htmlstr += "<a type='button' title='后一页' class='btn "+btnclassstr+" " + globalOptions.btnClass+" "+globalOptions.btnClass+"-next ' href='#' targethref='" + globalOptions.baseUrl + "=" + peindx + "' target='_self'><i class='fa fa-forward'></i></a>";
                }

                drawAreaObj.append(htmlstr);
            }

            //初始化下拉框对象的当前值
            $("." + globalOptions.selectBtnClass).SelectCtrlDelayInit();


            if(globalOptions.invokeflag){

                $("." + globalOptions.btnClass+"-pre").click(function(){
                    globalOptions.preinvokefun(this);
                });

                $("." + globalOptions.btnClass+"-next").click(function(){
                    globalOptions.nextinvokefun(this);
                });

                $("." + globalOptions.selectBtnClass).change(function(){
                    globalOptions.toinvokefun(this);
                });

                return this;
            }

            //
            if (!currentFormObjId || currentFormObjId == "") {
                $("." + globalOptions.btnClass).each(function() {
                    $(this).attr("href", $(this).attr("targethref"));
                });

                $("." + globalOptions.selectBtnClass).change(function() {
                    window.open(globalOptions.baseUrl + "=" + $(this).val(), '_self');
                });
            } else {
                var formObj = $("#" + currentFormObjId);

                if (formObj && formObj.length > 0) {
                    //
                    $("." + globalOptions.btnClass).click(function() {
                        formObj.attr("action", $(this).attr("targethref"));
                        formObj.submit();
                    });

                    //
                    $("." + globalOptions.selectBtnClass).change(function() {
                        formObj.attr("action", globalOptions.baseUrl + "=" + $(this).val());
                        formObj.submit();
                    });
                }
            }

            return this; //return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/

/*左侧菜单创建函数*/
/*function createPFLeftMainMenuItem(menuObj) {
    var mstr = "";

    mstr += "<li>";
    var address = menuObj.address;
    var modulelinkstr = "";
    if (!address || address == "") {
        address = "";
    }else{
        modulelinkstr = "modulelink";
    }

    mstr += "<a id='" + address + "' class='"+modulelinkstr+"' href='#' targeturl='" + address + "' target='_self'><i class='" + menuObj.openimg + "'></i>" + menuObj.name;
    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        mstr += "<span class='fa arrow'></span>";
    }
    mstr += "</a>";
    //
    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        for (var sindex = 0; sindex < menuObj.childmenu.length; sindex++) {
            mstr += createPFLeftSecondMenuItem(menuObj.childmenu[sindex]);
        }

    }

    mstr += "</li>";

    return mstr;
}

function createPFLeftSecondMenuItem(menuObj) {
    var mstr = "<ul class='nav nav-second-level'>";
    mstr += "<li>";
    var address = menuObj.address;
    var modulelinkstr = "";
    if (!address || $.trim(address)== "") {
        address = "";
    }else{
        modulelinkstr = "modulelink";
    }


    var childaddress = menuObj.childaddress;
    if (!childaddress || $.trim(childaddress)== "") {
        childaddress = "";
    }

    mstr += "<a id='" + address + "' class='"+modulelinkstr+"' href='#' childaddress='"+childaddress+"' targeturl='" + address + "' target='_self'>" + menuObj.name;

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        mstr += "<span class='fa arrow'></span>";
    }
    mstr += "</a>";

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        for (var tindex = 0; tindex < menuObj.childmenu.length; tindex++) {
            mstr += createPFLeftThirdMenuItem(menuObj.childmenu[tindex]);
        }

    }

    mstr += "</li>";
    mstr += "</ul>";
    return mstr;
}

function createPFLeftThirdMenuItem(menuObj) {
    var mstr = "<ul class='nav nav-third-level'>";
    mstr += "<li>";
    var address = menuObj.address;
    var modulelinkstr = "";
    if (!address || $.trim(address)== "") {
        address = "";
    }else{
        modulelinkstr = "modulelink";
    }

    var childaddress = menuObj.childaddress;
    if (!childaddress || $.trim(childaddress)== "") {
        childaddress = "";
    }

    //modify code by zzm 20150909
    //mstr += "<a class='"+modulelinkstr+"' href='#' targeturl='" + address + "'>" + menuObj.name;
    mstr += "<a id='" + address + "' class='"+modulelinkstr+"' href='#' childaddress='"+childaddress+"' targeturl='" + address + "' target='_self'>" + menuObj.name;

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        mstr += "<span class='fa arrow'></span>";
    }
    mstr += "</a>";


    mstr += "</li>";
    mstr += "</ul>";
    return mstr;
}*/

/***********************************************************************************************************************/

//菜单数据是否合法
function checkPFLeftMainMenuItemRule(menuObj){
    if(menuObj.name&&menuObj.name!==undefined&&menuObj.name!=null){
        return true;
    }
    //alert("菜单数据是否合法:不合法");
    return false;
}

/*左侧菜单创建函数*/
function createPFLeftMainMenuItem(menuObj) {

    if(!checkPFLeftMainMenuItemRule(menuObj)){
        return "";
    }

    var mstr = "";

    mstr += "<li";

    if(menuObj.caption&&$.trim(menuObj.caption)!=''){
        mstr+=" title='"+menuObj.caption+"'";
    }
    mstr+='>';

    var address = menuObj.address;
    var modulelinkstr = "";
    if (!address || address == "") {
        address = "";
    } else {
        modulelinkstr = "modulelink";
    }

    var iconstr = "";
    if(menuObj.openimg&&menuObj.openimg!=null&&$.trim(menuObj.openimg)!=""){
        iconstr = "<i class='" + menuObj.openimg + "'></i>";
    }

    mstr += "<a id='" + address + "' class='" + modulelinkstr + "' href='#' targeturl='" + address + "' target='_self'>" +iconstr+ menuObj.name;
    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        mstr += "<span class='fa arrow'></span>";
    }
    mstr += "</a>";
    //
    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        for (var sindex = 0; sindex < menuObj.childmenu.length; sindex++) {
            mstr += createPFLeftSecondMenuItem(menuObj.childmenu[sindex]);
        }

    }

    mstr += "</li>";

    return mstr;
}

function createPFLeftSecondMenuItem(menuObj) {

    if(!checkPFLeftMainMenuItemRule(menuObj)){
        return "";
    }

    var mstr = "<ul class='nav nav-second-level'>";

    mstr += "<li";

    if(menuObj.caption&&$.trim(menuObj.caption)!=''){
        mstr+=" title='"+menuObj.caption+"'";
    }
    mstr+='>';

    var address = menuObj.address;
    var childaddress = menuObj.childaddress;
    var modulelinkstr = "";
    if (!address || $.trim(address)== "") {
        address = "";
    } else {
        modulelinkstr = "modulelink";
    }

    if (!childaddress || $.trim(childaddress)== "") {
        childaddress = "";
    }

    var iconstr = "";
    if(menuObj.openimg&&menuObj.openimg!=null&&$.trim(menuObj.openimg)!=""){
        iconstr = "<i class='" + menuObj.openimg + "'></i>";
    }

    mstr += "<a id='" + address + "' class='" + modulelinkstr + "' href='#' childaddress='"+childaddress+"' targeturl='" + address + "' target='_self'>" +iconstr+ menuObj.name;

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        mstr += "<span class='fa arrow'></span>";
    }
    mstr += "</a>";

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        for (var tindex = 0; tindex < menuObj.childmenu.length; tindex++) {
            mstr += createPFLeftThirdMenuItem(menuObj.childmenu[tindex]);
        }

    }

    mstr += "</li>";
    mstr += "</ul>";
    return mstr;
}


function createPFLeftThirdMenuItem(menuObj) {

    if(!checkPFLeftMainMenuItemRule(menuObj)){
        return "";
    }

    var mstr = "<ul class='nav nav-third-level'>";

    mstr += "<li";

    if(menuObj.caption&&$.trim(menuObj.caption)!=''){
        mstr+=" title='"+menuObj.caption+"'";
    }
    mstr+='>';

    var address = menuObj.address;
    var childaddress = menuObj.childaddress;
    var modulelinkstr = "";
    if (!address || $.trim(address)== "") {
        address = "";
    } else {
        modulelinkstr = "modulelink";
    }

    if (!childaddress || $.trim(childaddress)== "") {
        childaddress = "";
    }

    var iconstr = "";
    if(menuObj.openimg&&menuObj.openimg!=null&&$.trim(menuObj.openimg)!=""){
        iconstr = "<i class='" + menuObj.openimg + "'></i>";
    }

    mstr += "<a id='" + address + "' class='" + modulelinkstr + "' href='#' childaddress='"+childaddress+"' targeturl='" + address + "' target='_self'>"+iconstr + menuObj.name;

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        mstr += "<span class='fa arrow'></span>";
    }
    mstr += "</a>";

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        for (var tindex = 0; tindex < menuObj.childmenu.length; tindex++) {
            mstr += createPFLeftFourthMenuItem(menuObj.childmenu[tindex]);
        }

    }

    mstr += "</li>";
    mstr += "</ul>";
    return mstr;
}

function createPFLeftFourthMenuItem(menuObj) {

    if(!checkPFLeftMainMenuItemRule(menuObj)){
        return "";
    }

    var mstr = "<ul class='nav nav-fourth-level'>";

    mstr += "<li";

    if(menuObj.caption&&$.trim(menuObj.caption)!=''){
        mstr+=" title='"+menuObj.caption+"'";
    }
    mstr+='>';

    var address = menuObj.address;
    var childaddress = menuObj.childaddress;


    var modulelinkstr = "";
    if (!address || $.trim(address)== "") {
        address = "";
    } else {
        modulelinkstr = "modulelink";
    }

    if (!childaddress || $.trim(childaddress)== "") {
        childaddress = "";
    }

    var iconstr = "";
    if(menuObj.openimg&&menuObj.openimg!=null&&$.trim(menuObj.openimg)!=""){
        iconstr = "<i class='" + menuObj.openimg + "'></i>";
    }

    //modify code by zzm 20150909
    //mstr += "<a class='"+modulelinkstr+"' href='#' targeturl='" + address + "'>" + menuObj.name;
    mstr += "<a id='" + address + "' class='" + modulelinkstr + "' href='#' childaddress='"+childaddress+"'  targeturl='" + address + "' target='_self'>"+iconstr + menuObj.name;

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        mstr += "<span class='fa arrow'></span>";
    }
    mstr += "</a>";

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        for (var tindex = 0; tindex < menuObj.childmenu.length; tindex++) {
            mstr += createPFLeftFivethMenuItem(menuObj.childmenu[tindex]);
        }
    }

    mstr += "</li>";
    mstr += "</ul>";
    return mstr;
}

function createPFLeftFivethMenuItem(menuObj) {

    if(!checkPFLeftMainMenuItemRule(menuObj)){
        return "";
    }

    var mstr = "<ul class='nav nav-fiveth-level'>";

    mstr += "<li";

    if(menuObj.caption&&$.trim(menuObj.caption)!=''){
        mstr+=" title='"+menuObj.caption+"'";
    }
    mstr+='>';

    var address = menuObj.address;
    var childaddress = menuObj.childaddress;


    var modulelinkstr = "";
    if (!address || $.trim(address)== "") {
        address = "";
    } else {
        modulelinkstr = "modulelink";
    }

    if (!childaddress || $.trim(childaddress)== "") {
        childaddress = "";
    }

    var iconstr = "";
    if(menuObj.openimg&&menuObj.openimg!=null&&$.trim(menuObj.openimg)!=""){
        iconstr = "<i class='" + menuObj.openimg + "'></i>";
    }

    //modify code by zzm 20150909
    //mstr += "<a class='"+modulelinkstr+"' href='#' targeturl='" + address + "'>" + menuObj.name;
    mstr += "<a id='" + address + "' class='" + modulelinkstr + "' href='#' childaddress='"+childaddress+"'  targeturl='" + address + "' target='_self'>"+iconstr + menuObj.name;

    if (menuObj.childmenu && menuObj.childmenu.length > 0) {
        mstr += "<span class='fa arrow'></span>";
    }
    mstr += "</a>";

    /*
     if (menuObj.childmenu && menuObj.childmenu.length > 0) {
     for (var tindex = 0; tindex < menuObj.childmenu.length; tindex++) {
     mstr += createPFLeftFivethMenuItem(menuObj.childmenu[tindex]);
     }

     }*/

    mstr += "</li>";
    mstr += "</ul>";
    return mstr;
}

/*将菜单附加到特定的div中*/
function appendPFLeftMenuHtml(menuDataJson) {
    if (!menuDataJson) {
        return "";
    }
    if (menuDataJson.length == 0) {
        return "";
    }

    var appendMenuHtml = "<ul class='nav' id='side-menu'>";


    for (var mindex = 0; mindex < menuDataJson.length; mindex++) {
        appendMenuHtml += createPFLeftMainMenuItem(menuDataJson[mindex]);
    }
    appendMenuHtml += "</ul>";
    return appendMenuHtml;
}

/*
 *根据json数据创建左侧菜单
 */
(function ($) {
    $.fn.extend({
        "PFLeftMenu": function (options){
        	
            options = $.extend({
                menuDataJson: [],
                moduleAccessUrl:"",
                rootContextUrl:"",
                modulelinkClass:"modulelink",
                checkContentIsError:function(addressText){
                	//moidfy code by zzm 20160813
                	return checkContentIsErrorPage(addressText);
                },
                createTargetAddress:function(contextUrl,addressText){
                	//moidfy code by zzm 20160813
                	addressText = $.trim(addressText);

                    //modify code by zzm 20161009
                    if(typeof(customPFLeftMenuCreateTargetAddress)!="undefined"&&customPFLeftMenuCreateTargetAddress){
                        return customPFLeftMenuCreateTargetAddress(contextUrl,addressText);
                    }

                	//alert('addressText='+addressText);
                	if(addressText.toLowerCase().indexOf("http://")==0
                			||addressText.toLowerCase().indexOf("https://")==0){
                		return addressText;
                	}else if(addressText.toLowerCase().indexOf("/http://")==0
                			||addressText.toLowerCase().indexOf("/https://")==0){
                		return addressText.substr(1);
                	}
                	
                	return contextUrl+addressText;//options.rootContextUrl+targetServerAddressTxt;
                },
                buildSwitchTargetUrl:function(moduleAccessUrl,moduleId){

                    //modify code by zzm 20161009
                    if(typeof(customPFLeftMenuBuildSwitchTargetUrl)!="undefined"&&customPFLeftMenuBuildSwitchTargetUrl){
                        return customPFLeftMenuBuildSwitchTargetUrl(moduleAccessUrl,moduleId);
                    }

                    return moduleAccessUrl+"?ModuleId="+moduleId;
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            /*append html*/
            var appendMenuHtml = appendPFLeftMenuHtml(options.menuDataJson);
            $(this).append(appendMenuHtml);

            /*设置菜单点击事件，依赖全局变量,ModuleAccessUrl 模块访问,PageRootContextUrl 根系统路径*/
            if(typeof(options.settingPFLeftMenuLinkClickFun)=="undefined"&&$.trim(options.moduleAccessUrl)!=""){

                //modify code by zzm 20160707 增加页面自定义函数处理
                if(typeof(customPFLeftMenuLinkClickFun)!="undefined"&&customPFLeftMenuLinkClickFun){
                    customPFLeftMenuLinkClickFun(options);
                }else{
                    try{
                        $("."+options.modulelinkClass).click(function(){
                            //var targeturl = options.moduleAccessUrl+"?ModuleId="+$(this).attr("targeturl");

                            //当前页面切换调用函数
                            if(typeof(_custom_currentPageSwitch_checkfun)!="undefined"){
                                if(!_custom_currentPageSwitch_checkfun()){
                                    return;
                                }
                            }

                            //modify code by zzm 20161009
                            var targeturl = options.buildSwitchTargetUrl(options.moduleAccessUrl,$(this).attr("targeturl"));

                            //from server address modify code by zzm 20160813 
                            var htmlobj=$.ajax({url:targeturl,async:false});
                            var targetServerAddressTxt = htmlobj.responseText;
                            //modify code by zzm 20160726
                            try{
                        		if(options.checkContentIsError(targetServerAddressTxt)){
                        			try{
                                        $(document).empty();
                                        document.write(htmlobj.responseText);
                                        return;
                                    }catch(ef){
                                    	alert(ef);
                                    	return;
                                    }
                        		}
                        	}catch(ed){
                        		alert(ed);
                        	}
                        	
                        	//modify code by zzm 20160813
                            var turl = options.createTargetAddress(options.rootContextUrl,targetServerAddressTxt);
                            window.open(turl,'_self');
                        });
                    }catch(e){
                        alert(e.message);
                    }
                }
            }else if(typeof(options.settingPFLeftMenuLinkClickFun)!="undefined"){
                options.settingPFLeftMenuLinkClickFun(options);
            }

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
//排序表头控件
(function ($) {
    $.fn.extend({
        "OrderByTableHead": function (options){
            options = $.extend({
                currentOrderField: {
                    "FieldName":"a.b.c",
                    "OrderType":"asc"},
                opType:"query",//操作类型
                formObjId:"",//form对象
                orderByFieldNameId:"CurrentOrderByFieldName",
                orderByTypeId:"CurrentOrderByFieldType",
                clickFun:function(currentTh,orderOptions){

                    $("#"+orderOptions.orderByFieldNameId).val(currentTh.attr("orderfield"));
                    var typeValue = currentTh.attr("ordertype");
                    if(typeValue=="false"){
                        $("#"+orderOptions.orderByTypeId).val("true");
                    }else if(typeValue=="true"){
                        $("#"+orderOptions.orderByTypeId).val("false");
                    }else {
                        $("#"+orderOptions.orderByTypeId).val("true");
                    }

                    //alert("--------------orderby type:"+$("#"+orderOptions.orderByTypeId).val());
                    //
                    var formObj = null;
                    formObj = $($("#"+orderOptions.formObjId)[0]);
                    //$("#"+formObjId)[0].submit();
                    if(formObj&&formObj!=null){
                        formObj.attr("action",formObj.attr("targeturl")+orderOptions.opType);
                        formObj.submit();
                    }else{
                        alert("未找到form对象");
                    }
                },
                checkFieldSelectFlag:function(currentTh,currentOF){
                    if(currentTh.attr("orderfield")&&currentTh.attr("orderfield")==currentOF.FieldName){
                        return true;
                    }
                    return false;
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            var globalOptions = options;

            //
            //测试点击函数
            var allObjs = this;
            allObjs.each(
                function() {
                    var currentTh =$(this);

                    if(globalOptions.checkFieldSelectFlag(currentTh,globalOptions.currentOrderField)){
                        if(globalOptions.currentOrderField.OrderType=="desc"
                            ||globalOptions.currentOrderField.OrderType=="false"
                            ||globalOptions.currentOrderField.OrderType=="no"
                            ||globalOptions.currentOrderField.OrderType=="否"){
                            currentTh.addClass("sorting_desc");
                            currentTh.attr("ordertype","false");
                        }else{
                            currentTh.addClass("sorting_asc");
                            currentTh.attr("ordertype","true");
                        }
                    }else{
                        currentTh.attr("ordertype","");
                    }

                    currentTh.click(function(){
                        globalOptions.clickFun(
                            currentTh,
                            globalOptions);
                    });
                });

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
/*
 *表格数据集合的点击事件
 */
(function($) {
    $.fn.extend({
        "tableRowSetSelectAndClick": function(options) {
            options = $.extend({
                checkboxSelect:function(){
                    try {
                        $(".detailrecord").SingleCheckBoxTools({
                            IdFieldTag: 'selectedRecordRowId'
                        });
                    } catch (e) {
                        alert(e.message);
                    }
                },
                trClick:function(clickTrObj){
                    clickTrObj.click(function(){
                        $(this).children("td:first").children(".detailrecord").trigger("click");
                    })
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            //
            var globalOptions = options;
            //设置选择对象
            globalOptions.checkboxSelect();

            var allObjs = $(this);
            globalOptions.trClick(allObjs);

            return this; //return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
/*
 1. 'undefined' --- 这个值未定义；
 2. 'boolean'    --- 这个值是布尔值；
 3. 'string'        --- 这个值是字符串；
 4. 'number'     --- 这个值是数值；
 5. 'object'       --- 这个值是对象或null；
 6. 'function'    --- 这个值是函数。
*/
function JsonToForm_SettValue(formObj,keyname,keyvalue,plan) {
    if(typeof(keyvalue)=='string'||typeof(keyvalue)=='number'){
        var elementobj = formObj.find("#"+keyname);//.val(keyvalue);

        if(typeof(keyvalue)=='string'&&keyvalue==""){
            if(elementobj.is("select")){
                return;
            }
        }

        elementobj.val(keyvalue);


    }else if(typeof(keyvalue)=='object'&&!(keyvalue instanceof Array)){
        if(plan){
            return;
        }

        //是对象且不是数组
        for(var x in keyvalue){
            var cv = keyvalue[x];
            JsonToForm_SettValue(formObj,keyname,cv);
        }
    }
}

/*
 *从返回的json中提取数据到form中
 1. 'undefined' --- 这个值未定义；
 2. 'boolean'    --- 这个值是布尔值；
 3. 'string'        --- 这个值是字符串；
 4. 'number'     --- 这个值是数值；
 5. 'object'       --- 这个值是对象或null；
 6. 'function'    --- 这个值是函数。
 */
(function ($) {
    $.fn.extend({
        "JsonToForm": function (options){
            options = $.extend({
                json: null,
                namespace:"",
                plan:true,
                settingInvoke:function(formObj,keyname,keyvalue,options){
                    return false;
                }
            }, options); //这里用了$.extend方法，扩展一个对象
            //var globalOptions = options;
            var globalHtmlObj = $(this);
            var namespacev = "";
            if(options.namespace!=null&&options.namespace!=""){
                namespacev = options.namespace+"\\:";
            }
            //alert("namespacev:"+namespacev);
            if(options.json&&options.json!=null){
                for(var x in options.json){
                    //设置类型数据:
                    var cv = options.json[x];
                   // alert(x+" 是 "+cv+",全局名["+(namespacev+x)+"]");
                    //$("#"+namespacev+x).val(cv);
                    //JsonToForm_SettValue(globalHtmlObj,(namespacev+x),cv,options.plan);
                    if(!options.settingInvoke(globalHtmlObj,(namespacev+x),cv,options)){
                        JsonToForm_SettValue(globalHtmlObj,(namespacev+x),cv,options.plan);
                    }
                }
            }

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
/*
简单赋值函数
 从返回的json中提取数据到form中,版本 2,提供子命名空间的设置,设置方式为 对象名 +'.'
 1. 'undefined' --- 这个值未定义；
 2. 'boolean'    --- 这个值是布尔值；
 3. 'string'        --- 这个值是字符串；
 4. 'number'     --- 这个值是数值；
 5. 'object'       --- 这个值是对象或null；
 6. 'function'    --- 这个值是函数。
 */
function SimpleJsonToForm_SettValueFastJson(formObj,keyvalue,fieldName) {

    if(fieldName&&fieldName!=null){

        if(fieldName=='$ref'||keyvalue=='$'||fieldName==""){
            return;
        }

        if(typeof(keyvalue)=='string'||typeof(keyvalue)=='number'||typeof(keyvalue)=='boolean'){
            var elementobj = formObj.find("#"+fieldName);
            if(elementobj.is("span")){
                elementobj.text(keyvalue);
            }else if(elementobj.is("div")){
                elementobj.text(keyvalue);
            }else{
                if(celement.is("select")){
                    //清空选择
                    elementobj.find("option").prop("selected","");
                    elementobj.find("option[value='"+keyvalue+"']").prop("selected",'selected');
                    elementobj.prop('selectedIndex');
                }else{
                    elementobj.val(keyvalue);
                }
            }
        }else{

            if($.isArray(keyvalue)){

                //遍历
                for (var i = 0; i < keyvalue.length; i++) {
                    var fvobj = keyvalue[i];
                    for(var x in fvobj){
                        var cv = fvobj[x];

                        if(x=='$ref'||cv=='$'){
                            console.log('x is ref');
                            return;
                        }

                        SimpleJsonToForm_SettValueFastJson(formObj,cv,x)
                    }
                }


            }else{
                var fvobj = keyvalue;
                for(var x in fvobj){
                    var cv = fvobj[x];

                    if(x=='$ref'||cv=='$'){
                        console.log('x is ref');
                        return;
                    }

                    SimpleJsonToForm_SettValueFastJson(formObj,cv,x)
                }
            }


        }
    }else{

        if($.isArray(keyvalue)){

            //遍历
            for (var i = 0; i < keyvalue.length; i++) {
                var fvobj = keyvalue[i];
                for(var x in fvobj){
                    var cv = fvobj[x];

                    if(x=='$ref'||cv=='$'){
                        console.log('x is ref');
                        return;
                    }

                    SimpleJsonToForm_SettValueFastJson(formObj,cv,x)
                }
            }


        }else{
            var fvobj = keyvalue;
            for(var x in fvobj){
                var cv = fvobj[x];

                if(x=='$ref'||cv=='$'){
                    console.log('x is ref');
                    return;
                }

                SimpleJsonToForm_SettValueFastJson(formObj,cv,x)
            }
        }
    }
}

/***********************************************************************************************************************/

/*
 从返回的json中提取数据到form中,版本 2,提供子命名空间的设置,设置方式为 对象名 +'.'
 1. 'undefined' --- 这个值未定义；
 2. 'boolean'    --- 这个值是布尔值；
 3. 'string'        --- 这个值是字符串；
 4. 'number'     --- 这个值是数值；
 5. 'object'       --- 这个值是对象或null；
 6. 'function'    --- 这个值是函数。
 */
function JsonToForm_SettValueFastJson(formObj,namesapce,parentName,fieldName,keyvalue,options) {

	
	//modify code by zzm 20160729
    if(fieldName=='$ref'||keyvalue=='$'){
        return;
    }
	/*
	if(fieldName=='$ref'){
		alert(keyvalue);
		var vs = keyvalue.split('.');
		
		if(vs.length>1){
			keyvalue = options.json;
			for(var i=1;i<vs.length;i++){
				keyvalue = keyvalue[vs[i]];
			}
			
			
		}else{
			return;
		}
    }*/
	
    var fieldFullName = namesapce+parentName+fieldName;

    if(typeof(keyvalue)=='string'||typeof(keyvalue)=='number'){

        var elementobj = formObj.find("#"+fieldFullName);

        if(!options.htmlsettingInvoke(formObj,elementobj,namesapce+parentName,fieldName,keyvalue,options)){

            //未找到元素
            if(elementobj.length==0){
                return;
            }

            elementobj.each(function(index,selement){

                var celement = $(selement);

                if(typeof(keyvalue)=='string'&&keyvalue==""){
                    if(celement.is("select")){
                        //celement.find("option").prop("selected","");
                        //alert('选择框的空值数量--'+celement.find("option[value='']").length);
                        if(celement.find("option[value='']").length>0){
                            celement.find("option").prop("selected","");
                            celement.find("option[value='']").prop("selected",'selected');
                            celement.prop('selectedIndex');
                        }
                        return;
                    }
                }

                if(celement.is("span")){
                    celement.text(keyvalue);
                }else if(celement.is("div")){
                    celement.text(keyvalue);
                }else{
                    if(celement.is("select")){
                        //清空选择
                        celement.find("option").prop("selected","");
                        celement.find("option[value='"+keyvalue+"']").prop("selected",'selected');
                        celement.prop('selectedIndex');
                    }else{
                        celement.val(keyvalue);
                    }
                }
            });

            //modify code by zzm 2016
            /*
            if(typeof(keyvalue)=='string'&&keyvalue==""){
                if(elementobj.is("select")){
                    return;
                }
            }

            if(elementobj.is("span")){
                elementobj.text(keyvalue);
            }else if(elementobj.is("div")){
                elementobj.text(keyvalue);
            }else{

                if(elementobj.is("select")){
                    //return;
                    //alert('----select:['+keyvalue+']');
                    //清空选择
                    elementobj.find("option").prop("selected","");
                    elementobj.find("option[value='"+keyvalue+"']").prop("selected",'selected');
                    elementobj.prop('selectedIndex');
                    //alert(elementobj.prop('selectedIndex'));
                }else{
                    elementobj.val(keyvalue);
                }
            }*/
        }

    }else if(typeof(keyvalue)=='object'&&!(keyvalue instanceof Array)){
        //是对象,且不是数组
        if(options.plan){
            return;
        }
        
        //modify code by zzm 20160729
        //字段是引用类型对象
        //需要将字段值转换为指定对象
        if(keyvalue.$ref){
        	//alert(keyvalue.$ref);
    		var vs = keyvalue.$ref.split('.');
    		if(vs.length>1){
    			keyvalue = options.json;
    			for(var i=1;i<vs.length;i++){
    			    if(vs[i]!=null&&$.trim(vs[i])!=""){
                        try{
                            keyvalue = keyvalue[vs[i]];
                        }catch (e){
                            //modify code by zzm 20161128 增加调试信息
                            alert(e+",ref="+keyvalue.$ref+",vs["+i+"]="+vs[i]);
                        }
                    }
    			}
    		}else{
    			return;
    		}
        }

        //是对象且不是数组
        for(var x in keyvalue){
            var cv = keyvalue[x];

            //设置json对象级别调用
            if(options.jsonObjSettingInvoke(formObj,x,cv,options)){
                continue;
            }

            if(x=='$ref'||cv=='$'){
            	alert('x is ref');
                return;
            }
            
            if(!options.settingInvoke(formObj,namesapce,parentName+fieldName+"\\.",x,cv,options)){
                JsonToForm_SettValueFastJson(formObj,namesapce,parentName+fieldName+"\\.",x,cv,options);
            }

        }
    }
}

/*
 *从返回的json中提取数据到form中,版本 2,提供子命名空间的设置,设置方式为 对象名 +'.'

 {
 "address": "",
 "carno": "YA003",
 "detailField1": "",
 "detailField2": "",
 "detailThrees": [],
 "details":{
 "billNo": "Bill001",
 "emptyMainKey": true,
 "mainField1": "",
 "mainField2": "",
 "mainTable": {
 "$ref": "$"
 },
 "materialNo": "WL001"
 }
 }

 如 details.billNo
 全名为 namespace: details.billNo

 1. 'undefined' --- 这个值未定义；
 2. 'boolean'    --- 这个值是布尔值；
 3. 'string'        --- 这个值是字符串；
 4. 'number'     --- 这个值是数值；
 5. 'object'       --- 这个值是对象或null；
 6. 'function'    --- 这个值是函数。
 */
(function ($) {
    $.fn.extend({
        "JsonToFormFastJson": function (options){
            options = $.extend({
                json: null,
                namespace:"",
                plan:false,
                settingInvoke:function(formObj,namesapce,parentName,fieldName,keyvalue,options){
                    //json设值回调
                    return false;
                },
                jsonObjSettingInvoke:function(formObj,key,keyvalue,options){
                    //json对象设值回调,优先调用此函数
                    return false;
                }
                ,htmlsettingInvoke:function(formObj,elementObj,jsonObj,namespace,fieldName,keyvalue,options){
                    //html设值回调
                    return false;
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            var globalHtmlObj = $(this);
            var namespacev = "";
            if(options.namespace!=null&&options.namespace!=""){
                namespacev = options.namespace+"\\:";
            }

            if(options.json&&options.json!=null){
                for(var x in options.json){
                    var cv = options.json[x];
                    //设置json对象级别调用
                    if(options.jsonObjSettingInvoke(globalHtmlObj,x,cv,options)){
                        continue;
                    }
                    if(!options.settingInvoke(globalHtmlObj,namespacev,'',x,cv,options)){
                        JsonToForm_SettValueFastJson(globalHtmlObj,namespacev,'',x,cv,options);
                    }

                }
            }

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);


////////////////////////////////////////////////////////////////////////////////////////////////
$.fn.cusClearForm = function() {
    return this.each(function() {
        var type = this.type, tag = this.tagName.toLowerCase();
        if (tag == 'form') {
            return $(':input', this).cusClearForm();
        }
        //alert("id="+this.id);
        if (type == 'text' || type == 'password'||type=='hidden'|| tag == 'textarea'){
            //this.value = '';
            $(this).val('');
        }else if (type == 'checkbox' || type == 'radio'){
            //this.checked = false;
        }else if (tag == 'select'){
            //this.selectedIndex = -1;
        }else if (type == 'file'){
            $(this).val('');
        }/*else if(type=='hidden'){
            this.value = '';
            alert("test--set hidden value");
        }*/
    });
};

/***********************************************************************************************************************/

/**form 对象遍历,支持 input,select,textarea*/
(function ($) {
    $.fn.extend({
        "FormInputEach": function (options){
            options = $.extend({
                formToform:function(inputobj,keyname){
                    return true;
                },
                linkName:"id",
                keyFormat:function(keyname){
                    if(keyname){
                        return keyname.replace(/:/g,"\\:");
                    }
                    return "";
                },tagNames:["select","input","textarea"]
            }, options); //这里用了$.extend方法，扩展一个对象

            var srcForm = $(this);
            
            $.each(options.tagNames,function (i,tagNameValue) {
                srcForm.find(tagNameValue).each(function () {
                    return options.formToform($(this),options.keyFormat(($(this).attr(options.linkName))));
                });
            });

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
/**
 * form处理操作,综合的form操作
 * */
(function ($) {
    $.fn.extend({
        "NsneoFormHandler": function (options){
            var globalOptions = $.extend({
                clearForm:function (formObj,options) {
                    //清空form数据,传入原始的form对象,未经jquery包装
                    $(formObj).cusClearForm();
                },
                settingValue:function (jsonData,formObj,options) {
                    //将json数据设置到form对象中
                    var globalHtmlObj = $(formObj);
                    var namespacev = "";
                    //设置可选参数
                    var goptions = $.extend({
                        json:jsonData,
                        settingInvoke:function(formObj,namesapce,parentName,fieldName,keyvalue,options){
                            //json设值回调
                            return false;
                        },
                        jsonObjSettingInvoke:function(formObj,key,keyvalue,options){
                            //json对象设值回调,优先调用此函数
                            return false;
                        }
                        ,htmlsettingInvoke:function(formObj,elementObj,jsonObj,namespace,fieldName,keyvalue,options){
                            //html设值回调
                            return false;
                        },
                        namespace:"",//命名空间
                        plan:false//平坦数据对象
                    }, options)

                    if(goptions.namespace!=null&&goptions.namespace!=""){
                        namespacev = goptions.namespace+"\\:";
                    }
                    //
                    if(goptions.json&&goptions.json!=null){
                        for(var x in goptions.json){
                            var cv = goptions.json[x];
                            //设置json对象级别调用
                            if(goptions.jsonObjSettingInvoke(globalHtmlObj,x,cv,goptions)){
                                continue;
                            }
                            if(!goptions.settingInvoke(globalHtmlObj,namespacev,'',x,cv,goptions)){
                                JsonToForm_SettValueFastJson(globalHtmlObj,namespacev,'',x,cv,goptions);
                            }

                        }
                    }
                },
                eachFormInput:function (formObj,tags,options) {
                    //查找form中的每个输入框
                    var ttags = null;
                    if(tags&&tags!=null){
                        ttags = tags;
                    }
                    if(ttags==null){
                        ttags = ["select","input","textarea"];
                    }
                    var goptions = $.extend({
                        inputInForm:function(inputobj,keyname){
                            return true;
                        },
                        linkName:"id",
                        keyFormat:function(keyname){
                            if(keyname){
                                return keyname.replace(/:/g,"\\:");
                            }
                            return "";
                        },tagNames:ttags
                    }, options); //这里用了$.extend方法，扩展一个对象

                    var srcForm = $(formObj);

                    $.each(goptions.tagNames,function (i,tagNameValue) {
                        srcForm.find(tagNameValue).each(function () {
                            return goptions.inputInForm($(this),goptions.keyFormat(($(this).attr(goptions.linkName))));
                        });
                    });
                },
                formEnterInvoke:function (formObj,keyValue,options) {
                    //调用回车下一个
                    var ttags = null;
                    if(keyValue&&keyValue!=null){
                        ttags = keyValue;
                    }
                    if(ttags==null){
                        ttags = 13
                    }
                    var goptions = $.extend({
                        keyValue:ttags
                    }, options);

                    $(formObj).FormEnterInvoke(goptions);
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            var that = $(this);

            //清空form数据,如果传入的clearfun 为空则采用默认的清空函数进行操作
            that.clearForm=function (clearfun) {
                var cfun = null;
                if(clearfun&&clearfun!=null){
                    cfun = clearfun;
                }
                if(cfun==null){
                    cfun = globalOptions.clearForm;
                }
                that.each(function (index,formel) {
                    cfun(formel,globalOptions);
                });
                return that;
            }

            //设置函数值
            that.settingValue=function (jsonData,settingValueFun) {
                var sfun = null;
                if(settingValueFun&&settingValueFun!=null){
                    sfun = settingValueFun;
                }
                if(sfun==null){
                    sfun = globalOptions.settingValue;
                }
                that.each(function (index,formel) {
                    sfun(jsonData,formel,globalOptions);
                });
                return that;
            };

            //循环指定form中的input数据
            that.eachFormInput = function (tags,eachFun) {
                var efun = null;
                if(eachFun&&eachFun!=null){
                    efun = eachFun;
                }
                if(efun==null){
                    efun = globalOptions.eachFormInput;
                }
                that.each(function (index,formel) {
                    efun(formel,tags,globalOptions);
                });
                return that;
            }

            that.formEnterInvoke=function (keyValue,eInvokeFun) {
                var efun = null;
                if(eInvokeFun&&eInvokeFun!=null){
                    efun = eInvokeFun;
                }
                if(efun==null){
                    efun = globalOptions.formEnterInvoke;
                }
                that.each(function (index,formel) {
                    efun(formel,keyValue,globalOptions);
                });
                return that;
            }



            return that;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
/*
 *Form 回车插件调用
 */
(function($) {
    $.fn.extend({
        "FormEnterInvoke": function(options) {
            options = $.extend({
                invokefun: null,
                directinvokefun:null,
                submitbtnid:"",
                keyValue:13
            }, options); //这里用了$.extend方法，扩展一个对象

            var globalOptions = options;

            var that = $(this);

            that.each(function(){

                var globalForm = $(this);


                var inputObjSet =globalForm.find("input:text ,input:password,input[type='number'],select").not(":disabled").not('[readonly="readonly"]').not('[type="hidden"]');
                //alert("inputobj length="+inputObjSet.length);
                var submitButn = null;
                var btnObjSet = null;;
                if(globalOptions.submitbtnid&&$.trim(globalOptions.submitbtnid)!=""){
                    btnObjSet = $("#"+globalOptions.submitbtnid);
                }else{
                    btnObjSet = globalForm.find(".btn");
                }
                if(btnObjSet.length>0){
                    submitButn = $(btnObjSet[0]);
                }


                inputObjSet.keypress(function(event){
                    //alert("key press="+event.keyCode);
                    if(event.keyCode == options.keyValue){


                        if(globalOptions.directinvokefun!=null){
                            var obj = globalOptions.directinvokefun(globalForm);
                            if(obj&&obj==1){
                                return;
                            }else{
                                event.preventDefault();
                                return false;
                            }
                        }

                        try{
                            var currentObj = this;
                            var checkFlag = false;
                            var nextInput = null;
                            inputObjSet.each(function(){
                                if(this==currentObj){
                                    checkFlag = true;
                                    return;
                                }
                                if(checkFlag){
                                    nextInput = this;
                                    return false;
                                }
                            });
                            //将焦点转为下一个空间
                            if(nextInput!=null){
                                //alert("nextInput is not null,and checkFlag is true");
                                try{
                                    $(nextInput).focus();
                                }catch(e){
                                    alert(e.message);
                                }
                            }else if(checkFlag){
                                //alert("nextInput is null,and checkFlag is true");
                                if(globalOptions.invokefun&&globalOptions.invokefun!=null){
                                    globalOptions.invokefun(globalForm);
                                }else{
                                    /*btnObjSet.each(function(){
                                     $(this).focus();
                                     });*/
                                    if(submitButn!=null){
                                        submitButn.focus();
                                    }

                                }
                            }

                        }catch(e){
                            alert(e.message);
                        }

                        event.preventDefault();
                        return false;
                    }
                });
            });

            return this; //return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/

/*某个区域中的类型垂直布局*/
function verticalLoyout(rowObjSet,areaHeight,autoHeightArea){
    if(!autoHeightArea||autoHeightArea==null){
        autoHeightArea = function(){}
    }

    var currentTotalHeight = 0;
    rowObjSet.each(
        function(){
            currentTotalHeight += $(this).height();
        }
    );

    //alert("currentTotalHeight="+currentTotalHeight+",areaHeight="+areaHeight);
    autoHeightArea(areaHeight,currentTotalHeight);
}

/***********************************************************************************************************************/

/**
 * 针对某个区域中的内容进行垂直布局
 * */
(function($) {
    $.fn.extend({
        "PFVerticalLoyout": function(options) {
            options = $.extend({
                areaHeight: 400,
                pageMinHeight:-1,
                offsetHeight:0,
                autoHeightAreaId: "",
                settingfun:function(currentTotalHeight,optionparam,allAreaObj){

                    var targetObjId = "";
                    if(!optionparam.autoHeightAreaId||$.trim(optionparam.autoHeightAreaId)==""){
                        if(allAreaObj.length>0){
                            targetObjId = "#"+$(allAreaObj[allAreaObj.length-1]).attr("id");
                        }
                    }else{
                        targetObjId = optionparam.autoHeightAreaId;
                    }

                    var targetObj = $(targetObjId);

                    //alert("optionparam.autoHeightAreaId="+optionparam.autoHeightAreaId)

                    if(optionparam.areaHeight<=0){
                        optionparam.areaHeight = 400;
                    }

                    if(optionparam.pageMinHeight<=0){
                        optionparam.pageMinHeight = optionparam.areaHeight;
                    }

                    var targettotalheight = currentTotalHeight-optionparam.offsetHeight;

                    //alert("targettotalheight="+targettotalheight+",optionparam.pageMinHeight="+optionparam.pageMinHeight+",--------------1");
                    //判断当前页面控件的总高度是否小于参数高度:
                    if(targettotalheight>=optionparam.pageMinHeight){
                        //当前页面控件的高度小于最小高度则,不进行定制高度操作
                        return;
                    }
                    //alert("targettotalheight="+targettotalheight+",optionparam.areaHeight="+optionparam.areaHeight+",--------------2");
                    //判断页面控件的高度超出页面总高度则不进行调整
                    //if(targettotalheight>=optionparam.areaHeight){
                    //	return;
                    //}
                    //alert("targettotalheight="+targettotalheight+",--------------3");
                    //设置页面高度
                    var theight = optionparam.areaHeight;
                    if(theight<optionparam.pageMinHeight){
                        theight = optionparam.pageMinHeight;
                    }
                    //alert("theight="+theight+",--------------4");

                    //判断页面控件总高度小于页面高度则自动调整指定控件高度
                    optionparam.cusheightfun(currentTotalHeight,optionparam,allAreaObj,targetObj);
                },
                cusheightfun:function(currentTotalHeight,optionparam,allAreaObj,targetObj){
                    //var targetObj = $("#"+optionparam.autoHeightAreaId);
                    if(targetObj&&targetObj!=null){
                        targetObj.height(targetObj.height()+(optionparam.areaHeight-currentTotalHeight)+optionparam.offsetHeight);
                    }

                    //调用设置后的函数
                    if(targetObj&&targetObj!=null)
                    {
                        optionparam.aftersettingfun(optionparam,targetObj.height());
                    }else{
                        optionparam.aftersettingfun(optionparam,-1);
                    }
                },aftersettingfun:function(optionparam,targetObjHeight){

                }
            }, options); //这里用了$.extend方法，扩展一个对象


            var globalOptions = options;
            var allAreaObj = $(this);

            verticalLoyout(allAreaObj,globalOptions.areaHeight,function(areaHeight,currentTotalHeight){
                globalOptions.settingfun(currentTotalHeight,globalOptions,allAreaObj);
            });

            return this; //return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
/**
 * 针对某个区域中的内容进行垂直布局
 * 选取其中一个作为 自动高度对象,默认采用最后一个区域作为自动高度对象
 *
 * */
(function($) {
    $.fn.extend({
        "PFVerticalLoyoutEx": function(options) {
            options = $.extend({
                areaHeight: 400,//区域目标高度对象
                offsetHeight:0,
                autoHeightAreaId: "",
                autoHeightAreaMinHeight:100,//自动高度最小高度
                overminheightfun:function(targettotalheight,globalOptions,allAreaObj,targetObj){

                },
                cusheightfun:function(rowsTotalHeight,globalOptions,allAreaObj,targetObj){
                    var th = globalOptions.areaHeight-(rowsTotalHeight-globalOptions.autoHeightAreaMinHeight);

                    //alert("th="+th);
                    globalOptions.aftersettingfun(globalOptions,th);
                },aftersettingfun:function(globalOptions,targetObjHeight){

                }
            }, options); //这里用了$.extend方法，扩展一个对象


            var globalOptions = options;
            var allAreaObj = $(this);

            //获得自动高度的区域对象
            var targetObjId = "";
            if(!globalOptions.autoHeightAreaId||$.trim(globalOptions.autoHeightAreaId)==""){
                if(allAreaObj.length>0){
                    targetObjId = $(allAreaObj[allAreaObj.length-1]).attr("id");
                }
            }else{
                targetObjId = globalOptions.autoHeightAreaId;
            }
            var targetAreaObj = $("#"+targetObjId);

            //当前区域总高度,自动扩展区域采用最小高度
            var rowsTotalHeight = 0;
            allAreaObj.each(
                function(){
                    var temprow = $(this);
                    var temprowid = temprow.attr("id");
                    if(temprowid&&temprowid==targetObjId){
                        rowsTotalHeight += globalOptions.autoHeightAreaMinHeight;//自动扩展区域采用最小高度
                    }else{
                        rowsTotalHeight += $(this).height();
                    }
                }
            );


            //排除偏移值后的区域总高度
            var targettotalheight = rowsTotalHeight-globalOptions.offsetHeight;

            //alert("rowsTotalHeight="+rowsTotalHeight+",targettotalheight="+targettotalheight+",globalOptions.areaHeight="+globalOptions.areaHeight);

            //判断当前页面控件的总高度是否小于参数高度:如果总高度大于上级区域高度,则返回
            if(targettotalheight>=globalOptions.areaHeight){
                //当前页面控件的高度小于最小高度则,不进行定制高度操作
                globalOptions.overminheightfun(targettotalheight,globalOptions,allAreaObj,targetAreaObj);
                return;
            }

            //判断页面控件总高度小于页面高度则自动调整指定控件高度
            globalOptions.cusheightfun(rowsTotalHeight,globalOptions,allAreaObj,targetAreaObj);

            return this; //return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/
/**正则表达式值匹配模式,值为单个值,pattern为数组,只要匹配一个值则返回为true,所有值不匹配则返回为false*/
function regexp_vp_m(value,pattern,paramstr){
    if(!paramstr||$.trim(paramstr)==""){
        paramstr= "gi";
    }

    var i=0;
    for(;i<pattern.length;i++){
        var reg=new RegExp(pattern[i],paramstr);
        if(reg.test(value)){
            return true;
        }
    }

    return false;
}
/**正则表达式值匹配模式,值为单个值,pattern为数组,只要一个值不匹配则返回为false,所有值不匹配则返回为false*/
function regexp_vp_p(value,pattern,paramstr){
    if(!paramstr||$.trim(paramstr)==""){
        paramstr= "gi";
    }
    var i=0;
    for(;i<pattern.length;i++){
        var reg=new RegExp(pattern[i],paramstr);
        if(!reg.test(value)){
            return false;
        }
    }

    return true;
}
/**正则表达式值匹配模式,值为多个值,pattern为数组,只要匹配一个值则返回为true,所有值不匹配则返回为false*/
function regexp_vsp_m(value,pattern,paramstr){
    var i=0;
    for(;i<value.length;i++){
        if(regexp_vp_m(value[i],pattern,paramstr)){
            return true;
        }
    }

    return false;
}
/**正则表达式值匹配模式,值为单个值,pattern为数组,只要一个值不匹配则返回为false,所有值不匹配则返回为false*/
function regexp_vsp_p(value,pattern,paramstr){
    var i=0;
    for(;i<value.length;i++){
        if(!regexp_vp_p(value[i],pattern,paramstr)){
            return false;
        }
    }
    return true;
}

/***********************************************************************************************************************/

/**
 * 转换大小写
 * */
function _ChangeValueUpperOrLower(obj,lower){
	if(obj&&obj.value){
		if(lower){
			obj.value = obj.value.toLowerCase();
		}else{
			obj.value = obj.value.toUpperCase();
		}
	}
}

/*
 *转换大小写
 */
(function ($) {
    $.fn.extend({
        "ChangeValueUpperOrLower": function (options){
            options = $.extend({
                upper:true
            }, options); //这里用了$.extend方法，扩展一个对象

            var globalOptions = options;
            
            $(this).blur(function() {
            	if(globalOptions.upper){
        			$(this).val($(this).val().toUpperCase());
        		}else{
        			$(this).val($(this).val().toLowerCase());
        		}
            });
            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);


/***********************************************************************************************************************/
/**
 *将Table中的数值转换为JSON数据
 * columns 格式为:
 * {index:0,valueName:"",inputClass:""}
 * 调用方法：
 * $("#SecondBtn").click(function(){
 *	alert(sampleHtmlTableToJsonString({tableRowSetId:"SecondBtn-tablerowset",columns:[
 *		{index:-1,valueName:"id"},{index:1,valueName:"fname"},{index:2,valueName:"lname"}
 *	]}));
 * });
 */
function sampleHtmlTableToJsonString(options){
    var globalOptions = $.extend({
        tableRowSetId:"",
        columns:[],
        beginRowIndex:0
    }, options); //这里用了$.extend方法，扩展一个对象

    var trColumns = new Array();
    var tdColumns = new Array();

    $.each(globalOptions.columns, function(i, item){
        if(item.index<0){
            trColumns[trColumns.length] = item;
        }else{
            tdColumns[tdColumns.length] = item;
        }
    });

    var jsonstr = "[";
    var trset = $("#"+globalOptions.tableRowSetId).children("tr")
    trset.each(
        function(index,element){
            jsonstr+="{";
            if($(element).attr("id")){
                jsonstr+="\"rowid\":\""+$(element).attr("id")+"\"";
                if(tdColumns.length>0){
                    jsonstr+=",";
                }
            }else{
                if(trColumns.length>0){
                    for(var i=0;i<trColumns.length;i++){
                        jsonstr+="\""+trColumns[i].valueName+"\":\""+$(element).data(trColumns[i].valueName)+"\"";
                        if(i<trColumns.length-1){
                            jsonstr+=",";
                        }
                    }
                    if(tdColumns.length>0){
                        jsonstr+=",";
                    }
                }
            }
            var tdset = $(element).children("td");
            for(var i=0;i<tdColumns.length;i++){

                var currentTd = $(tdset.get(tdColumns[i].index));

                if(currentTd.data(tdColumns[i].valueName)){
                    jsonstr+="\""+tdColumns[i].valueName+"\":\""+currentTd.data(tdColumns[i].valueName)+"\"";
                }else{
                    //测试内部是否是input
                    if(tdColumns[i].inputClass&&$.trim(tdColumns[i].inputClass)!=""){
                        jsonstr+="\""+tdColumns[i].valueName+"\":\""+currentTd.find("."+tdColumns[i].inputClass).val()+"\"";
                    }else{
                        jsonstr+="\""+tdColumns[i].valueName+"\":\""+currentTd.text()+"\"";
                    }

                }

                if(i<tdColumns.length-1){
                    jsonstr+=",";
                }
            }
            jsonstr+="}";
            if(index<trset.size()-1){
                jsonstr+=",";
            }
        }
    );
    jsonstr+="]";
    return jsonstr;
}

/**************************************************************************************************************************/
//监控页面数据是否改变的控件
;(function($) {
    var pageDataChange = false //默认标识页面数据未发生改变
    //监控页面数据是否发生变化
    $.fn.monitorDataChange = function(options) {
        var tagName = new Array('Input', 'Select', 'Textarea');
        var ctrlIds = [];

        var deafult = {
            arrTags: tagName, //需监控控件的tagName属性数组
            arrCtrls: ctrlIds //不监控的控件ID
        };
        var ops = $.extend(deafult, options);

        for(var i = 0; i < ops.arrTags.length; i++) {
            $(ops.arrTags[i]).each(function() {
                if(ops.arrCtrls.length == 0) {
                    $(this).bind('change', function() {
                        pageDataChange = true;
                    });
                } else {
                    var flag = false;
                    for(var j = 0; j < ops.arrCtrls.length; j++) {
                        if($(this).attr('id') == ops.arrCtrls[j]) {
                            flag = true;
                            break;
                        }
                    }
                    if(!flag) {
                        $(this).bind('change', function() {
                            pageDataChange = true;
                        });
                    }
                }
            });
        }
        return this;
    };
    //返回页面数据是否发生变化
    $.fn.isChange = function() {
        return pageDataChange;
    };

    //重新设置初始化
    $.fn.resetChange = function() {
        pageDataChange = false;
    };
})(jQuery);

/*
 调用示例
 var is_change = false;
 $(document).ready(function() {
 $("form").MonitorDataChange();
 });

 function alertMsg() {
 is_change = $.fn.isChange();
 if(is_change) {
 alert('数据发生改变！');
 }
 }*/
/*
;(function($) {
    //监控页面数据是否发生变化
    var pageDataChange = false;
    var tagName = "Input, Select, Textarea";
    var ctrlIds = [];
    $.fn.monitorDataChange = function(options) {
        var deafult = {
            arrTags: tagName, //需监控控件的tagName属性
            arrCtrls: ctrlIds //不监控的控件ID
        };
        var ops = $.extend(deafult, options);
        tagName = ops.arrTags;
        ctrlIds = ops.arrCtrls;
        //元素第一次获取焦点时缓存该元素数据
        $(ops.arrTags).one("focus", function() {
            if($.inArray($(this).attr("id"), ops.arrCtrls) != -1) {
                return;
            }
            $(this).data('initData', $(this).val());
        });
    };
    //获取页面数据是否已经改变
    $.fn.isChange = function() {
        $(tagName).each(function() {
            if($.inArray($(this).attr("id"), ctrlIds) != -1) {
                return;
            }
            //如果该元素的initData缓存数据已定义并且不等于他的value值，标识该页面中数据发生变化
            if(typeof($(this).data('initData')) != 'undefined') {
                if($(this).data('initData') != $(this).val()) {
                    pageDataChange = true;
                }
            }
        });
        return pageDataChange;
    };

    //重新设置初始化
    $.fn.resetChange = function() {
        pageDataChange = false;
    };
})(jQuery);*/

/*
$(function(){
    setInterval("CheckDirty()",10000);
    $(':input').each(function() {
        $(this).data('formValues', $(this).val());
    });
});

function CheckDirty()
{
    var isDirty = false;

    $(':input').each(function () {
        if($(this).data('formValues') != $(this).val()) {
            isDirty = true;
        }
    });

    if(isDirty == true){
        alert("isDirty=" + isDirty);
    }
}
$(function(){
    setInterval(function() {
        $("#myForm").checkDirty();
    },10000);
    $("#myForm :input").each(function() {
        $(this).data('formValues', $(this).val());
    });

    $.fn.checkDirty = function() {
        var isDirty = false;

        $(this).find(':input').each(function () {
            if($(this).data('formValues') != $(this).val()) {
                isDirty = true;
            }
        });

        if(isDirty == true){
            alert("isDirty=" + isDirty);
        }
    };
});
*/


/**************************************************************************************************************************/
/*
 js 模板调用
 模板文件格式
 {} 中是json对象的属性字段

 var htmlstr = "<tr data-id='{id}'>"
 + "<td style='text-align: center;vertical-align: middle'></td>"
 +"<td style='vertical-align: middle'>{name}</td><td style='vertical-align: middle'>{outdate}</td>"
 + "<td nowrap='nowrap'>"
 + "<button type='button' class='button btn btn-danger btn-sm delDisnessHistory'><i class='fa fa-minus'></i>"
 + "</button></td></tr>";
 */
/**
function nano(template, data,vundefineEmptye) {


    if($.isArray(data)){
        //modify code by zzm 20180515,判断是否是数组

        var buffer = new StringBuffer();
        $.each(data, function (index, obj) {
            buffer.append(nano(template,obj));
        });

        return buffer.toString();
    }else{
        //modify code by zzm 20180424,空值是否会被空串填充,默认会被空串填充
        if(typeof vundefineEmptye !== "undefined" && vundefineEmptye !== null){
        }else {
            vundefineEmptye = true;
        }

        return template.replace(/\{([\w\.]*)\}/g, function(str, key) {

            var keys = key.split("."), v = data[keys.shift()];

            //console.log('nano-'+key+",str="+str+",keys.shift()="+keys);

            for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];

            if($.isFunction(v)){
                //modify code by zzm 20180515,判断是否是函数
                //console.log("v is function---1");
                var sv = v();
                if(vundefineEmptye){
                    return (typeof sv !== "undefined" && sv !== null) ? sv : "";
                }else{
                    //return "{"+key+"}";
                    return (typeof sv !== "undefined" && sv !== null) ? sv : "{"+key+"}";
                }
            }else{
                //console.log("v is function---2");
                if(vundefineEmptye){
                    return (typeof v !== "undefined" && v !== null) ? v : "";
                }else{
                    //return "{"+key+"}";
                    return (typeof v !== "undefined" && v !== null) ? v : "{"+key+"}";
                }
            }
        });
    }
}
***/
function nano(template, data,vundefineEmptye) {


    if($.isArray(data)){
        //modify code by zzm 20180515,判断是否是数组

        var buffer = new StringBuffer();
        $.each(data, function (index, obj) {
            buffer.append(nano(template,obj));
        });

        return buffer.toString();
    }else{
        //modify code by zzm 20180424,空值是否会被空串填充,默认会被空串填充
        if(typeof vundefineEmptye !== "undefined" && vundefineEmptye !== null){
        }else {
            vundefineEmptye = true;
        }

        return template.replace(/\{([\w\.]*)\}/g, function(str, key) {

            var keys = key.split("."), v = data[keys.shift()];

            //console.log('nano-'+key+",str="+str+",keys.shift()="+keys);

            for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];

            if($.isFunction(v)){
                //modify code by zzm 20180515,判断是否是函数
                //console.log("v is function---1");
                var sv = v(data);
                if(vundefineEmptye){
                    return (typeof sv !== "undefined" && sv !== null) ? sv : "";
                }else{
                    //return "{"+key+"}";
                    return (typeof sv !== "undefined" && sv !== null) ? sv : "{"+key+"}";
                }
            }else{
                //console.log("v is function---2");
                if(vundefineEmptye){
                    return (typeof v !== "undefined" && v !== null) ? v : "";
                }else{
                    //return "{"+key+"}";
                    return (typeof v !== "undefined" && v !== null) ? v : "{"+key+"}";
                }
            }
        });
    }
}

/**
 基于nano 的模板 解析函数
 * */
function nanotmplfun(template, data)  {
    var htmlstr = '';

    if(data){
        if($.isArray(data)){
            $.each(data,function(n,value){
                htmlstr += nano(template,value);
            });
        }else{
            htmlstr += nano(template,data);
        }
    }

    return htmlstr;
}

/**
 *调用模板插入数据
 调用示例：
 var data = {id:01,name:'测试',outdate:'日期'}
 var htmlstr = "<tr data-id='{id}'>"
 + "<td style='text-align: center;vertical-align: middle'></td>"
 +"<td style='vertical-align: middle'>{name}</td><td style='vertical-align: middle'>{outdate}</td>"
 + "<td nowrap='nowrap'>"
 + "<button type='button' class='button btn btn-danger btn-sm delDisnessHistory'><i class='fa fa-minus'></i>"
 + "</button></td></tr>";

 $("#dinesshistoryset").nanotmpl({tmpl:htmlstr,data:data});
 **/
;(function ($) {
    $.fn.extend({
        "nanotmpl": function (options){
            var globalOptions = $.extend({
                tmpl: "",
                data:{},
                writertype:"append",
                writerfun:function(pelm,options){
                    if(options.writertype.toLowerCase()=="append"){
                        pelm.append(nanotmplfun(options.tmpl,options.data));
                    }else if(options.writertype.toLowerCase()=="replace"){
                        pelm.empty();
                        pelm.append(nanotmplfun(options.tmpl,options.data));
                    }else if(options.writertype.toLowerCase()=="prepend"){
                        pelm.prepend(nanotmplfun(options.tmpl,options.data));
                    }else if(options.writertype.toLowerCase()=="after"){
                        pelm.after(nanotmplfun(options.tmpl,options.data));
                    }else if(options.writertype.toLowerCase()=="before"){
                        pelm.before(nanotmplfun(options.tmpl,options.data));
                    }
                },
                writerafter:function(pelm,options){
                    //调用后处理
                }
            }, options); //这里用了$.extend方法，扩展一个对象


            var htmlTagObj = $(this);

            //写入到元素中
            globalOptions.writerfun(htmlTagObj,globalOptions);

            //调用后处理
            globalOptions.writerafter(htmlTagObj,globalOptions);

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

//模板函数
function jstmplfun(html, data) {
    //var html = document.getElementById(id).innerHTML;
    var result = "var p=[];with(obj){p.push('" +
        html.replace(/[\r\n\t]/g, " ")
            .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
            .replace(/<%/g, "');")
            .replace(/%>/g, "p.push('") +
        "');}return p.join('');";
    var fn = new Function("obj", result);
    return fn(data);
}

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
;(function() {
    var cache = {};

    this.sampleTmpl = function sampleTmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                sampleTmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                // Convert the template into pure JavaScript
                str.replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'") +
                "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();

/**************************************************************************************************************************/
////////////////////////////////////////////////////////////////////////////////////////////////

/*
 单选多选复选框
 <!-- 下拉菜单式Combox-->
 <div class="col-sm-6">
    <label class="" for="">下拉框</label>
    <div class="input-group nsneocbbox" id="nsneocbbox" data-valueinput='nsneocbboxvalue' data-textinput='nsneocbboxtext'>
        <input type="hidden" id='nsneocbboxvalue' value="001" />
        <input type="text" readonly="readonly" id="nsneocbboxtext" class="form-control dropdown-toggle" data-toggle="dropdown" value="">
        <span class="input-group-addon dropdown-toggle" data-toggle="dropdown">
            <i class="fa fa-angle-down "></i>
        </span>
        <ul class="dropdown-menu" role="menu">
        </ul>
    </div>
 </div>

 $("#nsneocbbox").nsneocbbox({
    data:[{id:"001",name:"测试1"},{id:"002",name:"测试2"}],singleSelect:true,hasOther:true
 });
 * */

(function($) {
    $.fn.extend({
        "nsneocbbox": function(options) {
            options = $.extend({
                data: [],
                singleSelect: false,
                inputName: 'undifineNsneocbbox',
                inputClass: 'nsneocbboxinput',
                otherInputClass: 'nsneocbboxothterinput',
                otherBsInputClass: 'form-control',
                hasOther: false,
                mulitSelectSplit: ';',
                buildHtml: function(htmlelemnt, options) {
                    var htmlstr = "";
                    $.each(options.data, function(index, element) {

                        if(options.singleSelect) {
                            htmlstr += "<li><input class='" + options.inputClass + "' type='radio' name='" + options.inputName + "' data-textvalue='" + element.name + "' value='" + element.id + "'>" + element.name + "</li>";
                        } else {
                            htmlstr += "<li><input class='" + options.inputClass + "' type='checkbox' name='" + options.inputName + "' data-textvalue='" + element.name + "' value='" + element.id + "'>" + element.name + "</li>";
                        }
                    });

                    if(options.hasOther) {
                        htmlstr += "<li class='divider'></li>";
                        htmlstr += "<li><input type='text' class='"+options.otherBsInputClass+" " + options.otherInputClass + "' value='' /></li>";
                    }

                    htmlelemnt.find(".dropdown-menu").append(htmlstr);
                },
                bindClick: function(element, options) {
                    element.find("." + options.inputClass).click(function() {
                        if(options.singleSelect) {
                            if(options.hasOther) {
                                element.find("." + options.otherInputClass ).val("");
                            }
                        }
                        options.writeData(element, options);
                        //element.dropdown('toggle');

                        $(element.find(".dropdown-toggle")[0]).dropdown('toggle');
                    });

                    if(options.hasOther) {
                        element.find("." + options.otherInputClass ).blur(function() {
                            if($.trim($(this).val()) == '') {
                                //
                            } else {
                                if(options.singleSelect) {
                                    $("." + options.inputClass).prop('checked', false);
                                }
                            }
                            options.writeData(element, options);
                            //element.dropdown('toggle');

                            $(element.find(".dropdown-toggle")[0]).dropdown('toggle');
                        });
                    }

                },
                writeData: function(element, options) {
                    var sss = "";
                    var ssv = "";
                    element.find(".dropdown-menu input").each(function(index, hel) {
                        if($(hel).prop('checked')) {
                            if(sss == "") {
                                sss += $(hel).data('textvalue');
                                ssv += $(hel).val();
                            } else {
                                sss += options.mulitSelectSplit + $(hel).data('textvalue');
                                ssv += options.mulitSelectSplit + $(hel).val();
                            }
                        }
                    });
                    if(options.hasOther) {
                        var inputv = $.trim(element.find("." +options.otherInputClass).val());
                        if(inputv != '') {
                            if(sss == "") {
                                sss += inputv;
                                ssv += inputv;
                            } else {
                                sss += options.mulitSelectSplit + inputv;
                                ssv += options.mulitSelectSplit + inputv;
                            }
                        }
                    }

                    //alert('sss='+sss+',ssv='+ssv)
                    $("#" + element.data('valueinput')).val(ssv);
                    $("#" + element.data('textinput')).val(sss);

                },
                resettingData: function(element, options) {
                    //重置数据
                    var v = $("#" + element.data('valueinput')).val();

                    if(v) {
                        var vs = v.split(options.mulitSelectSplit);
                        var ss = new Array();
                        $.each(vs, function(index, el) {
                            if($.trim(el) != '') {
                                ss[ss.length] = $.trim(el);
                            }
                        });

                        var sss = "";

                        element.find(".dropdown-menu input").each(function(index, hel) {
                            $.each(ss, function(i, el) {
                                if($(hel).val() == el) {
                                    $(hel).prop('checked', true);
                                    if(sss == "") {
                                        sss += $(hel).data('textvalue');
                                    } else {
                                        sss += options.mulitSelectSplit + $(hel).data('textvalue');
                                    }
                                } else {
                                    $(hel).prop('checked', false);
                                }
                            });
                        });

                        $("#" + element.data('textinput')).val(sss);
                    }
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            var that = $(this);
            that.resettingData = function() {
                //alert('重置数据');
                options.resettingData(that, options);
            }

            //绑定事件
            that.bindClick = function() {
                options.bindClick(that, options);
            }

            if(options.data.length > 0) {
                options.buildHtml(that, options);
            }

            //取消自动切换事件
            that.find(".dropdown-menu").bind("click", function(e) {
                e.stopPropagation();
            });

            //重置数据
            that.resettingData();

            //绑定事件
            that.bindClick();

            return this; //return为了保持jQuery的链式操作
        }
    });
})(jQuery);

/***********************************************************************************************************************/

/**
 * 依赖于ztree的下拉节点选择项
 <!-- 树状下拉列表-->
 <div class="col-lg-6 col-sm-6 ">
     <label class="" for="">树状下拉列表(依赖于ztree)</label>
     <div id="zTreeAreaDivDropdown" class="dropdown">
         <button class="btn btn-default dropdown-toggle form-control" style="text-align: left;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
             <span class="caret"></span>
             <span class="ZTrreCb-text" id="parent-title">请选择...</span>
             <input class="ZTrreCb-value" type="hidden" id="MroBaseDeviceSortEntity:parentId" name="MroBaseDeviceSortEntity:parentId" value=""/>
         </button>
         <ul class="dropdown-menu" aria-labelledby="dropdown-parent" style="width: 100%;">
             <div style="padding: 5px;">
                <ul id="zTreeArea" class="ztree dropdown-menu-treeview"></ul>
             </div>
         </ul>
     </div>
 </div>

 $("#zTreeAreaDivDropdown").ZTrreCb({treeData:zNodes});
 * */
(function ($) {
    $.fn.extend({
        "ZTrreCb": function (options){
            options = $.extend({
                treeData:[],
                emptyTxt:"请选择...",
                treeSetting:null,
                onlySelectTrees:true,
                treeClick:function(event,treeId,treeNode,treebtnhtml,treeviewhtml,treevaluehtml,options){

                    if(options.onlySelectTrees){
                        if(treeNode.isParent){
                            return;
                        }
                    }

                    treebtnhtml.dropdown('toggle');
                    treetexthtml.html(treeNode.name);
                    treevaluehtml.val(treeNode.id);
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            var globalOptions = options;
            var that = $(this);

            var treeviewhtml = that.find(".dropdown-menu-treeview");
            var treetexthtml = that.find(".ZTrreCb-text");//.html(globalOptions.emptyTxt);
            treetexthtml.html(globalOptions.emptyTxt);
            var treevaluehtml = that.find(".ZTrreCb-value");
            var treebtnhtml = that.find(".dropdown-toggle");

            //取消自动切换事件
            that.find(".dropdown-menu").bind("click", function(e) {
                e.stopPropagation();
            });

            if(globalOptions.treeSetting==null){
                globalOptions.treeSetting={
                    check: {enable: false},
                    data: {simpleData: {enable: true}},
                    callback:null
                }
            }

            //绑定事件处理
            globalOptions.treeSetting.callback={
                onClick: function(event,treeId,treeNode){
                    //treebtnhtml.dropdown('toggle');
                    //treetexthtml.html(treeNode.name);
                    //treevaluehtml.val(treeNode.id);
                    globalOptions.treeClick(event,treeId,treeNode,treebtnhtml,treetexthtml,treevaluehtml,globalOptions);
                }
            }

            //销毁
            $.fn.zTree.destroy(treeviewhtml.attr("id"));
            //创建
            that.zTreeObj = $.fn.zTree.init($("#"+treeviewhtml.attr("id")), globalOptions.treeSetting, globalOptions.treeData);

            var currentValue = treevaluehtml.val();
            if($.trim(currentValue)!=""){

                /*
                 var nodes = this.zTreeObj.transformToArray(this.zTreeObj.getNodes());
                 alert("ztreecb---"+nodes.length);
                 $.each(nodes,function(index,el){
                 alert('i='+index+",name="+el.name+",tId="+el.tId+",id="+el.id)
                 })*/

                /*for(var i=0;i<globalOptions.treeData.length;i++){
                 if(globalOptions.treeData[i].id==currentValue){
                 this.zTreeObj.selectNode(globalOptions.treeData[i]);
                 treetexthtml.html(globalOptions.treeData[i].name);
                 break;
                 }
                 }*/

                var allnodes = that.zTreeObj.transformToArray(that.zTreeObj.getNodes());
                for(var i=0;i<allnodes.length;i++){
                    if(allnodes[i].id==currentValue){
                        that.zTreeObj.selectNode(allnodes[i]);
                        treetexthtml.html(allnodes[i].name);
                        break;
                    }
                }
            }



            return that;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);
////////////////////////////////////////////////////////////////////////////////////////////////
/*
 基于模板字符串的简单表格处理插件


 <script id="rowtmpl" type="text/x-jquery-tmpl">
 <tr>
 <td>{id}</td>
 <td>测试参数</td>
 <td>数值</td>
 <td>在用</td>
 <td style="white-space: nowrap;">
 <div class="btn-group">
 <button class="btn btn-sm btn-primary opbtn" data-opbtn="edit" type="button"><i class="fa fa-edit"></i></button>
 <button class="btn btn-sm btn-danger opbtn" data-opbtn="del" type="button"><i class="fa fa-minus"></i></button>
 </div>
 </td>
 </tr>
 </script>

 //alert('tmplcontent:'+$("#rowtmpl").text());
 //$("#table-param").SimpleTableHandle().emptyrows().appendrows([{id:'001'}],$("#rowtmpl").text()).appendrows([{id:'002'}],$("#rowtmpl").text());
 //$("#table-param").SimpleTableHandle().refreshTableRowIndex();

 $("#table-param").SimpleTableHandle(
 {rowtmplstr:$("#rowtmpl").text()}
 )
 .emptyrows()
 .appendrows([{id:'001'}])
 .appendrows([{id:'002'}])
 .cusinvoke(function(){
 alert('回调');
 }).refreshtablerowindex();


 或者：
 $("#table-param").SimpleTableHandle(
 {rowtmplstr:$("#rowtmpl").text()}
 )
 .emptyrows()
 .appendrows([{id:'001'},{id:'002'}])
 .appendrows([{id:'003'}]).cusinvoke(function(element,options){
 $(".opbtn").unbind();
 $(".opbtn").click(function(){
 if($(this).data("opbtn")=='edit'){
 alert('编辑数据');
 }else if($(this).data("opbtn")=='del'){
 alert('删除数据');
 $(this).parents("tr:first").remove();
 }else{
 alert('未知的操作类型:'+$(this).data("opbtn"));
 }
 });
 });
 */
(function ($) {
    $.fn.extend({
        "SimpleTableHandle": function (options){
            options = $.extend({
                rowdatas: [],//行数据
                rowtmplstr:"",
                appendToElement:true,//附加到元素的标记
                addprefun:function(element,options,rowdatas,rowtmplstr){
                    return rowtmplstr;
                },
                addafterfun:function(element,options,rowdatas,rowtmplstr){
                    //
                },
                addrowfun:function(element,options){

                    //modify code by zzm 20181106

                    var rowtmplstr = options.rowtmplstr;
                    rowtmplstr = options.addprefun(that,globalOptions,options.rowdatas,rowtmplstr);

                    rowtmplstr = options.appendrows(element,options,options.rowdatas,rowtmplstr);

                    options.addafterfun(that,globalOptions,options.rowdatas,rowtmplstr);

                    return rowtmplstr;

                },
                emptyrows:function(element,options){
                    //清空行对象
                    if(element.children("tbody:first").length>0){
                        element.children("tbody:first").empty();
                    }else{
                        element.empty();
                    }
                },
                delrow:function(element,options,rowobj){
                    rowobj.remove();
                },
                findrow:function(element,options,rowid){
                    var contents = element;
                    if(element.children("tbody:first").length>0){
                        contents = element.children("tbody:first");
                    }
                    return contents.children("tr["+options.rowidname+"="+rowid+"]");
                },
                rowidname:"data-id",
                appendrows:function(element,options,rowdatas,rowtmplstr){

                    if(_checkParamValid9(rowtmplstr)>9&&$.trim(rowtmplstr)!=""&&_checkParamValid9(rowdatas)>9){

                        var outstr = options.builderhtmlstr(element,options,rowdatas,rowtmplstr);
                        if(options.appendToElement){
                            if(element.children("tbody:first").length>0){
                                element.children("tbody:first").append(outstr);
                            }else{
                                element.append(outstr);
                            }
                        }

                        return outstr;
                    }
                    return "";
                },
                builderhtmlstr:function (element,options,rowdatas,rowtmplstr){
                    var ds = null;
                    if(_checkParamValid9(rowdatas)<9){
                        return "";
                    }else{
                        if($.isArray(rowdatas)){
                            ds = rowdatas;
                        }else{
                            ds = new Array();
                            ds[0] = rowdatas;
                        }
                    }

                    if(_checkParamValid9(rowtmplstr)>9&&$.trim(rowtmplstr)!=""&&_checkParamValid9(ds)>9&&ds.length>0){

                        var buffer = new StringBuffer();
                        $.each(ds, function (index, obj) {
                            buffer.append(nano(rowtmplstr,obj));
                        });

                        return buffer.toString();
                    }

                    return "";
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            var globalOptions = options;

            var that = $(this);

            that.emptyrows = function(){
                //清空行对象
                globalOptions.emptyrows(that,globalOptions);
                return that;
            }
            that.delrow = function(rowobj){
                //清空行对象
                globalOptions.delrow(that,globalOptions,rowobj);
                return that;
            }


            that.delrowbyid = function(rowid){
                //清空行对象
                that.delrow(that.findrow(rowid));
                return that;
            }

            //找到
            that.findrow = function(rowid){
                return globalOptions.findrow(that,globalOptions,rowid);
            }

            that.updaterow = function(rowid,rowdatas,rowtmplstr){
                var trobj = that.findrow(rowid);

                var html = that.builderhtmlstr(rowdatas,rowtmplstr);
                trobj.replaceWith(html);

                return that;
            }

            //构造html字符串
            that.builderhtmlstr = function(rowdatas,rowtmplstr){

                if(_checkParamValid9(rowdatas)<9){
                    return "";
                }
                var ds = null;
                if(!$.isArray(rowdatas)){
                    ds = new Array();
                    ds[0] = rowdatas;
                }else{
                    ds = rowdata;
                }


                var otmpls = null;
                if(!rowtmplstr||rowtmplstr==null||$.trim(rowtmplstr)==""){
                    otmpls = globalOptions.rowtmplstr;
                }else{
                    otmpls = rowtmplstr;
                }


                return globalOptions.builderhtmlstr(that,globalOptions,ds,otmpls);
            }

            //附加多行
            that.appendrows = function(rowdatas,rowtmplstr,prefun,afterfun){

                var otmpls = null;
                if(!rowtmplstr||rowtmplstr==null||$.trim(rowtmplstr)==""){
                    otmpls = globalOptions.rowtmplstr;
                }else{
                    otmpls = rowtmplstr;
                }

                //modify code by zzm 预处理内容
                if(prefun&&prefun!=null){
                    otmpls = prefun(that,globalOptions,rowdatas,otmpls);
                }else{
                    otmpls = globalOptions.addprefun(that,globalOptions,rowdatas,otmpls);
                }

                //modify code by zzm 返回处理后的内容
                otmpls = globalOptions.appendrows(that,globalOptions,rowdatas,otmpls);

                if(afterfun&&afterfun!=null){
                    afterfun(that,globalOptions,rowdatas,otmpls);
                }else{
                    globalOptions.addafterfun(that,globalOptions,rowdatas,otmpls);
                }

                return that;
            }

            //刷新行索引
            that.refreshtablerowindex = function(colIndex,rowIndexBegin) {

                if(_checkParamValid9(colIndex)<9){
                    colIndex =  0;
                }

                if(_checkParamValid9(rowIndexBegin)<9){
                    rowIndexBegin =  1;
                }


                var contents = that;
                if(that.children("tbody:first").length>0){
                    contents = that.children("tbody:first");
                }

                var cri = rowIndexBegin;
                contents.children("tr").each(function (index,trelement) {
                    $(trelement).children("td:eq("+colIndex+")").each(function (index,tdelement) {
                        $(tdelement).html(""+cri);
                        cri++;
                    });
                });

                return that;
            }

            //回调函数
            that.cusinvoke = function(ifun){
                if(ifun&&ifun!=null){
                    ifun(that,globalOptions);
                }

                return that;
            }


            //默认输出
            if(globalOptions.rowdatas&&globalOptions.rowdatas.length>0){
                globalOptions.addrowfun(that,globalOptions);
            }




            return that;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);
////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * 注册构建url的基础对象
 * 负责根据参数创建提交到服务器端的url
 * form 中可包含  data-basepath='' 之类的属性
 */
;(function ($) {
    $.fn.extend({
        "BuilderSubmitUrl": function (options){
            var globalOptions = $.extend({
                basePath: "",
                formBasePathName:"basepath"
            }, options); //这里用了$.extend方法，扩展一个对象

            var that = $(this);
            //格式化url
            that.formatUrl = function(url){
                url = $.trim(url);
                //
                if(url!=""&&(url.charAt(url.length-1)=='?'||url.charAt(url.length-1)=='&')){
                    url = url.substring(0,url.length);
                }
                return url;
            }

            /**
             * 构造根路径
             * */
            that.builderBasePath = function(childPath){
                var bPath = $.trim(globalOptions.basePath);

                if(bPath==""){
                    //测试从自身数据中获得
                    var t = that.data(globalOptions.formBasePathName);
                    if(typeof (t)!== 'undefined'){
                        bPath = t;
                    }
                }

                if(_checkParamValid9(childPath)>9&&$.trim(childPath)!=""){
                    bPath = bPath+"/"+childPath;
                }

                return bPath;
            }

            /*
             var jsdata ={"name":"a","val":"b"}
             for(var x in jsdata){
             alert(x+"="+jsdata[x]);
             }
             构建访问服务器的url
             传入 json 数据 构造访问url
             */
            that.builderUrl = function(basePath,jsonDatas){
                var firstLinkStr = "";

                basePath = that.formatUrl(basePath);

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

            /**
             * 构建针对系统的带有访问token的url
             * */
            that.builderSysTokenUrl = function (basePath,jsonDatas){
                basePath = that.formatUrl(basePath);

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
                return that.builderUrl(basePath,jsonDatas);
            }

            /**
             * 构建针对系统的action
             * */
            that.builderActionUrl = function (actionName,optype,data){
                var jsondata = {};
                var basePath = that.builderBasePath(actionName);//+"/"+actionName;

                if(_checkParamValid9(optype)>9){
                    //判断 optype 为字符串对象
                    if(typeof(optype) === 'string'){
                        //
                        if($.trim(optype)!=""){
                            jsondata.DoSomething = optype;
                        }
                        if(_checkParamValid9(data)>9&&$.trim(data)!=""){
                            jsondata.CurrentData = data;
                        }
                    }else{
                        //传入的是JSON对象,不考虑后面的数据
                        jsondata = optype;
                    }
                }else{
                    if(_checkParamValid9(data)>9&&$.trim(data)!=""){
                        jsondata.CurrentData = data;
                    }
                }

                return that.builderSysTokenUrl(basePath,jsondata);
            }

            return that;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

////////////////////////////////////////////////////////////////////////////////////////////////
/*
 表头过滤图标的插件
 表头样式：
 <thead>
 <tr>
 <th>#</th>
 <th>First Name<i class="glyphicon glyphicon-filter filterdata-icon" data-filterdata=''></i></th>
 <th>Last Name<i class="glyphicon glyphicon-filter filterdata-icon" data-filterdata=''></i></th>
 <th>Username<i class="glyphicon glyphicon-filter filterdata-icon" data-filterdata=''></i></th>
 </tr>
 </thead>

 .filterdata-icon{
 padding-left: 10px;
 padding-right: 10px;
 }
 .filterdata-hasData{
 color: #00B83F;
 }


 $(".filterdata-icon").TableFilterIcon();
 * */
(function($) {
    $.fn.TableFilterIcon = function(options) {
        // Our plugin implementation code goes here.
        options = $.extend({
            excFilter:function(colHeadElement,data){
                //alert('执行过滤');
            }
        }, options); //这里用了$.extend方法，扩展一个对象

        var that = $(this);

        that.initSetting=function(){


            that.unbind();
            that.popover({
                trigger:'click', //触发方式
                html: true, // 为true的话，data-content里就能放html代码了
                placement:'bottom',
                content:function(){
                    //return "<input class='filterCondition' value='测试' type='text'><button></b";
                    //alert(this.tagName);
                    var html = "<div class='form-group input-group'>"
                        +"<input class='form-control filter-data' type='text' value='"+$(this).data('filterdata')+"'>"
                        +"<span class='input-group-btn'>"
                        +"<button class='btn btn-success filter-excute' type='button'>"
                        +"<i class='fa fa-check'></i>"
                        +"</button>"
                        +"<button class='btn btn-danger filter-clean' type='button'>"
                        +"<i class='fa fa-times'></i>"
                        +"</button>"
                        +"</span></div>";

                    return html;
                    //return "<input class='filterCondition' value='测试' type='text'>";
                }
            });


            that.each(function(index,element){


                if($(element).data('filterdata')!=''){
                    $(element).addClass('filterdata-hasData');
                }

                $(element).click(function(event){
                    event.stopPropagation();    //  阻止事件冒泡
                    //弹出响应的弹出框
                    //$(element).popover('toggle')
                    $(element).parent().find(".popover").click(function(e){

                        //测试点击的时间源：
                        //alert(e.target.tagName)
                        if($(e.target).hasClass('filter-excute')){
                            //alert('执行过滤');

                            $(element).data('filterdata',$(element).parent().find(".filter-data").val());
                            //$(element).popover('hide');
                            //$(element).popover('toggle')

                            if(!$(element).hasClass('filterdata-hasData')){
                                $(element).addClass('filterdata-hasData');
                            }

                            $(element).click();

                            options.excFilter($(element),$(element).parent().find(".filter-data").val());
                        }else if($(e.target).hasClass('filter-clean')){
                            //alert('执行清空');
                            $(element).data('filterdata',"");
                            $(element).parent().find(".filter-data").val("");
                            //$(element).popover('hide');
                            //$(element).popover('toggle')

                            $(element).removeClass('filterdata-hasData');

                            $(element).click();

                            options.excFilter($(element),'');
                        }

                        e.stopPropagation();
                    });

                });
            });
        }

        that.initSetting();

        return that;
    };
})(jQuery);

////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 将图片转换为Base64值
 *
 <div class="col-lg-12" style="margin-top: 10px;">
    <button id="btn-file-base64" class="btn btn-sm btn-success" data-targetfileinput='#testfileinput' data-targetimage='#testimage' data-targeinput='#testinput'>选择文件</button>
    <input id="testfileinput" name="testfileinput" type="file" style="display:none">
    <textarea id="testinput" class="form-control" name="testinput"></textarea>
    <img id="testimage" style="max-height: 300px; height: 8em; min-width:8em;">
 </div>
 *
 * */
;(function ($) {
    $.fn.extend({
        "SettingImageToBase64Value": function (options){

            var globalOptions = $.extend({
                settingValueFun:function (btnObj,base64str) {
                    
                },
                checkFileNameFun:function (btnObj,file) {
                    //这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
                    /*if($.trim(btnObj.data('targetimage'))!=''){
                        if (!/image\/\w+/.test(file.type)) {
                            alert("请确保文件为图像类型");
                            return false;
                        }
                    }*/
                    return true;
                }
            }, options); //这里用了$.extend方法，扩展一个对象

            var that = $(this);

            that.click(function(){
                $($(this).data('targetfileinput')).click();
            });


            that.each(function (index,element) {
                var btnObj = $(this);
                var fileinputObj = $(btnObj.data('targetfileinput'));
                fileinputObj.change(function () {
                    if (typeof (FileReader) === 'undefined') {
                        alert("抱歉,你的浏览器不支持 FileReader,请使用现代浏览器操作!");
                    } else {
                        if(fileinputObj.length>0&&fileinputObj[0].files.length>0){
                            try {
                                /*图片转Base64 核心代码*/
                                var file = fileinputObj[0].files[0];

                                if(!globalOptions.checkFileNameFun(btnObj,file)){
                                    return false;
                                }

                                var reader = new FileReader();
                                reader.onload = function () {
                                    globalOptions.settingValueFun(btnObj,this.result);

                                    //if($.trim(btnObj.data('targetimage'))!=''){
                                    //    $(btnObj.data('targetimage')).attr('src', this.result);
                                    //}
                                    //alert(btnObj.data('targeinput'));
                                    //$(btnObj.data('targeinput')).val(this.result);
                                }
                                reader.readAsDataURL(file);
                            } catch (e) {
                                alert('文件转Base64出错' + e.toString())
                            }
                        }else{
                            alert('请选择文件');
                        }

                    }
                });
            });

            return that;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
/*
 *JQuery 插件机制
 */
(function ($) {
    $.fn.extend({
        "PFDemo": function (options){
            options = $.extend({
                menuDataJson: [],
                moduleAccessUrl:""
            }, options); //这里用了$.extend方法，扩展一个对象

            var globalOptions = options;

            return this;//return为了保持jQuery的链式操作
        }
    });
})(jQuery);



/*
 *JQuery 插件机制
 */
(function($) {
    $.fn.PFDemo2 = function(options) {
        // Our plugin implementation code goes here.
        options = $.extend({
            menuDataJson: [],
            moduleAccessUrl:""
        }, options); //这里用了$.extend方法，扩展一个对象

        //调用函数
        this.sayHello=function(){
            alert('say hello pfdemo2，tagName='+$(this)[0].tagName);
        }

        return this;
    };
})(jQuery);


/*
 * jquery 全局函数
 * 调用方法：jQuery.jqGlobalFuntionTest() 或者 $.jqGlobalFuntionTest()
 * */
jQuery.jqGlobalFuntionTest = function() {
    alert('This is a test. This is only a test.');
};
//或者
jQuery.extend({
    jqGlobalFuntionTest1: function() {
        alert('This is a test. This is only a test.');
    },
    jqGlobalFuntionTest2: function(param) {
        alert('This function takes a parameter, which is "' + param + '".');
    }
});


//为jQuery类添加添加类方法，可以理解为添加静态方法。如：
$.extend({
    jqGlobalFuntionTest3:function(a,b){return a+b;}
});

////////////////////////////////////////////////////////////////////////////////////////////////
