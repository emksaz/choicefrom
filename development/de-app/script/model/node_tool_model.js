/**
***工具节点类
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class;
    // 工具节点类 继承自节点基类
    Class.ToolNode = (function () {
        /**
          工具节点类
        */
        function ToolNode() {
            if (!(this instanceof ToolNode)) {
                return;
            }
            // 继承自节点基类
            Class.NodeBase.call(this);
            // 节点大小
            this.width = 150;
            this.height = 108;
            // 分割线
            this.line = new ZYDesign.Class.LineModel(this, 0);
            // 总输入点数据
            this.input = new ZYDesign.Class.InputConnector(this);
            // 总输出点数据
            this.output = new ZYDesign.Class.OutputConnector(this);
        }

        // 继承自节点基类
        Class.inheritPrototype(Class.NodeBase, ToolNode);

        // 配置宽度与节点实际宽度差
        //ToolNode.prototype.differWidth = 5;
        // 配置高度与节点实际高度差
        //ToolNode.prototype.differHeight = 18;
        // 输入点文字X坐标
        ToolNode.prototype.inputTextX = 15;
        // 输入点文字Y坐标
        ToolNode.prototype.inputTextY = 26 + 13;
        // 输入点圆圈X坐标
        ToolNode.prototype.inputCircleX = 0;
        // 输入点圆圈Y坐标
        ToolNode.prototype.inputCircleY = 21 + 13;
        // 输出点文字X坐标
        ToolNode.prototype.outputTextX = 138;
        // 输出点文字Y坐标
        ToolNode.prototype.outputTextY = 26 + 13;
        // 输出点圆圈X坐标
        ToolNode.prototype.outputCircleX = 150;
        // 输出点圆圈Y坐标
        ToolNode.prototype.outputCircleY = 21 + 13;
        // 分割线起点X坐标
        ToolNode.prototype.lineX1 = 0;
        // 分割线起点Y坐标
        ToolNode.prototype.lineY1 = 42 + 15;
        // 分割线终点X坐标
        ToolNode.prototype.lineX2 = 150;
        // 分割线终点Y坐标
        ToolNode.prototype.lineY2 = 42 + 15;
        // 节点类型
        ToolNode.prototype.type = ZYDesign.Enum.NODETYPE.TOOL;
        // 分类类型
        ToolNode.prototype.categoryType = 2;
        // 节点通用类型
        ToolNode.prototype.commonType = ZYDesign.Enum.NODECOMMONTYPE.TOOL
        // 复制不可用
        ToolNode.prototype.copyDisabled = true;
        // 预览不可用
        ToolNode.prototype.previewDisabled = true;
        // 批量输入不可用
        ToolNode.prototype.optionbatchDisabled = true;
        // 是否禁用媒体
        ToolNode.prototype.mediaDisable = true;
        // 是否允许编辑节点名
        ToolNode.prototype.nodeNameEditable = false;
        /**
            获取警告标志变换信息
        */
        ToolNode.prototype.getWarnIconTrasform = function () {
            return "translate(130, -20)";
        }

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        ToolNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            ToolNode.base.init.call(this, nodeData, x, y);
            // 生成输入点
            this.initInput();
            // 生成输出点
            this.initOutput();
        }

        /**
            生成总输入点
        */
        ToolNode.prototype.initInput = function () {
            // 父节点
            this.input.parent = this;
            // 连接点名字
            this.input.text = "输入";
            // 连接点ID
            if (this.originData.input.uuid) {
                this.input.inputId = this.originData.input.uuid;
            }
        };

        /**
            生成总输出点
        */
        ToolNode.prototype.initOutput = function () {
            // 连接点名字
            this.output.text = "输出";
            // 连接点ID
            if (this.originData.output.uuid) {
                this.output.outputId = this.originData.output.uuid;
            }
        };

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        ToolNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            ToolNode.base.exportJson.call(this, questionairId, jsonHolder);
            // 输入口
            jsonHolder.input = {
                index: -2,
                uuid: this.input.inputId,
            };
            // 输出口
            jsonHolder.output = {
                index: -1,
                uuid: this.output.outputId,
            };
            // 输出列表
            jsonHolder.destList = this.collectDestList();
        }

        /**
            是否包含关键字
            @keyword 关键字
        */
        ToolNode.prototype.hasKeyword = function (keyword) {
            // 先调用父类同名方法进行检查
            if (ToolNode.base.hasKeyword.call(this, keyword)) {
                return true;
            }
            return false;
        }

        /**
            生成当前节点的一个数据副本并返回
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        ToolNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            // 先调用父类同名方法复制基本信息
            ToolNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 输出口
            jsonHolder.input = {
                text: "输入",
            };
            // 输出口
            jsonHolder.output = {
                text: "输出",
            };
        }
        return ToolNode;
    })();
})();

