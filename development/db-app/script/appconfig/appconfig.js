var zyApp = angular.module("myapp", ["ui.router"]);
/**▼权限控制**/
var permissionList;
//angular启动前加载权限数据
angular.element(document).ready(function () {
    $.ajax({
        type: "post",
        url: "/Home/GetModuleList",
        data: {},
        dateType: "json",
        success: function (data) {
            permissionList = data;
            angular.bootstrap(document, ['myapp']);
        },
        error: function (e) {
        }
    });
});
//控制页面跳转权限
zyApp.run(["$rootScope", "permissionsManage", function ($rootScope, permissionsManage) {
    $rootScope.$on('$stateChangeStart', function (evt, next, current) {
        var hasPermission = permissionsManage.hasPermission(next.name);
        if (!hasPermission) {
            location.href = "/Error/Error";
        }
    });
}])
.directive("hasAuthority", ["permissionsManage", function (permissionsManage) {//控制页内按钮权限
    return {
        link: function (scope, elem, attrs, ctrl) {
            var hasPermission = permissionsManage.hasPermission(attrs.hasAuthority);
            if (hasPermission) {
                elem.show();
            }
            else {
                elem.hide();
            }
        }
    }
}])
.factory("permissionsManage", function () {
    return {
        hasPermission: function (permission) {
            for (var i = 0; i < permissionList.length; i++) {
                if (permissionList[i] == permission)
                    return true;
            }
            return false;
        }
    }
});
/**▲权限控制**/

//问卷设置---信息修改状态
zyApp.factory('QuesEidtData', ['$http', function ($http) {
    return {
        QuesInfoData: {},//EditStateFlag:问卷信息修改的状态,用于tab页切换;id:问卷ID;publishStateFlag:发布状态;
        SaveMethodsArgs: {},//保存问卷方法参数
        SavePublishSetArgs: {},//保存发布设置方法参数
    }
}])
 .factory('SelectModule', function () {
     return {
         ModuleStateFlag: 0,//问卷信息修改的状态,用于tab页切换
         SaveMethods: function () {
         }
     }
 })
 .factory('UserInfo', function () {
     return {
         InfoData:  {},//EditSateFlag:账户信息保存状态;EditPwdState:密码信息保存状态;
         SaveUserInfoArgs: {},//保存用户摘要方法的参数
         SavePwdArgs: {},//保存修改密码方法的参数
     }
 })
.factory("publishManager", function () {//发布
    return new (function () {
        this.Reset = function () {
            this.CollectorID = "";//收集器ID
            this.PublishPageFlagBtn = false;//发布按钮的可见性（当数据全部加载出来时再显示）
            this.PublishPageFlag = false;//发布页的可见性（当数据全部加载出来时再显示）
            this.preview = false;//预览的可见性
            this.QuesID = "";//问卷ID
            this.DisableAll = false;//禁用所有
            this.publishFlag = true;//发布按钮的显示状态
            this.publishDisable = true;//发布按钮的可用状态
            this.cancelFlag = false;//取消发布按钮的显示状态
            this.downFlag = false;//下线按钮的显示状态
            this.cancelLock = true;//取消发布的可用状态
            this.downLock = true;//下线的可用状态
            this.otherFlag1;//在线下线可用状态
            this.otherFlag2;//计划发布在乎下线可用状态
            this.SaveSetFlag = true;//保存设置按钮
            this.otherFlag1 = true;//未发布时才能改
            this.otherFlag2 = true;//未发布、计划发布可改
            this.otherFlag3 = false;////有收集器微信渠道可用
            this.otherFlag4 = false;//发布才可显示
            this.otherFlag5 = false;//发布状态时才可显示
            this.onLineFlag = false;//在线才可显示
            this.publishDisable = true;//发布按钮的可用状态
            this.publishCountFlag = true;//发行总数的可用状态
            this.publishCount = 100;//发行数
            this.QuotaName = "请选择配额";//配额默认选项
            this.InitQuotaName = "取消配额";//配额选项
            this.QuotaExits = false;//是否有配额，有配额则显示下拉框，否则不显示
            this.CancelQuotaFlag = false;//取消配额是否显示，选择配额时显示，否则隐藏
            this.QuotaID = "";//配额ID
            this.QuotaFlag = false;//发行数的禁用样式控制
            this.quotaStyle = false;//配额下拉框的样式
            this.PublishDays = 30;//设置调研时限
            this.NoTimeLimit = false; //无时限的选中状态
            this.planTime = "";//发布时间
            this.ReleaseType = "1";//发布方式（默认直接发布）
            this.planHourFlag = true;//小时数选择
            this.planHour = new Date().getHours() + 1;
            this.planHourName = new Date().getHours() + 1 + "时";
            this.planHourStyle = false;//小时数下拉框显示与否
            this.TerLimitReply = "Y";//终端回复
            this.microLetterChannel = "N";//是否有微信渠道
            this.parameterFlag = "N";//链接是否带参数
            this.parameterCheck = false;
            this.WeChatName = "";//微信名称
            this.WeChatNameAppID = "";//AppID
            this.WeChatNameId = "";//微信号
            this.WeChatAppSecret = "";//AppSecret
            this.collectionEnable = false;//收集
            this.WeChatBtnFlag = false;//微信按钮的可用状态
            this.logoImg = "";//微信验证logo图片
            this.redirect_uri = "";//微信验证重定义路径
            this.WeichatOauthFlag = false;//验证域名按钮的可用性
            this.daysLock = false;//期限调整样式禁用hi
            this.quotaChangeStyle = { visibility: 'hidden' };
            this.designErrorStyle = { color: 'green' };//问卷状态文字颜色样式
        }
        this.publishNumChange = function (value) {
            if (!this.DisableAll) {
                if (this.publishCountFlag) {
                    if (this.publishCount == "" || isNaN(this.publishCount)) {
                        this.publishCount = 0;
                    }
                    if ((this.publishCount == "" || isNaN(this.publishCount)) && value == -1) {
                        this.publishCount = 2;
                    }
                    var sum = parseInt(value) + parseInt(this.publishCount);
                    //最大8位数，最小1；
                    if (sum < 1 || sum > 99999999) {
                        sum = this.publishCount;
                    }
                    this.publishCount = sum;
                    this.QuotaID = "";
                    this.QuotaName = "请选择配额";
                    this.SaveSetFlag = true;//保存设置按钮
                }
            }
        }

        this.publishNumChangeForOnChange = function (value) {
            if (!this.DisableAll) {
                if (this.publishCountFlag) {
                    this.publishCount = value;
                    this.QuotaID = "";
                    this.QuotaName = "请选择配额";
                    this.SaveSetFlag = true;//保存设置按钮
                }
            }
        }

        this.quotaStyleChange = function () {
            this.quotaChangeStyle = { visibility: 'visible' }
        }
        this.quotaChange = function (quota) {//请选择配额
            if (quota == "") {
                this.QuotaName = "请选择配额";//配额默认选项
                this.QuotaID = "";//配额默认值
                this.publishCountFlag = true;//发布总数的可用状态
                this.publishCount = 100;
                this.SaveSetFlag = true;//保存设置按钮
                this.QuotaFlag = false;//发行数的禁用样式控制
                this.CancelQuotaFlag = false;
            } else {
                if (quota.QuotaTableID != this.QuotaID) {
                    this.QuotaName = quota.QuotaTableName;
                    this.QuotaID = quota.QuotaTableID;
                    this.publishCount = quota.QuotaNum;
                    this.SaveSetFlag = true;//保存设置按钮
                }
                this.CancelQuotaFlag = true;
                this.publishCountFlag = false;//发布总数的可用状态
                this.QuotaFlag = true;//发行数的禁用样式控制
            }
        }
        this.PublishDaysChange = function (value) {//调研期限加减
            if (!this.DisableAll) {
                if (!this.NoTimeLimit) {
                    if (this.PublishDays == "") {
                        this.PublishDays = 0;
                    }
                    if (this.PublishDays == "" && value == -1) {
                        this.PublishDays = 2;
                    }
                    var daysSum = parseInt(value) + parseInt(this.PublishDays);
                    //最大3位数，最小1；
                    if (daysSum < 1 || daysSum > 999) {
                        daysSum = this.PublishDays;
                    }
                    this.PublishDays = daysSum;
                    this.NoTimeLimitFlag = false;//无时限至集满配额不可用
                    this.SaveSetFlag = true;//保存设置按钮
                }
            }
        }

        this.PublishDaysChangeForOnChange = function (value) {//调研期限加减
            if (!this.DisableAll) {
                if (!this.NoTimeLimit) {
                    this.PublishDays = value;
                    this.NoTimeLimitFlag = false;//无时限至集满配额不可用
                    this.SaveSetFlag = true;//保存设置按钮
                }
            }
        }

        this.NoTimeLimitSelect = function () {//无时限选择
            this.NoTimeLimit = !this.NoTimeLimit;
            if (this.NoTimeLimit) {
                this.PublishDays = 1000;
                //$("#PlanTime").val("");
                this.daysLock = true;
            } else {
                this.PublishDays = 30;
                this.daysLock = false;
            }
            this.SaveSetFlag = true;//保存设置按钮
        }
        this.ReleaseSelect = function (type) {
            if (type == "1") {
                this.ReleaseType = type;
                $("#PlanTime").val("");
                this.planHourFlag = true;
                //$(".ui-datepicker").addClass("nonecss");
            } else {
                this.ReleaseType = type;
                if (this.otherFlag2) {
                    this.planHourFlag = false;
                    //默认当前日期
                    var date = new Date(); //日期对象
                    var year = date.getFullYear();
                    var month = ((date.getMonth() + 1).toString().length == 1) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);//js从0开始取 
                    var day = date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate();
                    var hour = date.getHours().toString().length == 1 ? "0" + date.getHours() : date.getHours();
                    var minutes = date.getMinutes().toString().length == 1 ? "0" + date.getMinutes() : date.getMinutes();
                    var now = year + "/" + month + "/" + day + " " + hour + ":" + minutes;
                    $("#PlanTime").val(now);
                }
            }
            this.SaveSetFlag = true;//保存设置按钮
        }
        //小时数选择
        this.planHourStyleChange = function () {
            if (!this.DisableAll) {
                this.planHourStyle = !this.planHourStyle;
            }
        }
        this.planHourChange = function () {
            this.SaveSetFlag = true;//保存设置按钮

        }
        this.TerLimitSelect = function (type) {//终端选择
            if (type == "Y") {
                this.TerLimitReply = "Y";
            } else {
                this.TerLimitReply = "N";
            }
            this.SaveSetFlag = true;//保存设置按钮
        }
        this.toggleCollectionEnable = function () {
            this.collectionEnable = !this.collectionEnable;
            if (this.collectionEnable) {
                this.microLetterChannel = "Y";
            } else {
                this.microLetterChannel = "N";
            }
            this.SaveSetFlag = true;//保存设置按钮
        }
        this.parameterSelect = function () {//链接是否带参
            this.parameterCheck = !this.parameterCheck;
            if (this.parameterCheck) {
                this.parameterFlag = "Y";
            } else {
                this.parameterFlag = "N";
            }
            this.SaveSetFlag = true;//保存设置按钮
        }
        this.QuesSetWebChatBtnChange = function (isValid, isdirty) {//微信通过验证
            if (!isValid || !isdirty) {
                this.WeChatBtnFlag = false;
            } else {
                this.WeChatBtnFlag = true;
                this.SaveSetFlag = true;//保存设置按钮
            }
        }


        this.Reset();
    })()
})


.factory("UserPageText", function () {//页面描述文字初始化
    return new (function () {
        this.InitPageText = function () {
            this.Summary_QTileMaximum = pagePromptText.Summary_QTileMaximum;
            this.Summary_QDescribeMaximum = pagePromptText.Summary_QDescribeMaximum;
            this.Summary_QFacePpicture = pagePromptText.Summary_QFacePpicture;
            this.Summary_QCommitment = pagePromptText.Summary_QCommitment;
            this.Publish_publishCount = pagePromptText.Publish_publishCount;
            this.Publish_publishDays = pagePromptText.Publish_publishDays;
            this.Publish_publishTime = pagePromptText.Publish_publishTime;
            this.Publish_publishIntervieweeInfo = pagePromptText.Publish_publishIntervieweeInfo;
            this.Publish_publishWeiXinInfo = pagePromptText.Publish_publishWeiXinInfo;
            this.Publish_publishAppInfo = pagePromptText.Publish_publishAppInfo;
            this.Publish_publishValidateSave = pagePromptText.Publish_publishValidateSave;
            this.Publish_publishOauthConfig = pagePromptText.Publish_publishOauthConfig;
            this.Publish_publishImmediatelyVerify = pagePromptText.Publish_publishImmediatelyVerify;
            this.Quota_PromptMessage = pagePromptText.Quota_PromptMessage;
            this.UserInfo_UserPicForm = pagePromptText.UserInfo_UserPicForm;
            this.UserInfo_UserPicSize = pagePromptText.UserInfo_UserPicSize;
            this.UserInfo_UserName = pagePromptText.UserInfo_UserName;
            this.UserInfo_Email = pagePromptText.UserInfo_Email;
            this.Password_CurrentPwd = pagePromptText.Password_CurrentPwd;
            this.Password_NewPwd = pagePromptText.Password_NewPwd;
            this.Password_NewPwdAgain = pagePromptText.Password_NewPwdAgain;
            this.LoginAndRegister_Register = pagePromptText.LoginAndRegister_Register;
        }
    })()
})

.factory("Unify", ['$http', function ($http) {
    return new (function () {
        this.QuesChange = function (qid) {//问卷设置的共通标题配额
            $http.post('/QM/GetQuestionInfoByQuesID', { quesID: qid }).success(function (data) {
                //$("#quesTile").html(data.QTitle);
                document.getElementById('quesTile').innerText = data.QTitle;
                if (data.QStatus == 5) {
                    $("#delQuesaIcon").css("display", "none");
                } else {
                    $("#delQuesaIcon").css("display", "inline-block");
                }
                if (data.PreViewFlag) {
                    $("#preView").css("display", "inline-block");
                } else {
                    $("#preView").css("display", "none");
                }
                $("#quesIconDIV").css("display", "block");
            })
        }
        this.QuesPreview = function (linkID, QRCodeID, qid) {//问卷预览

            $(linkID).text("").attr("href","");
            $(QRCodeID).attr("src", "");
            $http.post('/QM/DownLoadQRCode', { quesID: qid, linkSuffix: qid ,redirect_uri:""}).success(function (data) {
                if (!data.returnError) {
                    $(linkID).text(data.QRlink).attr("href", data.QRlink);
                    $(QRCodeID).attr("src", data.StrPath);
                } else {
                    alert(data.Message, "red");
                }
            }).error(function (data, status, headers, config) {
            });
        }
    })()
}])


.factory("DataOutputInfo", ['$http', function ($http) {
    return new (function () {
        this.dataOutputList;


    })()
}])
 .factory("QuesQuotaInfo", function () {
    return new (function () {
        this.QuesQuotaReset = function () {
            this.SourceNodes = null;///默认下拉选项
            this.Row1Nodes = new Array();///行1下拉选项
            this.Row2Nodes = new Array();///行2下拉选项
            this.CellNodes = new Array();///列下拉选项
            this.StrRow1Nodes = "";///生成表格的配额行1
            this.StrRow2Nodes = "";///生成表格的配额行2
            this.StrCelNodes = "";///生成表格的配额列
            this.QuotaTableID = "";///问卷配额集表ID 
            this.Row1Name = "";///配额行1名称   
            this.Row2Name = "";///配额行2名称    
            this.CelName = "";///配额列名称
            this.SelectGroup = null;///选中的配额组
            this.SelectChangeName = "";///选中的配额组

            this.SelectChangeType = 0;
            this.ShowRow = false;
            this.ShowCel = false;
            this.ShowTable = false;
            this.ShowRow2 = false;///是否显示配额行2 
            this.Popupbackground = 0;
            this.ShowCreateTableBtn = false;
            this.RowGroup = new Array();///配额行组
            this.CelGroup = new Array();///配额列组
            this.RowGroupNum = 0;///配额列组
            this.TableInfoHtml = "";///表格信息
            this.HtmlMinSize = "";///表格信息 
            this.TableData = "";///表格信息  
            this.ShowSet = "隐藏设置";
            this.IsShowSidebar = true;
            this.GridWidth = { width: "75%" };


            //this.Name = "";///配额行名称
            //this.IsSet = false;
            //this.SetOpacity = { opacity: 0.5 };
            //this.SortNo = 0;
            //this.Nodes = new Array();///下拉选项 
            //this.Type = 0;
            //this.Open = { display: 'none' };

            //this.ID = "";
            //this.SortNo = 0;
            //this.Value = 0;


            //this.ID = "";
            //this.NumValue = 0;
        }
        this.QuesQuotaReset();

    })()
 })
 .factory("QQuesSet", function () {
     return new (function () {
         this.QQuesSetReset = function () {
             this.QMSetAction = "";//Tab选中CSS
             this.QuesSetFolderList = "";///文件夹列表
             this.QuesSetInitFolder = "";//默认选中值
             this.QuesSetSelectFID = "";//默认选中值
             this.QuesBtnFlag = 0; //移动文件夹框
             this.QuesSetFolderSelect = "";//文件夹下拉框是否显示
             this.DelPassWord = "";//删除问卷的输入值
             this.QuesSetBackIndex = false;
         }
         this.QQuesSetReset();

     })()
 })
.factory("UserImageURL", function () {
    return new (function () {
        this.ImgUrl;


    })()
})

////权限控制页面跳转
//zyApp.controller('mainAppCtrl', function ($scope, $location) {
//    $scope.$on('$stateChangeStart', function (scope, next, current) {
//        var a = "hehe";
//    });
//});
////权限控制按钮
//zyApp.directive("hasAuthority", function () {
//    return {
//        link: function (scope, elem, attrs, ctrl) {
//            if (attrs.hasAuthority == "保存更改") {
//                elem.hide();
//            }
//        }
//    }
//});
zyApp.directive("top", function () {
    return {
        restrict: "E",
        templateUrl: "/Content/db/top.html",
        replace: true,

        controller: "TopController"
    }
});
zyApp.directive('pwCheck', [function () {//验证密码的一致性
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]);


zyApp.controller("TopController", ["$scope", "$stateParams", "$http", "UserInfo", "$location", "$timeout", "UserImageURL",
function ($scope, $stateParams, $http, UserInfo, $location, $timeout, UserImageURL) {
    $scope.setLineStyle = function () {
        $("#Selectques").addClass("nav-current");
    }
    $scope.UserImageURL = UserImageURL;
    $scope.IsDemo = $("#hiddendemotype").val();
    //处理用户图片
    $http.post('/UM/GetUserInfo', {}).success(function (data) {

        $scope.UserImageURL.ImgUrl = data.Portrait;

    })
    $scope.navOverLayFlag = false;
    $scope.navOverLayClick = function () {
        $scope.navOverLayFlag = !$scope.navOverLayFlag;
    }
    $scope.HrefClick = function (hrefValue) {
        $scope.navOverLayFlag = false;
        $location.path(hrefValue);
    }
    isTouchDevice();
    menuButton();
    ///跳转链接
    $scope.GoToUrl = function (url) {
        if (url != '') {
            $location.path(url);
        }
        closeAll("ul.downul");

    }
    $scope.SignOut = function () {
        //处理用户图片
        $http.post('/Home/SignOut', {}).success(function (data) {

            window.location.href = '/Home/Index'

        })
    }
    $(window).resize(function () {
        var bodyWith = document.body.clientWidth;
        $timeout(function () {
            if (parseInt(bodyWith) + 6 > 768) {
                $scope.navOverLayFlag = false;
            }
        }, 10);
    });

}
]);

zyApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {





    $urlRouterProvider
     .when("", "/QM")
     .when("/QMSet", "/QMSet/Publish/")//问卷设置(初始页面)
     .when("/QMSet/AnalyzeResults/:qid", "/QMSet/AnalyzeResults/:qid/DataTrends")//问卷设置(初始页面)
     .when("/UC", "/UC/User_info/")//账户设置(初始页面)
     .otherwise("/QM");
    ////function ($injector, $location) {
    ////    //$location.path('/QM');///当页面不存在时加载的模板
    ////}
    //);
    $stateProvider
     .state("QM", {//问卷管理
         url: "/QM",
         templateUrl: "/Content/db/qm/questionnair-list.html",
         controller: "QuestionnairList"

     })
    //.state("zycs", {//测试页----张玉
    //    url: "/zycs",
    //    templateUrl: "/Content/template/QM/zy_test.html",
    //    controller: "zycs"
    //})
     .state("I", {
         url: "/I/:inboxId/:idx",
         templateUrl: "/Content/db/template/QuestionnairSettings.html",
         controller: "QuestionnairSettingsInfo"
     })

    .state("QMCreate", {//创建问卷
        url: "/QMCreate/:fid",
        templateUrl: "/Content/db/qm/questionnaire-create.html",
        controller: "QuesCreateCtrl"

    })
    .state("QMSet", {//问卷设置
        url: "/QMSet",
        templateUrl: "/Content/db/qm/questionnair-settings.html",
        controller: "QuesSettingsCtrl"
    })
    //.state("QMSet.Summary", {//摘要
    //    url: "/Summary/:qid",
    //    templateUrl: "/Content/template/QM/Summary.html",
    //    controller: SummaryCtrl
    //})
     .state("QMSet.Preview", {//预览
         url: "/Preview/:qid",
         templateUrl: "/Content/db/qm/preview.html"
     })
     .state("QMSet.Quota", {//配额
         url: "/Quota/:qid",
         templateUrl: "/Content/db/qm/quota.html",
         controller: "QuotaCtrl"
     })
     .state("QMSet.Publish", {//发布
         url: "/Publish/:qid",
         templateUrl: "/Content/db/qm/publish.html",
         controller: "PublishManagerCtrl"
     })
     .state("QMSet.AnalyzeResults", {//分析结果
         url: "/AnalyzeResults/:qid",
         templateUrl: "/Content/db/qm/analyze-results.html",
         controller: "AnalyzeResultsCtrl"
     })

     .state("QMSet.AnalyzeResults.DataTrends", {//收集进度
         url: "/DataTrends",
         templateUrl: "/Content/db/qm/analyze-results-data-trends.html",
         controller: "DataTrendsCtrl"
     })

     .state("QMSet.AnalyzeResults.QuestionSummaries", {//数据结果
         url: "/QuestionSummaries",
         templateUrl: "/Content/db/qm/analyze-results-question-summaries.html",
         controller: "QuestionSummariesCtrl"
     })
     .state("QMSet.Backups", {//备份和版本
         url: "/Backups/:qid",
         templateUrl: "/Content/db/qm/backups.html"
     })
     .state("UC", {//账户设置
         url: "/UC",
         templateUrl: "/Content/db/uc/user_center.html",
         controller: "UsercenterCtrl"
     })
     .state("UC.Userinfo", {//账户摘要
         url: "/User_info/:msg",
         templateUrl: "/Content/db/uc/user_info.html",
         controller: "User_infoCtrl"
     })
    .state("UC.Userinfoystest", {//账户摘要
        url: "/User_infoystest/:msg",
        templateUrl: "/Content/db/uc/user_infoystest .html",
        controller: "User_infoCtrl"
    })
     .state("UC.Password", {//账户摘要
         url: "/Password",
         templateUrl: "/Content/db/uc/password.html",
         controller: "PasswordCtrl"
     })
    ;



}]);

