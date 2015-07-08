/**
***矩阵题模板数据模型基类文件
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class;
    // 矩阵题模板数据模型类 继承自模板基类
    Class.MatrixNode = (function () {
        /**
            矩阵题模板数据模型类
            ****继承自模板基类
        */
        function MatrixNode() {
            if (!(this instanceof MatrixNode)) {
                return;
            }
            // 继承题目基类
            Class.SubjectNode.call(this);
            // 宽度
            this.width = 422;
            // 高度
            this.height = 279;
            // 背景颜色
            this.backgroundColor = "#2693aa";
            // 横选项列表
            this.optionsX = [];
            // 纵选项列表
            this.optionsY = [];
            // 分割线
            this.line = new ZYDesign.Class.LineModel(this, 0);
            // 水平连接线参数
            this.hLine = new ZYDesign.Class.LineModel(this, 1);
            // 垂直连接线参数
            this.vLine = new ZYDesign.Class.LineModel(this, 2);
            // 列选项标题
            this.optionXName = "列选项";
            // 行选项标题
            this.optionYName = "行选项";
            // 矩阵题类型
            this.matrixType = 0;
            // 选择方式限制
            this.selectTypeLimit = 0;
            // 最多选择数
            this.multipleMax = 1;
            // 最少选择数
            this.multipleMin = 0;
            // 最高分
            this.markMax = 1;
            // 最低分
            this.markMin = 0;
            // 最低分描述
            this.markMinComment = "";
            // 最高分描述
            this.markMaxComment = "";
            // 行固定位循环
            this.loopOptionX = false;
            // 列固定位循环
            this.loopOptionY = false;
        }

        // 继承模板基类
        Class.inheritPrototype(Class.SubjectNode, MatrixNode);

        // 配置宽度与节点实际宽度差
        //MatrixNode.prototype.differWidth = 5;
        // 配置高度与节点实际高度差
        //MatrixNode.prototype.differHeight = 18;
        // 节点类型
        MatrixNode.prototype.type = ZYDesign.Enum.NODETYPE.MATRIX;
        // 节点类型整数
        MatrixNode.prototype.typeInt = 5;
        // 分类类型
        MatrixNode.prototype.categoryType = 3;
        // 选项宽度
        MatrixNode.prototype.optionWidth = 41.8;
        // 分割线起点X坐标
        MatrixNode.prototype.lineX1 = 217.757;
        // 分割线起点Y坐标
        MatrixNode.prototype.lineY1 = 218;
        // 分割线终点X坐标
        MatrixNode.prototype.lineX2 = 418.845;
        // 分割线终点Y坐标
        MatrixNode.prototype.lineY2 = 218;
        // 水平连接线起点X坐标
        MatrixNode.prototype.hLineX1 = 166.443;
        // 水平连接线起点Y坐标
        MatrixNode.prototype.hLineX2 = 217.301;
        // 水平连接线终点X坐标
        MatrixNode.prototype.hLineY1 = 290.58;
        // 水平连接线终点Y坐标
        MatrixNode.prototype.hLineY2 = 290.58;
        // 垂直连接线起点X坐标
        MatrixNode.prototype.vLineX1 = 321.113;
        // 垂直连接线起点Y坐标
        MatrixNode.prototype.vLineX2 = 321.113;
        // 垂直连接线终点X坐标
        MatrixNode.prototype.vLineY1 = 111.982;
        // 垂直连接线终点Y坐标
        MatrixNode.prototype.vLineY2 = 157.337;
        // 纵选项标题基准X坐标
        MatrixNode.prototype.optionsXTitleX = 227 + 41.8;
        // 纵选项标题基准Y坐标
        MatrixNode.prototype.optionsXTitleY = 25;
        // 横选项标题基准X坐标
        MatrixNode.prototype.optionsYTitleX = 10;
        // 横选项标题基准Y坐标
        MatrixNode.prototype.optionsYTitleY = 238 + 30;
        // 纵选项文字基准X坐标
        MatrixNode.prototype.optionsXTextX = 227 + 41.8;
        // 纵选项文字基准Y坐标
        MatrixNode.prototype.optionsXTextY = 40;
        // 横选项文字基准X坐标
        MatrixNode.prototype.optionsYTextX = 35;
        // 横选项文字基准Y坐标
        MatrixNode.prototype.optionsYTextY = 238 + 30;
        // 矩阵选项位置基准X坐标
        MatrixNode.prototype.optionCircleXBase = 227 + 8 + 41.8;
        // 矩阵选项位置基准Y坐标
        MatrixNode.prototype.optionCircleYBase = 238 - 4 + 30;
        // 输入点文字位置X坐标
        MatrixNode.prototype.inputTextX = 247.5 - 14.5;
        // 输入点文字位置X坐标
        MatrixNode.prototype.inputTextY = 208;
        // 输入点圆圈位置X坐标
        MatrixNode.prototype.inputCircleX = 232.5 - 14.5;
        // 输入点圆圈位置Y坐标
        MatrixNode.prototype.inputCircleY = 200;
        // 输出点文字位置X坐标
        MatrixNode.prototype.outputTextX = 389.5 + 14.5;
        // 输出点文字位置Y坐标
        MatrixNode.prototype.outputTextY = 208;
        // 输出点圆圈位置X坐标
        MatrixNode.prototype.outputCircleX = 403.5 + 14.5;
        // 输出点圆圈位置Y坐标
        MatrixNode.prototype.outputCircleY = 200;
        // 问题文字显示位置X坐标
        MatrixNode.prototype.questionX = 228;
        // 问题文字显示位置Y坐标
        MatrixNode.prototype.questionY = 178;
        // 类型列表字段
        MatrixNode.prototype.typeListKey = "matrixNodes";
        // 是否有附加操作
        MatrixNode.prototype.addition = true;
        // 输出文字是否可变化
        MatrixNode.prototype.outputTextChangable = true;
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        MatrixNode.prototype.optionConstructor = ZYDesign.Class.MatrixOptionConnector;
        // 类型名
        MatrixNode.prototype.typeName = "矩阵题";
        // 类型图标
        MatrixNode.prototype.typeIcon = "ic_matrix";
        // 矩阵题类型字典
        MatrixNode.prototype.TypeDic = [
            {
                id: 0,
                value: "选择题"
            },
            {
                id: 1,
                value: "打分题"
            },
        ];

        // 选择类型字典
        MatrixNode.prototype.SelectDic = [
            {
                id: 0,
                value: "选择题"
            },
            {
                id: 1,
                value: "打分题"
            },
        ];

        /**
            获取节点名X坐标
        */
        MatrixNode.prototype.getNodeNameX = function () {
            return 218;
        }

        /**
            获取节点名Y坐标
        */
        MatrixNode.prototype.getNodeNameY = function () {
            return 153;
        }

        /**
            维护宽度
        */
        MatrixNode.prototype.maintainWidth = function () {
            if (this.optionsX.length <= 4) {
                this.width = 422;
            } else {
                this.width = 422 + (this.optionsX.length - 4) * this.optionWidth;
            }
        }

        /**
            维护高度
        */
        MatrixNode.prototype.maintainHeight = function () {
            if (this.optionsY.length <= 0) {
                this.height = 268;
            } else {
                this.height = 268 + this.optionsY.length * 30;
            }

        }

        /**
            获取背景顶部位置
        */
        MatrixNode.prototype.getBackgroundTop = function () {
            return 158;
        }

        /**
            获取背景左部位置
        */
        MatrixNode.prototype.getBackgroundLeft = function () {
            return 218;
        }

        /**
            获取主区域背景宽度
        */
        MatrixNode.prototype.getBackgroundWidth = function () {
            return this.width - 222;
        }

        /**
            获取主区域背景高度
        */
        MatrixNode.prototype.getBackgroundHeight = function () {
            if (this.optionHidden) {
                return this.getHeight() - 18;
            }
            return this.getHeight() - 177;
        }

        /**
            获取横选项区域背景宽度
        */
        MatrixNode.prototype.getBackgroundWidthX = function () {
            return this.width - 222;
        }

        /**
            获取横选项区域背景高度
        */
        MatrixNode.prototype.getBackgroundHeightX = function () {
            return 112;
        }

        /**
            获取纵选项区域背景宽度
        */
        MatrixNode.prototype.getBackgroundWidthY = function () {
            return 166;
        }

        /**
            获取纵选项区域背景高度
        */
        MatrixNode.prototype.getBackgroundHeightY = function () {
            return this.height - 233;
        }

        /**
            获取矩阵题类型
        */
        MatrixNode.prototype.isMyMatrixType = function (type) {
            return (this.matrixType == type);
        }

        /**
            更新显示名字
            @value 值
        */
        MatrixNode.prototype.updateName = function (value) {
            // 横选项
            if (this.isOptionXSelected()) {
                this.optionXName = value;
                // 纵选项
            } else if (this.isOptionYSelected()) {
                this.optionYName = value;
                // 节点
            } else {
                this.nodeName = value;
            }
        }

        /**
            维持选项
        */
        MatrixNode.prototype.maintainOption = function (key) {
            // 找到横选项或纵选项(副选项)
            var optionsVice = this[key];
            // 找到对应选项的横索引或纵索引
            var indexKey = "";
            // 横索引
            if (key == "optionsX") {
                indexKey = "xIndex";
                // 总索引
            } else {
                indexKey = "yIndex";
            }
            // 循环副选项
            for (var i = 0; i < optionsVice.length; i++) {
                // 该副选项当前的索引
                var formerIndex = optionsVice[i].index;
                // 当前索引与正确索引不一致
                if (formerIndex != i) {
                    // 循环主选项
                    for (var j = 0; j < this.options.length; j++) {
                        var option = this.options[j];
                        // 找到与该副选项相关的主选项
                        if (option[indexKey] == formerIndex &&
                            !option.maintained) {
                            // 更新朱选项索引
                            option[indexKey] = i;
                            option.maintained = true;
                        }
                    }
                }
                // 更新副选项索引
                optionsVice[i].index = i;
            }

            for (var i = 0; i < this.options.length; i++) {
                this.options[i].maintained = false;
            }
        }

        /**
            移除一个横(纵)选项
            @option 选项
        */
        MatrixNode.prototype.removeOption = function (option) {
            if (!(option instanceof ZYDesign.Class.OptionConnector)) {
                return;
            }
            // 试图直接删除矩阵选项
            if (option.belong == "options") {
                return;
            }
            var optionKey = option.belong,
                indexKey = "xIndex",
                index = option.index;
            if (optionKey == "optionsY") {
                indexKey = "yIndex"
            }
            // 移除该选项
            this[optionKey].splice(index, 1);

            // 更新该选项之后的所有选项的位置
            for (var i = index; i < this[optionKey].length; i++) {
                var opt = this[optionKey][i]
                // 更新索引
                opt.index -= 1;
            }

            // 更新维护矩阵选项
            for (var i = this.options.length - 1; i >= 0; i--) {
                var opt = this.options[i];
                // 和该横(纵)选项相关的矩阵选项
                if (opt[indexKey] == index) {
                    // 删除
                    this.options.splice(i, 1);
                    // 该横(纵)向选项相关之后的矩阵选项
                } else if (opt[indexKey] > index) {
                    // 横(纵)向索引跌落
                    opt[indexKey] -= 1
                }
            }
            this.maintainWidth();
            this.maintainHeight();
            // 维护节点尺寸
            this.fixNodeSize(true);
            return option;
        }

        /**
            生成选项编号
            @options 基于哪个列表生成
        */
        MatrixNode.prototype.generateOptionNumber = function (options) {
            // 初始化索引
            var number = 1;
            // 循环选项确保索引为最大
            for (var i = 0; i < options.length; i++) {
                var option = options[i]
                // 当前索引不大于选项索引
                if (number <= option.number) {
                    // 更新当前索引
                    number = option.number + 1;
                }
            }
            // 索引超过上限
            if (number > 999) {
                // 索引置空,有用户自己填写
                number = "";
            }
            return number;
        }


        /**
            添加选项
            @opt 选项数据
            @isX 是否为纵选项
            @silent 是否为静默模式
        */
        MatrixNode.prototype.addOption = function (opt, isX, silent) {
            var rs;
            if ((opt instanceof ZYDesign.Class.MatrixXOptionConnector) || isX) {
                rs = this.addOptionX(opt);
            } else {
                rs = this.addOptionY(opt);
            }
            if (!silent) {
                this.fixNodeSize(true);
            }
            return rs;
        }

        /**
            添加横选项
            @optX 选项数据
            @silent 是否静默模式
        */
        MatrixNode.prototype.addOptionX = function (optX,silent) {
            optX = optX || {};
            var optionX;
            // 已经是现成的选项
            if (optX instanceof ZYDesign.Class.MatrixXOptionConnector) {
                // 直接用
                optionX = optX;
                optionX.index = this.optionsX.length;
            // 不是现成选项
            } else {
                // 根据数据生成新选项
                optionX = new ZYDesign.Class.MatrixXOptionConnector(this);
                // 选项名
                optionX.originText = optX.text || "";
                // 索引
                optionX.index = optX.index ? optX.index : this.optionsX.length;
                // ID
                optionX.outputId = optX.uuid ? optX.uuid : ZYDesign.UuidUtil.generate();
                // 编号
                optionX.number = optX.number ? optX.number : this.generateOptionNumber(this.optionsX);
            }
           
            this.optionsX.push(optionX);
            this.maintainWidth();
            // 非静默模式的时候要维护矩阵选项
            if (!silent) {
                // 和现有的每个纵选项关联生成矩阵选项
                for (var i = 0; i < this.optionsY.length; i++) {
                    this.addMatrixOption(optionX,
                        this.optionsY[i]);
                }
            }
            
            return optionX;
        }

        /**
            添加纵选项
            @optY 选项数据
            @silent 是否静默模式
        */
        MatrixNode.prototype.addOptionY = function (optY,silent) {
            optY = optY || {};
            var optionY;
            // 已经是现成选项
            if (optY instanceof ZYDesign.Class.MatrixYOptionConnector) {
                // 直接用
                optionY = optY;
                optionY.index = this.optionsY.length;
            // 
            } else {
                optionY = new ZYDesign.Class.MatrixYOptionConnector(this);
                // 文字
                optionY.originText = optY.text || "";
                // 索引
                optionY.index = optY.index ? optY.index : this.optionsY.length;
                // ID
                optionY.outputId = optY.uuid ? optY.uuid : ZYDesign.UuidUtil.generate();
                // 编号
                optionY.number = optY.number ? optY.number : this.generateOptionNumber(this.optionsY);
            }
            this.optionsY.push(optionY);
            // 选项多于5
            this.maintainHeight();
            // 非静默模式的时候要维护矩阵现象
            if (!silent) {
                // 和现有的每个横选项关联生成矩阵选项
                for (var i = 0; i < this.optionsX.length; i++) {
                    this.addMatrixOption(this.optionsX[i],
                        optionY);
                }
            }
            
            return optionY;
        }

        /**
          添加一条选项
          @optionX 横向选项
          @optionY 纵向选项
        */
        MatrixNode.prototype.addMatrixOption = function (optionX, optionY) {
            // 初始化选项
            var option = new this.optionConstructor(this);
            // 选项ID
            option.outputId = optionX.outputId + "|" + optionY.outputId;;
            // 横向索引
            option.xIndex = optionX.index;
            // 纵向索引
            option.yIndex = optionY.index;
            this.options.push(option);
            return option;
        }

        /**
          生成选项
          @optionsX 横向选项数据源
          @optionsY 纵向选项数据源
        */
        MatrixNode.prototype.initOptions = function () {

            var optionsX = this.originData.optionsX;
            var optionsY = this.originData.optionsY;

            for (var i = 0; i < optionsX.length; i++) {
                var optionX = optionsX[i];
                // 添加横向选项
                this.addOptionX(optionX,true);
                // 判断是否已经添加Y选项的标志

                for (var j = 0; j < optionsY.length; j++) {
                    var optionY = optionsY[j];
                    // 首次时添加总选项
                    if (i == 0) {
                        // 添加纵向选项
                        this.addOptionY(optionY,true);
                    }
                    // 合成添加矩阵选项
                    this.addMatrixOption(this.optionsX[i],
                        this.optionsY[j]);
                }
            }
        }

        /**
            获取是否是多选模式
        */
        MatrixNode.prototype.isMultiSelect = function () {
            if (this.selectTypeLimit == 5) {
                return true;
            }
            return false;
        }

        /**
            是否单选
        */
        MatrixNode.prototype.isSingleSelect = function () {
            if (this.matrixType != 0) {
                return false;
            }
            return (this.selectTypeLimit == 1) ? true : false;
        }

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        MatrixNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            MatrixNode.base.init.call(this, nodeData, x, y);
            // 矩阵题类型 来自选项表第一个附加字段
            this.matrixType = this.originData.extField_1 || 0;
            // 选项限制类型 来自选项表第二个附加字段
            this.selectTypeLimit = this.originData.extField_2 || 5;
            // 最少要选几项限制 来自选项表第三个附加字段
            this.multipleMin = this.originData.extField_3 || 2;
            this.oldMultipleMin = this.multipleMin;
            // 最多能选几项限制 来自选项表第四个附加字段
            this.multipleMax = this.originData.extField_4 || this.options.length;
            // 最低允许打几分 来自选项表第五个附加字段
            this.markMin = this.originData.extField_5 || 1;
            // 最高允许打几分 来自选项表第六个附加字段
            this.markMax = this.originData.extField_6 || 100;
            // 是否行固定位循环 来自选项表第七个附加字段
            this.loopOptionY = this.originData.extField_7 == "Y" ? true : false;
            // 是否列固定位循环 来自选项表第八个附加字段
            this.loopOptionX = this.originData.extField_8 == "Y" ? true : false;
            // 最低分描述 来自选项表第九个附加字段
            this.markMinComment = this.originData.extField_9 || "";
            // 最高分描述 来自选项表第九个附加字段
            this.markMaxComment = this.originData.extField_10 || "";
            // 纵选项随机
            this.randomOptionX = this.originData.randomOptionX == "Y" ? true : false;
            // 是否打开随机
            this.randomOpen = this.randomOptionX || this.randomOptionY;
            // 是否开启循环
            this.loopOpen = this.loopOptionX || this.loopOptionY;
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        MatrixNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            MatrixNode.base.exportJson.call(this, questionairId, jsonHolder);

            // 额外属性1:矩阵题类型
            jsonHolder.extField_1 = this.matrixType;
            // 额外属性2:是否多选
            jsonHolder.extField_2 = this.selectTypeLimit;
            // 额外属性3:多选最少项
            jsonHolder.extField_3 = this.multipleMin;
            // 额外属性4:多选最多项
            jsonHolder.extField_4 = this.multipleMax;
            // 额外属性5:打分最高分
            jsonHolder.extField_5 = this.markMin;
            // 额外属性6:打分最低分
            jsonHolder.extField_6 = this.markMax;
            // 额外属性7:行固定为循环Y
            jsonHolder.extField_7 = this.loopOptionY ? "Y" : "N";
            // 额外属性8:列固定位循环X
            jsonHolder.extField_8 = this.loopOptionX ? "Y" : "N";
            // 额外属性9:最低分描述
            jsonHolder.extField_9 = this.markMinComment;
            // 额外属性10:最高分描述
            jsonHolder.extField_10 = this.markMaxComment;
            // 纵选型随机
            jsonHolder.randomOptionX = this.randomOptionX ? "Y" : "N";
        }

        /**
            导出选项信息
        */
        MatrixNode.prototype.exportOptionJson = function (jsonHolder) {
            // 纵选项列表
            jsonHolder.optionsX = this.collectOptionsX();
            // 横选项列表
            jsonHolder.optionsY = this.collectOptionsY();
        }

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
            @typeFlag 选项行列标志
         */
        MatrixNode.prototype.collectOption = function (option, optionJson, typeFlag) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 先调用父类同名方法
            MatrixNode.base.collectOption.call(this, option, optionJson);
            // 行列标志
            optionJson.typeFlag = typeFlag;
        }

        /**
            收集横选项信息
        */
        MatrixNode.prototype.collectOptionsX = function () {
            if (!this.optionsX || this.optionsX.length == 0) {
                return null;
            }
            var optionsXJson = [];
            for (var i = 0; i < this.optionsX.length; i++) {
                var optionX = this.optionsX[i];
                var optionXJson = {};
                this.collectOption(optionX, optionXJson, 1);
                optionsXJson.push(optionXJson);
            }
            return optionsXJson;
        }

        /**
            手机纵选项信息
        */
        MatrixNode.prototype.collectOptionsY = function () {
            if (!this.optionsY || this.optionsY.length == 0) {
                return null;
            }
            var optionsYJson = [];
            for (var i = 0; i < this.optionsY.length; i++) {
                var optionY = this.optionsY[i];
                var optionYJson = {};
                this.collectOption(optionY, optionYJson, 0);
                optionsYJson.push(optionYJson);
            }
            return optionsYJson;
        }


        /**
            检查选项中是否包含关键字
        */
        MatrixNode.prototype.hasKeywordInOptions = function (keyword) {
            // 纵选项中查找
            for (var i = 0; i < this.optionsX.length; i++) {
                var optionX = this.optionsX[i];
                if (optionX.originText.indexOf(keyword) > -1) {
                    return true;
                }
            }
            // 横选项中查找
            for (var i = 0; i < this.optionsY.length; i++) {
                var optionY = this.optionsY[i];
                if (optionY.originText.indexOf(keyword) > -1) {
                    return true;
                }
            }
            return false;
        }

        /**
            获取控制按钮区域位置偏移量
        */
        MatrixNode.prototype.getCtrIconTransform = function () {
            var transform = "translate(218," + (this.getBackgroundHeight() + 159) + ")";
            return transform;
        }

        /**
          生成当前节点的一个数据副本并返回
          @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        MatrixNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            MatrixNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY)
            // 添加函数名
            jsonHolder.addFnKey = "addMatrixNode";
        }

        /**
            复制选项
            @jsonHolder 收集复制信息的对象
        */
        MatrixNode.prototype.cloneOptionsJson = function (jsonHolder) {
            var tempAry = ["optionsX", "optionsY"];
            for (var i = 0; i < tempAry.length; i++) {
                var key = tempAry[i];
                var optionsCopy = [];
                for (var j = 0; j < this[key].length; j++) {
                    var option = {};
                    option.text = this[key][i].originText;
                    optionsCopy.push(option);
                }
                jsonHolder[key] = optionsCopy
            }
        }

        /**
        提取题型说明文字
        子类节点需重写该方法
        */
        MatrixNode.prototype.extractTypeText = function () {
            var text = "矩阵题"
            // 选择方式
            if (this.matrixType == 0) {
                var limitText = ZYDesign.Dict.getMatrixLimitById(this.selectTypeLimit);
                text += "(" + limitText + ")";
                // 打分方式
            } else {
                text += "(打分)";
            }
            return text;
        }

        /**
            获取警告标记偏移参数
        */
        MatrixNode.prototype.getWarnIconTrasform = function () {
            if (this.optionsX.length <= 4) {
                return "translate(398,138)";
            }
            var transX = 398 + (this.optionsX.length - 4) * this.optionWidth;
            return "translate(" + transX + ",138)";
        }

        /**
           节点合法性检查,特殊属性检查
           子类节点有特殊检查需求时重写该方法
           @result 存储检查结果的对象
        */
        MatrixNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            MatrixNode.base.validate.call(this, result);
            // 父类中已检查出错误
            if (!result.isValid) {
                return result;
            }
            // 选项数检查
            if (this.optionsX.length < 2 && this.optionsY.length < 2) {
                result.isValid = false;
                result.message = Prompt.QSNRD_OptionNotBelowTwo;
                return result;
            }

            // 纵选项检查
            for (var i = 0; i < this.optionsX.length; i++) {
                var option = this.optionsX[i];
                // 编号和描述检查
                if (!option.number || !option.originText) {
                    result.isValid = false;
                    result.message = Prompt.QSNRD_InvalidIncompleteOptionX; // Prompt.QSNRD_InvalidIncompleteOptionX
                    return result;
                }
                // 编号和描述冲突检查
                for (var j = i + 1; j < this.optionsX.length; j++) {
                    var opt = this.optionsX[j];
                    if (opt.number == option.number ||
                        opt.originText == option.originText) {
                        result.isValid = false;
                        result.message = Prompt.QSNRD_InvalidConflictOptionX; // Prompt.QSNRD_InvalidConflictOptionX
                        return result;
                    }
                }
            }
            // 横选项检查
            for (var i = 0; i < this.optionsY.length; i++) {
                var option = this.optionsY[i];
                // 编号和描述检查
                if (!option.number || !option.originText) {
                    result.isValid = false;
                    result.message = Prompt.QSNRD_InvalidIncompleteOptionY; // Prompt.QSNRD_InvalidIncompleteOptionY
                    return result;
                }
                // 编号和描述冲突检查
                for (var j = i + 1; j < this.optionsY.length; j++) {
                    var opt = this.optionsY[j];
                    if (opt.number == option.number ||
                        opt.originText == option.originText) {
                        result.isValid = false;
                        result.message = Prompt.QSNRD_InvalidConflictOptionY; // Prompt.QSNRD_InvalidConflictOptionY
                        return result;
                    }
                }
            }
            return result;
        }

        /**
            修复节点尺寸
            [*** angularjs数据绑定减压专用 ***]
            @needFixOption 是否需要修复选项位置
        */
        MatrixNode.prototype.fixNodeSize = function (needFixOption) {
            // 节点控件元素
            var nodeElem = $("#" + this.nodeUuid);
            // 纵选项背景尺寸修复
            nodeElem.find(".background_size_x").attr({
                width: this.getBackgroundWidthX(),
                height: this.getBackgroundHeightX()
            });

            // 横选项背景尺寸修复
            nodeElem.find(".background_size_y").attr({
                width: this.getBackgroundWidthY(),
                height: this.getBackgroundHeightY()
            });

            // 主选项背景尺寸修复
            nodeElem.find(".background_size").attr({
                width: this.getBackgroundWidth(),
                height: this.getBackgroundHeight()
            });

            // 修复分割线长度
            nodeElem.find(".seg_line").attr("x2", this.line.getX2());

            // 修复缩放ICON变换效果
            nodeElem.find(".expansion_icon").attr("transform", this.getExpansionIconTransform())

            // 输出口元素
            var outputElem = nodeElem.find(".elem_output");
            //修复输出口文字位置
            outputElem.find("text").attr({
                x: this.output.getTextX(),
                y: this.output.getTextY(),
            });
            //修复输出口感应区位置
            outputElem.find("rect").attr({
                x: this.output.getBlockX(),
                y: this.output.getBlockY(),
            });
            //修复输出口圆圈位置
            outputElem.find("circle").attr({
                cx: this.output.getCircleX(),
                cy: this.output.getCircleY(),
            });
            // 修复警告图标变换信息
            nodeElem.find(".elem_warn_icon").attr("transform", this.getWarnIconTrasform());

            // 需要修复选项位置
            if (needFixOption) {
                // 修复选项位置
                this.fixOptionPosition();
            }
        }

        /**
            修复选项位置
            [*** angularjs数据绑定减压专用 ***]
        */
        MatrixNode.prototype.fixOptionPosition = function () {
            // 主选项
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                // 主选项元素
                var optElement = $("#" + option.outputId.replace("|", "a"));
                // 修复感应区位置
                optElement.find("rect").attr({
                    x: option.getBlockX(),
                    y: option.getBlockY()
                });
                // 修复圆圈位置
                optElement.find("circle").attr({
                    cx: option.getCircleX(),
                    cy: option.getCircleY()
                });
            }
            // 纵选项
            for (var i = 0; i < this.optionsX.length; i++) {
                var optX = this.optionsX[i];
                // 纵选项元素
                var optXElement = $("#" + optX.outputId);
                // 修复标题文字位置
                optXElement.find("text").attr({
                    x: optX.getTitleX(),
                });
            }
            // 横选项
            for (var i = 0; i < this.optionsY.length; i++) {
                var optY = this.optionsY[i];
                // 横选项元素
                var optYElement = $("#" + optY.outputId);
                // 修复文字位置
                optYElement.find("text").attr({
                    y: optY.getTitleY(),
                });
            }
        }

        /**
            设置选项可用性
        */
        MatrixNode.prototype.setOptionEnable = function () {
            if (!this.isSingleSelect()) {
                $("#" + this.nodeUuid + " .chart_options circle").attr("style", "stroke: #34495e;fill: rgba(52, 73, 94, 0.49);");
            } else {
                $("#" + this.nodeUuid + " .chart_options circle").attr("style", "");
            }
        }

        /**
          获得节点的变换属性(鹰眼区域)
        */
        MatrixNode.prototype.getEyeTransform = function () {
            return "translate(" + (this.getX() + 218) + "," + (this.getY() + 158) + ")";
        }

        /**
          获得节点的变换属性X(鹰眼区域)
        */
        MatrixNode.prototype.getEyeTransformX = function () {
            return "translate(" + (this.getX() + 218) + "," + (this.getY()) + ")";
        }

        /**
          获得节点的变换属性Y(鹰眼区域)
        */
        MatrixNode.prototype.getEyeTransformY = function () {
            return "translate(" + (this.getX()) + "," + (this.getY() + 214) + ")";
        }

        /**
            获取额外宽度
            目前只有矩阵题可能会有额外宽度,其他节点都是0
        */
        MatrixNode.prototype.getExtraWidth = function () {
            var extra = 0;
            if (this.optionsX.length > 4) {
                extra = (this.optionsX.length - 4) * this.optionWidth;
            }
            return extra;
        }

        /**
            获得缩放图标变换信息
        */
        MatrixNode.prototype.getExpansionIconTransform = function () {
            var transX = 409.5;
            if (this.optionsX.length > 4) {
                transX += (this.optionsX.length - 4) * this.optionWidth;
            }
            return this.optionHidden ?
                "translate(" + transX + ",166) rotate(90)" :
                "translate(" + (transX - 15) + ",166)";
        }

        /**
            获取警告标记偏移参数
        */
        MatrixNode.prototype.getExpansionTrasform = function () {
            if (this.optionsX.length <= 4) {
                return "translate(396,180) scale(1.5)";
            }
            var transX = 396 + (this.optionsX.length - 4) * this.optionWidth;
            return "translate(" + transX + ",180) scale(1.5)";
        }

        /**
            获取额外高度
            目前只有矩阵题可能会有额外高度,其他节点都是0
        */
        MatrixNode.prototype.getExtraHeight = function () {
            var extra = 0;
            if (this.optionsY.length > 5) {
                extra = (this.optionsY.length - 5) * this.optionWidth;
            }
            return extra;
        }

        /**
            移除一定范围内的选项
            @start 开始索引
            @end 结束索引
            @isX 是否为纵选项
        */
        MatrixNode.prototype.removeOptionInRange = function (start, end, isX) {
            var rss;
            if (isX) {
                rss = this.removeOptionXInRange(start, end);
            } else {
                rss = this.removeOptionYInRange(start, end);
            }
            return rss;
        }

        /**
            移除一定范围内的纵选项
            @start 开始索引
            @end 结束索引
        */
        MatrixNode.prototype.removeOptionXInRange = function (start, end) {
            if (start < 0 || end >= this.optionsX.length || start > end) {
                return;
            }
            var opts = [];
            for (var i = end; i > start; i--) {
                var opt = this.optionsX[i];
                this.removeOption(opt);
                opts.push(opt);
            }
            return opts;
        }

        /**
            移除一定范围内的横选项
            @start 开始索引
            @end 结束索引
        */
        MatrixNode.prototype.removeOptionYInRange = function (start, end) {
            if (start < 0 || end >= this.optionsY.length || start > end) {
                return;
            }
            var opts = [];
            for (var i = end; i > start; i--) {
                var opt = this.optionsY[i];
                this.removeOption(opt);
                opts.push(opt);
            }
            return opts;
        }

        /**
            修复节点位置
            @fixConn 是否修复连接
        */
        MatrixNode.prototype.fixPosition = function (fixConn) {
            var eyeElem = MatrixNode.base.fixPosition.call(this, fixConn);
            eyeElem.find(".eye_bg_x").attr("transform", this.getEyeTransformX());
            eyeElem.find(".eye_bg_y").attr("transform", this.getEyeTransformY());
        }
        return MatrixNode;
    })();
})();

