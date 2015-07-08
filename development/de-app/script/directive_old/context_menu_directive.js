

/**
    上下文菜单模块
*/
angular.module("contextMenu", [])

/**
    上下文菜单指令
*/
.directive("contextMenu", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/context_menu_template.html",
        replace: true,
        scope: {
            contextMenu: "=contextMenu"
        },
        controller: "ContextMenuController",
    }
})

/**
    上下文菜单控制器
*/
.controller("ContextMenuController", ["$scope", "recordManager",
    function ($scope, recordManager) {
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

