

/**
    批量选项模块
*/
angular.module("batchOption", [])

/**
    批量选项指令
*/
.directive("batchOption", function () {
    var batchManager;
    function handleInputKeyDown(evt) {
        // 禁用tab键
        if (evt.keyCode == 9) {
            evt.preventDefault();
            return;
        }
        if (evt.keyCode == 27) {
            batchManager.close();
            batchManager.digest();
            return;
        }
        if (evt.ctrlKey && evt.keyCode == 13) {
            batchManager.apply();
            batchManager.digest();
        }
    }
    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/batch_option_template.html",
        replace: true,
        scope: {
            optionBatchAddManager: "=batchOption"
        },
        controller: "BatchOptionController",
        link: function ($scope,$elem) {
            $elem.find("textarea,input").on("keydown", handleInputKeyDown);
            batchManager = $scope.optionBatchAddManager;
        }
    }
})

/**
    批量选项控制器
*/
.controller("BatchOptionController", ["$scope","recordManager",
function ($scope,recordManager) {
        /**
            点击应用按钮
            @evt 事件参数
        */
        $scope.handleApplyOptionClick = function (evt) {
            // 应用选项  register in record
            this.optionBatchAddManager.apply();
        }

        /**
            点击取消按钮
        */
        $scope.handleCancleOptionClick = function () {
            // 关闭批量添加对话框
            this.optionBatchAddManager.close();
        }
    }
]);

