//function QuesQuota() {
//    this.SourceNodes = null;///默认下拉选项
//    this.Row1Nodes = new Array();///行1下拉选项
//    this.Row2Nodes = new Array();///行2下拉选项
//    this.CellNodes = new Array();///列下拉选项
//    this.StrRow1Nodes = "";///生成表格的配额行1
//    this.StrRow2Nodes = "";///生成表格的配额行2
//    this.StrCelNodes = "";///生成表格的配额列
//    this.QuotaTableID = "";///问卷配额集表ID 
//    this.Row1Name = "";///配额行1名称   
//    this.Row2Name = "";///配额行2名称    
//    this.CelName = "";///配额列名称
//    this.SelectGroup = null;///选中的配额组
//    this.SelectChangeName = "";///选中的配额组

//    this.SelectChangeType = 0;
//    this.ShowRow = false;
//    this.ShowCel = false;
//    this.ShowTable = false;
//    this.ShowRow2 = false;///是否显示配额行2 
//    this.Popupbackground = 0;
//    this.ShowCreateTableBtn = false;
//    this.RowGroup = new Array();///配额行组
//    this.CelGroup = new Array();///配额列组
//    this.RowGroupNum = 0;///配额列组
//    this.TableInfoHtml = "";///表格信息
//    this.HtmlMinSize = "";///表格信息 
//    this.TableData = "";///表格信息  
//    this.ShowSet = "隐藏设置";
//    this.IsShowSidebar = true;
//    this.GridWidth = { width: "75%" };
//}

function GroupInfo() {
    this.Name = "";///配额行名称
    this.IsSet = false;
    this.SetOpacity = { opacity:0.5 };
    this.SortNo = 0;
    this.Nodes = new Array();///下拉选项 
    this.Type = 0;
    this.Open={display:'none'};
}
function InputValue() {
    this.ID = "";
    this.SortNo = 0;
    this.Value = 0;
}
function OptionValue() {
    this.ID = "";
    this.NumValue = 0;
}
var InValue = new Array();
var OptionList = new Array();
var allquota = 0;
var SaveQuotaFlag = false;
//问卷配额

zyApp.controller("QuotaCtrl", ["$scope", "$stateParams", "$http", "$location", "QuesEidtData", "$timeout", "Unify", "QuesQuotaInfo", "QQuesSet",
function ($scope, $stateParams, $http, $location, QuesEidtData, $timeout, Unify, QuesQuotaInfo, QQuesSet) {
    ////tips todo 2015 05 22
    //$( function () {
    //    var dataList = {
    //        "#quatoNoRowTips": {
    //            side: 2, msg: "Spend more time creating, less time fighting CSS Webflow  makes it easy to build sophisticated layoutsand designs without having to touch a line of code."
    //        },
    //        "#quotaNoColTips": {
    //            side: 2, msg: "Spend more time creating, less time fighting CSS Webflow makes it easy to build sophisticated layoutsand designs without having to touch a line of code."
    //        },
    //        "#quatoHasRowTips": {
    //            side: 2, msg: "Spend more time creating, less time fighting CSS Webflow makes it easy to build sophisticated layoutsand designs without having to touch a line of code."
    //        },
    //        "#quotaHasColTips": {
    //            side: 2, msg: "Spend more time creating, less time fighting CSS Webflow makes it easy to build sophisticated layoutsand designs without having to touch a line of code."
    //        },
    //    }

    //    for (var key in dataList) {
    //        $(key).mouseover(function (e) {
    //            //如果已存在先删除在生成
    //            if ($(".jq_tips_box")) {
    //                $(".jq_tips_box").css("display", "none");
    //            }
    //            var id = "#" + $(this).attr("id");
    //            $(this).tips({
    //                side:dataList[id].side,  //1,2,3,4 分别代表 上右下左
    //                msg: dataList[id].msg,//tips的文本内容
    //                time: 5,//默认为2 自动关闭时间 单位为秒 0为不关闭 （点击提示也可以关闭）
    //                ClientX: e.clientX,
    //                ClientY: e.clientY
    //            });
               
    //        })
    //    }
    //});

    GoHtmlTop();
    $scope.IsDemo = $("#hiddendemotype").val();
    $scope.QuesQuotaInfo = QuesQuotaInfo;

    ///不显示弹出层
    $scope.QuesQuotaInfo.Popupbackground = 0;

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

    $scope.Init = function () {
        loadingStart()
        //判断是否有该问卷权限
        $http.post('/QM/VerifyRight', { quesID: $stateParams.qid }).success(function (data) {
            if (data == "NoRight") {
                loadingEnd();
                location.href = '/Error/Error?type=dashboard';
            }
            else {
                $scope.Unify = Unify;//问卷标题(页面整体刷新时调用)
                $scope.Unify.QuesChange($stateParams.qid);
                $scope.QQuesSet = QQuesSet;
                $scope.QQuesSet.QMSetAction = "Quota";//发布选择配额时跳转到配额设置选中该TabCss

                QuesEidtData.QuesInfoData.qid = $stateParams.qid;//给QuesEidtData服务的保存问卷方法的参数赋值
                ///默认不显示行列和表格
                $scope.QuesQuotaInfo.ShowRow = false;
                $scope.QuesQuotaInfo.ShowCel = false;
                $scope.QuesQuotaInfo.ShowTable = false;
                $scope.QuesQuotaInfo.ShowCreateTableBtn = false;
                $scope.QuesQuotaInfo.RowGroup = new Array();
                $scope.QuesQuotaInfo.CelGroup = new Array();
                $scope.QuesQuotaInfo.RowGroupNum = 0;
                InValue = new Array();
                SaveQuotaFlag = false;
                OptionList = new Array();
                allquota = 0;


                $http.get('/QM/GetQDNodeIdentifyflagByQuesID', { params: { quesID: QuesEidtData.QuesInfoData.qid } }).success(function (data, status, headers, config) {

                    loadingEnd();

                    $scope.QuesQuotaInfo.SourceNodes = data.NodeList;///默认的下拉源数据
                    $scope.QuesQuotaInfo.QuotaTableID = data.LoadList.QuotaTableID;///获取默认的配额集ID
                    var iscreate = false;
                    if (data.LoadList.IsChangeQuota && data.LoadList.ChangeType == 1) {
                        //Prompt.ResetQuotaInfo: "配额中引用的甄别题已经在设计页面被修改，请重新设置配额信息。"
                        alert(Prompt.ResetQuotaInfo, "red")
                        return;
                    }
                    /////绑定默认值
                    if (data.LoadList.Row1list.length > 0) {
                        $scope.AddRowGroup(data.LoadList.Row1Name);
                        for (var i = 0; i < data.LoadList.Row1list.length; i++) {
                            $scope.AddSelect($scope.QuesQuotaInfo.RowGroup[0], 3);
                            $scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectID = data.LoadList.Row1list[i];
                            for (var j = 0; j < data.NodeList.Nodes.length; j++) {
                                if (data.LoadList.Row1list[i] == data.NodeList.Nodes[j].NodeID) {
                                    $scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectName = data.NodeList.Nodes[j].Title;
                                    break;
                                }
                            }
                            iscreate = true;
                        }
                    }
                    if (data.LoadList.Row2list.length > 0) {
                        $scope.AddRowGroup(data.LoadList.Row2Name);
                        for (var i = 0; i < data.LoadList.Row2list.length; i++) {
                            $scope.AddSelect($scope.QuesQuotaInfo.RowGroup[1], 3);
                            $scope.QuesQuotaInfo.RowGroup[1].Nodes[i].SelectID = data.LoadList.Row2list[i];
                            for (var j = 0; j < data.NodeList.Nodes.length; j++) {
                                if (data.LoadList.Row2list[i] == data.NodeList.Nodes[j].NodeID) {
                                    $scope.QuesQuotaInfo.RowGroup[1].Nodes[i].SelectName = data.NodeList.Nodes[j].Title;
                                    break;
                                }
                            }
                            iscreate = true;
                        }
                    }
                    if (data.LoadList.Cellist.length > 0) {
                        $scope.AddCelGroup(data.LoadList.CelName);
                        for (var i = 0; i < data.LoadList.Cellist.length; i++) {
                            $scope.AddSelect($scope.QuesQuotaInfo.CelGroup[0], 2);
                            $scope.QuesQuotaInfo.CelGroup[0].Nodes[i].SelectID = data.LoadList.Cellist[i];
                            for (var j = 0; j < data.NodeList.Nodes.length; j++) {
                                if (data.LoadList.Cellist[i] == data.NodeList.Nodes[j].NodeID) {
                                    $scope.QuesQuotaInfo.CelGroup[0].Nodes[i].SelectName = data.NodeList.Nodes[j].Title;
                                    break;
                                }
                            }
                            iscreate = true;
                        }
                    }

                    $scope.QuesQuotaInfo.ShowCreateTableBtn = false;
                    if (iscreate) {
                        $scope.BindQuotaTable();
                        GetallNum();
                    }

                    //加载成功之后做一些事  
                })
                    .error(function (data, status, headers, config) {
                        //处理错误   
                        loadingEnd();
                        RestLogin(data, $scope);
                    });
            }
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            //RestLogin(data);
        })

    }
    $scope.Init();

    $scope.SetDivShow= function () {
        if ($scope.QuesQuotaInfo.IsShowSidebar)
        {
            $scope.QuesQuotaInfo.IsShowSidebar = false;
            $scope.QuesQuotaInfo.ShowSet = "显示设置";
            $scope.QuesQuotaInfo.GridWidth = { width: "100%" };
        }
        else {
            $scope.QuesQuotaInfo.IsShowSidebar = true;
            $scope.QuesQuotaInfo.ShowSet = "隐藏设置";
            $scope.QuesQuotaInfo.GridWidth = { width: "75%" };
        }

        $timeout(function () { $scope.ChangeTableSize($("#div-quota-input-parent").width()); }, 100);
    }

    ///删除配额
    $scope.DelQuotaTable = function () {
        //Prompt.IsDeleteCurrQuota: "确定要删除当前配额吗？"
        confirm(Prompt.IsDeleteCurrQuota, function () {
            $http.post('/QM/DelQuotaInfo', {
                quesid: QuesEidtData.QuesInfoData.qid, quotaTableID: $scope.QuesQuotaInfo.QuotaTableID
            }).success(function (data) {
                ///操作成功
                if (data.IsTrue) {
                    $scope.Init();

                    $('#QuesQuotaDisabled').attr("disabled", "disabled");
                    //$("#div_save").attr('class', 'w-clearfix w-inline-block button float-right silver radius-3px save-settings-button margin-right-15px mobile-landscape-display-none');
                    SaveQuotaFlag = false;
                    $("#minimize").click();
                } else {
                    alert(data.mmessage,"red");
                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd();
                RestLogin(data,$scope);
            });
            $scope.$digest();
        });


    }
    ///增加配额行组
    $scope.AddRowGroup = function (name) {
        if ($scope.QuesQuotaInfo.RowGroup.length < 2) {
            var gi = new GroupInfo;
            if (name != '') {
                gi.Name = name;
            }
            else {
                gi.Name = "配额组" + ($scope.QuesQuotaInfo.RowGroupNum + 1);
            }
            $scope.QuesQuotaInfo.RowGroupNum = $scope.QuesQuotaInfo.RowGroupNum + 1;
            gi.Nodes = new Array();

            $scope.QuesQuotaInfo.RowGroup.push(gi);
            $scope.QuesQuotaInfo.ShowRow = true;
            for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup.length; i++) {
                $scope.QuesQuotaInfo.RowGroup[i].SortNo = i;
                $scope.QuesQuotaInfo.RowGroup[i].Type = i + 1;
            }
        }
        else
        {
            //Prompt.MaxQuotaGroup: "问卷最多只能设置2组配额行组。"
            alert(Prompt.MaxQuotaGroup, "red")
        }

        $timeout(function () { isTouchDevice(); }, 100);

    }
    ///增加配额列组
    $scope.AddCelGroup = function (name) {
        if ($scope.QuesQuotaInfo.CelGroup.length < 1) {
            var gi = new GroupInfo;

            if (name != '') {
                gi.Name = name;
            }
            else {
                gi.Name = "配额组";
            }
            gi.Nodes = new Array();
            gi.Type = 3;
            $scope.QuesQuotaInfo.CelGroup.push(gi);
            $scope.QuesQuotaInfo.ShowCel = true;

        }

        $timeout(function () { isTouchDevice(); }, 100);

    }
    ///删除配额组
    $scope.DelGroup = function (groupinfo, type) {
        //Prompt.IsDeleteQuotaGroup: "是否删除配额组？"
        confirm(Prompt.IsDeleteQuotaGroup, function () {


            if (groupinfo.Nodes.length > 0) {
                $scope.QuesQuotaInfo.ShowCreateTableBtn = true;
            }
            if (type == 0) {
                $scope.QuesQuotaInfo.RowGroup.splice(groupinfo.SortNo, 1);
                if ($scope.QuesQuotaInfo.RowGroup.length == 0) {
                    $scope.QuesQuotaInfo.ShowRow = false;

                }
                for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup.length; i++) {
                    $scope.QuesQuotaInfo.RowGroup[i].SortNo = i;
                    $scope.QuesQuotaInfo.RowGroup[i].Type = i + 1;
                }
            }
            else {
                $scope.QuesQuotaInfo.CelGroup.splice(0, 1);
                $scope.QuesQuotaInfo.ShowCel = false;
            }
            
            $scope.$digest();
        }, function () { }, "是", "", "否")
    }
    ///增加选项
    $scope.AddSelect = function (group, num) {
        if ($scope.QuesQuotaInfo.SourceNodes.Nodes.length == 0) {
            //Prompt.CantSetQuota: "当前无甄别题无法设置配额"
            alert(Prompt.CantSetQuota, "red");
            return;
        }
        var select = angular.copy($scope.QuesQuotaInfo.SourceNodes);

        if (group.Nodes.length >= num) {
            alert("问卷" + group.Name + "最多只能设置" + num + "组条件。","red");
            return;
        }



        group.Nodes.push(select);
        for (var i = 0; i < group.Nodes.length; i++) {

            group.Nodes[i].SortNo = i;
        }


        $scope.QuesQuotaInfo.ShowCreateTableBtn = true;

        $timeout(function () { isTouchDevice(); }, 100);
    }
    ///打开选项
    $scope.OpenSelect = function (selecNode) {
        if (selecNode.Open.display == 'none') {
            selecNode.Open = { display: 'block' };
        }
        else {
            selecNode.Open = { display: 'none' };
        }
    }
    ///选择选项
    $scope.SelectNode = function (selecNode, name, id) {
        selecNode.SelectID = id;
        selecNode.SelectName = name;
        selecNode.visibility = { visibility: 'hidden' };
        selecNode.Opacity = { Opacity: 0.5 };
        $scope.QuesQuotaInfo.ShowCreateTableBtn = true;

    }
    ///删除选项
    $scope.DelSelect = function (sortno, list) {
        confirm(Prompt.DeleteQuotaLine, function () {
            $scope.QuesQuotaInfo.ShowCreateTableBtn = true;
            list.splice(sortno, 1);
            $scope.$parent.$digest();
        }, function () { }, "是", "", "否")
    }
    ///设置点击背景不关闭弹层
    $scope.ShowPopup = function (evt) {
        evt.stopPropagation();
    }
    ///关闭弹层
    $scope.CloseDiv = function () {
        $("body").removeClass("srcollHide");
        $scope.QuesQuotaInfo.Popupbackground = 0;
    }
    ///打开重合名弹层
    $scope.OpenEditName = function (groupinfo) {

        $("body").addClass("srcollHide");
        $scope.QuesQuotaInfo.Popupbackground = 1;
        $scope.QuesQuotaInfo.SelectGroup = groupinfo;
        $scope.QuesQuotaInfo.SelectChangeName = groupinfo.Name;
    }

    ///保存重命名结果
    $scope.EditQuotaName = function (isValid) {


        if (isValid) {
            $http.post('/QM/EditQuotaSetupName', {
                type: $scope.QuesQuotaInfo.SelectGroup.Type, name: $scope.QuesQuotaInfo.SelectChangeName, quotaTableID: $scope.QuesQuotaInfo.QuotaTableID
            }).success(function (data) {
                ///操作成功
                if (data.IsTrue) {
                    ///隐藏层
                    $scope.CloseDiv();
                    //Prompt.QuotaSuccessfulOperation: "操作成功。"
                    alert(Prompt.QuotaSuccessfulOperation, "green");


                    $scope.QuesQuotaInfo.SelectGroup.Name = $scope.QuesQuotaInfo.SelectChangeName;

                    $scope.ChangeTableSize($("#div-quota-input-parent").width());
                


                }
            });
        }
    }



    ///生成配额表格table
    $scope.CreateTable = function () {


        ///必须要有设置配额条件
        if ($scope.QuesQuotaInfo.RowGroup.length == 0) {
            //Prompt.PleaseSetQuotaRow: "请先设置配额行。"
            alert(Prompt.PleaseSetQuotaRow, "red");
            return;
        }
        if ($scope.QuesQuotaInfo.RowGroup[0].Nodes.length == 0) {
            alert("请先设置" + $scope.QuesQuotaInfo.RowGroup[0].Name + "。","red");
            return;
        }
        ///验证是否存在同样的选项

        $scope.QuesQuotaInfo.StrRow1Nodes = "";
        $scope.QuesQuotaInfo.StrRow2Nodes = "";
        $scope.QuesQuotaInfo.StrCelNodes = "";
        var isexisrow2 = false;


        if ($scope.QuesQuotaInfo.RowGroup.length > 0) {
            for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[0].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrRow1Nodes.indexOf($scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectID) > 0) {
                    //Prompt.QuotaCantRepeat: "在同一配额行中不可以有相同甄别题"
                    alert(Prompt.QuotaCantRepeat, "red");
                    return;
                }
                $scope.QuesQuotaInfo.StrRow1Nodes += "," + $scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectID;
            }

            $scope.QuesQuotaInfo.Row1Name = $scope.QuesQuotaInfo.RowGroup[0].Name;
        }
        if ($scope.QuesQuotaInfo.RowGroup.length > 1) {
            for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[1].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrRow2Nodes.indexOf($scope.QuesQuotaInfo.RowGroup[1].Nodes[i].SelectID) > 0) {
                    //Prompt.QuotaCantRepeat: "在同一配额行中不可以有相同甄别题"
                    alert(Prompt.QuotaCantRepeat, "red");
                    return;
                }
                $scope.QuesQuotaInfo.StrRow2Nodes += "," + $scope.QuesQuotaInfo.RowGroup[1].Nodes[i].SelectID;
                isexisrow2 = true;
            }

            $scope.QuesQuotaInfo.Row2Name = $scope.QuesQuotaInfo.RowGroup[1].Name;
        }
        if ($scope.QuesQuotaInfo.CelGroup.length > 0) {
            for (var i = 0; i < $scope.QuesQuotaInfo.CelGroup[0].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrCelNodes.indexOf($scope.QuesQuotaInfo.CelGroup[0].Nodes[i].SelectID) > 0) {
                    alert(Prompt.QuotaCantRepeat, "red");
                    return;
                }
                $scope.QuesQuotaInfo.StrCelNodes += "," + $scope.QuesQuotaInfo.CelGroup[0].Nodes[i].SelectID;
            }

            $scope.QuesQuotaInfo.CelName = $scope.QuesQuotaInfo.CelGroup[0].Name;
        }

        ///开始验证行1和行2是否相同，行1和行2中是否有与列相同的，如果有报错
        var isas = true;
        if (isexisrow2) {
            if ($scope.QuesQuotaInfo.RowGroup[0].Nodes.length == $scope.QuesQuotaInfo.RowGroup[1].Nodes.length && $scope.QuesQuotaInfo.RowGroup[0].Nodes.length > 0) {

                for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[0].Nodes.length; i++) {
                    if ($scope.QuesQuotaInfo.StrRow2Nodes.indexOf($scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectID) < 0) {
                        isas = false;
                    }
                }
                if (isas) {
                    alert(Prompt.AutoLineCantSame,"red");
                    return;
                }

            }
        }
        isas = false;
        if ($scope.QuesQuotaInfo.CelGroup.length > 0 && $scope.QuesQuotaInfo.CelGroup[0].Nodes.length > 0 && $scope.QuesQuotaInfo.RowGroup[0].Nodes.length > 0) {

            for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[0].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrCelNodes.indexOf($scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectID) > 0) {
                    isas = true;
                }
            }
            if (isas) {
                alert(Prompt.AutoLine1AndColumnCantSame,"red");
                return;
            }

        }
        isas = false;
        if (isexisrow2 && $scope.QuesQuotaInfo.CelGroup.length > 0 && $scope.QuesQuotaInfo.CelGroup[0].Nodes.length > 0 && $scope.QuesQuotaInfo.RowGroup[1].Nodes.length > 0) {

            for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[1].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrCelNodes.indexOf($scope.QuesQuotaInfo.RowGroup[1].Nodes[i].SelectID) > 0) {
                    isas = true;
                }
            }
            if (isas) {
                alert(Prompt.AutoLine2AndColumnCantSame,"red");
                return;
            }

        }

        loadingStart();

        $http.get('/QM/IsCanSaveQDQuotaSetupManager', {
            params: {
                questionnairID: QuesEidtData.QuesInfoData.qid,
                quotaTableID: $scope.QuesQuotaInfo.QuotaTableID
            }
        }).success(function (data, status, headers, config) {
            $scope.LoadingIsEnd = 0;
            if (data.IsTrue) {
                if (data.Isconfirm) {
                    //Prompt.IsRebuild: "重新生成配额表将清除当前的配额信息，是否重新生成？",//20138 
                    confirm(Prompt.IsRebuild, function () {

                        $scope.SaveQDQSM($scope.LoadingIsEnd);
                        $scope.$parent.$digest();
                    }, function () { }, "是", "", "否")
                }
                else {
                    $scope.SaveQDQSM($scope.LoadingIsEnd);
                }
            }
            else {
                alert(data.message,"red");
            }

            loadingEnd();
            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data, $scope);
        });
    }
    $scope.SaveQDQSM = function (loadingIsEnd) {
        if (loadingIsEnd != 0) {
            loadingsStart();
        }
        $http.post('/QM/SaveQDQuotaSetupManager', {
            trrow1value: $scope.QuesQuotaInfo.StrRow1Nodes,
            trrow2value: $scope.QuesQuotaInfo.StrRow2Nodes,
            trcelvalue: $scope.QuesQuotaInfo.StrCelNodes,
            questionnairID: QuesEidtData.QuesInfoData.qid,
            quotaTableID: $scope.QuesQuotaInfo.QuotaTableID,
            row1name: $scope.QuesQuotaInfo.Row1Name,
            row2name: $scope.QuesQuotaInfo.Row2Name,
            celname: $scope.QuesQuotaInfo.CelName,
        }).success(function (data) {

            if (data.IsTrue) {
                $scope.QuesQuotaInfo.ShowCreateTableBtn = false;
                $scope.QuesQuotaInfo.QuotaTableID = data.QuotaTableID;

                InValue = new Array();
                SaveQuotaFlag = false;
                $scope.BindQuotaTable(loadingIsEnd);
                //Prompt.CreateSuccess: "生成成功。"
                alert(Prompt.CreateSuccess, "green")
            }
            else {
                alert(data.message,"red");
            }

            if (loadingIsEnd != 0) {
                loadingsEnd();
            }

            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingsEnd();
            RestLogin(data, $scope);
        });

    }




    $scope.BindQuotaTable = function (loadingIsEnd) {
        OptionList = new Array();
        if (loadingIsEnd != 0) {
            loadingStart();
        }
        $scope.QuesQuotaInfo.ShowTable = true;
        $http.get('/QM/GetQuestionnairQuotaTableInfo', {
            params: {
                questionnairID: QuesEidtData.QuesInfoData.qid,
                quotaTableID: $scope.QuesQuotaInfo.QuotaTableID
            }
        }).success(function (data, status, headers, config) {

            $scope.QuesQuotaInfo.TableData = data;
            $scope.QuesQuotaInfo.TableInfoHtml = data.TableInfo;
            $scope.QuesQuotaInfo.RowNum = data.RowNum;
            $scope.QuesQuotaInfo.CelNum = data.CelNum;
            OptionList = data.OptionList;
            $("#IsChange").val("0");
            if ($scope.QuesQuotaInfo.RowGroup.length == 2 && $scope.QuesQuotaInfo.RowGroup[1].Nodes.length > 0) {
                $("#IsexisRow2").val("1");
            } else {
                $("#IsexisRow2").val("0");
            }

            InValue = new Array();
            SaveQuotaFlag = false;
            for (var i = 0; i < data.InputValue.length; i++) {
                var iv = new InputValue;
                iv.ID = data.InputValue[i].ID;
                iv.Value = data.InputValue[i].Value;

                InValue.push(iv);

            }
            for (var i = 0; i < InValue.length; i++) {
                InValue[i].SortNo = i;
            }
            $scope.ChangeTableSize($("#div-quota-input-parent").width());


            if (loadingIsEnd != 0) {
                loadingEnd();
            }

            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误 
            loadingEnd();
        });

    }

    $scope.SaveQuota = function () {


        if ($scope.QuesQuotaInfo.RowGroup.length == 2) {
            var row1optionlist = new Array();
            var row2optionlist = new Array();
            for (var i = 0; i < InValue.length; i++) {
                var ids = InValue[i].ID.split(",");
                var rids = (ids[2]+ids[3]).split("_");


                for (var j = 0; j < rids.length; j++) {
                    if (rids[j] != "") {
                        var isexis = false;
                        if (InValue[i].ID.indexOf("input_Num,1,") == 0) {
                            for (var k = 0; k < row1optionlist.length; k++) {

                                if (row1optionlist[k].ID == rids[j]) {
                                    row1optionlist[k].NumValue = row1optionlist[k].NumValue * 1 + InValue[i].Value * 1
                                    isexis = true;
                                }
                            }
                            if (!isexis) {
                                var ov = new OptionValue;
                                ov.ID = rids[j];
                                ov.NumValue = InValue[i].Value * 1;
                                row1optionlist.push(ov);
                            }
                        }
                        else if (InValue[i].ID.indexOf("input_Num,2,") == 0) {
                            for (var k = 0; k < row2optionlist.length; k++) {

                                if (row2optionlist[k].ID == rids[j]) {
                                    row2optionlist[k].NumValue = row2optionlist[k].NumValue * 1 + InValue[i].Value * 1
                                    isexis = true;
                                }
                            }
                            if (!isexis) {
                                var ov = new OptionValue;
                                ov.ID = rids[j];
                                ov.NumValue = InValue[i].Value * 1;
                                row2optionlist.push(ov);
                            }


                        }
                    }
                }

            }



            for (var i = 0; i < OptionList.length; i++) {
                var row1num = 0;
                var row2num = 0;
                for (var j = 0; j < row1optionlist.length; j++) {
                    if (OptionList[i] == row1optionlist[j].ID) {
                        row1num = row1optionlist[j].NumValue
                    }
                } for (var j = 0; j < row2optionlist.length; j++) {
                    if (OptionList[i] == row2optionlist[j].ID) {
                        row2num = row2optionlist[j].NumValue
                    }
                }



                if (row1num > row2num) {
                    //Prompt.QuotaCountMisMatching: "行配额组中相同选项配额数不一致。"
                    alert(Prompt.QuotaCountMisMatching, "red");
                    return;
                } else if (row1num < row2num) {
                    alert(Prompt.QuotaCountMisMatching, "red");
                    return;
                }


            }


        }
        if ($("#spanQuotaNum").html().indexOf("color=\"red\"") > -1) {
            //"配额1和配额2的配额数量不一致。"
            alert(Prompt.Auto1AndAuto2NumInconsistent,"red");
            return;
        }

        if (allquota * 1 < 1) {
            //"问卷配额不得少于100。"
            alert(Prompt.QuesAutoNotBeLessThanOneHundred,"red");
            return;
        }
        var arr = new Array();
        for (var i = 0; i < InValue.length  ; i++) {
            //判断是否为文本框
            if (InValue[i].ID.indexOf("input_Num,") == 0) {
                if (InValue[i].Value != "0" && InValue[i].Value != "" && isNumber(InValue[i].Value)) {
                    arr.push(InValue[i].ID + "," + InValue[i].Value);
                }
            }
        }

        //$("#div_save").attr('class', 'ic_button height_30 png ic3 saving');

        loadingStart();

        $http.post('/QM/SaveQuota', {
            quotavalue: arr,
            trSetrow1value: $scope.QuesQuotaInfo.StrRow1Nodes,
            trSetrow2value: $scope.QuesQuotaInfo.StrRow2Nodes,
            trSetcelvalue: $scope.QuesQuotaInfo.StrCelNodes,
            questionnairID: QuesEidtData.QuesInfoData.qid,
            quotaTableID: $scope.QuesQuotaInfo.QuotaTableID
        }).success(function (data) {
            ///操作成功
            if (data.IsTrue) {
                loadingEnd();


                $('#QuesQuotaDisabled').attr("disabled", "disabled");
                //$("#div_save").attr('class', 'w-clearfix w-inline-block button float-right silver radius-3px save-settings-button margin-right-15px mobile-landscape-display-none');
                SaveQuotaFlag = false;
                //Prompt.QuotaSuccessfulOperation: "操作成功。"
                alert(Prompt.QuotaSuccessfulOperation, "green");
            }
            else {
                loadingEnd();
                alert(data.message,"red");
            }

        });
    }



    $(window).resize(function () {


        $timeout(function () { $scope.ChangeTableSize($("#div-quota-input-parent").width()); }, 500);





    });




    $scope.RestoreValue = function () {
        $("#div-quota-input").html($scope.QuesQuotaInfo.TableInfoHtml);
        ///先将table数据还原，再将当前这次记录的修改值还原到表格中去
        var arrayOfDocFonts;
        if (document.all || document.getElementById) {
            arrayOfDocFonts = document.getElementsByTagName("td");
        }
        for (var i = 0; i < arrayOfDocFonts.length; i++) {
            if ($scope.QuesQuotaInfo.RowGroup.length > 0) {
                if (arrayOfDocFonts[i].id == "tdrow1") {
                    arrayOfDocFonts[i].innerHTML = "<nobr>&nbsp;&nbsp;" + $scope.QuesQuotaInfo.RowGroup[0].Name + "</nobr>";
                 
                }
                if ($scope.QuesQuotaInfo.RowGroup.length > 1) {
                    if (arrayOfDocFonts[i].id == "tdrow2") {
                        arrayOfDocFonts[i].innerHTML = "<nobr>&nbsp;&nbsp;" + $scope.QuesQuotaInfo.RowGroup[1].Name + "</nobr>";
                       
                    }
                }
            }

        }
        for (var i = 0; i < InValue.length; i++) {
            //$("#" + InValue[i].ID).val(InValue[i].Value);
            document.getElementById(InValue[i].ID).value = InValue[i].Value;
        }
        GetallNum();

    }

    $scope.ChangeTableSize = function (width) {
        var div_quota_allWidth = $("#div-quota-input-parent").width();
        var window_width = window.innerWidth
   || document.documentElement.clientWidth
   || document.body.clientWidth;
        $scope.RestoreValue();
        if (window_width > 991) {
            //$("#div_quota_sidebarWidth").css("min-height", "750px");
            if ($scope.QuesQuotaInfo.IsShowSidebar) {
                if (window_width < 1200)
                    $scope.QuesQuotaInfo.GridWidth = { width: "70%" };
                else
                    $scope.QuesQuotaInfo.GridWidth = { width: "75%" };
            }
            else {
                $scope.QuesQuotaInfo.GridWidth = { width: "100%" };

            }

        }
        else {

            //$("#div_quota_sidebarWidth").css("min-height", "0px");
            $scope.QuesQuotaInfo.GridWidth = { width: "100%" };
        }
        if (width >= 600 && width < 700) {
            $scope.QuesQuotaInfo.HtmlMinSize = 656;
            $scope.SetChangeTableSize(div_quota_allWidth, 7);
        }
        if (width >= 700 && width < 800) {
            $scope.QuesQuotaInfo.HtmlMinSize = 726;
            $scope.SetChangeTableSize(div_quota_allWidth, 8);
           
        }
        if (width >= 800 && width < 900) {
            $scope.QuesQuotaInfo.HtmlMinSize = 875;
            $scope.SetChangeTableSize(div_quota_allWidth, 9);
        }
        if (width >= 900 && width < 1100) {
            $scope.QuesQuotaInfo.HtmlMinSize = 938;
            $scope.SetChangeTableSize(div_quota_allWidth, 10);
        }
        if (width >= 1100) {

            $scope.SetChangeTableSize(div_quota_allWidth, 12);
        }

       
    }
    $scope.SetChangeTableSize = function (width, celnum) {
        if ($scope.QuesQuotaInfo.CelNum > celnum) {
            if ($scope.QuesQuotaInfo.RowNum > 30) {
                var list = document.getElementsByTagName("input");

                for (var i = 0; i < list.length && list[i]; i++) {
                    //判断是否为文本框
                    if (list[i].id.indexOf("input_Num,") == 0) {
                        list[i].width = "100px";
                    }
                }
                SetTableRowCel(width, 933,1);
            }
            else {


                $("#div-quota-input").css("height", ($("#reportTable").height() + 17) + "px");
                var list = document.getElementsByTagName("input");

                for (var i = 0; i < list.length && list[i]; i++) {
                    //判断是否为文本框
                    if (list[i].id.indexOf("input_Num,") == 0) {
                        list[i].width = "100px";
                    }
                }
                SetTableRowCel(width, $("#reportTable").height() + 17,1);
            }
        }
        else {
            $("#reportTable").css("width", width + "px");
            if ($scope.QuesQuotaInfo.RowNum > 30) {
                SetTableRowCel(width, 933,1);
            }



        }
    }


    $("#maximize").click(function () {
        $("#minimize").css("display", "block");
        $("#maximize").hide();

        $("#sidebar-quota").hide();
        $(".quota-grid-position").removeClass("quota-grid-position").addClass("quota-grid-position-maximize");
        //alert($("#div-quota-input").width());
        $scope.ChangeTableSize($("#div-quota-input-parent").width());
    }
           );
    $("#minimize").click(function () {
        $("#minimize").hide();

        $("#maximize").css("display", "block");
        $("#sidebar-quota").css("display", "block");
        $(".quota-grid-position-maximize").removeClass("quota-grid-position-maximize").addClass("quota-grid-position");
        //alert($("#div-quota-input").width());
        $scope.ChangeTableSize($("#div-quota-input-parent").width());
    }
   );
}

]);
function sleep(d) {
    for (var t = Date.now() ; Date.now() - t <= d;);
}

function SetTableRowCel(width, height,heightSys) {

    var table = $("#reportTable");
    var tableId = table.attr('id');
    var freezeRowNum = table.attr('freezeRowNum');
    var freezeColumnNum = table.attr('freezeColumnNum');

    if (typeof (freezeRowNum) != 'undefined' || typeof (freezeColumnNum) != 'undefined') {
        freezeTable(table, freezeRowNum || 0, freezeColumnNum || 0, width, height, heightSys);

        var flag = false;
        $(window).resize(function () {
            if (flag)
                return;

            setTimeout(function () {
                adjustTableSize(tableId, width, height, heightSys);
                flag = false;
            }, 100);

            flag = true;
        });
    }
}
function ChangeText(obj) {
    SaveQuotaFlag = true;
    $('#QuesQuotaDisabled').removeAttr("disabled");
    //$("#div_save").attr('class', 'w-clearfix w-inline-block button float-right sea-green radius-3px save-settings-button');
    var value = obj.value;
    if (value != "") {
        if (!isNumber(value)) {
            obj.value = "";
            //"配额请输入正整数。"
            //alert(Prompt.AutoInputPositiveInteger);
            return;
        }
    }
    $("#IsChange").val("1");
    //for (var i = 0; i < InValue.length; i++) {
    //    if (InValue[i].ID == obj.id) {
    //        InValue.splice(InValue[i].SortNo, 1);
    //    }
    //}
    //if (value != "" && value != "0" && value*1!=0) {
    //    var iv = new InputValue;
    //    iv.ID = obj.id;
    //    iv.Value = value;

    //    InValue.push(iv);
    //    for (var i = 0; i < InValue.length; i++) {
    //        InValue[i].SortNo = i;
    //    }
    //}
    GetallNum();





}

///验证是否正整数
function isNumber(oNum) {

    if (!oNum) return false;

    var strP = /^\d+$/; //正整数

    if (!strP.test(oNum)) return false;

    return true;

}

///显示所有的问卷总数
function GetallNum() {
    var row1count = 0;
    var row2count = 0;
    //对表单中所有的input进行遍历
    InValue = new Array();
    var input = document.getElementsByTagName("input");
    for (var i = 0; i < input.length; i++) {
        //判断是否为文本框
        if (input[i].id.indexOf("input_Num,") == 0) {
            if (input[i].id.indexOf("input_Num,1,") == 0) {

                if (input[i].value != '') {
                    row1count += parseInt(input[i].value);
                }
            }
            else if (input[i].id.indexOf("input_Num,2,") == 0) {

                if (input[i].value != '') {
                    row2count += parseInt(input[i].value);
                }

            }
            if (input[i].value != '' && input[i].value * 1 != 0) {
                var iv = new InputValue;
                iv.ID = input[i].id;
                iv.Value = input[i].value;

                InValue.push(iv);
            }

        }
    }
    if ($("#IsexisRow2").val() == "0") {
        allquota = row1count;
        $("#spanQuotaNum").html("<span>配额收集数合计：</span><p><font color=\"#9b59b6\">" + ChangeNumShow(row1count) + "</font></p>");
    }
    else if ($("#IsexisRow2").val() == "1") {


        ///计算2组对象有相同选项的情况下数据是否相同
        var row1optionlist = new Array();
        var row2optionlist = new Array();
        for (var i = 0; i < InValue.length; i++) {
            var ids = InValue[i].ID.split(",");
            var rids = (ids[2]+ids[3]).split("_");


            for (var j = 0; j < rids.length; j++) {
                if (rids[j] != "") {
                    var isexis = false;
                    if (InValue[i].ID.indexOf("input_Num,1,") == 0) {
                        for (var k = 0; k < row1optionlist.length; k++) {

                            if (row1optionlist[k].ID == rids[j]) {
                                row1optionlist[k].NumValue = row1optionlist[k].NumValue * 1 + InValue[i].Value * 1
                                isexis = true;
                            }
                        }
                        if (!isexis) {
                            var ov = new OptionValue;
                            ov.ID = rids[j];
                            ov.NumValue = InValue[i].Value * 1;
                            row1optionlist.push(ov);
                        }
                    }
                    else if (InValue[i].ID.indexOf("input_Num,2,") == 0) {
                        for (var k = 0; k < row2optionlist.length; k++) {

                            if (row2optionlist[k].ID == rids[j]) {
                                row2optionlist[k].NumValue = row2optionlist[k].NumValue * 1 + InValue[i].Value * 1
                                isexis = true;
                            }
                        }
                        if (!isexis) {
                            var ov = new OptionValue;
                            ov.ID = rids[j];
                            ov.NumValue = InValue[i].Value * 1;
                            row2optionlist.push(ov);
                        }


                    }
                }
            }

        }

        var startrow1red = "";
        var endrow1red = "";
        var startrow2red = "";
        var endrow2red = "";


        for (var i = 0; i < OptionList.length; i++) {
            var row1num = 0;
            var row2num = 0;
            for (var j = 0; j < row1optionlist.length; j++) {
                if (OptionList[i] == row1optionlist[j].ID) {
                    row1num = row1optionlist[j].NumValue
                }
            } for (var j = 0; j < row2optionlist.length; j++) {
                if (OptionList[i] == row2optionlist[j].ID) {
                    row2num = row2optionlist[j].NumValue
                }
            }



            if (row1num > row2num) {
                startrow2red = "<font color=\"red\">"
                endrow2red = "</font>"
            } else if (row1num < row2num) {
                startrow1red = "<font color=\"red\">"
                endrow1red = "</font>"
            }


        }



        if (row1count != row2count) {
            if (row1count > row2count) {

                allquota = row1count;

                $("#spanQuotaNum").html("<span>配额收集数合计：</span><p><font color=\"red\">" + ChangeNumShow(row1count) + "</font></p>  <span>（" + document.getElementById("tdrow1").innerHTML + "收集数合计：" + startrow1red + ChangeNumShow(row1count) + endrow1red + "    " + document.getElementById("tdrow2").innerHTML + "收集数合计：" + startrow2red + ChangeNumShow(row2count) + endrow2red + "）</span>");
            }
            else {
                allquota = row2count;
                $("#spanQuotaNum").html("<span>配额收集数合计：</span><p><font color=\"red\">" + ChangeNumShow(row2count) + "</font></p>  <span>（" + document.getElementById("tdrow1").innerHTML + "收集数合计：" + startrow1red + ChangeNumShow(row1count) + endrow1red + "    " + document.getElementById("tdrow2").innerHTML + "收集数合计：" + startrow2red + ChangeNumShow(row2count) + endrow2red + "）</span>");
            }
        }
        else {
            allquota = row1count;
            $("#spanQuotaNum").html("<span>配额收集数合计：</span><p><font color=\"#9b59b6\">" + ChangeNumShow(row1count) + "</font></p>  <span>（" + document.getElementById("tdrow1").innerHTML + "收集数合计：" + startrow1red + ChangeNumShow(row1count) + endrow1red + "    " + document.getElementById("tdrow2").innerHTML + "收集数合计：" + startrow2red + ChangeNumShow(row2count) + endrow2red + "）</span>");
        }
    }

}


/*
 * 锁定表头和列 
 * 
 * 参数定义
 * 	table - 要锁定的表格元素或者表格ID
 * 	freezeRowNum - 要锁定的前几行行数，如果行不锁定，则设置为0
 * 	freezeColumnNum - 要锁定的前几列列数，如果列不锁定，则设置为0
 * 	width - 表格的滚动区域宽度
 * 	height - 表格的滚动区域高度
 */
function freezeTable(table, freezeRowNum, freezeColumnNum, width, height, heightSys) {
    if (typeof (freezeRowNum) == 'string')
        freezeRowNum = parseInt(freezeRowNum)

    if (typeof (freezeColumnNum) == 'string')
        freezeColumnNum = parseInt(freezeColumnNum)

    var tableId;
    if (typeof (table) == 'string') {
        tableId = table;
        table = $('#' + tableId);
    } else
        tableId = table.attr('id');

    var divTableLayout = $("#" + tableId + "_tableLayout");

    if (divTableLayout.length != 0) {
        divTableLayout.before(table);
        divTableLayout.empty();
    } else {
        table.after("<div id='" + tableId + "_tableLayout' style='overflow:hidden;height:" + height + "px; width:" + width + "px;'></div>");

        divTableLayout = $("#" + tableId + "_tableLayout");
    }

    var html = '';
    if (freezeRowNum > 0 && freezeColumnNum > 0)
        html += '<div id="' + tableId + '_tableFix" style="padding: 0px;"></div>';

    if (freezeRowNum > 0)
        html += '<div id="' + tableId + '_tableHead" style="padding: 0px;"></div>';

    if (freezeColumnNum > 0)
        html += '<div id="' + tableId + '_tableColumn" style="padding: 0px;"></div>';

    html += '<div id="' + tableId + '_tableData" style="padding: 0px;"></div>';


    $(html).appendTo("#" + tableId + "_tableLayout");

    var divTableFix = freezeRowNum > 0 && freezeColumnNum > 0 ? $("#" + tableId + "_tableFix") : null;
    var divTableHead = freezeRowNum > 0 ? $("#" + tableId + "_tableHead") : null;
    var divTableColumn = freezeColumnNum > 0 ? $("#" + tableId + "_tableColumn") : null;
    var divTableData = $("#" + tableId + "_tableData");

    divTableData.append(table);

    if (divTableFix != null) {
        var tableFixClone = table.clone(true);
        tableFixClone.attr("id", tableId + "_tableFixClone");
        divTableFix.append(tableFixClone);
        //var str = divTableFix.html();
        //str = str.replace("text", "hidden");
        //var stra = "abc";
        //stra = stra.replace("a", "1");
        //divTableFix.innerHTML=divTableFix.innerHTML.replace("input", "span");

        var fixinput = document.getElementById(tableId + "_tableFix").getElementsByTagName("input");
        for (i = 0; i < fixinput.length; i++) {
            fixinput[i].disabled = true;
            fixinput[i].value = '';
        }
    }

    if (divTableHead != null) {
        var tableHeadClone = table.clone(true);
        tableHeadClone.attr("id", tableId + "_tableHeadClone");
        divTableHead.append(tableHeadClone);
        var headinput = document.getElementById(tableId + "_tableHead").getElementsByTagName("input");
        for (i = 0; i < headinput.length; i++) {
            headinput[i].disabled = true;
            headinput[i].value = '';
        }
    }

    if (divTableColumn != null) {
        var tableColumnClone = table.clone(true);
        tableColumnClone.attr("id", tableId + "_tableColumnClone");
        divTableColumn.append(tableColumnClone);

        var columninput = document.getElementById(tableId + "_tableColumn").getElementsByTagName("input");
        for (i = 0; i < columninput.length; i++) {
            columninput[i].value = '';
            columninput[i].disabled = true;
        }
    }

    $("#" + tableId + "_tableLayout table").css("margin", "0");

    if (freezeRowNum > 0) {
        var HeadHeight = 0;
        var ignoreRowNum = 0;
        $("#" + tableId + "_tableHead tr:lt(" + freezeRowNum + ")").each(function () {
            if (ignoreRowNum > 0)
                ignoreRowNum--;
            else {
                var td = $(this).find('td:first, th:first');
                HeadHeight += td.outerHeight(true);

                ignoreRowNum = td.attr('rowSpan');
                if (typeof (ignoreRowNum) == 'undefined')
                    ignoreRowNum = 0;
                else
                    ignoreRowNum = parseInt(ignoreRowNum) - 1;
            }
        });
        HeadHeight += 2;

        divTableHead.css("height", HeadHeight);
        divTableFix != null && divTableFix.css("height", HeadHeight);
    }

    if (freezeColumnNum > 0) {
        var ColumnsWidth = 0;
        var ColumnsNumber = 0;
        $("#" + tableId + "_tableColumn tr:eq(" + freezeRowNum + ")").find("td:lt(" + freezeColumnNum + "), th:lt(" + freezeColumnNum + ")").each(function () {
            if (ColumnsNumber >= freezeColumnNum)
                return;

            ColumnsWidth += $(this).outerWidth(true);

            ColumnsNumber += $(this).attr('colSpan') ? parseInt($(this).attr('colSpan')) : 1;
        });
        ColumnsWidth += 2;

        divTableColumn.css("width", ColumnsWidth);
        divTableFix != null && divTableFix.css("width", ColumnsWidth);
    }

    divTableData.scroll(function () {
        divTableHead != null && divTableHead.scrollLeft(divTableData.scrollLeft());

        divTableColumn != null && divTableColumn.scrollTop(divTableData.scrollTop());
    });

    divTableFix != null && divTableFix.css({ "overflow": "hidden", "position": "absolute", "z-index": "50" });
    if (height >= 933) {
        divTableHead != null && divTableHead.css({ "overflow": "hidden", "width": width-8, "position": "absolute", "z-index": "45" });
        divTableColumn != null && divTableColumn.css({ "overflow": "hidden", "height": height, "position": "absolute", "z-index": "40" });
        divTableData.css({ "overflow": "scroll", "width": width, "height": height + 8, "position": "absolute" });
    } else {
        divTableHead != null && divTableHead.css({ "overflow": "hidden", "width": width-8, "position": "absolute", "z-index": "45" });
        divTableColumn != null && divTableColumn.css({ "overflow": "hidden", "height": height, "position": "absolute", "z-index": "40" });
        divTableData.css({ "overflow": "scroll", "width": width, "height": height+(-9*heightSys) , "position": "absolute" });
    }
    divTableFix != null && divTableFix.offset(divTableLayout.offset());
    divTableHead != null && divTableHead.offset(divTableLayout.offset());
    divTableColumn != null && divTableColumn.offset(divTableLayout.offset());
    divTableData.offset(divTableLayout.offset());





}

/*
 * 调整锁定表的宽度和高度，这个函数在resize事件中调用
 * 
 * 参数定义
 * 	table - 要锁定的表格元素或者表格ID
 * 	width - 表格的滚动区域宽度
 * 	height - 表格的滚动区域高度
 */
function adjustTableSize(table, width, height, heightSys) {
    var tableId;
    if (typeof (table) == 'string')
        tableId = table;
    else
        tableId = table.attr('id');
    $("#" + tableId + "_tableLayout").width(width).height(height);
    $("#" + tableId + "_tableHead").width(width);
    if (height >= 933) { 
        $("#" + tableId + "_tableColumn").height(height);
        $("#" + tableId + "_tableData").width(width).height(height + 8);
    } else {
        $("#" + tableId + "_tableColumn").height(height);
        $("#" + tableId + "_tableData").width(width).height(height+(-9*heightSys));
    }

}




/*
*Tab切换
*tabArgs：问卷设置Tab页参数
*btnArgs：设计问卷、发布问卷按钮参数
*quesBtnArgs：问卷按钮操作参数
*QuesEidtData：问卷信息服务，取问卷ID
*/
function SaveQuotaInfoByTab($scope, $http, $location, tabArgs, btnArgs, quesBtnArgs, QuesEidtData, QuesQuotaInfo, QQuesSet) {
    $scope.QuesQuotaInfo = QuesQuotaInfo;
    if ($scope.QuesQuotaInfo.ShowCreateTableBtn) {
        ///必须要有设置配额条件
        if ($scope.QuesQuotaInfo.RowGroup.length == 0) {
            //Prompt.PleaseSetQuotaRow: "请先设置配额行。"
            alert(Prompt.PleaseSetQuotaRow, "red");
            return;
        }
        if ($scope.QuesQuotaInfo.RowGroup[0].Nodes.length == 0) {
            alert("请先设置" + $scope.QuesQuotaInfo.RowGroup[0].Name + "。","red");
            return;
        }
        ///验证是否存在同样的选项

        $scope.QuesQuotaInfo.StrRow1Nodes = "";
        $scope.QuesQuotaInfo.StrRow2Nodes = "";
        $scope.QuesQuotaInfo.StrCelNodes = "";
        var isexisrow2 = false;


        if ($scope.QuesQuotaInfo.RowGroup.length > 0) {
            for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[0].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrRow1Nodes.indexOf($scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectID) > 0) {
                    alert(Prompt.QuotaCantRepeat, "red");
                    return;
                }
                $scope.QuesQuotaInfo.StrRow1Nodes += "," + $scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectID;
            }

            $scope.QuesQuotaInfo.Row1Name = $scope.QuesQuotaInfo.RowGroup[0].Name;
        }
        if ($scope.QuesQuotaInfo.RowGroup.length > 1) {
            for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[1].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrRow2Nodes.indexOf($scope.QuesQuotaInfo.RowGroup[1].Nodes[i].SelectID) > 0) {
                    alert(Prompt.QuotaCantRepeat, "red");
                    return;
                }
                $scope.QuesQuotaInfo.StrRow2Nodes += "," + $scope.QuesQuotaInfo.RowGroup[1].Nodes[i].SelectID;
                isexisrow2 = true;
            }

            $scope.QuesQuotaInfo.Row2Name = $scope.QuesQuotaInfo.RowGroup[1].Name;
        }
        if ($scope.QuesQuotaInfo.CelGroup.length > 0) {
            for (var i = 0; i < $scope.QuesQuotaInfo.CelGroup[0].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrCelNodes.indexOf($scope.QuesQuotaInfo.CelGroup[0].Nodes[i].SelectID) > 0) {
                    alert("在同一配额行中不可以有相同甄选题","red");
                    return;
                }
                $scope.QuesQuotaInfo.StrCelNodes += "," + $scope.QuesQuotaInfo.CelGroup[0].Nodes[i].SelectID;
            }

            $scope.QuesQuotaInfo.CelName = $scope.QuesQuotaInfo.CelGroup[0].Name;
        }

        ///开始验证行1和行2是否相同，行1和行2中是否有与列相同的，如果有报错
        var isas = true;
        if (isexisrow2) {
            if ($scope.QuesQuotaInfo.RowGroup[0].Nodes.length == $scope.QuesQuotaInfo.RowGroup[1].Nodes.length && $scope.QuesQuotaInfo.RowGroup[0].Nodes.length > 0) {

                for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[0].Nodes.length; i++) {
                    if ($scope.QuesQuotaInfo.StrRow2Nodes.indexOf($scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectID) < 0) {
                        isas = false;
                    }
                }
                if (isas) {
                    alert(Prompt.AutoLineCantSame,"red");
                    return;
                }

            }
        }
        isas = false;
        if ($scope.QuesQuotaInfo.CelGroup.length > 0 && $scope.QuesQuotaInfo.CelGroup[0].Nodes.length > 0 && $scope.QuesQuotaInfo.RowGroup[0].Nodes.length > 0) {

            for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[0].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrCelNodes.indexOf($scope.QuesQuotaInfo.RowGroup[0].Nodes[i].SelectID) > 0) {
                    isas = true;
                }
            }
            if (isas) {
                alert(Prompt.AutoLine1AndColumnCantSame,"red");
                return;IsCanSaveQDQuotaSetupManager
            }

        }
        isas = false;
        if (isexisrow2 && $scope.QuesQuotaInfo.CelGroup.length > 0 && $scope.QuesQuotaInfo.CelGroup[0].Nodes.length > 0 && $scope.QuesQuotaInfo.RowGroup[1].Nodes.length > 0) {

            for (var i = 0; i < $scope.QuesQuotaInfo.RowGroup[1].Nodes.length; i++) {
                if ($scope.QuesQuotaInfo.StrCelNodes.indexOf($scope.QuesQuotaInfo.RowGroup[1].Nodes[i].SelectID) > 0) {
                    isas = true;
                }
            }
            if (isas) {
                alert(Prompt.AutoLine2AndColumnCantSame,"red");
                return;
            }

        }

        loadingStart();

        $http.get('/QM/IsCanSaveQDQuotaSetupManager', {
            params: {
                questionnairID: QuesEidtData.QuesInfoData.qid,
                quotaTableID: $scope.QuesQuotaInfo.QuotaTableID
            }
        }).success(function (data, status, headers, config) {
            $scope.LoadingIsEnd = 0;
            if (data.IsTrue) {
                $http.post('/QM/SaveQDQuotaSetupManager', {
                    trrow1value: $scope.QuesQuotaInfo.StrRow1Nodes,
                    trrow2value: $scope.QuesQuotaInfo.StrRow2Nodes,
                    trcelvalue: $scope.QuesQuotaInfo.StrCelNodes,
                    questionnairID: QuesEidtData.QuesInfoData.qid,
                    quotaTableID: $scope.QuesQuotaInfo.QuotaTableID,
                    row1name: $scope.QuesQuotaInfo.Row1Name,
                    row2name: $scope.QuesQuotaInfo.Row2Name,
                    celname: $scope.QuesQuotaInfo.CelName,
                }).success(function (data) {
                    if (data.IsTrue) {
                        $scope.QuesQuotaInfo.ShowCreateTableBtn = false;
                        $scope.QuesQuotaInfo.QuotaTableID = data.QuotaTableID;
                        InValue = new Array();
                        if (!SaveQuotaFlag) {
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
                        }
                    }
                    else {
                        alert(data.message,"red");
                    }

                    //if (loadingIsEnd != 0) {
                    //    loadingsEnd();
                    //}

                    //加载成功之后做一些事  
                }).error(function (data, status, headers, config) {
                    //处理错误   
                    loadingsEnd();
                });
               // $scope.$parent.$digest();

            }
            else {
                alert(data.message,"red");
            }

            loadingEnd();
            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
        });
    }
    if (SaveQuotaFlag) {
        if ($scope.QuesQuotaInfo.RowGroup.length == 2) {
            var row1optionlist = new Array();
            var row2optionlist = new Array();
            for (var i = 0; i < InValue.length; i++) {
                var ids = InValue[i].ID.split(",");
                var rids = (ids[2] + ids[3]).split("_");


                for (var j = 0; j < rids.length; j++) {
                    if (rids[j] != "") {
                        var isexis = false;
                        if (InValue[i].ID.indexOf("input_Num,1,") == 0) {
                            for (var k = 0; k < row1optionlist.length; k++) {

                                if (row1optionlist[k].ID == rids[j]) {
                                    row1optionlist[k].NumValue = row1optionlist[k].NumValue * 1 + InValue[i].Value * 1
                                    isexis = true;
                                }
                            }
                            if (!isexis) {
                                var ov = new OptionValue;
                                ov.ID = rids[j];
                                ov.NumValue = InValue[i].Value * 1;
                                row1optionlist.push(ov);
                            }
                        }
                        else if (InValue[i].ID.indexOf("input_Num,2,") == 0) {
                            for (var k = 0; k < row2optionlist.length; k++) {

                                if (row2optionlist[k].ID == rids[j]) {
                                    row2optionlist[k].NumValue = row2optionlist[k].NumValue * 1 + InValue[i].Value * 1
                                    isexis = true;
                                }
                            }
                            if (!isexis) {
                                var ov = new OptionValue;
                                ov.ID = rids[j];
                                ov.NumValue = InValue[i].Value * 1;
                                row2optionlist.push(ov);
                            }


                        }
                    }
                }

            }



            for (var i = 0; i < OptionList.length; i++) {
                var row1num = 0;
                var row2num = 0;
                for (var j = 0; j < row1optionlist.length; j++) {
                    if (OptionList[i] == row1optionlist[j].ID) {
                        row1num = row1optionlist[j].NumValue
                    }
                } for (var j = 0; j < row2optionlist.length; j++) {
                    if (OptionList[i] == row2optionlist[j].ID) {
                        row2num = row2optionlist[j].NumValue
                    }
                }



                if (row1num > row2num) {
                    //Prompt.QuotaCountMisMatching: "行配额组中相同选项配额数不一致。"
                    alert(Prompt.QuotaCountMisMatching, "red");
                    return;
                } else if (row1num < row2num) {
                    alert(Prompt.QuotaCountMisMatching, "red");
                    return;
                }


            }


        }
        if ($("#spanQuotaNum").html().indexOf("color=\"red\"") > -1) {
            //"配额1和配额2的配额数量不一致。"
            alert(Prompt.Auto1AndAuto2NumInconsistent, "red");
            return;
        }

        if (allquota * 1 < 1) {
            //"问卷配额不得少于100。"
            alert(Prompt.QuesAutoNotBeLessThanOneHundred, "red");
            return;
        }
        var arr = new Array();
        for (var i = 0; i < InValue.length  ; i++) {
            //判断是否为文本框
            if (InValue[i].ID.indexOf("input_Num,") == 0) {
                if (InValue[i].Value != "0" && InValue[i].Value != "" && isNumber(InValue[i].Value)) {
                    arr.push(InValue[i].ID + "," + InValue[i].Value);
                }
            }
        }

        //$("#div_save").attr('class', 'ic_button height_30 png ic3 saving');

        loadingStart();

        $http.post('/QM/SaveQuota', {
            quotavalue: arr,
            trSetrow1value: $scope.QuesQuotaInfo.StrRow1Nodes,
            trSetrow2value: $scope.QuesQuotaInfo.StrRow2Nodes,
            trSetcelvalue: $scope.QuesQuotaInfo.StrCelNodes,
            questionnairID: QuesEidtData.QuesInfoData.qid,
            quotaTableID: $scope.QuesQuotaInfo.QuotaTableID
        }).success(function (data) {
            ///操作成功
            if (data.IsTrue) {
                loadingEnd();


                $('#QuesQuotaDisabled').attr("disabled", "disabled");
                //$("#div_save").attr('class', 'w-clearfix w-inline-block button float-right silver radius-3px save-settings-button margin-right-15px mobile-landscape-display-none');
                SaveQuotaFlag = false;
                //Prompt.QuotaSuccessfulOperation: "操作成功。"
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
            }
            else {
                loadingEnd();
                alert(data.message, "red");
            }

        });
    }
}
function ChangeNumShow(v) {
    if (isNaN(v)) {
        return v;
    }
    v = (Math.round((v - 0) * 100)) / 100;
    v = (v == Math.floor(v)) ? v + "" : ((v * 10 == Math.floor(v * 10)) ? v
            + "0" : v);
    v = String(v);
    var ps = v.split('.');
    var whole = ps[0];
    var sub = ps[1] ? '.' + ps[1] : '';
    var r = /(\d+)(\d{3})/;
    while (r.test(whole)) {
        whole = whole.replace(r, '$1' + ',' + '$2');
    }
    v = whole + sub;

    return v;
}
