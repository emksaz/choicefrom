/**
***开始节点模板文件
***作成日期            2014/7/18
*/
(function () {
    var Class = ZYDesign.Class;
    // 开始节点类 继承自节点基础类
    Class.StartNode = (function () {
        /**
          开始节点类
        */
        function StartNode() {
            if (!(this instanceof StartNode)) {
                return;
            }
            // 继承自节点基础类
            Class.NodeBase.call(this);
            // 模式
            this.mode = 3;
            // 输出口
            this.output = new ZYDesign.Class.OutputConnector(this);
            // 问题描述
            this.question = new ZYDesign.Class.QuestionModel(this);
            // 背景色
            this.backgroundColor = "#3498db";
            // 宽度
            this.width = 150;
            // 高度
            this.height = 64;
        }

        // 继承自节点基础类
        Class.inheritPrototype(Class.NodeBase, StartNode);

        // 输出点圆圈位置X坐标
        StartNode.prototype.outputCircleX = 150.5;
        // 输出点圆圈位置Y坐标
        StartNode.prototype.outputCircleY = 26;
        // 输出点文字X坐标
        StartNode.prototype.outputTextX = 138.5;
        // 输出点文字Y坐标
        StartNode.prototype.outputTextY = 31;
        // 节点类型
        StartNode.prototype.type = ZYDesign.Enum.NODETYPE.START;
        // 节点通用类型
        StartNode.prototype.commonType = ZYDesign.Enum.NODECOMMONTYPE.TERMINAL;
        // 节点类型整数
        StartNode.prototype.typeInt = 6;
        // 配置高度与节点实际高度差
        StartNode.prototype.differHeight = 0;
        // 分类类型
        StartNode.prototype.categoryType = 2;
        // 类型列表字段
        StartNode.prototype.typeListKey = "startNodes";
        // 复制可用性
        StartNode.prototype.copyDisabled = true;
        // 删除可用性
        StartNode.prototype.removeDisabled = true;
        // 预览不可用
        StartNode.prototype.previewDisabled = true;
        // 批量输入不可用
        StartNode.prototype.optionbatchDisabled = true;
        // 类型名
        StartNode.prototype.typeName = "开始节点";
        // 类型名
        StartNode.prototype.typeIcon = "";
        // 节点名长度限制
        StartNode.prototype.nameLengthLimit = 100;
        // 节点名编辑上部显示的文字
        StartNode.prototype.nameText = "问卷标题";
        // 节点描述编辑上部显示的文字
        StartNode.prototype.describeText = "问卷描述";
        /**
            获取警告标志变换信息
        */
        StartNode.prototype.getWarnIconTrasform = function () {
            return "translate(130, -20)";
        }

        /**
            获取小背景X坐标
        */
        StartNode.prototype.getSmallBgX = function () {
            return 2;
        }

        /**
            获取小背景Y坐标
        */
        StartNode.prototype.getSmallBgY = function () {
            return 2;
        }

        /**
            获取小背景宽度
        */
        StartNode.prototype.getSmallBgWidth = function () {
            return 75;
        }

        /**
            获取小背景高度
        */
        StartNode.prototype.getSmallBgHeight = function () {
            return 46;
        }

        /**
            获取小背景文字X坐标
        */
        StartNode.prototype.getSmallBgTxtX = function () {
            return 16;
        }

        /**
            获取小背景文字Y坐标
        */
        StartNode.prototype.getSmallBgTxtY = function () {
            return 33;
        }

        /**
            获取小背景文字
        */
        StartNode.prototype.getSmallBgTxt = function () {
            return "Start";
        }

        /**
                生成输出口
            */
        StartNode.prototype.initOutput = function () {
            // 输出口ID
            if (this.originData.output &&
                this.originData.output.uuid) {
                this.output.outputId = this.originData.output.uuid;
            }
        }

        /**
            生成输出口
        */
        StartNode.prototype.initInput = function () {
            // 标记父元素
            this.input.parent = this;
            // 输入口ID
            if (this.originData.input &&
                this.originData.input.uuid) {
                this.input.inputId = this.originData.input.uuid;
            }
        }


        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        StartNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            StartNode.base.init.call(this, nodeData, x, y);
            // 生成输出口
            this.initOutput();
            this.initQuestion();
        }

        /**
            生成问题
        */
        StartNode.prototype.initQuestion = function () {
            var data = this.originData;
            // 问题原始文字
            this.question.originText = data.questionText || "";
            this.question.videoUrl = data.questionVideoUrl || "";
        };

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        StartNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            StartNode.base.exportJson.call(this, questionairId, jsonHolder);
            // 问题描述
            jsonHolder.questionText = this.question.originText;
            jsonHolder.questionVideoUrl = this.question.videoUrl;
            // 输出口
            jsonHolder.output = {
                index: -1,
                uuid: this.output.outputId,
            };
            // 使用原始的数据
            jsonHolder.destList = this.collectDestList();

        }

        /**
            根据ID搜索连接点
            @connectorId 连接点ID
        */
        StartNode.prototype.searchConnectorById = function (connectorId) {
            // 输出点
            if (this.output.outputId == connectorId) {
                return this.output;
            }
            return false;
        }

        /**
            复制节点数据
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        StartNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            StartNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 输出
            jsonHolder.output = {
                text: "输出",
            };
            // 添加函数名
            jsonHolder.addFnKey = "addStartNode";
        }

        /**
           获取控制按钮区域位置偏移量
        */
        StartNode.prototype.getCtrIconTransform = function () {
            var transform = "translate(-2," + (this.getBackgroundHeight()) + ")";
            return transform;
        }

        /**
            获取节点的当前状态
            有一下几种状态:
            free:自由状态,孤立状态
            normal:已经在正常通路中,开始节点,结束节点,甄别节点永远是该状态
            random:已经被随机组占用
            loop:已经被循环圈占用
        */
        StartNode.prototype.getEngagement = function () {
            return {
                status: ZYDesign.Enum.NODESTATE.NORMAL,
                dueToNode: null
            }
        }

        /**
            特殊检查
        */
        StartNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            StartNode.base.validate.call(this, result);
            // 父类中已检查出错误
            if (!result.isValid) {
                return result;
            }
            // 开始节点直接输出到结束节点
            if (this.output.dest &&
                this.output.dest.parent.type == ZYDesign.Enum.NODETYPE.END) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidStartToEnd // Prompt.QSNRD_InvalidStartToEnd
                return result;
            }
            
            // 检查是否包含正式题
            var hasSubject = false,
                nodes = ZYDesign.DesignManager.mixNodes;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                // 找到了正式题
                if (node.mode == 0 && node.isSubject()) {
                    hasSubject = true;
                    break;
                }
            }
            // 没能找到题目
            if (!hasSubject) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoSubject;
                return result;
            }
            return result;
        }

        /**
            获得后续节点
            搜索成功后会返回一个对象包含两个属性,
            第一个是后续节点列表,第二个是需要继续往下搜索的节点列表
        */
        StartNode.prototype.searchNextNodesByOrder = function () {

            var resultList = [],
                seedList = [],
                outputDest = this.output.dest;
            // 查看总输出目标节点
            if (outputDest) {
                var nextNode = outputDest.parent;
                resultList.push(nextNode);
                seedList.push(nextNode);
            }
            return {
                resultList: resultList,
                seedList: seedList
            }
        }

        return StartNode;
    })();
})();
