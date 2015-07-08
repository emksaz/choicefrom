

/**
    节点盒子模块
*/
angular.module("nodeBox", [])

/**
    节点盒子指令
*/
.directive("nodeBox", function () {
    var dragElem = null,
        outerBinded = false,
        nodeBox = null;

    /**
        处理拖拽开始事件
    */
    function handleDragStart(e) {
        dragElem = e.target;
        $("#chart_content").attr("draggable", true);
    }

    /**
        处理拖拽结束事件
    */
    function handleDragEnd(e) {
        dragElem = null;
        $("#chart_content").attr("draggable", false);
    }

    /**
        处理拖拽覆盖事件
    */
    function handleDragOver(e) {
        // 只处理和自身相关的拖拽
        if (dragElem) {
            e.preventDefault();
        }
    }

    /**
        处理拖拽覆盖事件
    */
    function handleDrop(e) {
        var originEvt = e.originalEvent;
        var coord = nodeBox.transCoords(originEvt.pageX, originEvt.pageY, $("#chartLarger"))
        nodeBox.addNode($(dragElem), coord.x, coord.y);
        nodeBox.digest();
    }

    /**
        处理关闭未钉住盒子区域点击事件
    */
    function handleCloseUnpinnedMouseDown() {
        // 盒子没有被钉住时会自动隐藏
        if (!nodeBox.isPinned()) {
            nodeBox.close();
            nodeBox.digest();
        }
    }

    /**
        处理节点块鼠标进入事件
    */
    function handleNodeItemMouseEnter(e) {
        // 显示帮助小按钮
        $(this).find(".nodes_help").addClass("trans_0_0_dur_200");
    }

    /**
        处理节点块鼠标离开事件
    */
    function handleNodeItemMouseLeave(e) {
        // 隐藏帮助小按钮
        $(this).find(".nodes_help").removeClass("trans_0_0_dur_200");
    }

    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/node_box_template.html",
        replace: true,
        scope: {
            nodeBoxManager: "=nodeBox",
            helpManager: "=contextHelp",
        },
        controller: "NodeBoxController",
        link: function ($sope, $element) {
            // 非开发模式
            if (!ZYDesign.Config.developMode) {
                $element.find(".box_developing").addClass("column_button_disable");
            }
            // 记录节点盒子对象
            nodeBox = $sope.nodeBoxManager;
            // 拖拽事件绑定
            $element.find(".column_button ").bind({
                dragstart: handleDragStart,
                dragend: handleDragEnd,
            });
            $element.find("[data-method]").not(".column_button_disable").bind({
                mouseenter: handleNodeItemMouseEnter,
                mouseleave: handleNodeItemMouseLeave
            }).attr("draggable", true);
            // 外围元素未监听对应事件
            if (!outerBinded) {
                $("#chart_content").bind({
                    dragover: handleDragOver,
                    drop: handleDrop
                });

                $(".click_hide_unpinned").each(function (elem) {
                    this.addEventListener("mousedown", handleCloseUnpinnedMouseDown, true);
                });
                outerBinded = true;
            }
        }
    }
})

/**
    节点盒子控制器
*/
.controller("NodeBoxController", ["$scope", "recordManager",
    function ($scope, recordManager) {

        /**
            处理切换盒子钉住与否鼠标点击事件
        */
        $scope.handleTogglePinClick = function () {
            // 切换钉住/取消钉住
            this.nodeBoxManager.togglePin();
        }

        /**
            处理添加节点按钮点击事件
            @evt 事件参数
        */
        $scope.handleAddNodeClick = function (evt) {
            // 添加节点
            this.nodeBoxManager.addNode($(evt.currentTarget));
        }

        /**
            处理关闭按钮点击事件
        */
        $scope.handleCloseBoxClick = function () {
            // 关闭盒子
            this.nodeBoxManager.close();
        }

        /**
            处理盒子区域鼠标离开事件
        */
        $scope.handleCloseBoxClick = function () {
            // 关闭盒子
            this.nodeBoxManager.close();
        }

        /**
           处理帮助图标点击事件
           help
           @evt 系统参数
           @key 帮助的key值
       */
        $scope.handleHelpClick = function (evt, key) {
            evt.stopPropagation();

            this.helpManager.help(evt,key);
        }
    }
]);

