/**
***选择题模板数据模型基类文件
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class;
    // 选择题模板数据模型类  继承自题目基类
    Class.SelectNode = (function () {
        /**
          选择题模板数据模型类
          ****继承自题目基类
        */
        function SelectNode() {
            if (!(this instanceof SelectNode)) {
                return;
            }
            Class.SubjectNode.call(this);
            // 节点宽度
            this.width = 200;
            // 节点高度
            this.height = 88;
            // 背景颜色
            this.backgroundColor = "#2980b9";
            // 多重选择
            this.multipleSelect = false;
            // 最多选择数
            this.multipleMax = 1;
            // 最少选择数
            this.multipleMin = 0;
            // 选项分割线
            this.lineT = new ZYDesign.Class.LineModel(this, 3);

            /******页面控制专用属性******/
            // 是否使用其他选项
            this.useOtherOption = false;
            // 其他选项
            this.otherOption = null;

            /******页面控制专用属性******/

        }

        // 继承自题目基类
        Class.inheritPrototype(Class.SubjectNode, SelectNode);

        // 节点类型
        SelectNode.prototype.type = ZYDesign.Enum.NODETYPE.SELECT;
        // 节点类型整数
        SelectNode.prototype.typeInt = 1;
        // 分类类型
        SelectNode.prototype.categoryType = 3;
        // 类型列表字段
        SelectNode.prototype.typeListKey = "selectNodes";
        // 是否有附加操作
        SelectNode.prototype.addition = true;
        // 输出文字是否可变化
        SelectNode.prototype.outputTextChangable = true;
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        SelectNode.prototype.optionConstructor = ZYDesign.Class.SelectOptionConnector;
        // 类型名
        SelectNode.prototype.typeName = "选择题";
        // 类型图标
        SelectNode.prototype.typeIcon = "ic_mc";

        /**
            获取切换其他选项图标处的文字
        */
        SelectNode.prototype.getOtherOptionIconText = function () {
            return this.useOtherOption ?
                "删除其他选项" :
                "添加其他选项";
        }

        /**
                是否单选
        */
        SelectNode.prototype.isSingleSelect = function () {
            return !this.multipleSelect;
        }

        /**
           获取是否是多选模式
        */
        SelectNode.prototype.isMultiSelect = function () {
            return this.multipleSelect;
        }

        /**
        提取题型说明文字
        子类节点需重写该方法
        */
        SelectNode.prototype.extractTypeText = function () {
            // 多选
            if (this.multipleSelect) {
                return "选择题(多选)"
                // 单选
            } else {
                return "选择题(单选)"
            }
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        SelectNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            SelectNode.base.initOption.call(this, opt, option);
            // 是否为其他类型 来自选项表第一个附加字段
            option.isOtherOption = opt.extField_1 == "Y" ? true : false;
            // 其他选项类型
            option.otherType = opt.extField_2 || 1;
            // 其他选项是否必填
            option.fillRequired = opt.extField_4 == "Y" ? true : false;
            // 其他选项验证方式
            option.validateType = opt.extField_5 || 1;
            // 其他选项验证起点
            option.validateStart = opt.extField_6 || 1;
            // 其他选项验证终点
            option.validateEnd = opt.extField_7 || 30;
            // 其他选项验证出错时的提示信息
            option.errorMsg = opt.extField_10 || "";
        }



        /**
            把做好的选项添加到选项列表中
            @option 选项
        */
        SelectNode.prototype.addOptionToList = function (option) {
            // 是其他选项
            if (option.isOtherOption) {
                // 直接加到末尾
                this.options.push(option);
                this.otherOption = option;
                this.useOtherOption = true;
            }
                // 普通选项
            else {
                // 插入位置记录者
                var insertIndex = -1;
                // 循环列表
                for (var i = 0; i < this.options.length; i++) {
                    var opt = this.options[i];
                    // 插入位置之后的选项索引递增
                    if (insertIndex >= 0 && i > insertIndex) {
                        opt.index += 1;
                    }
                    // 找到第一个其他选项
                    if (insertIndex == -1 && opt.isOtherOption) {
                        // 改变索引
                        option.index = i;
                        // 选项插入到第一个其他选项前面
                        this.options.splice(i, 0, option);
                        // 记录插入位置
                        insertIndex = i;
                    }
                }
                // 没有找到其他选项
                if (insertIndex == -1) {
                    // 直接加到末尾
                    this.options.push(option);
                }
            }

        }

        /**
            复制选项
            @options 选项数据
            @return 选项数据的复制品
        */
        SelectNode.prototype.cloneOptionsJson = function (jsonHolder) {
            var optionsCopy = [];
            for (var i = 0; i < this.options.length; i++) {
                var opt = this.options[i],
                    option = {};
                option.text = opt.originText;
                // 是否为其他类型 来自选项表第一个附加字段
                option.extField_1 = opt.isOtherOption ? "Y" : "N";
                // 其他选项类型
                option.extField_2 = opt.otherType;
                // 其他选项是否必填
                option.extField_4 = opt.fillRequired ? "Y" : "N";
                // 其他选项验证方式
                option.extField_5 = opt.validateType;
                // 其他选项验证起点
                option.extField_6 = opt.validateStart;
                // 其他选项验证终点
                option.extField_7 = opt.validateEnd;
                // 其他选项验证出错时的提示信息
                option.extField_10 = opt.errorMsg;
                optionsCopy.push(option);
            }
            jsonHolder.options = optionsCopy;
        }

        /**
            添加其他选项
        */
        SelectNode.prototype.addOtherOption = function () {
            this.useOtherOption = true;
            // 已经有其他选项
            if (this.hasOtherOption()) {
                return;
            }
            // 其他选项初始数据
            var opt = {
                text: "其他",
                extField_1: "Y",
                extField_2: 1,
                extField_4: "N",
                extField_5: 1,
                extField_6: 1,
                extField_7: 50,
                extField_10: "输入格式无效！",
            }
            // 添加其他选项
            this.addOption(opt);
            this.otherOption = this.options[this.options.length - 1];
            this.fixNodeSize();
            return this.otherOption;
        }

        /**
            移除其他选项
        */
        SelectNode.prototype.removeOtherOption = function () {
            // 末尾选项
            var last = this.options.length - 1,
                // 是否移除成功
                option = null;
            // 有其他选项
            if (this.hasOtherOption()) {
                // 移除
                option = this.removeOption(this.otherOption);
            }
            // 移除成功
            if (option) {
                // 标记不使用其他选项
                this.otherOption = null;
                this.useOtherOption = false;
                // 修复节点尺寸
                this.fixNodeSize();
            }
            return option;
        }

        /**
            获取本节点的普通选项
        */
        SelectNode.prototype.getNormalOptions = function () {
            // 初始化列表
            var normalOptions = [];
            // 循环搜索
            for (var i = 0; i < this.options.length; i++) {
                // 一个选项
                var option = this.options[i];
                // 是普通选项
                if (!option.isOtherOption) {
                    // 加入列表
                    normalOptions.push(option);
                }
            }
            return normalOptions;
        }

        /**
            获取本节点的其他选项
        */
        SelectNode.prototype.getOtherOption = function () {
            if (this.hasOtherOption()) {
                return this.options[this.options.length - 1];
            }
        }

        /**
            是否有其他选项
        */
        SelectNode.prototype.hasOtherOption = function () {
            var last = this.options[this.options.length - 1];
            return !!(last && last.isOtherOption);
        }

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        SelectNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            SelectNode.base.init.call(this, nodeData, x, y);
            // 是否多选 来自节点表第一个附加字段
            this.multipleSelect = this.originData.extField_1 == "Y" ? true : false;

            // 最少能选几项限制 来自节点表第二个附加字段
            this.multipleMin = this.originData.extField_2 || 1;
            // 最多要选几项限制 来自节点表第二个附加字段
            this.multipleMax = this.originData.extField_3 || 2;
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        SelectNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            SelectNode.base.exportJson.call(this, questionairId, jsonHolder);
            // 额外属性1:是否多选
            jsonHolder.extField_1 = this.multipleSelect ? "Y" : "N";
            // 额外属性2:最少选几个
            jsonHolder.extField_2 = parseInt(this.multipleMin);
            // 额外属性3:最多选几个
            jsonHolder.extField_3 = parseInt(this.multipleMax);
            // 额外属性4:最多选几个
            jsonHolder.extField_4 = this.useOtherOption ? "Y" : "N";
        }

        /**
            设置选项可用性
        */
        SelectNode.prototype.setOptionEnable = function () {
            if (this.isMultiSelect()) {
                $("#" + this.nodeUuid + " .chart_options circle").attr("style", "stroke: #34495e;fill: rgba(52, 73, 94, 0.49);");
            } else {
                $("#" + this.nodeUuid + " .chart_options circle").attr("style", "");
            }
        }

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        SelectNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            var hasVariable = option.extractVariable() ? "Y" : "N"
            // 先调用父类同名方法
            SelectNode.base.collectOption.call(this, option, optionJson);
            // 是否为其他类型 来自选项表第一个附加字段
            optionJson.extField_1 = option.isOtherOption ? "Y" : "N";
            // 其他选项类型
            optionJson.extField_2 = option.otherType;
            // 是否有变量
            optionJson.extField_3 = hasVariable;
            // 其他选项是否必填
            optionJson.extField_4 = option.fillRequired ? "Y" : "N";
            // 其他选项验证方式
            optionJson.extField_5 = option.validateType;
            // 其他选项验证起点
            optionJson.extField_6 = option.validateStart;
            // 其他选项验证终点
            optionJson.extField_7 = option.validateEnd;
            // 其他选项验证出错时的提示信息
            optionJson.extField_10 = option.errorMsg;
        }

        /**
            生成当前节点的一个数据副本并返回
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        SelectNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            SelectNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 复制高级设置（zy）
            jsonHolder.extField_1 = this.multipleSelect ? "Y" : "N";
            jsonHolder.extField_2 = this.multipleMin;
            jsonHolder.extField_3 = this.multipleMax;
            // 添加函数名
            jsonHolder.addFnKey = "addSelectNode";
        }

        /**
            检查多选参数合法性
        */
        SelectNode.prototype.isMultipleLegal = function () {
            if (!this.multipleSelect) {
                return true;
            }
            var min = parseInt(this.multipleMin),
                max = parseInt(this.multipleMax);
            if (isNaN(min + max)) {
                return false
            }
            if (min < 0 || max < 0 || max > this.options.length) {
                return false;
            }
            if (min > max) {
                return false;
            }
            return true;
        }

        /**
            检查其他选项限定范围合法性
        */
        SelectNode.prototype.isOtherTypeLegal = function () {
            if (!this.otherOption || this.otherOption.validateType > 3) {
                return true;
            }
            var min = parseInt(this.otherOption.validateStart),
                max = parseInt(this.otherOption.validateEnd);
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
        SelectNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            SelectNode.base.validate.call(this, result);
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

            // 其他选项限定检查
            if (!this.isOtherTypeLegal()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidValidateRangeError;
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

        /**
            切换其他选项
        */
        SelectNode.prototype.toggleOtherOption = function () {
            var rs = {
                type: "add",
                option: null,
            };
            // 添加其他选项
            if (!this.useOtherOption) {
                rs.option = this.addOtherOption();
                rs.type = "add";
                // 移除其他选项
            } else {
                rs.type = "remove"
                rs.option = this.removeOtherOption();
            }
            return rs;
        }

        /**
            移除一定范围内的选项
            @start 开始索引
            @end 结束索引
        */
        SelectNode.prototype.removeOptionInRange = function (start, end) {
            if (start < 0 || end >= this.options.length || start > end) {
                return;
            }
            // 删除之前是否包含其他选项
            var otherFormer = this.hasOtherOption();
            // 调用父类同名方法删除选项
            var opts = SelectNode.base.removeOptionInRange.call(this, start, end);
            // 删除之后是否包含选项
            var otherLater = this.hasOtherOption();
            // 删除前后不一致,表示其他选项被删除了
            if (otherFormer != otherLater) {
                // 标记不使用其他选项
                this.otherOption = null;
                this.useOtherOption = false;
            }
            return opts;
        }

        return SelectNode;
    })();
})();

