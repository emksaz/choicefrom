
/**
    调试模块
*/
angular.module("popupDebugModule", [])

/**
    调试指令
*/
.directive("popupDebug", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/popup-debug.html",
        replace: true,
        scope: {
            todo: "=popupDebug"
        },
        controller: "PopupDebugController"
    }


})
/**
    调试控制器
*/
.controller("PopupDebugController", ["$scope",
    function ($scope) {


    }

]);