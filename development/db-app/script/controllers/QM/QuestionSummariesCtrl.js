
function QuestionSummaries() {  
    this.SummariesList = new Array();
    this.DataViewInfoList = new Array();
    this.DataOutputList = new Array();
    this.InitDataListList = new Array();
    this.DataListList = new Array();
    this.AddShowRule = false;
    this.IsShowView = false;
    this.InitNodeList = new Array();
    this.ShowNodeList = new Array();
    this.ShowNodeAllSelect = false;
    this.ShowNodeReverseSelect =false;
    this.EditShowID = "";
    this.SelectViewID = "";
    this.AddSelectRule = false;
    this.FilterType = 0;
    this.ShowSetName = "显示设置";
    this.IsShowAddButton = true;
    this.ChartList = new Array();
    this.IsShowOutView = false;
    this.QNumber = "";
}
function QuestionSummariesNode()
{
    this.NodeID = "";
    this.NodeName = "";
    this.NodeTitle = "";
    this.IsSelect = false;
    this.CheckClass = "checkbox-none"
}
zyApp.controller("QuestionSummariesCtrl", ["$scope", "$stateParams", "$http", "$location", "QuesEidtData", "$timeout", "Unify", "DataOutputInfo",
function ($scope, $stateParams, $http, $location, QuesEidtData, $timeout, Unify, DataOutputInfo) {

    loadingStart();
    GoHtmlTop();
    $scope.IsDemo = $("#hiddendemotype").val();
    var dt = new QuestionSummaries;
    $scope.QuestionSummaries = dt;
    $scope.QuestionSummaries.Popupbackground = 0;
    ////判断是否有该问卷权限
    $http.post('/QM/VerifyRight', { quesID: $stateParams.qid }).success(function (data) {
        if (data == "NoRight") {
            location.href = '/Error/Error?type=dashboard';
        }
        else {
            $scope.Unify = Unify;//问卷标题(页面整体刷新时调用)
            $scope.DataOutputInfo = DataOutputInfo;// 
            $scope.Unify.QuesChange($stateParams.qid);
            QuesEidtData.QuesInfoData.qid = $stateParams.qid;//给QuesEidtData服务的保存问卷方法的参数赋值

            $scope.QuestionSummaries.DataOutputList = $scope.DataOutputInfo.dataOutputList
            if ($scope.DataOutputInfo.dataOutputList!=null && $scope.DataOutputInfo.dataOutputList.length > 0) {
                $scope.QuestionSummaries.IsShowOutView = true;
            }
            else {
                $scope.QuestionSummaries.IsShowOutView = false;
            }

            loadingEnd();
           

            $scope.BindDataViewInfo();
            $scope.BindDataOutputInfo(); 
           
        }
    }).error(function (data, status, headers, config) {
        //处理错误   
        loadingEnd();
        RestLogin(data);
    });



    //tab选中样式
    $scope.AnalyzeResultTabSelect = function () {

        $location.path("/QMSet/AnalyzeResults/" + QuesEidtData.QuesInfoData.qid + "/DataTrends");
    }

    ///绑定右边信息(输出规则）
    $scope.BindDataViewInfo = function () {
        loadingStart();
        $http.get('/QM/GetQuestionSummariesViewByDataViewInfo', { params: { quesID: QuesEidtData.QuesInfoData.qid } }).success(function (data, status, headers, config) {

            if (data.IsTrue) {
                //$scope.QuestionSummaries.DataViewInfoList = data.DataViewList;
                $scope.QuestionSummaries.IsShowView = true;
                $scope.QuestionSummaries.InitNodeList = data.NodeList;
                $scope.QuestionSummaries.InitDataListList = data.DataListList;
                $scope.QuestionSummaries.SelectViewID = data.SelectViewID;
                $scope.QuestionSummaries.QNumber = data.QNumber;
                //for (var i = 0; i < data.DataViewList.length; i++) {
                //    if (data.DataViewList[i].RadioCss == "radio-check") {
                //        if (data.DataViewList[i].ID == "") {
                //            $scope.QuestionSummaries.IsShowView = false;
                //        }
                //        else { 
                //        }
                //    }

                //}

                $scope.ChangeShowRule();
                $scope.BindData();

            }
            else {
                alert(data.Message,"red");
                loadingEnd();
            }




            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data);
        });
    }
    $scope.ChangeShowRule = function () {
        
        $scope.QuestionSummaries.DataListList = new Array();
        ///生成显示内容
        for (var j = 0; j < $scope.QuestionSummaries.InitDataListList.length; j++) { 
            $scope.QuestionSummaries.DataListList.push(angular.copy($scope.QuestionSummaries.InitDataListList[j])); 

        } 

        $timeout(function () { isTouchDevice(); }, 100);
   
    }
    ///弹出层输出规则名称修改
    $scope.OpenEditViewRule = function (DataView) {
        $("body").addClass("srcollHide");
        $scope.QuestionSummaries.EditViewID = DataView.ID;
        $scope.QuestionSummaries.Popupbackground = 2;
        $scope.QuestionSummaries.SelectViewChangeName = DataView.Name;

    }
    ///创建输出规则
    $scope.AddViewRule = function () {
        loadingStart();
        $http.post('/QM/SavePMDataView', { id: "", quesID: QuesEidtData.QuesInfoData.qid, viewname: "" }).success(function (data) {
            if (data.IsTrue) {
                $scope.QuestionSummaries.DataViewInfoList = data.DataViewList;
                $scope.QuestionSummaries.SelectViewID = data.SelectViewID;

                for (var i = 0; i < data.DataViewList.length; i++) {    
                    if (data.DataViewList[i].RadioCss == "radio-check") {
                        if (data.DataViewList[i].ID == "") {
                            $scope.QuestionSummaries.IsShowView = false;
                        }
                        else {
                            $scope.QuestionSummaries.IsShowView = true;

                        }
                    }

                }
                $scope.ChangeShowRule();
                $scope.BindData();


            }
            else {
                alert(data.Message,"red");

            }

            loadingEnd();


            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data);
        });
    }
    ///切换输出规则
    $scope.SelectDataViewInfo = function (selectDataView) {
        for (var i = 0; i < $scope.QuestionSummaries.DataViewInfoList.length; i++) {
            if (selectDataView.ID == $scope.QuestionSummaries.DataViewInfoList[i].ID) {

                $scope.QuestionSummaries.DataViewInfoList[i].IsSelect = true;
                $scope.QuestionSummaries.DataViewInfoList[i].RadioCss = "radio-check";

                $scope.QuestionSummaries.SelectViewID = $scope.QuestionSummaries.DataViewInfoList[i].ID;
                if ($scope.QuestionSummaries.DataViewInfoList[i].ID == "") {
                    $scope.QuestionSummaries.IsShowView = false;
                }
                else {
                    $scope.QuestionSummaries.IsShowView = true;

                }
            }
            else {
                $scope.QuestionSummaries.DataViewInfoList[i].IsSelect = false;
                $scope.QuestionSummaries.DataViewInfoList[i].RadioCss = "radio-none";

            }

        }
        $scope.ChangeShowRule();
        $scope.BindData();

    }
   
    ///保存修改输出视图名称
    $scope.EditViewChangeName = function (isValid) {
        if (isValid) {
            $http.post('/QM/ChangeViewRuleName', {
                id: $scope.QuestionSummaries.EditViewID, name: $scope.QuestionSummaries.SelectViewChangeName
            }).success(function (data) {
                ///操作成功
                if (data.IsTrue) {
                    ///隐藏层
                    $scope.CloseDiv();
                    alert(Prompt.AnalyticResult_SuccessfulOperation,"green");//操作成功


                    for (var i = 0; i < $scope.QuestionSummaries.DataViewInfoList.length; i++) {
                        if ($scope.QuestionSummaries.DataViewInfoList[i].ID == $scope.QuestionSummaries.EditViewID) {
                            $scope.QuestionSummaries.DataViewInfoList[i].Name = $scope.QuestionSummaries.SelectViewChangeName;
                        }

                    }

       


                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data);
            });;
        }
    }
    ///删除视图规则
    $scope.DelDataView=function(dataview)
    { 
        //是否要删除输出规则？
        confirm(Prompt.AnalyticResult_IsDeleteOutRule, function () {

            var tmpdataview = new Array();
            for (var i = 0; i < $scope.QuestionSummaries.DataViewInfoList.length; i++) {
                if (dataview.ID != $scope.QuestionSummaries.DataViewInfoList[i].ID) {
                    tmpdataview.push($scope.QuestionSummaries.DataViewInfoList[i]);
                }
            }
            $scope.QuestionSummaries.DataViewInfoList = tmpdataview;
            if (dataview.IsSelect) {
                for (var i = 0; i < $scope.QuestionSummaries.DataViewInfoList.length; i++) {
                    if ($scope.QuestionSummaries.DataViewInfoList[i].ID == "") {
                        $scope.QuestionSummaries.IsShowView = false;
                        $scope.QuestionSummaries.DataViewInfoList[i].IsSelect = true;
                        $scope.QuestionSummaries.DataViewInfoList[i].RadioCss = "radio-check";
                    } else {
                        $scope.QuestionSummaries.DataViewInfoList[i].IsSelect = false;
                        $scope.QuestionSummaries.DataViewInfoList[i].RadioCss = "radio-none";

                    }
                }
                alert("删除成功", "green");
                $scope.ChangeShowRule();
                $scope.BindData();
            }
            $http.post('/QM/DeleteViewRule', { id: dataview.ID }).success(function (data) {
               
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data);
            });
            $scope.$digest();
        }, function () { }, "是", "", "否")
    }
    ///弹出层设置导出规则
    $scope.OpenDownLoadInfo=function()
    {
        $("body").addClass("srcollHide");
        $scope.QuestionSummaries.Popupbackground = 2;
        $scope.QuestionSummaries.DataTabClass = 1;
        $scope.QuestionSummaries.DataViewType = 1;
        $scope.QuestionSummaries.DataAnalysisViewType = 1;
        $scope.QuestionSummaries.DataAnalysisViewFileType = 1;
        $scope.QuestionSummaries.DataViewSelectText = true;
        $scope.QuestionSummaries.DataViewSelectValue = false;
        $scope.QuestionSummaries.IsCreateFileIng = false;

        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
    //    alert(year+'年'+month+'月'+day+'日 '+hour':'+minute+':'+second)
        $scope.QuestionSummaries.DataViewTypeDownLoadFileName = $scope.QuestionSummaries.QNumber + "结果数据" + year + month + day + hour + minute + second;
        $scope.QuestionSummaries.DataAnalysisViewTypeDownLoadFileName = $scope.QuestionSummaries.QNumber + "汇总数据" + year + month + day + hour + minute + second;
      //  $scope.$digest();

    }
    $scope.CreateFileInfo = function () {
        if ($scope.QuestionSummaries.IsCreateFileIng == false) {

            if ($scope.QuestionSummaries.DataTabClass == 1) {
                if (!$scope.QuestionSummaries.DataViewSelectText && !$scope.QuestionSummaries.DataViewSelectValue) {
                    alert("请选择数据内容。", "red");
                    return;
                }
                if ($scope.QuestionSummaries.DataViewTypeDownLoadFileName == "") {
                    alert("请输入文件名。", "red");
                    return;
                }
                $scope.QuestionSummaries.DataViewTypeDownLoadFileName = $scope.QuestionSummaries.DataViewTypeDownLoadFileName + ".xlsx"
                ///数据结果导出excel
                $scope.DownLoadAll($scope.QuestionSummaries.DataViewType);
            }
            else {
                if ($scope.QuestionSummaries.DataAnalysisViewTypeDownLoadFileName == "") {
                    alert("请输入文件名。", "red");
                    return;
                }
                if ($scope.QuestionSummaries.DataAnalysisViewFileType == 1) {
                    $scope.QuestionSummaries.DataAnalysisViewTypeDownLoadFileName = $scope.QuestionSummaries.DataAnalysisViewTypeDownLoadFileName + ".pdf"
                    ///数据分析导出PDF
                    $scope.DownLoadAllPDF($scope.QuestionSummaries.DataAnalysisViewType);
                }
                else {

                    $scope.QuestionSummaries.DataAnalysisViewTypeDownLoadFileName = $scope.QuestionSummaries.DataAnalysisViewTypeDownLoadFileName + ".xlsx"
                    ///数据分析导出PDF
                    $scope.DownLoadAllExcelByDataAnalysis($scope.QuestionSummaries.DataAnalysisViewType);
                }
            }
            $scope.QuestionSummaries.IsCreateFileIng = true;
           // $scope.CloseDiv();
        }
    }
  ///导出excel数据分析
    $scope.DownLoadAllExcelByDataAnalysis = function (isallinfo) {

        loadingStart()
        


        $http.post('/QM/CreateExcelFileDataAnalysis', { quesID: QuesEidtData.QuesInfoData.qid, dataViewname: "", dataviewID: "", isallinfo: isallinfo, downloadFile: $scope.QuestionSummaries.DataAnalysisViewTypeDownLoadFileName }).success(function (data) {
            if (data.IsTrue) {

                loadingStart();
                ///隐藏层
                $scope.CloseDiv();
                alert("输出结果生成完成。", "green");
                $http.get('/QM/GetQuestionSummariesViewByDataOutputInfo', { params: { quesID: QuesEidtData.QuesInfoData.qid } }).success(function (data, status, headers, config) {

                    if (data.IsTrue) {
                        $scope.DataOutputInfo.dataOutputList = data.DataOutputList;

                        if ($scope.DataOutputInfo.dataOutputList != null && $scope.DataOutputInfo.dataOutputList.length > 0) {
                            $scope.QuestionSummaries.IsShowOutView = true;
                        }
                        else {
                            $scope.QuestionSummaries.IsShowOutView = false;
                        }

                        $timeout(function () { isTouchDevice(); }, 100);

                    }
                    else {
                        alert(data.Message, "red");
                    }

                    loadingEnd();



                    //加载成功之后做一些事  
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingEnd();
                    RestLogin(data);
                });

            }
            else {
                alert(data.Message, "red")
            }
            loadingEnd();
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data);
        });


    }
    ///导出PDF数据分析
    $scope.DownLoadAllPDF = function (isallinfo) {

        loadingStart()
        var imglist = new Array();
        for (var i = 0; i < $scope.QuestionSummaries.ChartList.length; i++) {
            imglist.push($scope.QuestionSummaries.ChartList[i].getDataURL("jpeg"));
        }


        $http.post('/QM/CreatePDFFileDataAnalysis', { quesID: QuesEidtData.QuesInfoData.qid, dataViewname: "", dataviewID: "", imageinfolist: imglist, isallinfo: isallinfo, downloadFile: $scope.QuestionSummaries.DataAnalysisViewTypeDownLoadFileName }).success(function (data) {
            if (data.IsTrue) {

                loadingStart();
                ///隐藏层
                $scope.CloseDiv();
                alert("输出结果生成完成。", "green");
                $http.get('/QM/GetQuestionSummariesViewByDataOutputInfo', { params: { quesID: QuesEidtData.QuesInfoData.qid } }).success(function (data, status, headers, config) {

                    if (data.IsTrue) {
                        $scope.DataOutputInfo.dataOutputList = data.DataOutputList;

                        if ($scope.DataOutputInfo.dataOutputList != null && $scope.DataOutputInfo.dataOutputList.length > 0) {
                            $scope.QuestionSummaries.IsShowOutView = true;
                        }
                        else {
                            $scope.QuestionSummaries.IsShowOutView = false;
                        }

                        $timeout(function () { isTouchDevice(); }, 100);

                    }
                    else {
                        alert(data.Message, "red");
                    }

                    loadingEnd();



                    //加载成功之后做一些事  
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingEnd();
                    RestLogin(data);
                });

            }
            else {
                alert(data.Message, "red")
            }
            loadingEnd();
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data);
        });


    }

    ///导出Excel数据结果
    $scope.DownLoadAll = function (isallinfo) {

        loadingStart()
        var contenttype = "0";
        if ($scope.QuestionSummaries.DataViewSelectText && $scope.QuestionSummaries.DataViewSelectValue)
            contenttype = "3";
        else if ($scope.QuestionSummaries.DataViewSelectText)
            contenttype = "1"
        else if ($scope.QuestionSummaries.DataViewSelectValue)
            contenttype = "2"

        $http.post('/QM/CreateFile', { quesID: QuesEidtData.QuesInfoData.qid, dataViewname: "", dataviewID: "", isallinfo: isallinfo, downloadFile: $scope.QuestionSummaries.DataViewTypeDownLoadFileName, dataType: contenttype }).success(function (data) {
            if (data.IsTrue) {
                //$scope.DataOutputInfo.BindDataOutputInfo(QuesEidtData.QuesInfoData.qid); 
                loadingStart();

                ///隐藏层
                $scope.CloseDiv();
                alert("输出结果生成完成。", "green");
                $http.get('/QM/GetQuestionSummariesViewByDataOutputInfo', { params: { quesID: QuesEidtData.QuesInfoData.qid } }).success(function (data, status, headers, config) {

                    if (data.IsTrue) {
                        $scope.DataOutputInfo.dataOutputList = data.DataOutputList;

                        if ($scope.DataOutputInfo.dataOutputList != null && $scope.DataOutputInfo.dataOutputList.length > 0) {
                            $scope.QuestionSummaries.IsShowOutView = true;
                        }
                        else {
                            $scope.QuestionSummaries.IsShowOutView = false;
                        }

                        $timeout(function () { isTouchDevice(); }, 100);

                    }
                    else {
                        alert(data.Message, "red");
                    }

                    loadingEnd();



                    //加载成功之后做一些事  
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingEnd();
                    RestLogin(data);
                });

            }
            else {
                alert(data.Message, "red")
            }
            loadingEnd();
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data);
        });





    }












    ///绑定右边信息(输出结果）
    $scope.BindDataOutputInfo = function () {
        loadingStart();
        //$scope.DataOutputInfo.BindDataOutputInfo(QuesEidtData.QuesInfoData.qid);
        //$scope.QuestionSummaries.DataOutputList = $scope.DataOutputInfo.dataOutputList;



        $http.get('/QM/GetQuestionSummariesViewByDataOutputInfo', { params: { quesID: QuesEidtData.QuesInfoData.qid } }).success(function (data, status, headers, config) {

            if (data.IsTrue) {
                $scope.DataOutputInfo.dataOutputList = data.DataOutputList;
                if ($scope.DataOutputInfo.dataOutputList != null && $scope.DataOutputInfo.dataOutputList.length > 0) {
                    $scope.QuestionSummaries.IsShowOutView = true;
                }
                else {
                    $scope.QuestionSummaries.IsShowOutView = false;
                }

                $timeout(function () { isTouchDevice(); }, 100);

            }
            else {
                alert(data.Message,"red");
            }

            loadingEnd();



            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data);
        });

     
}
    ///显示输出结果数据
    $scope.ShowDataOutputInfo = function (selectDataoutput) {
        for (var i = 0; i < $scope.DataOutputInfo.dataOutputList.length; i++) {
            if (selectDataoutput.ID == $scope.DataOutputInfo.dataOutputList[i].ID) {

                $scope.DataOutputInfo.dataOutputList[i].IsShowDownLoad = false;
                if ($scope.DataOutputInfo.dataOutputList[i].IsShowInfo) {
                    $scope.DataOutputInfo.dataOutputList[i].IsShowInfo = false;
                    $scope.DataOutputInfo.dataOutputList[i].ShowFileName = "显示文件详情";
                }
                else {
                    $scope.DataOutputInfo.dataOutputList[i].IsShowInfo = true;
                    $scope.DataOutputInfo.dataOutputList[i].ShowFileName = "隐藏文件详情";

                }
            }


        }

    }
    $scope.GotoUrl = function (url,name) {
     
             
           
                //
            $http.post('/QM/IsExisFile', {url: url }).success(function (data) {
                if (data.IsTrue) {
                    window.location.href = "/QM/PDFDownLoad?name=" + escape(name) + "&url=" + escape(url);
                }else{
                    alert("文件不存在。", "red")

                }
            }).error(function (data, status, headers, config) {
               alert("文件不存在。","red")
            });
       
    }
    $scope.DelDataOutput = function (id, url) {
        //是否要删除输出结果
        confirm(Prompt.AnalyticResult_IsDeleteOutResult, function () {
            loadingStart()


            $http.post('/QM/DelDataOutput', { dataoutputid: id, url: url }).success(function (data) {
                if (data.IsTrue) {
                    ///   window.location.href = data.Message;
                    $scope.BindDataOutputInfo();

                    alert("删除成功", "green");
                }
                else {
                    alert(data.Message,"red")
                }
                loadingEnd();
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data);
            });
            $scope.$digest();
        }, function () { }, "是", "", "否")
    }
    ///创建文件
    $scope.CreateFile = function () {
        //是否要生成输出文件
        confirm(Prompt.AnalyticResult_IsDeleteOutFile, function () {
            loadingStart()
            var dataviewname = "";
            var dataviewID = "";
            //for (var i = 0; i < $scope.QuestionSummaries.DataViewInfoList.length; i++) {
            //    if ($scope.QuestionSummaries.DataViewInfoList[i].IsSelect) {
            //        dataviewname = $scope.QuestionSummaries.DataViewInfoList[i].Name;
            //        dataviewID = $scope.QuestionSummaries.DataViewInfoList[i].ID;
            //        break;
            //    }
            //}

            $http.post('/QM/CreateFile', { quesID: QuesEidtData.QuesInfoData.qid, dataViewname: dataviewname, dataviewID: dataviewID }).success(function (data) {
                if (data.IsTrue) {
                    ///   window.location.href = data.Message;
                    $scope.BindDataOutputInfo();
                }
                else {
                    alert(data.Message,"red")
                }
                loadingEnd();
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data);
            });
            $scope.$digest();
        }, function () { }, "是", "", "否")

    }










    ///点击新建显示规则
    $scope.AddShowRuleClick = function () {
        $scope.QuestionSummaries.AddShowRule = true
        $scope.QuestionSummaries.ShowNodeAllSelect = false;
        $scope.QuestionSummaries.ShowNodeReverseSelect = false;
        $scope.QuestionSummaries.EditShowID = "";
        $scope.QuestionSummaries.ShowSetName = Prompt.AnalyticResult_SelectOptionToShow;//选择需要显示的题目
        $scope.QuestionSummaries.IsShowAddButton = false;
        $scope.QuestionSummaries.ShowNodeList = angular.copy($scope.QuestionSummaries.InitNodeList);
    }

    ///点击编辑显示规则
    $scope.EditShowRuleClick = function (Datalist) {
        $scope.QuestionSummaries.AddShowRule = true
        $scope.QuestionSummaries.ShowNodeAllSelect = false;
        $scope.QuestionSummaries.ShowNodeReverseSelect = false;
        $scope.QuestionSummaries.EditShowID = Datalist.ID;
        $scope.QuestionSummaries.ShowNodeList = angular.copy($scope.QuestionSummaries.InitNodeList);
        $scope.QuestionSummaries.ShowSetName = Prompt.AnalyticResult_SelectOptionToShow;//选择需要显示的题目
        $scope.QuestionSummaries.IsShowAddButton = false;
        for(var i=0;i< $scope.QuestionSummaries.ShowNodeList.length;i++)
        {
            if (Datalist.ListCondition.indexOf($scope.QuestionSummaries.ShowNodeList[i].NodeID) < 0)
            {
                $scope.QuestionSummaries.ShowNodeList[i].IsSelect = false;
                $scope.QuestionSummaries.ShowNodeList[i].CheckClass = "checkbox-none";

            }
               
        }

    }
    ///点击保存显示规则
    $scope.SaveShowRuleClick = function () {
        var savenodelist = new Array();
        var savenodenamelist = new Array();
        for (var i = 0; i < $scope.QuestionSummaries.ShowNodeList.length; i++) {
            if ($scope.QuestionSummaries.ShowNodeList[i].IsSelect) {
                savenodelist.push($scope.QuestionSummaries.ShowNodeList[i].NodeID);
                savenodenamelist.push($scope.QuestionSummaries.ShowNodeList[i].NodeName);
            }
        }

        if (savenodelist.length == 0)
        {
            alert(Prompt.AnalyticResult_SelectOneQuestion,"red");//"至少选择一个问题。"
            return;
        }

        //var dataviewlistID = "";
        //for (var i = 0; i < $scope.QuestionSummaries.DataViewInfoList.length; i++) {
        //    if($scope.QuestionSummaries.DataViewInfoList[i].IsSelect)
        //    {
        //        dataviewlistID = $scope.QuestionSummaries.DataViewInfoList[i].ID;
        //    }
        //}

        $scope.QuestionSummaries.ShowSetName = Prompt.AnalyticResult_ShowSet;//"显示设置"
        $scope.QuestionSummaries.IsShowAddButton = true;
        loadingStart();
        $http.post('/QM/SavePMDataList', { id: $scope.QuestionSummaries.EditShowID, quesID: QuesEidtData.QuesInfoData.qid, dataviewID: $scope.QuestionSummaries.SelectViewID, nodelist: savenodelist, nodenamelist: savenodenamelist }).success(function (data) {
            if (data.IsTrue) {
                $scope.QuestionSummaries.InitDataListList = data.DataListList;

              
                $scope.ChangeShowRule();
                $scope.SetShowQues();

                $scope.QuestionSummaries.AddShowRule = false

                isTouchDevice();
            }
            else {
                alert(data.Message,"red");

            }

            loadingEnd();


            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data);
        });



    }
    ///点击取消保存显示规则
    $scope.CloseShowRuleClick = function () {
        $scope.QuestionSummaries.AddShowRule = false;
        $scope.QuestionSummaries.IsShowAddButton = true;
        $scope.QuestionSummaries.ShowSetName = Prompt.AnalyticResult_ShowSet;//"显示设置"
    }
    ///选择题目
    $scope.SelectShowNode = function (node) {
        if (node.IsSelect) {
            node.IsSelect = false;
            node.CheckClass = "checkbox-none"
            $scope.QuestionSummaries.ShowNodeAllSelect = false;
        }
        else {
            node.IsSelect = true;
            node.CheckClass = "checkbox-check"
        }
        $scope.QuestionSummaries.ShowNodeReverseSelect = false;
    }
    ///全选
    $scope.SelectAllNode = function () {
        if ($scope.QuestionSummaries.ShowNodeAllSelect) {
            $scope.QuestionSummaries.ShowNodeAllSelect = false;
        }
        else {
            $scope.QuestionSummaries.ShowNodeAllSelect = true;
        }
        for (var i = 0; i < $scope.QuestionSummaries.ShowNodeList.length; i++) {
            $scope.QuestionSummaries.ShowNodeList[i].IsSelect = $scope.QuestionSummaries.ShowNodeAllSelect;
            if ($scope.QuestionSummaries.ShowNodeAllSelect) {
                $scope.QuestionSummaries.ShowNodeList[i].CheckClass = "checkbox-check";
            }
            else {
                $scope.QuestionSummaries.ShowNodeList[i].CheckClass = "checkbox-none";

            }
        }

    }
    ///反选
    $scope.ReverseSelectNode=function()
    {
   
        var selectstate = $scope.QuestionSummaries.ShowNodeReverseSelect;
        for (var i = 0; i < $scope.QuestionSummaries.ShowNodeList.length; i++) {
            $scope.SelectShowNode($scope.QuestionSummaries.ShowNodeList[i]);
        }
        if (selectstate) {
            $scope.QuestionSummaries.ShowNodeReverseSelect = false;
        }
        else {
            $scope.QuestionSummaries.ShowNodeReverseSelect = true;
        }
    }
    $scope.SelectDataListInfo=function(datalist)
    {
        ///修改后台数据库中的选中状态，同时修改内存中的状态
        for (var i = 0; i < $scope.QuestionSummaries.DataListList.length; i++) {
            if ($scope.QuestionSummaries.DataListList[i].ID == datalist.ID) {
                $scope.QuestionSummaries.DataListList[i].IsSelect = true;
                $scope.QuestionSummaries.DataListList[i].RadioCss = "radio-check";
                $http.post('/QM/ChangePMDataListSelectStatue', { id: $scope.QuestionSummaries.DataListList[i].ID, quesID: QuesEidtData.QuesInfoData.qid, dataviewID: $scope.QuestionSummaries.DataListList[i].DataViewID }).success(function (data) {
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingEnd();
                    RestLogin(data);
                });
            } else {

                $scope.QuestionSummaries.DataListList[i].IsSelect = false;
                $scope.QuestionSummaries.DataListList[i].RadioCss = "radio-none";
            }
        }
        for (var i = 0; i < $scope.QuestionSummaries.InitDataListList.length; i++) {
            if ($scope.QuestionSummaries.InitDataListList[i].DataViewID == datalist.DataViewID) {
                if ($scope.QuestionSummaries.InitDataListList[i].ID == datalist.ID) {
                    $scope.QuestionSummaries.InitDataListList[i].IsSelect = true;
                    $scope.QuestionSummaries.InitDataListList[i].RadioCss = "radio-check";
                }
                else
                {

                    $scope.QuestionSummaries.InitDataListList[i].IsSelect = false;
                    $scope.QuestionSummaries.InitDataListList[i].RadioCss = "radio-none";

                }
            }
        }

        $scope.SetShowQues();
         
     
    }

    ///删除条件 
    $scope.DeleteDataListInfo=function(datalist)
    {
        //"确定要删除当前显示条件吗"
        confirm(Prompt.AnalyticResult_IsDeleteCurrentCondition, function () {

            loadingStart();
            $http.post('/QM/DeletePMDataList', { id: datalist.ID, quesID: QuesEidtData.QuesInfoData.qid, dataviewID: datalist.DataViewID }).success(function (data) {
                if (data.IsTrue) {
                    $scope.QuestionSummaries.InitDataListList = data.DataListList;


                    $scope.ChangeShowRule();
                    $scope.SetShowQues();

                    alert("删除成功", "green");
                    $scope.QuestionSummaries.AddShowRule = false

                }
                else {
                    alert(data.Message,"red");

                }

                loadingEnd();


                //加载成功之后做一些事  
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data);
            });
            $scope.$digest();
        });
    }

    ///重名称显示规则
    $scope.EditShowRuleName = function (Datalist) {
        $("body").addClass("srcollHide");
        $scope.QuestionSummaries.EditShowID = Datalist.ID;
        $scope.QuestionSummaries.Popupbackground = 1;
        $scope.QuestionSummaries.SelectShowChangeName = Datalist.Name;

    }
    ///保存修改内容
    $scope.EditShowChangeName = function (isValid) {
        if (isValid) {
            $http.post('/QM/ChangeShowRuleName', {
                id: $scope.QuestionSummaries.EditShowID, name: $scope.QuestionSummaries.SelectShowChangeName
            }).success(function (data) {
                ///操作成功
                if (data.IsTrue) {
                    ///隐藏层
                    $scope.CloseDiv();
                    alert(Prompt.AnalyticResult_SuccessfulOperation,"green");//操作成功

                     
                    for (var i = 0; i <  $scope.QuestionSummaries.InitDataListList.length; i++) {
                        if ($scope.QuestionSummaries.InitDataListList[i].ID == $scope.QuestionSummaries.EditShowID) {
                            $scope.QuestionSummaries.InitDataListList[i].Name = $scope.QuestionSummaries.SelectShowChangeName;
                        }

                    }

                    for (var i = 0; i < $scope.QuestionSummaries.DataListList.length; i++) {
                        if ($scope.QuestionSummaries.DataListList[i].ID == $scope.QuestionSummaries.EditShowID) {
                            $scope.QuestionSummaries.DataListList[i].Name = $scope.QuestionSummaries.SelectShowChangeName;
                        }

                    }


                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data);
            });;
        }
    }










    
    ///增加筛选条件
    $scope.AddSelectRuleClick = function () {
        $scope.QuestionSummaries.AddSelectRule = true;
        $scope.QuestionSummaries.FilterType = 0;
    }





















    ///绑定浏览数据
    $scope.BindData = function () {

        loadingStart();
        $http.get('/QM/GetQuestionSummariesView', { params: { quesID: QuesEidtData.QuesInfoData.qid, dataViewID: $scope.QuestionSummaries.SelectViewID } }).success(function (data, status, headers, config) {

            if (data.IsTrue) {
                $scope.QuestionSummaries.SummariesList = data.NodeList;
               



               
                $timeout(function () {
                    $scope.BindImage();
                }, 1000)


            }
            else
            {
                alert(data.Message,"red");
            }
            loadingEnd();




            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
        });
    }
 
    ///绑定浏览图
    $scope.BindImage = function () {
        // 路径配置
        require.config({
            paths: {
                echarts: '/Script/Echarts'
            }
        });

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                $scope.QuestionSummaries.ChartList = new Array();
                for (var i = 0; i < $scope.QuestionSummaries.SummariesList.length; i++) {  
                    var myChart = ec.init(document.getElementById("div_" + $scope.QuestionSummaries.SummariesList[i].NodeID));
                    
                    var tmpdataZoom = null;
                    if ($scope.QuestionSummaries.SummariesList[i].OptionNameList.length > 10)
                    {
                        tmpdataZoom = new dataZoom();
                        tmpdataZoom.end = 1000 / $scope.QuestionSummaries.SummariesList[i].OptionNameList.length;
                        tmpdataZoom.height = 20;
                    }


                    option = {
                        //title: {
                        //    text: $scope.QuestionSummaries.SummariesList[i].Title + '提交数量',
                        //    //subtext: '纯属虚构'
                        //},
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            selectedMode: false,
                            data: [$scope.QuestionSummaries.SummariesList[i].EchartName]
                        },
                        toolbox: {
                            show: true,
                            feature: { 
                                saveAsImage: { show: true }
                            }
                        },
                        dataZoom: tmpdataZoom,
                        calculable: false,
                        grid: {
                            x:40,
                            x2: 0, 
                        },
                        xAxis: [
                            {
                                type: 'category',

                                data: $scope.QuestionSummaries.SummariesList[i].OptionNameList,
                             
                                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                                    textStyle: {
                                        fontSize: 10,
                                    },
                                    interval: 0,
                                    rotate:30,
                                    formatter: function (val) {
                                    
                                        var vals = val.split("");
                                        var num = 8;
                                        if (val.length < 8)
                                        {
                                            num = val.length;
                                        }
                                        var s = "";
                                        for (var i = 0; i < num; i++)
                                        {
                                            s += val[i];
                                            if (i % 5 == 4)
                                                s += "\n";
                                        }

                                        if (val.length > 8) {
                                            s = s + "...";
                                        }

                                        return s;
                                    }
                                },
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: $scope.QuestionSummaries.SummariesList[i].EchartName,
                                type: 'bar',
                                barMaxWidth: '50',
                                data: $scope.QuestionSummaries.SummariesList[i].OptionNumList,
                                itemStyle: {
                                    normal: {
                                        color: '#97E6B8',
                                    }
                                }
                            }
                        ]
                    };


                    // 为echarts对象加载数据 
                    myChart.setOption(option);
                    $scope.QuestionSummaries.ChartList.push(myChart);

                    $scope.ChangeTableWidth();
                    $scope.SetShowQues();

                }
                $timeout(function () {
                    window.onresize = function () {

                        for (var i = 0; i < $scope.QuestionSummaries.SummariesList.length; i++) {
                            if ($scope.QuestionSummaries.SummariesList[i].NodeShow) {
                                $scope.QuestionSummaries.ChartList[i].resize();
                                //eval("myChart" + i + ".resize();");
                            }
                        }
                    }
                }, 200);

                loadingEnd();
            }
        );


    }

    $scope.SetShowQues = function () {

        //var defview = false;
        //for (var i = 0; i < $scope.QuestionSummaries.DataViewInfoList.length; i++) {
        //    if ($scope.QuestionSummaries.DataViewInfoList[i].ID == "" && $scope.QuestionSummaries.DataViewInfoList[i].IsSelect) {
        //        defview = true;
        //    }
        //}
       
        var ids = "";
        var id = "";
        for (var i = 0; i < $scope.QuestionSummaries.DataListList.length; i++) {
            if ($scope.QuestionSummaries.DataListList[i].IsSelect) {
                ids = $scope.QuestionSummaries.DataListList[i].ListCondition;
                id = $scope.QuestionSummaries.DataListList[i].ID; 
            }
        }

        for (var i = 0; i < $scope.QuestionSummaries.SummariesList.length; i++) {

            if (id=="") {
                $scope.QuestionSummaries.SummariesList[i].NodeShow = true;
            }
            else {
                if (ids.indexOf($scope.QuestionSummaries.SummariesList[i].NodeID) > -1)
                { $scope.QuestionSummaries.SummariesList[i].NodeShow = true; }
                else {
                    $scope.QuestionSummaries.SummariesList[i].NodeShow = false;
                }
            }
        }

    }

    ///动态改变表格宽度
    $scope.ChangeTableWidth = function () {
        var arrayOfDocFonts;
        if (document.all || document.getElementById) {
            arrayOfDocFonts = document.getElementsByTagName("div");
        }

        var tmp = 0;
        for (var i = 0; i < arrayOfDocFonts.length; i++) {
            if (arrayOfDocFonts[i].id.indexOf("div_") == 0) {
                for (var j = 0; j < $scope.QuestionSummaries.SummariesList.length; j++) {
                    if (arrayOfDocFonts[i].id == "div_" + $scope.QuestionSummaries.SummariesList[j].NodeID) {
                        if ($scope.QuestionSummaries.SummariesList[j].NodeShow) {
                            $("#" + arrayOfDocFonts[i].id.replace("div", "table")).css("width", ($("#" + arrayOfDocFonts[i].id).width() + 24) + "px");
                        }
                    }
                }
            }
        }



    }

    $(window).resize(function () {



        $timeout(function () { $scope.ChangeTableWidth(); }, 500);





    });























    ///设置点击背景不关闭弹层
    $scope.ShowPopup = function (evt) {
        evt.stopPropagation();
    }
    ///关闭弹层
    $scope.CloseDiv = function () {
        $("body").removeClass("srcollHide");
        $scope.QuestionSummaries.Popupbackground = 0;
    }



}
]);
