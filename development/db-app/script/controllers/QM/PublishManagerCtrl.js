zyApp.controller("PublishManagerCtrl", ["$scope", "$stateParams", "$http", "QuesEidtData", "publishManager", "UserPageText", "$location", "Unify", "QQuesSet",
function ($scope, $stateParams, $http, QuesEidtData, publishManager, UserPageText, $location, Unify, QQuesSet) {

    $scope.IsDemo = $("#hiddendemotype").val();
    //日期控件
    $('#PlanTime').datetimepicker({
        dayOfWeekStart: 1,
        lang: 'ch',
        onSelectDate: function () {
            $scope.publishManager.SaveSetFlag = true;
        },
    })
    //$scope.publishManager.SaveSetFlag = saveSetFlag;
    GoHtmlTop();

    //初始化发布信息
    $scope.Init = function (loadingIsEnd) {
        if (loadingIsEnd != 0) {
            loadingStart();
        };
        $http.post('/QM/VerifyRight', { quesID: $stateParams.qid }).success(function (data) {
            if (data == "NoRight") {
                location.href = '/Error/Error?type=dashboard';
            }
            else {
                $scope.Unify = Unify;//问卷标题(刷新页面时用到)
                $scope.Unify.QuesChange($stateParams.qid);
                $scope.UserPageText = UserPageText;//初始化页面文字
                $scope.UserPageText.InitPageText();

                $scope.publishManager = publishManager;//调用收集的服务
                $scope.publishManager.Reset();//重置
                QuesEidtData.QuesInfoData.qid = $stateParams.qid;//给QuesEidtData服务的发布设置方法的参数赋值
                $scope.publishManager.QuesID = $stateParams.qid;
                //当数据全部加载出来时再显示
                $scope.publishManager.PublishPageFlag = false;
                $scope.publishManager.PublishPageFlagBtn = false;
                $("#publishtext").html("");
                //初始数据
                $http.post('/QM/GetPublishInfo', { quesID: $scope.publishManager.QuesID }).success(function (data) {
                    $scope.QuotaList = data.QuotaList;///配额列表
                    if (data.QuotaList.length > 0) {
                        $scope.publishManager.QuotaExits = true;
                    }
                    ///权限
                    if (data.errorMessage != "") {
                        $("#publishtext").html(data.errorMessage);
                        $scope.publishManager.designErrorStyle = { color: 'red' };
                    } else {
                        if (data.collChannel.length > 0) {
                            $("#publishtext").html("当前收集器状态：" + data.collChannel[0].PublishStatusName);
                            $scope.publishManager.designErrorStyle = { color: 'green' };
                            if (data.collChannel[0].PublishStatusName == "在线") {
                                if (data.collChannel[0].PublishDays == 1000) {
                                    $("#RestTime").html("无期限");
                                }
                                else {
                                    $("#RestTime").html("剩余时间：" + data.collChannel[0].RestTime);
                                }
                            }
                            else if (data.collChannel[0].PublishStatusName == "下线") {
                                $("#RestTime").html("下线原因：" + data.collChannel[0].RestTime);
                            }
                            else {
                                $("#RestTime").html("");
                            }


                        } else {
                            $("#publishtext").html("");
                            $("#RestTime").html("");
                        }
                    }
                    if (loadingIsEnd != 0) {
                        loadingEnd();
                    }
                    //删除预览权限
                    $scope.Unify.QuesChange($stateParams.qid);
                    $scope.publishManager.DisableAll = data.DisableAll;//禁用所有
                    $scope.publishManager.publishFlag = data.publishFlag;//发布按钮
                    $scope.publishManager.publishDisable = data.publishDisable;//发布按钮的可用状态
                    $scope.publishManager.cancelFlag = data.cancelFlag;//取消发布按钮
                    $scope.publishManager.downFlag = data.downFlag;//下线按钮
                    $scope.publishManager.otherFlag1 = data.otherFlag1;//未发布时才能改
                    $scope.publishManager.otherFlag2 = data.otherFlag2;//未发布、计划发布可改
                    $scope.publishManager.otherFlag3 = data.otherFlag3;//根据收集器的有无，判断微信渠道是否可用
                    $scope.publishManager.otherFlag4 = data.otherFlag4;//发布后才可显示
                    $scope.publishManager.onLineFlag = data.onLineFlag;//在线才可显示
                    $scope.publishManager.otherFlag5 = data.otherFlag5;//发布状态时才可显示
                    $scope.publishManager.planHourFlag = !data.otherFlag2;//未发布、计划发布可改
                    //console.log($scope.publishManager.planHourFlag);

                    if (data.collChannel.length > 0) {
                        $scope.publishManager.SaveSetFlag = false;//发布设置按钮的可用状态（当有收集器时，只有当改变了值时才显示可用状态）
                        QuesEidtData.QuesInfoData.publishStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
                        $scope.publishManager.CollectorID = data.collChannel[0].CollectorID;
                        if (data.collChannel[0].QuotaTableName != "") {
                            $scope.publishManager.QuotaID = data.collChannel[0].QuotaTableID;
                            $scope.publishManager.QuotaName = data.collChannel[0].QuotaTableName;
                            $scope.publishManager.QuotaFlag = true;
                            $scope.publishManager.CancelQuotaFlag = true;
                        }
                        $scope.publishManager.publishCount = data.collChannel[0].PublishCount;
                        $scope.publishManager.PublishDays = data.collChannel[0].PublishDays;
                        if (data.collChannel[0].PublishDays != 1000) {
                            $scope.publishManager.daysLock = false;
                        } else {
                            $scope.publishManager.NoTimeLimit = true;
                            $scope.publishManager.daysLock = true;
                        }
                        if (data.collChannel[0].PublishType == "2") {
                            //var startDate = Date(data.collChannel[0].StartDate)
                            var startDate = new Date(data.collChannel[0].StartDate.replace(/-/g, "/"));
                            var year = startDate.getFullYear();
                            var month = ((startDate.getMonth() + 1).toString().length == 1) ? ("0" + (startDate.getMonth() + 1)) : (startDate.getMonth() + 1);//js从0开始取 
                            var date = startDate.getDate().toString().length == 1 ? "0" + startDate.getDate() : startDate.getDate();
                            var hour = startDate.getHours().toString().length == 1 ? "0" + startDate.getHours() : startDate.getHours();
                            var minutes = startDate.getMinutes().toString().length == 1 ? "0" + startDate.getMinutes() : startDate.getMinutes();
                            var time = year + "/" + month + "/" + date + " " + hour + ":" + minutes;
                            //$("#PlanTime").val(time);
                            document.getElementById("PlanTime").value = time;
                            $("#PublishTime").html("");
                            //$scope.publishManager.planHour = data.collChannel[0].Hour;
                            //$scope.publishManager.planHourName = data.collChannel[0].Hour + "时";
                        } else {
                            $("#PublishTime").html(data.collChannel[0].DirectPublishDate);
                        }
                        //发布后才显示二维码
                        $("#webShortLink").val(data.collChannel[0].webPublishHref);
                        $('#qrCodeStr').attr("src", "");
                        $('#qrCodeStr').attr("src", data.collChannel[0].QRCodImageSrc);

                        //分享的内容
                        var qTitle = data.collChannel[0].QTitle;
                        var qDesc = data.collChannel[0].QDescript;
                        var qLink = data.collChannel[0].webPublishHref;
                        var qUrl = data.collChannel[0].QFacePpictureURL;
                        setShare(qTitle, qLink, qUrl, qDesc);



                        if (data.collChannel[0].ParameterFlag == "Y") {
                            $scope.publishManager.parameterCheck = true;
                        }
                        $scope.publishManager.parameterFlag = data.collChannel[0].ParameterFlag;
                        $scope.publishManager.ReleaseType = data.collChannel[0].PublishType;
                        $scope.publishManager.TerLimitReply = data.collChannel[0].TerLimitFlag;
                        for (var i = 0; i < data.collChannel.length; i++) {
                            if (data.collChannel[i].Attribute4 != "" && data.collChannel[i].Attribute4 != null) {
                                if (data.collChannel[i].Attribute2 == "Y") {
                                    $scope.publishManager.collectionEnable = true;
                                }
                                $scope.publishManager.microLetterChannel = data.collChannel[i].Attribute2;
                                $scope.publishManager.WeChatName = data.collChannel[i].Attribute3;
                                $scope.publishManager.WeChatNameAppID = data.collChannel[i].Attribute4;
                                $scope.publishManager.WeChatNameId = data.collChannel[i].Attribute5;
                                $scope.publishManager.WeChatAppSecret = data.collChannel[i].Attribute6;
                                if (data.collChannel[i].Attribute6 != "") {
                                    $("#weichat-oauth").val(data.collChannel[i].Attribute7);
                                }
                            }
                        }
                    } else {
                        $scope.publishManager.SaveSetFlag = true;//发布设置按钮的可用状态（当没有收集器时，显示可用状态）
                    }

                    //系统锁定
                    if ($scope.publishManager.DisableAll) {
                        $scope.publishManager.QuotaFlag = true;
                        $scope.publishManager.SaveSetFlag = false;
                        $scope.publishManager.publishDisable = false;
                        $scope.publishManager.cancelLock = false;
                        $scope.publishManager.downLock = false;
                        $scope.publishManager.WeichatOauthFlag = false;
                        $scope.publishManager.daysLock = true;
                        $scope.publishManager.planHourFlag = true;
                    }
                    $scope.publishManager.PublishPageFlag = true;//当数据全部加载出来时再显示
                    $scope.publishManager.PublishPageFlagBtn = true;//发布按钮的可见性（当数据全部加载出来时再显示）
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingEnd();
                    RestLogin(data, $scope);
                });
            }
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data, $scope);
        });
        ChangePlanDateCssWidth();//改变计划发布的选择框和小时数下拉框的宽度

    };
    $scope.Init();


    //保存设置
    $scope.SavePublishSet = function () {
        if (!this.publishManager.DisableAll) {
            if (this.publishManager.SaveSetFlag) {

                //发布数据的非空验证
                if ($scope.publishManager.publishCount == "") {
                    alert("发布总数不能为空。", "red");
                    return;
                }
                else if ($scope.publishManager.PublishDays == "" || isNaN($scope.publishManager.PublishDays)) {
                    alert("问卷收集时限不能为空。", "red");
                    return;
                }
                else if ($("#PlanTime").val() == "" && $scope.publishManager.ReleaseType == "2") {
                    alert("计划发布时间不能为空。", "red");
                    return;
                }

                loadingStart();
                $http.post('/QM/SavePublishInfo', {
                    collID: $scope.publishManager.CollectorID,
                    quesID: $scope.publishManager.QuesID,
                    auotaID: $scope.publishManager.QuotaID,
                    publishCount: this.publishManager.publishCount,
                    startDate: $("#PlanTime").val(),
                    //startDateHour: $scope.publishManager.planHour + ":00:00",
                    publishDays: this.publishManager.PublishDays,
                    publishType: this.publishManager.ReleaseType,
                    terLinmitFlag: this.publishManager.TerLimitReply,
                    anonymousFalg: "",
                    returnPreFlag: 'Y',
                    microLetterChannel: this.publishManager.microLetterChannel,
                    microServiceName: this.publishManager.WeChatName,
                    appID: this.publishManager.WeChatNameAppID,
                    microNum: this.publishManager.WeChatNameId,
                    appSecrt: this.publishManager.WeChatAppSecret,
                    oauth: "",
                    isFocus: "",
                    collect: this.publishManager.microLetterChannel,
                    btnType: "",
                    parameterFlag: this.publishManager.parameterFlag
                }).success(function (data) {
                    if (data.errorMessage == undefined) {
                        alert(data, "green");
                        //刷新
                        $scope.LoadingIsEnd = 0;
                        $scope.Init($scope.LoadingIsEnd);
                        loadingEnd();
                    } else {
                        if (data.errorMessage == "") {
                            alert(Prompt.SaveOK, "green");
                            //刷新
                            $scope.LoadingIsEnd = 0;
                            $scope.Init($scope.LoadingIsEnd);
                            loadingEnd();

                            $scope.publishManager.SaveSetFlag = false;//发布设置按钮的可用状态
                            QuesEidtData.QuesInfoData.publishStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
                        } else {
                            alert(data.errorMessage, "red");
                            loadingEnd();
                        }
                    }
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingEnd();
                    RestLogin(data, $scope);
                });
            }
        }
    }
    //发布
    $scope.Publish = function () {
        if (!this.publishManager.DisableAll) {
            if (this.publishManager.publishDisable) {
                if (this.publishManager.publishCount == 0) {
                    alert("问卷发行数为0，不允许发布！", "red");
                    return;
                }

                //发布数据的非空验证
                if ($scope.publishManager.publishCount == "") {
                    alert("发布总数不能为空。", "red");
                    return;
                }
                else if ($scope.publishManager.PublishDays == "" || isNaN($scope.publishManager.PublishDays)) {
                    alert("问卷收集时限不能为空。", "red");
                    return;
                }
                else if ($("#PlanTime").val() == "" && $scope.publishManager.ReleaseType == "2") {
                    alert("计划发布时间不能为空。", "red");
                    return;
                }

                confirm("是否发布此收集器？", function () {

                    loadingStart();
                    $http.post('/QM/SavePublishInfo', {
                        collID: $scope.publishManager.CollectorID,
                        quesID: $scope.publishManager.QuesID,
                        auotaID: $scope.publishManager.QuotaID,
                        publishCount: $scope.publishManager.publishCount,
                        startDate: $("#PlanTime").val(),
                        //startDateHour: $scope.publishManager.planHour + ":00:00",
                        publishDays: $scope.publishManager.PublishDays,
                        publishType: $scope.publishManager.ReleaseType,
                        terLinmitFlag: $scope.publishManager.TerLimitReply,
                        anonymousFalg: "",
                        returnPreFlag: 'Y',
                        microLetterChannel: $scope.publishManager.microLetterChannel,
                        microServiceName: $scope.publishManager.WeChatName,
                        appID: $scope.publishManager.WeChatNameAppID,
                        microNum: $scope.publishManager.WeChatNameId,
                        appSecrt: $scope.publishManager.WeChatAppSecret,
                        oauth: "",
                        isFocus: "",
                        collect: $scope.publishManager.microLetterChannel,
                        btnType: "publish",
                        parameterFlag: $scope.publishManager.parameterFlag
                    }).success(function (data) {
                        if (data.errorMessage == undefined) {
                            alert(data, "green");
                            //删除预览权限
                            $scope.Unify.QuesChange($stateParams.qid);
                            //刷新
                            $scope.LoadingIsEnd = 0;
                            $scope.Init($scope.LoadingIsEnd);
                            loadingEnd();
                        } else {
                            if (data.errorMessage == "") {
                                alert(Prompt.ReleaseOK, "green");
                                //删除预览权限
                                $scope.Unify.QuesChange($stateParams.qid);
                                //刷新信息
                                $scope.LoadingIsEnd = 0;
                                $scope.Init($scope.LoadingIsEnd);
                                loadingEnd();

                                $scope.publishManager.SaveSetFlag = false;//发布设置按钮的可用状态
                                QuesEidtData.QuesInfoData.publishStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息发布的状态

                            } else {
                                alert(data.errorMessage, "red");
                                loadingEnd();
                            }
                        }
                    }).error(function (data, status, headers, config) {
                        //处理错误   
                        loadingEnd();
                        RestLogin(data, $scope);
                    });
                    $scope.$digest();
                }, function () { }, "是", "发布收集器", "否")
            }
        }
    }
    //发布总数加减
    $scope.publishNumChange = function (value) {
        if (!this.publishManager.DisableAll) {
            if (!this.publishManager.QuotaFlag) {
                this.publishManager.publishNumChange(value);
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
        }
    }
    //手动输入发布总数
    $scope.publishNumChangeForOnChange = function (value) {
        if (!this.publishManager.DisableAll) {
            if (!this.publishManager.QuotaFlag) {
                this.publishManager.publishNumChangeForOnChange(value);
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
        }
    }
    //配额下拉框点击
    $scope.quotaStyleChange = function () {
        if (!this.publishManager.DisableAll) {
            if (this.publishManager.otherFlag2) {
                this.publishManager.quotaStyleChange();
            }
        }
    }
    //选择配额
    $scope.quotaChange = function (quota) {
        this.publishManager.quotaChange(quota);
        QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
    }
    //设置配额
    $scope.redQuotaUrl = function (event) {
        event.stopPropagation();
        if (QuesEidtData.QuesInfoData.publishStateFlag) {
            confirm(Prompt.SaveTheCurrentPublishChanges, function () {
                SaveQuesPublishMethod($scope, $http, $location, "Quota", "", "", QuesEidtData, publishManager, QQuesSet);
            }, function () {
                QuesEidtData.QuesInfoData.publishStateFlag = false;
                $scope.publishManager.SaveSetFlag = false;//发布设置按钮的可用状态

                $location.path('/QMSet/Quota/' + $scope.publishManager.QuesID);
                $scope.$apply();
            }, "是", "", "否")
        }
        else {
            QuesEidtData.QuesInfoData.publishStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            $scope.publishManager.SaveSetFlag = false;//发布设置按钮的可用状态
            $location.path('/QMSet/Quota/' + $scope.publishManager.QuesID);
        }
    }
    $scope.getQuotaSttyle = function () {
        return "quotaChangeStyle={visibility: 'visible'}";
    }
    //调研期限加减
    $scope.PublishDaysChange = function (value) {
        if (!this.publishManager.DisableAll) {
            this.publishManager.PublishDaysChange(value);
            QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
        }
    }

    //调研期限加减
    $scope.PublishDaysChangeForOnChange = function (value) {
        if (!this.publishManager.DisableAll) {
            this.publishManager.PublishDaysChangeForOnChange(value);
            QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
        }
    }
    //无时限的选择
    $scope.NoTimeLimitSelect = function () {
        if (!this.publishManager.DisableAll) {
            if (this.publishManager.otherFlag2) {
                this.publishManager.NoTimeLimitSelect();
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
        }

    }


    //选择发布方式
    $scope.ReleaseSelect = function (type) {
        if (!this.publishManager.DisableAll) {
            if (this.publishManager.otherFlag2) {
                this.publishManager.ReleaseSelect(type);
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
        }
    }


    //计划发布时间改变 保存按钮控制
    $scope.planHourChange = function () {
        if (!this.publishManager.DisableAll) {
            if (this.publishManager.otherFlag1) {
                this.publishManager.planHourChange();
                QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            }
        }
    }
    //终端选择
    $scope.TerLimitSelect = function (type) {
        if (!this.publishManager.DisableAll) {
            this.publishManager.TerLimitSelect(type);
            QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
        }
    }


    //链接是否带参数
    $scope.parameterSelect = function () {
        if (!this.publishManager.DisableAll) {
            this.publishManager.parameterSelect();
            QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
        }
    }


    //微信收集
    $scope.toggleCollectionEnable = function () {
        if (!this.publishManager.DisableAll) {
            this.publishManager.toggleCollectionEnable();
            QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
        }
    }

    //微信
    $scope.QuesSetWebChatBtnChange = function (isValid, isdirty) {
        this.publishManager.QuesSetWebChatBtnChange(isValid, isdirty);
        QuesEidtData.QuesInfoData.publishStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
    }
    //微信验证并保存
    $scope.WeiChatVerify = function () {
        // wx675c0fa674fb6161                     86d9eb7691c616a288b9123b67df2b97
        if (this.publishManager.WeChatBtnFlag) {
            $http.post('/QM/WechatSave', {
                collID: $scope.publishManager.CollectorID,
                quesID: $scope.publishManager.QuesID,
                microServiceName: this.publishManager.WeChatName,
                appID: this.publishManager.WeChatNameAppID,
                microNum: this.publishManager.WeChatNameId,
                appSecrt: this.publishManager.WeChatAppSecret,
                oauth: "",
                isFocus: "",
                collect: this.publishManager.microLetterChannel
            }).success(function (data) {
                if (data.error == "") {
                    //域名验证
                    $scope.publishManager.CollectorID = data.collID;
                    $scope.WeCharValidation(data.wechatChannelID);
                } else {
                    loadingEnd();
                    alert(data.error, "red");
                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data, $scope);
            });
        }
    }
    //域名验证
    $scope.WeCharValidation = function (wechatChannelID) {
        $http.post('/WeChat/WeCharValidation', {
            appid: $scope.publishManager.WeChatNameAppID,
            secret: $scope.publishManager.WeChatAppSecret,
            collID: $scope.publishManager.CollectorID,
            channelID: wechatChannelID
        }).success(function (data) {
            if (data.errorMessage == "") {
                alert("验证并保存成功！", "green");
                $scope.publishManager.redirect_uri = data.redirect_uri;
                //$scope.publishManager.logoImg = data.logoImg;
                $scope.publishManager.WeichatOauthFlag = true;
                $scope.publishManager.WeChatBtnFlag = false;
                QuesEidtData.QuesInfoData.publishStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息发布的状态
            } else {
                alert("保存成功，但" + data.errorMessage, "red");
            }
            $("#weichat-oauth").val(data.Oauth);
            loadingEnd();
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data, $scope);
        });
    }
    //验证域名
    $scope.QuesSetWebChatOauthBtn = function () {
        if ($scope.publishManager.WeichatOauthFlag) {
            //var logoImage = "/Images/QRCodeLogo.gif";

            //$('#WeixinPreviewURl').empty();
            //$('#WeixinPreviewURl').qrcode({
            //    text: $scope.publishManager.redirect_uri,
            //    height: 312,
            //    width: 312,
            //    src: logoImage

            //});
            $http.post('/Home/CheckSessionLost', {//验证是否过期
            }).success(function (data) {
                if (data.IsSessionLost) {
                    RestLogin(data.Message, $scope);
                }
                else {
                    $scope.CollDown = 2;
                    $("body").addClass("srcollHide");
                    $("#WeixinPreviewURl").attr("src", "");
                    $http.post('/QM/DownLoadQRCode', { quesID: $stateParams.qid, linkSuffix: $stateParams.qid, redirect_uri: $scope.publishManager.redirect_uri }).success(function (data) {
                        if (!data.returnError) {
                            $("#WeixinPreviewURl").attr("src", data.StrPath);
                        } else {
                            alert(data.Message, "red");
                        }
                    }).error(function (data, status, headers, config) {
                        RestLogin(data.Message);
                    });
                }
            })
        }
    }


    //取消发布
    $scope.CanclePublish = function () {
        if (!this.publishManager.DisableAll) {
            if (this.publishManager.cancelLock) {
                confirm("取消后问卷收集器将恢复为未发布状态，是否取消发布当前收集器？", function () {
                    loadingStart();
                    $http.post('/QM/CanclePublish', { collID: $scope.publishManager.CollectorID }).success(function (data) {
                        if (data == "") {
                            alert(Prompt.CancelPublishOK, "green");
                            //刷新信息
                            $scope.Init();
                        } else {
                            alert(data, "red");
                        }
                        loadingEnd();
                    }).error(function (data, status, headers, config) {
                        //处理错误   
                        loadingEnd();
                        RestLogin(data, $scope);
                    });
                    $scope.$digest();
                }, function () { }, "是", "取消发布此收集器", "否")

            }

        }
    }

    //下线
    $scope.CollDown = 0;
    $scope.DownClick = function () {
        if (!this.publishManager.DisableAll) {
            if (this.publishManager.downLock) {
                $("#reason").val("");
                $scope.CollDown = 1;
                $("body").addClass("srcollHide");
            }
        }
    }
    $scope.Down = function () {
        if ($("#reason").val() == "") {
            alert(Prompt.InputOfflineReason, "red");
            return;
        }
        loadingStart();
        $http.post('/QM/Down', { collID: $scope.publishManager.CollectorID, reason: $("#reason").val() }).success(function (data) {
            if (data == "") {
                $scope.cancelClose();
                alert(Prompt.DownAuditSubmit, "green");
                //刷新信息
                $scope.Init();
            } else {
                alert(data, "red");
            }
            loadingEnd();
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data, $scope);
        });
    }

    //关闭弹窗
    $scope.cancelClose = function () {
        $("body").removeClass("srcollHide");
        $scope.CollDown = 0;
    }
    //不关闭小弹窗
    $scope.CancelPopup = function (evt) {
        evt.stopPropagation();
    }
}
]);

//改变日历控件的宽度
function ChangeCalendarCssWidth() {
    var inputWith = parseInt($(".input-number").css("width"));
    if (parseInt($(".input-number").css("width")) == 200) {
        inputWith += 62;
    }
    $(".ui-datepicker").css("width", inputWith + "px");
}
//改变计划发布的选择框和小时数下拉框的宽度
function ChangePlanDateCssWidth() {
    var inputWith = (parseInt($(".input-number").css("width")) - 20) / 2;
    var inputWithPlan = inputWith;
    if (window.innerWidth < 768) {
        $(".HourSelect").css("margin-left", "0px");
    } else {
        $(".HourSelect").css("margin-left", "10px");
    }
    if (parseInt($(".input-number").css("width")) == 200) {
        inputWith = 100;
        inputWithPlan = inputWith + 40;
    }
    $("#planDateDIV").css("width", inputWithPlan + "px");
    $(".HourSelect").css("width", inputWith + "px");

}

$(window).resize(function () {
    setTimeout(function () {
        ChangeCalendarCssWidth();
        ChangePlanDateCssWidth();
    }, 100);
})


/**
*保存问卷发布方法
*tabArgs：问卷设置Tab页参数
*btnArgs：设计问卷、发布问卷按钮参数
*quesBtnArgs：问卷按钮操作参数
*QuesEidtData：保存问卷发布方法所需参数
*/
function SaveQuesPublishMethod($scope, $http, $location, tabArgs, btnArgs, quesBtnArgs, QuesEidtData, publishManager, QQuesSet) {
    $scope.publishManager = publishManager;//调用收集的服务

    //发布数据的非空验证
    //if ($scope.publishManager.publishCount == "" || isNaN($scope.publishManager.publishCount)) {
    //    alert("发布总数不能为空。");
    //    return;
    //}
    //else if ($scope.publishManager.PublishDays == "" || isNaN($scope.publishManager.PublishDays)) {
    //    alert("问卷收集时限不能为空。");
    //    return;
    //}
    //else if ($("#PlanTime").html() == "" && $scope.publishManager.ReleaseType == "2") {
    //    alert("计划发布时间不能为空。");
    //    return;
    //}


    loadingStart();
    $http.post('/QM/SavePublishInfo', {
        collID: $scope.publishManager.CollectorID,
        quesID: $scope.publishManager.QuesID,
        auotaID: $scope.publishManager.QuotaID,
        publishCount: $scope.publishManager.publishCount,
        startDate: $("#PlanTime").val(),
        //startDateHour: $scope.publishManager.planHour + ":00:00",
        publishDays: $scope.publishManager.PublishDays,
        publishType: $scope.publishManager.ReleaseType,
        terLinmitFlag: $scope.publishManager.TerLimitReply,
        anonymousFalg: "",
        returnPreFlag: 'Y',
        microLetterChannel: $scope.publishManager.microLetterChannel,
        microServiceName: $scope.publishManager.WeChatName,
        appID: $scope.publishManager.WeChatNameAppID,
        microNum: $scope.publishManager.WeChatNameId,
        appSecrt: $scope.publishManager.WeChatAppSecret,
        oauth: "",
        isFocus: "",
        collect: $scope.publishManager.microLetterChannel,
        btnType: "",
        parameterFlag: $scope.publishManager.parameterFlag
    }).success(function (data) {
        if (data.errorMessage == "") {
            if (tabArgs != "") {
                QuesSetTabCssActive($scope, tabArgs, QQuesSet);
                $location.path('/QMSet/' + tabArgs + '/' + $scope.publishManager.QuesID);
            }
            if (btnArgs != "") {
                if (btnArgs == "Design") {
                    window.location.href = "/QD/QuestionnairDesign?quesID=" + $scope.publishManager.QuesID;
                } else {
                    $location.path('/QMSet/' + btnArgs + '/' + $scope.publishManager.QuesID);
                    $scope.QQuesSet.QMSetAction = "Publish";
                }
            }
            loadingEnd();
            $scope.publishManager.SaveSetFlag = false;//发布设置按钮的可用状态
            QuesEidtData.QuesInfoData.publishStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息发布的状态;
        } else {
            alert(data.errorMessage, "red");
            loadingEnd();
        }
    }).error(function (data, status, headers, config) {
        //处理错误   
        loadingEnd();
        RestLogin(data, $scope);
    });

}


function changeWeiXinStyle() {
    setTimeout(function () {
        if ($("#jiathis_modal_header")) {
            $("#jiathis_modal_header").css({ "height": "49px", "width": "360px" })
        }
    }, 1000);
}


