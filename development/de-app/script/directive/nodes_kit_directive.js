
/**
    节点设备模块
*/
angular.module("nodesKitModule", [])

/**
    节点设备指令
*/
.directive("nodesKit", function () {
    var dragElem = null,
        outerBinded = false,
        nodeBox = null;
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

    return {
        restrict: 'A',
        templateUrl: "/Content/de/kit/nodes-kit.html",
        replace: true,
        scope: {
            nodeBoxManager: "=nodesKit"
        },
        controller: "NodesKitController",
        link: function ($sope, $element) {
            // 外围元素未监听对应事件
            if (!outerBinded) {
                $(".click_hide_unpinned").each(function (elem) {
                    this.addEventListener("mousedown", handleCloseUnpinnedMouseDown, true);
                });
                outerBinded = true;
            }
        }
    }


})
/**
    节点设备控制器
*/
.controller("NodesKitController", ["$scope",
    function ($scope) {

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
           处理帮助图标点击事件
           help
           @evt 系统参数
           @key 帮助的key值
       */
        $scope.handleHelpClick = function (evt, key) {
            evt.stopPropagation();

            this.helpManager.help(evt, key);
        }
    }

]);