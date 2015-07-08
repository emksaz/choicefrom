/**
***循环节点类
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class;
    // 循环节点类 继承自工具节点类
    Class.LoopNode = (function () {
        /**
          循环节点类
        */
        function LoopNode() {
            if (!(this instanceof LoopNode)) {
                return;
            }
            // 继承自工具节点类
            Class.ToolNode.call(this);
            // 循环开始点
            this.loopStart = new ZYDesign.Class.LoopStartConnector(this);
            // 循环输出点
            this.loopEnd = new ZYDesign.Class.LoopEndConnector(this);
            // 背景色
            this.backgroundColor = "#6b5eaa";
            // 自身循环变量
            this.loopVariables = [];
            // 选项(自身循环变量的别名)
            this.options = this.loopVariables;
        }

        // 继承自工具节点类
        Class.inheritPrototype(Class.ToolNode, LoopNode);

        // 循环开始文字位置X坐标
        LoopNode.prototype.loopStartTextX = 15;
        // 循环开始文字位置Y坐标
        LoopNode.prototype.loopStartTextY = 66 + 13;
        // 循环开始圆圈位置X坐标
        LoopNode.prototype.loopStartCircleX = 0;
        // 循环开始圆圈位置Y坐标
        LoopNode.prototype.loopStartCircleY = 61 + 13;
        // 循环结束文字位置X坐标
        LoopNode.prototype.loopEndTextX = 138;
        // 循环结束文字位置Y坐标
        LoopNode.prototype.loopEndTextY = 66 + 13;
        // 循环结束圆圈位置X坐标
        LoopNode.prototype.loopEndCircleX = 150;
        // 循环结束圆圈位置Y坐标
        LoopNode.prototype.loopEndCircleY = 61 + 13;
        // 节点类型
        LoopNode.prototype.type = ZYDesign.Enum.NODETYPE.LOOP;
        // 节点类型整数
        LoopNode.prototype.typeInt = 8;
        // 分类类型
        LoopNode.prototype.categoryType = 2;
        // 类型列表字段
        LoopNode.prototype.typeListKey = "loopNodes";
        // 类型名
        LoopNode.prototype.typeName = "循环节点";
        // 类型图标
        LoopNode.prototype.typeIcon = "ic_loop";

        /**
            生成循环变量
            @variables 原始变量合集
        */
        LoopNode.prototype.createVariable = function () {
            if (this.originData.variables) {
                // 将原始数据的变量推入到自己的变量中
                // 此处用循环推入的方法而不直接赋值,是不行改变本身变量对象的内存地址,保持和别名公用一个地址.
                for (var i = 0; i < this.originData.variables.length; i++) {
                    this.loopVariables.push(this.originData.variables[i]);
                }
            }
        }

        LoopNode.prototype.addOption = function (option) {
            this.addVariable(option.text, option.number);
        }

        /**
             移除一个选项
             @index 欲移除选项的索引
           */
        LoopNode.prototype.removeOption = function (option) {
            var index = option.index;
            // 移除该选项
            this.options.splice(index, 1);
            this.maintainHeight();
            // 更新该选项之后的所有选项的位置
            for (var i = index; i < this.options.length; i++) {
                var option = this.options[i]
                // 更新索引
                option.index -= 1;
            }
            // 维护节点尺寸
            this.fixNodeSize(true);
            return option;
        }

        /**
            添加循环变量
            @variable 要添加的变量
        */
        LoopNode.prototype.addVariable = function (text, number) {
            var variable = {
                originText: text || "",
                number: number || this.loopVariables.length + 1,
                outputId: ZYDesign.UuidUtil.generate(),
                index: this.loopVariables.length,
            }
            this.loopVariables.push(variable);
        }

        /**
            移除循环变量
            @variable 要移除的变量
        */
        LoopNode.prototype.removeVariable = function (variable) {
            // 循环列表
            for (var i = 0; i < this.loopVariables.length; i++) {
                // 找到该项位置并删除
                if (this.loopVariables[i] == variable) {
                    this.loopVariables.splice(i, 1);
                }
            }
        }

        /**
            获取来源循环变量列表
        */
        LoopNode.prototype.getSourceVariables = function () {
            // 初始化来源多选题节点
            var sourceNodeMultiSelect = null;
            // 来源端口列表
            var sources = this.input.sources;
            for (var i = 0; i < sources.length; i++) {
                var source = sources[i];
                // 来源端口所属节点是多选题
                if (source.parent.type == ZYDesign.Enum.NODETYPE.SELECT &&
                    source.parent.multipleSelect) {
                    sourceNodeMultiSelect = source;
                    break;
                }
            }
            // 没有找到多选题来源
            if (!sourceNodeMultiSelect) {
                return [];
            }
            // 初始化变量列表
            var variables = [];
            // 来源选项
            var options = sourceNodeMultiSelect.parent.options;
            // 循环来源选项
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                // 从每个选项中提取变量
                var variableText = option.extractVariable();
                // 变量
                if (variableText) {
                    var opt = {
                        originText: variableText,
                        number: option.number,
                        outputId: option.outputId,
                        index: option.index
                    }
                    variables.push(option);
                }
            }
            return variables;
        }

        /**
            收集循环圈节点
        */
        LoopNode.prototype.collectLoopNodes = function () {
            // 初始化结果
            var result = {
                from: this,
                dead: false,
                tempList: [],
                nodeList: [],
                roundDone: function (node) {
                    // 已走到头
                    if (node == this.from) {
                        return true;
                    }
                    for (var i = 0; i < this.nodeList.length; i++) {
                        // 已走到之前通路中的某个节点
                        if (this.nodeList[i] == node) {
                            return true;
                        }
                    }
                    return false;
                }
            };
            // 源头
            var sources = this.loopEnd.sources;
            // 开始搜索
            this.searchNodesInLoopCircle(sources, result);
            // 返回结果列表
            return result.nodeList;
        }


        /**
            搜索循环圈中的节点
            @sources 
        */
        LoopNode.prototype.searchNodesInLoopCircle = function (sources, result) {
            // 循环源头
            for (var i = 0; i < sources.length; i++) {
                // 一个源头的节点
                var node = sources[i].parent;
                // 已经成功走完一圈
                if (result.roundDone(node)) {
                    // 将临时列表中的节点加入到有效列表中
                    result.nodeList = result.nodeList.concat(result.tempList);
                    // 清空临时列表
                    result.tempList = [];
                    // 还没走到死路
                    result.dead = false;
                    continue;
                }

                // 推到临时列表
                result.tempList.push(node);

                // 该节点还有源头
                if (node.input.sources.length > 0) {
                    // 递归往下找
                    this.searchNodesInLoopCircle(node.input.sources, result);
                    // 这个源头已经是死路了
                    if (result.dead) {
                        // 这里的循环还没走到最后一条
                        if (i != sources.length - 1) {
                            // 该条路可能还有其他生路
                            result.dead = false;
                            // 已循环到最后
                        } else {
                            // 那这条路真死了
                            result.dead = true;
                            // 将这个节点从临时列表中移除
                            result.tempList.splice(result.tempList.length - 1, 1);
                        }
                    }
                    // 已经没有源头
                } else {
                    // 将这个节点从临时列表中移除
                    result.tempList.splice(result.tempList.length - 1, 1);
                    // 告诉上层这条路已经死掉了
                    result.dead = true;
                }
            }
        }

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
         */
        LoopNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            LoopNode.base.init.call(this, nodeData, x, y);
            // 生成循环开始点
            this.initLoopStart();
            // 生成循环结束点
            this.initLoopEnd();
            // 生成循环变量
            this.createVariable();
        }

        /**
            生成循环开始点
        */
        LoopNode.prototype.initLoopStart = function () {
            // 连接点名字
            this.loopStart.text = "循环开始";
            if (this.originData.loopStart.uuid) {
                this.loopStart.outputId = this.originData.loopStart.uuid;
            }
        };

        /**
            生成循环结束点
        */
        LoopNode.prototype.initLoopEnd = function () {
            // 连接点名字
            this.loopEnd.text = "循环结束";
            // 连接点ID
            if (this.originData.loopEnd.uuid) {
                this.loopEnd.inputId = this.originData.loopEnd.uuid;
            }
        };

        /**
            根据ID搜索连接点
            @connectorId 连接点ID
        */
        LoopNode.prototype.searchConnectorById = function (connectorId) {
            // 输出点
            if (this.output.outputId == connectorId) {
                return this.output;
            }
            // 输入点
            if (this.input.inputId == connectorId) {
                return this.input;
            }
            // 循环开始点
            if (this.loopStart.outputId == connectorId) {
                return this.loopStart;
            }
            // 循环结束点
            if (this.loopEnd.inputId == connectorId) {
                return this.loopEnd;
            }
            return false;
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        LoopNode.prototype.exportJson = function (questionairId, jsonHolder) {

            // 调用父类同名方法
            LoopNode.base.exportJson.call(this, questionairId, jsonHolder);

            // 来源节点ID
            var sourceId = "";
            for (var i = 0; i < this.input.sources.length; i++) {
                var source = this.input.sources[i];
                // 来源端口所属节点是多选题
                if (source.parent.type == ZYDesign.Enum.NODETYPE.SELECT &&
                    source.parent.multipleSelect) {
                    // 来源节点ID
                    sourceId = source.parent.nodeUuid;
                    break;
                }
            }
            // 所属一层循环节点ID
            jsonHolder.circleNode1Id = this.getCircleNode1Id();
            // 所属二层循环节点ID
            jsonHolder.circleNode2Id = this.getCircleNode2Id();
            // 循环结束
            jsonHolder.loopEnd = {
                index: -3,
                uuid: this.loopEnd.inputId,
            };
            // 循环开始
            jsonHolder.loopStart = {
                index: -4,
                uuid: this.loopStart.outputId,
            };
            // 选项列表
            jsonHolder.options = this.collectOptions();
            // 变量列表
            jsonHolder.variables = this.loopVariables;
            // 来源变量节点ID
            jsonHolder.extField_1 = sourceId;
        }

        /**
            收集选项信息
        */
        LoopNode.prototype.collectOptions = function () {
            var options = [];
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                options.push({
                    text: option.originText,
                    number: option.number,
                    uuid: option.outputId,
                    index: option.index,
                    nodeType: this.typeInt,
                    typeFlag: 0,
                })
            }
            return options;
        }

        /**
            复制节点信息
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        LoopNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            LoopNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 添加函数名
            jsonHolder.addFnKey = "addLoopNode";
            // 循环开始
            jsonHolder.loopStart = {
                text: "循环开始",
            };
            // 循环结束
            jsonHolder.loopEnd = {
                text: "循环结束",
            };
        }

        /**
            节点合法性检查,特殊属性检查
            子类节点有特殊检查需求时重写该方法
            @result 存储检查结果的对象
        */
        LoopNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            LoopNode.base.validate.call(this, result);
            // 父类中已检查出错误
            if (!result.isValid) {
                return result;
            }
            // 没有循环圈
            if (this.collectLoopNodes().length == 0) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoLoopCircle; // Prompt.QSNRD_InvalidNoLoopCircle
                return result;
            }
            // 没有循环变量
            if (this.loopVariables.length == 0 &&
                this.getSourceVariables().length == 0) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoLoopVariable; // Prompt.QSNRD_InvalidNoLoopVariable
                return result;
            }
            // 不满足源变量独立性
            if (!this.isUniqueSourceVariable()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidOnlyMultiToLoop; // Prompt.QSNRD_InvalidOnlyMultiToLoop
                return result;
            }
            //循环圈超过两层
            if (this.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP &&
                this.getEngageDueToNode().getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidLoopMoreThanTwoFloor; // Prompt.QSNRD_InvalidLoopMoreThanTwoFloor
                return result;
            }
            // 变量检查
            var options = [];
            options = options.concat(this.options);
            options = options.concat(this.getSourceVariables());
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                // 变量没有完成输入
                if (!option.number || !option.originText) {
                    result.isValid = false;
                    result.message = Prompt.QSNRD_InvalidIncompleteVariable; // Prompt.QSNRD_InvalidIncompleteVariable
                    return result;
                }
                // 变量存在冲突
                for (var j = i + 1; j < options.length; j++) {
                    var opt = options[j];
                    if (opt.number == option.number ||
                        opt.originText == option.originText) {
                        result.isValid = false;
                        result.message = Prompt.QSNRD_InvalidVariableConflict; // Prompt.QSNRD_InvalidVariableConflict
                        return result;
                    }
                }
            }
            return result;
        }

        /**
            检查是否满足源变量来源独立性
        */
        LoopNode.prototype.isUniqueSourceVariable = function () {
            // 输入数不超过1
            if (this.input.sources.length <= 1) {
                return true
                // 输入数超过1且能拿到源变量
            } else if (this.getSourceVariables().length > 0) {
                return false;
            }
            return true;
        }

        /**
            是否包含关键字
            @keyword 关键字
        */
        LoopNode.prototype.hasKeyword = function (keyword) {
            // 先调用父类同名方法进行检查
            if (LoopNode.base.hasKeyword.call(this, keyword)) {
                return true;
            }

            // 变量中查找
            for (var i = 0; i < this.loopVariables.length; i++) {
                var variable = this.loopVariables[i];
                if (variable.originText.indexOf(keyword) > -1) {
                    return true;
                }
            }
            return false;
        }


        /**
            获得后续节点
            搜索成功后会返回一个对象包含两个属性,
            第一个是后续节点列表,第二个是需要继续往下搜索的节点列表
        */
        LoopNode.prototype.searchNextNodesByOrder = function () {

            var seedList = [],
                node = this.loopStart.dest.parent,     // 循环圈带头节点
                results = [node],           // 该节点作为为第一个后续节点
                seeds = [node],            // 该节点作为为往后搜索的第一个种子节点
                start = 0,                  // 需要搜索的种子范围开始索引
                end = seeds.length;        // 需要搜索的种子范围结束索引
            do {
                // 循环当前的种子列表,往后搜
                for (var j = start; j < end; j++) {
                    var seed = seeds[j];
                    var result = seed.searchNextNodesByOrder();
                    // 将结果加入总结果列表
                    for (var k = 0; k < result.resultList.length; k++) {
                        var rs = result.resultList[k];
                        // 总结果列表中没有该节点
                        if (results.indexOf(rs) < 0) {
                            results.push(rs);
                        }
                    }
                    // 将种子加入到种子列表中
                    for (var k = 0; k < result.seedList.length; k++) {
                        var sd = result.seedList[k];
                        // 种子列表中不包含该种子
                        if (seeds.indexOf(sd) < 0) {
                            seeds.push(sd);
                        }
                    }
                }
                // 更新要搜索的种子范围
                start = end;
                end = seeds.length;
            } while (end > start)

            // 然后查看总输出目标节点
            var outputDest = this.output.dest;
            if (outputDest && outputDest.exactType != ZYDesign.Enum.CONNEXACTTYPE.LOOPEND) {
                var nextNode = outputDest.parent;
                results.push(nextNode);
                seedList.push(nextNode);
            }
            return {
                resultList: results,
                seedList: seedList
            }
        }

        return LoopNode;
    })();
})();


