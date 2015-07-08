

//创建问卷
function QCreate() {
    this.newFolderID = "";//目录ID
    this.QFBtnSubmitFlag = true;//设计问卷按钮的可用性
    this.QueTitle = "";//问卷标题
    this.InitFolderName = "";//显示的文件夹名称
    this.nullFolder = true;//默认文件夹标识
    this.newFolderName = "";//新增的文件夹名
    this.CreateFolderFlag = "hide";//新建文件夹弹框标识
    this.DataFolderList = "";//文件夹列表
    this.CurrentModelName = "";//当前显示的范本名称
    this.IsSelectFlag = false;//范本是否被选中
    this.QuesID = ""//被选中范本对应的问卷Id
    this.AddMoreFlag = true;
}
zyApp.controller("QuesCreateCtrl", ["$scope", "$stateParams", "$http", "QuesEidtData", "UserPageText", "Unify", "$timeout", "$location",
function ($scope, $stateParams, $http, QuesEidtData, UserPageText, Unify, $timeout, $location) {
    $scope.UserPageText = UserPageText;//初始化页面文字
    $scope.UserPageText.InitPageText();
    $scope.IsDemo = $("#hiddendemotype").val();
    GoHtmlTop();

    $scope.Unify = Unify;////问卷预览服务

    $scope.QCreate = new QCreate;
    $scope.QCreate.newFolderID = $stateParams.fid;//目录ID

    //清空
    $scope.QCreate.QueTitle = "";

    $scope.GoToQM = function () {
        $location.path('/QM');
    }
    $scope.QCreate.CreateFolderFlag = "hide";

    $scope.QFbtnSubmitCssChange = function () {//按钮的可用性
        if ($scope.QCreate.QueTitle == null || $scope.QCreate.QueTitle == "") {
            $scope.QCreate.QFBtnSubmitFlag = true;
        } else {
            $scope.QCreate.QFBtnSubmitFlag = false;
        }
    };


    $timeout(function () { isTouchDevice(); }, 100);
    //提交问卷
    $scope.QuesSubmit = function () {
        //选择了范本
        if ($scope.QCreate.IsSelectFlag) {

            loadingStart()///1oading

            $http.post('/QM/CopyQues', {
                quesID: $scope.QCreate.QuesID, title: $scope.QCreate.QueTitle, folderID: $scope.QCreate.newFolderID
            }).success(function (data) {
                console.log(data);
                if (data.returnValue.returnMessage == "") {
                    $scope.QCreate.QFBtnSubmitFlag = false;
                    loadingEnd();
                    window.location.href = "/QD/QuestionnairDesign?quesID=" + data.returnValue.quesId;

                } else {
                    alert(data.returnValue.returnMessage, "red");
                    loadingEnd();
                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data.sessionLost, $scope);
            });;
        }
        else {
            loadingStart()///1oading
            $http.post('/QM/QuestionnaireEdit', {
                questionID: "", title: $scope.QCreate.QueTitle, descript: "", folderID: $scope.QCreate.newFolderID, templateID: ""
            }).success(function (data) {
                if (data.Message == "") {
                    $scope.QCreate.QFBtnSubmitFlag = false;
                    loadingEnd();
                    window.location.href = "/QD/QuestionnairDesign?quesID=" + data.quesID;
                } else {
                    alert(data.Message, "red");
                    loadingEnd();
                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data, $scope);
            });;
        }


    };
    ///初始化页面
    $scope.Init = function (newIndex, loadingIsEnd) {

        if (loadingIsEnd != 0) {
            loadingStart()///1oading
        }

        $http.post('/QM/GetFolder', {type:"Create"
        }).success(function (data, status, headers, config) {
            $scope.QCreate.DataFolderList = data.FolderList;///文件夹列表
            if (data.FolderList != undefined) {
                if (newIndex == "newIndex") {
                    for (var i = 0; i < $scope.QCreate.DataFolderList.length; i++) {
                        $scope.QCreate.DataFolderList[i].IsSelect = false;
                    }
                    var index = data.FolderList.length;
                    $scope.QCreate.InitFolderName = data.FolderList[index - 1].FolderName;
                    $scope.QCreate.newFolderID = data.FolderList[index - 1].FolderID;
                    $scope.QCreate.DataFolderList[index - 1].IsSelect = true;
                    $scope.QCreate.nullFolder = false;

                }
                //有目录，显示目录
                if ($scope.QCreate.newFolderID != "") {
                    for (var i = 0; i < data.FolderList.length; i++) {
                        if (data.FolderList[i].FolderID == $scope.QCreate.newFolderID) {
                            $scope.QCreate.InitFolderName = data.FolderList[i].FolderName;
                            $scope.QCreate.DataFolderList[i].IsSelect = true;
                            $scope.QCreate.nullFolder = false;
                            return;
                        }
                        if (i == 0) {
                            data.FolderList[0].IsSelect = false;
                        }
                    }
                } else {
                    //显示默认目录
                    $scope.MineFolder();
                }
            } else {
                //显示默认目录
                $scope.MineFolder();
            }

        }).error(function (data, status, headers, config) {
            //处理错误 
            loadingEnd()//结束loading
            RestLogin(data, $scope);
        });
        //初始化范本
        initGetModelType();
    };
    $scope.Init("");
    //打开创建文件夹层
    $scope.CreateFolder = function () {
        $scope.QCreate.newFolderName = "";
        $scope.QCreate.CreateFolderFlag = "Show";//显示创建文件夹层
        $("body").addClass("srcollHide");

        $scope.QCreate.ShowDownFolder = { visibility: 'hidden' };
        $scope.FolderForm.$setPristine();
    }
    //显示默认文件夹
    $scope.MineFolder = function () {
        $scope.QCreate.InitFolderName = "我的文件夹";
        $scope.QCreate.nullFolder = true;
        $scope.QCreate.newFolderID = "";
        for (var i = 0; i < $scope.QCreate.DataFolderList.length; i++) {
            $scope.QCreate.DataFolderList[i].IsSelect = false;
        }
        $scope.QCreate.DataFolderList[0].IsSelect = true;
    }
    ///切换文件夹
    $scope.ChangeFolderCss = function (folder) {
        //切换我的文件夹
        if (folder == "") {
            $scope.MineFolder();
        } else {
            //切换自定义文件夹
            if (folder.FolderName != $scope.QCreate.InitFolderName) {
                for (var i = 0; i < $scope.QCreate.DataFolderList.length; i++) {
                    $scope.QCreate.DataFolderList[i].IsSelect = false;
                }
                $scope.QCreate.nullFolder = false;
                folder.IsSelect = true;
                $scope.QCreate.InitFolderName = folder.FolderName;
                $scope.QCreate.newFolderID = folder.FolderID;
                $scope.ChangeFolderStyle = { display: 'none' };
            }
        }
        console.log($scope.QCreate.newFolderID);
    }
    //新增文件夹
    $scope.SaveNewFolder = function (isValid) {
        if (isValid) {

            loadingStart();//

            $http.post('/QM/SaveFolder', {
                title: $scope.QCreate.newFolderName, folderid: "", isnewsave: 1
            }).success(function (data) {
                ///操作成功
                if (data.Message == "") {
                    alert(Prompt.SaveOK, "green");
                    $scope.QCreate.CreateFolderFlag = "hide";//隐藏创建文件夹层
                    $("body").removeClass("srcollHide");
                    ///重新绑定文件夹列表
                    $scope.LoadingIsEnd = 0;
                    $scope.Init("newIndex", $scope.LoadingIsEnd);
                    loadingEnd();
                } else {
                    alert(data.Message, "red");
                    loadingEnd();
                }
            }).error(function (data, status, headers, config) {
                //处理错误 
                loadingEnd()//结束loading
                RestLogin(data, $scope);
            });;
        }
    }
    //enter 键 esc键 操作   参数type 1：新建问卷夹 
    $scope.enterOrEscOper = function (type) {
        if (window.event.keyCode == 13) {
            if (type == 1) {
                $scope.SaveNewFolder(FolderForm.$valid);
            }
        }
        if (window.event.keyCode == 27) {
            $scope.concelWin();
        }
    }
    $scope.concelWin = function () {
        $scope.QCreate.CreateFolderFlag = "hide";//隐藏创建文件夹层
        $("body").removeClass("srcollHide");
    }

    //范本被选中状态
    $scope.showSelectDiv = function (quesInfo, QuesList) {
        for (var i = 0; i < QuesList.length; i++) {
            QuesList[i].IsSelectFlag = false
            QuesList[i].SelectClass = "";
        }

        quesInfo.IsSelectFlag = true;//显示范本已选择
        quesInfo.SelectClass = "select-sample";//显示范本已选择

        if (quesInfo == QuesList[0]) {//空白范本
            $scope.QCreate.IsSelectFlag = false;
            $scope.QCreate.QuesID = "";
        }
        else {
            $scope.QCreate.IsSelectFlag = quesInfo.IsSelectFlag;
            $scope.QCreate.QuesID = quesInfo.QuesID;
        }

    }
    var currentModelType;
    var pageIndex = 0;
    //加载更多
    $scope.addMoreQues = function () {
        pageIndex = pageIndex + 1;
        $scope.selectModel(currentModelType, $scope.ModelTypeList, 1, pageIndex,false);
    }

    //根据字典表范本分类Id获取该分类下的所有范本
    $scope.selectModel = function (modelType, ModelTypeList, loadingIsEnd, index,isChangeType) {
        if (loadingIsEnd != 0) {
            loadingStart()
        }
        if (isChangeType) {
            pageIndex = 0;
            $scope.QCreate.AddMoreFlag = true;
        }
        $http.post('/QM/GetModelInfoByModelId', {
            valueId: modelType.ValueId,index:index
        }).success(function (data) {
            console.log(data);
            $scope.QuesList = data.QuesList;
            if (data.IsEnd) {
                $scope.QCreate.AddMoreFlag = false;
            }
            for (var i = 0; i < ModelTypeList.length; i++) {
                ModelTypeList[i].IsSelect = false;
            }
            modelType.IsSelect = true;
            currentModelType = modelType;
            $scope.QCreate.CurrentModelName = modelType.ModelTypeName;

            loadingEnd();

        }).error(function (data, status, headers, config) {
            //处理错误 
            loadingEnd()//结束loading
            RestLogin(data, $scope);
        });
    }
    //获取范本类型
    function initGetModelType(loadingIsEnd) {
        $http.post('/QM/GetModelTypeByValueSetId', {
            valuesetId: "61129f64-c3d7-4429-bc45-a368663f888a"
        }).success(function (data) {
            $scope.ModelTypeList = data.ModelTypeList;
            for (var i = 0; i < $scope.ModelTypeList.length; i++) {
                if ($scope.ModelTypeList[i].ModelTypeName == "全部") {
                    currentModelType = $scope.ModelTypeList[i];
                    //页面初始化时显示的范本
                    $scope.selectModel($scope.ModelTypeList[i], $scope.ModelTypeList, loadingIsEnd,0,false);
                }
            }
        }).error(function (data, status, headers, config) {
            //处理错误 
            loadingEnd()//结束loading
            RestLogin(data, $scope);
        });
    }
    //$scope.initGetModelType();

    //查看范本问卷
    $scope.PreViewModel = function (QuesID, event) {
        event.stopPropagation();
        $http.post('/Home/CheckSessionLost', {//验证是否过期
        }).success(function (data) {
            if (data.IsSessionLost) {
                RestLogin(data.Message, $scope);
            }
            else {
                //预览
                $scope.Unify.QuesPreview("#QuesPreviewHref", "#QuesPreviewURl", QuesID);
                $scope.QCreate.CreateFolderFlag = "Preview";
                $("body").addClass("srcollHide");
            }
        })
    }

    //关闭弹窗
    $scope.QuesCreateClose = function () {
        $("body").removeClass("srcollHide");
        $scope.QCreate.CreateFolderFlag = "hide";
    }
    //不关闭小弹窗
    $scope.QuesCreatePopup = function (evt) {
        evt.stopPropagation();
    }

    ///鼠标移动到范本上
    $scope.QuesMouseover = function (ques, queslist) {
        for (var i = 0; i < queslist.length; i++) {
            queslist[i].MoveOver = { opacity: 0 };
        }
        ques.MoveOver = { opacity: 1 };
    }
    ///鼠标离开范本
    $scope.QuesMouseleave = function (queslist) {
        for (var i = 0; i < queslist.length; i++) {
            queslist[i].MoveOver = { opacity: 0 };
        }
    }
}
]);




//问卷摘要
function QSummary() {
    this.CompanyID = "";//公司ID
    this.SummaryQuesTitle = "";//问卷标题
    this.SummaryQuesDescribe = "";//问卷描述
    this.SummaryQFacePpicture = "";//问卷图片
    this.SummaryCreateName = "";//创建时间
    this.SummaryCreateDate = "";//创建人
    this.SummaryUpdateName = "";//修改时间
    this.SummaryUpdateDate = "";//修改人
    this.SummaryNodeNum = "";//节点数
    this.FileSize = "";//文件大小
    this.FileName = "";//文件名
    this.SFSubmitFlag = false;//保存更新按钮的可用性


}
zyApp.controller("SummaryCtrl", ["$scope", "$stateParams", "$http", "$location", "QuesEidtData", "UserPageText", "Unify",
function ($scope, $stateParams, $http, $location, QuesEidtData, UserPageText, Unify) {
    $scope.UserPageText = UserPageText;//初始化页面文字
    $scope.UserPageText.InitPageText();
    GoHtmlTop();


    QuesEidtData.QuesInfoData.qid = $stateParams.qid;//给QuesEidtData服务的保存问卷方法的参数赋值
    $scope.QSummary = new QSummary;
    $('html,body').animate({ 'scrollTop': 0 }, 0);
    //初始化页面方法
    $scope.InitQuesData = function (loadingIsEnd) {

        if (loadingIsEnd != 0) {
            loadingStart();
        }
        //判断是否有该问卷权限
        $http.post('/QM/VerifyRight', { quesID: QuesEidtData.QuesInfoData.qid }).success(function (data) {
            if (data == "NoRight") {
                location.href = '/Error/Error?type=dashboard';
            }
            else {
                $http.post('/QM/GetQuestionInfoByQuesID', { quesID: QuesEidtData.QuesInfoData.qid }).success(function (data) {
                    console.log("节点数1：" + data.NodeNum);
                    if (data.QTitle == undefined) {
                        alert(data, "red");
                        //清空
                        $scope.QSummary.SummaryQuesTitle = "";
                        $scope.QSummary.SummaryQuesDescribe = "";
                    } else {
                        $scope.QSummary.CompanyID = data.CompanyID;
                        $scope.QSummary.SummaryQuesTitle = data.QTitle;
                        $scope.QSummary.SummaryQuesDescribe = data.QDescript;
                        $scope.QSummary.SummaryQFacePpicture = data.QFacePpicture;
                        $scope.QSummary.SummaryCreateName = data.CreateName;
                        $scope.QSummary.SummaryCreateDate = data.CreateDate;
                        $scope.QSummary.SummaryUpdateName = data.UpdateName;
                        $scope.QSummary.SummaryUpdateDate = data.UpdateDate;
                        $scope.QSummary.SummaryNodeNum = data.NodeNum;
                        $scope.QSummary.FileSize = "";
                        $scope.QSummary.FileName = "";
                        $scope.Unify = Unify;
                        $scope.Unify.QuesChange($stateParams.qid);
                        ///上传文件
                        $("#uploadDiv").InitUpload({
                            parentfolder: "\\UploadFiles\\Photo",
                            CompanyID: $scope.QSummary.CompanyID,
                            QuesID: QuesEidtData.QuesInfoData.qid,
                            UType: "1",
                            iscrop: true,
                            LoadingName: "progressbar",
                            Scope: $scope,
                            Http: $http,
                            onQueueComplete: function (e) {
                                ///上传后保存问卷信息
                                loadingStart();
                                $http.post('/QM/SetQFacePpicture', { quesID: QuesEidtData.QuesInfoData.qid, filename: $scope.QSummary.FileName }).success(function (data) {
                                    if (data.IsSuccess) {
                                        alert(Prompt.QuesPicUploadSuccess, "green");
                                    }
                                    loadingEnd();
                                }).error(function (data, status, headers, config) {
                                    //处理错误   
                                    loadingEnd();
                                    RestLogin(data, $scope);
                                });
                            }
                        });
                    }

                    if (loadingIsEnd != 0) {
                        loadingEnd();
                    }
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
        })

    }
    $scope.InitQuesData();
    //输入框变化
    $scope.SFBtnSubmitCssChange = function (isValid, isdirty) {
        if (!isValid || !isdirty) {
            $scope.QSummary.SFSubmitFlag = false;
        } else {
            $scope.QSummary.SFSubmitFlag = true;
            QuesEidtData.QuesInfoData.EditStateFlag = true;//QuesEidtData服务的QuesInfoData问卷信息修改的状态

            //给QuesEidtData服务的保存问卷方法的参数赋值
            QuesEidtData.SaveMethodsArgs.qtitle = $scope.QSummary.SummaryQuesTitle;
            QuesEidtData.SaveMethodsArgs.qdescribe = $scope.QSummary.SummaryQuesDescribe;
        }
    };
    //提交
    $scope.SummarySubmit = function () {

        if ($scope.QSummary.SFSubmitFlag) {
            loadingStart();
            $http.post('/QM/QuestionnaireEdit', {
                questionID: QuesEidtData.QuesInfoData.qid, title: $scope.QSummary.SummaryQuesTitle,
                descript: $scope.QSummary.SummaryQuesDescribe, folderID: "", templateID: ""
            }).success(function (data) {
                if (data.Message == "") {
                    alert(Prompt.SaveOK, "green");

                    $scope.LoadingIsEnd = 0;
                    $scope.InitQuesData($scope.LoadingIsEnd);//刷新问卷信息
                    loadingEnd();
                    $scope.QSummary.SFSubmitFlag = false;
                    QuesEidtData.QuesInfoData.EditStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息修改的状态
                } else {
                    alert(data.Message, "red");
                    loadingEnd();
                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data, $scope);
            });
        }
    };
}
]);






//问卷设置
zyApp.controller("QuesSettingsCtrl", ["$scope", "$stateParams", "$http", "$location", "QuesEidtData", "$window", "publishManager", "Unify", "QuesQuotaInfo", "QQuesSet",
function ($scope, $stateParams, $http, $location, QuesEidtData, $window, publishManager, Unify, QuesQuotaInfo, QQuesSet) {
    $scope.Unify = Unify;//预览服务
    $scope.QQuesSet = QQuesSet;
    $scope.QQuesSet.QQuesSetReset();
    $scope.QSummary = new QSummary;
    $scope.QuesQuota = QuesQuotaInfo;
    $scope.publishManager = publishManager;//调用收集的服务

    isTouchDevice();
    GoHtmlTop();

    //页面刷新时tab保持正确的位置
    $scope.InitTabCss = function () {
        var url = window.location.href;
        if (url.indexOf('/QMSet/Publish/') >= 0) {
            $scope.QQuesSet.QMSetAction = "Publish";
        }
        else if (url.indexOf('/QMSet/Summary/') >= 0) {
            $scope.QQuesSet.QMSetAction = "Summary";
        }
        else if (url.indexOf('/QMSet/Quota/') >= 0) {
            $scope.QQuesSet.QMSetAction = "Quota";
        }
        else if (url.indexOf('/QMSet/AnalyzeResults/') >= 0) {
            $scope.QQuesSet.QMSetAction = "AnalyzeResults";
        }
        else if (url.indexOf('/QMSet/Backups/') >= 0) {
            $scope.QQuesSet.QMSetAction = "Backups";
        }
    }
    $scope.InitTabCss();
    //Tab选中CSS
    $scope.TabCsss = function (pageName) {
        QuesSetTabCssActive($scope, pageName, QQuesSet);
    }

    //判断问卷信息保存状态（摘要状态，发布状态）
    //参数：tab页点击，（设计问卷、发布问卷按钮参数），问卷按钮操作参数
    $scope.judgeQuesSaveState = function (tabArgs, btnArgs, quesBtnArgs) {
        if (quesBtnArgs == "DeleteQues") {
            $location.path('/QM');
        } else {
            //问卷摘要修改的状态
            if (QuesEidtData.QuesInfoData.EditStateFlag) {
                confirm(Prompt.SaveTheCurrentQuesChanges, function () {
                    if (tabArgs != "") {
                        SaveQuesMethod($scope, $http, $location, tabArgs, "", "", QuesEidtData, QQuesSet);
                    } else if (btnArgs != "") {
                        SaveQuesMethod($scope, $http, $location, "", btnArgs, "", QuesEidtData, QQuesSet);
                    } else {
                        if (quesBtnArgs == "moveQues") {
                            //移动问卷
                            $scope.MoveToFolderMethod();
                            SaveQuesMethod($scope, $http, $location, "", "", quesBtnArgs, QuesEidtData, QQuesSet);
                        }
                        else if (quesBtnArgs == "copyQues") {
                            SaveQuesMethod($scope, $http, $location, "", "", quesBtnArgs, QuesEidtData, QQuesSet);
                            //复制问卷
                            $scope.CopyQuesMethod();
                        }
                    }
                    $scope.$digest();
                    //$scope.Unify = Unify;
                    //$scope.Unify.QuesChange($stateParams.qid);
                }, function () {
                    QuesEidtData.QuesInfoData.EditStateFlag = false;
                    $scope.QSummary.SFSubmitFlag = false;
                    if (tabArgs != "") {
                        $scope.TabCsss(tabArgs);
                        $location.path('/QMSet/' + tabArgs + '/' + QuesEidtData.QuesInfoData.qid);
                        $scope.$parent.$digest();
                    }
                    if (btnArgs != "") {
                        if (btnArgs == "Design") {
                            window.location.href = "/QD/QuestionnairDesign?quesID=" + QuesEidtData.QuesInfoData.qid;
                        } else {
                            $location.path('/QMSet/' + btnArgs + '/' + QuesEidtData.QuesInfoData.qid);
                            $scope.$parent.$digest();
                            $scope.QQuesSet.QMSetAction = "Publish";
                        }
                    };
                    $scope.$digest();
                }, "是", "", "否")

            }
                //发布信息的修改状态
            else if (QuesEidtData.QuesInfoData.publishStateFlag) {
                confirm(Prompt.SaveTheCurrentPublishChanges, function () {
                    if (tabArgs != "") {
                        SaveQuesPublishMethod($scope, $http, $location, tabArgs, "", "", QuesEidtData, publishManager, QQuesSet);
                    } else if (btnArgs != "") {
                        SaveQuesPublishMethod($scope, $http, $location, "", btnArgs, "", QuesEidtData, publishManager, QQuesSet);
                    } else {
                        if (quesBtnArgs == "moveQues") {
                            //移动问卷
                            $scope.MoveToFolderMethod();
                            SaveQuesPublishMethod($scope, $http, $location, "", "", quesBtnArgs, QuesEidtData, publishManager, QQuesSet);
                        }
                        else if (quesBtnArgs == "copyQues") {
                            SaveQuesPublishMethod($scope, $http, $location, "", "", quesBtnArgs, QuesEidtData, publishManager, QQuesSet);
                            //复制问卷
                            $scope.CopyQuesMethod();
                        }
                    }
                    $scope.$digest();
                }, function () {
                    QuesEidtData.QuesInfoData.publishStateFlag = false;
                    $scope.publishManager.SaveSetFlag = false;//发布设置按钮的可用状态
                    if (tabArgs != "") {
                        $scope.TabCsss(tabArgs);
                        $location.path('/QMSet/' + tabArgs + '/' + QuesEidtData.QuesInfoData.qid);
                        $scope.$parent.$digest();
                    }
                    if (btnArgs != "") {
                        if (btnArgs == "Design") {
                            window.location.href = "/QD/QuestionnairDesign?quesID=" + QuesEidtData.QuesInfoData.qid;
                        } else {
                            $location.path('/QMSet/' + btnArgs + '/' + QuesEidtData.QuesInfoData.qid);
                            $scope.$parent.$digest();
                            $scope.QQuesSet.QMSetAction = "Publish";
                        }
                    }
                    $scope.$digest();
                }, "是", "", "否")
            }
            else if ($scope.QuesQuota.ShowCreateTableBtn || SaveQuotaFlag) {//配额信息的修改状态
                confirm(Prompt.SaveTheCurrentQuotaChanges, function () {
                    if (tabArgs != "") {
                        SaveQuotaInfoByTab($scope, $http, $location, tabArgs, "", "", QuesEidtData, QuesQuotaInfo, QQuesSet);
                    } else if (btnArgs != "") {
                        SaveQuotaInfoByTab($scope, $http, $location, "", btnArgs, "", QuesEidtData, QuesQuotaInfo, QQuesSet);
                    } else {
                        if (quesBtnArgs == "moveQues") {
                            //移动问卷
                            $scope.MoveToFolderMethod();
                            SaveQuotaInfoByTab($scope, $http, $location, "", "", quesBtnArgs, QuesEidtData, QuesQuotaInfo, QQuesSet);
                        }
                        else if (quesBtnArgs == "copyQues") {
                            SaveQuotaInfoByTab($scope, $http, $location, "", "", quesBtnArgs, QuesEidtData, QuesQuotaInfo, QQuesSet);
                            //复制问卷
                            $scope.CopyQuesMethod();
                        }
                    }
                    $scope.$digest();
                }, function () {
                    $scope.QuesQuota.ShowCreateTableBtn = false;
                    SaveQuotaFlag = false;
                    if (tabArgs != "") {
                        $scope.TabCsss(tabArgs);
                        $location.path('/QMSet/' + tabArgs + '/' + QuesEidtData.QuesInfoData.qid);
                        $scope.$parent.$digest();
                    }
                    if (btnArgs != "") {
                        if (btnArgs == "Design") {
                            window.location.href = "/QD/QuestionnairDesign?quesID=" + QuesEidtData.QuesInfoData.qid;
                        } else {
                            $location.path('/QMSet/' + btnArgs + '/' + QuesEidtData.QuesInfoData.qid);
                            $scope.$parent.$digest();
                            $scope.QQuesSet.QMSetAction = "Publish";
                        }
                    }
                    $scope.$digest();
                }, "是", "", "否")
            }
            else {
                if (tabArgs != "") {
                    $scope.TabCsss(tabArgs);
                    $location.path('/QMSet/' + tabArgs + '/' + QuesEidtData.QuesInfoData.qid);
                }
                if (btnArgs != "") {
                    if (btnArgs == "Design") {
                        window.location.href = "/QD/QuestionnairDesign?quesID=" + QuesEidtData.QuesInfoData.qid;
                    } else {
                        $location.path('/QMSet/' + btnArgs + '/' + QuesEidtData.QuesInfoData.qid);
                        $scope.QQuesSet.QMSetAction = "Publish";
                    }
                }
                if (quesBtnArgs != "") {//移动问卷复制问卷
                    if (quesBtnArgs == "moveQues") {
                        //移动问卷
                        $scope.MoveToFolderMethod();
                    }
                    else if (quesBtnArgs == "copyQues") {
                        //复制问卷
                        $scope.CopyQuesMethod();
                    }
                }
            }
        }
    }

    //移动到文件夹，去掉当前问卷所属的文件夹
    $scope.MoveToFolderMethod = function () {
        //<初始绑定当前问卷的文件夹>
        $http.post('/QM/GetQuestionInfoByQuesID', { quesID: QuesEidtData.QuesInfoData.qid }).success(function (data) {
            $scope.CurrentQuesFolder = data.FolderMark;
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data, $scope);
        })
        //绑定文件夹
        var array = new Array();
        $http.get('/QM/GetFolder', {
        }).success(function (data) {
            if (data.FolderList != undefined) {
                if ($scope.CurrentQuesFolder != "00000000-0000-0000-0000-000000000000") {
                    $scope.MyFolderFlag = true;
                    for (var i = 0; i < data.FolderList.length; i++) {
                        if (data.FolderList[i].FolderID != $scope.CurrentQuesFolder) {
                            array.push(data.FolderList[i]);
                        }
                    }
                    $scope.QQuesSet.QuesSetInitFolder = "我的文件夹";//默认选中值
                    $scope.QQuesSet.QuesSetSelectFID = "";//默认选中值
                    $scope.QQuesSet.QuesSetFolderList = array;///文件夹列表
                    //移动文件夹框
                    $scope.QQuesSet.QuesBtnFlag = 1;
                    $("body").addClass("srcollHide");
                } else {
                    $scope.MyFolderFlag = false;
                    $scope.QQuesSet.QuesSetFolderList = data.FolderList;///文件夹列表
                    if (data.FolderList.length > 0) {
                        $scope.QQuesSet.QuesSetInitFolder = data.FolderList[0].FolderName;//默认选中值
                        $scope.QQuesSet.QuesSetSelectFID = data.FolderList[0].FolderID;//默认选中值
                        //移动文件夹框
                        $scope.QQuesSet.QuesBtnFlag = 1;
                        $("body").addClass("srcollHide");
                    } else {
                        alert("请先创建文件夹。", "red");
                    }
                }
            }
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data, $scope);
        });
    }


    //Tab切换
    $scope.QuesSettTab = function (pageName) {
        $scope.judgeQuesSaveState(pageName, "", "");
    }

    //预览
    $scope.PreViewCode = function (event) {
        event.stopPropagation();
        
        $http.post('/Home/CheckSessionLost', {//验证是否过期
        }).success(function (data) {
            if (data.IsSessionLost) {
                RestLogin(data.Message, $scope);
            }
            else {
                //预览
                $scope.Unify.QuesPreview("#QuesPreviewHref", "#QuesPreviewURl", QuesEidtData.QuesInfoData.qid);
                $scope.QQuesSet.QuesBtnFlag = 3;
                $("body").addClass("srcollHide");
            }
        })
    }

    //设计问卷、发布问卷按钮
    $scope.QuesSettBtn = function (pageName) {
        $scope.judgeQuesSaveState("", pageName, "");
    }


    //enter 键 esc键 操作   参数type 1：删除问卷操作 
    $scope.enterOrEscOper = function (type) {
        if (window.event.keyCode == 13) {
            if (type == 1) {
                $scope.QuesSetDelQuesByPwd();
            }
        }
        if (window.event.keyCode == 27) {
            $scope.cancelCon();
        }
    }
    //问卷按钮操作参数
    $scope.QQuesSet.QuesBtnFlag = 0;
    //移动问卷
    $scope.QuesSetMoveQues = function () {
        $scope.judgeQuesSaveState("", "", "moveQues");
    }
    //选择移动的文件夹
    $scope.SelectMoveFolder = function (id, name) {
        $scope.QQuesSet.QuesSetInitFolder = name;
        $scope.QQuesSet.QuesSetSelectFID = id;
        $scope.QQuesSet.QuesSetFolderSelect = { display: 'none' };
        //$scope.QQuesSet.ShowDownFolder = { visibility: 'hidden' };
        closeAll("ul.downul");
    }
    //保存问卷移动的数据
    $scope.SaveMoveFolderData = function () {
        $http.post('/QM/MoveQuesToFolder', {
            quesID: QuesEidtData.QuesInfoData.qid, targeid: $scope.QQuesSet.QuesSetSelectFID
        }).success(function (data) {
            ///操作成功
            if (data.Message == "") {
                $scope.cancelCon();
                alert(Prompt.QuotaSuccessfulOperation, "green");
            } else {
                alert(data.Message, "red");
            }
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data, $scope);
        });
    }
    //复制问卷方法
    $scope.CopyQuesMethod = function () {
           
        loadingStart();
        $http.post('/QM/CopyQues', {
            quesID: QuesEidtData.QuesInfoData.qid
        }).success(function (data) {
            ///操作成功
            if (data.returnValue.returnMessage == "") {
                alert(Prompt.QuesCopyOK, "green");

            } else {
                alert(data.returnValue.returnMessage, "red");
            }
            loadingEnd();
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data.sessionLost, $scope);
        });
    }
    //复制问卷
    $scope.QuesSetCopyQues = function () {
        $scope.judgeQuesSaveState("", "", "copyQues");
    }

    //删除问卷
    $scope.OpenDelQues = function () {
        $scope.QQuesSet.QuesBtnFlag = 2;
        $("body").addClass("srcollHide");
        $scope.QQuesSet.DelPassWord = "";
        $("#delMessage").css("display", "none");
    }
    $scope.QuesSetDelQuesByPwd = function () {
        //$scope.judgeQuesSaveState("", "", "DeleteQues");
        if ($("#delete-survey").val() != "choiceform") {
            //alert("您输入的choice form不正确，请重新输入。","red");
            //return;
            $("#delMessage").css("display", "block");
            return;
        }

        $http.post('/QM/DelQues', {
            quesID: QuesEidtData.QuesInfoData.qid
        }).success(function (data) {
            ///操作成功
            if (data.Message == "") {
                $("body").removeClass("srcollHide");
                alert(Prompt.QuotaSuccessfulOperation, "green");
                $location.path('/QM');
            } else {
                alert(data.Message, "red");
            }
        });
    }

    //关闭弹层
    $scope.cancelCon = function () {
        $scope.QQuesSet.QuesBtnFlag = 0;
        $("body").removeClass("srcollHide");
    }
    ///设置点击背景不关闭弹层
    $scope.CancelPopup = function (evt) {
        evt.stopPropagation();
    }

}
]);


/**
Tab选中样式
*/
function QuesSetTabCssActive($scope, pageName, QQuesSet) {
    $scope.QQuesSet = QQuesSet;
    if (pageName == "Summary") {
        $scope.QQuesSet.QMSetAction = "Summary";
    } else if (pageName == "Preview") {
        $scope.QQuesSet.QMSetAction = "Preview";
    } else if (pageName == "Quota") {
        $scope.QQuesSet.QMSetAction = "Quota";
    } else if (pageName == "Publish") {
        $scope.QQuesSet.QMSetAction = "Publish";
    } else if (pageName == "AnalyzeResults") {
        $scope.QQuesSet.QMSetAction = "AnalyzeResults";
    } else if (pageName == "Backups") {
        $scope.QQuesSet.QMSetAction = "Backups";
    }
}

/**
*保存问卷方法
*tabArgs：问卷设置Tab页参数
*btnArgs：设计问卷、发布问卷按钮参数
*folderArgs：问卷按钮操作参数
*QuesEidtData：保存问卷方法所需参数
*/
function SaveQuesMethod($scope, $http, $location, tabArgs, btnArgs, quesBtnArgs, QuesEidtData, QQuesSet) {
    $scope.QQuesSet = QQuesSet;
    $scope.QSummary = new QSummary;
    $http.post('/QM/QuestionnaireEdit', {
        questionID: QuesEidtData.QuesInfoData.qid, title: QuesEidtData.SaveMethodsArgs.qtitle,
        descript: QuesEidtData.SaveMethodsArgs.qdescribe, folderID: "", templateID: ""
    }).success(function (data) {
        if (data.Message == "") {
            if (tabArgs != "") {
                QuesSetTabCssActive($scope, tabArgs, QQuesSet);
                $location.path('/QMSet/' + tabArgs + '/' + QuesEidtData.QuesInfoData.qid);
            }
            if (btnArgs != "") {
                if (btnArgs == "Design") {
                    window.location.href = "/QD/QuestionnairDesign?quesID=" + QuesEidtData.QuesInfoData.qid;
                } else {
                    $location.path('/QMSet/' + btnArgs + '/' + QuesEidtData.QuesInfoData.qid);
                    $scope.QQuesSet.QMSetAction = "Publish";
                }
            }
            $scope.QSummary.SFSubmitFlag = false;
            QuesEidtData.QuesInfoData.EditStateFlag = false;//QuesEidtData服务的QuesInfoData问卷信息修改的状态
        } else {
            alert(data.Message, "red");
        }
    }).error(function (data, status, headers, config) {
        //处理错误   
        loadingEnd();
        RestLogin(data, $scope);
    });
}
