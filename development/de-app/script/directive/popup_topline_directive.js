
/**
    模块
*/
angular.module("popupToplineModule", [])

/**
    指令
*/
.directive("popupTopline", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/popup-topline.html",
        replace: true,
        scope: {
            todo: "=popupTopline"
        },
        controller: "PopupToplineController"
    }


})
/**
    控制器
*/
.controller("PopupToplineController", ["$scope",
    function ($scope) {


    }

]);