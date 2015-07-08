
/**
    页脚模块
*/
angular.module("footerBarModule", [])

/**
    页脚指令
*/
.directive("footerBar", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/layout/footerbar.html",
        replace: true,
        scope: {
            designManager: "=footerBar"
        },
        controller: "FooterBarController"
    }


})
/**
    页脚控制器
*/
.controller("FooterBarController", ["$scope",
    function ($scope) {
        var designManager = $scope.designManager;

        /**
            处理选择器鼠标进入事件
        */
        $scope.handleSearcherMouseEnter = function () {
            // 放开搜索框
            designManager.searchManager.releaseSearcher();
        }
        /**
            处理选择器鼠标离开事件
        */
        $scope.handleSearcherMouseLeave = function () {
            // 包裹搜索框(有值不隐藏)
           designManager.searchManager.wrapSearcher();
        }
        /**
            处理搜索框键盘按下事件
            @evt 事件参数
        */
        $scope.handleSearcherKeydown = function (evt) {
            // 回车键按下时进行搜索
            if (evt.keyCode == 13) {
                var keyword = evt.currentTarget.value.trim();
                // 无关键字不处理
                if (!keyword) {
                    return;
                }
                // 按关键字搜索
                designManager.searchManager.search(keyword);
            }
        }

        /**
            处理搜索按钮点击事件
        */
        $scope.handleSearchClick = function () {
            var keyword = $("#search_txt").val().trim();
            // 无关键字不处理
            if (!keyword) {
                return;
            }
            // 按关键字搜索
            designManager.searchManager.search(keyword);
        }

        /**
            处理表格显示切换按钮点击事件
        */
        $scope.handleGridToggleClick = function () {
            // 切换表格显示
            designManager.toggleGrid();
        }
        /**
            处理断开连接按钮点击事件
            @evt 事件参数
            @node 节点对象
        */
        $scope.handleBreakConnClick = function () {
            // 移除所选节点的相关连接
            designManager.breakConnOfSelectedNodes();
        }
        /**
            处理删除按钮点击事件
        */
        $scope.handleDeleteNodeClick = function () {
            // 删除当前被选中的项目
            designManager.removeSelected();
        }

        /**
            处理复制按钮点击事件
        */
        $scope.handleCopyNodeClick = function () {
            // 复制当前选中的节点
            designManager.clipBoard.dulplicate(0, 0);
        }
        /**
             处理缩小按钮点击事件
         */
        $scope.handleZoomOutClick = function () {
            // 画布内容缩小
            designManager.zoomOut();
        }

        /**
            处理放大按钮点击事件
        */
        $scope.chartSvgZoomIn = function () {
            // 画布内容放大
            designManager.zoomIn();
        }

        /**
            处理显示全部按钮点击事件
        */
        $scope.handleShowAllClick = function () {
            // 显示全部
            designManager.showAll();
        }
    }

]);