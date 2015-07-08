

/**
    可拖拽选项模块
*/
angular.module("dragOption", [])

/**
    可拖拽选项指令
*/
.directive("dragOption", function () {
    var dragElem = null,
        dragEnabled = false,
        designManager = null;
    /**
        处理拖放开始事件
        @e 事件参数
    */
    function handleDragStart(e) {
        // 记录拖拽源
        dragElem = e.target;
        // 稍后添加拖拽源效果
        setTimeout(function () {
            $(dragElem).addClass("drag_source_option");
        }, 10);

        // H5的拖拽事件会在所有子元素上触发,这样会扰乱我们正常的行为
        // 所以我们需要锁住所有选项的子元素不响应事件,拖拽结束时我们会解锁
        $(".drag_option_item").find("*").addClass("event_none");
    }

    /**
        处理拖放进入事件
        @e 事件参数
    */
    function handleDragEnter(e) {
        // 只处理和自身相关的拖拽
        if (dragElem) {
            // 加上拖拽目标效果
            $(e.target).addClass("drag_target_option");
        }
        
    }

    /**
        处理拖放覆盖事件
        @e 事件参数
    */
    function handleDragOver(e) {
        // 在拖放覆盖中我们不得不禁止默认行为来使得我们能够将拖动的元素放在目标位置
        // 不阻止的话默认是不能放置的
        // 只处理和自身相关的拖拽
        if (dragElem) {
            e.preventDefault();
        }
    }

    /**
        处理拖放离开事件
        @e 事件参数
    */
    function handleDragLeave(e) {
        // 只处理和自身相关的拖拽
        if (dragElem) {
            // 取消拖拽目标效果
            $(e.target).removeClass("drag_target_option");
        }
    }

    /**
        处理拖放释放事件
        @e 事件参数
    */
    function handleDrop(e) {
        // 只处理和自身相关的拖拽
        if (!dragElem) {
            return;
        }
        var tarElem = e.target;
        // 取消拖拽目标效果
        $(tarElem).removeClass("drag_target_option");
        // 在自身上释放则不做错位处理
        if (tarElem == dragElem) {
            return;
        } 
        // 获取错位信息
        var srcIndex = parseInt($(dragElem).attr("data-option-index")),
            tarIndex = parseInt($(tarElem).attr("data-option-index")),
            belong = $(dragElem).attr("data-option-belong");
        // 进行选项错位  registered in record
        designManager.dislocateOptOfCurrNode(belong, srcIndex, tarIndex);
        // angular外部变化需手动更新
        designManager.digest();
    }

    /**
        处理拖放结束事件
        @e 事件参数
    */
    function handleDragEnd(e) {
        // 解锁所有选项的子元素,让他们恢复响应事件状态
        $(".drag_option_item").find("*").removeClass("event_none");
        // 取消拖拽源效果
        $(dragElem).removeClass("drag_source_option");
        // 释放拖拽源
        dragElem = null;
        // 禁用拖拽功能
        disableDrag();
    }

    /**
        处理拖拽图标鼠标进入事件
    */
    function handleDraggerMouseOver() {
        // 启用拖拽功能
        enableDrag();
    }

    /**
        处理拖拽图标鼠标进入事件
    */
    function handleDraggerMouseLeave() {
        // 禁用拖拽功能
        disableDrag();
    }

    /**
        开启拖拽功能
    */
    function enableDrag() {
        // 已经是开启状态
        if (dragEnabled) {
            return;
        }
        $(".drag_option_item").attr("draggable", "true");
        dragEnabled = true;
    }

    /**
        禁用拖拽功能
    */
    function disableDrag() {
        // 已经是禁用状态
        if (!dragEnabled) {
            return;
        }
        $(".drag_option_item").removeAttr("draggable");
        dragEnabled = false;
    }

    

    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/drag_option_template.html",
        replace: true,
        scope: {
            designManager: "=designManager",
            node: "=currentNode",
            optionList: "=dragOption"
        },
        controller: "DragOptionController",
        link: function ($sope, $element) {
            designManager = $sope.designManager;
            $element.delegate(".drag_option_item", {
                dragstart: handleDragStart,
                dragenter: handleDragEnter,
                dragover: handleDragOver,
                dragleave: handleDragLeave,
                drop: handleDrop,
                dragend: handleDragEnd,
            }).delegate(".option_dragger", {
                mouseover: handleDraggerMouseOver,
                mouseleave: handleDraggerMouseLeave,
            });
        }
    }
})

/**
    可拖拽选项控制器
*/
.controller("DragOptionController", ["$scope", "recordManager",
    function ($scope, recordManager) {

        var designManager = $scope.designManager;
        /**
           点击删除选项按钮
           @evt 事件参数
           @option 选项
         */
        $scope.handleDeleteOptionClick = function (node, option) {

            // 移除该选项相关的连接
            var conns = designManager.removeConnOfOption(node, option);
            // 移除选项 registered in record
            node.removeOption(option);
            designManager.markChange();

            // 需要注册到操作历史
            recordManager.register({
                descript: "删除选项",
                param: {
                    manager:designManager,
                    node: node,
                    option: option,
                    conns:conns,
                },
                undo: function () {
                    var param = this.param;
                    param.node.addOption(param.option);
                    for (var i = 0; i < param.conns.length; i++) {
                        var conn = param.conns[i];
                        param.manager.addConnection(conn);
                    }
                },
                redo: function () {
                    var param = this.param;
                    param.manager.removeConnOfOption(param.node, param.option);
                    param.node.removeOption(param.option);
                }
            })
        }

        /**
           处理排序目标切换点击事件
           @node 所在节点
           @option 选项
         */
        $scope.handleChangeSeqTargetClick = function (node, option) {
            // 排序题之外的不处理
            if (!(node instanceof ZYDesign.Class.SequencingNode) ||
                !(option instanceof ZYDesign.Class.SequenceOptionConnector)) {
                return;
            }
            // 改变排序目标
            node.changeSeqTarget(option);
            designManager.markChange();
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
            各种需要标记的属性发生变化
            @ignoreNode 是否忽略节点
        */
        $scope.handleCommonAttrChange = function (ignoreNode) {
            // 标记发生变化
            designManager.markChange(ignoreNode);
        }

        /**
            选项编号改变
            @option 选项
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleOptionNumberChange = function (option, type) {

            // 变化中
            if (!type) {
                option.number = parseInt(option.number);
                option.number = isNaN(option.number) ? 0 : option.number;
            }

            designManager.recordCommonChange(option, "number", type, "更改选项编号");
        }
        /**
            处理选项描述变化事件
            @option 选项
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleOptionTextChange = function (option, type) {
            designManager.recordCommonChange(option, "originText", type, "更改选项描述");
        }
    }
]);

