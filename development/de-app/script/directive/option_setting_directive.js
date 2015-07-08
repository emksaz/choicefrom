
/**
    选项设置模块
*/
angular.module("optionSettingModule", [])

/**
    选项设置指令
*/
.directive("optionSetting", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/sidebar/mc-options/mc-options-settings.html",
        replace: true,
        scope: {
            todo: "=optionSetting"
        },
        controller: "OptionSettingController"
    }
})
/**
    选项设置控制器
*/
.controller("OptionSettingController", ["$scope",
    function ($scope) {


    }

]);