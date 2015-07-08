
function QuestionnairSettingsInfo($scope, $stateParams, $http) {

    $scope.name = $stateParams.inboxId + $stateParams.idx;
    // ///get获取方法
    //$http.get('/PM/TestGetID', {
    //    params: { id: $stateParams.inboxId }
    //}).success(function (data, status, headers, config) {
    //    $scope.name1 = data;
    //    $("#txt1").val(data);
    //    //加载成功之后做一些事  
    //}).error(function (data, status, headers, config) {
    //    //处理错误   
    //});

    ///Post方法
    $http.post('/Home/TestGetID', { id: $stateParams.inboxId }).success(function (response) {
        $scope.name1 = response;
        $("#txt1").val(response); 
    });

    //$.ajax({
    //    type: "POST",
    //    url: "/PM/TestGetID",
    //    data: {
    //        id: $stateParams.inboxId,

    //    },
    //    dataType: "json",
    //    beforeSend: function () {
           
    //    },
    //    error: function (e) {
    //        //ErrAlert(e, "操作失败！");
    //        alert(e.responseText);
            
    //    },
    //    success: function (data) {
    //        $("#txt1").val(data);
    //        $scope.name1 = data;
    //        $scope.$digest(); 用原来的在后面增加此行代码
    //    }
    //});

}
