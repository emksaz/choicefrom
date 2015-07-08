/**
***甄别节点类
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class;

    // 甄别节点类 继承自节点基类
    Class.CheckNode = (function () {
        /**
          甄别节点类
        */
        function CheckNode() {
            if (!(this instanceof CheckNode)) {
                return;
            }
            // 继承自节点基类
            Class.NodeBase.call(this);
            // 模式
            this.mode = 3;
            // 输出口
            this.output = new ZYDesign.Class.OutputConnector(this);
            // 背景颜色
            this.backgroundColor = "#97D700";
            // 宽度
            this.width = 150;
            // 高度
            this.height = 64;
        }

        // 继承自节点基类
        Class.inheritPrototype(Class.NodeBase, CheckNode);

        // 输出点圆圈位置X坐标
        CheckNode.prototype.outputCircleX = 150.5;
        // 输出点圆圈位置X坐标
        CheckNode.prototype.outputCircleY = 26;
        // 输出点文字X坐标
        CheckNode.prototype.outputTextX = 138.5;
        // 输出点文字Y坐标
        CheckNode.prototype.outputTextY = 31;
        // 节点类型
        CheckNode.prototype.type = ZYDesign.Enum.NODETYPE.CHECK;
        // 节点通用类型
        CheckNode.prototype.commonType = ZYDesign.Enum.NODECOMMONTYPE.TERMINAL;
        // 接单类型
        CheckNode.prototype.typeInt = 9;
        // 分类类型
        CheckNode.prototype.categoryType = 2;
        // 类型列表字段
        CheckNode.prototype.typeListKey = "checkNodes";
        // 复制不可用
        CheckNode.prototype.copyDisabled = true;
        // 删除不可用
        CheckNode.prototype.removeDisabled = true;
        // 预览不可用
        CheckNode.prototype.previewDisabled = true;
        // 批量输入不可用
        CheckNode.prototype.optionbatchDisabled = true;
        // 是否禁用媒体
        CheckNode.prototype.mediaDisable = true;
        // 是否允许编辑节点名
        CheckNode.prototype.nodeNameEditable = false;

        /**
            获取警告标志变换信息
        */
        CheckNode.prototype.getWarnIconTrasform = function () {
            return "translate(130, -20)";
        }

        /**
            获取小背景X坐标
        */
        CheckNode.prototype.getSmallBgX = function () {
            return 2;
        }

        /**
            获取小背景Y坐标
        */
        CheckNode.prototype.getSmallBgY = function () {
            return 2;
        }

        /**
            获取小背景宽度
        */
        CheckNode.prototype.getSmallBgWidth = function () {
            return 75;
        }

        /**
            获取小背景高度
        */
        CheckNode.prototype.getSmallBgHeight = function () {
            return 46;
        }

        /**
            获取小背景文字X坐标
        */
        CheckNode.prototype.getSmallBgTxtX = function () {
            return 10;
        }

        /**
            获取小背景文字Y坐标
        */
        CheckNode.prototype.getSmallBgTxtY = function () {
            return 33;
        }

        /**
            获取小背景文字
        */
        CheckNode.prototype.getSmallBgTxt = function () {
            return "Check";
        }

        /**
                生成输出口
            */
        CheckNode.prototype.initOutput = function () {
            // 输出ID
            if (this.originData.output &&
                this.originData.output.uuid) {
                this.output.outputId = this.originData.output.uuid;
            }
        }

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        CheckNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            CheckNode.base.init.call(this, nodeData, x, y);
            // 生成输出口
            this.initOutput();
        }



        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        CheckNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            CheckNode.base.exportJson.call(this, questionairId, jsonHolder);
            // 甄别节点的mode总是为0
            jsonHolder.mode = 0;
            jsonHolder.commonMode = 0;
            // 甄别节点有输出口
            jsonHolder.output = {
                index: -1,
                uuid: this.output.outputId,
            }
            // 输出列表
            jsonHolder.destList = this.collectDestList();
        }

        /**
            根据ID搜索连接点
            @connectorId 连接点ID
        */
        CheckNode.prototype.searchConnectorById = function (connectorId) {
            // 输出点
            if (this.output.outputId == connectorId) {
                return this.output;
            }
            return false;
        }

        /**
            生成当前节点的一个数据副本并返回
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        CheckNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            // 先调用父类同名方法复制基本信息
            CheckNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 输出口
            jsonHolder.output = {
                text: "输出",
            };
            // 添加函数名
            jsonHolder.addFnKey = "addCheckNode";

        }

        /**
           获取控制按钮区域位置偏移量
        */
        CheckNode.prototype.getCtrIconTransform = function () {
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
        CheckNode.prototype.getEngagement = function () {
            return {
                status: ZYDesign.Enum.NODESTATE.NORMAL,
                dueToNode: null
            }
        }

        /**
        是否有不通的输入口
        */
        CheckNode.prototype.hasDeadInput = function () {
            return false;
        }

        /**
            是否包含不通的输出口
        */
        CheckNode.prototype.hasDeadOutput = function () {
            if (!this.output.dest) {
                return true;
            }
            return false;
        }
        return CheckNode;
    })();
})();

