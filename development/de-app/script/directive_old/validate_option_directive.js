

/**
    选项验证模块
*/
angular.module("validateOption", [])

/**
    选项验证指令
*/
.directive("validateOption", function () {
    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/validate_option_template.html",
        replace: true,
        scope: {
            target: "=validateOption"
        },
        controller: "ValidateOptionController",
    }
})

/**
    选项验证控制器
*/
.controller("ValidateOptionController", ["$scope","recordManager",
    function ($scope, recordManager) {
        $scope.dict = ZYDesign.Dict.ValidateTypeDict;
        var designManager = ZYDesign.DesignManager;

        /**
            处理当前验证方式点击事件
            @target 校验目标
        */
        $scope.handleCurrTypeClick = function (target) {
            target.showValidateList = !target.showValidateList;
        }

        /**
            处理校验方式列表项点击事件
            @target 校验目标
            @item 所选列表项
        */
        $scope.handleTypeItemClick = function (target, item, event) {
            if (target.validateType == item.id) {
                return;
            }
            target.showValidateList = false;
            var oldType = target.validateType,
                oldStart = target.validateStart,
                oldEnd = target.validateEnd;
            target.validateType = item.id;
            // 不需要范围时,验证开始和验证结束恢复默认
            if (target.validateType > 3) {
                target.validateStart = 0;
                target.validateEnd = 50;
            }
            var newType = target.validateType,
                newStart = target.validateStart,
                newEnd = target.validateEnd;
            designManager.markChange();
            event.stopPropagation();
            // 需要注册到操作历史
            recordManager.register({
                descript: "更改校验选项方式",
                param: {
                    target: target,
                    oldType: oldType,
                    oldStart: oldStart,
                    oldEnd: oldEnd,
                    newType: newType,
                    newStart: newStart,
                    newEnd: newEnd,
                },
                undo: function () {
                    var param = this.param;
                    param.target.validateType = param.oldType;
                    param.target.validateStart = param.oldStart;
                    param.target.validateEnd = param.oldEnd;
                },
                redo: function () {
                    var param = this.param;
                    param.target.validateType = param.newType;
                    param.target.validateStart = param.newStart;
                    param.target.validateEnd = param.newEnd;
                }
            })
        }

        /**
            处理检验终点值变更按钮点击事件
            @target 检验目标
            @amount 变化量 
        */
        $scope.handleValidateEndChangeClick = function (target, amount) {
            var oldValue = parseInt(target.validateEnd) || 0;
            var result = oldValue + amount;
            result = result < target.validateStart ? target.validateStart : result;
            target.validateEnd = result < 0 ? 0 : result;
            target.validateEnd = result > 99999 ? 99999 : result;
            if (oldValue != target.validateEnd) {
                // 标记发生变化
                designManager.markChange();
                // 需要注册到操作历史
                recordManager.register({
                    descript: "更改校验结束值",
                    param: {
                        obj: target,
                        key: "validateEnd",
                        oldValue: oldValue,
                        newValue: target.validateEnd,
                    }
                })
            }
        }

        /**
            处理检验终点值变化事件
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleValidateEndChange = function (target, type) {
            if (!type) {
                var result = parseInt(target.validateEnd) || 0;
                target.validateEnd = result < 0 ? 0 : result;
            }      
            // 标记发生变化
            designManager.recordCommonChange(target, "validateEnd",type, "更改校验结束值");
        }

        /**
            处理多选最小值变更按钮点击事件
            @target 检验目标
            @amount 变化量 
        */
        $scope.handleValidateStartChangeClick = function (target, amount) {
            var oldValue = parseInt(target.validateStart) || 0;
            var result = oldValue + amount;
            result = result < 0 ? 0 : result;
            result = result > target.validateEnd ? target.validateEnd : result;
            target.validateStart = result;
            if (oldValue != target.validateStart) {
                // 标记发生变化
                designManager.markChange();
                // 需要注册到操作历史
                recordManager.register({
                    descript: "更改校验开始值",
                    param: {
                        obj: target,
                        key: "validateStart",
                        oldValue: oldValue,
                        newValue: target.validateStart,
                    }
                })
            }
        }

        /**
            处理多选最小值变化事件
        */
        $scope.handleValidateStartChange = function (target, type) {
            if (!type) {
                var result = parseInt(target.validateStart) || 0;
                target.validateStart = result < 0 ? 0 : result;
            }
            // 标记发生变化
            designManager.recordCommonChange(target, "validateStart", type, "更改校验开始值");
        }

        /**
            处理仅限输入数字的输入控件键盘落下事件
        */
        $scope.handleOnlyNumberInputKeyDown = function (evt) {
            if (!ZYDesign.TextUtil.isNumberInputKey(evt.keyCode) // 非数字输入允许键值
                || evt.shiftKey) { // 包含shift不允许
                evt.preventDefault();
            }
        }

        /**
            处理列表鼠标离开事件
            @target 检验目标
        */
        $scope.handleListMouseLeave = function (target) {
            target.showValidateList = false;
        }

        /**
            处理列表鼠标离开事件
            @target 检验目标
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleErrorMsgChange = function (target, type) {
            designManager.recordCommonChange(target, "errorMsg", type, "更改校验错误提示消息");
        }
        /**
           处理帮助图标点击事件
           help
           @evt 系统参数
           @key 帮助的key值
       */
        $scope.handleValidateHelpClick = function (evt, key) {
            designManager.helpManager.help(evt, key);
        }
    }
]);

