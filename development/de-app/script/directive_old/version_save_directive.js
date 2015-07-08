

/**
    版本保存模块
*/
angular.module("versionSave", [])

/**
    版本保存指令
*/
.directive("versionSave", function () {
    var versionManager;
    function handleInputKeyDown(evt) {
        // 禁用tab键
        if (evt.keyCode == 9) {
            evt.preventDefault();
            return;
        }
        if (evt.keyCode == 27) {
            versionManager.close();
            versionManager.digest();
            return;
        }
        if (evt.keyCode == 13) {
            versionManager.save();
            versionManager.digest();
        }
    }
    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/version_save_template.html",
        replace: true,
        scope: {
            versionSaveManager: "=versionSave"
        },
        controller: "VersionSaveController",
        link: function ($scope, $elem) {
            versionManager = $scope.versionSaveManager;
            $elem.find("input").on("keydown", handleInputKeyDown);
        }
    }
})

/**
    版本保存控制器
*/
.controller("VersionSaveController", ["$scope", "recordManager",
    function ($scope, recordManager) {
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

