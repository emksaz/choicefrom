/*
动态加载分享内容
*/
var jiathis_config = {};
function setShare(title, url, pic, summary) {
    jiathis_config.title = title;
    jiathis_config.url = url;
    jiathis_config.pic = pic;
    jiathis_config.summary = summary;
    jiathis_config.evt = { "share": "changeWeiXinStyle" }
}

/*
让字符串分三行显示
*/
function SubStringThree(strObj) {
    if (strObj.length > 20) {
        return strObj.substring(0, 20) + "...";
    }
    else {
        return strObj;
    }
}
//js如何判断输入是否为正整数、浮点数等数字的函数
//1.下面列出了一些判读数值类型的正则表达式   
//var re=/^\d+(\.\d{0,2})?$/g; //判断小数位数为两位
//"^\\d+$"　　//非负整数（正整数   +   0）     
//   "^[0-9]*[1-9][0-9]*$"　　//正整数     
//   "^((-\\d+)|(0+))$"　　//非正整数（负整数   +   0）     
//   "^-[0-9]*[1-9][0-9]*$"　　//负整数     
//   "^-?\\d+$"　　　　//整数     
//   "^\\d+(\\.\\d+)?$"　　//非负浮点数（正浮点数   +   0）     
//   "^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$"　　//正浮点数     
//   "^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$"　　//非正浮点数（负浮点数   +   0）     
//   "^(-(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)))$"　　//负浮点数     
//   "^(-?\\d+)(\\.\\d+)?$"　　//浮点数
function isDigit(s) {
    var re = /^[0-9]+.?[0-9]*$/;   //判断字符串是否为数字      
    if (!re.test(s)) {

        return false;
    }
    return true;

}

function isInteger(s) {
    var re = /^[1-9]+[0-9]*]*$/;       //判断正整数 /^[1-9]+[0-9]*]*$/   
    if (!re.test(s)) {

        return false;
    }
    return true;

}


function CheckInteger(s) {
    var re = /^[-]?\d+$/;      //整数^[-]?\d+$/
    if (!re.test(s)) {

        return false;
    }
    return true;

}

function ErrAlert(e, content) {
    var result = e.responseText; /* ajax返回的内容*/
    if (result.indexOf('登录') > -1 || result.indexOf('SignIn') > -1) {
        window.open('/home/SignIn', '_top');
    } else {
        alert(content);

    }
}
///关闭弹层
function CloseDiv() {
    $("body").removeClass("srcollHide");
    $("#PopupsBg").remove();
}

//超时登录
function loginAgain() {
    //e.stopPropagation();
    $("#LoginBtn").text('请稍等……');
    $.ajax({
        type: "POST",
        url: "/Home/ValidateUser",
        data: {
            email: tmptestemailvalue,
            password: tmptestpasswordvalue,
            isCheck: 2,
        },
        dataType: "json",
        error: function (e)//出错处理
        {
            $("#LoginBtn").text('登录');
            ErrAlert(e, "获取列表失败!");
        },
        success: function (data) {
            if (!data.Islogin) {
                $("#LoginBtn").text('登录');
                alert(data.Message, "red");
            }
            else {//登入成功
                //关闭弹层
                CloseDiv();
                if (RestLogin.isTurnTo || RestLoginForDesign.isTurnTo) {
                    //window.location.href = "/Home/DashBoard";
                    window.location.reload();
                }
                else {
                    scopeObj.Init();//重新加载页面
                }
            }
        }
    });
}

///设置点击背景不关闭弹层
function ShowPopup(evt) {
    evt.stopPropagation();
}
//enter键登录
function Enter() {
    if (window.event.keyCode == 13) {
        loginAgain();
    }
}
var tmptestemailvalue = "";
var tmptestpasswordvalue = "";
var scopeObj;//scope对象
RestLogin.isTurnTo = false;
function RestLogin(data, scope) {
    if (scope == null) {
        RestLogin.isTurnTo = true;
    }
    scopeObj = scope;
    if (typeof (data) != "string") {
        return;
    }
    var strHtml = "";
    if (data.indexOf('登录超时。') > -1 || data.indexOf('运行时错误') > -1 || data.indexOf('SignIn') > -1) {
        if ($("#PopupsBg").html()) {
            return;
        }
        strHtml += "<div class=\"pop-ups-background\" style=\"z-index:9000\" id='PopupsBg'>";
        strHtml += "    <div class=\"pop-ups\" id=\"login_again\">";
        strHtml += "        <div>";
        strHtml += "            <i class=\"ic ic-user-f\"></i>";
        strHtml += "            <span>重新登录</span>";
        //strHtml += "            <a class=\"box-button\" onclick='CloseDiv()' style='display:none'><i class=\"ic ic-x-d\"></i></a>";
        strHtml += "        </div>";
        strHtml += "        <form autocomplete='off'>";
        strHtml += "            <h3><mark class=\"form-message\">登录超时,请重新登录!</mark></h3>";
        strHtml += "            <input type=\"text\" name=\"LoginAgainEmail\" id ='LoginAgainEmail' placeholder=\"注册邮箱\" onchange= \"GetInputValue(this,'1')\" onkeyup='Enter()' maxlength='50' style='margin-bottom: 20px;'>";
        strHtml += "            <input type=\"password\" style=\"display:none\" />";
        strHtml += "            <input type=\"password\" name=\"LoginAgainPassword\" id='LoginAgainPassword' placeholder=\"密码\" onchange= \"GetInputValue(this,'2')\" onkeyup='Enter()' maxlength = '12'>";
        //strHtml += "            <button type = 'button' class=\"border\" onclick='CloseDiv()' style='display:none'>";
        //strHtml += "                <span>取 消</span>";
        //strHtml += "            </button>";
        strHtml += "            <button class=\"green\" type = 'button' onclick=\"loginAgain()\">";
        strHtml += "                <span id=\"LoginBtn\">重新登录</span>";
        strHtml += "            </button>";
        strHtml += "        </form>";
        strHtml += "    </div>";
        strHtml += "</div>";
        $("body").append(strHtml);
        $("body").addClass("srcollHide");
        tmptestemailvalue = "";
        tmptestpasswordvalue = "";
        // window.open('/home/SignIn', '_top');
    }
}
function GetInputValue(obj, type) {
    if (type == "1") {
        tmptestemailvalue = obj.value;
    }
    if (type == "2") {
        tmptestpasswordvalue = obj.value;
    }
}
// 设计端的超时登录弹框
RestLoginForDesign.isTurnTo = false;
function RestLoginForDesign(data, scope) {
    if (scope == null) {
        RestLoginForDesign.isTurnTo = true;
    }
    scopeObj = scope;
    var strHtml = "";
    var errorMessage = "";//错误信息
    if (data.responseText || data) {
        errorMessage = data.responseText || data;
    } else {
        return;
    }
    if (errorMessage.indexOf('登录超时。') > -1 || errorMessage.indexOf('运行时错误') > -1 || errorMessage.indexOf('SignIn') > -1) {
        if ($("#PopupsBg").html()) {
            return;
        }
        strHtml += "<div class=\"popup-background\" style=\"z-index: 1000;\" ng-show=\"1==1\"  id='PopupsBg'>";
        strHtml += "<div class=\"center\">";
        strHtml += "    <div class=\"popup-windows absolute-center folder\" ng-show=\"1==1\" id=\"login_again\">";
        strHtml += "        <div class=\"w-clearfix popup-header\">";
        strHtml += "           <div class=\"ic ic-user-f float-left margin-right-5px\"></div>";
        strHtml += "           <h5 class=\"popup-title\" id=\"myModalLabel\">重新登录</h5>";
        strHtml += "      </div>";
        strHtml += "        <form autocomplete='off'>";
        strHtml += "            <h3><mark class=\"form-message\">登录超时,请重新登录!</mark></h3>";
        strHtml += "            <input type=\"password\" style=\"display:none\" />";
        strHtml += "            <input type=\"text\" name=\"LoginAgainEmail\" id ='LoginAgainEmail' placeholder=\"注册邮箱\" onchange= \"GetInputValue(this,'1')\" onkeyup='Enter()' maxlength='50' style='margin-bottom: 20px;'>";
        strHtml += "            <input type=\"password\" name=\"LoginAgainPassword\" id='LoginAgainPassword' placeholder=\"密码\" onchange= \"GetInputValue(this,'2')\" onkeyup='Enter()' maxlength = '12'>";
        strHtml += "            <button class=\"green\" type = 'button' onclick=\"loginAgain()\">";
        strHtml += "                <span id=\"LoginBtn\">重新登录</span>";
        strHtml += "            </button>";
        strHtml += "        </form>";
        strHtml += "   </div>";
        strHtml += " </div>";
        strHtml += "</div>";
        strHtml += " </div>";
        $("body").append(strHtml);
        $("body").addClass("srcollHide");
        tmptestemailvalue = "";
        tmptestpasswordvalue = "";
        // window.open('/home/SignIn', '_top');
        a = b + c;
    }

    //if (data.responseText) {
    //    if (data.responseText.indexOf('登录超时。') > -1 || data.responseText.indexOf('运行时错误') > -1 || data.responseText.indexOf('SignIn') > -1) {
    //        window.open('/home/SignIn', '_top');
    //    }
    //}

}
//检查后台session的方法
function checkSessionLost() {
    $.ajax({
        type: "post",
        url: "/Home/CheckSessionLost",
        data: {},
        dataType: "json",
        error: function (e) {

        },
        success: function (data) {
            if (data.IsSessionLost) {
                if (window.location.href.indexOf('/QD/QuestionnairDesign') >= 0) {//设计端
                    RestLoginForDesign(data.Message, null);
                } else {
                    RestLogin(data.Message, null);
                }
                clearInterval(sessionInterval);
            }
        }
    })
}
var sessionInterval;
//定时检查session是否过期
$(function () {
    sessionInterval = setInterval(checkSessionLost, 3600000);
})
function isZip(s) {
    var re = /^[0-9]{6}$/;  //邮编验证
    if (!re.test(s)) {
        alert("请输入正确的邮编！");
        return false;
    }
    return true;
}
function isPhone(s) {
    var re = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/; //电话号码的函数(包括验证国内区号,国际区号,分机号)
    if (!re.test(s)) {
        alert("请输入正确的电话号码！");
        return false;
    }
    return true;
}
function isCord(s) {
    var re = /\d{18}|\d{15} /; //身份证
    if (!re.test(s)) {
        alert("请输入正确的身份证码！");
        return false;
    }
    return true;
}
///手机号码验证，验证13系列和150-159(154除外)、180、185、186、187、188、189几种号码，长度11位 
function isMobel(value) {
    var str = value;

    if (str.length != 11) {
        alert('手机号码位数不正确！');

        return false;
    }

    var myreg = /^(((13[0-9]{1})|15[0-9]{1}|18[0-9]{1}|)+\d{8})$/;
    if (!myreg.test(str)) {
        alert('手机号码格式不正确！');
        return false;
    }
    return true;


}
function checkemail(emails) {
    //对电子邮件的验证
    var myreg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (emails == "") {
        alert("请输入邮箱地址！");
        return false;
    }
    else {
        if (!myreg.test(emails)) {
            alert('提示\n\n请输入有效的E_mail！');
            return false;
        }
    }
    return true;
}

///字符串截字
function notifyTextLength(obj, num) {

    var inputNum = obj.value.replace(/[^\x00-\xff]/g, "**").length; //得到输入的字节数

    if (inputNum > num) {
        obj.value = autoAddEllipsis(obj.value, num);
    }

}


/* 
 * 处理过长的字符串，截取并添加省略号 
 * 注：半角长度为1，全角长度为2 
 *  
 * pStr:字符串 
 * pLen:截取长度 
 *  
 * return: 截取后的字符串 
 */
function autoAddEllipsis(pStr, pLen) {

    var _ret = cutString(pStr, pLen);
    var _cutFlag = _ret.cutflag;
    var _cutStringn = _ret.cutstring;

    if ("1" == _cutFlag) {
        return _cutStringn;
    } else {
        return _cutStringn;
    }
}

/* 
 * 取得指定长度的字符串 
 * 注：半角长度为1，全角长度为2 
 *  
 * pStr:字符串 
 * pLen:截取长度 
 *  
 * return: 截取后的字符串 
 */
function cutString(pStr, pLen) {

    // 原字符串长度  
    var _strLen = pStr.length;

    var _tmpCode;

    var _cutString;

    // 默认情况下，返回的字符串是原字符串的一部分  
    var _cutFlag = "1";

    var _lenCount = 0;

    var _ret = false;

    if (_strLen <= pLen / 2) {
        _cutString = pStr;
        _ret = true;
    }

    if (!_ret) {
        for (var i = 0; i < _strLen ; i++) {
            if (isFull(pStr.charAt(i))) {
                _lenCount += 2;
            } else {
                _lenCount += 1;
            }

            if (_lenCount > pLen) {
                _cutString = pStr.substring(0, i);
                _ret = true;
                break;
            } else if (_lenCount == pLen) {
                _cutString = pStr.substring(0, i + 1);
                _ret = true;
                break;
            }
        }
    }

    if (!_ret) {
        _cutString = pStr;
        _ret = true;
    }

    if (_cutString.length == _strLen) {
        _cutFlag = "0";
    }

    return { "cutstring": _cutString, "cutflag": _cutFlag };
}

/* 
 * 判断是否为全角 
 *  
 * pChar:长度为1的字符串 
 * return: true:全角 
 *          false:半角 
 */
function isFull(pChar) {
    if ((pChar.charCodeAt(0) > 128)) {
        return true;
    } else {
        return false;
    }
}

function daysBetween(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return Math.abs(cha);
}
function StringToDate(DateStr) {

    var converted = Date.parse(DateStr);
    var myDate = new Date(converted);
    if (isNaN(myDate)) {
        //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';  
        var arys = DateStr.split('-');
        myDate = new Date(arys[0], --arys[1], arys[2]);
    }
    return myDate;
}
function ChangeDateToString(DateIn) {
    var Year = 0;
    var Month = 0;
    var Day = 0;

    var CurrentDate = "";

    //初始化时间
    Year = DateIn.getFullYear();
    Month = DateIn.getMonth() + 1;
    Day = DateIn.getDate();


    CurrentDate = Year + "-";
    if (Month >= 10) {
        CurrentDate = CurrentDate + Month + "-";
    }
    else {
        CurrentDate = CurrentDate + "0" + Month + "-";
    }
    if (Day >= 10) {
        CurrentDate = CurrentDate + Day;
    }
    else {
        CurrentDate = CurrentDate + "0" + Day;
    }


    return CurrentDate;
}

///返回到顶
function GoHtmlTop() {

    document.documentElement.scrollTop = document.body.scrollTop = 0;
}