
/**
    版本管理模块
*/
angular.module("versionDropModule", [])

/**
    版本管理指令
*/
.directive("versionDrop", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/history.html",
        replace: true,
        scope: {
            versionHistoryManager: "=versionDrop",
            PopupMessageManager: "=popupmessageManager",
            designManager:"=designManager"
        },
        controller: "VersionDropController"
    }
})
/**
    版本管理控制器
*/
.controller("VersionDropController", ["$scope",
    function ($scope) {
        /**
           处理版本删除点击事件
       */
        $scope.handleDeleteIconClick = function (version, event) {
            // 删除该版本
            this.PopupMessageManager.deleteVersionInfo(version);
            event.stopPropagation();
        }

        /**
            处理版本改名点击事件
        */
        $scope.handleChangeIconClick = function (version) {
            // 更改该版本名字
            this.versionHistoryManager.changeVersionName(version);
            event.stopPropagation();
        }

        /**
            处理版本条目点击事件
        */
        $scope.handleVersionItemClick = function (version) {
            this.versionHistoryManager.importVersion(version.verID);
        }

        /**
            处理保存版本点击事件
        */
        $scope.handleVersionSaveClick = function () {
            this.versionHistoryManager.saveVersion();
        }
    }
]);