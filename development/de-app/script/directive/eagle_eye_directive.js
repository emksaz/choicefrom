

/**
    鹰眼模块
*/
angular.module("eagleEye", ["dragging"])

/**
    鹰眼指令
*/
.directive("eagleEye", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/layout/eagle_eye_template.html",
        replace: true,
        scope: {
            designManager: "=eagleEye"
        },
        controller: "EagleEyeController",
    }
})

/**
    鹰眼控制器
*/
.controller("EagleEyeController", ["$scope", "dragging", "$element", "recordManager",
function ($scope, dragging, $element, recordManager) {

    $scope.handleEyeMouseDown = function (evt) {
        var designManager = this.designManager;
        // 在鹰眼上点击的位置
        var lastMouseCoords = designManager.translateCoordinates(evt.pageX, evt.pageY, $element);
        var startMouseCoords;
        // 画布信息
        var borderInfo = designManager.borderInfo;
        // 容器信息
        var containerInfo = designManager.containerInfo;
        // 容器纵横比例
        var containerRatio = containerInfo.width / containerInfo.height;
        // 画布纵横比例
        var borderRatio = borderInfo.width / borderInfo.height;

        var xRatio = 1;
        var yRatio = 1
        // 画布宽度不足
        if (containerRatio > borderRatio) {
            xRatio = borderRatio / containerRatio;
            // 画布高度不足
        } else {
            yRatio = containerRatio / borderRatio;
        }

        // 该点在画布上对应的位置
        var chartX = borderInfo.left + lastMouseCoords.x / designManager.eyeZoomRate * designManager.chartZoomRate * xRatio;
        var chartY = borderInfo.top + lastMouseCoords.y / designManager.eyeZoomRate * designManager.chartZoomRate * yRatio;


        // 画布当前显示区域中心
        var centerX = 0;
        var centerY = 0;

        // 需要移动的距离
        var deltaX = centerX - chartX;
        var deltaY = centerY - chartY;
        designManager.moveNodes(deltaX, deltaY);
        // 检查节点和连线可见性
        designManager.checkVisibleOfNodesAndConns();

        // 需要注册到操作历史
        recordManager.register({
            descript: "鹰眼点击移动画布",
            param: {
                manager: designManager,
                deltaX: deltaX,
                deltaY:deltaY,
            },
            undo: function () {
                var param = this.param;
                param.manager.moveNodes(-param.deltaX, -param.deltaY);
                param.manager.checkVisibleOfNodesAndConns();
            },
            redo: function () {
                var param = this.param;
                param.manager.moveNodes(param.deltaX, param.deltaY);
                param.manager.checkVisibleOfNodesAndConns();
            }
        });

        // 监听拖拽
        dragging.startDrag(evt, {

            /**
                开始拖拽
            */
            dragStarted: function (x, y) {
                // 记录当前位置
                lastMouseCoords = startMouseCoords = designManager.translateCoordinates(x, y, $element);
            },

            /**
                拖拽中
            */
            dragging: function (x, y) {
                // 当前位置
                var curCoords = designManager.translateCoordinates(x, y, $element);
                // 获得拖动距离
                var deltaX = (lastMouseCoords.x - curCoords.x) / designManager.eyeZoomRate * designManager.chartZoomRate;
                var deltaY = (lastMouseCoords.y - curCoords.y) / designManager.eyeZoomRate * designManager.chartZoomRate;

                // 两个方向必须有一个发生变化
                if (deltaX != 0 || deltaY != 0) {
                    // 更新画布位置
                    designManager.moveNodes(deltaX, deltaY);
                }
                // 对angular静默模式时需要自己更新页面节点位置
                if (this.options.silent) {
                    designManager.updateNodeFlowPosition();
                }
                // 更新最后位置
                lastMouseCoords = curCoords;
            },

            dragEnded: function (x, y) {
                // 获得拖动距离
                var deltaX = (startMouseCoords.x - lastMouseCoords.x) / designManager.eyeZoomRate * designManager.chartZoomRate;
                var deltaY = (startMouseCoords.y - lastMouseCoords.y) / designManager.eyeZoomRate * designManager.chartZoomRate;
                // 需要注册到操作历史
                recordManager.register({
                    descript: "鹰眼拖动移动画布",
                    param: {
                        manager: designManager,
                        deltaX: deltaX,
                        deltaY: deltaY,
                    },
                    undo: function () {
                        var param = this.param;
                        param.manager.moveNodes(-param.deltaX, -param.deltaY);
                        param.manager.checkVisibleOfNodesAndConns();
                    },
                    redo: function () {
                        var param = this.param;
                        param.manager.moveNodes(param.deltaX, param.deltaY);
                        param.manager.checkVisibleOfNodesAndConns();
                    }
                });
                
            },
            options: { silent: ZYDesign.Config.draggingSilent }
        });
    }
}
]);

