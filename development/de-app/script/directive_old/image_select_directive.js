

/**
    图片选择模块
*/
angular.module("imageSelect", [])

/**
    图片选择指令
*/
.directive("imageSelect", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/image_select_template.html",
        replace: true,
        scope: {
            owner: "=imageSelect",
            imageUploadManager: "=imageLib"
        },
        controller: "ImageSelectController",
    }
})

/**
    图片选择控制器
*/
.controller("ImageSelectController", ["$scope", "designManager","recordManager",
    function ($scope, designManager, recordManager) {

        var nodeEditorScope = angular.element($("#node_editor")).isolateScope()
        /**
            处理当前图片项点击事件
        */
        $scope.handleCurrImageClick = function (owner) {
            owner.showImageList = !owner.showImageList;
        }

        /**
            处理图片列表项点击事件
        */
        $scope.handleImageItemClick = function (owner, image, event) {
            if (image == owner.image) {
                return;
            }
            var oldImage = owner.image;
            var newImage = owner.image = image;
            owner.showImageList = false;
            event.stopPropagation();
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "更换图片",
                param: {
                    owner: owner,
                    oldImage: oldImage,
                    newImage: newImage
                },
                undo: function () {
                    var param = this.param;
                    param.owner.image = param.oldImage;
                },
                redo: function () {
                    var param = this.param;
                    param.owner.image = param.newImage;
                }
            });
        }

        /**
            处理列表鼠标离开事件
        */
        $scope.handleListMouseLeave = function (owner) {
            owner.showImageList = false;
        }

        /**
            处理添加图片项点击事件
        */
        $scope.handleAddImageItemClick = function (owner) {
            // 不可更改
            if (!designManager.isAllowChangeStatus(designManager.qStatus)) {
                ZYDesign.Hinter.hint("当前问卷状态下不允许操作媒体库");
                return;
            }
            owner.showImageList = false;
            nodeEditorScope.activeTab = 3;
            designManager.imageUploadManager.open(function (image) {
                // 上传结束后,回到原来的地方
                nodeEditorScope.activeTab = 1;
                // 关闭上传图片控件
                designManager.imageUploadManager.close(true);
                if (image) {
                    var oldImage = owner.image;
                    var newImage = owner.image = image;
                    designManager.markChange();
                    // 需要注册到操作历史
                    recordManager.register({
                        descript: "更换图片",
                        param: {
                            owner: owner,
                            oldImage: oldImage,
                            newImage: newImage
                        },
                        undo: function () {
                            var param = this.param;
                            param.owner.image = param.oldImage;
                        },
                        redo: function () {
                            var param = this.param;
                            param.owner.image = param.newImage;
                        }
                    });
                }
            });
            event.stopPropagation();
        }

        /**
           处理图片显示值
           @ownerFileName 当前图片名
       */
        $scope.getOwnerFileName = function (ownerFileName) {
            if (ownerFileName) {
                return ownerFileName;
            } else {
                return "点击选择图片";
            }
        }
    }
]);

