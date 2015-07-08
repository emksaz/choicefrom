/**
    ***题目基类文件
    ***author www.venqi.com
*/
(function () {
    var Class = ZYDesign.Class;
    // 题目基类 继承自节点基类
    Class.SubjectNode = (function () {
        /**
            题目基类
            ****定义了模板的共同属性和行为
            ****各类子模板数据模型应继承该类,并扩展自己的属性和行为.
        */
        function SubjectNode() {
            if (!(this instanceof SubjectNode)) {
                return;
            }
            // 继承自节点基类
            Class.NodeBase.call(this);
            // 节点宽度
            this.width = 205;
            // 节点高度
            this.height = 74;
            // 分割线
            this.line = new ZYDesign.Class.LineModel(this, 0);
            // 问题数据
            this.question = new ZYDesign.Class.QuestionModel(this);
            // 总输入点数据
            this.input = new ZYDesign.Class.InputConnector(this);
            // 总输出点数据
            this.output = new ZYDesign.Class.OutputConnector(this);
            // 选项数据
            this.options = [];
            // 背景色
            this.backgroundColor = "#b089c8";
            // 选项是否隐藏
            this.optionHidden = false;
            // 随机纵选项
            this.randomOption = false;
            // 随机横选项
            this.randomOptionY = false;
            // 答案是否必须
            this.answerRequired = true;

            /******页面控制专用属性******/


            /******页面控制专用属性******/
        }

        // 继承自节点基类
        Class.inheritPrototype(Class.NodeBase, SubjectNode);

        // 配置宽度与节点实际宽度差
        //SubjectNode.prototype.differWidth = 5;
        // 配置高度与节点实际高度差
        //SubjectNode.prototype.differHeight = 18;
        // 问题文字X坐标
        SubjectNode.prototype.questionX = 10;
        // 问题文字Y坐标
        SubjectNode.prototype.questionY = 20;
        // 输入点文字X坐标
        SubjectNode.prototype.inputTextX = 30 - 14.5;
        // 输入点文字Y坐标
        SubjectNode.prototype.inputTextY = 48;
        // 输入点圆圈X坐标
        SubjectNode.prototype.inputCircleX = 15 - 14.5;
        // 输入点圆圈Y坐标
        SubjectNode.prototype.inputCircleY = 43;
        // 输出点文字X坐标
        SubjectNode.prototype.outputTextX = 171 + 14.5;
        // 输出点文字Y坐标
        SubjectNode.prototype.outputTextY = 48;
        // 输出点圆圈X坐标
        SubjectNode.prototype.outputCircleX = 185 + 14.5;
        // 输出点圆圈Y坐标
        SubjectNode.prototype.outputCircleY = 43;
        // 分割线起点X坐标
        SubjectNode.prototype.lineX1 = 0;
        // 分割线起点Y坐标
        SubjectNode.prototype.lineY1 = 61;
        // 分割线终点X坐标
        SubjectNode.prototype.lineX2 = 200;
        // 分割线终点Y坐标
        SubjectNode.prototype.lineY2 = 61;
        // 选项文字基准位置X坐标
        SubjectNode.prototype.optionTextXBase = 171 + 14.5;
        // 选项文字基准位置Y坐标
        SubjectNode.prototype.optionTextYBase = 82;
        // 选项圆圈基准位置X坐标
        SubjectNode.prototype.optionCircleXBase = 185 + 14.5;
        // 选项圆圈基准位置Y坐标
        SubjectNode.prototype.optionCircleYBase = 77;
        // 选项行高
        SubjectNode.prototype.optionLineHeight = 30;
        // 节点类型
        SubjectNode.prototype.type = ZYDesign.Enum.NODETYPE.SUBJECT;
        // 节点类型整数
        SubjectNode.prototype.typeInt = -100;
        // 分类类型
        SubjectNode.prototype.categoryType = 3;
        // 节点精确类型
        SubjectNode.prototype.commonType = ZYDesign.Enum.NODECOMMONTYPE.SUBJECT
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        SubjectNode.prototype.optionConstructor = ZYDesign.Class.OptionConnector;


        /**
            获取是否随机(横)选项
        */
        SubjectNode.prototype.isRandomOption = function () {
            return this.randomOption;
        }

        /**
           获取是否随机纵选项
        */
        SubjectNode.prototype.isRandomOptionY = function () {
            return this.randomOptionY;
        }

        /**
            获取问题描述显示长度
        */
        SubjectNode.prototype.getQuestionShowLength = function () {
            return (this.width - 80) / 6;
        }

        /**
           获取节点背景宽度
        */
        SubjectNode.prototype.getBackgroundHeight = function () {
            return this.getHeight() - 18
        }

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        SubjectNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            SubjectNode.base.init.call(this, nodeData, x, y);
            // 选项是否隐藏
            this.optionHidden = this.originData.optionHidden;
            // (横)选项随机
            this.randomOption = nodeData.randomOption == "Y" ? true : false;
            // 纵选项随机
            this.randomOptionY = nodeData.randomOptionY == "Y" ? true : false;
            // 司否必答
            this.answerRequired = nodeData.answerRequired == "N" ? false : true;
            // 生成选项
            this.initOptions();
            // 生成问题
            this.initQuestion();
            // 生成输入点
            this.initInput();
            // 生成输出点
            this.initOutput();
        }

        /**
            生成问题
        */
        SubjectNode.prototype.initQuestion = function () {
            var data = this.originData;
            // 问题原始文字
            this.question.originText = data.questionText ? data.questionText : "";
            this.question.videoUrl = data.questionVideoUrl ? data.questionVideoUrl : "";
        };

        /**
            生成总输入点
        */
        SubjectNode.prototype.initInput = function () {
            // 父节点
            this.input.parent = this;
            // 连接点名字
            this.input.text = "输入";
            if (this.originData.input.uuid) {
                this.input.inputId = this.originData.input.uuid;
            }
        };

        /**
            生成总输出点
        */
        SubjectNode.prototype.initOutput = function () {
            // 连接点名字
            this.output.text = "输出";
            // 连接点ID
            if (this.originData.output.uuid) {
                this.output.outputId = this.originData.output.uuid;
            }
        };

        /**
            获得缩放图标变换信息
        */
        SubjectNode.prototype.getExpansionIconTransform = function () {
            return this.optionHidden ?
                "translate(192.5,8) rotate(90)" :
                "translate(177.5,8)";
        }

        /**
            维持选项
        */
        SubjectNode.prototype.maintainOption = function (key) {
            for (var i = 0; i < this.options.length; i++) {
                this.options[i].index = i;
            }
        }

        /**
            生成选项编号
        */
        SubjectNode.prototype.generateOptionNumber = function () {
            // 初始化索引
            var number = 1;
            // 循环选项确保索引为最大
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i]
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
          添加一条选项
          @opt 选项内容
          @isX 是否为纵选项
          @silent 是否静默模式
        */
        SubjectNode.prototype.addOption = function (opt,isX,silent) {
            opt = opt || {};
            // 检查选项数据
            if (!this.options) {
                this.options = [];
            }
            var option;
            // 传进来的已经是一个现成的选项
            if (opt instanceof this.optionConstructor) {
                // 直接拿过来
                option = opt;
                option.index = this.options.length;
            // 非现成选项
            } else {
                // 生成一个选项
                option = new this.optionConstructor(this);
                // 根据原始数据初始化该选项
                this.initOption(opt, option);
            }
            // 添加选项到列表
            this.addOptionToList(option);
            // 维护节点尺寸
            this.maintainHeight();
            if (!silent) {
                this.fixNodeSize(true);
            }
            return option;
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        SubjectNode.prototype.initOption = function (opt, option) {
            // 选项名称
            option.originText = opt.text || "";
            // 选项ID
            option.outputId = opt.uuid ? opt.uuid : ZYDesign.UuidUtil.generate();
            // 索引
            var index = parseInt(opt.index);
            option.index = isNaN(index) ? this.options.length : index;
            // 编号
            var number = parseInt(opt.number);
            option.number = isNaN(number) ? this.generateOptionNumber() : number;
        }

        /**
            把做好的选项添加到选项列表中
            @option 选项
        */
        SubjectNode.prototype.addOptionToList = function (option) {
            // 添加到选项列表
            this.options.push(option);
        }

        /**
            维护节点高度
            @range 变化范围
        */
        SubjectNode.prototype.maintainHeight = function () {
            var length = this.options.length;
            this.height = 79 + length * 30;

        }

        /**
             移除一个选项
             @index 欲移除选项的索引
           */
        SubjectNode.prototype.removeOption = function (option) {
            var index = option.index;
            // 移除该选项
            this.options.splice(index, 1);
            this.maintainHeight();
            // 更新该选项之后的所有选项的位置
            for (var i = index; i < this.options.length; i++) {
                var option = this.options[i];
                // 更新索引
                option.index -= 1;
            }
            // 维护节点尺寸
            this.fixNodeSize(true);
            return option;
        }

        /**
            移除一定范围内的选项
            @start 开始索引
            @end 结束索引
        */
        SubjectNode.prototype.removeOptionInRange = function (start,end) {
            if (start < 0 || end >= this.options.length || start > end) {
                return;
            }
            var opts = [];
            for (var i = end; i > start; i--) {
                var opt = this.options[i];
                this.removeOption(opt);
                opts.push(opt);
            }

            return opts;
        }

        /**
          生成选项
          @options 选项数据源
        */
        SubjectNode.prototype.initOptions = function () {

            var options = this.originData.options;

            if (!options) {
                return;
            }

            // 循环添加选项
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                // 添加选项
                this.addOption(option,false,true);
            }
        }

        /**
            收集选项列表Json信息
         */
        SubjectNode.prototype.collectOptions = function () {
            if (!this.options || this.options.length == 0) {
                return null;
            }
            var optionsJson = [];
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                var optionJson = {};
                this.collectOption(option, optionJson);
                optionsJson.push(optionJson);
            }
            return optionsJson;
        }

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        SubjectNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            optionJson.nodeType = this.typeInt;  // 所属节点类型
            optionJson.number = option.number;   // 选项编号
            optionJson.typeFlag = 0;             // 横纵选项标志
            optionJson.index = option.index;     // 选项索引
            optionJson.text = option.originText; // 选项文字描述
            optionJson.uuid = option.outputId;   // 选项ID
        }

        /**
            是否包含关键字
            @keyword 关键字
        */
        SubjectNode.prototype.hasKeyword = function (keyword) {
            // 先调用父类同名方法进行检查
            if (SubjectNode.base.hasKeyword.call(this, keyword)) {
                return true;
            }
            // 问题描述中查找
            if (this.question.originText.indexOf(keyword) > -1) {
                return true;
            }
            // 选项中查找
            if (this.hasKeywordInOptions(keyword)) {
                return true;
            }
            return false;
        }

        /**
            检查选项中是否包含关键字
        */
        SubjectNode.prototype.hasKeywordInOptions = function (keyword) {
            // 选项中查找
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                if (option.originText.indexOf(keyword) > -1) {
                    return true;
                }
            }
            return false;
        }

        /**
            根据ID搜索连接点
            @connectorId 连接点ID
        */
        SubjectNode.prototype.searchConnectorById = function (connectorId) {
            // 输出点
            if (this.output.outputId == connectorId) {
                return this.output;
            }
            // 输入点
            if (this.input.inputId == connectorId) {
                return this.input;
            }
            // 选项
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                if (option.outputId == connectorId) {
                    return option;
                }
            }
            return false;
        }

        /**
            复制节点数据
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        SubjectNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            SubjectNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 输入
            jsonHolder.input = {
                text: "输入",
            };
            // 输出
            jsonHolder.output = {
                text: "输出",
            };
            // 问题描述
            jsonHolder.questionText = this.question.originText;
            jsonHolder.questionVideoUrl = this.question.videoUrl;
            jsonHolder.randomOptionY = this.randomOptionY ? "Y" : "N";
            jsonHolder.answerRequired = this.answerRequired ? "Y" : "N";

            // 选项信息
            this.cloneOptionsJson(jsonHolder);
        }

        /**
            复制选项
            @options 选项数据
            @return 选项数据的复制品
        */
        SubjectNode.prototype.cloneOptionsJson = function (jsonHolder) {
            var optionsCopy = [];
            for (var i = 0; i < this.options.length; i++) {
                var opt = this.options[i],
                    option = {};
                option.text = opt.originText;
                optionsCopy.push(option);
            }
            jsonHolder.options = optionsCopy;
        }

        /**
            节点合法性检查,特殊属性检查
            子类节点有特殊检查需求时重写该方法
            @result 存储检查结果的对象
        */
        SubjectNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            SubjectNode.base.validate.call(this, result);
            // 父类中已检查出错误
            if (!result.isValid) {
                return result;
            }
            // 存在重复输出
            if (this.hasRepeatedDest()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidOutputRepeat; // Prompt.QSNRD_InvalidOutputRepeat
                return result;
            }

            // 总输出和选项输出重复
            if (this.isAllOptionOutputed() &&
                this.isMasterOutputed()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidOutputConflict; // Prompt.QSNRD_InvalidOutputConflict
                return result;
            }
            // 检查问题文字
            if (!this.question.originText.trim()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoQuestionText; // Prompt.QSNRD_InvalidNoQuestionText
                return result;
            }
            return result;
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        SubjectNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            SubjectNode.base.exportJson.call(this, questionairId, jsonHolder);
            // 问题描述
            jsonHolder.questionText = this.question.originText;
            jsonHolder.questionVideoUrl = this.question.videoUrl;
            // 输入口信息
            jsonHolder.input = {
                index: -2,
                uuid: this.input.inputId,
            };
            // 输出口信息
            jsonHolder.output = {
                index: -1,
                uuid: this.output.outputId,
            };
            // 输出列表
            jsonHolder.destList = this.collectDestList();
            // 横选项随机
            jsonHolder.randomOptionY = this.randomOptionY ? "Y" : "N";
            // 列选项随机
            jsonHolder.randomOption = this.randomOption ? "Y" : "N";
            // 选项隐藏
            jsonHolder.optionHidden = this.optionHidden;
            // 所属一层循环节点ID
            jsonHolder.circleNode1Id = this.getCircleNode1Id();
            // 所属二层循环节点ID
            jsonHolder.circleNode2Id = this.getCircleNode2Id();
            // 题目类型描述文字
            jsonHolder.typeText = this.extractTypeText();
            // 司否必答
            jsonHolder.answerRequired = this.answerRequired ? "Y" : "N";
            // 选项信息
            this.exportOptionJson(jsonHolder)
        }

        /**
            提取题型说明文字
            子类节点需重写该方法
        */
        SubjectNode.prototype.extractTypeText = function () {
            return "";
        }

        /**
            导出选项信息
        */
        SubjectNode.prototype.exportOptionJson = function (jsonHolder) {
            jsonHolder.options = this.collectOptions();
        }


        /**
            修复节点尺寸
            [*** angularjs数据绑定减压专用 ***]
        */
        SubjectNode.prototype.fixNodeSize = function (needFixOption) {
            var nodeElement = $("#" + this.nodeUuid);
            // 修复背景尺寸
            nodeElement.find(".background_size").attr({
                width: this.getBackgroundWidth(),
                height: this.getBackgroundHeight()
            });
            // 修复缩放ICON变换效果
            nodeElement.find(".expansion_icon").attr("transform", this.getExpansionIconTransform());
            // 选择题修复选项分割线
            if (this instanceof ZYDesign.Class.SelectNode) {
                nodeElement.find(".line_t").attr({
                    x1: this.lineT.getX1(),
                    x2: this.lineT.getX2(),
                    y1: this.lineT.getY1(),
                    y2: this.lineT.getY2(),
                })
            }
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
        SubjectNode.prototype.fixOptionPosition = function () {
            for (var i = 0; i < this.options.length; i++) {
                var option = this.options[i];
                // 选项元素
                var optElement = $("#" + option.outputId);
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
                // 修复文字位置
                optElement.find(".option_text").attr({
                    x: option.getTextX(),
                    y: option.getTextY()
                });

                // 修复编号位置
                optElement.find(".option_number").attr({
                    x: 30,
                    y: option.getTextY()
                });
            }
        }

        /**
            切换缩放隐藏
        */
        SubjectNode.prototype.toggleExpansion = function (changeText) {
            this.optionHidden = !this.optionHidden;
            // 需要改变文字显示
            if (changeText) {
                // 隐藏其他项目
                if (this.optionHidden) {
                    $("#" + this.nodeUuid).find(".expansion_hide").hide();
                    // 显示其他项目
                } else {
                    $("#" + this.nodeUuid).find(".expansion_hide").show();
                }
            }
            // 修复节点尺寸(无需修复选项位置)
            this.fixNodeSize(false);
        }

        /**
            选项错位
            @belong 选项所属
            @sourceIndex 选项原位置
            @targetIndex 选项目标位置
        */
        SubjectNode.prototype.dislocateOption = function (belong, sourceIndex, targetIndex) {
            // 源位置与目标位置相同不处理
            if (sourceIndex == targetIndex) {
                return;
            }
            // 非正常选项所属则不处理
            if (belong != "options" &&
                belong != "optionsX" &&
                belong != "optionsY") {
                return;
            }
            // 妄图直接修改矩阵题的矩阵选项则不处理
            if (this instanceof ZYDesign.Class.MatrixNode && belong == "options") {
                return;
            }
            // 索引下溢则不处理
            if (sourceIndex < 0 || targetIndex < 0) {
                return;
            }
            // 选项数
            var options = this[belong],
                length = options.length;
            // 索引上溢则不处理
            if (sourceIndex >= length || targetIndex >= length) {
                return;
            }
            // 将源选项从源位置抽出
            var srcOpt = options.splice(sourceIndex, 1)[0];
            // 将抽出的源选项插入到目标位置
            options.splice(targetIndex, 0, srcOpt);

            // 维护选项索引
            this.maintainOption();
            // 维护选项显示位置
            this.fixOptionPosition();
        }

        /**
            获得后续节点
            搜索成功后会返回一个对象包含两个属性,
            第一个是后续节点列表,第二个是需要继续往下搜索的节点列表
        */
        SubjectNode.prototype.searchNextNodesByOrder = function () {

            var resultList = [],
                seedList = [],
                options = this.options,
                outputDest = this.output.dest;
            // 查看总输出目标节点
            if (outputDest && outputDest.exactType != ZYDesign.Enum.CONNEXACTTYPE.LOOPEND) {
                var nextNode = outputDest.parent;
                resultList.push(nextNode);
                seedList.push(nextNode);
            }

            // 查看选项输出目标节点
            for (var i = 0; i < options.length; i++) {
                var option = options[i],
                    optionDest = option.dest;
                // 有目标,且不是循环结束
                if (optionDest && optionDest.exactType != ZYDesign.Enum.CONNEXACTTYPE.LOOPEND) {
                    var nextNode = optionDest.parent;
                    resultList.push(nextNode);
                    seedList.push(nextNode);
                }
            }
            return {
                resultList: resultList,
                seedList: seedList
            }
        }
        return SubjectNode;
    })();
})();
