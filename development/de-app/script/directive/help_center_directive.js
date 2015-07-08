
/**
    帮助中心模块
*/
angular.module("helpCenterModule", [])

/**
    帮助中心指令
*/
.directive("helpCenter", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/help-center.html",
        replace: true,
        scope: {
            todo: "=helpCenter"
        },
        controller: "HelpCenterController"
    }
})
/**
    帮助中心控制器
*/
.controller("HelpCenterController", ["$scope",
    function ($scope) {
        
    }
]);