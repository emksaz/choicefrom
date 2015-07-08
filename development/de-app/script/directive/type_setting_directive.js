
/**
    类型设置模块
*/
angular.module("typeSettingModule", [])

/**
    类型设置指令
*/
.directive("typeSetting", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/sidebar/mc-options/type-settings.html",
        replace: true,
        scope: {
            todo: "=typeSetting"
        },
        controller: "TypeSettingController"
    }
})
/**
    类型设置控制器
*/
.controller("TypeSettingController", ["$scope",
    function ($scope) {


    }

]);