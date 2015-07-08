/**
***图片选择题模板数据模型基类文件
***作成日期            2015/5/19
*/

(function () {
    var Class = ZYDesign.Class,
        Enum = ZYDesign.Enum,
        SelectNode = Class.SelectNode;
    // 图片选择题类,注册到类集合里
    Class.SelectPicNode = (function () {
        /**
            图片选择题模板数据模型类
            ****继承自题目基类
        */
        function SelectPicNode() {
            if (!(this instanceof SelectPicNode)) {
                return;
            }

            Class.SubjectNode.call(this);

            // 节点宽度
            this.width = 200;
            // 节点高度
            this.height = 88;
            // 背景颜色
            this.backgroundColor = "#9D11EF";
            // 多重选择
            this.multipleSelect = false;
            // 最多选择数
            this.multipleMax = 1;
            // 最少选择数
            this.multipleMin = 0;
            // 图片列表类型 1:单行 2:瀑布流 3:网格
            this.listType = 2;
            // 图片边框类型 1:方形 2:圆角 3:圆形
            this.borderType = 1;

        }

        // 继承自题目基类
        Class.inheritPrototype(Class.SubjectNode, SelectPicNode);

        // 基类原型
        var Super = SelectPicNode.base;
        // 节点类型
        SelectPicNode.prototype.type = Enum.NODETYPE.SELECTPIC;
        // 节点类型整数
        SelectPicNode.prototype.typeInt = 23;
        // 分类类型
        SelectPicNode.prototype.categoryType = 3;
        // 输出文字是否可变化
        SelectPicNode.prototype.outputTextChangable = true;
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        SelectPicNode.prototype.optionConstructor = Class.SelectPicOptionConnector;
        // 类型名
        SelectPicNode.prototype.typeName = "图片选择题";
        // 类型图标
        SelectPicNode.prototype.typeIcon = "ic_mc";

        /**
                是否单选
        */
        SelectPicNode.prototype.isSingleSelect = function () {
            return !this.multipleSelect;
        }

        /**
           获取是否是多选模式
        */
        SelectPicNode.prototype.isMultiSelect = function () {
            return this.multipleSelect;
        }

        /**
        提取题型说明文字
        子类节点需重写该方法
        */
        SelectPicNode.prototype.extractTypeText = function () {
            // 多选
            if (this.multipleSelect) {
                return "图片选择题(多选)"
                // 单选
            } else {
                return "图片选择题(单选)"
            }
        }
        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        SelectPicNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            Super.initOption.call(this, opt, option);
            // 图片
            option.image = ZYDesign.DesignManager.imageUploadManager.getImageById(opt.imageId);
        }

        /**
            复制选项
            @options 选项数据
            @return 选项数据的复制品
        */
        SelectPicNode.prototype.cloneOptionsJson = function (jsonHolder) {
            var optionsCopy = [];
            for (var i = 0; i < this.options.length; i++) {
                var opt = this.options[i],
                    option = {};
                option.text = opt.originText;
                option.imageId = opt.image ? opt.image.id : "";
                optionsCopy.push(option);
            }
            jsonHolder.options = optionsCopy;
        }

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        SelectPicNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            Super.init.call(this, nodeData, x, y);
            // 是否多选 来自节点表第一个附加字段
            this.multipleSelect = this.originData.extField_1 == "Y" ? true : false;

            // 最少能选几项限制 来自节点表第二个附加字段
            this.multipleMin = this.originData.extField_2 || 1;
            // 最多要选几项限制 来自节点表第三个附加字段
            this.multipleMax = this.originData.extField_3 || 2;
            // 列表类型 来自节点表第四个附加字段
            this.listType = this.originData.extField_4 || 2;
            // 边框类型 来自节点第五个附加字段
            this.borderType = this.originData.extField_5 || 1;
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        SelectPicNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            Super.exportJson.call(this, questionairId, jsonHolder);
            // 额外属性1:是否多选
            jsonHolder.extField_1 = this.multipleSelect ? "Y" : "N";
            // 额外属性2:最少选几个
            jsonHolder.extField_2 = parseInt(this.multipleMin);
            // 额外属性3:最多选几个
            jsonHolder.extField_3 = parseInt(this.multipleMax);
            // 额外属性4:列表类型
            jsonHolder.extField_4 = this.listType;
            // 额外属性5:边框类型
            jsonHolder.extField_5 = this.borderType;
        }

        /**
            设置选项可用性
        */
        SelectPicNode.prototype.setOptionEnable = function () {
            // 借用选择题类同名方法
            SelectNode.prototype.setOptionEnable.call(this);
        }


        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        SelectPicNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            var hasVariable = option.extractVariable() ? "Y" : "N";
            // 先调用父类同名方法
            SelectPicNode.base.collectOption.call(this, option, optionJson);
            // 图片id
            optionJson.imageId = option.image ? option.image.id : "";
            // 服务器图片名
            optionJson.imageName = option.image ? option.image.serverFileName : "";
            // 上传时的文件名
            optionJson.imageOriginName = option.image ? option.image.fileName : "";
            // 是否有变量
            optionJson.extField_3 = hasVariable;

        }

        /**
            生成当前节点的一个数据副本并返回
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        SelectPicNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            // 调用父类同名方法
            Super.cloneNodeJson.call(this, jsonHolder, diffX, diffY);

            jsonHolder.extField_1 = this.multipleSelect ? "Y" : "N";
            jsonHolder.extField_2 = this.multipleMin;
            jsonHolder.extField_3 = this.multipleMax;
            jsonHolder.extField_4 = this.listType;
            jsonHolder.extField_5 = this.borderType;
            // 添加函数名
            jsonHolder.addFnKey = "addSelectPicNode";
        }

        /**
            检查多选参数合法性
        */
        SelectPicNode.prototype.isMultipleLegal = function () {
            // 借用选择题类同名方法
            return SelectNode.prototype.isMultipleLegal(this);
        }

        /**
            判断某个列表类型是否不可用
        */
        SelectPicNode.prototype.isDisabledListType = function (type) {
            return this.isConflictType(type, this.borderType);
        }

        /**
            判断某个边框类型是否不可用
        */
        SelectPicNode.prototype.isDisabledBorderType = function (type) {
            return this.isConflictType(this.listType, type);
        }

        /**
            判断列表类型和边框类型是否冲突
            @listType 列表类型
            @borderType 边框类型
        */
        SelectPicNode.prototype.isConflictType = function (listType, borderType) {
            // 单行和圆形不兼容
            if (listType == 1 && (borderType == 3 || borderType == 2)) {
                return true;
            }
            // 瀑布流和圆形,圆角不兼容
            if (listType == 2 &&
                (borderType == 2 || borderType == 3)) {
                return true;
            }
            return false;
        }

        /**
            特殊检验
            @result 存储检查结果的对象
        */
        SelectPicNode.prototype.validate = function (result) {
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
            // 多选限定检查
            if (!this.isMultipleLegal()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidMultiRangeError;
                return result;
            }

            // 选项数检查
            if (this.options.length < 2) {
                result.isValid = false;
                result.message = Prompt.QSNRD_OptionNotBelowTwo;
                return result;
            }

            // 检查选项(zy)
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                // 检查选项编号和选项描述和选项图片
                if (!option.number.toString() || !option.originText || !option.image) {
                    result.isValid = false;
                    result.message = Prompt.QSNRD_InvalidIncompleteOption; // Prompt.QSNRD_InvalidIncompleteOption
                    return result;
                }
                // 检查编号和描述冲突
                for (var j = i + 1; j < this.options.length; j++) {
                    var opt = this.options[j];
                    if (opt.number == option.number ||
                        opt.originText == option.originText ||
                        opt.image == option.image) {
                        result.isValid = false;
                        result.message = Prompt.QSNRD_InvalidConflictOption; // Prompt.QSNRD_InvalidConflictOption
                        return result;
                    }
                }
            }
            return result;
        }

        return SelectPicNode;

    })()

})();