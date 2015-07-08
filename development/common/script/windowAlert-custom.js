(function ($) {
    var a;
    $.extend({
        myModalCallBack: function () { },
        closemyModal: function () { },
        initDataConfirm: function (msg, callback, callbackCancle, RightBtn, title, leftBtn, RightBtnColor, leftBtnColor) {
            $.myModalCallBack = function () {
                if (callback) {
                    callback();
                }
                $("body").removeClass("srcollHide");
                $("#myModal").remove();
            }
            $.closemyModal = function () {
                $("body").removeClass("srcollHide");
                $("#myModal").remove();
            }
            var RightBtnText = "确 定";
            if (RightBtn) {
                RightBtnText = RightBtn;
            }
            var titleText = "提 示";
            if (title) {
                titleText = title;
            }
            var leftBtnText = "取 消";
            if (leftBtn) {
                leftBtnText = leftBtn;
            }
            var RightBtnColorClass = "green";
            if (RightBtnColor) {
                RightBtnColorClass = RightBtnColor;
            }
            var leftBtnColorClass = "border";
            if (leftBtnColor) {
                leftBtnColorClass = leftBtnColor;
            }

            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 27) { // 按 Esc 
                    event.preventDefault();
                    if (callbackCancle == undefined) {
                        callbackCancle = function () { };
                    }
                    if (callbackCancle) {
                        callbackCancle();
                    }
                    $("body").removeClass("srcollHide");
                    $("#myModal").remove();
                }
                if (e && e.keyCode == 13) { // enter 键
                    $.myModalCallBack();
                }
            };
            var tmp = "";
            tmp += "<div class='pop-ups-background'  style=\"z-index: 9000;\" id=\"myModal\">";
            tmp += "    <div class='pop-ups'>";
            tmp += "        <div>";
            tmp += "           <i class='ic ic-add-folder-d'></i>";
            tmp += "           <span id=\"myModalLabel\">" + titleText + "</span>";
            tmp += "           <a class=\"box-button\" onclick=\"$.closemyModal()\"><i class=\"ic ic-x-d\"></i></a>";
            tmp += "        </div>";
            tmp += "        <form>";
            tmp += "            <h3>" + msg + "</h3>";
            tmp += "            <br>";
            tmp += "        <button class=\"" + leftBtnColorClass + "\" type=\"button\" id=\"btnCancle\">";
            tmp += "            <span>" + leftBtnText + "</span>";
            tmp += "        </button>";
            tmp += "        <button class=\"" + RightBtnColorClass + "\" type=\"button\"  onclick=\"$.myModalCallBack()\"	>";
            tmp += "            <span>" + RightBtnText + "</span>";
            tmp += "        </button>";
            tmp += "        </form>";
            tmp += "    </div>";
            tmp += " </div>";
            return tmp;
        },
        CloseWin: function () { },
        initDataAlert: function (title, msg, bgColorFlag) {
            $.CloseWin = function () {

            }
            //先清空
            $("#pp_sc").remove();

            var bgColorClass = "green";
            if (bgColorFlag) {
                bgColorClass = bgColorFlag;
            }

            var tmp = "";
            tmp += "<div class='top-slide " + bgColorClass + " tip_fix_top' id='pp_sc' style='display:block;top:-44px'>";
            tmp += "  <i class='ic ic-info-w'></i>";
            tmp += "  <span id ='msgSpan'>" + msg + "</span>";
            tmp += "</div>";

            return tmp;
        }
    });
    /*
    *弹框
    */
    $.fn.cAlert = $.fn.calert = function (title, msg, bgColorFlag) {
        if (msg.indexOf('登录超时。') > -1)//session过期处理
        {
            window.location.href = "/Home/SignIn";
        }
        else {
            $("body").append($.initDataAlert(title, msg, bgColorFlag));
            if (msg.indexOf("目前只支持IE，请复制地址栏URL,推荐给你的QQ/MSN好友！") >= 0 || msg.indexOf("复制成功,请粘贴到你的QQ/MSN上推荐给你的好友！") >= 0) {
                bgColorFlag = "green";
            }
            if (!$("#pp_sc").hasClass(bgColorFlag)) {
                $("#pp_sc").removeClass("red");
                $("#pp_sc").removeClass("green");
                $("#pp_sc").addClass(bgColorFlag);
            }
            //$(".top-slide").css("background-color", bgColorFlag);
            $(".top-slide").addClass(bgColorFlag);
            $("#msgSpan").text(msg);
            //$('#pp_sc').slideDown();
            //setTimeout("$('#pp_sc').slideUp(); ", 3000);//延时5秒 
            $('#pp_sc').animate({ top: "0px" });
            setTimeout("$('#pp_sc').animate({ top: '-55px'});", 3000);//延时3秒 
        }

    }
    /**
    ** 验证框
    **/
    $.fn.cconfirm = $.fn.cConfirm = function (msg, callback, callbackCancle, RightBtn, title, leftBtn, RightBtnColor, leftBtnColor) {
        if (msg.indexOf('登录超时。') > -1)//session过期处理
        {
            window.location.href = "/Home/SignIn";
        }
        else {
            if ($("#myModal").length == 0) {
                $("body").append($.initDataConfirm(msg, callback, callbackCancle, RightBtn, title, leftBtn, RightBtnColor, leftBtnColor));
            }
            else {
                if (title) {
                    $("#myModal #myModalLabel").html(title);
                } else {
                    $("#myModal #myModalLabel").html("提示");
                }
                $("#myModal .modal-body").html(msg);
            }
            //决断取消事件是否绑定
            if (callbackCancle == undefined) {
                callbackCancle = function () { };
            }
            if (callbackCancle) {
                $("#btnCancle").one("click", function () {
                    callbackCancle();
                    $("body").removeClass("srcollHide");
                    $("#myModal").remove();
                });
            }
            $("body").addClass("srcollHide");
        }

    }

    $(function () {
        window.alert = function (msg, bgColorFlag) {
            $.fn.cAlert("提示", msg, bgColorFlag);
        }
        window.confirm = function (msg, callback, callbackCancle, RightBtn, title, leftBtn, RightBtnColor, leftBtnColor) {
            $.fn.cConfirm(msg, callback, callbackCancle, RightBtn, title, leftBtn, RightBtnColor, leftBtnColor);
        }

    });
})(jQuery);