
/**
    编辑问题模块
*/
angular.module("markdownEditorModule", [])

/**
    编辑问题指令
*/
.directive("markdownEditor", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/de/popup/markdown-editor.html",
        replace: true,
        scope: {
            todo: "=markdownEditor"
        },
        controller: "MarkdownEditorController"
    }


})
/**
    编辑问题控制器
*/
.controller("MarkdownEditorController", ["$scope",
    function ($scope) {


    }

]);