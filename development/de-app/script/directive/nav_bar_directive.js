
/**
    导航模块
*/
angular.module("navBarModule", [])

/**
    导航模块指令
*/
.directive("navBar", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/layout/nav.html",
        replace: true,
        scope: {
            designManager: "=navBar"
        },
        controller: "NavBarController"
    }


})
/**
    导航模块控制器
*/
.controller("NavBarController", ["$scope", "recordManager",
    function ($scope, recordManager) {

        /**
            处理保存按钮点击事件
        */
        $scope.handleSaveClick = function () {
            // 保存问卷信息
            this.designManager.save("N", null, null, "Y", "");
            // 重置自动保存
            this.designManager.autoSaveManager.reset();
        }

        /**
            处理调试按钮点击事件
        */
        $scope.handleTestClick = function () {
            // 调试问卷
            this.designManager.test();
        }


        /**
            redo按钮点击事件
        */
        $scope.handleRedoClick = function () {
            // 重做上次操作
            recordManager.redo() && designManager.digest();
        }


        /**
            undo按钮点击事件
        */
        $scope.handleUndoClick = function () {
            // 撤销上次操作
            if (recordManager.undo()) {
                designManager.digest();
            }
        }

        /**
            处理发布按钮点击事件
        */
        $scope.handleReleaseIconClick = function () {
            var url = "/Home/DashBoard#/QMSet/Publish/" + $("#quesIDEx").val();
            this.designManager.PopupMessageManager.leavePage(url);
        }

        /**
            处理版本控制鼠标覆盖事件
        */
        $scope.handleVersionHistoryMouseEnter = function () {
            // 保持版本控制器打开状态
            this.designManager.versionHistoryManager.open();
        }

        /**
            处理版本控制鼠标离开事件
        */
        $scope.handleVersionHistoryMouseLeave = function () {
            // 关闭版本控制器
            this.designManager.versionHistoryManager.close();
        }


        /**
            处理返回问卷设置按钮点击事件
        */
        $scope.handleBackIconClick = function () {
            var url = "/Home/DashBoard#/QM";
            this.designManager.PopupMessageManager.leavePage(url);
        }
    }

]);