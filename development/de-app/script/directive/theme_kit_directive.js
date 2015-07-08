
/**
    主题模块
*/
angular.module("themeKitModule", [])

/**
    主题指令
*/
.directive("themeKit", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/kit/theme-kit.html",
        replace: true,
        scope: {
            themeBoxManager: "=themeKit"
        },
        controller: "ThemeKitController"
    }


})
/**
    主题控制器
*/
.controller("ThemeKitController", ["$scope",
    function ($scope) {


    }

]);