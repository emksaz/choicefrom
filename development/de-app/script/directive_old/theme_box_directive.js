/**
    主题盒子指令
*/

angular.module("themeBox", [])

.directive("themeBox", function () {
    return {
        restrict: "A",
        templateUrl: "/Content/QSNR/theme_box_template.html",
        replace: true,
        scope: {
            themeBoxManager: "=themeBox"
        },
        controller: "ThemeBoxManager",
        link: function ($scope, $elem) {
            var themeBoxManager = $scope.themeBoxManager;
            var options = {
                layout:'hex',
                submit: 0,
                color:themeBoxManager.theme["bgColor"],
                onChange: function (hsb, hex, rgb, el, bySetColor) {
                    var key = $(el).attr("data-id");
                    themeBoxManager.change(key, "#" + hex);
                },
            }
            
            $elem.find(".color_picker").on("click", function (event) {
                ZYDesign.RecordManager.upgrade();
                key = $(event.currentTarget).attr("data-id");
                $(event.currentTarget).colpickSetColor(themeBoxManager.theme[key], true);
            })
            $elem.find(".color_picker").colpick(options)
        }
    }
})

.controller("ThemeBoxManager", ["$scope", "recordManager",
function ($scope, recordManager) {

    var themeBoxManager = $scope.themeBoxManager;
    /**
        处理主题方案点击事件
        @theme 主题
    */
    $scope.handleThemeCaseClick = function (theme) {
        themeBoxManager.apply(theme);
    }

    /**
        处理关闭按钮点击事件
    */
    $scope.handleCloseIconClick = function () {
        themeBoxManager.close();
    }


    /**
        处理添加自定义按钮点击事件
    */
    $scope.handleAAddCustomClick = function () {
        themeBoxManager.saveAsCustom();
    }

    /**
        处理删除自定义按钮点击事件
        @theme 要删除的主题
    */
    $scope.handleDelCustomClick = function (theme) {
        themeBoxManager.removeCustom(theme);
    }

}]);