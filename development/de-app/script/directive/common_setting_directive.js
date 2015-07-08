
/**
    通用设置模块
*/
angular.module("commonSettingModule", [])

/**
    通用设置指令 
*/
.directive("commonSetting", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/sidebar/mc-options/common-settings.html",
        replace: true,
        scope: {
            todo: "=commonSetting"
        },
        controller: "CommonSettingController"
    }


})
/**
    通用设置控制器 
*/
.controller("CommonSettingController", ["$scope",
    function ($scope) {


    }

]);