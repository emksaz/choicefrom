function QList() {
    this.Popupbackground = 0; //设置弹层状态 
    this.Sorts = null;///排序列表
    this.SortName = "";///显示当前排序的中文名称 
    this.SortType = "";///显示当前排序类型
    this.CompanyName = "";///显示默认公司名称
    this.CompanyImg = "";///显示默认公司图片
    this.FolderList = null;///文件夹列表
    this.FolderName = "";///当前文件夹名称
    this.OtherQuesHide = false;///是否显示自定义问卷内容
    this.FolderID = "";///当前自定义文件夹ID
    this.FolderSetShow = false;///显示自定义文件夹下的文件
    this.SelectFolderID = "";///选中修改的文件夹ID
    this.MyAddQues = true;///我的文件夹加载更多
    this.OtherAddQues = true;///其他文件夹加载更多

}


var QuestionnairListloadstart = 0;
var QuestionnairListloadend = 0;


zyApp.controller("QuestionnairList", ["$scope", "$stateParams", "$http", "QuesEidtData", "$location", "Unify", "QuesQuotaInfo",
function ($scope, $stateParams, $http, QuesEidtData, $location, Unify, QuesQuotaInfo) {

    isTouchDevice();
    GoHtmlTop();
    $scope.IsDemo = $("#hiddendemotype").val();
    clickempty("dropdown-bt", "ul.downul");
    $scope.Init = function () {
        $scope.QuesQuota = QuesQuotaInfo;
        $scope.QuesQuota.ShowCreateTableBtn = false;
        SaveQuotaFlag = false;
        QuesEidtData.QuesInfoData.EditStateFlag = false;
        QuesEidtData.QuesInfoData.publishStateFlag = false;//取消问卷设置中未保存的状态
        $scope.Unify = Unify;//预览服务


        QuestionnairListloadstart = 2;
        QuestionnairListloadend = 0;
        $("#selectques").attr('class', 'w-nav-link nav-button w--current');
        $scope.QList = QList;
        ///设置弹层默认背景为0时不显示弹出层内容
        $scope.QList.Popupbackground = 0;
        loadingStart()///1oading 
        ///获取默认公司以及公司列表和排序的基本信息
        $http.get('/QM/QuestionnaireList', {
        }).success(function (data, status, headers, config) {
            $scope.QList.Companys = data.Company;///公司列表
            $scope.QList.Sorts = data.SortList;///排序列表
            $scope.QList.SortName = data.SortName;///显示当前排序的中文名称
            $scope.QList.SortClass = data.SortClass;///显示当前排序使用的图片样式
            $scope.QList.SortType = data.SortType;///显示当前排序类型
            $scope.QList.CompanyName = data.CompanyName;///显示默认公司名称
            $scope.QList.CompanyImg = data.CompanyImg;///显示默认公司名称 
            $("#liCompanyImg").css("background-image", " url("+data.CompanyImg+")");

            QuestionnairListloadend = QuestionnairListloadend + 1;
            if (QuestionnairListloadstart == QuestionnairListloadend) {
                loadingEnd();
            }
            //加载成功之后做一些事  
        }).error(function (data, status, headers, config) {
            //处理错误 
            QuestionnairListloadend = QuestionnairListloadend + 1;
            if (QuestionnairListloadstart == QuestionnairListloadend) {
                loadingEnd();
            }
            RestLogin(data, $scope);
        });
        //$scope.LoadingIsEnd = 0; 
        if (localStorage.MyFolder==null || localStorage.MyFolder == 0)
            Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd,0,8);
        else
            Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, localStorage.MyFolder);


        ///绑定默认文件夹
        $http.get('/QM/GetFolder', {
        }).success(function (data, status, headers, config) {
            $scope.QList.FolderList = data.FolderList;///文件夹列表
            $scope.QList.FolderName = "创建新的文件夹";///当前文件夹名称
            $scope.QList.OtherQuesHide = false;///是否显示自定义问卷内容
            $scope.QList.FolderID = "";///当前自定义文件夹ID
            if (data.FolderList.length > 0) {
                ///如果当前文件夹列表中有文件夹
                ///需要显示自定义文件夹下的文件
                $scope.QList.FolderSetShow = true;
                $scope.QList.OtherQuesHide = true;
                ///设置第一个自定义文件夹为选中
                for (var i = 0; i < $scope.QList.FolderList.length; i++) {
                    if ($scope.QList.FolderList[i].IsSelect) {
                        $scope.QList.FolderName = $scope.QList.FolderList[i].FolderName;
                        $scope.QList.FolderID = $scope.QList.FolderList[i].FolderID;
                    }
                }
                if (localStorage.OtherFolder == null || localStorage.OtherFolder == 0)
                    Folder_GetFolderQuesByFolderID($scope, $http, $scope.QList.LoadingIsEnd, 0, 8);
                else
                    Folder_GetFolderQuesByFolderID($scope, $http, $scope.QList.LoadingIsEnd, 0, localStorage.OtherFolder);
            }
            else {
                $scope.QList.FolderSetShow = false;
                $scope.QList.OtherQuesHide = false;

            }

            //加载成功之后做一些事  
            QuestionnairListloadend = QuestionnairListloadend + 1;
            if (QuestionnairListloadstart == QuestionnairListloadend) {
                loadingEnd();
            }
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            //RestLogin(data, $scope);
        });
    }
    $scope.Init();
   
    ////下载二维码
    //$scope.downLoadQRCode = function () {
    //    $http.post('/QM/DownLoadQRCode', { quesID: questionnaireId }).success(function (data) {
    //        if (data.Message == "") {
    //            window.location.href = data.StrPath;
    //            alert("下载完成。", "green"); 
    //        }
    //        else {
    //            alert(data.Message, "red")
    //        }
    //    }).error(function (data, status, headers, config) {
    //    });

    //}
    ///关闭弹层
    $scope.CloseDiv = function () {
        $("body").removeClass("srcollHide");
        $scope.QList.Popupbackground = 0;
    }

    ///鼠标移动到问卷上
    $scope.QuesMouseover = function (ques,queslist) {
        for (var i = 0; i < queslist.length; i++) {
            queslist[i].MoveOver = { opacity: 0 };
        } 
        ques.MoveOver = { opacity: 1 };
    }
   ///鼠标离开问卷
    $scope.QuesMouseleave = function (queslist) {
        for (var i = 0; i < queslist.length; i++) {
            queslist[i].MoveOver = { opacity: 0 };
        } 
    }

 ///切换公司
    $scope.ChangeCompany = function (company) {
        
        $scope.ChangeCompanyStyle = { display: 'none' };
        if ($scope.QList.CompanyName != company.CompanyName) {
            

            for (var i = 0; i < $scope.QList.Companys.length; i++) {
                $scope.QList.Companys[i].IsCurrent = false;
            }
            company.IsCurrent = true;
            $scope.QList.CompanyName = company.CompanyName;
            $scope.QList.CompanyImg = company.BackgroundImg;

            loadingStart()//loading开始

            QuestionnairListloadstart = 1;
            QuestionnairListloadend = 0;
            $http.post('/QM/ChangeCompany', {
                id: company.CompanyID
            }).success(function (data) {
                ///操作成功
                if (data.Message == "") { 
                    Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd,0,8);
                    $http.get('/QM/GetFolder', {
                    }).success(function (data, status, headers, config) {
                        $scope.QList.FolderList = data.FolderList;///文件夹列表
                        $scope.QList.FolderName = "创建新的文件夹";///当前文件夹名称
                        $scope.QList.OtherQuesHide = false;///是否显示自定义问卷内容
                        $scope.QList.FolderID = "";///当前自定义文件夹ID
                        if (data.FolderList.length > 0) {
                            ///如果当前文件夹列表中有文件夹
                            ///需要显示自定义文件夹下的文件
                            $scope.QList.FolderSetShow = true;
                            $scope.QList.OtherQuesHide = true;
                            ///设置 自定义文件夹选中
                            for (var i = 0; i < $scope.QList.FolderList.length; i++) {
                                if ($scope.QList.FolderList[i].IsSelect) {
                                    $scope.QList.FolderName = $scope.QList.FolderList[i].FolderName;
                                    $scope.QList.FolderID = $scope.QList.FolderList[i].FolderID;
                                }
                            }
                            Folder_GetFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd,0,8);
                        }
                        else {
                            $scope.QList.FolderSetShow = false;
                            $scope.QList.OtherQuesHide = false;

                        }
                        
                        //加载成功之后做一些事  
                        QuestionnairListloadend = QuestionnairListloadend + 1;
                        if (QuestionnairListloadstart == QuestionnairListloadend) {
                            loadingEnd();
                        }
                    }).error(function (data, status, headers, config) {
                        //处理错误 
                        QuestionnairListloadend = QuestionnairListloadend + 1;
                        if (QuestionnairListloadstart == QuestionnairListloadend) {
                            loadingEnd();
                        }
                        RestLogin(data,$scope);
                    });



                } else {
                    alert(data.Message,"red");
                   
                }
                QuestionnairListloadend = QuestionnairListloadend + 1;
                if (QuestionnairListloadstart == QuestionnairListloadend) {
                    loadingEnd();
                }
            });

        }
    }
    ///切换排序
    $scope.ChangeQuesSort = function (sort) {
        $scope.QuesSortStyle = { display: 'none' };
        for (var i = 0; i < $scope.QList.Sorts.length; i++) {
            $scope.QList.Sorts[i].IsSelect = false;
        }
        sort.IsSelect = true;
        $scope.QList.SortName = sort.Name;
        $scope.QList.SortClass = sort.SortClass;
        $scope.QList.SortType = sort.SortType;

        loadingStart()//loading开始
        QuestionnairListloadstart = 1;
        QuestionnairListloadend = 0;
        $http.post('/QM/ChangeSort', {
            type: sort.SortType, name: sort.Name
        }).success(function (data) {
            Folder_GetFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd,0,8);
            Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd,0,8);
            QuestionnairListloadend = QuestionnairListloadend + 1;
            if (QuestionnairListloadstart == QuestionnairListloadend) {
                loadingEnd();
            }
            $scope.LoadingIsEnd = 0;
        }).error(function (data, status, headers, config) {
            QuestionnairListloadend = QuestionnairListloadend + 1;
            if (QuestionnairListloadstart == QuestionnairListloadend) {
                loadingEnd();
            }
            $scope.LoadingIsEnd = 0;
            RestLogin(data, $scope);
            //处理错误   
        });

    }
    ///切换文件夹
    $scope.ChangeFolder = function (folder) {
        $scope.FolderStyle = { display: 'none' };

        $scope.QList.ShowDownFolder = { visibility: 'hidden' };
        if (folder.FolderName != $scope.QList.FolderName) {
            for (var i = 0; i < this.QList.FolderList.length; i++) {
                this.QList.FolderList[i].IsSelect = false;
            }
            folder.IsSelect = true;
            $scope.QList.FolderName = folder.FolderName;
            $scope.QList.FolderID = folder.FolderID;

            loadingStart()//loading开始

            $http.post('/QM/ChangeFolder', {
                id: folder.FolderID
            }).success(function (data) {
              
            }).error(function (data, status, headers, config) {
                loadingEnd()//结束loading
                //处理错误   
                RestLogin(data, $scope);
            }); 
            QuestionnairListloadstart =0;
            QuestionnairListloadend = 0;
            Folder_GetFolderQuesByFolderID($scope, $http,$scope.LoadingIsEnd,0,8);
       
        }

    }
    ///打开新增文件夹窗口
    $scope.OpenAddFolder = function () {

        $scope.QList.ShowDownFolder1 = { visibility: 'hidden' };
        $("body").addClass("srcollHide");
        $scope.QList.Popupbackground = 1;///设置新建文件夹样式
        $scope.EFolder = new Object();
        $scope.EFolder.Name = "";
        $scope.AddFolderForm.$setPristine();
        $scope.QList.SelectFolderID = "";


    }
    ///打开编辑文件夹窗口
    $scope.OpenEditFolder = function () {
        $("body").addClass("srcollHide");
        $scope.QList.Popupbackground = 2;///设置新建文件夹样式 
        $scope.QList.SelectFolderID = $scope.QList.FolderID;
        $scope.NewFolderName = $scope.QList.FolderName;

    } 
    ///新增文件夹
    $scope.SaveFolder = function (isValid) {


        if (isValid) {
            loadingStart()//开始loading

            QuestionnairListloadstart = 1;
            QuestionnairListloadend = 0;
            $http.post('/QM/SaveFolder', {
                title: $scope.EFolder.Name, folderid: $scope.QList.SelectFolderID, isnewsave: 1
            }).success(function (data) { 
                ///操作成功
                if (data.Message == "") {
                    ///隐藏层
                    $scope.CloseDiv();
                    alert("操作成功。","green");

                    QuestionnairListloadstart = QuestionnairListloadstart + 1;
                    ///重新绑定文件夹列表
                    $http.get('/QM/GetFolder', {
                    }).success(function (data, status, headers, config) {
                        var isisfoldercount = false;///是否有绑定前文件夹
                        if ($scope.QList.FolderList.length != 0)
                        {
                            isisfoldercount = true;///绑定前文件夹总数大于0表示有文件夹
                        }
                        $scope.QList.FolderList = data.FolderList;
                        if (data.FolderList.length > 0) {
                            $scope.QList.OtherQuesHide = true;
                            $scope.QList.FolderSetShow = true;

                        }
                        else {
                            $scope.QList.OtherQuesHide = false;
                            $scope.QList.FolderSetShow = false;
                        }
                        $scope.ChangeFolder($scope.QList.FolderList[$scope.QList.FolderList.length - 1]);
                        //for (var i = 0; i < $scope.QList.FolderList.length; i++) {
 
                        //    if ($scope.QList.FolderList[i].IsSelect) {
                        //        $scope.QList.FolderName = $scope.QList.FolderList[i].FolderName;
                        //        $scope.QList.FolderID = $scope.QList.FolderList[i].FolderID;
                        //    }
                        //}
                        //if(isisfoldercount==false)
                        //{

                        //    $scope.QList.OtherQuesHide = true;

                        //    Folder_GetFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd);

                        //}

                        //加载成功之后做一些事  
                        QuestionnairListloadend = QuestionnairListloadend + 1;
                        if (QuestionnairListloadstart == QuestionnairListloadend) {
                            loadingEnd();
                        }
                    }).error(function (data, status, headers, config) {
                        //处理错误   
                        QuestionnairListloadend = QuestionnairListloadend + 1;
                        if (QuestionnairListloadstart == QuestionnairListloadend) {
                            loadingEnd();
                        }
                        RestLogin(data, $scope);
                    });

                } else {
                    alert(data.Message,"red");
                   
                }
                QuestionnairListloadend = QuestionnairListloadend + 1;
                if (QuestionnairListloadstart == QuestionnairListloadend) {
                    loadingEnd();
                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                QuestionnairListloadend = QuestionnairListloadend + 1;
                if (QuestionnairListloadstart == QuestionnairListloadend) {
                    loadingEnd();
                }
                RestLogin(data, $scope);
            });;
        } 
    }

    ///修改文件夹
    $scope.EditFolder = function (isValid) {


        if (isValid) {
            loadingStart()//开始loading
            $http.post('/QM/SaveFolder', {
                title: $scope.NewFolderName, folderid: $scope.QList.SelectFolderID, isnewsave: 0
            }).success(function (data) {
                ///操作成功
                if (data.Message == "") {
                    ///隐藏层
                    $scope.CloseDiv();
                    alert("操作成功。","green");



                    for (var i = 0; i < $scope.QList.FolderList.length; i++) {
                        if ($scope.QList.FolderList[i].FolderID == $scope.QList.FolderID) {
                            $scope.QList.FolderList[i].FolderName = $scope.NewFolderName;
                            $scope.QList.FolderName = $scope.NewFolderName;
                        }
                    }

                    loadingEnd()//结束loading

                } else {
                    alert(data.Message,"red");
                    loadingEnd()//结束loading
                }

                
            }).error(function (data, status, headers, config) {
                //处理错误   
                loadingEnd()//结束loading
                RestLogin(data, $scope);
            });
        } 
            
    }

    ///删除文件夹
    $scope.DelFolder = function () {

   
        loadingStart()//开始loading
        QuestionnairListloadstart = 1;
        QuestionnairListloadend = 0;
            $http.post('/QM/DelPMFolder', {
                id: $scope.QList.FolderID
            }).success(function (data) {
                ///操作成功
                if (data.Message == "") {
                    ///隐藏层
                    $scope.CloseDiv();
                    alert("操作成功。","green");

                    Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, $scope.QList.MyQuesList.length);
                    QuestionnairListloadstart = QuestionnairListloadstart + 1;
                    $http.get('/QM/GetFolder', {
                    }).success(function (data, status, headers, config) {
                        $scope.QList.FolderList = data.FolderList;///文件夹列表
                        $scope.QList.FolderName = "创建新的文件夹";///当前文件夹名称
                        $scope.QList.OtherQuesHide = false;///是否显示自定义问卷内容
                        $scope.QList.FolderID = "";///当前自定义文件夹ID
                        if (data.FolderList.length > 0) {
                            ///如果当前文件夹列表中有文件夹
                            ///需要显示自定义文件夹下的文件
                            $scope.QList.OtherQuesHide = true;
                            $scope.QList.FolderSetShow = true;
                            ///设置第一个自定义文件夹为选中
                            //$scope.FolderName = data.FolderList[0].FolderName;
                            //$scope.FolderList[0].IsSelect = true;
                            //$scope.FolderID = $scope.FolderList[0].FolderID;
                            for (var i = 0; i < $scope.QList.FolderList.length; i++) {
                                if ($scope.QList.FolderList[i].IsSelect) {
                                    $scope.QList.FolderName = $scope.QList.FolderList[i].FolderName;
                                    $scope.QList.FolderID = $scope.QList.FolderList[i].FolderID;
                                }
                            }

                            Folder_GetFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd,0,8);
                        }
                        else
                        {
                            $scope.QList.FolderSetShow = false;
                            $scope.QList.OtherQuesHide = false;
                        }

                        //加载成功之后做一些事 
                        QuestionnairListloadend = QuestionnairListloadend + 1;
                        if (QuestionnairListloadstart == QuestionnairListloadend) {
                            loadingEnd();
                        }
                    }).error(function (data, status, headers, config) {
                        //处理错误 
                        QuestionnairListloadend = QuestionnairListloadend + 1;
                        if (QuestionnairListloadstart == QuestionnairListloadend) {
                            loadingEnd();
                        }
                        RestLogin(data, $scope);
                    });

                } else {
                    alert(data.Message,"red");
                  
                }
                QuestionnairListloadend = QuestionnairListloadend + 1;
                if (QuestionnairListloadstart == QuestionnairListloadend) {
                    loadingEnd();
                }
            }).error(function (data, status, headers, config) {
                //处理错误   
                QuestionnairListloadend = QuestionnairListloadend + 1;
                if (QuestionnairListloadstart == QuestionnairListloadend) {
                    loadingEnd();
                }
                RestLogin(data, $scope);
            });
        
    }
    $scope.GoToDataTrends = function (Ques, evt) {
        evt.stopPropagation();
        $location.path('/QMSet/Publish/' + Ques.QuestionnaireID + '');///当页面不存在时加载的模板
    }
    ///复制问卷
    $scope.CopyQues = function (Ques, type, evt) {
        evt.stopPropagation();

        loadingStart()//开始loading

        QuestionnairListloadstart = 1;
        QuestionnairListloadend = 0;
        $http.post('/QM/CopyQues', {
            quesID: Ques.QuestionnaireID,title:"",folderID:""
        }).success(function (data) {
            $scope.LoadingIsEnd = 0
            ///操作成功
            if (data.returnValue.returnMessage == "") {
                alert(Prompt.QuesCopyOK,"green");
                if (type == 1) {
                    Folder_GetFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, $scope.QList.OtherQuesList.length);
                }
                else {
                    Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, $scope.QList.MyQuesList.length);
                }
                QuestionnairListloadend = QuestionnairListloadend + 1;
                if (QuestionnairListloadstart == QuestionnairListloadend) {
                    loadingEnd();
                }
            } else {
                alert(data.returnValue.returnMessage, "red");
                QuestionnairListloadend = QuestionnairListloadend + 1;
                if (QuestionnairListloadstart == QuestionnairListloadend) {
                    loadingEnd();
                }
            }
        }).error(function (data, status, headers, config) {
            //处理错误   
            QuestionnairListloadend = QuestionnairListloadend + 1;
            if (QuestionnairListloadstart == QuestionnairListloadend) {
                loadingEnd();
            }
            RestLogin(data, $scope);
        });
    }
    var questionnaireId ;
    //预览的图标显示
    $scope.PreViewClick = function (quesID, evt) {
        questionnaireId = quesID;
        evt.stopPropagation();
        loadingStart()//开始loading

        $http.post('/Home/CheckSessionLost', {//验证是否过期
        }).success(function (data) {
            if (data.IsSessionLost) {
                RestLogin(data.Message, $scope);
            }
            else {
                //预览
                $scope.Unify.QuesPreview("#QuesPreviewHref", "#QuesPreviewURl", quesID);
                loadingEnd()//结束loading
                $("body").addClass("srcollHide");
                $scope.QList.Popupbackground = 6;
            }
        })
       
    }
  
    ///删除问卷弹层显示
    $scope.OpenDelQues = function (Ques, type, evt) {
        evt.stopPropagation();
        $http.post('/Home/CheckSessionLost', {//验证是否过期
        }).success(function (data) {
            if (data.IsSessionLost) {
                RestLogin(data.Message, $scope);
            }
            else {
                $("body").addClass("srcollHide");
                $scope.QList.Popupbackground = 4;
                $scope.QList.DelQ = Ques;
                $scope.QList.DelT = type;
                $scope.QList.DelPassWord = "";
                $("#delMessage").css("display", "none");
            }
        })
    }

    //enter 键 esc键 操作   参数type 1：删除问卷操作 2：移动问卷操作 3：重命名文件夹
    $scope.enterOrEscOper = function (type) {
        if (window.event.keyCode == 13) {
            if (type==1) {
                $scope.DelQuesByPassword();
            }
            if (type == 3) {
                $scope.EditFolder(EditFForm.$valid);
            }
            
            if (type == 4) {
                $scope.SaveFolder(AddFolderForm.$valid);
            }
        }
        if (window.event.keyCode == 27) {
            $scope.CloseDiv();
        }
    }

    ///删除问卷提交
    $scope.DelQuesByPassword = function () {
        //$scope.CloseDiv();
        console.log($scope.QList.DelPassWord);
        if ($("#delete-survey").val() != "choiceform")
        {
            //alert("您输入的choice form不正确，请重新输入。","red");
            //return;
            $("#delMessage").css("display", "block");
            return;
        }

        loadingStart()//开始loading

        QuestionnairListloadstart = 1;
        QuestionnairListloadend = 0;
        $http.post('/QM/DelQues', {
            quesID: $scope.QList.DelQ.QuestionnaireID
        }).success(function (data) {
            ///操作成功
            if (data.Message == "") {
                $scope.CloseDiv();
                $scope.LoadingIsEnd = 0;
                alert("删除成功。","green");
                if ($scope.QList.DelT == 1) {

                    Folder_GetFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, $scope.QList.OtherQuesList.length);
                }
                else {
                    Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, $scope.QList.MyQuesList.length);
                }
                QuestionnairListloadend = QuestionnairListloadend + 1;
                if (QuestionnairListloadstart == QuestionnairListloadend) {
                    loadingEnd();
                }
            } else {
                alert(data.Message,"red");
                QuestionnairListloadend = QuestionnairListloadend + 1;
                if (QuestionnairListloadstart == QuestionnairListloadend) {
                    loadingEnd();
                }
            }
        }).error(function (data, status, headers, config) {
            //处理错误   
            QuestionnairListloadend = QuestionnairListloadend + 1;
            if (QuestionnairListloadstart == QuestionnairListloadend) {
                loadingEnd();
            }
            RestLogin(data, $scope);
        });
    }
    ///移动问卷弹层显示
    $scope.OpenMoveQues = function (Ques, type, evt) {
        evt.stopPropagation();
        $http.post('/Home/CheckSessionLost', {//验证是否过期
        }).success(function (data) {
            if (data.IsSessionLost) {
                RestLogin(data.Message, $scope);
            }
            else {
                if ($scope.QList.FolderList.length == 0) {
                    alert("请先创建文件夹。", "red");
                    return;
                }
                $("body").addClass("srcollHide");
                $scope.QList.Popupbackground = 5;
                $scope.QList.ShowMoveSelectFolderInfoNum = 0;
                $scope.QList.MoveQ = Ques;
                $scope.QList.MoveT = type;
                var array = new Array();
                if (type == 1) {
                    for (var i = 0; i < this.QList.FolderList.length; i++) {

                        if ($scope.QList.FolderList[i].FolderID != $scope.QList.FolderID) {
                            array.push(this.QList.FolderList[i]);
                        }
                    }
                    $scope.QList.MoveQuesFolder = '我的文件夹';
                    $scope.QList.ShowMoveFolderList = array;
                    $scope.QList.SelectMoveFolderID = '';
                }
                else {
                    $scope.QList.ShowMoveFolderList = angular.copy($scope.QList.FolderList);
                    $scope.QList.MoveQuesFolder = $scope.QList.ShowMoveFolderList[0].FolderName;
                    $scope.QList.SelectMoveFolderID = $scope.QList.ShowMoveFolderList[0].FolderID;
                }
            }
        })
    }
    ///选中要移动的目录
    $scope.ChangeMoveFolder = function (id,name) {
        $scope.QList.MoveQuesFolder = name;
        $scope.QList.SelectMoveFolderID = id;
        $scope.QList.ShowMoveSelectFolderInfo = { display: 'none' }; 
        closeAll("ul.downul");
    }
    ///移动目录的保存方法
    $scope.MoveFolder = function () {

        loadingStart()//开始loading

        QuestionnairListloadstart = 1;
        QuestionnairListloadend = 0;
        $http.post('/QM/MoveQuesToFolder', {
            quesID: $scope.QList.MoveQ.QuestionnaireID, targeid: $scope.QList.SelectMoveFolderID
        }).success(function (data) {
            ///操作成功
            if (data.Message == "") {
                $scope.CloseDiv();
                $scope.LoadingIsEnd = 0;
                alert("操作成功。","green");
                if ($scope.QList.MoveT == 1) {
                    if ($scope.QList.SelectMoveFolderID == "") {
                        Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, $scope.QList.MyQuesList.length);
                    }
                     
                    Folder_GetFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, $scope.QList.OtherQuesList.length);
                }
                else {
                    Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, $scope.QList.MyQuesList.length);
                    if ($scope.QList.SelectMoveFolderID == $scope.QList.FolderID) {

                        Folder_GetFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd, 0, $scope.QList.OtherQuesList.length);
                    }
                }
     
            } else {
                alert(data.Message,"red");
 
            }
            QuestionnairListloadend = QuestionnairListloadend + 1;
            if (QuestionnairListloadstart == QuestionnairListloadend) {
                loadingEnd();
            }
        }).error(function (data, status, headers, config) {
            //处理错误   
            QuestionnairListloadend = QuestionnairListloadend + 1;
            if (QuestionnairListloadstart == QuestionnairListloadend) {
                loadingEnd();
            }
            RestLogin(data, $scope);
        });
    }
    ///跳转问卷设计界面
    $scope.ReturnQuestionnairDesign = function (Ques) {
        window.location.href = "/QD/QuestionnairDesign?quesID=" + Ques.QuestionnaireID;
    }

    ///跳转到分析结果
    $scope.turnToAnalyzeResults = function (quesId) {
        $http.post('/Home/CheckSessionLost', {//验证是否过期
        }).success(function (data) {
            if (data.IsSessionLost) {
                RestLogin(data.Message, $scope);
            }
            else {
                window.location.href = "/Home/DashBoard#/QMSet/AnalyzeResults/" + quesId + "/DataTrends";
            }
        })
        
    }
    ///跳转到发布设置
    $scope.turnToPublish = function (quesId) {
        $http.post('/Home/CheckSessionLost', {//验证是否过期
        }).success(function (data) {
            if (data.IsSessionLost) {
                RestLogin(data.Message, $scope);
            }
            else {
                window.location.href = "/Home/DashBoard#/QMSet/Publish/" + quesId ;
            }
        })

    }
    ///设置点击背景不关闭弹层
    $scope.ShowPopup = function (evt) {
        evt.stopPropagation();
    }

    ///跳转链接
    $scope.GoToUrl = function (url, folderId) {
        $http.post('/Home/CheckSessionLost', {//验证是否过期
        }).success(function (data) {
            if (data.IsSessionLost) {
                RestLogin(data.Message, $scope);
            }
            else {
                if (folderId) {
                    url = url + folderId;
                }
                $location.path(url);
            }
        })
    }

    ///点击加载更多
    $scope.AddMoreQues=function(type)
    {
        if(type=="0")
        {

            Folder_GetMyFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd,  $scope.QList.MyQuesList.length,8);
        }
        else
        {

            Folder_GetFolderQuesByFolderID($scope, $http, $scope.LoadingIsEnd,  $scope.QList.OtherQuesList.length,8);
        }

    }

}

]);
///根据文件夹ID获取问卷
function Folder_GetFolderQuesByFolderID($scope, $http, loadingIsEnd, skip, take)
{
    if (take < 8)
        take = 8;

    QuestionnairListloadstart = QuestionnairListloadstart + 1;
    //if (loadingIsEnd != 0) {
    //    loadingStart()
    //}
    ///获取自定义文件夹的问卷
    $http.get('/QM/GetQuestionInfoByFolderID', {
        params: { id: $scope.QList.FolderID, sorttype: $scope.QList.SortType, skip:skip, take:take }
    }).success(function (data, status, headers, config) {
        //   var tmplist = new Array();
        var ids = new Array();
        if (skip == 0)
        {
            $scope.QList.OtherQuesList = data.QuesList;   ///自定义文件夹下的问卷

            for (var i = 0; i < $scope.QList.OtherQuesList.length; i++) {

                ids.push($scope.QList.OtherQuesList[i].QuestionnaireID);
            }
        }
        else
        {
            for(var i=0;i<data.QuesList.length;i++)
            {
                $scope.QList.OtherQuesList.push(data.QuesList[i]);
                ids.push(data.QuesList[i].QuestionnaireID);
            }
        }


        localStorage.OtherFolder = skip + take;

        if (data.IsEnd)
            $scope.QList.OtherAddQues = false;
        else
            $scope.QList.OtherAddQues = true;
     
        //加载成功之后做一些事  
        QuestionnairListloadend = QuestionnairListloadend + 1;
        if (QuestionnairListloadstart == QuestionnairListloadend) {
            loadingEnd();
        }

     

        $http.get('/QM/GetQuesProgressWidthByids', {
            params: { ids: ids }
        }).success(function (data, status, headers, config) {

            if (data.IsTrue) {
                for (var i = 0; i < $scope.QList.OtherQuesList.length; i++) {
                    for (var j = 0; j < data.QuesList.length; j++) {

                        if ($scope.QList.OtherQuesList[i].QuestionnaireID == data.QuesList[j].QuesID) {
                            $scope.QList.OtherQuesList[i].QuesSubmitNum = data.QuesList[j].QuesSubmitNum;
                            $scope.QList.OtherQuesList[i].ProgressWidth.width = data.QuesList[j].ProgressWidth + "%";

                        }
                    }
                }
            }

        }).error(function (data, status, headers, config) {

            //处理错误   
            //RestLogin(data, $scope);
        });


    }).error(function (data, status, headers, config) {
        //处理错误   
        QuestionnairListloadend = QuestionnairListloadend + 1;
        if (QuestionnairListloadstart == QuestionnairListloadend) {
            loadingEnd();
        }
        RestLogin(data, $scope);
    });
}

///获取我的文件夹下的问卷
function Folder_GetMyFolderQuesByFolderID($scope, $http, loadingIsEnd, skip, take)
{
    QuestionnairListloadstart = QuestionnairListloadstart + 1;
    if (take < 8)
        take = 8;
    //if (loadingIsEnd!=0) {
    //    loadingStart()
    //}
    ///获取我的文件夹下的问题
    $http.get('/QM/GetQuestionInfoByFolderID', {
        params: { id: "", sorttype: $scope.QList.SortType, skip: skip, take: take }
    }).success(function (data, status, headers, config) {

        var ids = new Array();
        if (skip == 0) {
            $scope.QList.MyQuesList = data.QuesList;   ///自定义文件夹下的问卷

            for (var i = 0; i < $scope.QList.MyQuesList.length; i++) {

                ids.push($scope.QList.MyQuesList[i].QuestionnaireID);
            }
        }
        else {
            for (var i = 0; i < data.QuesList.length; i++) {
                $scope.QList.MyQuesList.push(data.QuesList[i]);
                ids.push(data.QuesList[i].QuestionnaireID);
            }
        }


        localStorage.MyFolder = skip + take;

        if (data.IsEnd)
            $scope.QList.MyAddQues = false;
        else
            $scope.QList.MyAddQues = true;


      //  $scope.QList.MyQuesList = data.QuesList;///获取当前我的文件夹下的问卷

        //加载成功之后做一些事  
        QuestionnairListloadend = QuestionnairListloadend + 1;
        if (QuestionnairListloadstart == QuestionnairListloadend) {
            loadingEnd();
        }
        var ids = new Array();
        for (var i = 0; i < $scope.QList.MyQuesList.length;i++)
        {
            
            ids.push($scope.QList.MyQuesList[i].QuestionnaireID);
        }

        $http.get('/QM/GetQuesProgressWidthByids', {
            params: { ids: ids }
        }).success(function (data, status, headers, config) {

            if (data.IsTrue) {
                for (var i = 0; i < $scope.QList.MyQuesList.length; i++) {
                    for (var j = 0; j < data.QuesList.length; j++) {

                        if ($scope.QList.MyQuesList[i].QuestionnaireID == data.QuesList[j].QuesID) {
                            $scope.QList.MyQuesList[i].QuesSubmitNum = data.QuesList[j].QuesSubmitNum;
                            $scope.QList.MyQuesList[i].ProgressWidth.width = data.QuesList[j].ProgressWidth+"%";

                        }
                    }
                }
            }

        }).error(function (data, status, headers, config) {
           
            //处理错误   
            //RestLogin(data, $scope);
        });

        
    }).error(function (data, status, headers, config) {
        QuestionnairListloadend = QuestionnairListloadend + 1;
        if (QuestionnairListloadstart == QuestionnairListloadend) {
            loadingEnd();
        }
        //处理错误   
        RestLogin(data, $scope);
    });
}


 