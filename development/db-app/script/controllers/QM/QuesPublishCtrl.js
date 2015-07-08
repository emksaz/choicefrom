//问卷发布
function QPublish() {
    this.publishCount = "";//发布总数
    this.publishSetFlag = false;//发布设置按钮的可用状态
    this.QuotaID = "";//当前配额默认值
    this.QuotaName = "选择配额";//当前配额名
    this.auotaSetFlag = false;//配额的可用状态
    this.publishCountFlag = false;//发布总数的可用状态
    this.NoTimeLimit = false;//无期限的选中状态
    this.PublishDays = "";//发布期间时间
    this.PublishDaysFlag = false;//发布期间设置的可用状态
    this.ReleaseType = "";//发布方式
    this.TerLimitReply = "";//终端回复
    this.NextTopicFlag = "Y";//是否允许查看前一题值
    this.NextTopic = true;//是否允许查看前一题状态
    this.AnonymousFlag = "N";//匿名处理值
    this.Anonymous = false;//匿名处理状态
    this.collectCss = false;//收集状态
    this.isFocusCss = false;//关注状态
    this.WeChatName = "";//微信名称
    this.WeChatNameAppID = "";//AppID
    this.WeChatNameId = "";//微信号
    this.WeChatAppSecret = "";//AppSecret
    this.WeichatOauth = "";//Oauth
    this.WeChatBtnFlag = false;//微信渠道按钮可用状态
    this.WeichatOauthBtnFlag = false;//域名按钮可用状态
    this.QuotaList = "";//文件夹列表
    this.DisableAll;//禁用所有
    this.saveSetFlag;//保存设置按钮
    this.publishFlag;//发布按钮的显示状态
    this.publishDisable;//发布按钮的可用状态
    this.cancelFlag;//取消发布按钮
    this.downFlag;//下线按钮
    this.otherFlag1;//在线下线可用状态
    this.otherFlag2;//计划发布在乎下线可用状态
    this.CollDown = 0;//收集器下线的弹框
    this.publishErrorMessage = "";
    this.webLinkDIV = "";//weibDIV层显示
    this.webPublishHref = "";//weblink
    this.publishtextDIV = false;//发布的提示文字DIV
}
function PublishCtrl($scope, $stateParams, $http, QuesEidtData, UserPageText) {
    BindQuesTtile($scope, $http, $stateParams.qid);//问卷标题(刷新页面时用到)
    $scope.QPublish = QPublish;
    $scope.UserPageText = UserPageText;//初始化页面文字
    $scope.UserPageText.InitPageText();

    QuesEidtData.QuesInfoData.qid = $stateParams.qid;//给QuesEidtData服务的发布设置方法的参数赋值

    //初始化发布信息
    $scope.InitPublishData = function (loadingIsEnd) {

        if (loadingIsEnd != 0) {
            loadingStart();
        }
        $http.post('/QM/GetPublishInfo', { quesID: QuesEidtData.QuesInfoData.qid, quotaID: QuesEidtData.SavePublishSetArgs.QuotaID }).success(function (data) {
            console.log(data);
            if (data.DisableAll != undefined) {
                ////////////////////////////页面权限////////////////////////
                if (data.DisableAll == "disable") {
                    $scope.QPublish.publishSetFlag = false;//发布设置按钮的可用状态
                    $scope.quotaStyle = "display:none";
                }
                if (data.otherFlag2 == false) {//配额的可用状态
                    $scope.quotaStyle = "display:none";
                }
                $scope.QPublish.publishErrorMessage = data.errorMessage;
                $scope.QPublish.DisableAll = data.DisableAll;
                $scope.QPublish.saveSetFlag = data.saveSetFlag;
                $scope.QPublish.publishFlag = data.publishFlag;
                $scope.QPublish.cancelFlag = data.cancelFlag;
                $scope.QPublish.downFlag = data.downFlag;
                $scope.QPublish.otherFlag1 = data.otherFlag1;
                $scope.QPublish.otherFlag2 = data.otherFlag2;
                $scope.QPublish.publishDisable = data.publishDisable;
                if (data.errorMessage != "") {
                    $scope.QPublish.publishtextDIV = true;//发布错误
                    $("#publishtext").html(data.errorMessage);
                }
                //初始化配额数据
                $scope.QPublish.QuotaList = data.QuotaList;///配额列表
                //收集器渠道信息
                if (data.collChannel.length > 0) {
                    $scope.QPublish.publishSetFlag = false;//发布设置按钮的可用状态
                    if (data.errorMessage == "") {//收集器状态
                        $scope.QPublish.publishtextDIV = true;
                        $("#publishtext").html("当前收集器状态：" + data.collChannel[0].PublishStatusName);
                    }
                    if (data.collChannel[0].QuotaTableID == "00000000-0000-0000-0000-000000000000") {//没配额
                        $scope.QPublish.publishCountFlag = true;//发布总数的可用状态
                        $scope.QPublish.QuotaName = "选择配额";//当前配额默认选项
                        QuesEidtData.SavePublishSetArgs.QuotaID = $scope.QPublish.QuotaID = "";//当前配额默认值
                        $scope.QPublish.auotaSetFlag = false;//配额的可用状态
                    } else {//有配额
                        $scope.QPublish.QuotaName = data.collChannel[0].QuotaTableName;
                        QuesEidtData.SavePublishSetArgs.QuotaID = $scope.QPublish.QuotaID = data.collChannel[0].QuotaTableID;
                        $scope.QPublish.publishCountFlag = false;//发布总数的可用状态
                    }
                    QuesEidtData.SavePublishSetArgs.publishCount = $scope.QPublish.publishCount = data.collChannel[0].PublishCount;
                    if (data.collChannel[0].PublishDays == 1000) {//无期限
                        QuesEidtData.SavePublishSetArgs.PublishDays = $scope.QPublish.PublishDays = "";
                        $scope.QPublish.PublishDaysFlag = false;
                        $scope.QPublish.NoTimeLimit = true;

                    } else {//固定期限
                        QuesEidtData.SavePublishSetArgs.PublishDays = $scope.QPublish.PublishDays = data.collChannel[0].PublishDays;
                        $scope.QPublish.PublishDaysFlag = true;
                        $scope.QPublish.NoTimeLimit = false;
                    }
                    if (data.collChannel[0].PublishType == 1) {//直接发
                        $scope.QPublish.ReleaseType = "Direct";
                        $("#PlanTime").html("");
                        $("#PlanTime").addClass("w-input input disabled");
                    } else {//计划发布
                        $scope.QPublish.ReleaseType = "Plans";
                        $("#PlanTime").html(data.collChannel[0].StartDate);
                        $("#PlanTime").removeClass("w-input input disabled");
                    }
                    QuesEidtData.SavePublishSetArgs.PublishType = data.collChannel[0].PublishType;
                    if (data.collChannel[0].TerLimitFlag == "Y") {//终端一次回复
                        $scope.QPublish.TerLimitReply = "TerLimitATime";
                    } else {//多次回复
                        $scope.QPublish.TerLimitReply = "TerLimitManyTimes";
                    }
                    QuesEidtData.SavePublishSetArgs.TerLimitFlag = data.collChannel[0].TerLimitFlag;
                    if (data.collChannel[0].ReturnPreFlag == "Y") {//是否回到上一题
                        $scope.QPublish.NextTopic = true;
                    }
                    QuesEidtData.SavePublishSetArgs.NextTopicFlag = data.collChannel[0].ReturnPreFlag;
                    if (data.collChannel[0].AnonymousFlag == "Y") {//是否匿名
                        $scope.QPublish.Anonymous = true;
                    }
                    if (data.collChannel[0].PublishStatus > 1) {//发布后显示二维码
                        if (data.collChannel[0].webPublishHref != "") {
                            $scope.QPublish.webLinkDIV = "Show";
                            $scope.QPublish.webPublishHref = data.collChannel[0].webPublishHref;

                            //$("#QRCodeDIV").html("<img src=\"http://qr.liantu.com/api.php?text=" + $scope.QPublish.webPublishHref + "&logo=http://121.40.184.236/Images/icon256.gif\" />");

                            $("#QRCodeDIV").empty();
                            jQuery("#QRCodeDIV").qrcode({
                                width: 150,
                                height: 150,
                                text: $scope.QPublish.webPublishHref,
                            });

                            //画布画像
                            var myImage = $("#codeImge");
                            var canvas = document.getElementsByTagName("canvas");
                            console.log(canvas);
                            if (canvas.getContext) {
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(myImage, 50, 50, 100, 100);
                            }
                            //ctx.drawImage(myImage, 125, 125, 200, 50);
                            //var canvas = document.getElementsByTagName("canvas");
                            //console.log(canvas);
                        }
                    } else {
                        $scope.QPublish.webLinkDIV = "hide";
                    }
                    QuesEidtData.SavePublishSetArgs.AnonymousFlag = $scope.QPublish.AnonymousFlag = data.collChannel[0].AnonymousFlag;
                    if (data.collChannel.length == 2) {
                        for (var i = 0; i < data.collChannel.length; i++) {
                            if (data.collChannel[i].Attribute2 != "" && data.collChannel[i].Attribute2 != null) {
                                if (data.collChannel[i].Attribute1 == "Y") {//关注
                                    $scope.QPublish.isFocusCss = true;
                                } else {
                                    $scope.QPublish.isFocusCss = false;
                                }
                                QuesEidtData.SavePublishSetArgs.isFocusFlag = data.collChannel[i].Attribute1;
                                if (data.collChannel[i].Attribute2 == "Y") {//收集
                                    $scope.QPublish.collectCss = true;
                                    $("#weichat-name").removeAttr("readonly");
                                    $("#weichat-id").removeAttr("readonly");
                                    $("#weichat-app-id").removeAttr("readonly");
                                    $("#weichat-app-secret").removeAttr("readonly");
                                    $("#weichat-name").removeClass("disabled");
                                    $("#weichat-id").removeClass("disabled");
                                    $("#weichat-app-id").removeClass("disabled");
                                    $("#weichat-app-secret").removeClass("disabled");
                                } else {
                                    $scope.QPublish.collectCss = false;
                                    $("#weichat-name").attr("readonly", "true");
                                    $("#weichat-id").attr("readonly", "true");
                                    $("#weichat-app-id").attr("readonly", "true");
                                    $("#weichat-app-secret").attr("readonly", "true");
                                    $("#weichat-name").addClass("disabled");
                                    $("#weichat-id").addClass("disabled");
                                    $("#weichat-app-id").addClass("disabled");
                                    $("#weichat-app-secret").addClass("disabled");
                                }
                                QuesEidtData.SavePublishSetArgs.collectFlag = data.collChannel[i].Attribute2;
                                if (data.collChannel[i].Attribute3 != "" && data.collChannel[i].Attribute3 != null) {//微信名称
                                    QuesEidtData.SavePublishSetArgs.WeChatName = $scope.QPublish.WeChatName = data.collChannel[i].Attribute3;
                                    QuesEidtData.SavePublishSetArgs.microLetterChannel = "Y";
                                }
                                if (data.collChannel[i].Attribute4 != "" && data.collChannel[i].Attribute4 != null) {//appID
                                    QuesEidtData.SavePublishSetArgs.WeChatNameAppID = $scope.QPublish.WeChatNameAppID = data.collChannel[i].Attribute4;
                                }
                                if (data.collChannel[i].Attribute5 != "" && data.collChannel[i].Attribute5 != null) {//微信号
                                    QuesEidtData.SavePublishSetArgs.WeChatNameId = $scope.QPublish.WeChatNameId = data.collChannel[i].Attribute5;
                                }
                                if (data.collChannel[i].Attribute6 != "" && data.collChannel[i].Attribute6 != null) {//APP Secret
                                    QuesEidtData.SavePublishSetArgs.WeChatAppSecret = $scope.QPublish.WeChatAppSecret = data.collChannel[i].Attribute6;
                                }
                                if (data.collChannel[i].Attribute7 != "" && data.collChannel[i].Attribute7 != null) {//OAuth
                                    QuesEidtData.SavePublishSetArgs.WeichatOauth = $scope.QPublish.WeichatOauth = data.collChannel[i].Attribute7;
                                }
                            }
                        }
                    } else {
                        QuesEidtData.SavePublishSetArgs.collectFlag = "N";//收集(发布设置服务的参数赋值)
                        $("#weichat-name").attr("readonly", "true");
                        $("#weichat-id").attr("readonly", "true");
                        $("#weichat-app-id").attr("readonly", "true");
                        $("#weichat-app-secret").attr("readonly", "true");
                        $("#weichat-name").addClass("disabled");
                        $("#weichat-id").addClass("disabled");
                        $("#weichat-app-id").addClass("disabled");
                        $("#weichat-app-secret").addClass("disabled");
                        QuesEidtData.SavePublishSetArgs.WeChatName = $scope.QPublish.WeChatName = "";
                        QuesEidtData.SavePublishSetArgs.WeChatNameAppID = $scope.QPublish.WeChatNameAppID = "";
                        QuesEidtData.SavePublishSetArgs.WeChatNameId = $scope.QPublish.WeChatNameId = "";
                        QuesEidtData.SavePublishSetArgs.WeChatAppSecret = $scope.QPublish.WeChatAppSecret = "";
                        QuesEidtData.SavePublishSetArgs.WeichatOauth = $scope.QPublish.WeichatOauth = "";
                        $scope.WeChatForm.$setPristine();
                    }
                } else {
                    $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                    $scope.QPublish.webLinkDIV = "hide";//二维码
                    QuesEidtData.SavePublishSetArgs.publishCount = $scope.QPublish.publishCount = 100;
                    $scope.QPublish.publishCountFlag = true;//发布总数的可用状态
                    $scope.QPublish.QuotaName = "选择配额";//当前配额默认选项
                    $scope.QPublish.QuotaID = "";//当前配额默认值
                    $scope.QPublish.auotaSetFlag = false;//配额的可用状态
                    QuesEidtData.SavePublishSetArgs.PublishDays = $scope.QPublish.PublishDays = 30;
                    $scope.QPublish.NoTimeLimit = false;
                    $scope.QPublish.PublishDaysFlag = true;
                    QuesEidtData.SavePublishSetArgs.PublishType = 1;
                    $scope.QPublish.ReleaseType = "Direct";
                    $("#PlanTime").addClass("w-input input disabled");
                    $scope.QPublish.PlansRelease = false;
                    $scope.QPublish.TerLimitReply = "TerLimitATime";
                    QuesEidtData.SavePublishSetArgs.TerLimitFlag = "Y";
                    QuesEidtData.SavePublishSetArgs.NextTopicFlag = $scope.QPublish.NextTopicFlag = "Y";
                    $scope.QPublish.NextTopic = true;
                    QuesEidtData.SavePublishSetArgs.AnonymousFlag = $scope.QPublish.AnonymousFlag = "N";
                    $scope.QPublish.Anonymous = false;
                    $scope.QPublish.collectCss = false;
                    QuesEidtData.SavePublishSetArgs.collectFlag = "N";//收集(发布设置服务的参数赋值)
                    $("#weichat-name").attr("readonly", "true");
                    $("#weichat-id").attr("readonly", "true");
                    $("#weichat-app-id").attr("readonly", "true");
                    $("#weichat-app-secret").attr("readonly", "true");
                    $("#weichat-name").addClass("disabled");
                    $("#weichat-id").addClass("disabled");
                    $("#weichat-app-id").addClass("disabled");
                    $("#weichat-app-secret").addClass("disabled");
                    QuesEidtData.SavePublishSetArgs.WeChatName = $scope.QPublish.WeChatName = "";
                    QuesEidtData.SavePublishSetArgs.WeChatNameAppID = $scope.QPublish.WeChatNameAppID = "";
                    QuesEidtData.SavePublishSetArgs.WeChatNameId = $scope.QPublish.WeChatNameId = "";
                    QuesEidtData.SavePublishSetArgs.WeChatAppSecret = $scope.QPublish.WeChatAppSecret = "";
                    QuesEidtData.SavePublishSetArgs.WeichatOauth = $scope.QPublish.WeichatOauth = "";
                    $scope.WeChatForm.$setPristine();
                    $scope.QPublish.isFocusCss = false;
                    QuesEidtData.SavePublishSetArgs.isFocusFlag = "N";//关注(发布设置服务的参数赋值)
                }

            } else {
                alert(data);
            }
            if (loadingIsEnd != 0) {
                loadingEnd();
            }

        });

    }
    $scope.InitPublishData();
    //页面控制赋权
    $scope.authority = function (argsType) {
        if ($scope.QPublish.DisableAll == "disable") {
            return false;
        } else {
            if (argsType == "") {
                return true;
            }
            if (argsType == "saveSetFlag") {
                return $scope.QPublish.saveSetFlag;
            } else if (argsType == "publishFlag") {
                return $scope.QPublish.publishFlag;
            } else if (argsType == "cancelFlag") {
                return $scope.QPublish.cancelFlag;
            } else if (argsType == "downFlag") {
                return $scope.QPublish.downFlag;
            } else if (argsType == "otherFlag1") {
                return $scope.QPublish.otherFlag1;
            } else if (argsType == "otherFlag2") {
                return $scope.QPublish.otherFlag2;
            }
        }
    }

    //发布总数加减
    $scope.publishNumChange = function (value) {
        if ($scope.authority("")) {
            if ($scope.QPublish.publishCountFlag) {
                var Sum = parseInt(value) + parseInt($scope.QPublish.publishCount);
                //最大8位数，最小1；
                if (Sum < 1 || Sum > 99999999) {
                    Sum = $scope.QPublish.publishCount;
                }
                $scope.QPublish.publishCount = Sum;
                QuesEidtData.SavePublishSetArgs.QuotaID = $scope.QPublish.QuotaID = "";
                $scope.QPublish.QuotaName = "选择配额";//配额默认选项
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
                QuesEidtData.SavePublishSetArgs.publishCount = $scope.QPublish.publishCount;//发布总数(发布设置服务的参数赋值)
            }
        }
    }
    //选择具体配额
    //$scope.quotaFlag = false;
    //$scope.quotaSelect = function () {
    //    $scope.quotaFlag = !$scope.quotaFlag;
    //}
    $scope.auotaChange = function (quota) {
        if (quota == "") {
            $scope.QPublish.QuotaName = "选择配额";//配额默认选项
            $scope.QPublish.QuotaID = "";//配额默认值
            $scope.QPublish.publishCountFlag = true;//发布总数的可用状态
            $scope.QPublish.publishCount = 100;
            $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
            QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
        } else {
            if (quota.QuotaTableID != $scope.QPublish.QuotaID) {
                $scope.QPublish.QuotaName = quota.QuotaTableName;
                $scope.QPublish.QuotaID = quota.QuotaTableID;
                $scope.QPublish.publishCount = quota.QuotaNum;
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
            $scope.QPublish.publishCountFlag = false;//发布总数的可用状态
        }
        QuesEidtData.SavePublishSetArgs.publishCount = $scope.QPublish.publishCount;//发布总数(发布设置服务的参数赋值)
        QuesEidtData.SavePublishSetArgs.QuotaID = $scope.QPublish.QuotaID;//配额(发布设置服务的参数赋值)

    }
    //设置调查期限
    $scope.PublishDaysChange = function (value) {
        if ($scope.authority("")) {
            if ($scope.QPublish.PublishDaysFlag) {
                var Sum = parseInt(value) + parseInt($scope.QPublish.PublishDays);
                //最大3位数，最小1；
                if (Sum < 1 || Sum > 999) {
                    Sum = $scope.QPublish.PublishDays;
                }
                $scope.QPublish.PublishDays = Sum;
                $scope.QPublish.NoTimeLimit = false;//无时限至集满配额不可用
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
                QuesEidtData.SavePublishSetArgs.PublishDays = $scope.QPublish.PublishDays;//发布期间(发布设置服务的参数赋值)
            }
        }
    }
    //无时限至集满配额
    $scope.NoTimeLimitSelect = function () {
        if ($scope.authority("otherFlag1")) {
            $scope.QPublish.NoTimeLimit = !$scope.QPublish.NoTimeLimit;
            if ($scope.QPublish.NoTimeLimit) {
                $scope.QPublish.PublishDays = "";
                $scope.QPublish.PublishDaysFlag = false;
                $("#PublishDays").addClass("w-input input disabled");
            } else {
                $scope.QPublish.PublishDays = 30;
                $scope.QPublish.PublishDaysFlag = true;
                $("#PublishDays").removeClass("w-input input disabled");

            }
            $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
            QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            QuesEidtData.SavePublishSetArgs.PublishDays = $scope.QPublish.PublishDays;//发布期间(发布设置服务的参数赋值)
        } else {
            $("#PublishDays").addClass("w-input input disabled");
        }
    }
    //发布方式
    $scope.ReleaseSelect = function (type) {
        if (type == "Direct") {//直接
            if ($scope.authority("otherFlag1")) {
                $scope.QPublish.ReleaseType = "Direct";
                $("#PlanTime").html("");
                $("#PlanTime").addClass("w-input input disabled");
                QuesEidtData.SavePublishSetArgs.PublishType = 1;//发布类型(发布设置服务的参数赋值)
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
        } else {//计划
            if ($scope.authority("otherFlag2")) {
                $scope.QPublish.ReleaseType = "Plans";
                //默认当前日期
                var date = new Date(); //日期对象
                var now = "";
                now = date.getFullYear() + "-"; //读英文就行了
                now = now + (date.getMonth() + 1) + "- ";//取月的时候取的是当前月-1如果想取当前月+1就可以了
                now = now + date.getDate() + " ";
                now = now + date.getHours() + ":";
                now = now + date.getMinutes();
                $("#PlanTime").html(now);
                $("#PlanTime").removeClass("w-input input disabled");
                QuesEidtData.SavePublishSetArgs.PlanTime = now;//计划发布时间(发布设置服务的参数赋值)
                QuesEidtData.SavePublishSetArgs.PublishType = 2;//发布类型(发布设置服务的参数赋值)
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
        }
    }
    //加载日历控件
    $scope.Calendar = function () {
        if ($scope.authority("")) {
            if ($scope.QPublish.ReleaseType == "Plans") {
                $(".ui-datepicker").removeClass("none");
                $("#LoadCalendar").datetimepicker({
                    minDate: new Date(), onSelect: function (dateText, inst) {
                        $("#PlanTime").html("");
                        $("#PlanTime").html(dateText);
                        $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                        QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
                        QuesEidtData.SavePublishSetArgs.PlanTime = dateText;//计划发布时间(发布设置服务的参数赋值)
                    }
                });
                //$(".ui-datepicker").removeClass("none");
                //$("#LoadCalendar").datepicker({
                //    changeMonth: true, changeYear: true, yearRange: '-10:+10',
                //    minDate: new Date(),
                //    onSelect: function (dateText, inst) {

                //        $("#PlanTime").html("");
                //        $("#PlanTime").html(dateText);
                //        $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                //        QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
                //        QuesEidtData.SavePublishSetArgs.PlanTime = dateText;//计划发布时间(发布设置服务的参数赋值)
                //    }
                //});
            }
        }
    }
    //终端回复
    $scope.TerLimitSelect = function (ReplyValue) {
        if ($scope.authority("")) {
            if (ReplyValue == "TerLimitATime") {
                //每个终端只允许一次回复
                $scope.QPublish.TerLimitReply = "TerLimitATime";
                QuesEidtData.SavePublishSetArgs.TerLimitFlag = "Y";//终端(发布设置服务的参数赋值)
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            } else if (ReplyValue == "TerLimitManyTimes") {
                //每个终端允许多次回覆
                $scope.QPublish.TerLimitReply = "TerLimitManyTimes";
                QuesEidtData.SavePublishSetArgs.TerLimitFlag = "N";//终端(发布设置服务的参数赋值)
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
        }
    }
    //是否回到上一题
    $scope.NextTopicSelect = function () {
        if ($scope.authority("otherFlag2")) {
            $scope.QPublish.NextTopic = !$scope.QPublish.NextTopic
            if ($scope.QPublish.NextTopic) {
                $scope.QPublish.NextTopicFlag = "Y";
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            } else {
                $scope.QPublish.NextTopicFlag = "N";
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
            QuesEidtData.SavePublishSetArgs.NextTopicFlag = $scope.QPublish.NextTopicFlag;//是否回到上一题(发布设置服务的参数赋值)

        }
    }
    //是否匿名
    $scope.AnonymousFlagSelect = function () {
        if ($scope.authority("")) {
            $scope.QPublish.Anonymous = !$scope.QPublish.Anonymous
            if ($scope.QPublish.Anonymous) {
                $scope.QPublish.AnonymousFlag = "Y";
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            } else {
                $scope.QPublish.AnonymousFlag = "N";
                $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
            QuesEidtData.SavePublishSetArgs.AnonymousFlag = $scope.QPublish.AnonymousFlag;//匿名(发布设置服务的参数赋值)
        }
    }
    //是否关注
    //$scope.IsFocusSelect = function () {
    //    $scope.QPublish.isFocusCss = !$scope.QPublish.isFocusCss;
    //    if ($scope.QPublish.isFocusCss) {
    //    } else {
    //    }
    //    QuesEidtData.SavePublishSetArgs.isFocusFlag = "N";//关注(发布设置服务的参数赋值)
    //}
    //是否收集
    $scope.CollectSelect = function () {
        if ($scope.authority("")) {
            $scope.QPublish.collectCss = !$scope.QPublish.collectCss;
            if ($scope.QPublish.collectCss) {
                QuesEidtData.SavePublishSetArgs.collectFlag = "Y";//收集(发布设置服务的参数赋值)
                $("#weichat-name").removeAttr("readonly");
                $("#weichat-id").removeAttr("readonly");
                $("#weichat-app-id").removeAttr("readonly");
                $("#weichat-app-secret").removeAttr("readonly");
                $("#weichat-name").removeClass("disabled");
                $("#weichat-id").removeClass("disabled");
                $("#weichat-app-id").removeClass("disabled");
                $("#weichat-app-secret").removeClass("disabled");
                QuesEidtData.SavePublishSetArgs.microLetterChannel = "Y";//是否有微信渠道(发布设置服务的参数赋值)
            } else {
                QuesEidtData.SavePublishSetArgs.collectFlag = "N";//收集(发布设置服务的参数赋值)
                $("#weichat-name").attr("readonly", "true");
                $("#weichat-id").attr("readonly", "true");
                $("#weichat-app-id").attr("readonly", "true");
                $("#weichat-app-secret").attr("readonly", "true");
                $("#weichat-name").addClass("disabled");
                $("#weichat-id").addClass("disabled");
                $("#weichat-app-id").addClass("disabled");
                $("#weichat-app-secret").addClass("disabled");
            }
        }
    }
    //微信渠道
    $scope.QuesSetWebChatBtnChange = function (isValid, isdirty) {
        if (!isValid || !isdirty) {
            $scope.QPublish.WeChatBtnFlag = false;
        } else {
            $scope.QPublish.WeChatBtnFlag = true;
            $scope.QPublish.publishSetFlag = true;//发布设置按钮的可用状态
            QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            QuesEidtData.SavePublishSetArgs.WeChatName = $scope.QPublish.WeChatName;//微信名称(发布设置服务的参数赋值)
            QuesEidtData.SavePublishSetArgs.WeChatNameId = $scope.QPublish.WeChatNameId;//微信号(发布设置服务的参数赋值)
            QuesEidtData.SavePublishSetArgs.WeChatNameAppID = $scope.QPublish.WeChatNameAppID;//AppID(发布设置服务的参数赋值)
            QuesEidtData.SavePublishSetArgs.WeChatAppSecret = $scope.QPublish.WeChatAppSecret;//AppSecret(发布设置服务的参数赋值)
        }
    }
    //域名
    $scope.QuesSetWebChatOauthBtn = function () {
        if ($scope.QPublish.WeichatOauthBtnFlag) {
            $scope.QPublish.CollDown = 2;
            $("#weichatURl").empty();
            jQuery("#weichatURl").qrcode({
                width: 200,
                height: 150,
                text: QuesEidtData.SavePublishSetArgs.RedirectUri,
            });
        }
    }

    //微信验证
    $scope.WeiChatVerify = function () {
        if ($scope.QPublish.WeChatBtnFlag) {

            loadingStart();

            // wx675c0fa674fb6161                     86d9eb7691c616a288b9123b67df2b97
            $http.post('/WeChat/WeCharValidation', { appid: $scope.QPublish.WeChatNameAppID, secret: $scope.QPublish.WeChatAppSecret }).success(function (data) {
                if (data.errorMessage == "") {
                    console.log(data.redirect_uri);
                    alert("验证成功！");
                    QuesEidtData.SavePublishSetArgs.RedirectUri = data.redirect_uri;
                    QuesEidtData.SavePublishSetArgs.WeichatOauth = $scope.QPublish.WeichatOauth = data.Oauth;
                    $scope.QPublish.WeichatOauthBtnFlag = true;
                    $scope.QPublish.WeChatBtnFlag = false;
                    loadingEnd();
                } else {
                    alert(data.errorMessage);
                    loadingEnd();
                }
            })
        }
    }

    //保存发布设置
    $scope.SavePublishSet = function () {
        if ($scope.authority("")) {
            if ($scope.QPublish.publishSetFlag) {
                console.log(QuesEidtData.SavePublishSetArgs);

                loadingStart();
                $http.post('/QM/SavePublishInfo', {
                    quesID: QuesEidtData.QuesInfoData.qid,
                    auotaID: QuesEidtData.SavePublishSetArgs.QuotaID,
                    publishCount: QuesEidtData.SavePublishSetArgs.publishCount,
                    startDate: QuesEidtData.SavePublishSetArgs.PlanTime,
                    publishDays: QuesEidtData.SavePublishSetArgs.PublishDays,
                    publishType: QuesEidtData.SavePublishSetArgs.PublishType,
                    terLinmitFlag: QuesEidtData.SavePublishSetArgs.TerLimitFlag,
                    anonymousFalg: QuesEidtData.SavePublishSetArgs.AnonymousFlag,
                    returnPreFlag: QuesEidtData.SavePublishSetArgs.NextTopicFlag,
                    microLetterChannel: QuesEidtData.SavePublishSetArgs.microLetterChannel,
                    microServiceName: QuesEidtData.SavePublishSetArgs.WeChatName,
                    appID: QuesEidtData.SavePublishSetArgs.WeChatNameAppID,
                    microNum: QuesEidtData.SavePublishSetArgs.WeChatNameId,
                    appSecrt: QuesEidtData.SavePublishSetArgs.WeChatAppSecret,
                    oauth: QuesEidtData.SavePublishSetArgs.WeichatOauth,
                    isFocus: QuesEidtData.SavePublishSetArgs.isFocusFlag,
                    collect: QuesEidtData.SavePublishSetArgs.collectFlag,
                    btnType: ""
                }).success(function (data) {
                    console.log("发布设置提交");
                    console.log(data);
                    if (data.errorMessage == "") {
                        alert(Prompt.SaveOK);
                        //刷新
                        $scope.InitPublishData();
                        $scope.QPublish.publishSetFlag = false;//发布设置按钮的可用状态
                        QuesEidtData.QuesInfoData.publishStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息发布的状态

                        loadingEnd();
                    } else {
                        alert(data.errorMessage);
                        loadingEnd();
                    }
                })
            }
        }
    }

    //发布
    $scope.Publish = function () {
        if ($scope.authority("")) {
            if ($scope.QPublish.publishDisable) {
                if (QuesEidtData.SavePublishSetArgs.publishCount == 0) {
                    alert("问卷发行数为0，不允许发布！");
                    return;
                }
                confirm("是否确认发布此收集器？", function () {

                    loadingStart();
                    $http.post('/QM/SavePublishInfo', {
                        quesID: QuesEidtData.QuesInfoData.qid,
                        auotaID: QuesEidtData.SavePublishSetArgs.QuotaID,
                        publishCount: QuesEidtData.SavePublishSetArgs.publishCount,
                        startDate: QuesEidtData.SavePublishSetArgs.PlanTime,
                        publishDays: QuesEidtData.SavePublishSetArgs.PublishDays,
                        publishType: QuesEidtData.SavePublishSetArgs.PublishType,
                        terLinmitFlag: QuesEidtData.SavePublishSetArgs.TerLimitFlag,
                        anonymousFalg: QuesEidtData.SavePublishSetArgs.AnonymousFlag,
                        returnPreFlag: QuesEidtData.SavePublishSetArgs.NextTopicFlag,
                        microLetterChannel: QuesEidtData.SavePublishSetArgs.microLetterChannel,
                        microServiceName: QuesEidtData.SavePublishSetArgs.WeChatName,
                        appID: QuesEidtData.SavePublishSetArgs.WeChatNameAppID,
                        microNum: QuesEidtData.SavePublishSetArgs.WeChatNameId,
                        appSecrt: QuesEidtData.SavePublishSetArgs.WeChatAppSecret,
                        oauth: QuesEidtData.SavePublishSetArgs.WeichatOauth,
                        isFocus: QuesEidtData.SavePublishSetArgs.isFocusFlag,
                        collect: QuesEidtData.SavePublishSetArgs.collectFlag,
                        btnType: "publish"
                    }).success(function (data) {
                        console.log("发布");
                        console.log(data);
                        if (data.errorMessage == "") {
                            alert(Prompt.ReleaseOK);
                            $scope.QPublish.publishSetFlag = false;//发布设置按钮的可用状态
                            QuesEidtData.QuesInfoData.publishStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
                            //刷新信息

                            $scope.LoadingIsEnd
                            $scope.InitPublishData($scope.LoadingIsEnd);

                            loadingEnd();
                        } else {
                            alert(data.errorMessage);
                            loadingEnd();
                        }
                    })
                }, function () { }, "发 布", "发布收集器")
            }
        }
    }

    //取消发布
    $scope.CanclePublish = function () {
        confirm("取消后问卷收集器将恢复为未发布状态，请确认是否取消发布当前收集器？", function () {

            loadingStart();
            $http.post('/QM/CanclePublish', { quesID: QuesEidtData.QuesInfoData.qid }).success(function (data) {
                if (data == "") {
                    alert(Prompt.CancelPublishOK);
                    //刷新信息
                    $scope.LoadingIsEnd = 0;
                    $scope.InitPublishData($scope.LoadingIsEnd);
                    loadingEnd();
                }
            })
        }, function () { }, "确  定", "取消发布此收集器")
    }

    //下线
    $scope.QPublish.CollDown = 0;
    $scope.DownClick = function () {
        $scope.QPublish.CollDown = 1;
        $("body").addClass("srcollHide");
    }
    $scope.Down = function () {


        if ($("#reason").val() == "") {
            alert(Prompt.InputOfflineReason);
            return;
        }
        loadingStart();
        $http.post('/QM/Down', { quesID: QuesEidtData.QuesInfoData.qid, reason: $("#reason").val() }).success(function (data) {
            if (data == "") {
                alert(Prompt.DownAuditSubmit);
                $scope.QPublish.CollDown = 0;
                //刷新信息
                $scope.LoadingIsEnd = 0;
                $scope.InitPublishData($scope.LoadingIsEnd);
                loadingEnd();
            }
        })
    }

    $scope.cancelClose = function () {
        $scope.QPublish.CollDown = 0;
        $("body").removeClass("srcollHide");
    }
}



//日历控件确定关闭窗口（）
function CloseDIV() {
    $(".ui-datepicker").addClass("none");
}


