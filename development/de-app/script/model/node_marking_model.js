/**
***打分题模板数据模型基类文件
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class,
        hinter = ZYDesign.Hinter;
    // 打分题模板数据模型类 继承自模板基类
    Class.MarkingNode = (function () {
        /**
          打分题模板数据模型类
          ****继承自模板基类
        */
        function MarkingNode() {
            if (!(this instanceof MarkingNode)) {
                return;
            }
            // 继承模板基类
            Class.SubjectNode.call(this);
            // 宽度
            this.width = 200;
            // 高度
            this.height = 88;
            // 背景颜色
            this.backgroundColor = "#9153aa";
            // 打分方式
            this.markType = 2;
            // 是否显示分值
            this.showMarkValue = false;
            // 是否显示坐标描述
            this.showMarkValueDescribe = false;
            // 默认分值
            this.defaultMark = 5;
            // 最高分
            this.markMax = 10;
            // 最低分
            this.markMin = 0;
            // 低分描述
            this.minText = "";
            // 中分描述
            this.midText = "";
            // 高分描述
            this.maxText = "";
            // 打分使用的图形编号
            this.markImgCode = 1;
            // 打分图形数
            this.markImgCount = 5;
            // 打分文字列表
            this.markTxtList = [];
        }

        // 继承模板基类
        Class.inheritPrototype(Class.SubjectNode, MarkingNode);
        var Super = MarkingNode.base;
        // 节点类型
        MarkingNode.prototype.type = ZYDesign.Enum.NODETYPE.MARK;
        // 节点类型整数
        MarkingNode.prototype.typeInt = 2;
        // 分类类型
        MarkingNode.prototype.categoryType = 3;
        // 类型列表字段
        MarkingNode.prototype.typeListKey = "markingNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        MarkingNode.prototype.optionConstructor = ZYDesign.Class.MarkOptionConnector;
        // 类型名
        MarkingNode.prototype.typeName = "打分题";
        // 类型图标
        MarkingNode.prototype.typeIcon = "";

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        MarkingNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            Super.exportJson.call(this, questionairId, jsonHolder);
            // 打分方式
            jsonHolder.extField_1 = this.markType;
            // 分值方式
            if (this.markType == 1) {
                jsonHolder.extField_2 = this.markMin;
                jsonHolder.extField_3 = this.markMax;
                jsonHolder.markValueDescribeFlag = this.showMarkValueDescribe;
                if (this.showMarkValueDescribe) {
                    jsonHolder.extField_4 = this.minText;
                    jsonHolder.extField_5 = this.midText;
                    jsonHolder.extField_6 = this.maxText;
                }
                jsonHolder.extField_7 = this.showMarkValue ? "Y" : "N";
                jsonHolder.extField_8 = this.defaultMark;
                // 图标方式
            } else if (this.markType == 2) {
                jsonHolder.extField_2 = this.markImgCode;
                jsonHolder.extField_3 = this.markImgCount;
                // 文字方式
            } else if (this.markType == 3) {
                // 收集
                for (var i = 0; i < this.markTxtList.length; i++) {
                    var item = this.markTxtList[i];
                    var key = "extField_" + (i + 2);
                    jsonHolder[key] = item.text;
                }
            }
        }

        /**
           初始化
           @nodeData 源数据
           @x 指定的X坐标,没有指定则使用nodeData中的值
           @x 指定的Y坐标,没有指定则使用nodeData中的值
       */
        MarkingNode.prototype.init = function (nodeData, x, y) {
            // 调用父类同名方法
            Super.init.call(this, nodeData, x, y);
            // 打分方式 来自节点表第一个附加字段
            this.markType = this.originData.extField_1 || 2;
            // 分值方式
            if (this.markType == 1) {
                // 最低分 来自节点表第二个附加字段
                this.markMin = this.originData.extField_2 || 0;
                // 最高分 来自节点表第三个附加字段
                this.markMax = this.originData.extField_3 || 10;
                // 低分描述 来自节点表第四个附加字段
                this.minText = this.originData.extField_4 || "";
                // 中分描述 来自节点表第五个附加字段
                this.midText = this.originData.extField_5 || "";
                // 高分描述 来自节点表第六个附加字段
                this.maxText = this.originData.extField_6 || "";
                // 是否显示分值 来自节点表第七个附加字段
                this.showMarkValue = this.originData.extField_7 == "Y" ? true : false;
                // 是否显示分值描述 
                this.showMarkValueDescribe = this.originData.markValueDescribeFlag;
                // 默认分值 来自节点表第八个字段
                this.defaultMark = this.originData.extField_8 || 5;
                // 图形方式
            } else if (this.markType == 2) {
                // 图标代号 来自节点表第二个附加字段
                this.markImgCode = this.originData.extField_2 || 1;
                // 图标数量 来自节点表第三个附加字段
                this.markImgCount = this.originData.extField_3 || 5;
                // 文字方式
            } else if (this.markType == 3) {
                // 导入文字描述列表
                for (var i = 2; i < 7; i++) {
                    var key = "extField_" + i;
                    var text = this.originData[key];
                    if (text) {
                        this.markTxtList.push({ text: text });
                    }
                }
            }


        }

        /**
            生成当前节点的一个数据副本并返回
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        MarkingNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            Super.cloneNodeJson.call(this, jsonHolder, diffX, diffY);

            // 打分方式
            jsonHolder.extField_1 = this.markType;
            // 分值方式
            if (this.markType == 1) {
                jsonHolder.extField_2 = this.markMin;
                jsonHolder.extField_3 = this.markMax;
                jsonHolder.extField_4 = this.minText;
                jsonHolder.extField_5 = this.midText;
                jsonHolder.extField_6 = this.maxText
                // 图标方式
            } else if (this.markType == 2) {
                jsonHolder.extField_2 = this.markImgCode;
                jsonHolder.extField_3 = this.markImgCount;
                // 文字方式
            } else if (this.markType == 3) {
                // 收集
                for (var i = 0; i < this.markTxtList.length; i++) {
                    var item = this.markTxtList[i];
                    var key = "extField_" + (i + 2);
                    jsonHolder[key] = item.text;
                }
            }
            // 添加函数名
            jsonHolder.addFnKey = "addMarkingNode";
        }

        /**
        提取题型说明文字
        子类节点需重写该方法
        */
        MarkingNode.prototype.extractTypeText = function () {
            return "打分题";
        }

        /**
            添加文字评价项
        */
        MarkingNode.prototype.addMarkItem = function () {
            if (this.markTxtList.length == 5) {
                hinter.hint(Prompt.QSNRD_MarkItemMoreThanFive)
                return;
            }
            this.markTxtList.push({ text: "" });
        }

        /**
            删除文字评价项
            @item 文字项
        */
        MarkingNode.prototype.removeMarkItem = function (item) {
            var index = this.markTxtList.indexOf(item);
            if (index >= 0) {
                this.markTxtList.splice(index, 1);
            }
        }

        /**
            检查
            @result 存储结果的对象
        */
        MarkingNode.prototype.validateMarkValue = function (result) {
            result = result || {};
            if (this.markType != 1) {
                return;
            }
            if (this.markMin >= this.markMax) {
                result.isValid = false;
                result.message = Prompt.QSNRD_WrongMarkValue;
                return;
            }

            if (this.defaultMark < this.markMin || this.defaultMark > this.markMax) {
                result.isValid = false;
                result.message = Prompt.QSNRD_DefaultMarkBeyond;
                return;
            }
        }


        /**
            文字评价设定是否合法
        */
        MarkingNode.prototype.validateMarkText = function (result) {
            result = result || {};
            if (this.markType != 3) {
                return;
            }

            // 评价文字数量检查
            if (this.markTxtList.length < 2 && this.markType == 3) {
                result.isValid = false;
                result.message = Prompt.QSNRD_MarkItemLowThanTwo;
                return;
            }

            // 输入检查
            var inputValid = true;
            for (var i = 0; i < this.markTxtList.length; i++) {
                var item_i = this.markTxtList[i];
                if (!item_i.text) {
                    inputValid = false;
                    break;
                }
                for (var j = i + 1; j < this.markTxtList.length; j++) {
                    var item_j = this.markTxtList[j];
                    if (item_i.text == item_j.text) {
                        inputValid = false;
                        break;
                    }
                }
                if (!inputValid) {
                    break;
                }
            }
            if (!inputValid) {
                result.isValid = false;
                result.message = Prompt.QSNRD_WrongMarkText;
            }
        }

        /**
            特殊检验
            @result 存储检查结果的对象
        */
        MarkingNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            Super.validate.call(this, result);
            // 父类中已检查出错误
            if (!result.isValid) {
                return result;
            }
            // 选项数检查
            if (this.options.length < 1) {
                result.isValid = false;
                result.message = Prompt.QSNRD_OptionNotExist;
                return result;
            }
            // 分值检查
            this.validateMarkValue(result);
            if (!result.isValid) {
                return result;
            }

            // 检查评价文字
            this.validateMarkText(result);
            if (!result.isValid) {
                return result;
            }

            // 检查选项(zy)
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                // 检查选项编号和选项描述
                if (!option.number.toString() || !option.originText) {
                    result.isValid = false;
                    result.message = Prompt.QSNRD_InvalidIncompleteOption; // Prompt.QSNRD_InvalidIncompleteOption
                    return result;
                }
                // 检查编号和描述冲突
                for (var j = i + 1; j < this.options.length; j++) {
                    var opt = this.options[j];
                    if (opt.number == option.number ||
                        opt.originText == option.originText) {
                        result.isValid = false;
                        result.message = Prompt.QSNRD_InvalidConflictOption; // Prompt.QSNRD_InvalidConflictOption
                        return result;
                    }
                }
            }
            return result;
        }
        return MarkingNode;
    })();
})();

