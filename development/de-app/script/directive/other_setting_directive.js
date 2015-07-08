
/**
    其他设置模块
*/
angular.module("otherSettingModule", [])

/**
    其他设置指令
*/
.directive("otherSetting", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/sidebar/mc-options/other-settings.html",
        replace: true,
        scope: {
            todo: "=otherSetting"
        },
        controller: "OtherSettingController"
    }


})
/**
    其他设置控制器
*/
.controller("OtherSettingController", ["$scope",
    function ($scope) {


    }

]);