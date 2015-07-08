/**
***结束节点类
***作成日期            2014/7/18
*/
(function () {
    var Class = ZYDesign.Class;
    // 结束节点类
    Class.EndNode = (function () {
        /**
          结束节点类
        */
        function EndNode() {
            if (!(this instanceof EndNode)) {
                return;
            }
            // 继承自节点基类
            Class.NodeBase.call(this);
            // 模式
            this.mode = 3;
            // 输入口
            this.input = new ZYDesign.Class.InputConnector(this);
            // 问题描述
            this.question = new ZYDesign.Class.QuestionModel(this);
            //  背景颜色
            this.backgroundColor = "#d44637";
            // 宽度
            this.width = 150;
            // 高度
            this.height = 64;
            // 完成时的跳转地址
            this.linkUrl = "";
        }

        // 继承自节点基类
        Class.inheritPrototype(Class.NodeBase, EndNode);

        // 输入点圆圈位置X坐标
        EndNode.prototype.inputCircleX = 0;
        // 输入点圆圈位置Y坐标
        EndNode.prototype.inputCircleY = 26;
        // 输入点文字X坐标
        EndNode.prototype.inputTextX = 14;
        // 输入点文字Y坐标
        EndNode.prototype.inputTextY = 31;
        // 节点类型
        EndNode.prototype.type = ZYDesign.Enum.NODETYPE.END;
        // 节点通用类型
        EndNode.prototype.commonType = ZYDesign.Enum.NODECOMMONTYPE.TERMINAL;
        // 节点类型整数
        EndNode.prototype.typeInt = 10;
        // 分类类型
        EndNode.prototype.categoryType = 2;
        // 类型列表字段
        EndNode.prototype.typeListKey = "endNodes";
        // 配置高度与节点实际高度差
        EndNode.prototype.differHeight = 0;
        // 预览不可用
        EndNode.prototype.previewDisabled = true;
        // 批量输入不可用
        EndNode.prototype.optionbatchDisabled = true;
        // 类型名
        EndNode.prototype.typeName = "结束节点";
        // 类型图标
        EndNode.prototype.typeIcon = "";
        // 是否允许编辑节点名
        EndNode.prototype.nodeNameEditable = false;
        // 节点描述编辑上部显示的文字
        EndNode.prototype.describeText = "结束描述";

        /**
            获取警告标志变换信息
        */
        EndNode.prototype.getWarnIconTrasform = function () {
            return "translate(130, -20)";
        }

        /**
            获取小背景X坐标
        */
        EndNode.prototype.getSmallBgX = function () {
            return 73;
        }

        /**
            获取小背景Y坐标
        */
        EndNode.prototype.getSmallBgY = function () {
            return 2;
        }

        /**
            获取小背景宽度
        */
        EndNode.prototype.getSmallBgWidth = function () {
            return 75;
        }

        /**
            获取小背景高度
        */
        EndNode.prototype.getSmallBgHeight = function () {
            return 46;
        }

        /**
            获取小背景文字X坐标
        */
        EndNode.prototype.getSmallBgTxtX = function () {
            return 93;
        }

        /**
            获取小背景文字Y坐标
        */
        EndNode.prototype.getSmallBgTxtY = function () {
            return 33;
        }

        /**
            获取小背景文字
        */
        EndNode.prototype.getSmallBgTxt = function () {
            return "End";
        }

        /**
            获取控制按钮区域位置偏移量
        */
        EndNode.prototype.getCtrIconTransform = function () {
            var transform = "translate(-2," + (this.getBackgroundHeight()) + ")";
            return transform;
        }

        /**
            生成输出口
        */
        EndNode.prototype.initInput = function () {
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
        EndNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            EndNode.base.init.call(this, nodeData, x, y);
            // 生成输出口
            this.initInput();
            this.initQuestion();
            this.linkUrl = nodeData.linkUrl || "";
        }

        /**
            生成问题
        */
        EndNode.prototype.initQuestion = function () {
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
        EndNode.prototype.exportJson = function (questionairId, jsonHolder) {

            // 调用父类同名方法
            EndNode.base.exportJson.call(this, questionairId, jsonHolder);
            // 问题描述
            jsonHolder.questionText = this.question.originText;
            jsonHolder.questionVideoUrl = this.question.videoUrl;
            // 输入口信息
            jsonHolder.input = {
                index: -2,
                uuid: this.input.inputId,
            };
            jsonHolder.linkUrl = this.linkUrl;
        }

        /**
            根据ID搜索连接点
            @connectorId 连接点ID
        */
        EndNode.prototype.searchConnectorById = function (connectorId) {
            // 输出点
            if (this.input.inputId == connectorId) {
                return this.input;
            }
            return false;
        }

        /**
            生成当前节点的一个数据副本并返回
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        EndNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            EndNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 输入口
            jsonHolder.input = {
                text: "输入",
            };
            // 添加函数名
            jsonHolder.addFnKey = "addEndNode";
            // 问题描述
            jsonHolder.questionText = this.question.originText;
            jsonHolder.questionVideoUrl = this.question.videoUrl;
            jsonHolder.linkUrl = this.linkUrl;
        }

        /**
           获取节点的当前状态
           有一下几种状态:
           free:自由状态,孤立状态
           normal:已经在正常通路中,开始节点,结束节点,甄别节点永远是该状态
           random:已经被随机组占用
           loop:已经被循环圈占用
        */
        EndNode.prototype.getEngagement = function () {
            return {
                status: ZYDesign.Enum.NODESTATE.NORMAL,
                dueToNode: null
            }
        }

        /**
        是否有不通的输入口
        */
        EndNode.prototype.hasDeadInput = function () {
            if (this.input.sources.length == 0) {
                return true;
            }
            return false;
        }

        /**
           是否包含不通的输出口
        */
        EndNode.prototype.hasDeadOutput = function () {
            return false;
        }

        /**
            特殊检查
            @result 用来储存结果的对象
        */
        EndNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            EndNode.base.validate.call(this, result);
            // 父类中已检查出错误
            if (!result.isValid) {
                return result;
            }
            // 开始节点直接输出到结束节点
            if (!this.question.originText) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoQuestionText // Prompt.QSNRD_InvalidNoQuestionText
                return result;
            }
            return result;
        }

        /**
            节点信息中是否含有关键字
            子类中有特殊处理需复写该方法
        */
        EndNode.prototype.hasKeyword = function (keyword) {
            // 先调用父类同名名方法进行检查
            if (EndNode.base.hasKeyword.call(this, keyword)) {
                return true;
            }
            // 问题描述中查找
            if (this.question.originText.indexOf(keyword) > -1) {
                return true;
            }
            return false;
        }
        return EndNode;
    })();
})();
