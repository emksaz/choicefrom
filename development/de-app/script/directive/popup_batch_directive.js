
/**
    批量输入模块
*/
angular.module("popupBatchModule", [])

/**
    批量输入指令
*/
.directive("popupBatch", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/popup-batch.html",
        replace: true,
        scope: {
            todo: "=popupBatch"
        },
        controller: "PopupBatchController"
    }


})
/**
    批量输入控制器
*/
.controller("PopupBatchController", ["$scope",
    function ($scope) {


    }

]);