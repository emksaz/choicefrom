
$(function () {
    var env = ZYDesign.Environment;
    if (!env.isWebkit) {
        confirm(Prompt.QSNRD_CurrentBrowserUseDisable + "<br>" + Prompt.QSNRD_AdviceBrowser,
            function () {
                $(".design_wrapper").show();
            }, function () {
                window.location.href = "/Home/Index#/QM";
            }, "继续", "", "退出");
    }else{
        $(".design_wrapper").show();
    }
})


/**
    应用总模块
*/
angular.module("ZYDesign", ["batchOption", "eagleEye", "nodeBox", "nodeEditor", "nodeFlow",
    "nodeSearcher", "helpBox", "nodeValidator", "themeBox", "versionHistory", "versionSave", "designManager","recordManager"])
/**
    应用总控制器
*/
.controller("ZYDesignController", ["$scope", "designManager", "recordManager", "$timeout", function ($scope, designManager, recordManager, $timeout) {
    // 总管理器
    $scope.designManager = ZYDesign.DesignManager = designManager;
    /**
        处理返回问卷设置按钮点击事件
    */
    $scope.handleBackIconClick = function () {
        var url = "/Home/DashBoard#/QM";
        designManager.leavePage(url);


    }

    /**
        处理发布按钮点击事件
    */
    $scope.handleReleaseIconClick = function () {
        var url = "/Home/DashBoard#/QMSet/Publish/" + $("#quesIDEx").val();
        designManager.leavePage(url);
    }

    /**
        处理切换节点盒子显示鼠标点击事件
    */
    $scope.handleToggleNodeBoxClick = function () {
        // 关闭/显示节点盒子
        designManager.nodeBoxManager.toggleShow();
        // 关闭主题盒子
        designManager.themeBoxManager.close();
    }

    /**
        处理切换主题盒子显示鼠标点击事件
    */
    $scope.handleToggleThemeBoxClick = function () {
        // 关闭/显示主题盒子
        designManager.themeBoxManager.toggleShow();
        // 关闭节点盒子
        designManager.nodeBoxManager.close();
    }

    /**
        处理页面鼠标抬起事件
        @evt 事件参数
    */
    $scope.handleMouseUp = function (evt) {
        // 清除临时的连接对象
        if (designManager.tempConncetion) {
            designManager.removeTempConnection();
            designManager.tempConncetion = null;
        }
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

    /**
        处理保存按钮点击事件
    */
    $scope.handleSaveClick = function () {
        // 保存问卷信息
        designManager.save("N", null, null, "Y", "");
        // 重置自动保存
        designManager.autoSaveManager.reset();
    }

    /**
        处理调试按钮点击事件
    */
    $scope.handleTestClick = function () {
        // 调试问卷
        designManager.test();
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
        处理断开连接按钮点击事件
        @evt 事件参数
        @node 节点对象
    */
    $scope.handleBreakConnClick = function () {
        // 移除所选节点的相关连接
        designManager.breakConnOfSelectedNodes();
    }

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
        // 包裹搜索框
        designManager.searchManager.wrapSearcher();
    }

    /**
        处理版本控制鼠标覆盖事件
    */
    $scope.handleVersionHistoryMouseEnter = function () {
        // 保持版本控制器打开状态
        designManager.versionHistoryManager.open();
    }

    /**
        处理版本控制鼠标离开事件
    */
    $scope.handleVersionHistoryMouseLeave = function () {
        // 关闭版本控制器
        designManager.versionHistoryManager.close();
    }
}]);