
function DataTrends() {
    this.ProgressWidth = "0";
    this.ProgressWidthStyle=null; 
    this.TableHtml = "";
    this.CelNum = 0;
    this.RowNum = 0;
    this.FirstReturnTime = "";
    this.StartTime = "";
    this.EndTime = "";
    this.XLableList = new Array();
    this.XValueList = new Array();
    this.GridShow=false;
}
function ProgressWidthStyle(){
    this.width="0%"; 
} 
function dataZoom() {
    this.show = true;
    this.realtime =true;
    this.start  = 0;
    this.end = 50;
}
zyApp.controller("AnalyzeResultsCtrl", ["$scope", "$stateParams", "$http", "$location", "QuesEidtData", "$window", "publishManager", "Unify", "DataOutputInfo",
function ($scope, $stateParams, $http, $location, QuesEidtData, $window, publishManager, Unify, DataOutputInfo) {
    $scope.Unify = Unify;//问卷标题(页面整体刷新时调用)
    $scope.Unify.QuesChange($stateParams.qid);
    QuesEidtData.QuesInfoData.qid = $stateParams.qid;//给QuesEidtData服务的保存问卷方法的参数赋值
    $scope.DataOutputInfo = DataOutputInfo;
   //页面刷新，保持tab在正确位置
    $scope.InitAnalyzeResultCss = function () {
        var url = window.location.href;
        if (url.indexOf('/DataTrends') >= 0) {
            $scope.AnalyzeResultTabFlag = true;
            $scope.IsShowDownLoad = false;
            $location.path("/QMSet/AnalyzeResults/" + QuesEidtData.QuesInfoData.qid + "/DataTrends");
        } else if (url.indexOf('/QuestionSummaries') >= 0) {
            $scope.AnalyzeResultTabFlag = false;
            $scope.IsShowDownLoad = true;
            $location.path("/QMSet/AnalyzeResults/" + QuesEidtData.QuesInfoData.qid + "/QuestionSummaries");
        }
    }
    $scope.InitAnalyzeResultCss();
  
    $scope.DownLoadAll = function () {
        //Prompt.AnalyticResult_IsExportData："是否要导出数据？"
        confirm(Prompt.AnalyticResult_IsExportData, function () {
            loadingStart()

            $http.post('/QM/CreateFile', { quesID: QuesEidtData.QuesInfoData.qid, dataViewname: "", dataviewID: "" }).success(function (data) {
                if (data.IsTrue) {
                    //$scope.DataOutputInfo.BindDataOutputInfo(QuesEidtData.QuesInfoData.qid); 
                    loadingStart();

                    $http.get('/QM/GetQuestionSummariesViewByDataOutputInfo', { params: { quesID: QuesEidtData.QuesInfoData.qid } }).success(function (data, status, headers, config) {

                        if (data.IsTrue) {
                            $scope.DataOutputInfo.dataOutputList = data.DataOutputList;
                             


                        }
                        else {
                            alert(data.Message,"red");
                        }

                        loadingEnd();



                        //加载成功之后做一些事  
                    }).error(function (data, status, headers, config) {
                        //处理错误   
                        loadingEnd();
                        RestLogin(data, $scope);
                    });

                }
                else {
                    alert(data.Message,"red")
                }
                loadingEnd();
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data, $scope);
            }); 
 
            $scope.$digest();
        }, function () { }, "是", "", "否")


    }
}
]);

zyApp.controller("DataTrendsCtrl", ["$scope", "$stateParams", "$http", "$location", "QuesEidtData", "$timeout", "Unify",
function ($scope, $stateParams, $http, $location, QuesEidtData, $timeout, Unify) {
    GoHtmlTop();
    loadingStart();
    $scope.IsDemo = $("#hiddendemotype").val();
    var dt = new DataTrends;
    $scope.DataTrends = dt;
    $scope.DataTrends.ProgressWidthStyle = new ProgressWidthStyle();
    $scope.DataTrends.ProgressWidthStyle.width = "0%";
    isTouchDevice();
    //初始化
    $scope.Init = function () {
        //判断是否有该问卷权限
        $http.post('/QM/VerifyRight', { quesID: $stateParams.qid }).success(function (data) {
            if (data == "NoRight") {
                location.href = '/Error/Error?type=dashboard';
            }
            else {
                $scope.Unify = Unify;//问卷标题(页面整体刷新时调用)
                $scope.Unify.QuesChange($stateParams.qid);
                QuesEidtData.QuesInfoData.qid = $stateParams.qid;//给QuesEidtData服务的保存问卷方法的参数赋值

                $("#divminshow").hide();
                $scope.DataTrends.GridShow = false;
                $http.get('/QM/GetDataTrendsView', { params: { quesID: QuesEidtData.QuesInfoData.qid } }).success(function (data, status, headers, config) {

                    $scope.DataTrends.ProgressWidth = data.ProgressWidth;
                    $scope.DataTrends.ProgressWidthStyle = new ProgressWidthStyle();
                    $scope.DataTrends.ProgressWidthStyle.width = data.ProgressWidth + "%";
                    if (data.LableList.length == 0) {
                        //Prompt.AnalyticResult_CurrentQuesNoData：“当前问卷没有收集数据”
                        alert(Prompt.AnalyticResult_CurrentQuesNoData, "red");
                        loadingEnd();
                   
                        return;
                    }
                    if (data.TableHtml != "") {
                        $scope.DataTrends.GridShow = true;
                    }
                    $scope.DataTrends.TableHtml = data.TableHtml;
                    $scope.DataTrends.RowNum = data.RowCount;
                    $scope.DataTrends.CelNum = data.CelCount;
                    $scope.DataTrends.LableList = data.LableList;
                    $scope.DataTrends.ValueList = data.ValueList;
                    if (data.TableHtml.length > 0) {

                        $timeout(function () { $scope.ChangeTableSize($("#div-quota-grid").width()); }, 500);
                    }
                    $scope.ShowViewDate('7');

                    loadingEnd();



                    //加载成功之后做一些事  
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
    }
    $scope.Init();
    //tab选中样式
    $scope.AnalyzeResultTabSelect = function () {
        
            $location.path("/QMSet/AnalyzeResults/" + QuesEidtData.QuesInfoData.qid + "/QuestionSummaries"); 
    }

    $scope.ShowViewDate = function (type) {
        if ($scope.DataTrends.LableList.length > 0)
        {
            var XLableList = new Array();
            var XValueList = new Array();
            $scope.DataTrends.FirstReturnTime = $scope.DataTrends.LableList[0];
            $scope.DataTrends.EndTime = $scope.DataTrends.LableList[$scope.DataTrends.LableList.length - 1];
            if ($scope.DataTrends.LableList.length > 1) {

                var date = daysBetween(ChangeDateToString(StringToDate($scope.DataTrends.LableList[$scope.DataTrends.LableList.length - 1])), ChangeDateToString(StringToDate($scope.DataTrends.LableList[0]))) + 1;
                for (var i = 0; i < date; i++) {
                    var endtime = StringToDate($scope.DataTrends.LableList[$scope.DataTrends.LableList.length - 1]);
                    endtime.setDate(endtime.getDate() - i)
                    var strnewdate = ChangeDateToString(endtime);
                    var value = 0;
                    for (var j = 0; j < $scope.DataTrends.LableList.length; j++) {
                        if ($scope.DataTrends.LableList[j] == strnewdate) {
                            value = $scope.DataTrends.ValueList[j];
                        }
                    }
                    XLableList.push(strnewdate);
                    XValueList.push(value);
                }
                $scope.DataTrends.XLableList = XLableList.reverse();
                $scope.DataTrends.XValueList = XValueList.reverse();
            }
            else {
                $scope.DataTrends.StartTime = $scope.DataTrends.EndTime;
                XLableList.push($scope.DataTrends.LableList[0]);
                XValueList.push($scope.DataTrends.ValueList[0]);
                $scope.DataTrends.XLableList = XLableList.reverse();
                $scope.DataTrends.XValueList = XValueList.reverse();

            }
            if(type=="7")
            {

                if($scope.DataTrends.XLableList.length<=7)
                {
                    $scope.DataTrends.dataZoom = null;
                }
                else
                {
                    $scope.DataTrends.dataZoom = new dataZoom;
                    $scope.DataTrends.dataZoom.end =700/ $scope.DataTrends.XLableList.length ;
                }
 
                
            }
            else if (type == "30") {
                if ($scope.DataTrends.XLableList.length <= 30) {
                    $scope.DataTrends.dataZoom = null;
                }
                else {
                    $scope.DataTrends.dataZoom = new dataZoom;
                    $scope.DataTrends.dataZoom.end =3000/ $scope.DataTrends.XLableList.length ;
                }
                
               
            }
            else if (type == "0") {
                $scope.DataTrends.dataZoom = null;
              
            }
            $scope.DataTrends.StartTime = $scope.DataTrends.XLableList[0];
            $scope.BindChart();
        }


      
    }
    ///绑定图片
    $scope.BindChart = function () {


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
                var myChart = ec.init(document.getElementById('main'));

                option = {
                    title: {
                        text: '问卷提交数量',
                        //subtext: '纯属虚构'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        selectedMode: false,
                        data: ['提交数量']
                    },
                    toolbox: {
                        show: true,
                        feature: { 
                            saveAsImage: { show: true }
                        }
                    },
                    grid: {
                        x: 40,
                        x2: 0,
                    },
                    dataZoom: $scope.DataTrends.dataZoom,
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            data: $scope.DataTrends.XLableList,
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '提交数量',
                            type: 'bar',
                            barMaxWidth: '50',
                            data: $scope.DataTrends.XValueList,
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

                $timeout(function () {
                    window.onresize = function () {
                        myChart.resize(); 
                    }
                }, 200)

            }
        );
    }
    $(window).resize(function () { 

        $timeout(function () { $scope.ChangeTableSize($("#div-quota-grid").width()); }, 500); 
    });


    $scope.ChangeTableSize = function (width) {


        var div_questionViewWidth = $("#div_questionViewWidth").width();
        $scope.RestoreValue(); 

        if (width >= 600 && width<800) { 
            $scope.DataTrends.HtmlMinSize = 676;
            $scope.SetChangeTableSize(div_questionViewWidth, 7);
        } 
        if (width >= 800 && width<1110) { 
            $scope.DataTrends.HtmlMinSize = 889;
            $scope.SetChangeTableSize(div_questionViewWidth, 9);
        } 
        if (width >= 1110) {
             
            $scope.SetChangeTableSize(div_questionViewWidth, 12);
        }
        
    }
    $scope.RestoreValue = function () {
        $("#div-quota-grid").html($scope.DataTrends.TableHtml); 
      

    }

    $scope.SetChangeTableSize = function (width, celnum) {
        if ($scope.DataTrends.CelNum > celnum) {

            $("#reportTable").css("width", (100 * $scope.DataTrends.CelNum) + "px");
            if ($scope.DataTrends.RowNum > 30) {


                SetTableRowCel(width, 933,-1);
            }
            else {


                $("#div-quota-grid").css("height", ($("#reportTable").height() + 0) + "px");          
                SetTableRowCel(width, $("#reportTable").height() + 0,-1);
            }
        }
        else {
            $("#reportTable").css("width", width + "px");
            if ($scope.DataTrends.RowNum > 30) {
                SetTableRowCel(width, 933,-1);
            }



        }
    }
  
}
]);
