/**
	sts2
    应用总模块
*/
angular.module("ZYDesign", ["navBarModule", "toolBarModule", "sideBarModule", "footerBarModule", "nodesKitModule",
    "mediaKitModule", "themeKitModule", "popupSearchModule", "popupDebugModule", "popupBatchModule", "popupSaveModule",
    "popupMessageModule", "popupToplineModule", "markdownEditorModule", "nodeFlow", "eagleEye", "designManager", "recordManager",
    "versionDropModule", "commonSettingModule", "optionSettingModule", "otherSettingModule", "questionSettingModule", "typeSettingModule",
    "helpCenterModule", "rightClickModule", "normalOptionModule"
])
/**
    应用总控制器
	test
*/
.controller("ZYDesignController", ["$scope", "designManager", "recordManager",
    function ($scope, designManager, recordManager) {
        $scope.designManager = designManager;

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
    }
]);