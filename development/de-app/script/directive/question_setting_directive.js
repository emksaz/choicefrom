
/**
    问题设置模块
*/
angular.module("questionSettingModule", [])

/**
    问题设置指令
*/
.directive("questionSetting", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/sidebar/mc-options/question-settings.html",
        replace: true,
        scope: {
            node: "=questionSetting"
        },
        controller: "QuestionSettingController",
        link:{

        }
    }
})
/**
    问题设置控制器
*/
.controller("QuestionSettingController", ["$scope","designManager",
    function ($scope,designManager) {
        
    }

]);