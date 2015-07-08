/**
***逻辑节点类
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class;
    // 逻辑节点类 继承自工具节点类
    Class.LogicNode = (function () {
        /**
            逻辑节点类
        */
        function LogicNode() {
            if (!(this instanceof LogicNode)) {
                return;
            }
            // 继承自工具节点类
            Class.ToolNode.call(this);
            // 选项数据
            this.options = [];
            // 背景色
            this.backgroundColor = "#5e84aa";
        }

        // 继承自工具节点类
        Class.inheritPrototype(Class.ToolNode, LogicNode);

        // 选项文字基准位置X坐标
        LogicNode.prototype.optionTextXBase = 138;
        // 选项文字基准位置Y坐标
        LogicNode.prototype.optionTextYBase = 82;
        // 选项圆圈基准位置X坐标
        LogicNode.prototype.optionCircleXBase = 150;
        // 选项圆圈基准位置Y坐标
        LogicNode.prototype.optionCircleYBase = 77;
        // 选项行高
        LogicNode.prototype.optionLineHeight = 30;
        // 节点类型
        LogicNode.prototype.type = ZYDesign.Enum.NODETYPE.LOGIC;
        // 节点类型整数
        LogicNode.prototype.typeInt = 7;
        // 分类类型
        LogicNode.prototype.categoryType = 2;
        // 类型列表字段
        LogicNode.prototype.typeListKey = "logicNodes";
        // 类型名
        LogicNode.prototype.typeName = "逻辑节点";
        // 类型图标
        LogicNode.prototype.typeIcon = "ic_logic";

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        LogicNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            LogicNode.base.init.call(this, nodeData, x, y);
            // 生成选项
            this.initOptions();
        }

        /**
            维持选项
        */
        LogicNode.prototype.maintainOption = function () {
            for (var i = 0; i < this.options.length; i++) {
                this.options[i].index = i;
            }
        }

        /**
            获取本节点之前的题目节点
        */
        LogicNode.prototype.getFormerSubjectList = function () {
            // 初始化结果列表
            var subjectList = [];
            this.searchFormerSubject(subjectList, this);
            return subjectList;
        }

        /**
            搜寻某个节点之前的题目节点
            @subjectList 搜寻到的节点加入该列表
            @node 该节点
        */
        LogicNode.prototype.searchFormerSubject = function (subjectList, node) {
            // 输入口
            var input = node.input;
            // 从输入口的源头开始搜索
            for (var i = 0; i < input.sources.length; i++) {
                // 一个源头
                var source = input.sources[i];
                // 该源头所在的节点
                var formerNode = source.parent;
                // 走到了终端节点
                if (formerNode.commonType == ZYDesign.Enum.NODECOMMONTYPE.TERMINAL) {
                    // 跳过
                    continue;
                }
                // 该节点是题目节点
                if (formerNode.commonType == ZYDesign.Enum.NODECOMMONTYPE.SUBJECT) {
                    // 将该节点加入到结果列表中
                    subjectList.push(formerNode);
                }
                // 从该节点继续往前搜索
                this.searchFormerSubject(subjectList, formerNode);
            }
        }

        /**
          添加一条选项
          @opt 选项内容
        */
        LogicNode.prototype.addOption = function (opt) {
            // 初始化选项
            var option = new ZYDesign.Class.LogicConnector(this);
            // 选项名称
            option.originText = opt.text || ("逻辑" + (this.options.length + 1));
            // 条件数据列表
            var requires = opt.requires;
            // 没有条件
            if (!requires || requires.length == 0) {
                // 默认提供一个条件
                requires = [
                    {
                        arithmetic: 0,
                        limitType: 0,
                        answerFirst: "答案一",
                        answerSecond: "答案二"
                    }
                ]
            }
            option.initRequires(requires)
            // 选项ID
            option.outputId = opt.uuid ? opt.uuid : ZYDesign.UuidUtil.generate();
            // 索引
            option.index = (opt.index || opt.index == 0) ? opt.index : this.options.length;

            // 添加到选项列表
            this.options.push(option);
            // 维护节点尺寸
            this.maintainHeight();
            return option;
        }

        /**
            维护节点高度
            @range 变化范围
        */
        LogicNode.prototype.maintainHeight = function () {
            this.height = 78 + (this.options.length * 30);
        }

        /**
             移除一个选项
             @index 欲移除选项的索引
           */
        LogicNode.prototype.removeOption = function (option) {
            var index = option.index;
            // 移除该选项
            this.options.splice(index, 1);
            this.maintainHeight();
            // 更新该选项之后的所有选项的位置
            for (var i = index; i < this.options.length; i++) {
                var option = this.options[i];
                // 更新索引
                option.index -= 1;
            }
            // 维护节点尺寸
            this.fixNodeSize(true);
            return option;
        }

        /**
          生成选项
        */
        LogicNode.prototype.initOptions = function () {

            var options = this.originData.logics;

            if (!options) {
                return;
            }

            // 循环添加选项
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                // 添加选项
                this.addOption(option);
            }
        }

        /**
            是否包含关键字
            @keyword 关键字
        */
        LogicNode.prototype.hasKeyword = function (keyword) {
            // 先调用父类同名方法进行检查
            if (LogicNode.base.hasKeyword.call(this, keyword)) {
                return true;
            }
            // 逻辑中查找
            for (var i = 0; i < this.options.length; i++) {
                var logic = this.options[i];
                if (logic.originText.indexOf(keyword) > -1) {
                    return true;
                }
            }
            return false;
        }

        /**
            根据ID搜索连接点
            @connectorId 连接点ID
        */
        LogicNode.prototype.searchConnectorById = function (connectorId) {
            // 输出点
            if (this.output.outputId == connectorId) {
                return this.output;
            }
            // 输入点
            if (this.input.inputId == connectorId) {
                return this.input;
            }
            // 选项
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                if (option.outputId == connectorId) {
                    return option;
                }
            }
            return false;
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        LogicNode.prototype.exportJson = function (questionairId, jsonHolder) {

            // 调用父类同名方法
            LogicNode.base.exportJson.call(this, questionairId, jsonHolder);
            // 逻辑列表
            jsonHolder.logics = this.collectOptions();
        }

        /**
            收集选项Json信息
         */
        LogicNode.prototype.collectOptions = function () {
            if (!this.options || this.options.length == 0) {
                return null;
            }
            var optionsJson = [];
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                var optionJson = {
                    nodeType: this.typeInt,
                    number: option.number,
                    index: option.index,
                    text: option.originText,
                    uuid: option.outputId,
                    requires: option.collectRequires(),
                };
                optionsJson.push(optionJson);
            }
            return optionsJson;
        }

        /**
            复制节点信息
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        LogicNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            LogicNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 添加函数名
            jsonHolder.addFnKey = "addLogicNode";
        }

        /**
        节点合法性检查,特殊属性检查
        子类节点有特殊检查需求时重写该方法
        @result 存储检查结果的对象
        */
        LogicNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            LogicNode.base.validate.call(this, result);
            // 父类中已检查出错误
            if (!result.isValid) {
                return result;
            }
            // 存在重复输出
            if (this.hasRepeatedDest()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidOutputRepeat; // Prompt.QSNRD_InvalidOutputRepeat
                return result;
            }

            // 总输出和选项输出重复
            if (this.isAllOptionOutputed() &&
                this.isMasterOutputed()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidOutputConflict; // Prompt.QSNRD_InvalidOutputConflict
                return result;
            }

            // 没有可关联的题目
            if (this.getFormerSubjectList().length == 0) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoSubjectToRelate // Prompt.QSNRD_InvalidNoSubjectToRelate
                return result;
            }
            return result;
        }

        /**
            获得后续节点
            搜索成功后会返回一个对象包含两个属性,
            第一个是后续节点列表,第二个是需要继续往下搜索的节点列表
        */
        LogicNode.prototype.searchNextNodesByOrder = function () {

            var resultList = [],
                seedList = [],
                options = this.options,
                outputDest = this.output.dest;
            // 查看总输出目标节点
            if (outputDest) {
                var nextNode = outputDest.parent;
                resultList.push(nextNode);
                seedList.push(nextNode);
            }

            // 查看选项输出目标节点
            for (var i = 0; i < options.length; i++) {
                var option = options[i],
                    optionDest = option.dest;
                // 有目标
                if (optionDest) {
                    var nextNode = optionDest.parent;
                    resultList.push(nextNode);
                    seedList.push(nextNode);
                }
            }
            return {
                resultList: resultList,
                seedList: seedList
            }
        }

        return LogicNode;
    })();
})();


