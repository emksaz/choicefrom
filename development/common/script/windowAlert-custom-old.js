(function ($) {
    var a;
    $.extend({
        myModalCallBack: function () { },
        closemyModal: function () { },
        initDataConfirm: function (msg, callback, callbackCancle, RightBtn, title, leftBtn) {
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
            tmp += "<div class=\"popup-background\" style=\"z-index: 1000;\" id=\"myModal\" ng-show=\"1==1\">";
            tmp += "<div class=\"center\">";
            tmp += "    <div class=\"popup-windows absolute-center folder\" ng-show=\"1==1\">";
            tmp += "        <div class=\"w-clearfix popup-header\">";
            tmp += "           <div class=\"icon float-left margin-right-5px ic-add-folder-d\"></div>";
            tmp += "           <h5 class=\"popup-title\" id=\"myModalLabel\">" + titleText + "</h5>";
            tmp += "          <a class=\"w-inline-block cancel-button\" onclick=\"$.closemyModal()\">";
            tmp += "              <div class=\"icon ic-cancel hover-tager\"></div>";
            tmp += "          </a>";
            tmp += "      </div>";
            tmp += "      <div class=\"popup-content\">";
            tmp += "        <div class=\"w-form\">";
            tmp += "             <div class=\"form-title-text\">";
            tmp += "               <h5 class=\"modal-body\">" + msg + "</h5>";
            tmp += "           </div>";
            tmp += "        </div>";
            tmp += "      <div class=\"w-clearfix popup-control\">";
            tmp += "          <a class=\"w-inline-block button continue sea-green radius-3px\" onclick=\"$.myModalCallBack()\"><h5>" + RightBtnText + "</h5></a>";
            tmp += " <a class=\"w-inline-block button cancel border\" id=\"btnCancle\"><h5>" + leftBtnText + "</h5></a>";
            tmp += "      </div>";
            tmp += "   </div>";
            tmp += " </div>";
            tmp += "</div>";
            tmp += " </div>";
            return tmp;
        },
        CloseWin: function () { },
        initDataAlert: function (title, msg, BodyCssFlag) {
            $.CloseWin = function () {
                if (!BodyCssFlag) {
                    $("body").removeClass("srcollHide");
                }
                $("#myModalAlert").remove();
            }
            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 27) { // 按 Esc 
                    $.CloseWin();
                }
                if (e && e.keyCode == 13) { // enter 键
                    $.CloseWin();
                }
            };
            var tmp = "";

            tmp += "<div class=\"popup-background\" style=\"z-index: 1000;\" ng-show=\"1==1\" id=\"myModalAlert\">";
            tmp += "<div class=\"center\">";
            tmp += "    <div class=\"popup-windows absolute-center folder\" ng-show=\"1==1\">";
            tmp += "        <div class=\"w-clearfix popup-header\">";
            tmp += "           <div class=\"icon float-left margin-right-5px ic-add-folder-d\"></div>";
            tmp += "           <h5 class=\"popup-title\" id=\"myModalLabel\">" + title + "</h5>";
            tmp += "          <a class=\"w-inline-block cancel-button\" onclick=\"$.CloseWin()\">";
            tmp += "              <div class=\"icon ic-cancel hover-tager\"></div>";
            tmp += "          </a>";
            tmp += "      </div>";
            tmp += "      <div class=\"popup-content\">";
            tmp += "        <div class=\"w-form\">";
            tmp += "             <div class=\"form-title-text\">";
            tmp += "               <h5 class=\"modal-body\">" + msg + "</h5>";
            tmp += "           </div>";
            tmp += "        </div>";
            tmp += "      <div class=\"w-clearfix popup-control\">";
            tmp += "          <a class=\"w-inline-block button continue sea-green radius-3px\" onclick=\"$.CloseWin()\"><h5>确  认</h5></a>";
            tmp += "      </div>";
            tmp += "   </div>";
            tmp += " </div>";
            tmp += "</div>";
            tmp += " </div>";
            return tmp;
        }
    });
    /*
    *弹框
    */
    $.fn.cAlert = $.fn.calert = function (title, msg) {
        if (msg.indexOf('登录超时。') > -1)//session过期处理
        {
            window.location.href = "/Home/SignIn";
        }
        else {
            if ($("#myModalAlert").length == 0) {
                var BodyCssFlag = false;
                if ($("body").css("overflow") == "hidden") {
                    BodyCssFlag = true;
                }
                $("body").append($.initDataAlert(title, msg, BodyCssFlag));
            }
            else {
                $("#myModalAlert #myModalLabel").html(title);
                $("#myModalAlert .modal-body").html(msg);
            }
            $("body").addClass("srcollHide");
        }

    }
    /**
    ** 验证框
    **/
    $.fn.cconfirm = $.fn.cConfirm = function (msg, callback, callbackCancle, RightBtn, title, leftBtn) {
        if (msg.indexOf('登录超时。') > -1)//session过期处理
        {
            window.location.href = "/Home/SignIn";
        }
        else {
            if ($("#myModal").length == 0) {
                $("body").append($.initDataConfirm(msg, callback, callbackCancle, RightBtn, title, leftBtn));
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
        window.alert = function (msg) {
            $.fn.cAlert("提示", msg);
        }
        window.confirm = function (msg, callback, callbackCancle, RightBtn, title, leftBtn) {
            $.fn.cConfirm(msg, callback, callbackCancle, RightBtn, title, leftBtn);
        }

    });
})(jQuery);