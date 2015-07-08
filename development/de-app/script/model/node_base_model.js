

(function () {
    var Class = ZYDesign.Class;

    /**
        图片类
    */
    Class.ImageModel = (function () {

        function ImageModel() {
            if (!(this instanceof ImageModel)) {
                return;
            }
            // 唯一标识
            this.id = ZYDesign.UuidUtil.generate();
            // 索引
            this.index = 0;
            // 图片大小
            this.size = 0;
            // 文件名
            this.fileName = "";
            // 远程地址
            this.url = "";
            // 远程文件名
            this.serverFileName = "";
            // 横向剪切位置
            this.cutX = 0;
            // 纵向剪切位置
            this.cutY = 0;
            // 原始宽度
            this.originWidth = 0;
            // 原始高度
            this.originHeight = 0;
            // 设置宽度
            this.settingWidth = 0;
            // 设置高度
            this.settingHeight = 0;
            // 是否需要截图
            this.reCut = false;
        }

        // 图片容器设定
        ImageModel.prototype.container = {
            width: 640,
            height: 360,

        }

        /**
            获取图片样式
        */
        ImageModel.prototype.getStyle = function () {
            return "top:" + -this.cutY + "px;left:" + -this.cutX +
                "px;width:" + this.settingWidth + "px;height:" + this.settingHeight + "px;";

        }


        /**
            自适应
        */
        ImageModel.prototype.fitAuto = function () {
            var imageRatio = this.originWidth / this.originHeight;
            var containerRatio = this.container.width / this.container.height;
            (imageRatio <= containerRatio) ?
            this.fitPortrait() :
            this.fitLandscape();
        }

        /**
            横向适应
        */
        ImageModel.prototype.fitLandscape = function () {
            this.settingWidth = this.container.width;
            this.settingHeight = Math.round(this.settingWidth / this.originWidth * this.originHeight);
            this.cutX = 0;
            this.cutY = Math.round((this.settingHeight - this.container.height) / 2);
            this.reCut = true;
        }

        /**
            纵向适应
        */
        ImageModel.prototype.fitPortrait = function () {
            this.settingHeight = this.container.height;
            this.settingWidth = Math.round(this.settingHeight / this.originHeight * this.originWidth);
            this.cutY = 0;
            this.cutX = Math.round((this.settingWidth - this.container.width) / 2);
            this.reCut = true;
        }

        /**
            获取图片尺寸信息显示文字
        */
        ImageModel.prototype.getSizeText = function () {
            return this.originWidth + " x " + this.originHeight + "px";
        }

        /**
            获取图片容量信息显示文字
        */
        ImageModel.prototype.getVolumnText = function () {
            return Math.round(this.size / 1024) + "kB";
        }
        /**
            获取640_缩略图样式
        */
        ImageModel.prototype.getBigImageStyle = function () {
            return this.url + "640_" + this.serverFileName;
        }
        /**
            获取64_缩略图样式
        */
        ImageModel.prototype.getThumbnailStyle = function () {
            return "background-image:url('" + this.url + "64_" + this.serverFileName + "');";
        }

        return ImageModel
    })();

    // 问题描述类
    Class.QuestionModel = (function () {
        /**
            问题描述类
        */
        function QuestionModel(parent) {
            if (!(this instanceof QuestionModel)) {
                return;
            }
            this.parent = parent;
            // 文字
            this.originText = "";
            // 视频
            this.videoUrl = "";
        }

        /**
            获取问题文字X坐标
        */
        QuestionModel.prototype.getX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.questionX;
        }

        /**
            获取问题文字X坐标
        */
        QuestionModel.prototype.getY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.questionY + this.parent.getExtraY();
        }

        /**
            获取要显示的文字
        */
        QuestionModel.prototype.getShowText = function () {
            var width = 143;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }

        return QuestionModel;
    })();

    // 分割线模型类
    Class.LineModel = (function () {
        /**
            分割线模型类
            @parent 所属节点
            @type 类型 0:标题选项分割线 1: 横连接线 2:纵连接线 3:选项分割线
        */
        function LineModel(parent, type) {
            if (!(this instanceof LineModel)) {
                return;
            }
            // 所属节点
            this.parent = parent
            // 类型 0:标题选项分割线 1: 横连接线 2:纵连接线
            this.type = type;
        }

        /**
            获取起点X坐标
        */
        LineModel.prototype.getX1 = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            // 分割线
            if (this.type == 0) {
                return this.parent.lineX1;
                // 横线
            } else if (this.type == 1) {
                return this.parent.hLineX1;
                // 纵线
            } else if (this.type == 2) {
                return this.parent.vLineX1 + this.parent.getExtraWidth() / 2;
                // 选项分割线
            } else {
                return this.parent.lineX1;
            }
        }

        /**
            获取终点X坐标
        */
        LineModel.prototype.getX2 = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            // 分割线
            if (this.type == 0) {
                return this.parent.lineX2 + this.parent.getExtraWidth();
                // 横线
            } else if (this.type == 1) {
                return this.parent.hLineX2;
                // 纵线
            } else if (this.type == 2) {
                return this.parent.vLineX2 + this.parent.getExtraWidth() / 2;
            } else {
                return this.parent.lineX2 + this.parent.getExtraWidth();
            }
        }


        /**
            获取起点Y坐标
        */
        LineModel.prototype.getY1 = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            // 分割线
            if (this.type == 0) {
                return this.parent.lineY1 + this.parent.getExtraY();
                // 横线
            } else if (this.type == 1) {
                return this.parent.hLineY1 + this.parent.getExtraHeight() / 2
                // 纵线
            } else if (this.type == 2) {
                return this.parent.vLineY1;
            } else {
                return this.parent.getBackgroundHeight() - this.parent.optionLineHeight;
            }
        }

        /**
            获取起点Y坐标
        */
        LineModel.prototype.getY2 = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            // 分割线
            if (this.type == 0) {
                return this.parent.lineY2 + this.parent.getExtraY();
                // 横线
            } else if (this.type == 1) {
                return this.parent.hLineY2 + this.parent.getExtraHeight() / 2
                // 纵线
            } else if (this.type == 2) {
                return this.parent.vLineY2;
            } else {
                return this.parent.getBackgroundHeight() - this.parent.optionLineHeight;
            }
        }

        return LineModel;
    })();

    // 可覆盖类
    Class.Hoverable = (function () {
        /**
            可覆盖类
        */
        function Hoverable() {
            if (!(this instanceof Hoverable)) {
                return;
            }
            // 鼠标是否覆盖
            this._hovered = false;
        }
        /**
            覆盖
        */
        Hoverable.prototype.hover = function () {
            this._hovered = true;
        }
        /**
            取消覆盖
        */
        Hoverable.prototype.unhover = function () {
            this._hovered = false;
        }
        /**
            获取是否被覆盖
        */
        Hoverable.prototype.isHovered = function () {
            return this._hovered;
        }

        return Hoverable;
    })();

    // 可选择类 继承可覆盖类
    Class.Selectable = (function () {
        /**
            可选择类
        */
        function Selectable() {
            if (!(this instanceof Selectable)) {
                return;
            }
            // 继承自可覆盖类
            Class.Hoverable.call(this);

            // 当前是否被选择
            this._selected = false;
        }
        // 继承
        Class.inheritPrototype(Class.Hoverable, Selectable);
        /**
            选择
        */
        Selectable.prototype.select = function () {
            this._selected = true;
        }

        /**
            取消选择
        */
        Selectable.prototype.deselect = function () {
            this._selected = false;
        }

        /**
            获得当选选择状态
        */
        Selectable.prototype.isSelected = function () {
            return this._selected;
        }
        return Selectable;
    })();

    // 输入连接点类 继承自可选择类
    Class.InputConnector = (function (BaseType) {
        /**
            输入连接点类
        */
        function InputConnector(parent) {
            if (!(this instanceof InputConnector)) {
                return;
            }
            // 继承
            Class.Selectable.call(this);
            // 所属的节点
            this.parent = parent;
            // 输入口ID
            this.inputId = ZYDesign.UuidUtil.generate();
            // 每个输入点可以接受多个输入
            this.sources = [];
            // 文字
            this.text = "输入";

        }
        // 继承
        Class.inheritPrototype(Class.Selectable, InputConnector);

        // 连接点类型
        InputConnector.prototype.type = ZYDesign.Enum.CONNTYPE.INPUT;

        // 连接点精确类型
        InputConnector.prototype.exactType = ZYDesign.Enum.CONNEXACTTYPE.INPUTBASE;

        /**
            是否已被连接
        */
        InputConnector.prototype.isConnected = function () {
            return !!this.sources.length;
        }

        /**
            获取输入文字X坐标
        */
        InputConnector.prototype.getTextX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.inputTextX;
        }

        /**
            获取输入文字Y坐标
        */
        InputConnector.prototype.getTextY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.inputTextY + this.parent.getExtraY();
        }

        /**
            获取输入圆半径
        */
        InputConnector.prototype.getCircleR = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.circleR;
        }

        /**
            获取输入圆X坐标
        */
        InputConnector.prototype.getCircleX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.inputCircleX;
        }

        /**
            获取输入圆Y坐标
        */
        InputConnector.prototype.getCircleY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.inputCircleY + this.parent.getExtraY();
        }

        /**
            获取输入感应区X坐标
        */
        InputConnector.prototype.getBlockX = function () {
            return this.getCircleX() - 13;
        }

        /**
            获取输入感应区Y坐标
        */
        InputConnector.prototype.getBlockY = function () {
            return this.getCircleY() - 13;
        }

        return InputConnector;
    })();

    // 循环结束连接点类 继承自输入连接点类
    Class.LoopEndConnector = (function () {
        /**
            循环结束连接点类
        */
        function LoopEndConnector(parent) {
            if (!(this instanceof LoopEndConnector)) {
                return;
            }
            // 继承
            Class.InputConnector.call(this, parent);
            // 文字
            this.text = "循环结束";
        }
        // 继承
        Class.inheritPrototype(Class.InputConnector, LoopEndConnector);


        // 连接点精确类型
        LoopEndConnector.prototype.exactType = ZYDesign.Enum.CONNEXACTTYPE.LOOPEND;

        /**
            获取循环结束文字X坐标
        */
        LoopEndConnector.prototype.getTextX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.loopEndTextX;
        }

        /**
            获取循环结束文字Y坐标
        */
        LoopEndConnector.prototype.getTextY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.loopEndTextY;
        }

        /**
            获取圆X坐标
        */
        LoopEndConnector.prototype.getCircleX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.loopEndCircleX;
        }

        /**
            获取圆Y坐标
        */
        LoopEndConnector.prototype.getCircleY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.loopEndCircleY;
        }
        return LoopEndConnector;
    })();

    // 输出连接点类 继承自可选择类
    Class.OutputConnector = (function () {
        /**
            输出连接点类
        */
        function OutputConnector(parent) {
            if (!(this instanceof OutputConnector)) {
                return;
            }
            // 继承
            Class.Selectable.call(this);
            // 所属节点
            this.parent = parent;
            // 输出口ID
            this.outputId = ZYDesign.UuidUtil.generate();
            // 每个输出点可以输出一次
            this.dest = null;
            // 文字
            this.text = "输出";
        }
        // 继承
        Class.inheritPrototype(Class.Selectable, OutputConnector);

        // 连接点类型
        OutputConnector.prototype.type = ZYDesign.Enum.CONNTYPE.OUTPUT;

        // 连接点精确类型
        OutputConnector.prototype.exactType = ZYDesign.Enum.CONNEXACTTYPE.OUTPUTBASE;

        /**
            是否已被连接
        */
        OutputConnector.prototype.isConnected = function () {
            return !!this.dest;
        }

        /**
            获取输出文字X坐标
        */
        OutputConnector.prototype.getTextX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.outputTextX + this.parent.getExtraWidth();
        }

        /**
            获取输出文字Y坐标
        */
        OutputConnector.prototype.getTextY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.outputTextY + this.parent.getExtraY();
        }

        /**
            获取输出圆半径
        */
        OutputConnector.prototype.getCircleR = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.circleR;
        }

        /**
            获取输出圆心X坐标
        */
        OutputConnector.prototype.getCircleX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.outputCircleX + this.parent.getExtraWidth();
        }

        /**
            获取输出圆心Y坐标
        */
        OutputConnector.prototype.getCircleY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.outputCircleY + this.parent.getExtraY();
        }

        /**
            获取输出感应区X坐标
        */
        OutputConnector.prototype.getBlockX = function () {
            return this.getCircleX() - 13;
        }

        /**
            获取输出感应区Y坐标
        */
        OutputConnector.prototype.getBlockY = function () {
            return this.getCircleY() - 13;
        }

        /**
            获取输出文字
        */
        OutputConnector.prototype.getShowText = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return "";
            }
            // 处于收缩状态输出文字不可变的节点
            if (this.parent.optionHidden
                || !this.parent.outputTextChangable) {
                return "输出"
            }
            // 其他场合根据输出情况显示不同的文字
            var hasDest = false;
            for (var i = 0; i < this.parent.options.length; i++) {
                var option = this.parent.options[i];
                if (option.dest != null) {
                    hasDest = true;
                    break;
                }
            }
            // 有选项输出的时候
            if (hasDest) {
                return "其他选项输出";
                // 没有选项输出的时候
            } else {
                return "全部选项输出";
            }
        }

        return OutputConnector;
    })();

    // 循环开始连接点类 继承自输入连接点类
    Class.RandomStartConnector = (function () {
        /**
            循环开始连接点类 
        */
        function RandomStartConnector(parent) {
            if (!(this instanceof RandomStartConnector)) {
                return;
            }
            // 继承
            Class.OutputConnector.call(this, parent);
            // 循环开始节点和一般的输出节点不一样
            // 可以输出多次
            this.dests = [];
            // 文字
            this.text = "随机开始";
        }
        // 继承
        Class.inheritPrototype(Class.OutputConnector, RandomStartConnector);

        // 连接点精确类型
        RandomStartConnector.prototype.exactType = ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART;


        /**
            是否已被连接
        */
        RandomStartConnector.prototype.isConnected = function () {
            return !!this.dests.length;
        }

        /**
            获取文字X坐标
        */
        RandomStartConnector.prototype.getTextX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.randomStartTextX;
        }

        /**
            获取文字Y坐标
        */
        RandomStartConnector.prototype.getTextY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.randomStartTextY;
        }

        /**
            获取圆心X坐标
        */
        RandomStartConnector.prototype.getCircleX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.randomStartCircleX;
        }

        /**
            获取圆心Y坐标
        */
        RandomStartConnector.prototype.getCircleY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.randomStartCircleY;
        }

        /**
            是否包含某个目标
            @dest 需要判断的目标
        */
        RandomStartConnector.prototype.containDest = function (dest) {
            // 目标列表循环
            for (var i = 0; i < this.dests.length; i++) {
                // 存在该目标
                if (dest == this.dests[i]) {
                    return true;
                }
            }
            return false;
        }
        return RandomStartConnector;
    })();

    // 循环开始节点类 继承自输出点类
    Class.LoopStartConnector = (function () {
        /**
            循环开始节点类
        */
        function LoopStartConnector(parent) {
            if (!(this instanceof LoopStartConnector)) {
                return;
            }
            // 继承自输出点类
            Class.OutputConnector.call(this, parent);
            // 文字
            this.text = "循环开始";
        }
        // 继承自输出类点
        Class.inheritPrototype(Class.OutputConnector, LoopStartConnector);

        // 连接点精确类型
        LoopStartConnector.prototype.exactType = ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART;

        /**
            获取循环开始文字X坐标
        */
        LoopStartConnector.prototype.getTextX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.loopStartTextX;
        }

        /**
            获取循环开始文字Y坐标
        */
        LoopStartConnector.prototype.getTextY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.loopStartTextY;
        }

        /**
            获取圆心X坐标
        */
        LoopStartConnector.prototype.getCircleX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.loopStartCircleX;
        }

        /**
            获取圆心Y坐标
        */
        LoopStartConnector.prototype.getCircleY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.loopStartCircleY;
        }
        return LoopStartConnector;
    })();

    // 选项连接点类 继承自输出点类
    Class.OptionConnector = (function () {
        /**
            选项连接点类
            @parent 所属节点
            @belong 所属组的Key
        */
        function OptionConnector(parent, belong) {
            if (!(this instanceof OptionConnector)) {
                return;
            }
            // 继承自输出点类
            Class.OutputConnector.call(this, parent);
            // 描述
            this.originText = "";
            // 索引
            this.index = 0;
            // 编号
            this.number = 0;
            // 所属组的Key
            this.belong = belong ? belong : "options";
        }
        // 继承自输出类点
        Class.inheritPrototype(Class.OutputConnector, OptionConnector);


        // 连接点精确类型
        OptionConnector.prototype.exactType = ZYDesign.Enum.CONNEXACTTYPE.OPTION;

        /**
            选项是否需要显示圆圈
        */
        OptionConnector.prototype.isCircleNeed = function () {
            return true;
        }

        /**
            获取选项文字X坐标
        */
        OptionConnector.prototype.getTextX = function () {
            // 检查所属检点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionTextXBase;
        }

        /**
            获取选项文字Y坐标
        */
        OptionConnector.prototype.getTextY = function () {
            // 检查所属检点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionTextYBase + this.index * this.parent.optionLineHeight + this.parent.getExtraY();
        }

        /**
            获取选项圆心X坐标
        */
        OptionConnector.prototype.getCircleX = function () {
            // 检查所属检点是否存在
            if (!this.parent) {
                return 0
            }
            // 节点处于收缩状态
            if (this.parent.optionHidden) {
                return this.parent.output.getCircleX()
            }
            return this.parent.optionCircleXBase;
        }

        /**
            获取选项圆心Y坐标
        */
        OptionConnector.prototype.getCircleY = function () {
            // 检查所属检点是否存在
            if (!this.parent) {
                return 0
            }
            // 节点处于收缩状态
            if (this.parent.optionHidden) {
                return this.parent.output.getCircleY()
            }

            return this.parent.optionCircleYBase + this.index * this.parent.optionLineHeight + this.parent.getExtraY();

        }

        /**
            获取选项显示文字
        */
        OptionConnector.prototype.getShowText = function () {
            var width = 143;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }
        return OptionConnector;
    })();

    // 选择题选项类 继承自选项类 
    Class.SelectOptionConnector = (function () {
        /**
            选择题选项类
            @parent 所属节点
        */
        function SelectOptionConnector(parent) {
            if (!(this instanceof SelectOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 选项类型
            this.isOtherOption = false;
            // 其他选项类型
            this.otherType = 1;
            // 是否必填
            this.fillRequired = false;
            // 验证方式
            this.validateType = 1;
            // 验证范围起点
            this.validateStart = 0;
            // 验证范围终点
            this.validateEnd = 50;
            // 验证有错时的提示信息
            this.errorMsg = "输入格式无效！"

        }
        // 继承自选项类 
        Class.inheritPrototype(Class.OptionConnector, SelectOptionConnector);
        /**
            从选项中提取变量
        */
        SelectOptionConnector.prototype.extractVariable = function () {
            // 文本
            var text = this.originText;
            // 开始位置
            var startIndex = text.indexOf("@[");
            // 结束位置
            var endIndex = text.lastIndexOf("]");
            // 没有成对变量标记
            if (startIndex == -1 ||
                endIndex == -1) {
                return null;
            }
            // 提取变量
            var variable = text.substring(startIndex + 2, endIndex);
            return variable;
        }


        /**
            是否需要输出圆圈
        */
        SelectOptionConnector.prototype.isCircleNeed = function () {
            return !(this.isOtherOption && this.otherType == 2);
        }
        return SelectOptionConnector;
    })();

    // 图片选择题选项类
    Class.SelectPicOptionConnector = (function () {
        /**
            选择题选项类
            @parent 所属节点
        */
        function SelectPicOptionConnector(parent) {
            if (!(this instanceof SelectPicOptionConnector)) {
                return;
            }

            // 关联图片;
            this.image = null;

            Class.OptionConnector.call(this, parent);

        }
        // 继承自选项类 
        Class.inheritPrototype(Class.OptionConnector, SelectPicOptionConnector);

        /**
            从选项中提取变量
        */
        SelectPicOptionConnector.prototype.extractVariable = function () {
            // 借用选择题选项的同名方法
            return Class.SelectOptionConnector.prototype.extractVariable.call(this);
        }
        return SelectPicOptionConnector;
    })();

    // 填空题选项类
    Class.FillOptionConnector = (function () {
        /**
            填题选项类
            @parent 所属节点
        */
        function FillOptionConnector(parent) {
            if (!(this instanceof FillOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
        }
        // 继承自选项类 
        Class.inheritPrototype(Class.OptionConnector, FillOptionConnector);

        /**
            是否需要输出圆圈
        */
        FillOptionConnector.prototype.isCircleNeed = function () {
            return false;
        }

        return FillOptionConnector;
    })();

    // 排序题选项类 继承自选项类 
    Class.SequenceOptionConnector = (function () {
        /**
            排序题选项类
            @parent 所属节点
        */
        function SequenceOptionConnector(parent) {
            if (!(this instanceof SequenceOptionConnector)) {
                return;
            }
            // 继承自选项类 
            Class.OptionConnector.call(this, parent);
            // 是否是排序题的目标选项
            this.seqTarget = false;
        }
        // 继承自选项类 
        Class.inheritPrototype(Class.OptionConnector, SequenceOptionConnector);

        /**
            获取选项显示文字
        */
        SequenceOptionConnector.prototype.getShowText = function () {
            var target = "";
            // 查看是否有目标
            for (var i = 0; i < this.parent.options.length; i++) {
                if (this.parent.options[i].seqTarget) {
                    target = this.parent.options[i].originText;
                    break;
                }
            }
            // 有目标
            if (target) {
                var width = 65;
                if (ZYDesign.DesignManager.chartZoomRate < 1) {
                    width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
                }
                var imbedText = ZYDesign.TextUtil.getEllipsisByWidth(width, target, 13);
                return "目标" + imbedText + "排在第" + (this.index + 1) + "位";
            }
            return "目标排在第" + (this.index + 1) + "位";
        }
        return SequenceOptionConnector;
    })();

    // 打分选项类 继承自选项类 
    Class.MarkOptionConnector = (function () {
        /**
            打分选项类
             @parent 所属节点
        */
        function MarkOptionConnector(parent) {
            if (!(this instanceof MarkOptionConnector)) {
                return;
            }
            // 继承自选项类
            Class.OptionConnector.call(this, parent);
        }
        // 继承自选项类 
        Class.inheritPrototype(Class.OptionConnector, MarkOptionConnector);

        /**
            获取选项显示文字
        */
        MarkOptionConnector.prototype.getShowText = function () {
            var width = 130;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }

        /**
            是否需要输出圆圈
        */
        MarkOptionConnector.prototype.isCircleNeed = function () {
            return false;
        }

        return MarkOptionConnector;
    })();

    // 矩阵选项类 继承自选项类
    Class.MatrixOptionConnector = (function () {
        /**
            矩阵选项类
            @parent 所属节点
        */
        function MatrixOptionConnector(parent) {
            if (!(this instanceof MatrixOptionConnector)) {
                return;
            }
            // 继承自选项类
            Class.OptionConnector.call(this, parent);
            // 横向索引
            this.xIndex = 0;
            // 纵向索引
            this.yIndex - 0;
        }

        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, MatrixOptionConnector);

        /**
            获取选项圆心X坐标
        */
        MatrixOptionConnector.prototype.getCircleX = function () {
            return this.parent.optionCircleXBase + this.xIndex * this.parent.optionWidth;
        }

        /**
            获取选项圆心Y坐标
        */
        MatrixOptionConnector.prototype.getCircleY = function () {
            return this.parent.optionCircleYBase + this.yIndex * this.parent.optionLineHeight;
        }
        return MatrixOptionConnector;
    })();

    // 矩阵纵选项类 继承自选项类
    Class.MatrixXOptionConnector = (function () {
        /**
            矩阵纵选项类
            @parent 所属节点
        */
        function MatrixXOptionConnector(parent) {
            if (!(this instanceof MatrixXOptionConnector)) {
                return;
            }
            // 继承自选项类
            Class.OptionConnector.call(this, parent, "optionsX");
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, MatrixXOptionConnector)

        /**
            获取选项头
        */
        MatrixXOptionConnector.prototype.getTitle = function () {
            return "C" + (this.index + 1);
        }

        /**
            获取选项头X坐标
        */
        MatrixXOptionConnector.prototype.getTitleX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionsXTitleX + this.index * this.parent.optionWidth;
        }

        /**
            获取选项头Y坐标
        */
        MatrixXOptionConnector.prototype.getTitleY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionsXTitleY;
        }

        /**
            获取选项显示文字
        */
        MatrixXOptionConnector.prototype.getShowText = function () {
            var width = 65;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }

        /**
            获取选项显示文字X坐标
        */
        MatrixXOptionConnector.prototype.getTextX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionsXTextX + this.index * this.parent.optionWidth;
        }

        /**
            获取选项显示文字Y坐标
        */
        MatrixXOptionConnector.prototype.getTextY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionsXTextY;
        }

        /**
            获取文字旋转参数
        */
        MatrixXOptionConnector.prototype.getTextRotation = function () {
            return "rotate(90," + (this.getTextX() + 5) + "," + (this.getTextY() - 2) + ")";
        }
        return MatrixXOptionConnector;
    })();

    // 矩阵横选项类 继承自选项类
    Class.MatrixYOptionConnector = (function () {
        /**
            矩阵横选项类
            @parent 所属节点
        */
        function MatrixYOptionConnector(parent) {
            if (!(this instanceof MatrixYOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent, "optionsY");
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, MatrixYOptionConnector);

        /**
            获取选项头
        */
        MatrixYOptionConnector.prototype.getTitle = function () {
            return "R" + (this.index + 1);
        }

        /**
            获取选项头X坐标
        */
        MatrixYOptionConnector.prototype.getTitleX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionsYTitleX;
        }

        /**
            获取选项头Y坐标
        */
        MatrixYOptionConnector.prototype.getTitleY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionsYTitleY + this.index * this.parent.optionLineHeight;
        }

        /**
            获取选项文字
        */
        MatrixYOptionConnector.prototype.getShowText = function () {
            var width = 117;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }

        /**
            获取文字X坐标
        */
        MatrixYOptionConnector.prototype.getTextX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionsYTextX;
        }

        /**
            获取文字Y坐标
        */
        MatrixYOptionConnector.prototype.getTextY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0
            }
            return this.parent.optionsYTextY + this.index * this.parent.optionLineHeight;
        }
        return MatrixYOptionConnector;
    })();

    // 地域选项类 继承自选项类
    Class.RegionOptionConnector = (function () {
        /**
            地域选项类
            @parent 所属节点
        */
        function RegionOptionConnector(parent) {
            if (!(this instanceof RegionOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 省级ID
            this.provinceId = 0;
            // 市级ID
            this.cityId = 0;
            // 县级ID
            this.countyId = 0;
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, RegionOptionConnector);

        /**
            获取省
        */
        RegionOptionConnector.prototype.getProvince = function () {
            return ZYDesign.Dict.getProvinceById(this.provinceId);
        }

        /**
            获取市
        */
        RegionOptionConnector.prototype.getCity = function () {
            return ZYDesign.Dict.getProvinceById(this.cityId);
        }

        /**
            获取县
        */
        RegionOptionConnector.prototype.getCounty = function () {
            return ZYDesign.Dict.getProvinceById(this.countyId);
        }

        /**
            获取显示文字
        */
        RegionOptionConnector.prototype.getShowText = function () {
            this.originText = "";
            var province = this.getProvince();
            var city = this.getCity();
            var county = this.getCounty();
            if (province) {
                this.originText += province.text;
            }
            if (city) {
                this.originText += "-"
                this.originText += city.text;
            }
            if (county) {
                this.originText += "-"
                this.originText += county.text;
            }
            var width = 143;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }
        return RegionOptionConnector;
    })();

    // 性别选项类 继承自选项类
    Class.GenderOptionConnector = (function () {
        /**
            性别选项类
            @parent 所属节点
        */
        function GenderOptionConnector(parent) {
            if (!(this instanceof GenderOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 性别ID
            this.genderId = 0;
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, GenderOptionConnector);

        /**
            获取性别
        */
        GenderOptionConnector.prototype.getGender = function () {
            return ZYDesign.Dict.getGenderById(this.genderId);
        }

        /**
            获取显示文字
        */
        GenderOptionConnector.prototype.getShowText = function () {
            this.originText = "";
            var gender = this.getGender();
            if (gender) {
                this.originText += gender.text;
            }
            return this.originText;
        }
        return GenderOptionConnector;
    })();

    // 年龄选项类 继承自选项类
    Class.AgeGroupOptionConnector = (function () {
        /**
            年龄选项类
            @parent 所属节点
        */
        function AgeGroupOptionConnector(parent) {
            if (!(this instanceof AgeGroupOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 开始年龄ID
            this.startAgeGroupId = 0;
            // 结束年龄ID
            this.endAgeGroupId = 0;
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, AgeGroupOptionConnector);

        /**
            获取开始年龄
        */
        AgeGroupOptionConnector.prototype.getStartAgeGroup = function () {
            return ZYDesign.Dict.getAgeGroupById(this.startAgeGroupId);
        }

        /**
            获取结束年龄
        */
        AgeGroupOptionConnector.prototype.getEndAgeGroup = function () {
            return ZYDesign.Dict.getAgeGroupById(this.endAgeGroupId);
        }

        /**
            获取显示文字
        */
        AgeGroupOptionConnector.prototype.getShowText = function () {
            this.originText = "";
            var startAgeGroup = this.getStartAgeGroup();
            var endAgeGroup = this.getEndAgeGroup();
            if (startAgeGroup) {
                this.originText += startAgeGroup.text;
            }
            if (endAgeGroup) {
                this.originText += "-";
                this.originText += endAgeGroup.text;
            }
            return this.originText;
        }
        return AgeGroupOptionConnector;
    })();

    // 婚姻状况选项类 继承自选项类
    Class.MaritalOptionConnector = (function () {
        /**
            婚姻状况选项类
            @parent 所属节点
        */
        function MaritalOptionConnector(parent) {
            if (!(this instanceof MaritalOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 婚姻状况ID
            this.maritalStatusId = 0;
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, MaritalOptionConnector);

        /**
            获取婚姻状况
        */
        MaritalOptionConnector.prototype.getMaritalStatus = function () {
            return ZYDesign.Dict.getMaritalStatusById(this.maritalStatusId);
        }

        /**
            获取显示文字
        */
        MaritalOptionConnector.prototype.getShowText = function () {
            this.originText = "";
            var maritalStatus = this.getMaritalStatus();
            if (maritalStatus) {
                this.originText += maritalStatus.text;
            }
            return this.originText;
        }
        return MaritalOptionConnector;
    })();

    // 教育状况选项类 继承自选项类
    Class.EduOptionConnector = (function () {
        /**
            教育状况选项类
            @parent 所属节点
        */
        function EduOptionConnector(parent) {
            if (!(this instanceof EduOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 学历ID
            this.eduStatusId = 0;
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, EduOptionConnector);

        /**
            获取教育状况
        */
        EduOptionConnector.prototype.getEduStatus = function () {
            return ZYDesign.Dict.getEduStatusById(this.eduStatusId);
        }

        /**
            获取显示文字
        */
        EduOptionConnector.prototype.getShowText = function () {
            this.originText = "";
            var eduStatus = this.getEduStatus();
            if (eduStatus) {
                this.originText += eduStatus.text;
            }
            return this.originText;
        }
        return EduOptionConnector;
    })();

    // 职业选项类 继承自选项类
    Class.OccupationOptionConnector = (function () {
        /**
            职业选项类
            @parent 所属节点
        */
        function OccupationOptionConnector(parent) {
            if (!(this instanceof OccupationOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 职业ID
            this.occupationId = 0;
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, OccupationOptionConnector);

        /**
            获取职业
        */
        OccupationOptionConnector.prototype.getOccupation = function () {
            return ZYDesign.Dict.getOccupationById(this.occupationId);
        }

        /**
            获取显示文字
        */
        OccupationOptionConnector.prototype.getShowText = function () {
            var showText = "";
            this.originText = "";
            var occupation = this.getOccupation();
            if (occupation) {
                this.originText += occupation.text;
            }
            var width = 143;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }
        return OccupationOptionConnector;
    })();

    // 行业选项类 继承自选项类
    Class.ProfessionOptionConnector = (function () {
        /**
            行业选项类
            @parent 所属节点
        */
        function ProfessionOptionConnector(parent) {
            if (!(this instanceof ProfessionOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 行业ID
            this.professionId = 0;
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, ProfessionOptionConnector);

        /**
            获取行业
        */
        ProfessionOptionConnector.prototype.getProfession = function () {
            return ZYDesign.Dict.getProfessionById(this.professionId);
        }

        /**
            获取显示文字
        */
        ProfessionOptionConnector.prototype.getShowText = function () {
            var showText = "";
            this.originText = "";
            var profession = this.getProfession();
            if (profession) {
                this.originText += profession.text;
            }
            var width = 143;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }
        return ProfessionOptionConnector;
    })();

    // 职位选项类 继承自选项类
    Class.JobTitleOptionConnector = (function () {
        /**
            职位选项类
            @parent 所属节点
        */
        function JobTitleOptionConnector(parent) {
            if (!(this instanceof JobTitleOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 职位ID
            this.jobTitleId = 0;
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, JobTitleOptionConnector);

        /**
            获取职位
        */
        JobTitleOptionConnector.prototype.getJobTitle = function () {
            return ZYDesign.Dict.getJobTitleById(this.jobTitleId);
        }

        /**
            获取显示文字
        */
        JobTitleOptionConnector.prototype.getShowText = function () {
            var showText = "";
            this.originText = "";
            var jobTitle = this.getJobTitle();
            if (jobTitle) {
                this.originText += jobTitle.text;
            }
            var width = 143;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }
        return JobTitleOptionConnector;
    })();

    // 收入选项类 继承自选项类
    Class.IncomeOptionConnector = (function () {
        /**
            收入选项类
            @parent 所属节点
        */
        function IncomeOptionConnector(parent) {
            if (!(this instanceof IncomeOptionConnector)) {
                return;
            }
            Class.OptionConnector.call(this, parent);
            // 起始收入ID
            this.incomeStartId = 0;
            // 结束输入ID
            this.incomeEndId = 0;
        }
        // 继承自选项类
        Class.inheritPrototype(Class.OptionConnector, IncomeOptionConnector);

        /**
            获取开始收入
        */
        IncomeOptionConnector.prototype.getIncomeStart = function () {
            return ZYDesign.Dict.getIncomeById(this.incomeStartId);
        }

        /**
            获取结束收入
        */
        IncomeOptionConnector.prototype.getIncomeEnd = function () {
            return ZYDesign.Dict.getIncomeById(this.incomeEndId);
        }

        /**
            获取显示文字
        */
        IncomeOptionConnector.prototype.getShowText = function () {
            var showText = "";
            this.originText = "";
            var incomeStart = this.getIncomeStart();
            var incomeEndId = this.getIncomeEnd();
            if (incomeStart) {
                this.originText += incomeStart.text;
            }
            if (incomeEndId) {
                this.originText += "-";
                this.originText += incomeEndId.text;
            }
            var width = 143;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }

        return IncomeOptionConnector;
    })();

    // 逻辑选项连接点类
    Class.LogicConnector = (function () {
        /**
            逻辑选项连接点类 继承自选项类
        */
        function LogicConnector(parent) {
            if (!(this instanceof LogicConnector)) {
                return;
            }
            // 继承自输出点类
            Class.OutputConnector.call(this, parent);
            // 索引
            this.index = 0;
            // 逻辑名字
            this.originText = "逻辑"
            // 条件列表
            this.requires = [];
        }
        // 继承自输出类点
        Class.inheritPrototype(Class.OutputConnector, LogicConnector);

        /**
            获取文字X坐标
        */
        LogicConnector.prototype.getTextX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.optionTextXBase;
        }

        /**
            获取文字Y坐标
        */
        LogicConnector.prototype.getTextY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            return this.parent.optionTextYBase + this.index * this.parent.optionLineHeight;
        }


        /**
            获取圆心X坐标
        */
        LogicConnector.prototype.getCircleX = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            // 选项隐藏状态
            if (this.parent.optionHidden) {
                return this.parent.output.getCircleX();
            }
            return this.parent.optionCircleXBase
        }

        /**
            获取圆心Y坐标
        */
        LogicConnector.prototype.getCircleY = function () {
            // 检查所属节点是否存在
            if (!this.parent) {
                return 0;
            }
            // 选项隐藏状态
            if (this.parent.optionHidden) {
                return this.parent.output.getCircleY();
            }
            return this.parent.optionCircleYBase + this.index * this.parent.optionLineHeight;
        }

        /**
            获取显示文字
        */
        LogicConnector.prototype.getShowText = function () {
            var width = 143;
            if (ZYDesign.DesignManager.chartZoomRate < 1) {
                width = Math.round(width * ZYDesign.DesignManager.chartZoomRate);
            }
            return ZYDesign.TextUtil.getEllipsisByWidth(width, this.originText, 13);
        }

        /**
            选项是否需要显示圆圈
        */
        LogicConnector.prototype.isCircleNeed = function () {
            return true
        }
        /**
            收集条件信息
        */
        LogicConnector.prototype.collectRequires = function () {
            var requiresJson = [];
            for (var i = 0; i < this.requires.length; i++) {
                var require = this.requires[i];
                var requireJson = {};
                requireJson.index = require.index;
                requireJson.originText = require.originText;
                requireJson.arithmetic = require.arithmetic;
                requireJson.limitType = require.limitType;
                requireJson.answerFirst = require.answerFirst;
                requireJson.answerSecond = require.answerSecond;
                requireJson.subjectId = require.subjectId;
                requireJson.rowId = require.rowId;
                requireJson.columnId = require.columnId;
                requiresJson.push(requireJson);
            }
            return requiresJson;
        }

        /**
            增加条件
            @requireJson 条件内容
        */
        LogicConnector.prototype.addRequire = function (requireJson) {
            var require = new ZYDesign.Class.LogicRequireModel(this);
            // 索引
            require.index = requireJson.index ? requireJson.index : this.requires.length;
            // 条件名
            require.originText = requireJson.text ? requireJson.text : "条件" + (this.requires.length + 1);
            // 运算方法
            require.arithmetic = requireJson.arithmetic;
            // 限制方式
            require.limitType = requireJson.limitType;
            // 答案1
            require.answerFirst = requireJson.answerFirst;
            // 答案2
            require.answerSecond = requireJson.answerSecond;
            // 题目ID
            require.subjectId = requireJson.subjectId;
            // 行ID
            require.rowId = requireJson.rowId;
            // 列ID
            require.columnId = requireJson.columnId;
            require.relatedSubject = ZYDesign.DesignManager.searchSubjectById(require.subjectId);
            this.requires.push(require);
        }

        /**
            移除条件
            @require 要移除的条件
        */
        LogicConnector.prototype.removeRequire = function (require) {
            var index = -1;
            for (var i = 0; i < this.requires.length; i++) {
                var req = this.requires[i];
                // 找到该条件
                if (req == require) {
                    // 从列表中移除该条件
                    this.requires.splice(i, 1);
                    index = i
                }
                // 之后的条件索引降落
                if (i > index && i > 0) {
                    req.index -= 1;
                }
            }
        }

        /**
            生成条件列表
            @requiresJson 条件内容列表
        */
        LogicConnector.prototype.initRequires = function (requiresJson) {
            // 检查
            if (!requiresJson) {
                return;
            }
            this.requires = [];
            for (var i = 0; i < requiresJson.length; i++) {

                var requireJson = requiresJson[i];
                this.addRequire(requireJson);
            }
        }
        return LogicConnector;
    })();

    // 连接对象类 继承自可选择类
    Class.ConnectionModel = (function () {
        /**
            连接对象类
        */
        function ConnectionModel() {
            if (!(this instanceof ConnectionModel)) {
                return;
            }
            // 继承自可选择类
            Class.Selectable.call(this);
            // 记录源连接点
            this.source = null;
            // 记录目标连接点
            this.dest = null;
            // 临时标志
            this.temp = false;
            // 是否不响应鼠标事件（zy）
            this.disable = false;
            // ID
            this.uuid = ZYDesign.UuidUtil.generate();
            // 是否可见
            this.visible = true;
        }
        // 继承自可选择类
        Class.inheritPrototype(Class.Selectable, ConnectionModel);

        
        /**
            重写选择
        */
        ConnectionModel.prototype.select = function () {
            ConnectionModel.base.select.call(this);
            if (this.dest) {
                this.dest.select();
                this.source.select();
            }
        }

        /**
            重写反选
        */
        ConnectionModel.prototype.deselect = function () {
            ConnectionModel.base.deselect.call(this);
            if (this.dest) {
                this.dest.deselect();
                this.source.deselect();
            }
        }

        /**
           重写覆盖
       */
        ConnectionModel.prototype.hover = function () {
            ConnectionModel.base.hover.call(this);
            if (this.dest) {
                this.dest.connHovered = true;
                this.source.connHovered = true;
            }
        }

        /**
            重写取消覆盖
        */
        ConnectionModel.prototype.unhover = function () {
            ConnectionModel.base.unhover.call(this);
            if (this.dest) {
                this.dest.connHovered = false;
                this.source.connHovered = false;
            }
        }

        /**
            是否不响应鼠标事件(zy)
        */
        ConnectionModel.prototype.isDisabled = function () {
            return this.temp || this.disable;
        }

        /**
            建立双边关系
        */
        ConnectionModel.prototype.ApplyTwowayRelationship = function () {
            // 临时连接对象不建立双边关系
            if (this.temp) {
                return;
            }
            // 将连接起点加入连接终点的源列表
            this.dest.sources.push(this.source);

            // 如果是从随机开始输出点出来的要特殊处理
            if (this.source.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART) {
                // 将连接终点加入到连接起点的源列表
                this.source.dests.push(this.dest);
                // 其他输出点出来的
            } else {
                // 将连接起点的目标设置为连接终点
                this.source.dest = this.dest;
            }


            // 把自己添加到源和终点的相关链接点列表中
            this.source.parent.relatedConnections.push(this);
            this.dest.parent.relatedConnections.push(this);
        }

        /**
            移除双边关系
        */
        ConnectionModel.prototype.removeTwowayRelationship = function () {
            // 将连接起点从连接终点的源列表中移除
            for (var i = 0; i < this.dest.sources.length; i++) {
                var source = this.dest.sources[i];
                // 找到该点
                if (source == this.source) {
                    //  移除
                    this.dest.sources.splice(i, 1);
                    break;
                }
            }
            // 如果是从随机开始输出点出来的要特殊处理
            if (this.source.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART) {
                // 将连接终点从连接起点的终点列表中移除
                for (var i = 0; i < this.source.dests.length; i++) {
                    var dest = this.source.dests[i];
                    // 找到该点
                    if (dest == this.dest) {
                        //  移除
                        this.source.dests.splice(i, 1);
                        break;
                    }
                }
                // 其他输出点出来的
            } else {
                // 将连接起点的目标置空
                this.source.dest = null;
            }


            var sourceNode = this.source.parent;

            // 将自己从源节点的连接列表中删除
            for (var i = 0; i < sourceNode.relatedConnections.length; i++) {
                var conn = sourceNode.relatedConnections[i];
                // 找到自己
                if (conn == this) {
                    // 移除
                    sourceNode.relatedConnections.splice(i, 1);
                    break;
                }
            }

            var destNode = this.dest.parent;

            // 将自己从目标节点的连接列表中删除
            for (var i = 0; i < destNode.relatedConnections.length; i++) {
                var conn = destNode.relatedConnections[i];
                // 找到自己
                if (conn == this) {
                    // 移除
                    destNode.relatedConnections.splice(i, 1);
                    break;
                }
            }
        }

        /**
            获取连接对象起始点X坐标
        */
        ConnectionModel.prototype.sourceCoordX = function () {
            return this.source.getCircleX() + this.source.parent.getX();
        }

        /**
           获取连接对象起始点Y坐标
        */
        ConnectionModel.prototype.sourceCoordY = function () {
            return this.source.getCircleY() + this.source.parent.getY();
        }

        /**
           获取连接对象起始正切点X坐标
        */
        ConnectionModel.prototype.sourceTangentX = function () {
            var diff = (this.destCoordX() - this.sourceCoordX()) / 2,
                diffAbs = Math.abs(diff);
            diffAbs = diffAbs < 100 ? diffAbs : 100 + (diffAbs - 100) / 6;
            // 简单贝塞尔曲线支撑点
            var x = this.sourceCoordX() + diff;
            
            //// 复杂贝塞尔曲线支撑点
            //// 随机开始和循环开始特殊处理
            //if ((this.source.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART ||
            //    this.source.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART) ) {
            //    // 终点在起点之后
            //    if (this.destCoordX() > this.sourceCoordX()) {        
            //        // 起点支撑点需要回转
            //        x = this.sourceCoordX() - diffAbs;
            //    }
            //// 其他场合
            //} else {
            //    // 终点在起点之前
            //    if (this.destCoordX() < this.sourceCoordX()) {
            //        // 起点支撑点需要回转
            //        x = this.sourceCoordX() + diffAbs;
            //    } 
            //}
            
            return x;
        }

        /**
           获取连接对象起始正切点Y坐标
        */
        ConnectionModel.prototype.sourceTangentY = function () {
            return this.sourceCoordY();
        }

        /**
           获取连接对象目标正切点X坐标
        */
        ConnectionModel.prototype.destTangentX = function () {
            var diff = (this.destCoordX() - this.sourceCoordX()) / 2,
                diffAbs = Math.abs(diff);
            diffAbs = diffAbs < 100 ? diffAbs : 100 + (diffAbs - 100) / 6;
            // 简单贝塞尔曲线支撑点
            var x = this.destCoordX() - diff;

            //// 复杂贝塞尔曲线支撑点
            //// 循环结束特殊处理
            //if (this.dest.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPEND) {
            //    // 终点在起点之后
            //    if (this.destCoordX() > this.sourceCoordX()) {               
            //        // 终点支撑点需回转
            //        x = this.destCoordX() + diffAbs;
            //    }
            //// 其他情况
            //} else {
            //    // 终点在起点之前
            //    if (this.destCoordX() < this.sourceCoordX()) {
                    
            //        // 终点支撑点需回转
            //        x = this.destCoordX() - diffAbs;
            //    }
            //}        
            return x;
        }

        /**
           获取连接对象目标正切点Y坐标
        */
        ConnectionModel.prototype.destTangentY = function () {
            return this.destCoordY();
        }

        /**
           获取连接对象目标点X坐标
        */
        ConnectionModel.prototype.destCoordX = function () {
            return this.dest.getCircleX() + this.dest.parent.getX();
        }

        /**
           获取连接对象目标点Y坐标
        */
        ConnectionModel.prototype.destCoordY = function () {
            return this.dest.getCircleY() + this.dest.parent.getY();
        }

        /**
            获取路径样式类
        */
        ConnectionModel.prototype.getPathCls = function () {
            var cls = "connection_line";
            if (this.isSelected()) {
                cls = "selected_connection_line";
            } else if (this.isHovered()) {
                cls = "mouseover_connection_line";
            }
            return cls;
        }

        /**
            获取路径D属性
        */
        ConnectionModel.prototype.getPathD = function () {
            return "M" + this.sourceCoordX() + "," +
                this.sourceCoordY() + " C " +
                this.sourceTangentX() + "," +
                this.sourceTangentY() + " " +
                this.destTangentX() + "," +
                this.destTangentY() + " " +
                this.destCoordX() + "," +
                this.destCoordY();
        }

        /**
            获取圆类
        */
        ConnectionModel.prototype.getCircleCls = function () {
            var cls = "connection_endpoint";
            if (this.isSelected()) {
                cls = "selected_connection_endpoint";
            } else if (this.isHovered()) {
                cls = "mouseover_connection_endpoint";
            }
            return cls;
        }

        /**
            获取开始圆类
        */
        ConnectionModel.prototype.getSrcCircleCls = function () {
            return this.getCircleCls() + " src_circle"
        }

        /**
            获取结束圆类
        */
        ConnectionModel.prototype.getDestCircleCls = function () {
            return this.getCircleCls() + " dest_circle"
        }

        /**
            修复位置
        */
        ConnectionModel.prototype.fixPosition = function () {
            var connElem = $("#" + this.uuid);
            connElem.find("path").attr("d", this.getPathD());
            connElem.find(".src_circle").attr({
                cx: this.sourceCoordX(),
                cy: this.sourceCoordY(),
            });
            connElem.find(".dest_circle").attr({
                cx: this.destCoordX(),
                cy: this.destCoordY(),
            })
        }

        /**
            获取左边位置
        */
        ConnectionModel.prototype.getX = function () {
            return Math.min(this.sourceCoordX(), this.destCoordX());
        }

        /**
            获取右边位置
        */
        ConnectionModel.prototype.getRight = function () {
            return Math.max(this.sourceCoordX(), this.destCoordX());
        }

        /**
            获取上边位置
        */
        ConnectionModel.prototype.getY = function () {
            return Math.min(this.sourceCoordY(), this.destCoordY());
        }

        /**
            获下右边位置
        */
        ConnectionModel.prototype.getBottom = function () {
            return Math.max(this.sourceCoordY(), this.destCoordY());
        }

        /**
            监听连接显示与否
            只有在当前视口的连接才显示
        */
        ConnectionModel.prototype.checkVisible = function () {
            var designManager = ZYDesign.DesignManager,
                containerInfo = designManager.containerInfo,
                rate = designManager.chartZoomRate,
                changed = false,
                visible = true;
            // 不在视口内不可见
            if (this.getX() * rate > containerInfo.right ||
                this.getRight() * rate < containerInfo.left ||
                this.getBottom() * rate < containerInfo.top ||
                this.getY() * rate > containerInfo.bottom) {
                visible = false
            }
            if (this.visible != visible) {
                changed = true;
            }
            this.visible = visible;
            return changed;
        }
        return ConnectionModel;
    })();

    // 逻辑条件类
    Class.LogicRequireModel = (function () {
        /**
            逻辑条件类
        */
        function LogicRequireModel(parent) {
            if (!(this instanceof LogicRequireModel)) {
                return;
            }
            // 条件名字
            this.originText = "条件";
            // 该条件运算方法(与或非)
            this.arithmetic = 0;
            // 本条件相关的题目
            this.relatedSubject = "";
            // 关联题目名
            this.subjectId = "";
            // 已选行ID
            this.rowId = "";
            // 已选列ID
            this.columnId = "";
            // 限制方式
            this.limitType = 0;
            // 答案1
            this.answerFirst = "";
            // 答案2
            this.answerSecond = "";
            // 所在逻辑选项
            this.parent = parent;
        }


        /**
            是否开启两个答案
        */
        LogicRequireModel.prototype.isDoubleAnswerEnabled = function () {
            // 介于和不解于的时候开始双答案
            if (this.limitType == 0 ||
                this.limitType == 1) {
                return true;
            }
            return false;
        }

        /**
            开启列选择
        */
        LogicRequireModel.prototype.isColumnEnabled = function () {
            // 不存在相关联题目
            if (!this.relatedSubject) {
                return false;
            }
            // 关联题目是矩阵题
            if (this.relatedSubject.type == ZYDesign.Enum.NODETYPE.MATRIX) {
                return true;
            }
            return false;
        }

        /**
            获取选项
        */
        LogicRequireModel.prototype.getOptions = function () {
            // 不存在相关联题目
            if (!this.relatedSubject) {
                return false;
            }
            if (this.relatedSubject.type == ZYDesign.Enum.NODETYPE.MATRIX) {
                return this.relatedSubject.optionsX;
            }
            return this.relatedSubject.options;
        }

        /**
           开启行选择
        */
        LogicRequireModel.prototype.isRowEnabled = function () {
            // 不存在相关联题目
            if (!this.relatedSubject) {
                return false;
            }
            // 关联题目是矩阵题
            if (this.relatedSubject.type == ZYDesign.Enum.NODETYPE.MATRIX
                || this.relatedSubject.type == ZYDesign.Enum.NODETYPE.SELECT
                || this.relatedSubject.type == ZYDesign.Enum.NODETYPE.MARK) {
                return true;
            }
            return false;
        }
        return LogicRequireModel;
    })();

    // 虚拟节点 继承自可选择类
    Class.VitualNode = (function () {
        /**
            虚拟节点
        */
        function VitualNode() {
            if (!(this instanceof VitualNode)) {
                return;
            }
            // 继承自可选择类
            Class.Selectable.call(this);
            this.x = 0;
            this.y = 0;
            this.isVitual = true;
        }

        // 继承自可选择类
        Class.inheritPrototype(Class.Selectable, VitualNode);

        /**
               获取节点位置X轴坐标
           */
        VitualNode.prototype.getX = function () {
            return this.x - ZYDesign.DesignManager.chartXDiffer;
        }
        /**
           获取节点位置Y轴坐标
        */
        VitualNode.prototype.getY = function () {
            return this.y - ZYDesign.DesignManager.chartYDiffer;
        }

        /**
            获取节点宽度
        */
        VitualNode.prototype.getWidth = function () {
            return 0;
        }

        /**
           获取节点高度
        */
        VitualNode.prototype.getHeight = function () {
            return 0;
        }

        /**
           获取节点右边框位置
        */
        VitualNode.prototype.getRight = function () {
            return this.getX() + this.getWidth();
        }

        /**
            获取节点下边框位置
        */
        VitualNode.prototype.getBottom = function () {
            return this.getY() + this.getHeight();
        }
        return VitualNode;
    })();

    // 节点基类 继承自可选择类
    Class.NodeBase = (function () {
        /**
            节点基类
            该类中声明的方法行为,如在子类中有不同的需求应复写该类的方法
        */
        function NodeBase() {
            if (!(this instanceof NodeBase)) {
                return;
            }
            // 继承自可选择类
            Class.Selectable.call(this);
            // 内容是否发生修改
            this.dirty = false;
            // 模式 0:设计 1:甄别 3:其它
            this.mode = 0;
            // 顺序号
            this.sortNo = -1;
            // 背景颜色
            this.backgroundColor = "#4593D0";
            // 节点高度
            this.height = 0;
            // 节点位置X坐标
            this.x = 0;
            // 节点位置Y坐标
            this.y = 0;
            // 节点宽度
            this.width = 0;
            // 节点ID
            this.nodeUuid = "";
            // 节点名字
            this.nodeName = "Q";
            // 和本节点相关的连接
            this.relatedConnections = [];
            // 原始数据
            this.originData = {};
            // 在路径中的位置
            this.order = -1;
            // 关联图片;
            this.image = null;
            // 校验结果
            this.validateResult = null;
            // 是否可见
            this.visible = true;

            /******页面控制专用属性******/
            // 是否使用媒体
            this.useMedia = false;

            /******页面控制专用属性******/
        }

        // 继承自可选择类
        Class.inheritPrototype(Class.Selectable, NodeBase);

        // 圆圈半径
        NodeBase.prototype.circleR = 5;
        // 节点类型
        NodeBase.prototype.type = ZYDesign.Enum.NODETYPE.BASE;
        // 背景圆角弧度
        NodeBase.prototype.backgroundRadius = 5;
        // 节点类型
        NodeBase.prototype.typeInt = -1;
        // 节点分类类型
        NodeBase.prototype.categoryType = -1;
        // 节点通用类型
        NodeBase.prototype.commonType = "BASE";
        // 类型列表字段
        NodeBase.prototype.typeListKey = "";
        // 断开连接可用
        NodeBase.prototype.breakDisabled = false;
        // 复制可用
        NodeBase.prototype.copyDisabled = false;
        // 删除可用
        NodeBase.prototype.removeDisabled = false;
        // 预览可用
        NodeBase.prototype.previewDisabled = false;
        // 批量输入可用
        NodeBase.prototype.optionbatchDisabled = false;
        // 配置宽度与节点实际宽度差
        NodeBase.prototype.differWidth = 0;
        // 配置高度与节点实际高度差
        NodeBase.prototype.differHeight = 0;
        // 是否有附加操作
        NodeBase.prototype.addition = false;
        // 输出文字是否可变化
        NodeBase.prototype.outputTextChangable = false;
        // 节点名长度限制
        NodeBase.prototype.nameLengthLimit = 20;
        // 节点名编辑上部显示的文字
        NodeBase.prototype.nameText = "编号";
        // 节点描述编辑上部显示的文字
        NodeBase.prototype.describeText = "问题描述";
        // 是否禁用媒体
        NodeBase.prototype.mediaDisable = false;
        // 是否允许编辑节点名
        NodeBase.prototype.nodeNameEditable = true;


        /**
            标记发生变化
        */
        NodeBase.prototype.markChange = function () {
            this.dirty = true;
        }

        /**
            获取切换媒体图标处的文字
        */
        NodeBase.prototype.getMediaIconText = function () {
            return this.useMedia ?
                "删除媒体" :
                "添加媒体";
        }

        /**
            获取额外的Y坐标高度
        */
        NodeBase.prototype.getExtraY = function () {
            // 甄别模式下的节点因为多了一个头所以高度要多一点
            return this.mode == 1 ? 30 : 0;
        }

        /**
            获取节点名X坐标
        */
        NodeBase.prototype.getNodeNameX = function () {
            return 0;
        }

        /**
            获取节点名Y坐标
        */
        NodeBase.prototype.getNodeNameY = function () {
            return -6;
        }

        /**
            获取警告标志变换信息
        */
        NodeBase.prototype.getWarnIconTrasform = function () {
            return "translate(180, -20)";
        }

        /**
            判断节点是否属于某个类型
            @type 类型
        */
        NodeBase.prototype.isTypeOf = function (type) {
            return type.toUpperCase() == this.type;
        }

        /**
            判断节点是否属于某些类型中的一个
            @typeList 类型列表
        */
        NodeBase.prototype.isTypeIn = function (typeList) {
            var list = typeList.toString().split(",");
            for (var i = 0; i < list.length; i++) {
                var type = list[i];
                if (type.toUpperCase() == this.type) {
                    return true;
                }
            }
            return false;
        }

        /**
            是否为终端节点
        */
        NodeBase.prototype.isTerminal = function () {
            return this.commonType == ZYDesign.Enum.NODECOMMONTYPE.TERMINAL;
        }

        /**
            是否需要输入口
        */
        NodeBase.prototype.isInputNeed = function () {
            // 甄别节点,开始节点,注释节点不需要输入口
            return !(this.type == ZYDesign.Enum.NODETYPE.CHECK ||
                    this.type == ZYDesign.Enum.NODETYPE.START ||
                    this.type == ZYDesign.Enum.NODETYPE.COMMENT)
        }

        /**
            是否需要输出口
        */
        NodeBase.prototype.isOutputNeed = function () {
            // 结束节点,注释节点不需要输入口
            return !(this.type == ZYDesign.Enum.NODETYPE.END ||
                    this.type == ZYDesign.Enum.NODETYPE.COMMENT)
        }

        /**
            是否需要分割线
        */
        NodeBase.prototype.isLineNeed = function () {
            // 题目节点信息节点或工具节点需要分割线
            return (this.commonType == ZYDesign.Enum.NODECOMMONTYPE.SUBJECT ||
                    this.commonType == ZYDesign.Enum.NODECOMMONTYPE.TOOL ||
                    this.commonType == ZYDesign.Enum.NODECOMMONTYPE.INFO)
        }

        /**
            是否需要选项分割线
        */
        NodeBase.prototype.isLineTNeed = function () {
            // 有其他选项的时候才需要选项分割线
            return (this.hasOtherOption instanceof Function &&
                    this.hasOtherOption())
        }

        /**
            是否需要头部
        */
        NodeBase.prototype.isHeadNeed = function () {
            // 甄别节点工具节点和注释节点需要头部
            return (this.commonType == ZYDesign.Enum.NODECOMMONTYPE.TOOL ||
                    this.type == ZYDesign.Enum.NODETYPE.COMMENT ||
                    this.mode == 1)
        }

        /**
            是否为题目节点
        */
        NodeBase.prototype.isSubject = function () {
            return this.commonType == ZYDesign.Enum.NODECOMMONTYPE.SUBJECT;
        }

        /**
            获取节点位置X轴坐标
        */
        NodeBase.prototype.getX = function () {
            return this.x - ZYDesign.DesignManager.chartXDiffer + 6;
        }
        /**
           获取节点位置Y轴坐标
        */
        NodeBase.prototype.getY = function () {
            return this.y - ZYDesign.DesignManager.chartYDiffer + 24;
        }

        /**
           获取节点位置X轴坐标(鹰眼)
        */
        NodeBase.prototype.getEyeX = function () {
            return this.x - ZYDesign.DesignManager.eyeXDiffer;
        }

        /**
           获取节点位置Y轴坐标(鹰眼)
        */
        NodeBase.prototype.getEyeY = function () {
            return this.y - ZYDesign.DesignManager.eyeYDiffer;
        }

        /**
            获取节点宽度
        */
        NodeBase.prototype.getWidth = function () {
            return this.width + this.differWidth;
        }

        /**
           获取节点背景宽度
        */
        NodeBase.prototype.getBackgroundWidth = function () {
            return this.width;
        }

        /**
           获取节点高度
        */
        NodeBase.prototype.getHeight = function () {
            var extra = this.getExtraY();
            if (this.optionHidden) {
                return 74 + extra;
            }
            return this.height + this.differHeight + extra;
        }

        /**
           获取节点背景宽度
        */
        NodeBase.prototype.getBackgroundHeight = function () {
            return this.getHeight() - 14;
        }

        /**
            获取背景颜色
        */
        NodeBase.prototype.getBackgroundColor = function () {
            return this.backgroundColor;
        }

        /**
            获取背景顶部位置
        */
        NodeBase.prototype.getBackgroundTop = function () {
            return 0;
        }

        /**
            获取背景左部位置
        */
        NodeBase.prototype.getBackgroundLeft = function () {
            return 0;
        }

        /**
            获取背景圆角弧度
        */
        NodeBase.prototype.getBackgrounRadius = function () {
            return this.backgroundRadius;
        }


        /**
            维护节点宽度
            节点选项变更后尺寸应发生变化,用此方法可以维持尺寸正确
            此处紧紧声明该方法,子类应根据需要重写该方法
        */
        NodeBase.prototype.maintainWidth = function () {

        }

        /**
            维护节点高度
            节点选项变更后尺寸应发生变化,用此方法可以维持尺寸正确
            此处紧紧声明该方法,子类应根据需要重写该方法
        */
        NodeBase.prototype.maintainHeight = function () {

        }

        /**
            获取节点右边框位置
        */
        NodeBase.prototype.getRight = function () {
            return this.getX() + this.getWidth();
        }

        /**
            获取节点下边框位置
        */
        NodeBase.prototype.getBottom = function () {
            return this.getY() + this.getHeight();
        }

        /**
            初始化节点
            各子类如要初始化不同的内容则要复写该方法
            @nodeData 数据来源
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        NodeBase.prototype.init = function (nodeData, x, y) {
            // 原始数据来源
            this.originData = nodeData;
            // 位置X坐标
            this.x = typeof (x) == "number" ? x : this.originData.x;
            // 位置Y坐标
            this.y = typeof (y) == "number" ? y : this.originData.y;
            // id
            this.nodeUuid = nodeData.nodeUuid ? nodeData.nodeUuid : ZYDesign.UuidUtil.generate();
            // 模式
            if (this.originData.mode) {
                this.mode = this.originData.mode;
            }
            // 节点名
            if (this.originData.nodeName) {
                this.nodeName = this.originData.nodeName;
            }
            // 初始化的时候要加序号并根据缩放率调整初始位置
            if (this.originData.isInit) {
                if (!this.originData.isCopy) {
                    var rangeX = ZYDesign.DesignManager.chartXDiffer - this.x;
                    var dX = rangeX - rangeX / ZYDesign.DesignManager.chartZoomRate;
                    this.x += dX;
                    var rangeY = ZYDesign.DesignManager.chartYDiffer - this.y;
                    var dY = rangeY - rangeY / ZYDesign.DesignManager.chartZoomRate;
                    this.y += dY;
                }
            }
            // 背景色
            if (this.originData.backgroundColor) {
                this.backgroundColor = this.originData.backgroundColor;
            }

            // 图片
            this.image = ZYDesign.DesignManager.imageUploadManager.getImageById(nodeData.questionImageId);
            // 是否使用媒体
            this.useMedia = !!this.image;
        }

        /**
            收集目标去向列表
        */
        NodeBase.prototype.collectDestList = function () {
            // 列表
            var destList = [];
            // 循环所有相关连接
            for (var i = 0; i < this.relatedConnections.length; i++) {
                var connection = this.relatedConnections[i];
                // 该链接是从自身输出
                if (connection.source.parent == this) {
                    // 收集该链接的信息
                    var dest = {
                        selfPortId: connection.source.outputId,
                        destInputId: connection.dest.inputId,
                    }
                    // 推到列表中
                    destList.push(dest);
                }
            }
            return destList;
        }

        /**
            更新节点名字
            @value 值
        */
        NodeBase.prototype.updateName = function (value) {
            this.nodeName = value;
        }

        /**
            获取用来显示的节点名字
        */
        NodeBase.prototype.getShowNodeName = function () {
            return ZYDesign.TextUtil.getEllipsisByWidth(this.width - 47, this.nodeName, 13);
        }

        /**
            导出该节点为Json数据
            基类中会收集一些基本的数据,各子类有其他数据需收集需重写该方法
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        NodeBase.prototype.exportJson = function (questionairId, jsonHolder) {
            jsonHolder.questionairId = questionairId;                // 所属问卷ID
            jsonHolder.mode = this.mode;                             // 所属模式 0:甄别模式 1:设计模式
            jsonHolder.sortNo = this.sortNo;                         // 序号
            jsonHolder.x = this.x;                                   // X坐标
            jsonHolder.y = this.y;                                   // Y坐标
            jsonHolder.backgroundColor = this.backgroundColor;       // 背景颜色
            jsonHolder.nodeName = this.nodeName;                     // 节点名称
            jsonHolder.nodeUuid = this.nodeUuid;                     // 节点ID
            jsonHolder.type = this.typeInt;                          // 节点类型
            jsonHolder.categoryType = this.categoryType;             // 节点分类
            jsonHolder.commonType = this.commonType;                 // 节点通用类型
            jsonHolder.questionImageId = this.image ? this.image.id : "";
            jsonHolder.questionImageName = this.image ? this.image.serverFileName : "";
            jsonHolder.imageOriginName = this.image ? this.image.fileName : "";
            jsonHolder.order = this.order;
        }

        /**
            是否允许显示文字
        */
        NodeBase.prototype.allowShowText = function () {
            // 比例小于等于50%不显示
            if (ZYDesign.DesignManager.chartZoomRate <= 0.5) {
                return false;
            }
            return true;
        }

        /**
            获得节点的变换属性
        */
        NodeBase.prototype.getTransform = function () {
            return "translate(" + this.getX() + "," + this.getY() + ")";
        }

        /**
           获得节点的变换属性(鹰眼区域)
        */
        NodeBase.prototype.getEyeTransform = function () {
            return "translate(" + this.getX() + "," + this.getY() + ")";
        }


        /**
            节点信息中是否含有关键字
            子类中有特殊处理需复写该方法
        */
        NodeBase.prototype.hasKeyword = function (keyword) {
            // 检查节点名
            if (this.nodeName.indexOf(keyword) > -1) {
                return true;
            }
            return false;
        }

        /**
            获取控制按钮区域位置偏移量
        */
        NodeBase.prototype.getCtrIconTransform = function () {
            var transform = "translate(0," + (this.getBackgroundHeight()) + ")";
            return transform;
        }

        /**
            生成当前节点的一个数据副本并返回
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
            子类复写
        */
        NodeBase.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            jsonHolder.isInit = true;     // 初始化标记
            jsonHolder.isCopy = true;     // 复制标记
            jsonHolder.mode = this.mode;  // 模式
            jsonHolder.x = this.x + diffX;   // X坐标
            jsonHolder.y = this.y + diffY;   // Y坐标
            jsonHolder.backgroundColor = this.backgroundColor;  // 背景颜色
            jsonHolder.questionImageId = this.image ? this.image.id : "";
        }


        /**
            是否有普通通路通向某个(某类型)节点
            经过循环开始,循环结束,随机开始等端口的路径不考虑在内
            @destNode 目标节点  优先使用该参数,该参数为空时使用第二个参数
            @destType 目标节点类型
        */
        NodeBase.prototype.hasRouteTo = function (destNode, destType) {
            // 检查
            if (!destNode && !destType) {
                return false;
            }
            if (destNode == this || this.type == destType) {
                return true;
            }
            var handler = {
                result: false,
                doneList: [],
                // 判断某个节点是否已经扫描过
                alreadyDone: function (node) {
                    for (var i = 0; i < this.doneList.length; i++) {
                        if (node == this.doneList[i]) {
                            return true;
                        }
                    }
                    return false;
                }
            }
            // 开始找路
            this.searchDestNode(handler, destNode, destType);
            return handler.result;
        }

        /**
            通过通路搜索目标节点
            @handler 扫描结果存储对象
            @destNode 目标节点  优先使用该参数,该参数为空时使用第三个参数
            @destType 目标节点类型
        */
        NodeBase.prototype.searchDestNode = function (handler, destNode, destType) {
            // 已找到通路
            if (handler.result) {
                return;
            }
            handler.doneList.push(this);
            // 初始化端口列表
            var conns = [];
            // 有输入来源
            if (this.input && this.input.sources) {
                // 将输入来源加入扫描列表
                conns = conns.concat(this.input.sources);
            }
            // 有总输出目标
            if (this.output && this.output.dest) {
                // 将总输出目标加入扫描列表
                conns = conns.concat(this.output.dest);
            }
            // 有选项
            if (this.options) {
                for (var i = 0; i < this.options.length; i++) {
                    var option = this.options[i];
                    // 该选项有输出目标
                    if (option.dest) {
                        // 将该输出目标加入扫描列表
                        conns = conns.concat(option.dest)
                    }
                }
            }

            for (var i = 0; i < conns.length; i++) {
                var conn = conns[i]
                // 碰到经过随机开始,循环开始,循环结束端口的路径
                if (conn.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART ||
                    conn.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPEND ||
                    conn.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART) {
                    // 跳过
                    continue;
                } else {
                    var node = conn.parent;
                    // 该节点之前已经扫描过
                    if (handler.alreadyDone(node)) {
                        // 跳过
                        continue;
                    }
                    // 找到了通路
                    if (node == destNode || node.exactType == destType) {
                        handler.result = true;
                        return;
                        // 未找到通路
                    } else {
                        // 递归扫描里层
                        node.searchDestNode(handler, destNode, destType)
                        // 里层已经找到通路
                        if (handler.result) {
                            return
                        }
                    }
                }

            }
        }

        /**
            获取所参与的循环圈的一层循环节点ID
        */
        NodeBase.prototype.getCircleNode1Id = function () {
            // 获取当前节点所处状态
            var firstEngagement = this.getEngagement();
            // 不在循环圈内
            if (firstEngagement.status != ZYDesign.Enum.NODESTATE.LOOP) {
                return "";
            }
            // 循环圈所属循环节点
            var firstNode = firstEngagement.dueToNode;
            // 该循环节点的状态
            var secondEngagement = firstNode.getEngagement();
            //该循环节点又处在另一个循环圈中
            if (secondEngagement.status == ZYDesign.Enum.NODESTATE.LOOP) {
                // 返回上层循环节点的id
                return secondEngagement.dueToNode.nodeUuid;
                // 只有一层循环
            } else {
                // 返回当前节点的id
                return firstNode.nodeUuid;
            }
        }

        /**
            获取所参与的循环圈的二层循环节点ID
        */
        NodeBase.prototype.getCircleNode2Id = function () {
            // 获取当前节点所处状态
            var firstEngagement = this.getEngagement();
            // 不在循环圈内
            if (firstEngagement.status != ZYDesign.Enum.NODESTATE.LOOP) {
                return "";
            }
            // 循环圈所属循环节点
            var firstNode = firstEngagement.dueToNode;
            // 该循环节点的状态
            var secondEngagement = firstNode.getEngagement();
            //该循环节点又处在另一个循环圈中(有两层循环)
            if (secondEngagement.status == ZYDesign.Enum.NODESTATE.LOOP) {
                // 返回当前节点的id
                return firstNode.nodeUuid;
                // 只有一层循环
            } else {
                // 返回
                return "";
            }
        }


        /**
            获取节点的当前状态
            有以下几种状态:
            FREE:自由状态,孤立状态
            FREEWITHTOOL:自由状态和工具节点一起
            NORMAL:已经在正常通路中,开始节点,结束节点,甄别节点永远是该状态
            RANDOM:已经被随机组占用
            LOOP:已经被循环圈占用
        */
        NodeBase.prototype.getEngageStatus = function () {
            return this.getEngagement().status;
        }

        /**
            获取决定自身状态的节点
        */
        NodeBase.prototype.getEngageDueToNode = function () {
            return this.getEngagement().dueToNode;
        }

        /**
            获取连接情况
        */
        NodeBase.prototype.getEngagement = function () {
            // 结果存储对象
            var handler = {
                // 状态
                status: ZYDesign.Enum.NODESTATE.FREE,
                dueToNode: null,
                // 已扫描节点列表
                doneList: [],
                // 判断某个节点是否已经扫描过
                alreadyDone: function (node) {
                    for (var i = 0; i < this.doneList.length; i++) {
                        if (node == this.doneList[i]) {
                            return true;
                        }
                    }
                    return false;
                },
                // 检查状态
                checkState: function (connector) {
                    // 随机组状态
                    if (connector.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART) {
                        this.status = ZYDesign.Enum.NODESTATE.RANDOM;
                        this.dueToNode = connector.parent;
                        return;
                    }
                    // 循环圈状态
                    if (connector.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART ||
                        connector.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPEND) {
                        this.status = ZYDesign.Enum.NODESTATE.LOOP;
                        this.dueToNode = connector.parent;
                        return;
                    }
                    // 普通通路状态
                    if (connector.parent.type == ZYDesign.Enum.NODETYPE.START ||
                        connector.parent.type == ZYDesign.Enum.NODETYPE.END ||
                        connector.parent.type == ZYDesign.Enum.NODETYPE.CHECK) {
                        this.status = ZYDesign.Enum.NODESTATE.NORMAL;
                        return;
                    }
                    // 和工具节点在一起
                    if (connector.parent.commonType == ZYDesign.Enum.NODECOMMONTYPE.TOOL) {
                        this.status = ZYDesign.Enum.NODESTATE.FREEWITHTOOL;
                        return;
                    }
                }
            }
            // 扫描状态
            this.searchEngageState(handler);
            // 返回状况
            return handler;
        }

        /**
            扫描节点状态
            @result 扫描结果存储对象
        */
        NodeBase.prototype.searchEngageState = function (handler) {
            // 上层递归中已经扫描到非自由结果
            if (handler.status != ZYDesign.Enum.NODESTATE.FREE &&
                    handler.status != ZYDesign.Enum.NODESTATE.FREEWITHTOOL) {
                return;
            }
            // 把自己放入已扫描列表
            handler.doneList.push(this);
            // 初始化要扫描的端口列表
            var conns = [];
            // 有输入来源
            if (this.input && this.input.sources) {
                // 将输入来源加入扫描列表
                conns = conns.concat(this.input.sources);
            }
            // 有总输出目标
            if (this.output && this.output.dest) {
                // 将总输出目标加入扫描列表
                conns = conns.concat(this.output.dest);
            }
            // 有选项
            if (this.options) {
                for (var i = 0; i < this.options.length; i++) {
                    var option = this.options[i];
                    // 该选项有输出目标
                    if (option.dest) {
                        // 将该输出目标加入扫描列表
                        conns = conns.concat(option.dest)
                    }
                }
            }

            // 循环扫描端口列表
            for (var i = 0; i < conns.length; i++) {
                // 一个端口
                var conn = conns[i];
                // 检查输入口状态
                handler.checkState(conn)
                // 不是自由状态了
                if (handler.status != ZYDesign.Enum.NODESTATE.FREE &&
                    handler.status != ZYDesign.Enum.NODESTATE.FREEWITHTOOL) {
                    return;
                    // 还是自由状态,则准备递归扩散扫描
                } else {
                    // 拿到下个节点,准备递归
                    var node = conn.parent;
                    // 只有该节点之前没扫描过才扫描它
                    if (!handler.alreadyDone(node)) {
                        // 递归扫描
                        node.searchEngageState(handler);
                        // 不是自由状态了
                        if (handler.status != ZYDesign.Enum.NODESTATE.FREE &&
                            handler.status != ZYDesign.Enum.NODESTATE.FREEWITHTOOL) {
                            return;
                        }
                    }
                }
            }
        }

        /**
            总输出口是否已经输出
        */
        NodeBase.prototype.isMasterOutputed = function () {
            // 又输出口且输出口有目标
            if (this.output &&
                this.output.dest) {
                // 是已经输出
                return true;
            }
            // 未输出
            return false;
        }

        /**
            是否所有选项都已全部输出
        */
        NodeBase.prototype.isAllOptionOutputed = function () {
            // 没有选项
            if (!this.options || this.options.length == 0) {
                // 未输出
                return false;
            }
            for (var i = 0; i < this.options.length; i++) {
                // 有人以一个选项没输出
                if (!this.options[i].dest) {
                    // 未全部输出
                    return false;
                }
            }
            // 经过检查的为已经全部输出
            return true;
        }

        /**
            是否包含不通的输出口
        */
        NodeBase.prototype.hasDeadOutput = function () {
            // 总输出口已经输出
            if (this.isMasterOutputed()) {
                return false;
            }
            // 总输出口未输出是检查是否所有选项都已经输出
            if (this.isAllOptionOutputed()) {
                return false;
            }
            // 以上两个条件一个都不满足,则存在不通的输入口
            return true;
        }

        /**
            是否有不通的输入口
        */
        NodeBase.prototype.hasDeadInput = function () {
            if (this.input && this.input.sources.length == 0) {
                return true;
            }
            return false;
        }

        /**
            检查节点合法性
            @result 用于存储结果的对象
        */
        NodeBase.prototype.validate = function (result) {
            // 没出传入结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            this.validateResult = result;
            // 未输入节点名
            if (!this.nodeName.trim()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoNodeName; // Prompt.QSNRD_InvalidNoNodeName
                return result;
            }
            // 不存在输入
            if (this.hasDeadInput()) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoInput; // Prompt.QSNRD_InvalidNoInput
                return result;
            }

            // 存在不通的输出口,且不是随机组节点
            if (this.hasDeadOutput() &&
                this.getEngageStatus() != ZYDesign.Enum.NODESTATE.RANDOM) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoFullOutput; // Prompt.QSNRD_InvalidNoFullOutput
                return result;
            }
            return result;
        }

        /**
            判断是否存在重复的输出目标
            总输出是否和选项输出之间重复
        */
        NodeBase.prototype.hasRepeatedDest = function () {
            // 不存在总输出口或选项输出口
            if (!this.output || !this.options) {
                return false;
            }
            // 总输出目标
            var masterDest = this.output.dest;
            // 不存在中输出口
            if (!masterDest) {
                return false;
            }
            // 检查选项输出
            for (var i = 0; i < this.options.length; i++) {
                var dest = this.options[i].dest;
                // 存在重复
                if (dest == masterDest) {
                    return true;
                }
            }
            return false;
        }

        /**
            是否存在选项输出
        */
        NodeBase.prototype.hasOptionDest = function () {
            if (!this.options) {
                return false;
            }
            // 检查选项
            for (var i = 0; i < this.options.length; i++) {
                // 任意选项有输出
                if (this.options[i].dest) {
                    return true;
                }
            }
            return false;
        }

        /**
            是否单选
            子类复写该方法
        */
        NodeBase.prototype.isSingleSelect = function () {
            return true;
        }

        /**
            获取额外宽度
            目前只有矩阵题可能会有额外宽度,其他节点都是0
        */
        NodeBase.prototype.getExtraWidth = function () {
            return 0;
        }

        /**
            获取额外高度
            目前只有矩阵题可能会有额外高度度,其他节点都是0
        */
        NodeBase.prototype.getExtraHeight = function () {
            return 0;
        }

        /**
            根据id获取连接点
        */
        NodeBase.prototype.searchConnectorById = function (connectorId) {
            return null;
        }

        /**
            显示警告信息
        */
        NodeBase.prototype.showWarnMsg = function () {
            $("#" + this.nodeUuid + " .elem_warning_msg").show();
        }

        /**
            隐藏警告信息
        */
        NodeBase.prototype.hideWarnMsg = function () {
            $("#" + this.nodeUuid + " .elem_warning_msg").hide();
        }

        /**
            切换是否使用图片
        */
        NodeBase.prototype.toggleImage = function () {
            var rs = {
                oldImage: null,
                newImage: null,
            }
            this.useMedia = !this.useMedia;
            // 删除图片的场合需要移除图片
            if (!this.useMedia) {
                rs.oldImage = this.image;
                rs.newImage = this.image = null;
            }
            return rs;
        }

        /**
            获得后续节点
            搜索成功后会返回一个对象包含两个属性,
            第一个是后续节点列表,第二个是需要继续往下搜索的节点列表
        */
        NodeBase.prototype.searchNextNodesByOrder = function () {
            return {
                resultList: [],
                seedList: []
            }
        }


        /**
            修复节点位置
            @fixConn 是否修复连接
        */
        NodeBase.prototype.fixPosition = function (fixConn) {
            $("#" + this.nodeUuid).attr("transform", this.getTransform());
            var eyeNodeElem = $("#eye-" + this.nodeUuid);
            eyeNodeElem.find(".eye_bg_main").attr("transform", this.getEyeTransform())
            if (fixConn) {
                for (var i = 0; i < this.relatedConnections.length; i++) {
                    this.relatedConnections[i].fixPosition();
                }
            }
            return eyeNodeElem;
        }

        /**
            监听节点显示与否
            只有在当前视口的节点才显示
        */
        NodeBase.prototype.checkVisible = function () {
            var designManager = ZYDesign.DesignManager,
                containerInfo = designManager.containerInfo,
                rate = designManager.chartZoomRate,
                changed = false,
                visible = true;
            // 不在视口内不可见
            if (this.getX() * rate > containerInfo.right ||
                this.getRight() * rate < containerInfo.left ||
                this.getBottom() * rate < containerInfo.top ||
                this.getY() * rate > containerInfo.bottom) {
                visible = false
            }
            if (this.visible != visible) {
                changed = true;
            }
            this.visible = visible;
            return changed;
        }

        /**
            获取多选标志图标位置变换
        */
        NodeBase.prototype.getMultiTransform = function () {
            return "translate(" + 0 + "," + (this.getBackgroundHeight() + 3) + ")";
        }

        /**
            获取媒体多选标志位置变换
        */
        NodeBase.prototype.getMediaTransform = function () {
            var perWidth = 24;
            var count = 0;
            this.multipleSelect && count++;
            return "translate(" + count * perWidth + "," + (this.getBackgroundHeight() + 3) + ")";
        }
        return NodeBase;
    })();
})();