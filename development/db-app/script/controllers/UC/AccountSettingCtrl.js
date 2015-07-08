
//账户设置
function Usercenter() {
    this.UserSetAction = "";//tab选中样式
}
zyApp.controller("UsercenterCtrl", ["$scope", "$http", "$location", "UserInfo",
function ($scope, $http, $location, UserInfo) {
    $scope.Usercenter = Usercenter;
    $scope.UUserInfo = UUserInfo;
    $scope.Password = Password;


    //tab页选中样式控制
    var url = window.location.href;
    if (url.indexOf('/UC/User_info') >= 0) {
        $scope.Usercenter.UserSetAction = "User_info";
    }
    if (url.indexOf('/UC/Password') >= 0) {
        $scope.Usercenter.UserSetAction = "Password";
    }


    $scope.UserSetTabCss = function (pageName) {
        UserSetTabCssActive($scope, pageName);
    }


    //通用处理
    //tabArgs:tab页处理,btnArgs：（管理我的方案按钮处理）
    $scope.judgeUserSet = function (tabArgs, btnArgs) {
        if (UserInfo.InfoData.EditSateFlag) {//账户摘要未保存
            confirm(Prompt.SaveTheCurrentChanges, function () {
                if (tabArgs != "") {
                    SaveUserInfo($scope, $http, $location, UserInfo, tabArgs, "");
                }
            }, function () {
                UserInfo.InfoData.EditSateFlag = false;
                $scope.UUserInfo.UserInfoSubmitFlag = false;
                if (tabArgs != "") {
                    $scope.UserSetTabCss(tabArgs);
                    if (tabArgs == "User_info") {
                        $location.path('/UC/' + tabArgs + "/");
                    }
                    else {
                        $location.path('/UC/' + tabArgs);
                    }

                    $scope.$parent.$digest();
                }
            }, "是", "", "否")
        }
        else if (UserInfo.InfoData.EditPwdState) {//密码信息未保存
            confirm(Prompt.SaveTheCurrentChanges, function () {
                if (tabArgs != "") {
                    SavePwdInfo($scope, $http, $location, UserInfo, tabArgs, "");
                }
            }, function () {
                UserInfo.InfoData.EditPwdState = false;
                $scope.Password.pwdSubmitFlag = false;
                if (tabArgs != "") {
                    $scope.UserSetTabCss(tabArgs);
                    if (tabArgs == "User_info") {
                        $location.path('/UC/' + tabArgs + "/");
                    }
                    else {
                        $location.path('/UC/' + tabArgs);
                    }
                    $scope.$parent.$digest();
                }
            }, "是", "", "否")
        }
        else {//直接处理
            if (tabArgs != "") {
                $scope.UserSetTabCss(tabArgs);
                if (tabArgs == "User_info") {
                    $location.path('/UC/' + tabArgs + "/");
                }
                else {
                    $location.path('/UC/' + tabArgs);
                }
            }
        }
    }

    //Tab切换
    $scope.UserSetTab = function (pageName) {
        $scope.judgeUserSet(pageName, "");
    }


}
]);




//账户摘要
function UUserInfo() {
    this.UserInfoSubmitFlag = false;//用户摘要信息按钮保存状态
    this.accountName = "";//名称
    this.accountEmail = "";//邮箱
    this.CreateDate = "";//创建时间
    this.CreateSum = "";//创建问卷数
    this.PublishSum = "";//发布问卷数
    this.FileName = "";//文件名
    this.Portrait = "";//公司头像
    this.CompanyID = "";//公司ID
    this.QQQuickLoginPic = "";//QQ头像
    this.QQQuickNickName = "";//qq昵称
    this.SinaQuickLoginPic = "";//新浪头像
    this.SinaQuickNickName = "";//新浪昵称
}
zyApp.controller("User_infoCtrl", ["$scope", "$stateParams", "$http", "UserInfo", "$location", "UserPageText", "UserImageURL",
function ($scope, $stateParams, $http, UserInfo, $location, UserPageText, UserImageURL) {
    if ($stateParams.msg != "") {
        alert($stateParams.msg, "red")
    }
    $scope.IsDemo = $("#hiddendemotype").val();

    var radioProgressBar;
    //初始化上传头像进度条 
    $(function () {
        radioProgressBar = $('#RadioProgressBar').radialIndicator({
            initValue: 0,
            displayNumber: false
        }).data('radialIndicator');

    });

    //$scope.templetManaer = templetManaer;
    //$scope.templetManaer.topItemChange();

    $scope.UserImageURL = UserImageURL;
    if ($location.path().indexOf('/QM') == -1) {
        $("#Selectques").removeClass("nav-current");
    }
    $scope.UserPageText = UserPageText;//初始化页面文字
    $scope.UserPageText.InitPageText();

    $scope.UUserInfo = UUserInfo;
    //初始化页面数据
    $scope.InitUserData = function (loadingIsEnd) {

        if (loadingIsEnd != 0) {
            loadingStart();
        }

        $http.post('/UM/GetUserInfo', {}).success(function (data) {
            console.log(data);
            if (data.UserEmail != "") {
                $scope.UUserInfo.CompanyID = data.CompanyID;
                $scope.UUserInfo.accountName = data.Name;
                $scope.UUserInfo.accountEmail = data.UserEmail;
                $scope.UUserInfo.CreateDate = data.CreateDate;
                $scope.UUserInfo.CreateSum = data.CreateSum;
                $scope.UUserInfo.PublishSum = data.PublishSum;
                $scope.UUserInfo.Portrait = data.Portrait;
                $scope.UUserInfo.QQQuickLoginPic = data.QQQuickLoginPic;
                $scope.UUserInfo.SinaQuickLoginPic = data.SinaQuickLoginPic;
                $scope.UUserInfo.QQQuickNickName = data.QQQuickNickName;
                $scope.UUserInfo.SinaQuickNickName = data.SinaQuickNickName;
                $scope.UserImageURL.ImgUrl = data.Portrait;
                if (data.QQIsBindFlag) {
                    $("#QQBindBtn").attr("class", "red").text("解除绑定");
                }
                else {
                    $("#QQBindBtn").attr("class", "green").text("绑 定");
                }

                if (data.SinaIsBindFlag) {
                    $("#SinaBindBtn").attr("class", "red").text("解除绑定");
                }
                else {
                    $("#SinaBindBtn").attr("class", "green").text("绑 定");
                }
                ///上传文件
                $("#uploadDiv").InitUpload({
                    parentfolder: "\\UploadFiles\\Photo",
                    CompanyID: $scope.UUserInfo.CompanyID,
                    QuesID: "",
                    UType: "2",
                    iscrop: true,
                    LoadingName: "progressbar",
                    Scope: $scope,
                    Http: $http,
                    extFilters: [".jpg", ".png", ".jpeg", ".bmp"], /** 允许的文件扩展名, 默认: [] */
                    onQueueComplete: function (e) {
                        //进度条重置
                        radioProgressBar.value(0);

                        loadingStart();
                        ///上传后保存用户信息
                        $http.post('/UC/ModifyComPortrait', { filename: $scope.UUserInfo.FileName }).success(function (data) {
                            if (data.IsSuccess) {
                                $("#accountImg").css("background-image", "url(" + $scope.UUserInfo.Portrait + ")")
                                $scope.UserImageURL.ImgUrl = $scope.UUserInfo.Portrait;
                                alert(Prompt.SaveOK, "green");
                            }
                            loadingEnd();
                        }).error(function (data, status, headers, config) {
                            //处理错误   
                            loadingEnd();
                            RestLogin(data);
                        });
                    }
                })
            }
            if (loadingIsEnd != 0) {
                loadingEnd();
            }

        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data);
        });
    }
    $scope.InitUserData();

    //邮箱验证
    $scope.emailCheck = function (isValid, isdirty, strValue) {
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!isValid || !isdirty || !re.test(strValue)) {
            $scope.UUserInfo.UserInfoSubmitFlag = false;
            $scope.emailCheckFlag = true;
        } else {
            $scope.UUserInfo.UserInfoSubmitFlag = true;
            $scope.emailCheckFlag = false;
            UserInfo.InfoData.EditSateFlag = true;//服务：用户信息修改保存状态

            //服务：保存用户摘要方法的参数
            UserInfo.SaveUserInfoArgs.accountName = $scope.UUserInfo.accountName;
            UserInfo.SaveUserInfoArgs.accountEmail = $scope.UUserInfo.accountEmail;
        }

    }

    //输入框变化事件
    $scope.userInfoEditChange = function (isValid, isdirty) {
        if (!isValid || !isdirty) {
            $scope.UUserInfo.UserInfoSubmitFlag = false;
        } else {
            $scope.UUserInfo.UserInfoSubmitFlag = true;
            UserInfo.InfoData.EditSateFlag = true;//服务：用户信息修改保存状态

            //服务：保存用户摘要方法的参数
            UserInfo.SaveUserInfoArgs.accountName = $scope.UUserInfo.accountName;
            UserInfo.SaveUserInfoArgs.accountEmail = $scope.UUserInfo.accountEmail;
        }
    }

    $scope.turnToOuter = function (type) {
        if (type == 'QQ') {
            if ($("#QQBindBtn").text() == "绑 定") {
                window.open("http://openapi.qzone.qq.com/oauth/show?which=ConfirmPage&display=pc&client_id=101221559&response_type=token&scope=get_user_info&redirect_uri=http%3A%2F%2Fwww.csvfx.com%2FHome%2FQQLogin?type=1");
            }
            else {
                window.open("http://openapi.qzone.qq.com/oauth/show?which=ConfirmPage&display=pc&client_id=101221559&response_type=token&scope=get_user_info&redirect_uri=http%3A%2F%2Fwww.csvfx.com%2FHome%2FQQLogin?type=2");
            }
        }
        if (type == 'sina') {
            if ($("#SinaBindBtn").text() == "绑 定") {
                window.open("https://api.weibo.com/oauth2/authorize?client_id=3780257084&response_type=code&redirect_uri=http%3A%2F%2Fwww.csvfx.com%2FHome%2FSinaLogin?type=1");
            }
            else {
                window.open("https://api.weibo.com/oauth2/authorize?client_id=3780257084&response_type=code&redirect_uri=http%3A%2F%2Fwww.csvfx.com%2FHome%2FSinaLogin?type=2");
            }

        }
    }

    $scope.enter = function () {
        if (window.event.keyCode == 13) {
            this.SubmitUserInfo();
        }
    }
    //提交用户信息
    $scope.SubmitUserInfo = function () {
        if ($scope.UUserInfo.UserInfoSubmitFlag) {
            loadingStart();
            $http.post('/UM/ModifyUserInfo',
                { name: $scope.UUserInfo.accountName, email: $scope.UUserInfo.accountEmail })
                .success(function (data) {
                    if (data == "") {
                        alert(Prompt.SaveOK, "green");
                        $scope.UUserInfo.UserInfoSubmitFlag = false;//按钮保存状态
                        UserInfo.InfoData.EditSateFlag = false;//服务：用户信息修改保存状态
                        $scope.LoadingIsEnd = 0;
                        $scope.InitUserData($scope.LoadingIsEnd);
                        loadingEnd();
                    } else {
                        alert(data, "red");
                        $scope.UUserInfo.UserInfoSubmitFlag = true;//按钮保存状态
                        UserInfo.InfoData.EditSateFlag = true;//服务：用户信息修改保存状态
                        loadingEnd();
                    }
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingEnd();
                    RestLogin(data);
                });
        }
    }


}

]);




//密码设置
function Password() {
    this.pwdSubmitFlag = false;//密码提交按钮的可用性
    this.CurrentPwd = "";//当前密码
    this.NewPwd = "";//新密码
    this.verificationpassword = "";//再次输入密码
    this.SomeFlag = false;//输入不一致的错误提示
}
zyApp.controller("PasswordCtrl", ["$scope", "$http", "UserInfo", "UserPageText",
function ($scope, $http, UserInfo, UserPageText) {
    $scope.IsDemo = $("#hiddendemotype").val();
    $scope.UserPageText = UserPageText;
    $scope.Password = Password;
    $scope.Password.SomeFlag = false;


    $scope.Password.CurrentPwd = "";
    $scope.Password.NewPwd = "";
    $scope.Password.verificationpassword = "";
    $scope.UserPageText = UserPageText;//初始化页面文字
    $scope.UserPageText.InitPageText();
    //提交按钮的可用性
    $scope.pwdSubmitChange = function (isValid, isdirty) {
        if (!isValid || !isdirty) {
            $scope.Password.pwdSubmitFlag = false;
        } else {
            $scope.Password.pwdSubmitFlag = true;

            UserInfo.SavePwdArgs.CurrentPwd = $scope.Password.CurrentPwd;//服务：保存修改密码方法的参数
            UserInfo.InfoData.EditPwdState = true;//服务：密码信息保存状态
        }
    }
    //验证密码的一致性
    $scope.ValidPwdConsistency = function (isValid, isdirty) {
        if (!isValid || !isdirty) {
            $scope.Password.pwdSubmitFlag = false;
        } else {
            if ($scope.Password.NewPwd != $scope.Password.verificationpassword) {
                if ($scope.Password.NewPwd == "" || $scope.Password.verificationpassword == "") {
                    $scope.Password.SomeFlag = false;//输入不一致的错误提示
                }
                else {
                    $scope.Password.SomeFlag = true;//输入不一致的错误提示
                }

                $scope.Password.pwdSubmitFlag = false;
            } else {
                $scope.Password.SomeFlag = false;//输入不一致的错误提示
                $scope.Password.pwdSubmitFlag = true;
                UserInfo.SavePwdArgs.NewPwd = $scope.Password.NewPwd;//服务：保存修改密码方法的参数
                UserInfo.SavePwdArgs.CurrentPwd = $scope.Password.CurrentPwd;//服务：保存修改密码方法的参数
                UserInfo.InfoData.EditPwdState = true;//服务：密码信息保存状态
            }
        }
    }


    $scope.enter = function () {
        if (window.event.keyCode == 13) {
            this.pwsSetSubmit();
        }
    }
    //更改密码
    $scope.pwsSetSubmit = function () {
        if ($scope.Password.pwdSubmitFlag) {

            loadingStart();
            $http.post('/UM/PasswordSet', { oldPassword: $scope.Password.CurrentPwd, newpassword: $scope.Password.NewPwd }).success(function (data) {
                if (data == "") {
                    alert(Prompt.SaveOK, "green");
                    $scope.Password.pwdSubmitFlag = false;
                    UserInfo.InfoData.EditPwdState = false;//服务：密码信息保存状态
                    $scope.Password.CurrentPwd = "";
                    $scope.Password.NewPwd = "";
                    $scope.Password.verificationpassword = "";
                    $scope.PWDCurrentForm.$setPristine();
                    $scope.PWDNewForm.$setPristine();
                    $scope.PWDAgainForm.$setPristine();

                    loadingEnd();
                } else {
                    alert(data, "red");
                    UserInfo.InfoData.EditPwdState = true;//服务：密码信息保存状态
                    loadingEnd();
                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data);
            });
        }
    }
}
]);


//账户摘要tab页选中样式
function UserSetTabCssActive($scope, pageName) {
    $scope.Usercenter = Usercenter;
    if (pageName == "User_info") {
        $scope.Usercenter.UserSetAction = "User_info";
    }
    else if (pageName == "SchemeSet") {
        $scope.Usercenter.UserSetAction = "SchemeSet";
    }
    else if (pageName == "BillInfo") {
        $scope.Usercenter.UserSetAction = "BillInfo";
    }
    else if (pageName == "EmailSet") {
        $scope.Usercenter.UserSetAction = "EmailSet";
    }
    else if (pageName == "Password") {
        $scope.Usercenter.UserSetAction = "Password";
    }
}

/**
*保存用户信息
UserInfo:所需参数
tabArgs:tab页处理,btnArgs：（管理我的方案按钮处理）
*/
function SaveUserInfo($scope, $http, $location, UserInfo, tabArgs, btnArgs) {

    loadingStart();
    $http.post('/UM/ModifyUserInfo',
                { name: UserInfo.SaveUserInfoArgs.accountName, email: UserInfo.SaveUserInfoArgs.accountEmail })
                .success(function (data) {
                    if (data == "") {
                        UserInfo.InfoData.EditSateFlag = false;//服务：用户信息修改保存状态
                        if (tabArgs != "") {
                            $location.path('/UC/' + tabArgs);
                            UserSetTabCssActive($scope, tabArgs);
                        }
                        loadingEnd();
                    } else {
                        alert(data, "red");
                        loadingEnd();
                    }
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingEnd();
                    RestLogin(data);
                });
}

/**
*保存修改密码信息
UserInfo:所需参数
tabArgs:tab页处理,btnArgs：（管理我的方案按钮处理）
*/
function SavePwdInfo($scope, $http, $location, UserInfo, tabArgs, btnArgs) {

    loadingStart();
    $http.post('/UM/PasswordSet', { oldPassword: UserInfo.SavePwdArgs.CurrentPwd, newpassword: UserInfo.SavePwdArgs.NewPwd }).success(function (data) {
        if (data == "") {
            UserInfo.InfoData.EditPwdState = false;//服务：密码信息保存状态
            if (tabArgs != "") {
                $location.path('/UC/' + tabArgs);
                UserSetTabCssActive($scope, tabArgs);
            }
            loadingEnd();
        } else {
            alert(data, "red");
            loadingEnd();
        }
    }).error(function (data, status, headers, config) {
        //处理错误   
        loadingEnd();
        RestLogin(data);
    });
}












