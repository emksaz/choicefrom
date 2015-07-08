
/**
    帮助按钮模块
*/
angular.module("toolBarModule", [])

/**
    帮助按钮指令
*/
.directive("toolBar", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/layout/toolbar.html",
        replace: true,
        scope: {
            designManager: "=toolBar"
        },
        controller: "ToolBarController",
        link: function ($scope, $element) {
            var designManager = $scope.designManager;
            console.log($element.find("a"));
            $element.find("a").on("click", function (event) {
                //if (designManager.nodeBoxManager.isVisible()) {
                //    nodeBox();
                //} else {
                //   // ZYDesign.PageRegisterEvent.Media_Event.Close_nodes_kit(".bt-close-left-panel", "#toolbar .small_tab", "#main .kit", "#main .slide-border");
                //}

                ZYDesign.PageRegisterEvent.Media_Event.nodes_kit("#toolbar .small_tab", "#main .kit", "#main .slide-border", ".kit-content", $element);
                //ZYDesign.PageRegisterEvent.Media_Event.Close_nodes_kit(".bt-close-left-panel", "#toolbar .small_tab", "#main .kit", "#main .slide-border", $element);
                //ZYDesign.PageRegisterEvent.Media_Event.media_kit_pic("li.media-item", "div.nodes-col", ".nodes-progress", ".kit-content", $element);
                //ZYDesign.PageRegisterEvent.Media_Event.type_kit_item("li.type-item", $element);
                //ZYDesign.PageRegisterEvent.Media_Event.type_kit_item("li.icolor", $element);
                //ZYDesign.PageRegisterEvent.Media_Event.theme_kit("#theme-kit", "a.theme-mobile i", "a.theme-pc i", "a.theme-pad i", $element);
                //ZYDesign.PageRegisterEvent.Media_Event.theme_kit_preset(".theme-col", ".teme-save", "#preset-theme", "#custom-theme", "#close-col", "#close-teme-save", $element);



            })
        }
    }


})
/**
    帮助按钮控制器
*/
.controller("ToolBarController", ["$scope",
    function ($scope) {


        /**
            处理切换节点盒子显示鼠标点击事件
        */
        $scope.handleToggleNodeBoxClick = function () {
            // 关闭/显示节点盒子
            this.designManager.nodeBoxManager.toggleShow();
            // 关闭其它盒子
            this.designManager.themeBoxManager.close();
            this.designManager.imageUploadManager.mediaClose();
        }

        /**
            处理切换主题盒子显示鼠标点击事件
        */
        $scope.handleToggleThemeBoxClick = function () {
            // 关闭/显示主题盒子
            this.designManager.themeBoxManager.toggleShow();
            // 关闭其它盒子
            this.designManager.nodeBoxManager.close();
            this.designManager.imageUploadManager.mediaClose();
        }

        /**
            处理切换媒体库盒子显示鼠标点击事件
        */
        $scope.handleToggleMediaBoxClick = function () {
            // 关闭/显示媒体库盒子
            this.designManager.imageUploadManager.mediaToggleShow();
            // 关闭其它盒子
            this.designManager.themeBoxManager.close();
            this.designManager.nodeBoxManager.close();
        }

    }

]);