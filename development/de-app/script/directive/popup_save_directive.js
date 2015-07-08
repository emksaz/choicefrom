
/**
    保存版本弹框模块
*/
angular.module("popupSaveModule", [])

/**
    保存版本弹框指令
*/
.directive("popupSave", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/popup-save.html",
        replace: true,
        scope: {
            versionSaveManager: "=popupSave"
        },
        controller: "PopupSaveController"
    }


})
/**
    保存版本弹框控制器
*/
.controller("PopupSaveController", ["$scope",
    function ($scope) {
        /**
            处理取消版本保存点击事件
        */
        $scope.handleCancleVersionClick = function () {
            this.versionSaveManager.close();
        }
        /**
            版本保存
        */
        $scope.handleSaveVersionClick = function () {
            this.versionSaveManager.save();
        }
    }

]);