var isCheck = 1;//30天内记住复选框控制
$(function () {
    //type =1 登录   type = 2 注册
    var type = $("#Type").val();

    localStorage.MyFolder = 0;
    localStorage.OtherFolder = 0;

    if (type == '1') {
        $("#Register").hide();
        $("#Login").show();
    }
    if (type == '2') {
        $("#Register").show();
        $("#Login").hide();
        $("#REmail").val("");
        $("#RName").val("");
        $("#RPassWord").val("");
        $("#RInviteCode").val("");
    }

    //根据cookie是否存在显示复选框是否勾选
    if (document.cookie.indexOf("EmailCookie") == -1) {
        $("#checkboxG1").removeAttr("checked");
        isCheck = 0;
    }
    else {
        $("#checkboxG1").attr("checked", "checked");
        isCheck = 1;
    }
    
})
var zyApp = angular.module("myapp", ["ui.router"]);

//登录
zyApp.controller("LoginCtrl", ["$scope", "$stateParams", "$http", "$location",
function ($scope, $stateParams, $http, $location) {
    $scope.Email = $("#name").val();
    function animateAlert(msg, color) {
        var selfFn = arguments.callee;
        if (selfFn.doing) {
            return;
        }
        alert(msg, color);
        selfFn.doing = true;
        setTimeout(function () {
            selfFn.doing = false;
        }, 3000);
    }
    $scope.loginSubmitFlag = false;
    ////邮箱验证
    //$scope.emailCheck = function (isValid, isdirty, strValue) {
    //    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    //    if (!isValid || !isdirty || !re.test(strValue)) {
    //        $scope.loginSubmitFlag = false;
    //        $scope.emailCheckFlag = true;
    //    } else {
    //        $scope.loginSubmitFlag = true;
    //        $scope.emailCheckFlag = false;
    //    }

    //}
    //输入框变化事件
    $scope.loginInputChange = function (isValid, isdirty) {
        
        if (!isValid || !isdirty) {
            $scope.loginSubmitFlag = false;
        } else {
            $scope.loginSubmitFlag = true;
        }
    }
    //登录
    $scope.login = function () {
        $scope.ValiaCodeFlag = true;
        $scope.EmailFlag = true;
        if ($("#name").val().length == 0 || $("#password").val().length == 0) {
            $scope.loginSubmitFlag = false;//按钮可用与否
        }

        if ($scope.loginSubmitFlag) {
            $("#Submit_Button").text('请稍等……');
            loadingStart();
            $http.post("/Home/ValidateUser", { email: $("#name").val(), password: $("#password").val(), isCheck: isCheck }).success(function (data) {
                if (!data.Islogin) {
                    $("#Submit_Button").text('登录');
                    animateAlert(data.Message, "red");
                }
                else {
                    location.href = data.Url;
                }
                loadingEnd();
            }).error(function (data, status, headers, config) {
                $("#Submit_Button").text('登录');
                //处理错误   
                loadingEnd();
            });
        }
    }

    //enter键登录
    $scope.Enter=function() {
        if (window.event.keyCode == 13) {
            $scope.login();
        }
    }

}]);
//转到官网首页
function turnToIndex() {
    window.location.href = "/Home/index";
}

//复选框设置
function changeCheck() {
    if (isCheck == 0) {
        isCheck = 1;
    }
    else {
        isCheck = 0;
    }
}
//注册跳转登入
function ChangeToLogin() {
    $("#Login").show();
    $("#Register").hide();
}

//登入跳转到注册
function ChangeToRegister() {
    $("#Register").show();
    $("#Login").hide();
    $("#REmail").val("");
    $("#RPassWord").val("");
    $("#RName").val("");
    $("#RInviteCode").val("");
}
//登入跳转到忘记密码
function ChangeToForget() {
    $("#ForgetPassword").show();
    $("#Login").hide();
    $("#ForgetEmail").val("");
    $("#ForgetValidCode").val("");
    $("#SendAgainDiv").hide();
}

    

function ForgetPW() {
    this.ValiaCodeFlag = true;//验证码是否正确,默认正确
    this.EmailFlag = true;//邮箱是否存在,默认存在
    this.SubmitFlag = false;
    this.SendTime = 60;
    this.IsSendAgainFlag = false;
}

//忘记密码
zyApp.controller("FindPWCtrl", ["$scope", "$stateParams", "$http", "$location",
function ($scope, $stateParams, $http, $location) {
    $scope.ForgetPW = new ForgetPW;
    $scope.ForgetPW.SubmitFlag = false;
    //刷新验证码
    $scope.reloadimg = function (id) {
        $("#" + id).attr("src", "/Home/GetCode?" + (new Date()));
    }
    //输入框变化事件
    $scope.findPwInfoChange = function (isValid, isdirty) {
        if (!isValid || !isdirty) {
            $scope.ForgetPW.SubmitFlag = false;
        } else {
            $scope.ForgetPW.SubmitFlag = true;
        }
        $scope.ForgetPW.ValiaCodeFlag = true;
        $scope.ForgetPW.EmailFlag = true;
    }
    //忘记密码
    $scope.findPassword = function () {
        $scope.ForgetPW.ValiaCodeFlag = true;
        $scope.ForgetPW.EmailFlag = true;
        if ($("#ForgetEmail").val().length == 0 || $("#ForgetValidCode").val().length == 0) {
            $scope.ForgetPW.SubmitFlag = false;//按钮可有与否
        }
        if ($scope.ForgetPW.SubmitFlag) {
            loadingStart();
            $http.post("/UM/ForgetPassword", { email: $scope.ForgetPW.Email, validCode: $scope.ForgetPW.VaildCode }).success(function (data) {

                if (data.indexOf("验证码不正确。") >= 0) {
                    $scope.ForgetPW.ValiaCodeFlag = false;
                    $scope.ForgetPW.IsSendAgainFlag = false;
                    $scope.InputFieldArea = true;
                }
                else if (data.indexOf("用户名不存在。") >= 0) {
                    $scope.ForgetPW.EmailFlag = false;
                    $scope.ForgetPW.IsSendAgainFlag = false;
                }
                else {
                    $("#SendAgainDiv").show();
                    $scope.ForgetPW.IsSendAgainFlag = true;
                    $("#GmailSite").text($scope.ForgetPW.Email);
                    //$("#find_password").hide();
                }
                loadingEnd();
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
            });
        }
    }
    //enter操作
    $scope.enterOper = function () {
        if (window.event.keyCode == 13) {
            $scope.findPassword();
        }
    }
    //重新发送
    $scope.sendAgain = function (val) {
        if ($scope.ForgetPW.SendTime == 0) {
            $(val).removeAttr("disabled");
            $(val).text("重新发送");
            $scope.ForgetPW.SendTime = 60;
        } else {
            if ($scope.ForgetPW.SendTime == 60) {
                loadingStart();
                $http.post("/UM/SendEmailAgain", { email: $scope.ForgetPW.Email }).success(function (data) {
                    if (data!="") {
                        alert(data, "red");
                    }
                    loadingEnd();
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingEnd();
                });
            }
            $(val).attr("disabled", true);
            $(val).text($scope.ForgetPW.SendTime + "秒后可以重新发送");
            $scope.ForgetPW.SendTime--;
            setTimeout(function () {
                $scope.sendAgain(val)
            },
            1000)
        }
    }
    //转到登录页
    $scope.forgetToLogin = function() {
        $("#ForgetPassword").hide();
        $("#Login").show();
        $("#name").val("");
        $("#password").val("");
    }
}]);


//注册
zyApp.controller("RegisterCtrl", ["$scope", "$stateParams", "$http", "$location",
function ($scope, $stateParams, $http, $location) {

    $scope.enter = function () {
        if (window.event.keyCode == 13) {
            this.Register();
        }
    };
    //注册
    $scope.Register = function () {
        if ($("#REmail").val().length == 0) {
            $scope.RegisterBtnFlag = false;//按钮可有与否
        }
        else {
            $scope.RegisterBtnFlag = true;//按钮可有与否
        }
        if ($("#RPassWord").val().length == 0) {
            $scope.RegisterBtnFlag = false;//按钮可有与否
        }
        else {
            $scope.RegisterBtnFlag = true;//按钮可有与否
        }
        if ($("#RInviteCode").val().length == 0) {
            $scope.RegisterBtnFlag = false;//按钮可有与否
        }
        else {
            $scope.RegisterBtnFlag = true;//按钮可有与否
        }
        if ($scope.RegisterBtnFlag) {
            loadingStart();
            $("#RegisterBtn").text("请稍后...");
            $http.post("/Home/RegisteredUser", { email: $scope.Reg.Email, name: $scope.Reg.Name, password: $scope.Reg.PassWord, inviteCode: $("#RInviteCode").val() }).success(function (data) {
                $("#RegisterBtn").text("注 册");
                //$scope.RegisterForm.$setPristine();
                if (data.IsCodeError) {
                    $scope.Reg.CheckInviteCodeFlag = true;
                }
                else if (data.Message == "注册成功！") {//注册成功跳转到dashboard
                    $http.post("/Home/ValidateUser", {
                        email: $("#REmail").val(),
                        password: $("#RPassWord").val(),
                        isCheck: 2,
                    }).success(function (data) {
                        location.href = data.Url;
                    }).error(function (data, status, headers, config) {
                        //处理错误   
                        loadingEnd();
                        RestLogin(data);
                    });
                }
                else {
                    alert(data.Message, "red");
                    $scope.Reg.CheckInviteCodeFlag = false;
                }
                loadingEnd();
            }).error(function (data, status, headers, config) {
                $("#RegisterBtn").text("注 册");
                //处理错误   
                loadingEnd();
                RestLogin(data);
            });
        }
    };
    //输入框变化事件
    $scope.registerInputChange = function (isValid, isdirty) {
        if (!isValid || !isdirty) {
            $scope.RegisterBtnFlag = false;
        } else {
            $scope.RegisterBtnFlag = true;
        }
        $scope.Reg.CheckInviteCodeFlag = false;
    };

    $scope.ChangeToLogin = function () {
        $("#Login").show();
        $("#Register").hide();
    };

}]);

function SetPw() {
    this.IsSameFlag = false;//两次输入的密码是否一致，默认不一致
    this.SetSubmitFlag = false;// 设置密码按钮可用与否

}

//设置密码
zyApp.controller("SetPwCtrl", ["$scope", "$stateParams", "$http", "$location",
function ($scope, $stateParams, $http, $location) {
    $scope.SetPw = new SetPw;
    //$scope.init = function () {
    //    $http.post("/UM/ValidateResetCode", { email: $("#Email").val(), resetcode: $("#RandomCode").val()}).success(function (data) {
    //        if (data.Flag) {
    //            window.location.href = "/Error/Error?type=forgetpw";
    //        }
    //    }).error(function (data, status, headers, config) {
    //    });
    //}
    //$scope.init();
    $scope.setPassword = function () {
        if ($scope.SetPw.SetSubmitFlag) {
            loadingStart();
            $http.post("/UM/SetPassword", { email: $("#Email").val(), password: $scope.SetPw.Password }).success(function (data) {
                $scope.SetPw.Password = "";
                $scope.SetPw.ConfirmPassword = "";
                $scope.SetPwForm.$setPristine();
                if (data.Message != "") {
                    alert(data.Message,"green");//成功修改密码
                    setTimeout(function () {
                        window.location.href = "/Home/SignIn"
                    },2500)
                }
                loadingEnd();
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
            });
        }
       
    }

    //验证密码的一致性
    $scope.ValidPwdConsistency = function (isValid, isdirty) {
        if (!isValid || !isdirty) {
            $scope.SetPw.SetSubmitFlag = false;
        } else {
            if ($scope.SetPw.Password != $scope.SetPw.ConfirmPassword) {
                $scope.SetPw.SomeFlag = true;//输入不一致的错误提示
                $scope.SetPw.SetSubmitFlag = false;
            } else {
                $scope.SetPw.SomeFlag = false;//输入不一致的错误提示
                $scope.SetPw.SetSubmitFlag = true;
            }
        }
    }
}]);