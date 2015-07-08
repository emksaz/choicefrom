
function DoSubmitForSetPassword() {
    $("#SetPassword").click();
}   
function SetPw(){
    this.IsSameFlag = false;//两次输入的密码是否一致，默认不一致
    this.SetSubmitFlag = false;// 设置密码按钮可用与否

}
var setPwApp = angular.module("myapp", ["ui.router"]);
setPwApp.controller("SetPwCtrl", ["$scope", "$stateParams", "$http", "$location",
function ($scope, $stateParams, $http, $location) {
    $scope.SetPw = new SetPw;
    $scope.setPassword = function () {
        $http.post("/UM/SetPassword", { email: $("#Email").val(), resetcode: $("#RandomCode").val(), password: $scope.SetPw.Password }).success(function (data) {
            $scope.SetPw.Password = "";
            $scope.SetPw.ConfirmPassword = "";
            if (data.Flag) {
                window.location.href = "404";
            }
            if (data.Message!="") {
                alert(data.Message)
            }
        }).error(function (data, status, headers, config) {
            //处理错误   
            loadingEnd();
            RestLogin(data);
        });
    }

    //验证密码的一致性
    $scope.ValidPwdConsistency = function (isValid, isdirty) {
        if (!isValid || !isdirty) {
            $scope.SetPw.SetSubmitFlag = false;
        } else {
            if ($scope.SetPw.Password != $scope.SetPw.ConfirmPassword) {
                $scope.SetPw.SomeFlag = true;//输入不一致的错误提示
                $scope.SetPw.SetSubmitFlag = false;
            } else {
                $scope.SetPw.SomeFlag = false;//输入不一致的错误提示
                $scope.SetPw.SetSubmitFlag = true;
            }
        }
    }
}]);