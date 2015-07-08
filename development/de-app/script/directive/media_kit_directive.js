
/**
   媒体模块
*/
angular.module("mediaKitModule", [])

/**
    媒体指令
*/
.directive("mediaKit", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/kit/media-kit.html",
        replace: true,
        scope: {
            imageUploadManager: "=mediaKit"
        },
        controller: "MediaKitController"
    }


})
/**
    媒体控制器
*/
.controller("MediaKitController", ["$scope",
    function ($scope) {


    }

]);