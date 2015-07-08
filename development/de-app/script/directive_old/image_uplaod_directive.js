

/**
    图片上传模块
*/
angular.module("imageUpload", [])

/**
    图片上传指令
*/
.directive("imageUpload", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/image_upload_template.html",
        replace: true,
        scope: {
            imageUploadManager: "=imageUpload"
        },
        controller: "ImageUploadController",
        link: function ($scope,$element) {
            
        }
    }
})

/**
    图片上传控制器
*/
.controller("ImageUploadController", ["$scope", "recordManager",
    function ($scope, recordManager) {
        /**
            处理关闭图片上传管理器图标点击事件
        */
        $scope.handleImageUploadCloseIconClick = function () {
            // 关闭图片上传管理器
            this.imageUploadManager.close();
        }

        /**
            处理上传按钮点击事件
        */
        $scope.handleUploadIconClick = function () {
            // 上传图片
            this.imageUploadManager.uploadImage();
        }

        /**
            取消正在上传的图片
        */
        $scope.handleCancelIconClick = function (evt) {
            // 取消上传
            this.imageUploadManager.cancel();
            evt.stopPropagation();
        }
    }
]);

