

/**
    节点编辑模块
*/
angular.module("nodeEditor", ["imageUpload", "imageSelect", "validateOption", "dragOption"])

/**
    节点编辑指令
*/
.directive("nodeEditor", function () {
    /**
        处理输入框获得焦点事件
    */
    function handleInputFocus() {
        $(this).parent().addClass("design_input_focus");
    }

    /**
        处理输入框失去焦点事件
    */
    function handleInputBlur() {
        $(this).parent().removeClass("design_input_focus");
    }

    /**
        处理输入框输入事件
    */
    function handleEditorInput() {
        var val = $(this).val();
        $(this).css("height", "0px").css("height", this.scrollHeight);
    }

    return {
        restrict: 'A',
        templateUrl: "/Content/QSNR/node_editor_template.html",
        replace: true,
        scope: {
            node: "=nodeEditor",
            designManager: "=designManager"
        },
        controller: "NodeEditorController",
        link: function ($scope, $element) {
            $element.delegate(".option_editor_input", {
                focus: handleInputFocus,
                blur: handleInputBlur,
                input: handleEditorInput
            });
        }
    }
})

/**
    节点编辑控制器
*/
.controller("NodeEditorController", ["$scope", "$timeout", "recordManager",
    function ($scope, $timeout, recordManager) {
        var Class = ZYDesign.Class,
            Enum = ZYDesign.Enum,
            designManager = $scope.designManager;

        // 当前活跃的tab
        $timeout(function () {
            $scope.activeTab = 1;
        });

        /**
            获取节点类型图标
        */
        $scope.getNodeIcon = function () {
            return this.node ?
                "design_icon size_20px margin_r_5px float_l " + this.node.typeIcon :
                "design_icon size_20px margin_r_5px float_l ic_none";
        }

        /**
            获取节点类型名
        */
        $scope.getNodeName = function () {
            return this.node ?
                this.node.typeName :
                "无节点";
        }


        /**
            处理点击打开上传图片按钮点击事件
        */
        $scope.handleImageUploadOpenClick = function () {
            // 打开图片上传管理器
            designManager.imageUploadManager.open();
        }

        /**
            处理图片项点击事件
            @image 图片对象
        */
        $scope.handleImageEditClick = function (image) {
            // 编辑图片
            designManager.imageUploadManager.editImage(image);
        }

        /**
            处理图片删除按钮点击事件
            @image 图片对象
        */
        $scope.handleImageDeleteClick = function (image, evt) {
            // 删除该图片
            designManager.imageUploadManager.deleteImage(image);
            evt.stopPropagation();
        }

        /**
            处理是否使用其他选项切换按钮点击事件
            @node 节点
        */
        $scope.handleOtherOptionToggleClick = function (node) {
            // 非选择节点不处理
            if (!(node instanceof Class.SelectNode)) {
                return;
            }
            var rs = node.toggleOtherOption();
            // 标记变化
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "开启/关闭其他选项",
                param: {
                    node: node,
                    rs: rs,
                },
                undo: function () {
                    var param = this.param;
                    if (param.rs.type == "remove") {
                        node.addOption(param.rs.option);
                    } else {
                        node.removeOtherOption();
                    }
                },
                redo: function () {
                    var param = this.param;
                    if (param.rs.type == "add") {
                        node.addOption(param.rs.option);
                    } else {
                        node.removeOtherOption();
                    }
                }
            })
        }

        /**
            处理是否使用媒体切换按钮点击事件
            @node 节点
        */
        $scope.handleMediaToggleClick = function (node) {
            // 尝试切换图片,发生变化则标记变化
            var rs = node.toggleImage();
            // 标记变化
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "开启/关闭媒体",
                param: {
                    node: node,
                    rs: rs,
                },
                undo: function () {
                    var param = this.param;
                    param.node.toggleImage();
                    param.node.image = param.rs.oldImage;
                },
                redo: function () {
                    var param = this.param;
                    param.node.toggleImage();
                    param.node.image = param.rs.newImage;
                }
            })
        }

        /**
            处理其他选项类型按钮点击事件
            @type 类型
            @otherOption 其他选项
            @node 节点
        */
        $scope.handleOtherTypeClick = function (type, otherOption, node) {
            if (otherOption.otherType == type) {
                return;
            }
            var rss,
                oldType = otherOption.otherType,
                newType = otherOption.otherType = type;

            // 现在非选项但之前已经当选项输出
            if (otherOption.otherType == 2 && otherOption.dest) {
                // 移除该选项连接
                rss = designManager.removeOptionConnOfNode(node, otherOption);
            }
            designManager.markChange();

            // 需要注册到操作历史
            recordManager.register({
                descript: "更改其他选项类型",
                param: {
                    node: node,
                    other: otherOption,
                    oldType: oldType,
                    newType: newType,
                    conns: rss || [],
                    manager: designManager,
                },
                undo: function () {
                    var param = this.param;
                    param.other.otherType = param.oldType;
                    for (var i = 0; i < param.conns.length; i++) {
                        var conn = param.conns[i];
                        param.manager.addConnection(conn);
                    }
                },
                redo: function () {
                    var param = this.param;
                    param.other.otherType = param.newType;
                    if (param.conns.length > 0) {
                        param.manager.removeOptionConnOfNode(param.node, param.other);
                    }
                }
            });
        }

        /**
            处理其他选项备注是否必填按钮点击事件
            @otherOption 其他选项
        */
        $scope.handleFillRequireClick = function (otherOption) {
            otherOption.fillRequired = !otherOption.fillRequired;
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "打开/关闭其他选项备注必填",
                param: {
                    other: otherOption
                },
                undo: function () {
                    var param = this.param;
                    param.other.fillRequired = !param.other.fillRequired;
                },
                redo: function () {
                    var param = this.param;
                    param.other.fillRequired = !param.other.fillRequired;
                }
            });
        }

        /**
            处理多选最大值变更按钮点击事件
            @node 节点
            @amount 变化量 
        */
        $scope.handleMultipleMaxChangeClick = function (node, amount) {
            var oldValue = parseInt(node.multipleMax) || 0
            var result = oldValue + amount;
            result = result < node.multipleMin ? node.multipleMin : result;
            result = result > node.options.length ? node.options.length : result;
            node.multipleMax = result < 0 ? 0 : result;
            if (oldValue != node.multipleMax) {
                // 标记发生变化
                designManager.markChange();
                // 需要注册到操作历史
                recordManager.register({
                    descript: "更改多选最大值",
                    param: {
                        obj: node,
                        key: "multipleMax",
                        oldValue: oldValue,
                        newValue: node.multipleMax,
                    }
                });
            }
        }

        /**
            处理多选最大值变化事件
        */
        $scope.handleMultipleMaxChange = function (node, type) {
            if (!type) {
                var result = parseInt(node.multipleMax) || 0;
                node.multipleMax = result < 0 ? 0 : result;
            }

            // 标记发生变化
            designManager.recordCommonChange(node, "multipleMin", type, "更改多选最大值");
        }

        /**
            处理多选最小值变更按钮点击事件
            @node 节点
            @amount 变化量 
        */
        $scope.handleMultipleMinChangeClick = function (node, amount) {
            var oldValue = parseInt(node.multipleMin) || 0
            var result = oldValue + amount;
            result = result < 0 ? 0 : result;
            result = result > node.multipleMax ? node.multipleMax : result;
            node.multipleMin = result;
            if (oldValue != node.multipleMin) {
                // 标记发生变化
                designManager.markChange();
                // 需要注册到操作历史
                recordManager.register({
                    descript: "更改多选最小值",
                    param: {
                        obj: node,
                        key: "multipleMin",
                        oldValue: oldValue,
                        newValue: node.multipleMin,
                    }
                });
            }
        }

        /**
            处理多选最小值变化事件
        */
        $scope.handleMultipleMinChange = function (node, type) {

            if (!type) {
                var result = parseInt(node.multipleMin) || 0;
                node.multipleMin = result < 0 ? 0 : result;
            }

            // 标记发生变化
            designManager.recordCommonChange(node, "multipleMin", type, "更改多选最小值");
        }

        /**
            处理打分最小值变化事件
        */
        $scope.handleMarkMinChange = function (node, type) {
            if (!type) {
                var result = parseInt(node.markMin) || 0;
                node.markMin = result < 0 ? 0 : result;
            }
            // 标记发生变化
            designManager.recordCommonChange(node, "markMin", type, "更改打分最小值");
        }

        /**
            处理打分最大值变化事件
        */
        $scope.handleMarkMaxChange = function (node) {
            if (!type) {
                var result = parseInt(node.markMax) || 0;
                node.markMax = result < 0 ? 0 : result;
            }
            // 标记发生变化
            designManager.recordCommonChange(node, "markMax", type, "更改打分最大值");
        }

        /**
            处理打分最小值变更按钮点击事件
            @node 节点
            @amount 变化量 
        */
        $scope.handleMarkMinChangeClick = function (node, amount) {
            var oldValue = parseInt(node.markMin) || 0;
            var result = oldValue + amount;
            result = result < 0 ? 0 : result;
            result = result > node.markMax ? node.markMax : result;
            node.markMin = result;
            if (oldValue != node.markMin) {
                // 标记发生变化
                designManager.markChange();
                // 需要注册到操作历史
                recordManager.register({
                    descript: "更改打分最小值",
                    param: {
                        obj: node,
                        key: "markMin",
                        oldValue: oldValue,
                        newValue: node.markMin,
                    }
                })
            }
        }

        /**
            处理多选最大值变更按钮点击事件
            @node 节点
            @amount 变化量 
        */
        $scope.handleMarkMaxChangeClick = function (node, amount) {
            var oldValue = parseInt(node.markMax) || 0;
            var result = oldValue + amount;
            result = result < node.markMin ? node.markMin : result;
            node.markMax = result < 0 ? 0 : result;
            if (oldValue != node.markMax) {
                // 标记发生变化
                designManager.markChange();
                // 需要注册到操作历史
                recordManager.register({
                    descript: "更改打分最大值",
                    param: {
                        obj: node,
                        key: "markMax",
                        oldValue: oldValue,
                        newValue: node.markMax,
                    }
                })

            }
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
            切换是否多选标志
        */
        $scope.handleMultipleSelectToggleClick = function (node) {
            var param = {
                conns: [],
                oldMax: undefined,
                oldMin: undefined,
                node: node,
                manager: designManager,
            };
            node.multipleSelect = !node.multipleSelect;
            // 有选项输出时先移除所有选项输出
            if (node.multipleSelect && node.hasOptionDest()) {
                param.conns = designManager.removeOptionConnOfNode(node);
            }
            // 取消多选时最大值和最小值恢复默认
            if (!node.multipleSelect) {
                param.oldMax = node.multipleMax;
                param.oldMin = node.multipleMin;
            }
            node.setOptionEnable();
            // 标记发生变化
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "打开/关闭多选",
                param: param,
                undo: function () {
                    var param = this.param;
                    param.node.multipleSelect = !param.node.multipleSelect;
                    // 回到多选了
                    if (param.node.multipleSelect) {
                        param.node.multipleMax = param.oldMax;
                        param.node.multipleMin = param.oldMin;
                        // 回到非多选了
                    } else {
                        for (var i = 0; i < param.conns.length; i++) {
                            var conn = param.conns[i];
                            param.manager.addConnection(conn);
                        }
                    }
                },
                redo: function () {
                    var param = this.param;
                    param.node.multipleSelect = !param.node.multipleSelect;
                    // 重做成多选了
                    if (param.node.multipleSelect) {
                        param.manager.removeOptionConnOfNode(param.node);
                    }
                }

            });
        }

        /**
            处理必答切换点击事件
            @node 节点
        */
        $scope.handleToggleAnswerRequireClick = function (node) {
            // 非题目节点不处理
            if (!(node instanceof Class.SubjectNode)) {
                return;
            }
            node.answerRequired = !node.answerRequired;
            designManager.markChange()
            // 需要注册到操作历史
            recordManager.register({
                descript: "开启/关闭必答",
                param: {
                    node: node
                },
                undo: function () {
                    var param = this.param;
                    param.node.answerRequired = !param.node.answerRequired;
                },
                redo: function () {
                    var param = this.param;
                    param.node.answerRequired = !param.node.answerRequired;
                }
            });
        }



        /**
            处理切换选项随机点击事件
        */
        $scope.handleToggleRandomOpenClick = function (node) {
            // 非矩阵节点不处理
            if (!(node instanceof Class.MatrixNode)) {
                return;
            }
            var oldX = node.randomOptionX,
                oldY = node.randomOptionY;
            node.randomOpen = !node.randomOpen;
            // 已经关闭随机则需重置
            if (!node.randomOpen) {
                node.randomOptionX = false,
                node.randomOptionY = false;
            }
            // 需要注册到操作历史
            recordManager.register({
                descript: "打开/关闭矩阵选项随机",
                param: {
                    node: node,
                    oldX: oldX,
                    oldY: oldY,
                },
                undo: function () {
                    var param = this.param;
                    param.node.randomOpen = !param.node.randomOpen;
                    // 撤销到随机开启
                    if (param.node.randomOpen) {
                        param.node.randomOptionX = param.oldX;
                        param.node.randomOptionY = param.oldY;
                    } else {
                        param.node.randomOptionX = false;
                        param.node.randomOptionY = false;
                    }
                },
                redo: function () {
                    var param = this.param;
                    param.node.randomOpen = !param.node.randomOpen;
                    // 重做到随机关闭
                    if (!param.node.randomOpen) {
                        param.node.randomOptionX = false;
                        param.node.randomOptionY = false;
                    }
                }
            });
        }

        /**
            处理切换行选项随机点击事件
            @node 节点
        */
        $scope.handleToggleRandomOptionYClick = function (node) {
            // 非题目节点不处理
            if (!(node instanceof Class.SubjectNode)) {
                return;
            }
            var oldLoopY = node.loopOptionY;
            node.randomOptionY = !node.randomOptionY;
            // 矩阵题行选项随机和行固定位循环不能同时存在
            if (node.type == Enum.NODETYPE.MATRIX && node.randomOptionY) {
                node.loopOptionY = false;
            }
            // 标记发生变化
            designManager.markChange();

            // 需要注册到操作历史
            recordManager.register({
                descript: "开启/关闭横选项随机",
                param: {
                    node: node,
                    oldLoopY: oldLoopY,
                },
                undo: function () {
                    var param = this.param;
                    param.node.randomOptionY = !param.node.randomOptionY;
                    if (!param.node.isTypeOf("MATRIX")) {
                        return;
                    }

                    // 撤销到随机关闭
                    if (!param.node.randomOptionY) {
                        param.node.loopOptionY = param.oldLoopY;
                    } else {
                        param.node.loopOptionY = false;
                    }
                },
                redo: function () {
                    var param = this.param;
                    param.node.randomOptionY = !param.node.randomOptionY;
                    if (!param.node.isTypeOf("MATRIX")) {
                        return;
                    }
                    // 重做到随机开启
                    if (param.node.randomOptionY) {
                        param.node.loopOptionY = false;
                    }
                }
            })
        }

        /**
            处理切换列选项随机点击事件
            @node 节点
        */
        $scope.handleToggleRandomOptionXClick = function (node) {
            // 非矩阵节点不处理
            if (!(node instanceof Class.MatrixNode)) {
                return;
            }
            var oldLoopX = node.loopOptionX;
            node.randomOptionX = !node.randomOptionX;
            // 矩阵题列选项随机和列固定位循环不能同时存在
            if (node.randomOptionX) {
                node.loopOptionX = false;
            }
            // 标记发生变化
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "开启/关闭纵选项随机",
                param: {
                    node: node,
                    oldLoopX: oldLoopX,
                },
                undo: function () {
                    var param = this.param;
                    param.node.randomOptionX = !param.node.randomOptionX;
                    // 撤销到随机关闭
                    if (!param.node.randomOptionX) {
                        param.node.loopOptionX = param.oldLoopX;
                    } else {
                        param.node.loopOptionX = false;
                    }
                },
                redo: function () {
                    var param = this.param;
                    param.node.randomOptionX = !param.node.randomOptionX;
                    // 重做到随机开启
                    if (param.node.randomOptionX) {
                        param.node.loopOptionX = false;
                    }
                }
            });
        }

        /**
            切换固定位循环开启状态
        */
        $scope.handleToggleLoopOpenClick = function (node) {
            // 非矩阵节点不处理
            if (!(node instanceof Class.MatrixNode)) {
                return;
            }
            var oldX = node.loopOptionX;
            var oldY = node.loopOptionY;
            node.loopOpen = !node.loopOpen;
            // 已关闭固定位循环则需重置
            if (!node.loopOpen) {
                node.loopOptionX = false;
                node.loopOptionY = false;
            }

            // 需要注册到操作历史
            recordManager.register({
                descript: "打开/关闭固定位循环",
                param: {
                    node: node,
                    oldX: oldX,
                    oldY: oldY,
                },
                undo: function () {
                    var param = this.param;
                    param.node.loopOpen = !param.node.loopOpen;
                    // 撤销到循环开启
                    if (param.node.loopOpen) {
                        param.node.loopOptionX = param.oldX;
                        param.node.loopOptionY = param.oldY;
                    } else {
                        param.node.loopOptionX = false;
                        param.node.loopOptionY = false;
                    }
                },
                redo: function () {
                    var param = this.param;
                    param.node.loopOpen = !param.node.loopOpen;
                    // 重做到循环关闭
                    // 撤销到循环开启
                    if (!param.node.loopOpen) {
                        param.node.loopOptionX = false;
                        param.node.loopOptionY = false;
                    }
                }
            })
        }

        /**
            切换行固定位循环
            @node 节点
        */
        $scope.handleToggleLoopOptionYClick = function (node) {
            // 非矩阵节点不处理
            if (!(node instanceof Class.MatrixNode)) {
                return;
            }
            var oldRandomY = node.randomOptionY;
            node.loopOptionY = !node.loopOptionY;
            // 矩阵题行选项随机和行固定位循环不能同时存在
            if (node.loopOptionY) {
                node.randomOptionY = false;
            }
            // 标记发生变化
            designManager.markChange();

            // 需要注册到操作历史
            recordManager.register({
                descript: "开启/关闭行固定位循环",
                param: {
                    node: node,
                    oldRandomY: oldRandomY,
                },
                undo: function () {
                    var param = this.param;
                    param.node.loopOptionY = !param.node.loopOptionY;
                    // 撤销到横循环关闭
                    if (!param.node.loopOptionY) {
                        param.node.randomOptionY = param.oldRandomY;
                    } else {
                        param.node.randomOptionY = false;
                    }
                },
                redo: function () {
                    var param = this.param;
                    param.node.loopOptionY = !param.node.loopOptionY;
                    // 重做到横循环开启
                    if (param.node.loopOptionY) {
                        param.node.randomOptionY = false;
                    }
                }
            });
        }

        /**
            切换列固定位循环
            @node 节点
        */
        $scope.handleToggleLoopOptionXClick = function (node) {
            // 非矩阵节点不处理
            if (!(node instanceof Class.MatrixNode)) {
                return;
            }
            var oldRandomX = node.randomOptionX;
            node.loopOptionX = !node.loopOptionX;
            // 矩阵题行选项随机和行固定位循环不能同时存在
            if (node.loopOptionX) {
                node.randomOptionX = false;
            }
            // 标记发生变化
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "开启/关闭列固定位循环",
                param: {
                    node: node,
                    oldRandomX: oldRandomX,
                },
                undo: function () {
                    var param = this.param;
                    param.node.loopOptionX = !param.node.loopOptionX;
                    // 撤销到横循环关闭
                    if (!param.node.loopOptionX) {
                        param.node.randomOptionX = param.oldRandomX;
                    } else {
                        param.node.randomOptionX = false;
                    }
                },
                redo: function () {
                    var param = this.param;
                    param.node.loopOptionX = !param.node.loopOptionX;
                    // 撤销到横循环关闭
                    if (!param.node.loopOptionX) {
                        param.node.randomOptionX = false;
                    }
                }

            })
        }

        /**
           点击批量添加选项按钮
         */
        $scope.handleAddOptionBatchClick = function () {
            designManager.optionBatchAddManager.open();
        }

        /**
            点击添加选项按钮
        */
        $scope.handleAddOptionClick = function () {
            designManager.addOptionForCurrentNode();
        }

        /**
            处理节点定位点击事件
        */
        $scope.handleNodeLocateClick = function (node) {
            designManager.takeToCenter(node);
        }

        /**
            处理图片边框类型点击事件
            @node 节点
            @type 边框类型
        */
        $scope.handleImgBorderTypeClick = function (node, type) {

            if (type == node.borderType) {
                return;
            }
            // 不可用的类型
            if (node.isDisabledBorderType(type)) {
                // 不可变更
                return;
            }
            var oldType = node.borderType,
                newType = node.borderType = type;
            designManager.markChange();
            // 需要记录到历史
            recordManager.register({
                descript: "更改图片边框类型",
                param: {
                    node: node,
                    oldType: oldType,
                    newType: newType,
                },
                undo: function () {
                    var param = this.param;
                    param.node.borderType = param.oldType;
                },
                redo: function () {
                    var param = this.param;
                    param.node.borderType = param.newType;;
                }
            });
        }

        /**
            处理图片列表类型点击事件
            @node 节点
            @type 边框类型
        */
        $scope.handleImgListTypeClick = function (node, type) {
            // temp script 临时脚本
            // 因非开发模式中暂时不开放1单行和3网格
            if ((type == 3) && !ZYDesign.Config.developMode) {
                return;
            }
            if (type == node.listType) {
                return;
            }
            var oldBorderType = node.borderType,
                oldListType = node.listType;
            // 不可用的类型
            if (node.isDisabledListType(type)) {
                // 列表类型性优先级更高,将边框类型复位
                node.borderType = 1;
            }
            var newBorderType = node.borderType,
                newListType = node.listType = type;

            designManager.markChange();

            // 需要注册到操作历史
            recordManager.register({
                descript: "更改图片列表方式",
                param: {
                    node: node,
                    oldBorderType: oldBorderType,
                    oldListType: oldListType,
                    newBorderType: newBorderType,
                    newListType: newListType
                },
                undo: function () {
                    var param = this.param;
                    param.node.borderType = param.oldBorderType;
                    param.node.listType = param.oldListType;
                },
                redo: function () {
                    var param = this.param;
                    param.node.borderType = param.newBorderType;
                    param.node.listType = param.newListType;
                }
            })
        }

        /**
            处理图片上传控件遮罩
        */
        $scope.handleUploaderMaskClick = function () {
            // 关闭上传控件
            designManager.imageUploadManager.close();
        }

        /**
            处理打分方式点击事件
            @type 打分方式
            @node 节点
        */
        $scope.handleMarkTypeClick = function (type, node) {
            // temp script 临时脚本
            // 因非开发模式中暂时不开放1分值和3文字
            if ((type == 1 || type == 3) && !ZYDesign.Config.developMode) {
                return;
            }
            if (type == node.markType) {
                return;
            }
            var oldType = node.markType,
                newType = node.markType = type;
            node.markType = type;
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "更改打分方式",
                param: {
                    node: node,
                    oldType: oldType,
                    newType: newType,
                },
                undo: function () {
                    var param = this.param;
                    param.node.markType = param.oldType;
                },
                redo: function () {
                    var param = this.param;
                    param.node.markType = param.newType;
                }
            })
        }


        /**
            处理打分图形方式点击事件
            @node 节点
            @type 
        */
        $scope.handleMarkImgCodeClick = function (node, code) {
            if (code == node.markImgCode) {
                return;
            }
            var oldCode = node.markImgCode,
                newCode = node.markImgCode = code;
            node.markImgCode = code;
            designManager.markChange();

            recordManager.register({
                descript: "更改打分图标",
                param: {
                    node: node,
                    oldCode: oldCode,
                    newCode: newCode,
                },
                undo: function () {
                    var param = this.param;
                    param.node.markImgCode = param.oldCode
                },
                redo: function () {
                    var param = this.param;
                    param.node.markImgCode = param.newCode
                }
            })
        }

        /**
            处理图片数点击事件
            @count 数量
            @node 节点
        */
        $scope.handleMarkImgCountClick = function (count, node) {
            if (count == node.markImgCount) {
                return;
            }
            var oldCount = node.markImgCount,
                newCount = node.markImgCount = count;
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "更改打分图片数",
                param: {
                    node: node,
                    oldCount: oldCount,
                    newCount: newCount,
                },
                undo: function () {
                    var param = this.param;
                    param.node.markImgCount = param.oldCount;
                },
                redo: function () {
                    var param = this.param;
                    param.node.markImgCount = param.newCount;
                }
            });
        }

        /**
            处理添加打分文字项点击事件
            @node 节点
        */
        $scope.handleAddMarkItemClick = function (node) {
            node.addMarkItem();
            designManager.markChange();
        }

        /**
            处理删除打分文字项点击事件
            @node 节点
            @item 打分项
        */
        $scope.handleDeleteMarkItemClick = function (node, item) {
            node.removeMarkItem(item);
            designManager.markChange();
        }

        /**
            处理是否显示分值点击事件
            @node 节点
        */
        $scope.handleShowMarkValueClick = function (node) {
            node.showMarkValue = !node.showMarkValue;
            designManager.markChange();

            // 需要注册到操作历史
            recordManager.register({
                descript: "开启/关闭显示默认分值",
                param: {
                    node: node,
                },
                undo: function () {
                    var param = this.param;
                    param.node.showMarkValue = !param.node.showMarkValue;
                },
                redo: function () {
                    var param = this.param;
                    param.node.showMarkValue = !param.node.showMarkValue;
                },
            })
        }
        /**
            处理是否显示分值描述点击事件
            @node 节点
        */
        $scope.handleShowMarkValueDescribeClick = function (node) {
            node.showMarkValueDescribe = !node.showMarkValueDescribe;
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "开启/关闭使用分值描述",
                param: {
                    node: node,
                },
                undo: function () {
                    var param = this.param;
                    param.node.showMarkValueDescribe = !param.node.showMarkValueDescribe;
                },
                redo: function () {
                    var param = this.param;
                    param.node.showMarkValueDescribe = !param.node.showMarkValueDescribe;
                },
            })
        }
        /**
            处理默认分值变化事件
            @node 节点
        */
        $scope.handleDefaultMarkChange = function (node, type) {
            if (!type) {
                var result = parseInt(node.defaultMark);
                if (result < node.markMin || result > node.markMax) {
                    result = node.markMin;
                }
                node.defaultMark = result;
            }
            designManager.recordCommonChange(node, "defaultMark", type, "更改默认分值");
        }

        /**
            处理默认分值点击事件
            @node 节点
            @amount 变化量
        */
        $scope.handleDefaultMarkChangeClick = function (node, amount) {
            var oldValue = node.defaultMark;
            var result = oldValue + amount;
            if (result < node.markMin) {
                result = node.markMin;
            } else if (result > node.markMax) {
                result = node.markMax;
            }
            node.defaultMark = result;
            if (oldValue != node.defaultMark) {
                // 标记发生变化
                designManager.markChange();
                // 需要注册到操作历史
                recordManager.register({
                    descript: "更改默认分值",
                    param: {
                        obj: node,
                        key: "defaultMark",
                        oldValue: oldValue,
                        newValue: node.defaultMark,
                    }
                })
            }
        }

        /**
           选项编号改变
           @option 选项
           @type 变化类型 -1:开始 1:结束 其他:变化中
       */
        $scope.handleOtherOptionNumberChange = function (option, type) {
            // 变化中
            if (!type) {
                option.number = parseInt(option.number);
                option.number = isNaN(option.number) ? 0 : option.number;
            }

            designManager.recordCommonChange(option, "number", type, "更改其他选项编号");
        }

        /**
            处理节点描述变化事件
            @ques 问题描述
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleNodeDescribeChange = function (ques, type) {
            designManager.recordCommonChange(ques, "originText", type, "更改节点描述");
        }

        /**
            处理其他选项描述变化事件
            @option 选项
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleOtherOptionTextChange = function (option, type) {
            designManager.recordCommonChange(option, "originText", type, "更改其他选项描述");
        }

        /**
            处理节点名称变化事件
            @node 节点
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleNodeNameChange = function (node, type) {
            designManager.recordCommonChange(node, "nodeName", type, "更改节点名");
        }


        /**
            处理低分描述变化事件
            @node 节点
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleMarkMinTextChange = function (node, type) {
            designManager.recordCommonChange(node, "minText", type, "更改低分评价");
        }

        /**
            处理中分描述变化事件
            @node 节点
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleMarkMidTextChange = function (node, type) {
            designManager.recordCommonChange(node, "midText", type, "更改中分评价");
        }

        /**
            处理高分描述变化事件
            @node 节点
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleMarkMaxTextChange = function (node, type) {
            designManager.recordCommonChange(node, "maxText", type, "更改高分评价");
        }

        /**
            处理链接地址变化事件
            @node 节点
            @type 变化类型 -1:开始 1:结束 其他:变化中
        */
        $scope.handleLinkUrlChange = function (node, type) {
            designManager.recordCommonChange(node, "linkUrl", type, "更改链接地址");
        }

        //////////////////////////////////////////////////////////////////////////////////////////////



        /**
            逻辑条件相关的题目改变
            @require 条件
        */
        $scope.onLogicRelatedSubjectChange = function (require) {
            // 关联题目
            require.relatedSubject = designManager.searchSubjectById(require.subjectId);
            designManager.markChange();
        }

        /**
            添加逻辑图标点击
            @logicNode 所在的逻辑节点
        */
        $scope.onLogicAddIconClick = function (logicNode) {
            // 初始的逻辑数据
            var logic = {};
            // 添加一个逻辑
            logicNode.addOption(logic);
            designManager.markChange();
        }

        /**
            删除逻辑图标点击
            @logic 要删除的逻辑
            @logicNode 逻辑节点
        */
        $scope.onLogicDeleteIconClick = function (logic, logicNode) {
            // 寻找这个逻辑所在位置的索引
            for (var i = 0; i < logicNode.options.length; i++) {
                var option = logicNode.options[i];
                // 找到这个位置
                if (logic == option) {
                    // 移除该逻辑
                    logicNode.removeOption(i);
                    break;
                }
            }
            designManager.markChange();
        }

        /**
            添加条件图标点击
            @logic 所在逻辑
        */
        $scope.onRequireAddIconClick = function (logic) {
            // 初始条件数据
            var require = {
                arithmetic: 0,
                limitType: 0,
                answerFirst: "答案一",
                answerSecond: "答案二"
            };
            // 添加一个条件
            logic.addRequire(require);
            designManager.markChange();
        }

        /**
            删除条件图标点击
            @require 要删除的的条件
            @logic 所在逻辑
        */
        $scope.onRequireDeleteIconClick = function (require, logic) {
            // 删除该条件
            logic.removeRequire(require);
            // 标记发生变化
            designManager.markChange();
        }

        /**
          地域节点选项省份Id变化
          option 选项
        */
        $scope.onProvinceIdChange = function (option) {
            option.cityId = null;
            option.countyId = null;
            // 标记发生变化
            designManager.markChange();
        }

        /**
         地域节点选项市级Id变化
         option 选项
       */
        $scope.onCityIdChange = function (option) {
            option.countyId = null;
            // 标记发生变化
            designManager.markChange();
        }

        /**
            移除循环变量点击
        */
        $scope.onRemoveLoopVariableClick = function (loopNode, variable) {
            loopNode.removeVariable(variable);
        }

        /**
            添加循环变量点击
        */
        $scope.onAddLoopVariableClick = function (loopNode) {
            loopNode.addVariable("");
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
            备注内容发生变化
        */
        $scope.onCommentChange = function (node) {
            // 非备注节点不处理
            if (node.type != Enum.NODETYPE.COMMENT) {
                return;
            }
            // 重新获取文字
            node.updateTexts();
        }

        /**
           处理帮助图标点击事件
           help
           @evt 系统参数
           @key 帮助的key值
        */
        $scope.handleNodeEditorHelpClick = function (evt, key) {
            evt.stopPropagation();
            designManager.helpManager.help(evt, key);
        }
    }
]);