//FastClick
$(function () {
    FastClick.attach(document.body);
});


function Ckeck_Device() {
    var system = {
        win: false,
        mac: false,
        xll: false,
        ipad: false
    };
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") >= 0;
    system.mac = p.indexOf("Mac") >= 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") >= 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
    //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面

    //识别所有win,mac,X11系统,认为是pc端 反之 是手机端
    if (system.win || system.mac || system.xll) {
        $(".survey-screen").css("overflow-y", "hidden");

    }
    else {
        $(".survey-screen").css("overflow-y", "scroll");
        system_event.animation_remove();
    }
}

var system_event = {
    animation_remove: function () {
        $(".section.home").addClass("RemoveBgAnimation");
        $("[data-ix]").removeAttr("data-ix");
    }
}

//判断是pc端 还是 手机端

$(document).ready(function () {
    Ckeck_Device();
});

$(document).ready(function () {
    $("#browser-bg").css("display", "none");
    if (!which_browser()) {
        $("#indexdiv").css("display", "none");
        $("#browser-bg").css("display", "block");
    }
    else {
        $("#browser-bg").css("display", "none");
        $("#indexdiv").css("display", "block");
        $("#indexdiv").css("display", "block");
    }


    $("#emilsucc").css("display", "none");
    $("#emailfail").css("display", "none");



});

function SendMail() {
    $("#emilsucc").css("display", "none");
    $("#emailfail").css("display", "none");
    var issave = true;
    if ($("#name").val() != "") {
        $("#name").removeClass("input_border_red");
    } else {
        issave = false;
        $("#name").attr("class", "input_border_red");
    }
    if ($("#email-2").val() != "") {
        $("#email-2").removeClass("input_border_red");
    } else {
        issave = false;
        $("#email-2").attr("class", "input_border_red");
    }
    if ($("#field").val() != "") {
        $("#field").removeClass("input_border_red");
    } else {
        issave = false;
        $("#field").attr("class", "input_border_red");
    }
    if ($("#email").val() != "") {
        $("#email").removeClass("input_border_red");
    } else {
        issave = false;
        $("#email").attr("class", "input_border_red");
    }
    var pattern = /\w@\w*\.\w/;
    if (!pattern.test($("#email").val())) {
        issave = false;
        $("#email").attr("class", "input_border_red");
    }

    if (!issave) {
        return;
    }
    $.ajax({
        type: "POST",
        url: "/Home/SendContactUsEMail",
        data: {
            name: $("#name").val(),
            title: $("#email-2").val(),
            email: $("#email").val(),
            content: $("#field").val(),
        },
        dataType: "json",
        error: function (e)//出错处理
        {
            ErrAlert(e, "操作失败!");
        },
        success: function (data) {

            if (data.IsTrue) {
                $("#name").val("");
                $("#email-2").val("");
                $("#email").val("");
                $("#field").val("");
                $("#emilsucc").css("display", "block");
            }
            else {
                $("#emailfail").css("display", "block");
            }

        }

    });
}


function which_browser() {
    //自动识别浏览器类型,并获取型号
    var agent = navigator.userAgent.toLowerCase();
    var regStr_ie = /msie [\d.]+;/gi;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi;
    var regStr_saf = /safari\/[\d.]+/gi;

    var browser = navigator.appName
    var b_version = navigator.appVersion
    var version = parseFloat(b_version)



    if (agent.indexOf("msie") > 0 || ((browser == "Netscape" || browser == "Microsoft Internet Explorer") && version >= 4))//识别出IE浏览器,
    {

        if ((version >= 4)) {
            return true;
        }
        else { return false; }

    } else
        if (agent.indexOf("firefox") > 0)//识别出firefox浏览器
        {
            return true;

        } else {
            if (agent.indexOf("chrome") > 0)//识别出chrome浏览器
            {
                return true;

            } else {
                if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)//识别出Safari浏览器
                {
                    return true;

                } else {
                    return false;

                }
            }
        }
    return false;
}


/*!
* jquery.scrollLoading.js
* by zhangxinxu http://www.zhangxinxu.com/wordpress/?p=1259
* 2010-11-19 v1.0
* 2012-01-13 v1.1 偏移值计算修改 position → offset
* 2012-09-25 v1.2 增加滚动容器参数, 回调参数
* 2014-08-11 v1.3 修复设置滚动容器参数一些bug, 以及误删posb值的一些低级错误
*/
(function ($) {
    $.fn.scrollLoading = function (options) {
        var defaults = {
            attr: "data-url",
            container: $(window),
            callback: $.noop
        };
        var params = $.extend({}, defaults, options || {});
        params.cache = [];
        $(this).each(function () {
            var node = this.nodeName.toLowerCase(), url = $(this).attr(params["attr"]);
            //重组
            var data = {
                obj: $(this),
                tag: node,
                url: url
            };
            params.cache.push(data);
        });

        var callback = function (call) {
            if ($.isFunction(params.callback)) {
                params.callback.call(call.get(0));
            }
        };
        //动态显示数据
        var loading = function () {

            var contHeight = params.container.height();
            if (params.container.get(0) === window) {
                contop = $(window).scrollTop();
            } else {
                contop = params.container.offset().top;
            }

            $.each(params.cache, function (i, data) {
                var o = data.obj, tag = data.tag, url = data.url, post, posb;

                if (o) {
                    post = o.offset().top - contop, posb = post + o.height();
                    if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                        if (url) {
                            //在浏览器窗口内
                            if (tag === "img") {
                                //图片，改变src
                                callback(o.attr("src", url));
                            } else {
                                o.load(url, {}, function () {
                                    callback(o);
                                });
                            }
                        } else {
                            // 无地址，直接触发回调
                            callback(o);
                        }
                        data.obj = null;
                    }
                }
            });
        };

        //事件触发
        //加载完毕即执行
        loading();
        //滚动执行
        params.container.bind("scroll", loading);
    };
})(jQuery);