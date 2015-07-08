
/**
    查询模块
*/
angular.module("popupSearchModule", ["dragging"])

/**
    查询指令
*/
.directive("popupSearch", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/popup-search.html",
        replace: true,
        scope: {
            designManager: "=popupSearch"
        },
        controller: "PopupSearchController"

    }


})
/**
    查询控制器
*/
.controller("PopupSearchController", ["$scope", "dragging", "$element",
    function ($scope, dragging, $element) {
        /**
            处理搜索结果列表点击事件
            @evt 事件参数
        */
        $scope.handleResultMouseDown = function (evt) {
            // 最后一次鼠标位置的记录器
            // 让当前活跃元素失去焦点
            $(document.activeElement).blur();
            var lastMouseCoords;
            var that = this;
            // 监听拖拽
            dragging.startDrag(evt, {

                /**
                    开始拖拽
                */
                dragStarted: function (x, y) {
                    that.designManager.disableConns();
                    // 记录当前位置
                    lastMouseCoords = {
                        x: x,
                        y: y
                    }
                    if (this.options.silent) {
                        that.designManager.digest();
                    }

                },

                /**
                    拖拽中
                */
                dragging: function (x, y) {
                    // 当前位置
                    var curCoords = {
                        x: x,
                        y: y
                    }
                    // 获得拖动距离
                    var deltaX = curCoords.x - lastMouseCoords.x;
                    var deltaY = curCoords.y - lastMouseCoords.y;

                    // 更新搜索结果框的位置
                    that.designManager.searchManager.x += deltaX;
                    that.designManager.searchManager.y += deltaY;

                    // 对angular静默模式时需要自己更新连接位置
                    if (this.options.silent) {
                        that.designManager.searchManager.fixPosition();
                    }

                    // 更新最后位置
                    lastMouseCoords = curCoords;
                },

                dragEnded: function () {
                    that.designManager.enableConns();
                },

                clicked: function () {

                },

                options: { silent: ZYDesign.Config.draggingSilent }


            });
        }

        /**
            处理搜索结果条目鼠标点击事件
            @node 节点
        */
        $scope.handleResultItemClick = function (node) {
            // 单选该节点
            this.designManager.selectNodeSingle(node);
            // 将节点移到中间
            this.designManager.takeToCenter(node);
        }

        /**
            处理搜索结果关闭按钮点击事件
        */
        $scope.handleCloseResultClick = function () {
            // 关闭搜索窗口
            this.designManager.searchManager.close();
        }
    }

]);