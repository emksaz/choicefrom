

/**
    节点流程模块
*/
angular.module("nodeFlow", ["dragging"])

/**
    节点流程指令
*/
.directive("nodeFlow", function () {

    /**
        处理连接点鼠标进入事件
        @evt 事件参数
    */
    function handleConnecorMouseEnter(evt) {
        var elem = $(evt.currentTarget).find("circle");
        var cls = elem.attr("class") + " mouseover_connector_circle";
        elem.attr("class", cls);
    }

    /**
        处理连接点鼠标离开事件
        @evt 事件参数
    */
    function handleConnecorMouseLeave(evt) {
        var elem = $(evt.currentTarget).find("circle");
        var cls = elem.attr("class").replace(" mouseover_connector_circle", "");
        elem.attr("class", cls);
    }

    /**
        处理警告标志鼠标进入事件
        @evt 事件参数
    */
    function handleWarnIconMouseEnter(evt) {
        $(evt.currentTarget).find(".elem_warning_msg").show();
    }

    /**
        处理警告标志鼠标离开事件
        @evt 事件参数
    */
    function handleWarnIconMouseLeave(evt) {
        $(evt.currentTarget).find(".elem_warning_msg").hide();
    }

    return {
        restrict: "A",
        templateUrl: "/Content/de/layout/node_flow_template.html",
        replace: true,
        scope: {
            designManager: "=nodeFlow"
        },
        controller: "NodeFlowController",
        link: function ($scope, $element) {
            var designManager = $scope.designManager;
            // 处理画布区右键菜单事件
            $element.on("contextmenu", function (e) {
                // 显示自定义右键菜单
                designManager.contextMenu.open(e.pageX, e.pageY);
                designManager.digest();
                e.preventDefault();
            });
            // 处理页面鼠标落下事件
            $(document.body).on("mousedown", function () {
                if (designManager.contextMenu.isVisible()) {
                    // 关闭右键菜单
                    designManager.contextMenu.close();
                    designManager.digest();
                }
            });
            $element.delegate(".flow_connector", {
                mouseenter: handleConnecorMouseEnter,
                mouseleave: handleConnecorMouseLeave,
            }).delegate(".elem_warn_icon", {
                mouseenter: handleWarnIconMouseEnter,
                mouseleave: handleWarnIconMouseLeave,
            });
        }
    }
})

/**
    节点流程控制器
*/
.controller("NodeFlowController", ["$scope", "dragging", "$element", "recordManager",
    function ($scope, dragging, $element, recordManager) {
        var designManager = $scope.designManager,
            hinter = ZYDesign.Hinter,
            env = ZYDesign.Environment,
            lastRemovedConn = null;     // 最后一个被移除的连接
            connOptrType = "none";      // 连接操作类型 none:没有操作 move:移动中 add:添加中 默认:none
        /**
            处理图表区域鼠标落下事件
            @evt 事件参数
        */
        $scope.handleFlowMouseDown = function (evt) {
            // 让当前活跃元素失去焦点
            $(document.activeElement).blur();
            //关闭右键菜单
            designManager.contextMenu.close();
            // 最后一次鼠标位置的记录器
            var lastMouseCoords, startMouseCoords;
            // 监听拖拽
            dragging.startDrag(evt, {
                /**
                    开始拖拽
                */
                dragStarted: function (x, y, e) {
                    var ctrlKey = env.isMac ? e.metaKey : e.ctrlKey;
                    designManager.disableConns();
                    // 记录当前位置
                    lastMouseCoords = startMouseCoords = designManager.translateCoordinates(x, y, $element);
                    // CTRL键按下了
                    if (ctrlKey) {
                        // 距离中心点位置按比例缩放再加回偏移量
                        var px = (lastMouseCoords.x - designManager.chartXDiffer) / designManager.chartZoomRate + designManager.chartXDiffer;
                        var py = (lastMouseCoords.y - designManager.chartYDiffer) / designManager.chartZoomRate + designManager.chartYDiffer;
                        // 准备开始框选
                        designManager.selectRectManager.start(px, py);
                    }
                    if (this.options.silent) {
                        designManager.digest();
                    }
                },

                /**
                    拖拽中
                */
                dragging: function (x, y, e) {
                    var ctrlKey = env.isMac ? e.metaKey : e.ctrlKey;
                    // 当前位置
                    var curCoords = designManager.translateCoordinates(x, y, $element);
                    // 按住了CTRL键进行框选处理
                    if (ctrlKey) {
                        // 距离中心点位置按比例缩放再加回偏移量
                        var px = (curCoords.x - designManager.chartXDiffer) / designManager.chartZoomRate + designManager.chartXDiffer;
                        var py = (curCoords.y - designManager.chartYDiffer) / designManager.chartZoomRate + designManager.chartYDiffer;
                        // 改变框选框
                        designManager.selectRectManager.resize(px, py);

                        // 对angular静默模式时需要自己更新选框位置
                        if (this.options.silent) {
                            designManager.selectRectManager.fixPosition();
                        }
                    // 未按住CTRL键进行移动处理
                    } else {
                        // 有可能是中途松开了CTRL键,则需要丢掉选择框
                        designManager.selectRectManager.reset();
                        // 获得拖动距离
                        var deltaX = curCoords.x - lastMouseCoords.x;
                        var deltaY = curCoords.y - lastMouseCoords.y;

                        // 两个方向必须有一个发生变化
                        if (deltaX != 0 || deltaY != 0) {
                            // 更新画布位置
                            designManager.moveNodes(deltaX, deltaY);
                        }
                        // 对angular静默模式时需要自己更新页面节点位置
                        if (this.options.silent) {
                            designManager.updateNodeFlowPosition();
                        }
                    }            
                    // 更新最后位置
                    lastMouseCoords = curCoords;
                },

                dragEnded: function (e) {
                    var ctrlKey = env.isMac ? e.metaKey : e.ctrlKey;
                    designManager.enableConns();
                    // CTRL键按下了
                    if (ctrlKey) {
                        // 完成框选
                        designManager.selectRectManager.finish();
                    // CTRL键未按下
                    } else {
                        // 有可能是中途松开了CTRL键,则需要丢掉选择框
                        designManager.selectRectManager.reset();
                        // 注册到操作历史
                        recordManager.register({
                            descript: "画布移动",
                            param: {
                                deltaX: lastMouseCoords.x - startMouseCoords.x,
                                deltaY: lastMouseCoords.y - startMouseCoords.y,
                            },
                            redo: function () {
                                designManager.moveNodes(this.param.deltaX, this.param.deltaY);
                                designManager.checkVisibleOfNodesAndConns();
                                designManager.markChange(true);
                            },
                            undo: function () {
                                designManager.moveNodes(-this.param.deltaX, -this.param.deltaY);
                                designManager.checkVisibleOfNodesAndConns();
                                designManager.markChange(true);
                            }
                        })
                    }
                    // 标记已发生改变
                    designManager.markChange(true);
                },


                clicked: function () {
                    // 非右键菜单场合
                    if (evt.button != 2) {
                        // 反选所有对象
                        designManager.deselectAll();
                        designManager.currentNode = null;
                    }
                },

                options: { silent: ZYDesign.Config.draggingSilent }

            });
        }

        /**
            处理图表区域鼠标落下事件
            @evt 事件参数
        */
        $scope.handleFlowMouseUp = function (evt) {
            // 移除临时
            designManager.removeTempConnection();
        }

        /**
            处理节点鼠标落下事件
            @evt 事件参数
            @node 节点数据模型
        */
        $scope.handleNodeMouseDown = function (evt, node) {
            var ctrlKey = env.isMac ? evt.metaKey : evt.ctrlKey;
            // 让当前活跃元素失去焦点
            $(document.activeElement).blur();
            //关闭右键菜单
            designManager.contextMenu.close();
            // CTRL键按下了多选处理
            if (ctrlKey) {
                // 已选择
                if (node.isSelected()) {
                    // 需要取消选择
                    node.deselect();
                // 未选择
                } else {
                    // 选择
                    node.select()
                }
            // CTRL键未按下单选处理
            } else {
                // 未选择的单选,已选择的不做处理
                if (!node.isSelected()) {
                    // 单选该节点
                    designManager.selectNodeSingle(node);
                }
                
            }

            // 最后一次鼠标位置的记录器
            var lastMouseCoords,startMouseCoords;
            // 监听拖拽
            dragging.startDrag(evt, {
                /**
                    开始拖拽
                */
                dragStarted: function (x, y) {
                    designManager.disableConns();
                    // 记录当前位置
                    lastMouseCoords = startMouseCoords = designManager.translateCoordinates(x, y, $element);
                    if (this.options.silent) {
                        designManager.digest();
                    }
                },

                /**
                    拖拽中
                */
                dragging: function (x, y) {
                    // 当前位置
                    var curCoords = designManager.translateCoordinates(x, y, $element);
                    // 获得拖动距离
                    var deltaX = curCoords.x - lastMouseCoords.x;
                    var deltaY = curCoords.y - lastMouseCoords.y;
                    // 移动所有被选中的节点
                    designManager.moveNodes(deltaX,
                        deltaY,
                        true);
                    // 对angular静默模式时需要自己更新页面节点位置
                    if (this.options.silent) {
                        designManager.updateNodeFlowPosition(true);
                    }
                    // 更新最后位置
                    lastMouseCoords = curCoords;
                },

                dragEnded: function () {
                    designManager.enableConns();
                    var nodes = designManager.getSelectedNodes();
                    // 注册到操作历史
                    recordManager.register({
                        descript: "节点移动",
                        param: {
                            nodes: nodes,
                            deltaX: lastMouseCoords.x - startMouseCoords.x,
                            deltaY: lastMouseCoords.y - startMouseCoords.y,
                        },
                        redo: function () {
                            var param = this.param;
                            designManager.moveSpecifiedNodes(param.nodes, param.deltaX, param.deltaY);
                            designManager.markChange(true);
                        },
                        undo: function () {
                            var param = this.param;
                            designManager.moveSpecifiedNodes(param.nodes, -param.deltaX, -param.deltaY);
                            designManager.markChange(true);
                        }
                    })
                    // 标记已发生改变
                    designManager.markChange(true);
                },

                clicked: function (e) {
                    var ctrlKey = env.isMac ? e.metaKey : e.ctrlKey;
                    // CTRL键按下,多选处理
                    if (ctrlKey) {
                        // 多选模式下取消当前节点
                        designManager.currentNode = null;
                    }
                },
                options: { silent: ZYDesign.Config.draggingSilent }

            });
        }

        /**
            处理连接点鼠标抬起事件
            @evt 事件参数
            @connector 连接点
        */
        $scope.handleConnectorMouseUp = function (evt, connector) {
            // 没有临时连接对象
            if (!designManager.tempConncetion) {
                // 退出
                return;
            }
            // 默认起点
            var source = designManager.tempConncetion.source;
            // 默认终点
            var dest = connector;
            // 起点是伪造的
            if (source.isFake) {
                // 起点
                source = connector;
                // 终点
                dest = designManager.tempConncetion.dest;
            }
            //不能连接多选选项(来自选项)
            if (connector.exactType == ZYDesign.Enum.CONNEXACTTYPE.OPTION &&
                !connector.parent.isSingleSelect()) {
                // 清除临时连接对象
                designManager.removeTempConnection();
            }
            // 获取连接允许
            var permition = designManager.getConnectPermition(source, dest);
            // 允许连接
            if (permition.allowConnect) {
                // 将临时连接对象的伪装点改成当前连接点
                if (designManager.tempConncetion.dest.isFake) {
                    designManager.tempConncetion.dest = connector;
                } else {
                    designManager.tempConncetion.source = connector;
                }

                // 将临时连接对象转变为正式连接对象
                var rs = designManager.applyTempConnection();
                // 标记已发生改变
                designManager.markChange(true);

                // 需要将变化添加到操作历史
                // 移动连接的场合
                if (connOptrType == "move") {
                    // 需要注册到操作历史
                    recordManager.register({
                        descript: "移动更改连接",
                        param: {
                            manager: designManager,
                            oldConn: lastRemovedConn,
                            newConn: rs,
                        },
                        undo: function () {
                            var param = this.param;
                            param.manager.removeConnection(param.newConn);
                            param.oldConn.disable = false;
                            param.manager.addConnection(param.oldConn);
                        },
                        redo: function () {
                            var param = this.param;
                            param.manager.removeConnection(param.oldConn);
                            param.manager.addConnection(param.newConn);
                        }
                    })
                    // 清除记录
                    lastRemovedConn = null;

                // 添加连接的场合
                } else if (connOptrType == "add") {

                    // 需要注册到操作历史
                    recordManager.register({
                        descript: "添加连接",
                        param: {
                            manager: designManager,
                            conn:rs,
                        },
                        undo: function () {
                            var param = this.param;
                            param.manager.removeConnection(param.conn);
                        },
                        redo: function () {
                            var param = this.param;
                            param.manager.addConnection(param.conn);
                        }
                    })
                }
            }
                // 不允许连接
            else {
                // 弹出提示
                hinter.hint(permition.message);
                // 清除临时连接对象
                designManager.removeTempConnection();
            }
        }

        /**
            处理连接点鼠标落下事件
            @evt 事件参数
            @connector 连接点
        */
        $scope.handleConnectorMouseDown = function (evt, connector) {
            // 让当前活跃元素失去焦点
            $(document.activeElement).blur();
            //关闭右键菜单
            designManager.contextMenu.close();
            // 阻止冒泡
            evt.stopPropagation();

            // 最后鼠标位置
            var lastMouseCoords;
            // 临时连接点
            var tempConnector;

            // 监听拖拽
            dragging.startDrag(evt, {

                // 开始拖拽
                dragStarted: function (x, y) {
                    // 来自选项且节点非单选
                    if (connector.exactType == ZYDesign.Enum.CONNEXACTTYPE.OPTION &&
                        !connector.parent.isSingleSelect()) {
                        hinter.hint("多选题不能从选项输出！");
                        return;
                    }
                    // 已存在输出的输出口不能再次输出
                    if (connector.dest &&
                        connector.type == ZYDesign.Enum.CONNTYPE.OUTPUT &&
                        connector.exactType != ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART) {
                        hinter.hint(Prompt.QSNRD_ConnForbidMultiOutput);
                        return;
                    }
                    // 使所有的连线无效
                    designManager.disableConns();
                    // 记录当前位置
                    lastMouseCoords = designManager.translateCoordinates(x, y, $element);
                    // 生成临时连接点
                    tempConnector = {
                        isFake: true,
                        circleX: connector.getCircleX(),
                        circleY: connector.getCircleY(),
                        getCircleX: function () { return this.circleX },
                        getCircleY: function () { return this.circleY },
                        parent: connector.parent,
                        type: connector.type,
                        dest: connector.dest
                    }
                    // 初始化源点和目标点
                    var sourceConn = connector;
                    var destConn = tempConnector;
                    // 如果是从输入点开始的
                    if (connector.type == ZYDesign.Enum.CONNTYPE.INPUT) {
                        // 调换
                        sourceConn = tempConnector;
                        destConn = connector;
                    }
                    // 记录类型为添加连接
                    connOptrType = "add";
                    // 生成临时连接对象
                    designManager.tempConncetion = designManager.createConnection(sourceConn, destConn, true);
                    // 加入到连接列表
                    designManager.addConnection(designManager.tempConncetion);
                    if (this.options.silent) {
                        designManager.digest();
                    }
                },

                /**
                    拖拽中
                */
                dragging: function (x, y) {
                    if (!tempConnector) {
                        return;
                    }
                    // 当前位置
                    var curCoords = designManager.translateCoordinates(x, y, $element);

                    // 移动距离
                    var deltaX = curCoords.x - lastMouseCoords.x;
                    var deltaY = curCoords.y - lastMouseCoords.y;

                    // 更新临时连接点位置
                    tempConnector.circleX += deltaX / designManager.chartZoomRate;
                    tempConnector.circleY += deltaY / designManager.chartZoomRate;

                    // 对angular静默模式时需要自己更新连接位置
                    if (this.options.silent) {
                        designManager.tempConncetion.fixPosition();
                    }
                    // 记录位置
                    lastMouseCoords = curCoords;
                },

                dragEnded: function(){
                    designManager.enableConns();
                    connOptrType = "none";
                },


                clicked: function () {
                },
                
                options: { silent: ZYDesign.Config.draggingSilent }

            });
        }

        /**
            处理连接对象鼠标落下事件
            @evt 事件参数
            @connection 连接对象
        */
        $scope.handleConnectionMouseDown = function (evt, connection) {
            // 让当前活跃元素失去焦点
            $(document.activeElement).blur();
            //关闭右键菜单
            designManager.contextMenu.close();
            // 反选所有
            designManager.deselectAll();
            // 选择当前
            if (connection.select) {
                connection.select();
            }
            // 最后鼠标位置
            var lastMouseCoords;
            // 临时连接点
            var tempConnector;
            // 监听拖拽
            dragging.startDrag(evt, {

                // 开始拖拽
                dragStarted: function (x, y) {
                    // 使所有的连线无效
                    designManager.disableConns();
                    // 记录当前位置
                    lastMouseCoords = designManager.translateCoordinates(x, y, $element);

                    // 进行缩放后要重新计算鼠标位置
                    var chartX = (lastMouseCoords.x - designManager.chartXDiffer * (1 - designManager.chartZoomRate)) / designManager.chartZoomRate;
                    var chartY = (lastMouseCoords.y - designManager.chartYDiffer * (1 - designManager.chartZoomRate)) / designManager.chartZoomRate;

                    // 鼠标位置到源端口和目标端口的X,Y差距
                    var xToSource = chartX - connection.sourceCoordX() - designManager.chartXDiffer;
                    var yToSource = chartY - connection.sourceCoordY() - designManager.chartYDiffer;
                    var xToDest = chartX - connection.destCoordX() - designManager.chartXDiffer;
                    var yToDest = chartY - connection.destCoordY() - designManager.chartYDiffer;

                    // 鼠标位置到源的距离模拟
                    var distanseToSource = Math.abs(xToSource) + Math.abs(yToSource);
                    // 鼠标位置到目标的距离模拟
                    var distanseToDest = Math.abs(xToDest) + Math.abs(yToDest);
                    // 要留下来的端口
                    var keepConnector = null;
                    // 要丢弃的端口
                    var abandonConnector = null;
                    // 临时连接端口初始位置
                    var tempCoords = {
                        x: 0,
                        y: 0
                    }

                    // 距离远的端口留下,距离近的丢掉,变成临时端口
                    if (distanseToSource > distanseToDest) {
                        keepConnector = connection.source;
                        abandonConnector = connection.dest;
                        tempCoords.x = abandonConnector.getCircleX() + xToDest;
                        tempCoords.y = abandonConnector.getCircleY() + yToDest;
                    } else {
                        keepConnector = connection.dest;
                        abandonConnector = connection.source;
                        tempCoords.x = abandonConnector.getCircleX() + xToSource;
                        tempCoords.y = abandonConnector.getCircleY() + yToSource;
                    }
                    // 先移除当前连接
                    designManager.removeConnection(connection);
                    connection.deselect();
                    connection.unhover();
                    // 记录下来以供操作历史中使用
                    lastRemovedConn = connection;
                    // 记录类型为移动连接
                    connOptrType = "move";
                    // 下面生成一个临时连接供拖拽
                    // 生成临时连接点
                    tempConnector = {
                        isFake: true,
                        circleX: tempCoords.x,
                        circleY: tempCoords.y,
                        getCircleX: function () { return this.circleX },
                        getCircleY: function () { return this.circleY },
                        parent: abandonConnector.parent,
                        type: abandonConnector.type,
                        dest: abandonConnector.dest
                    }
                    // 初始化源点和目标点
                    var sourceConn = keepConnector;
                    var destConn = tempConnector;
                    // 如果是从输入点开始的
                    if (keepConnector.type == ZYDesign.Enum.CONNTYPE.INPUT) {
                        // 调换
                        sourceConn = tempConnector;
                        destConn = keepConnector;
                    }

                    // 生成临时连接对象
                    designManager.tempConncetion = designManager.createConnection(sourceConn, destConn, true);
                    // 加入到连接列表
                    designManager.addConnection(designManager.tempConncetion);
                    if (this.options.silent) {
                        designManager.digest();
                    }
                    
                },

                /**
                    拖拽中
                */
                dragging: function (x, y) {
                    // 当前位置
                    var curCoords = designManager.translateCoordinates(x, y, $element);

                    // 移动距离
                    var deltaX = curCoords.x - lastMouseCoords.x;
                    var deltaY = curCoords.y - lastMouseCoords.y;

                    // 更新临时连接点位置
                    tempConnector.circleX += deltaX / designManager.chartZoomRate;
                    tempConnector.circleY += deltaY / designManager.chartZoomRate;

                    // 对angular静默模式时需要自己更新连接位置
                    if (this.options.silent) {
                        designManager.tempConncetion.fixPosition();
                    }

                    // 记录位置
                    lastMouseCoords = curCoords;
                },

                dragEnded: function(){
                    designManager.enableConns();
                    // 存在被删除未记录的连接
                    if (lastRemovedConn) {
                        // 需要记录到操作历史
                        recordManager.register({
                            descript: "拖拽丢弃连接",
                            param: {
                                conn: lastRemovedConn,
                                manager: designManager,
                            },
                            undo: function () {
                                var param = this.param;
                                param.conn.disable = false;
                                param.manager.addConnection(param.conn);
                            },
                            redo: function () {
                                var param = this.param;
                                param.manager.removeConnection(param.conn);
                            }
                        });
                        // 移除记录
                        lastRemovedConn = null;
                    }
                    connOptrType = "none";
                },

                options: { silent: ZYDesign.Config.draggingSilent }


            });
            evt.stopPropagation();
        }

        /**
            处理连接对象鼠标进入事件
            @evt 事件参数
            @connection 连接对象
        */
        $scope.handleConnectionMouseEnter = function (evt, connection) {
            // 覆盖
            if (connection.hover instanceof Function) {
                connection.hover();
            }
        }

        /**
            处理连接对象鼠标离开事件
            @evt 事件参数
            @connection 连接对象
        */
        $scope.handleConnectionMouseLeave = function (evt, connection) {
            // 取消覆盖
            if (connection.unhover instanceof Function) {
                connection.unhover();
            }
            evt.stopPropagation();
        }

        /**
            处理缩放图标点击事件
            @evt 事件参数
            @node 节点对象
        */
        $scope.handleExpansionClick = function (evt, node) {
            var changeText = designManager.chartZoomRate > 0.6
            // 切花节点缩放
            node.toggleExpansion(changeText);
            // 标记已发生改变
            designManager.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "打开关闭节点",
                param: {
                    node: node,
                    changeText:changeText,
                },
                undo: function () {
                    var param = this.param;
                    param.node.toggleExpansion(param.changeText);
                },
                redo: function () {
                    var param = this.param;
                    param.node.toggleExpansion(param.changeText);
                }
            })
        }

        /**
            处理缩放图标禁用双击事件
            @evt 事件参数
        */
        $scope.handleExpansionClickDisable = function (evt) {
            evt.stopPropagation();
        }

        /**
            处理节点双击事件
            @node 节点
        */
        $scope.handleNodeDbClick = function (node) {
            //var result = node.validate();
            //双击题目节点打开批量输入框
            designManager.optionBatchAddManager.open();
            //hinter.hint("node status:" + node.getEngageStatus());
        }

        /**
            处理矩阵纵选项鼠标落下事件
            @node 节点
        */
        $scope.handleOptionXMouseDown = function (node) {
            node.rowHiding = true;
        }

        /**
            处理矩阵横选项鼠标落下事件
            @node 节点
        */
        $scope.handleOptionYMouseDown = function (node) {
            node.rowHiding = false;
        }
    }
]);