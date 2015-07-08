/**
***排序题模板数据模型基类文件
***作成日期            2014/7/18
*/
(function () {
    var Class = ZYDesign.Class;
    // 排序题模板数据模型类 继承自题目基类
    Class.SequencingNode = (function () {
        /**
          排序题模板数据模型类
          ****继承自题目基类
        */
        function SequencingNode() {
            if ((!this instanceof SequencingNode)) {
                return;
            }
            // 继承题目基类
            Class.SubjectNode.call(this);
            // 节点高度
            this.width = 200;
            // 节点宽度
            this.height = 88;
            // 背景颜色
            this.backgroundColor = "#26aaa0";
        }

        // 继承自题目基类
        Class.inheritPrototype(Class.SubjectNode, SequencingNode);

        // 节点类型
        SequencingNode.prototype.type = ZYDesign.Enum.NODETYPE.SEQUENCE;
        // 节点类型整数
        SequencingNode.prototype.typeInt = 3;
        // 分类类型
        SequencingNode.prototype.categoryType = 3;
        // 类型列表字段
        SequencingNode.prototype.typeListKey = "sequencingNodes";
        // 是否有附加操作
        SequencingNode.prototype.addition = true;
        // 输出文字是否可变化
        SequencingNode.prototype.outputTextChangable = true;
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        SequencingNode.prototype.optionConstructor = ZYDesign.Class.SequenceOptionConnector;
        // 类型名
        SequencingNode.prototype.typeName = "排序题";
        // 类型名
        SequencingNode.prototype.typeIcon = "ic_sorting";

        /**
            提取题型说明文字
            子类节点需重写该方法
        */
        SequencingNode.prototype.extractTypeText = function () {
            return "排序题";
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        SequencingNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            SequencingNode.base.initOption.call(this, opt, option);
            // 是否排序目标 来自选项表第一个附加字段
            option.seqTarget = opt.extField_1 == "Y" ? true : false;
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        SequencingNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            SequencingNode.base.exportJson.call(this, questionairId, jsonHolder);
        }

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        SequencingNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 先调用父类同名方法
            SequencingNode.base.collectOption.call(this, option, optionJson);
            // 额外属性1:是否目标
            optionJson.extField_1 = option.seqTarget ? "Y" : "N";
        }

        /**
           生成当前节点的一个数据副本并返回
           @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        SequencingNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            SequencingNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY)
            // 添加函数名
            jsonHolder.addFnKey = "addSequencingNode";
        }

        /**
            改变排序目标
            @option 要改变排序目标的选项
        */
        SequencingNode.prototype.changeSeqTarget = function (option) {
            // 排序目标状态切换,如果是设为排序目标状态,则其他选项需要取消排序目标状态
            if (option.seqTarget = !option.seqTarget) {
                // 取消其他选项的目标状态
                for (var i = 0; i < this.options.length; i++) {
                    var opt = this.options[i];
                    if (opt != option) {
                        opt.seqTarget = false;
                    }
                }
            }


        }
        return SequencingNode;
    })();
})();
