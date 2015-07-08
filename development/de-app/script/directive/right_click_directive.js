
/**
    右键菜单模块
*/
angular.module("rightClickModule", [])

/**
    右键指令
*/
.directive("rightClick", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/right-click.html",
        replace: true,
        scope: {
            contextMenu: "=rightClick"
        },
        controller: "RightClickController"
    }
})
/**
    右键控制器
*/
.controller("RightClickController", ["$scope",
    function ($scope) {

        /**
            处理菜单鼠标落下事件
            @evt 事件参数
        */
        $scope.handleMenuMouseDown = function (evt) {
            evt.stopPropagation();
        }

        /**
            处理菜单项点击事件
            @item 菜单项
        */
        $scope.handleMenuItemClick = function (item) {
            // 执行菜单项的动能 registered in record
            this.contextMenu.executeItem(item);
        }
    }
]);