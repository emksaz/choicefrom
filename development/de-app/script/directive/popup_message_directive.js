
/**
    提示信息模块
*/
angular.module("popupMessageModule", [])

/**
    提示信息指令
*/
.directive("popupMessage", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/popup-message.html",
        replace: true,
        scope: {
            designManager: "=popupMessage"
        },
        controller: "PopupMessageController"
    }


})
/**
    提示信息控制器
*/
.controller("PopupMessageController", ["$scope",
    function ($scope) {

        /**
            关闭提示消息，停留在本页面
        */
        $scope.handlePopupMessageClose = function () {
            this.designManager.PopupMessageManager.close();
        }

        /**
            确定保存编辑信息，并离开本页面
        */
        $scope.handleSaveEditInfo = function () {
            this.designManager.PopupMessageManager.confirmOperation();
        }
        /**
            不保存编辑信息，并离开本页面
        */
        $scope.handleCancelSaveEditInfo = function () {
            this.designManager.PopupMessageManager.cancelOperation();
        }
    }

]);