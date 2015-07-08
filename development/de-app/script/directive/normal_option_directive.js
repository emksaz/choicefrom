
/**
    版本管理模块
*/
angular.module("normalOptionModule", [])

/**
    版本管理指令
*/
.directive("normalOption", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/template/options.html",
        replace: true,
        scope: {
            todo: "=normalOption"
        },
        controller: "NormalOptionController"
    }
})
/**
    版本管理控制器
*/
.controller("NormalOptionController", ["$scope",
    function ($scope) {
        
    }
]);