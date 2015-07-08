

/**
    版本历史控制模块
*/
angular.module("versionHistory", [])

/**
    版本历史控制指令
*/
.directive("versionHistory", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/version_history_template.html",
        replace: true,
        scope: {
            versionHistoryManager: "=versionHistory"
        },
        controller: "VersionHistoryController",
    }
})

/**
    版本历史控制控制器
*/
.controller("VersionHistoryController", ["$scope","recordManager",
    function ($scope, recordManager) {
        /**
            处理版本删除点击事件
        */
        $scope.handleDeleteIconClick = function (version, event) {
            var that = this;
            confirm(Prompt.QSNRD_ConfirmVersionDelete, function () {
                // 删除该版本
                that.versionHistoryManager.deleteVersion(version);
            }, null, "是", "", "否");
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

