

/**
    节点校验模块
*/
angular.module("nodeValidator", ["dragging"])

/**
    节点校验指令
*/
.directive("nodeValidator", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/node_validator_template.html",
        replace: true,
        scope: {
            designManager: "=nodeValidator"
        },
        controller: "NodeValidatorController",
    }
})

/**
    节点校验控制器
*/
.controller("NodeValidatorController", ["$scope", "dragging", "recordManager",
    function ($scope, dragging, recordManager) {
        var parentScope = $scope.$parent;

        /**
            处理校验结果窗口鼠标点击事件
            @evt 事件参数
        */
        $scope.handleValidatorMouseDown = function (evt) {
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
                    that.designManager.validateManager.x += deltaX;
                    that.designManager.validateManager.y += deltaY;

                    // 对angular静默模式时需要自己更新连接位置
                    if (this.options.silent) {
                        that.designManager.validateManager.fixPosition();
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
            处理校验条目点击事件
            @node 节点
        */
        $scope.handleValidatorItemClick = function (node) {
            // 单选该节点
            this.designManager.selectNodeSingle(node);
            // 将节点移到中间
            this.designManager.takeToCenter(node);
        }

        /**
            处理关闭校验结果点击事件
        */
        $scope.handleCloseValidatorClick = function () {
            // 关闭校验结果窗口
            this.designManager.validateManager.close();
        }
    }
]);

