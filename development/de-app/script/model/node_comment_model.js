/**
***注释节点类
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class;
    // 注释节点类 继承自可选择类
    Class.CommentNode = (function () {
        /**
          注释节点类
        */
        function CommentNode() {
            if (!(this instanceof CommentNode)) {
                return;
            }
            // 继承自可选择类
            Class.NodeBase.call(this);
            // 节点宽度
            this.width = 200;
            // 节点高度
            this.height = 80;
            // 分割线
            this.line = new ZYDesign.Class.LineModel(this, 0);
            // 背景颜色
            this.backgroundColor = "#f1c40f"
            // 注释内容
            this.commentText = "注释";
            // 分割文字行列表
            this.commentTexts = [];
        }

        // 继承自节点基类
        Class.inheritPrototype(Class.NodeBase, CommentNode);

        // 配置宽度与节点实际宽度差
        //CommentNode.prototype.differWidth = 5;
        // 配置高度与节点实际高度差
        //CommentNode.prototype.differHeight = 18;
        // 分割线起点X坐标
        CommentNode.prototype.lineX1 = 0;
        // 分割线起点Y坐标
        CommentNode.prototype.lineY1 = 30;
        // 分割线终点X坐标
        CommentNode.prototype.lineX2 = 200;
        // 分割线终点Y坐标
        CommentNode.prototype.lineY2 = 30;
        // 文字行Y位置
        CommentNode.prototype.lineBaseY = 45;
        // 文字行高度
        CommentNode.prototype.lineHeight = 20;
        // 类型列表字段
        CommentNode.prototype.typeListKey = "commentNodes";
        // 节点类型
        CommentNode.prototype.type = ZYDesign.Enum.NODETYPE.COMMENT;
        // 节点整数类型
        CommentNode.prototype.typeInt = 11;
        // 分类类型
        CommentNode.prototype.categoryType = 1
        // 类型名
        CommentNode.prototype.typeName = "备注节点";
        // 类型图标
        CommentNode.prototype.typeIcon = "";
        // 是否禁用媒体
        CommentNode.prototype.mediaDisable = true;
        // 是否允许编辑节点名
        CommentNode.prototype.nodeNameEditable = false;

        /**
            更新文字
        */
        CommentNode.prototype.updateTexts = function () {
            var count = this.commentTexts.length;
            // 文字没有变化
            if (this.commentText == this.updateTexts.formerText) {
                // 返回原来的文字行列表
                return this.commentTexts
            }
            // 记录文字
            this.updateTexts.formerText = this.commentText;
            // 初始化文字行列表
            this.commentTexts = ZYDesign.TextUtil.divideStringByWidth(160, originText, 13);
            // 高度变化
            this.height = 55 + this.commentTexts.length * this.lineHeight;
            if (count != this.commentTexts.length) {
                var nodeElement = $("#" + this.nodeUuid);
                // 修复背景尺寸
                nodeElement.find(".background_size").attr({
                    width: this.getBackgroundWidth(),
                    height: this.getBackgroundHeight()
                });
            }
            return this.commentTexts;
        }

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        CommentNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            CommentNode.base.init.call(this, nodeData, x, y);
            this.commentText = nodeData.commentText;
            this.updateTexts();
        }
        /**
           获取节点背景宽度
        */
        CommentNode.prototype.getBackgroundHeight = function () {
            return this.getHeight()- 14;
        }

        /**
           获取节点的当前状态
           有一下几种状态:
           free:自由状态,孤立状态
           normal:已经在正常通路中,开始节点,结束节点,甄别节点永远是该状态
           random:已经被随机组占用
           loop:已经被循环圈占用
        */
        CommentNode.prototype.getEngagement = function () {
            return {
                status: ZYDesign.Enum.NODESTATE.FREE,
                dueToNode: null
            }
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        CommentNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            CommentNode.base.exportJson.call(this, questionairId, jsonHolder);
            jsonHolder.commentText = this.commentText;
        }

        /**
            校验
        */
        CommentNode.prototype.validate = function () {
            return {
                isValid: true,
                message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
            };
        }

        /**
            节点信息中是否含有关键字
            子类中有特殊处理需复写该方法
        */
        CommentNode.prototype.hasKeyword = function (keyword) {
            // 先调用父类同名名方法进行检查
            if (CommentNode.base.hasKeyword.call(this, keyword)) {
                return true;
            }
            // 检查注释内容
            if (this.commentText.indexOf(keyword) > -1) {
                return true;
            }
            return false;

        }
        return CommentNode;
    })();
})();

