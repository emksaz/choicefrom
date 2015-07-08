/// <reference path="../../jquery.validate.vq.js" />
/**
***填空题模板数据模型基类文件
***作成日期            2014/7/18
*/
(function () {
    var Class = ZYDesign.Class;
    // 填空题模板数据模型类 继承自模板基类
    Class.FillblankNode = (function () {
        /**
          填空题模板数据模型类
          ****继承自模板基类
        */
        function FillblankNode() {
            if (!(this instanceof FillblankNode)) {
                return;
            }
            Class.SubjectNode.call(this);
            // 背景颜色
            this.backgroundColor = "#d47d00";
            // 宽度
            this.width = 200;
            // 高度
            this.height = 88
            // 验证方式 来自节点表第一个附加字段
            this.validateType = 1;
            // 验证起点 来自节点表第二个附加字段
            this.validateStart = 0;
            // 验证终点 来自节点表第三个附加字段
            this.validateEnd = 30;
            // 验证出错时的提示信息 来自节点表第十个附加字段
            this.errorMsg = "";
        }

        // 继承模板基类
        Class.inheritPrototype(Class.SubjectNode, FillblankNode);

        // 节点类型
        FillblankNode.prototype.type = ZYDesign.Enum.NODETYPE.FILL;
        // 节点类型
        FillblankNode.prototype.typeInt = 4;
        // 分类类型
        FillblankNode.prototype.categoryType = 3;
        // 类型列表字段
        FillblankNode.prototype.typeListKey = "fillblankNodes";
        // 是否有附加操作
        FillblankNode.prototype.addition = true;
        // 类型名
        FillblankNode.prototype.typeName = "填空题";
        // 类型图标
        FillblankNode.prototype.typeIcon = "ic_the_blanks";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)(zy)
        FillblankNode.prototype.optionConstructor = ZYDesign.Class.FillOptionConnector;

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        FillblankNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            FillblankNode.base.init.call(this, nodeData, x, y);
            // 验证方式 来自节点表第一个附加字段
            this.validateType = this.originData.extField_1 || 1;
            // 验证起点 来自节点表第二个附加字段
            this.validateStart = this.originData.extField_2 || 0;
            // 验证终点 来自节点表第三个附加字段
            this.validateEnd = this.originData.extField_3 || 30;
            // 验证出错时的提示信息 来自节点表第十个附加字段
            this.errorMsg = this.originData.extField_10 || "";
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        FillblankNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            FillblankNode.base.exportJson.call(this, questionairId, jsonHolder);
            // 额外属性1:验证方式
            jsonHolder.extField_1 = this.validateType;
            // 额外属性2:验证起点
            jsonHolder.extField_2 = this.validateStart;
            // 额外属性3:验证终点
            jsonHolder.extField_3 = this.validateEnd;
            // 额外属性10:验证出错时的提示信息
            jsonHolder.extField_10 = this.errorMsg;
        }

        /**
            生成当前节点的一个数据副本并返回
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        FillblankNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            FillblankNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 复制高级设置(zy)
            jsonHolder.extField_1 = this.validateType;
            jsonHolder.extField_2 = this.validateStart;
            jsonHolder.extField_3 = this.validateEnd;
            jsonHolder.extField_10 = this.errorMsg;
            jsonHolder.answerRequired = this.answerRequired ? "Y" : "N";
            // 添加函数名
            jsonHolder.addFnKey = "addFillblankNode";
        }

        /**
            提取题型说明文字
            子类节点需重写该方法
        */
        FillblankNode.prototype.extractTypeText = function () {
            return "填空题";
        }

        /**
            检查检验范围是否合法
        */
        FillblankNode.prototype.isValidateRangeLegal = function () {
            if (this.validateType > 3) {
                return true;
            }
            var min = parseInt(this.validateStart),
                max = parseInt(this.validateEnd);
            if (isNaN(min + max)) {
                return false
            }
            if (min < 0 || max < 0) {
                return false;
            }
            if (min > max) {
                return false;
            }
            return true;
        }

        /**
            特殊检验
            @result 存储检查结果的对象
        */
        FillblankNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            FillblankNode.base.validate.call(this, result);
            // 父类中已检查出错误
            if (!result.isValid) {
                return result;
            }
            // 检查限定范围
            if (!this.isValidateRangeLegal()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidValidateRangeError;
                return result;
            }
            // 选项数检查
            if (this.options.length < 1) {
                result.isValid = false;
                result.message = Prompt.QSNRD_OptionNotExist;
                return result;
            }
            return result;
        }

        return FillblankNode;
    })();
})();
