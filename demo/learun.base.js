//Version:1.0.1701
window.learun = {};

(function ($, learun) {
    "use strict";
    //基础方法
    $.extend(learun, {
        //初始化
        init: function (opt) {
            learun.theme.type = opt.themeType;
            learun.data.init(opt.callBack);
        },
        childInit: function (opt) {
            $('.toolbar').authorizeButton();
            learun.theme.setType();
            if (learun.excel != undefined) {
                learun.excel.init();
            }
            learun.ajaxLoading(false);
            //added by Cathy 2017-07-21
            //禁用只读文本中回退键触发浏览器回退
            learun.forbiddenBackspace();
            //added by Cathy 2017-07-21
        },
        //皮肤主题
        theme: {
            type: "1",
            setType: function () {
                switch (top.learun.theme.type) {
                    case "1"://经典版
                        $('body').addClass('uiDefault');
                        break;
                    case "2"://风尚版
                        $('body').addClass('uiLTE');
                        break;
                    case "3"://炫动版
                        $('body').addClass('uiWindows');
                        break;
                    case "4"://飞扬版
                        $('body').addClass('uiPretty');
                        break;
                }
            }
        },
        //加载提示
        loading: function (ops) {//加载动画显示与否
            var ajaxbg = top.$("#loading_background,#loading_manage");
            if (ops.isShow) {
                ajaxbg.show();
            } else {
                if (top.$("#loading_manage").attr('istableloading') == undefined) {
                    ajaxbg.hide();
                    top.$(".ajax-loader").remove();
                }
            }
            if (!!ops.text) {
                top.$("#loading_manage").html(ops.text);
            } else {
                top.$("#loading_manage").html("UMS正在为您加载…");
            }
            top.$("#loading_manage").css("left", (top.$('body').width() - top.$("#loading_manage").width()) / 2 - 54);
            top.$("#loading_manage").css("top", (top.$('body').height() - top.$("#loading_manage").height()) / 2);
        },
        ajaxLoading: function (isShow) {
            var $obj = $('#ajaxLoader');
            if (isShow) {
                $obj.show();
            }
            else {
                $obj.fadeOut();
            }
        },
        //获取窗口Id
        tabiframeId: function () {//tab窗口Id
            return top.$(".LRADMS_iframe:visible").attr("id");
        },
        //获取当前窗口
        currentIframe: function () {
            if (top.frames[learun.tabiframeId()].contentWindow != undefined) {
                return top.frames[learun.tabiframeId()].contentWindow;
            }
            else {
                return top.frames[learun.tabiframeId()];
            }
        },
        currentIframeModuleId: function () {
            var currentIframe = top.$(".LRADMS_iframe:visible");
            if (!!currentIframe)
                return $(currentIframe[0]).attr("data-moduleId");
            return false;
        },
        //获取iframe窗口
        getIframe: function (Id) {
            var obj = frames[Id];
            if (obj != undefined) {
                if (obj.contentWindow != undefined) {
                    return obj.contentWindow;
                }
                else {
                    return obj;
                }
            }
            else {
                return null;
            }
        },
        //刷新页面
        reload: function () {
            //modified by Cathy 2017-09-12 解决火狐浏览器刷新缓存问题
            window.location.href = window.location.href;
            //location.reload();
            //modified by Cathy 2017-09-12 
            return false;
        },
        //提示框
        dialogTop: function (opt) {
            $(".tip_container").remove();
            var bid = parseInt(Math.random() * 100000);
            $("body").prepend('<div id="tip_container' + bid + '" class="container tip_container"><div id="tip' + bid + '" class="mtip"><i class="micon"></i><span id="tsc' + bid + '"></span><i id="mclose' + bid + '" class="mclose"></i></div></div>');
            var $this = $(this);
            var $tip_container = $("#tip_container" + bid);
            var $tip = $("#tip" + bid);
            var $tipSpan = $("#tsc" + bid);
            //先清楚定时器
            clearTimeout(window.timer);
            //主体元素绑定事件
            $tip.attr("class", opt.type).addClass("mtip");
            $tipSpan.html(opt.msg);
            $tip_container.slideDown(300);
            //提示层隐藏定时器
            window.timer = setTimeout(function () {
                $tip_container.slideUp(300);
                $(".tip_container").remove();
            }, 4000);
            $("#tip_container" + bid).css("left", ($(window).width() - $("#tip_container" + bid).width()) / 2);
        },
        dialogOpen: function (opt) {
            learun.loading({ isShow: true });
            var opt = $.extend({
                id: null,
                title: '系统窗口',
                width: "100px",
                height: "100px",
                url: '',
                shade: 0.3,
                maxmin: true,
                btn: ['确认', '关闭'],
                callBack: null,
                success: null
            }, opt);
            var _url = opt.url;
            var _width = top.learun.windowWidth() > parseInt(opt.width.replace('px', '')) ? opt.width : top.learun.windowWidth() + 'px';
            var _height = top.learun.windowHeight() > parseInt(opt.height.replace('px', '')) ? opt.height : top.learun.windowHeight() + 'px';
            top.layer.open({
                id: opt.id,
                type: 2,
                shade: opt.shade,
                title: opt.title,
                fix: false,
                maxmin: opt.maxmin,
                area: [_width, _height],
                content: top.contentPath + _url,
                btn: opt.btn,
                success: function (obj, index) {
                    learun.loading({ isShow: false });
                    //added by Cathy 2018-01-05
                    if (opt.success != undefined) {
                        opt.success(obj, index);
                    }
                },
                yes: function () {
                    opt.callBack(opt.id);
                }, cancel: function () {
                    if (opt.cancel != undefined) {
                        opt.cancel(opt.id);
                    }
                    return true;
                }, end: function () {      //added by Sandy 2017-08-28
                    if (opt.end != undefined) {
                        opt.end(opt.id);
                    }
                }
            });
        },
        dialogContent: function (opt) {
            var opt = $.extend({
                id: null,
                title: '系统窗口',
                width: "100px",
                height: "100px",
                content: '',
                maxmin: true,
                btn: ['确认', '关闭'],
                callBack: null
            }, opt);
            top.layer.open({
                id: opt.id,
                type: 1,
                title: opt.title,
                fix: false,
                maxmin: opt.maxmin,
                area: [opt.width, opt.height],
                success: function (obj, index) {
                    learun.loading({ isShow: false });
                },
                content: opt.content,
                btn: opt.btn,
                yes: function () {
                    opt.callBack(opt.id);
                }
            });
        },
        dialogAlert: function (opt) {
            if (opt.type == -1) {
                opt.type = 2;
            }
            top.layer.alert(opt.msg, {
                icon: opt.type,
                title: "系统提示",
                success: function (obj, index) {
                    learun.loading({ isShow: false });
                }
            });
        },
        dialogConfirm: function (opt) {
            top.layer.confirm(opt.msg, {
                icon: 7,
                title: "对话框提示",
                btn: ['确认', '取消'],
                success: function (obj, index) {
                    learun.loading({ isShow: false });
                }
            }, function (index) {
                //Modified By Sandy 2017-08-04
                //新加index参数, 以适用其它删除确认框的关闭操作
                if (index != undefined)
                    opt.callBack(true, index);
                else
                    opt.callback(true);
            }, function (index) {
                //Modified By Sandy 2017-08-04
                if (index != undefined)
                    opt.callBack(false, index);
                else
                    opt.callback(false);
            });
        },
        dialogMsg: function (opt) {
            if (opt.type == -1) {
                opt.type = 2;
            }
            //added by cathy 2017年12月28日 添加弹框top偏移量opt.offset
            var opt = $.extend({
                offset: 'auto'
            }, opt);
            top.layer.msg(opt.msg, { icon: opt.type, time: 4000, shift: 5, offset: opt.offset });
        },
        dialogClose: function (formid) {
            try {
                var index = top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                //Added by Cathy 2018/01/09 增加关闭层参数
                if (!!formid) {
                    index = top.layer.getFrameIndex(formid);
                }
                //Added by Cathy 2018/01/09 增加关闭层参数
                var $IsdialogClose = top.$("#layui-layer" + index).find('.layui-layer-btn').find("#IsdialogClose");
                var IsClose = $IsdialogClose.is(":checked");
                if ($IsdialogClose.length == 0) {
                    IsClose = true;
                }
                if (IsClose) {
                    top.layer.close(index);
                } else {
                    window.location.href = window.location.href;
                }
            } catch (e) {
                alert(e)
            }
        },
        //下载文件
        downFile: function (opt) {
            if (opt.url && opt.data) {
                opt.data = typeof opt.data == 'string' ? opt.data : jQuery.param(opt.data);
                var inputs = '';
                $.each(opt.data.split('&'), function () {
                    var pair = this.split('=');
                    inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
                });
                $('<form action="' + opt.url + '" method="' + (opt.method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
            };
        },
        //获取url参数值
        request: function (keyValue) {
            return learun.getRequest(location.href, keyValue);
        },
        getRequest: function (url, keyValue) {
            var index = url.indexOf("?");
            if (index < 0) { return ""; }
            var search = url.substring(index + 1);
            if (learun.isNullOrEmpty(search))
                return "";
            var queryStrings = search.split('&');
            var result = "";
            $.each(queryStrings, function (index) {
                var ar = queryStrings[index].split("=");
                if (ar[0].toLowerCase() == keyValue.toLowerCase()) {
                    if (unescape(ar[1]) == 'undefined') {
                        result = "";
                    } else {
                        result = unescape(ar[1]);
                    }
                    return;
                }
            });
            return result;
        },
        setRequest: function (url, keyName, keyValue, existReplace) {
            var index = url.indexOf("?");
            if (index < 0) { return url + "?" + keyName + "=" + keyValue; }
            var absoluteUrl = url.substring(0, index);
            var search = url.substring(index + 1);
            if (learun.isNullOrEmpty(search))
            { return url + "?" + keyName + "=" + keyValue; }
            var queryStrings = search.split('&');
            var result = "";
            $.each(queryStrings, function (index, queryString) {
                if (queryStrings.toLowerCase().indexOf(keyName.toLowerCase() + "=") == 0) {
                    result = (!existReplace) ? url :
                        (absoluteUrl + "?" + search.replace(queryString, keyName + "=" + keyValue))
                    return;
                }
            });
            return result;
        },
        //改变url参数值
        changeUrlParam: function (url, key, value) {
            var newUrl = "";
            var reg = new RegExp("(^|)" + key + "=([^&]*)(|$)");
            var tmp = key + "=" + value;
            if (url.match(reg) != null) {
                newUrl = url.replace(eval(reg), tmp);
            } else {
                if (url.match("[\?]")) {
                    newUrl = url + "&" + tmp;
                }
                else {
                    newUrl = url + "?" + tmp;
                }
            }
            return newUrl;
        },
        schemeAuthority: function () {
            var protocol = location.protocol;
            var host = location.host;
            return (protocol + "//" + host);
        },
        //获取浏览器名称
        getBrowserName: function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                return "Opera"
            }; //判断是否Opera浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            } //判断是否Firefox浏览器
            if (userAgent.indexOf("Chrome") > -1) {
                if (window.navigator.webkitPersistentStorage == undefined) {
                    return "Edge";
                }
                if (window.navigator.webkitPersistentStorage.toString().indexOf('DeprecatedStorageQuota') > -1) {
                    return "Chrome";
                } else {
                    return "360";
                }
            }//判断是否Chrome浏览器//360浏览器
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            } //判断是否Safari浏览器backc1
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            }//判断是否IE浏览器
        },
        //改变树状tab状态
        changeStandTab: function (opt) {
            $(".standtabactived").removeClass("standtabactived");
            $(opt.obj).addClass("standtabactived");
            $('.standtab-pane').css('display', 'none');
            $('#' + opt.id).css('display', 'block');
        },
        //获取窗口宽
        windowWidth: function () {
            return $(window).width();
        },
        //获取窗口高度
        windowHeight: function () {
            return $(window).height();
        },
        //ajax通信方法
        ajax: {
            asyncGet: function (opt) {
                var data = null;
                var opt = $.extend({
                    type: "GET",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (d) {
                        data = d;
                    }
                }, opt);
                $.ajax(opt);
                return data;
            },
            asyncPost: function (opt) {
                var data = null;
                var opt = $.extend({
                    type: "POST",
                    dataType: "json",
                    data: [],
                    async: false,
                    cache: false,
                    success: function (d) {
                        data = d;
                    }
                }, opt);
                if ($('[name=__RequestVerificationToken]').length > 0) {
                    opt.data["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
                }
                $.ajax(opt);
                return data;
            },
        },
        initialUpperCase: function (word) {
            if (word.length > 0)
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            return "";
        },
        initialLowerrCase: function (word) {
            if (word.length > 0)
                return word.substring(0, 1).toLowerCase() + word.substring(1);
            return "";
        },
        hasValue: function (val) {
            return !(val == "please_select" || val == "" || val == "&nbsp;");
        },
        jsonFormat: function (val) {
            return val.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t');;
        },
        isJsonFormat: function (val) {
            try { if (learun.isNullOrEmpty(val)) { return false; } $.parseJSON(val); } catch (e) { return false; } return true;
        },
        //创建一个GUID
        createGuid: function () {
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) guid += "-";
            }
            return guid;
        },
        isGuid: function (obj) {
            return (learun.isNullOrEmpty(obj) || obj.length != 36) ? false : /^([a-z0-9]{8})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{12})$/.test(obj);
        },
        //判断是否为空
        isNullOrEmpty: function (obj) {
            return ((typeof (obj) == "string" && obj == "") || obj == null || obj == undefined);
        },
        //判断是否为数字
        isNumber: function (obj) {
            $("#" + obj).bind("contextmenu", function () {
                return false;
            });
            $("#" + obj).css('ime-mode', 'disabled');
            $("#" + obj).keypress(function (e) {
                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                    return false;
                }
            });
        },
        //判断是否是金钱
        isMoney: function (obj) {
            $("#" + obj).bind("contextmenu", function () {
                return false;
            });
            $("#" + obj).css('ime-mode', 'disabled');
            $("#" + obj).bind("keydown", function (e) {
                var key = window.event ? e.keyCode : e.which;
                if (isFullStop(key)) {
                    return $(this).val().indexOf('.') < 0;
                }
                return (isSpecialKey(key)) || ((isNumber(key) && !e.shiftKey));
            });
            function isNumber(key) {
                return key >= 48 && key <= 57
            }
            function isSpecialKey(key) {
                return key == 8 || key == 46 || (key >= 37 && key <= 40) || key == 35 || key == 36 || key == 9 || key == 13
            }
            function isFullStop(key) {
                return key == 190 || key == 110;
            }
        },
        //判断图片是否存在
        isHasImg: function (pathImg) {
            var ImgObj = new Image();
            ImgObj.src = pathImg;
            if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
                return true;
            } else {
                return false;
            }
        },
        //日期格式化yyyy-
        formatDate: function (v, format) {
            if (!v) return "";
            var d = v;
            if (typeof v === 'string') {
                if (v.indexOf("/Date(") > -1)
                    d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
                else
                    d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
            }
            var o = {
                "M+": d.getMonth() + 1,  //month
                "d+": d.getDate(),       //day
                "h+": d.getHours(),      //hour
                "m+": d.getMinutes(),    //minute
                "s+": d.getSeconds(),    //second
                "q+": Math.floor((d.getMonth() + 3) / 3),  //quarterjsoncc1
                "S": d.getMilliseconds() //millisecond
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        },
        //转化成十进制
        toDecimal: function (num) {
            if (num == null) {
                num = "0";
            }
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num))
                num = "0";
            var sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            var cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10)
                cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
                num = num.substring(0, num.length - (4 * i + 3)) + '' +
                        num.substring(num.length - (4 * i + 3));
            return (((sign) ? '' : '-') + num + '.' + cents);
        },
        //文件大小转换
        countFileSize: function (size) {
            if (size < 1024.00)
                return learun.toDecimal(size) + " 字节";
            else if (size >= 1024.00 && size < 1048576)
                return learun.toDecimal(size / 1024.00) + " KB";
            else if (size >= 1048576 && size < 1073741824)
                return learun.toDecimal(size / 1024.00 / 1024.00) + " MB";
            else if (size >= 1073741824)
                return learun.toDecimal(size / 1024.00 / 1024.00 / 1024.00) + " GB";
        },
        //数组复制
        arrayCopy: function (data) {
            return $.map(data, function (obj) {
                return $.extend(true, {}, obj);
            });
        },
        stringArray: function (str, strone) {
            var arrayObj = str.split(',');
            //Added by Cathy 2017-09-13 解决IE8不支持indexOf方法 
            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function (val) {
                    var value = this;
                    for (var i = 0; i < value.length; i++) {
                        if (value[i] == val) return i;
                    }
                    return -1;
                };
            }
            //Added by Cathy 2017-09-13
            arrayObj.splice(arrayObj.indexOf(strone), 1);
            return String(arrayObj);
        },
        stringIndexOf: function (str, strone) {
            var arrayObj = str.split(',');
            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function (val) {
                    var value = this;
                    for (var i = 0; i < value.length; i++) {
                        if (value[i] == val) return i;
                    }
                    return -1;
                };
            }
            return arrayObj.indexOf(strone);
        },
        //检验是否选中行
        checkedRow: function (id) {
            var isOK = true;
            if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
                isOK = false;
                learun.dialogMsg({ msg: '您没有选中任何数据项,请选中后再操作！', type: 0 });
            } else if (id.split(",").length > 1) {
                isOK = false;
                learun.dialogMsg({ msg: '很抱歉,一次只能选择一条记录！', type: 0 });
            }
            return isOK;
        },
        //2017/10/21 Tiny 
        //检验是否只选中一条或者不选
        checkedSingleRowOrNull: function (id) {
            var isOK = true;
            if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
                isOK = true;
            } else if (id.split(",").length > 1) {
                isOK = false;
                learun.dialogMsg({ msg: '很抱歉,一次只能选择一条记录！', type: 0 });
            }
            return isOK;
        },
        //2017/10/21 Tiny 
        //检验必须选中一行或者多行 不能为空
        checkedSingleRowOrMoreRow: function (id) {
            var isOK = true;
            if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
                isOK = false;
                learun.dialogMsg({ msg: '您没有选中任何数据项,请选中后再操作！', type: 0 });
            }
            return isOK;
        },
        //表单操作
        saveForm: function (opt) {
            var opt = $.extend({
                url: "",
                param: [],
                type: "post",
                dataType: "json",
                loading: "正在处理数据...",
                success: function () { },
                close: true
            }, opt);
            learun.loading({ isShow: true, text: opt.loading });
            if ($('[name=__RequestVerificationToken]').length > 0) {
                opt.param["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
            }
            window.setTimeout(function () {
                $.ajax({
                    url: opt.url,
                    data: opt.param,
                    type: opt.type,
                    dataType: opt.dataType,
                    success: function (data) {
                        if (data.type == "3") {
                            learun.dialogAlert({ msg: data.message, type: -1 });
                        } else {
                            learun.loading({ isShow: false });
                            learun.dialogMsg({ msg: data.message, type: 1 });
                            opt.success(data);
                            if (opt.close == true) {
                                learun.dialogClose();
                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        learun.loading({ isShow: false });
                        learun.dialogMsg({ msg: errorThrown, type: -1 });
                    },
                    beforeSend: function () {
                        learun.loading({ isShow: true, text: opt.loading });
                    },
                    complete: function () {
                        learun.loading({ isShow: false });
                    }
                });
            }, 500);
        },
        // 表单操作(可自定义错误判断)
        //Added By Cathy 2017-07-11
        saveFormWithError: function (opt) {
            var opt = $.extend({
                url: "",
                param: [],
                type: "post",
                dataType: "json",
                loading: "正在处理数据...",
                success: null,
                close: true
            }, opt);
            learun.loading({ isShow: true, text: opt.loading });
            if ($('[name=__RequestVerificationToken]').length > 0) {
                opt.param["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
            }
            window.setTimeout(function () {
                $.ajax({
                    url: opt.url,
                    data: opt.param,
                    type: opt.type,
                    dataType: opt.dataType,
                    success: function (data) {
                        learun.loading({ isShow: false });
                        opt.success(data);
                        // learun.dialogMsg({ msg: data.message, type: 1 });
                        //if (opt.close == true) {
                        //    learun.dialogClose();
                        //} 
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        learun.loading({ isShow: false });
                        learun.dialogMsg({ msg: errorThrown, type: -1 });
                    },
                    beforeSend: function () {
                        learun.loading({ isShow: true, text: opt.loading });
                    },
                    complete: function () {
                        learun.loading({ isShow: false });
                    }
                });
            }, 500);
        },
        setForm: function (opt) {
            var opt = $.extend({
                url: "",
                param: [],
                type: "get",
                dataType: "json",
                //自定义是否弹出加载框
                //Added By Tiny 2017-10-25
                showloading: true,
                success: function () { },
                async: false,
                cache: false
            }, opt);
            //added by Cathy 2017-10-12 解决IE浏览器缓存造成编辑数据不更新问题
            if (opt.url != "") {
                if (opt.url.indexOf('?') > 0) {
                    opt.url += "&_v=" + formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
                }
                else {
                    opt.url += "?_v=" + formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
                }
            }
            //added by Cathy 2017-10-12
            $.ajax({
                url: opt.url,
                data: opt.param,
                type: opt.type,
                dataType: opt.dataType,
                async: opt.async,
                success: function (data) {
                    if (data != null && data.type == "3") {
                        learun.dialogAlert({ msg: data.message, type: -1 });
                    } else {
                        opt.success(data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    learun.dialogMsg({ msg: errorThrown, type: -1 });
                }, beforeSend: function () {
                    if (opt.showloading) {
                        learun.loading({ isShow: true });
                    }
                },
                complete: function () {
                    learun.loading({ isShow: false });
                }
            });
        },
        removeForm: function (opt) {
            var opt = $.extend({
                msg: "注：您确定要删除吗？该操作将无法恢复",
                loading: "正在删除数据...",
                url: "",
                param: [],
                type: "post",
                dataType: "json",
                success: function () { }
            }, opt);
            learun.dialogConfirm({
                msg: opt.msg,
                callBack: function (r) {
                    if (r) {
                        learun.loading({ isShow: true, text: opt.loading });
                        window.setTimeout(function () {
                            var postdata = opt.param;
                            if ($('[name=__RequestVerificationToken]').length > 0) {
                                postdata["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
                            }
                            $.ajax({
                                url: opt.url,
                                data: postdata,
                                type: opt.type,
                                dataType: opt.dataType,
                                success: function (data) {
                                    if (data.type == "3") {
                                        learun.dialogAlert({ msg: data.message, type: -1 });
                                    } else {
                                        learun.dialogMsg({ msg: data.message, type: 1 });
                                        opt.success(data);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    learun.loading({ isShow: false });
                                    learun.dialogMsg({ msg: errorThrown, type: -1 });
                                },
                                beforeSend: function () {
                                    learun.loading({ isShow: true, text: opt.loading });
                                },
                                complete: function () {
                                    learun.loading({ isShow: false });
                                }
                            });
                        }, 500);
                    }
                }
            });
        },
        confirmAjax: function (opt) {
            var opt = $.extend({
                msg: "提示信息",
                loading: "正在处理数据...",
                url: "",
                param: [],
                type: "post",
                dataType: "json",
                success: function () { }
            }, opt);
            learun.dialogConfirm({
                msg: opt.msg,
                callBack: function (r) {
                    if (r) {
                        learun.loading({ isShow: true, text: opt.loading });
                        window.setTimeout(function () {
                            var postdata = opt.param;
                            if ($('[name=__RequestVerificationToken]').length > 0) {
                                postdata["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
                            }
                            $.ajax({
                                url: opt.url,
                                data: postdata,
                                type: opt.type,
                                dataType: opt.dataType,
                                success: function (data) {
                                    learun.loading({ isShow: false });
                                    if (data.type == "3") {
                                        learun.dialogAlert({ msg: data.message, type: -1 });
                                    } else {
                                        learun.dialogMsg({ msg: data.message, type: 1 });
                                        opt.success(data);
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    learun.loading({ isShow: false });
                                    learun.dialogMsg({ msg: errorThrown, type: -1 });
                                },
                                beforeSend: function () {
                                    learun.loading({ isShow: true, text: opt.loading });
                                },
                                complete: function () {
                                    learun.loading({ isShow: false });
                                }
                            });
                        }, 200);
                    }
                }
            });
        },
        getExistFieldValue: function (controlId, url, param) {
            var $control = $("#" + controlId);
            var data = {
                keyValue: learun.request('keyValue')
            };
            var type = $control.attr('type');
            if ($control.hasClass("input-datepicker")) {
                type = "datepicker";
            }
            switch (type) {
                case "checkbox":
                    if ($("#" + id).is(":checked")) {
                        data[controlId] = "1";
                    }
                    else {
                        data[controlId] = "0";
                    }
                    break;
                case "select":
                case "selectTree":
                case "webUploader":
                case "uploadify":
                case "uploadifyPic":
                    var value = $control.attr('data-value');
                    data[controlId] = value;
                    break;
                default:
                    data[controlId] = $control.val();
                    break;
            }
            if (data[controlId] == "") {
                return false;
            }
            var options = $.extend(data, param);
            var result = false;
            if (url.indexOf('?') > 0) {
                url += "&_v=" + new Date().getTime();
            }
            else {
                url += "?_v=" + new Date().getTime();
            }
            $.ajax({
                url: url,
                data: options,
                type: "get",
                dataType: "text",
                async: false,
                cache: false,
                success: function (data) {
                    result = data;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    learun.dialogMsg({ msg: errorThrown, type: -1 });
                }
            });
            return result.toLocaleLowerCase() == 'false' || result == "0";
        },
        existField: function (controlId, url, param) {
            var $control = $("#" + controlId);
            var result = learun.getExistFieldValue(controlId, url, param);
            if (result != undefined && result) {
                ValidationMessage($control, '已存在,请重新输入');
                $control.attr('fieldexist', 'yes');
            }
            else {
                $control.attr('fieldexist', 'no');
            }
        },
        getDataForm: function (opt) {
            var opt = $.extend({
                url: "",
                param: [],
                type: "post",
                dataType: "json",
                loading: "正在获取数据...",
                success: function () { },
                async: false,
                cache: false
            }, opt);
            learun.loading({ isShow: true, text: opt.loading });
            if ($('[name=__RequestVerificationToken]').length > 0) {
                opt.param["__RequestVerificationToken"] = $('[name=__RequestVerificationToken]').val();
            }
            $.ajax({
                url: opt.url,
                data: opt.param,
                type: opt.type,
                dataType: opt.dataType,
                async: opt.async,
                success: function (data) {
                    if (data != null && data.type == "3") {
                        learun.dialogAlert({ msg: data.message, type: -1 });
                    } else {
                        opt.success(data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    learun.dialogMsg({ msg: errorThrown, type: -1 });
                }, beforeSend: function () {
                    learun.loading({ isShow: true });
                },
                complete: function () {
                    learun.loading({ isShow: false });
                }
            });
        },
        //获取系统表单字段数据,如果需要对这些字段做权限管控才添加，不然不添加
        getSystemFormFields: function (Id) {
            var formIframe = learun.getIframe(Id);
            if (!!formIframe.$) {
                formIframe.$('body').find('[data-systemHideField]').hide();
                if (!!formIframe.getSystemFields) {
                    return formIframe.getSystemFields();//{ "field": id, "label": name, 'type': type }
                }
                else {
                    return [];
                }
            }
            else {
                return false;
            }
        },
        loadSystemForm: function (iframeId, url) {
            var _iframe = document.getElementById(iframeId);
            var _iframeLoaded = function () {
                var formIframe = learun.getIframe(iframeId);
                if (!!formIframe.$) {
                    formIframe.$('body').find('[data-systemHideField]').hide();
                }
                learun.loading({ "isShow": false });
            };
            if (_iframe.attachEvent) {
                _iframe.attachEvent("onload", _iframeLoaded);
            } else {
                _iframe.onload = _iframeLoaded;
            }
            $('#' + iframeId).attr('src', url);
        },
        getSystemFormData: function (iframeId)//获取系统表单数据
        {
            var formIframe = learun.getIframe(iframeId);
            if (!!formIframe && !!formIframe.$) {
                if (!!formIframe.getSystemData) {
                    return formIframe.getSystemData();//{ "field": id, "label": name, 'type': type }
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        },
        saveSystemFormData: function (iframeId, callback) {
            var formIframe = learun.getIframe(iframeId);
            if (!!formIframe.$) {
                if (!!formIframe.AcceptClick) {
                    formIframe.AcceptClick(callback);//{ "field": id, "label": name, 'type': type }
                }
            }
        },
        setSystemFormFieldsAuthrize: function (iframeId, item) {
            var formIframe = learun.getIframe(iframeId);
            if (!!formIframe.$) {
                if (!!formIframe.setSystemFieldsAuthorize) {
                    formIframe.setSystemFieldsAuthorize(item);//{ "field": id, "label": name, 'type': type }
                }
            }
        },
        //创建一个流程
        createProcess: function (postData, callBack) {
            postData.processId = learun.createGuid();
            postData.moduleId = top.$.cookie('currentmoduleId');

            learun.getDataForm({
                url: "../../FlowManage/FlowLaunch/CreateProcessInstance",
                param: postData,
                loading: "正在创建流程",
                success: function () {
                    callBack(postData.processId);
                }
            });
        },
        //json数据操作
        jsonWhere: function (data, action) {
            if (action == null) return;
            var reval = new Array();
            $(data).each(function (i, v) {
                if (action(v)) {
                    reval.push(v);
                }
            })
            return reval;
        },
        //added by Cathy 2017-07-25
        //Json复制
        jsonCopy: function (data) {
            if (data == null) return;
            var txt = JSON.stringify(data);
            return JSON.parse(txt);
        },
        //added by Cathy 2017-07-25
        //added by Cathy 2017-07-21
        //禁用只读文本中回退键触发浏览器回退
        forbiddenBackspace: function () {
            $("input[type=text][readonly]").keydown(function (e) {
                var keyEvent;
                var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if (keyCode == 8) {
                    var d = e.srcElement || e.target;
                    if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
                        keyEvent = d.readOnly || d.disabled;
                    }
                } else {
                    keyEvent = false;
                }
                if (keyEvent) {
                    e.preventDefault();
                    e.returnValue = false;
                }
            });
        },
        getRequestAuthModuleId: function (url) {
            if (learun.isNullOrEmpty(url)) {
                url = location.href;
            }
            return learun.getRequest(url, "Auth_ModuleId");
        },
        setRequestAuthModuleId: function (keyValue, url) {
            if (learun.isNullOrEmpty(url)) {
                url = location.href;
            }
            return learun.setRequest(url, "Auth_ModuleId", keyValue);
        },
        getRequestAuthInFrame: function (url) {
            if (learun.isNullOrEmpty(url)) {
                url = location.href;
            }
            return learun.getRequest(url, "Auth_InFrame");
        },
        //added by Cathy 2017-07-21
        //added by Sandy 2017-08-17 Start
        //单位数转双位数
        doubleNumber: function (number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        },
        //added by Sandy 2017-08-17 End
        //added by 7726 2017-12-17 Start
        //两位小数点
        twoDigit: function (number) {
            number = isNaN(number) || learun.isNullOrEmpty(number) ? 0 : number;
            number = parseFloat(number);
            number = Math.round(number * 100) / 100
            return number;
        },
        //added by 7726 2017-12-17 End
        //added by Cathy 2017-08-14 列表反选（需引用JqGrid.js）
        antiGridSelect: function (tableObj) {
            var length = tableObj.find("tbody tr").length;
            for (var i = 0; i < length; i++) {
                tableObj.setSelection(i);
            }
        },
        //added by Cathy 2017-08-14 end
        //added by Sandy 2017-11-28
        // HTML特殊字符转义
        htmlEscape: function (string) {
            var entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;'
            };
            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        }
        //added by Sandy 2017-11-28
    });
})(window.jQuery, window.learun);
