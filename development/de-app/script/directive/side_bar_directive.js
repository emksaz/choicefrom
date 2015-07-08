
/**
    侧板模块
*/
angular.module("sideBarModule", [])

/**
    侧板指令
*/
.directive("sideBar", function () {
    var clickEvent = ZYDesign.PageRegisterEvent.Click_Event;
    return {
        restrict: 'A',
        templateUrl: "/Content/de/layout/sidebar.html",
        replace: true,
        scope: {
            node: "=sideBar",
            designManager:"=designManager"
        },
        controller: "SideBarController",
        link: function ($scope, $element) {
            clickEvent.select_tab_panel(".tab", ".tabs",$element);
        }
    }


})
/**
    侧板控制器
*/
.controller("SideBarController", ["$scope","designManager",
    function ($scope,designManager) {
        /**
            处理节点名称变化事件
            @node 节点
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleNodeNameChange = function (node, type) {
            designManager.recordCommonChange(node, "nodeName", type, "更改节点名");
        }

        /**
            处理节点定位点击事件
        */
        $scope.handleNodeLocateClick = function (node) {
            designManager.takeToCenter(node);
        }
    }
]);