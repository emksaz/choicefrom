

/**
    视频设置模块
*/
angular.module("videoSet", [])

/**
    视频设置指令
*/
.directive("videoSet", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/video_set_template.html",
        replace: true,
        scope: {
        },
        controller: "VideoSetController",
    }
})

/**
    视频设置控制器
*/
.controller("VideoSetController", "designManager"["$scope", "recordManager",
    function ($scope, designManager, recordManager) {

    }
]);

