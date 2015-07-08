/**
***信息节点类
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class;

    // 信息节点 继承自题目节点
    Class.InfoNode = (function () {
        /**
            信息节点 继承自题目节点
        */
        function InfoNode() {
            if (!(this instanceof InfoNode)) {
                return;
            }
            // 继承题目基类
            Class.SubjectNode.call(this);
            // 模式
            this.mode = 1;
            // 节点宽度
            this.width = 200;
            // 节点高度
            this.height = 88;
            // 背景颜色
            this.backgroundColor = "#00A3E0";
        }
        // 继承基类节点
        Class.inheritPrototype(Class.SubjectNode, InfoNode);

        // 分类类型
        InfoNode.prototype.categoryType = 4;
        // 节点基本类型
        InfoNode.prototype.commonType = ZYDesign.Enum.NODECOMMONTYPE.INFO;
        // 不支持复制
        InfoNode.prototype.copyDisabled = true;
        // 不支持预览
        InfoNode.prototype.previewDisabled = true;
        // 不支持批量输入
        InfoNode.prototype.optionbatchDisabled = true;
        // 输出文字是否可变化
        InfoNode.prototype.outputTextChangable = true;
        // 是否禁用媒体
        InfoNode.prototype.mediaDisable = true;

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        InfoNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            InfoNode.base.exportJson.call(this, questionairId, jsonHolder);
        }
        return InfoNode;
    })();

    // 地域节点类  继承信息节点
    Class.RegionNode = (function () {
        /**
         地域节点类 
        */
        function RegionNode() {
            if (!(this instanceof RegionNode)) {
                return;
            }
            // 继承信息节点
            Class.InfoNode.call(this);
        }

        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, RegionNode);

        // 节点类型
        RegionNode.prototype.type = ZYDesign.Enum.NODETYPE.REGION;
        // 节点类型
        RegionNode.prototype.typeInt = 13;
        // 类型列表字段
        RegionNode.prototype.typeListKey = "regionNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        RegionNode.prototype.optionConstructor = ZYDesign.Class.RegionOptionConnector;
        // 类型名
        RegionNode.prototype.typeName = "地域节点";
        // 类型图标
        RegionNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        RegionNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            RegionNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.provinceId;  // 省ID
            optionJson.extField_2 = option.cityId;      // 市ID
            optionJson.extField_3 = option.countyId;    // 县ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        RegionNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            RegionNode.base.initOption.call(this, opt, option);
            // 省级ID
            option.provinceId = opt.extField_1 == undefined ? 0 : opt.extField_1;
            // 市级ID
            option.cityId = opt.extField_2 == undefined ? 0 : opt.extField_2;
            // 县级ID
            option.countyId = opt.extField_3 == undefined ? 0 : opt.extField_3;
        }
        return RegionNode;
    })();

    // 性别节点类 继承信息节点
    Class.GenderNode = (function () {
        /**
            性别节点类
        */
        function GenderNode() {
            if (!(this instanceof GenderNode)) {
                return;
            }
            // 继承信息节点
            Class.InfoNode.call(this);
        }

        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, GenderNode);

        // 节点类型
        GenderNode.prototype.type = ZYDesign.Enum.NODETYPE.GENDER;
        // 节点类型
        GenderNode.prototype.typeInt = 14;
        // 类型列表字段
        GenderNode.prototype.typeListKey = "genderNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        GenderNode.prototype.optionConstructor = ZYDesign.Class.GenderOptionConnector;
        // 类型名
        GenderNode.prototype.typeName = "性别节点";
        // 类型图标
        GenderNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        GenderNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 调用父类同名方法
            GenderNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.genderId;  // 性别ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        GenderNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            GenderNode.base.initOption.call(this, opt, option);
            // 性别id
            option.genderId = opt.extField_1 == undefined ? 0 : opt.extField_1;
        }
        return GenderNode;
    })();

    // 年龄节点类 继承信息节点
    Class.AgeGroupNode = (function () {
        /**
         年龄节点类
        */
        function AgeGroupNode() {
            if (!(this instanceof AgeGroupNode)) {
                return;
            }
            // 继承信息节点
            Class.InfoNode.call(this);
        }

        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, AgeGroupNode);

        // 节点类型
        AgeGroupNode.prototype.type = ZYDesign.Enum.NODETYPE.AGEGROUP;
        // 节点类型
        AgeGroupNode.prototype.typeInt = 15;
        // 类型列表字段
        AgeGroupNode.prototype.typeListKey = "ageGroupNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        AgeGroupNode.prototype.optionConstructor = ZYDesign.Class.AgeGroupOptionConnector;
        // 类型名
        AgeGroupNode.prototype.typeName = "年龄节点";
        // 类型图标
        AgeGroupNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        AgeGroupNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 调用父类同名方法
            AgeGroupNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.startAgeGroupId;    // 开始年龄组ID
            optionJson.extField_2 = option.endAgeGroupId;      // 结束年龄组ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        AgeGroupNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            AgeGroupNode.base.initOption.call(this, opt, option);
            // 开始年龄id
            option.startAgeGroupId = opt.extField_1 == undefined ? 0 : opt.extField_1;
            // 结束年龄id
            option.endAgeGroupId = opt.extField_2 == undefined ? 0 : opt.extField_2;
        }
        return AgeGroupNode;
    })();

    // 婚姻状况节点类 继承信息节点
    Class.MaritalStatusNode = (function () {
        /**
         婚姻状况节点类
        */
        function MaritalStatusNode() {
            if (!(this instanceof MaritalStatusNode)) {
                return;
            }
            // 继承信息节点
            Class.InfoNode.call(this);
        }

        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, MaritalStatusNode);

        // 节点类型
        MaritalStatusNode.prototype.type = ZYDesign.Enum.NODETYPE.MARITALSTATUS;
        // 节点类型
        MaritalStatusNode.prototype.typeInt = 16;
        // 类型列表字段
        MaritalStatusNode.prototype.typeListKey = "maritalStatusNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        MaritalStatusNode.prototype.optionConstructor = ZYDesign.Class.MaritalOptionConnector;
        // 类型名
        MaritalStatusNode.prototype.typeName = "婚姻节点";
        // 类型图标
        MaritalStatusNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        MaritalStatusNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 调用父类同名方法
            MaritalStatusNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.maritalStatusId;    // 婚姻状况ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        MaritalStatusNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            MaritalStatusNode.base.initOption.call(this, opt, option);
            // 婚姻状况id
            option.maritalStatusId = opt.extField_1 == undefined ? 0 : opt.extField_1;
        }
        return MaritalStatusNode;
    })();

    // 学历节点类 继承信息节点类
    Class.EduStatusNode = (function () {
        /**
            学历节点类
        */
        function EduStatusNode() {
            if (!(this instanceof EduStatusNode)) {
                return;
            }
            // 继承信息节点
            Class.InfoNode.call(this);
        }

        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, EduStatusNode);

        // 节点类型
        EduStatusNode.prototype.type = ZYDesign.Enum.NODETYPE.EDUSTATUS;
        // 节点类型
        EduStatusNode.prototype.typeInt = 17;
        // 类型列表字段
        EduStatusNode.prototype.typeListKey = "eduStatusNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        EduStatusNode.prototype.optionConstructor = ZYDesign.Class.EduOptionConnector;
        // 类型名
        EduStatusNode.prototype.typeName = "学历节点";
        // 类型图标
        EduStatusNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        EduStatusNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 调用父类同名方法
            EduStatusNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.eduStatusId;    // 教育状况ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        EduStatusNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            EduStatusNode.base.initOption.call(this, opt, option);
            // 将于状况id
            option.eduStatusId = opt.extField_1 == undefined ? 0 : opt.extField_1;
        }
        return EduStatusNode;
    })();

    // 职业节点类 继承信息节点类
    Class.OccupationNode = (function () {
        /**
            职业节点类
        */
        function OccupationNode() {
            if (!(this instanceof OccupationNode)) {
                return;
            }
            // 继承信息节点
            Class.InfoNode.call(this);
        }


        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, OccupationNode);

        // 节点类型
        OccupationNode.prototype.type = ZYDesign.Enum.NODETYPE.OCCUPATION;
        // 节点类型
        OccupationNode.prototype.typeInt = 18;
        // 类型列表字段
        OccupationNode.prototype.typeListKey = "occupationNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        OccupationNode.prototype.optionConstructor = ZYDesign.Class.OccupationOptionConnector;
        // 类型名
        OccupationNode.prototype.typeName = "职业节点";
        // 类型图标
        OccupationNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        OccupationNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 调用父类同名方法
            OccupationNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.occupationId;    // 职业状况ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        OccupationNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            OccupationNode.base.initOption.call(this, opt, option);
            option.occupationId = opt.extField_1 == undefined ? 0 : opt.extField_1;
            option.getOccupation = function () {
                return ZYDesign.Dict.getOccupationById(this.occupationId);
            }
            /**
             获得要显示的文字
           */
            option.getShowText = function () {
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
        }
        return OccupationNode;
    })();

    // 行业节点类 继承题目基类
    Class.ProfessionNode = (function () {
        /**
            行业节点类
        */
        function ProfessionNode() {
            if (!(this instanceof ProfessionNode)) {
                return;
            }
            // 继承题目基类
            Class.InfoNode.call(this);
        }

        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, ProfessionNode);

        // 节点类型
        ProfessionNode.prototype.type = ZYDesign.Enum.NODETYPE.PROFESSION;
        // 节点类型
        ProfessionNode.prototype.typeInt = 19;
        // 类型列表字段
        ProfessionNode.prototype.typeListKey = "professionNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        ProfessionNode.prototype.optionConstructor = ZYDesign.Class.ProfessionOptionConnector;
        // 类型名
        ProfessionNode.prototype.typeName = "行业节点";
        // 类型图标
        ProfessionNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        ProfessionNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 调用父类同名方法
            ProfessionNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.professionId;    // 行业状况ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        ProfessionNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            ProfessionNode.base.initOption.call(this, opt, option);
            // 行业ID
            option.professionId = opt.extField_1 == undefined ? 0 : opt.extField_1;
        }
        return ProfessionNode;
    })();

    // 职位节点类 继承题目基类
    Class.JobTitleNode = (function () {
        /**
            职位节点类
        */
        function JobTitleNode() {
            if (!(this instanceof JobTitleNode)) {
                return;
            }
            // 继承题目基类
            Class.InfoNode.call(this);
        }

        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, JobTitleNode);

        // 节点类型
        JobTitleNode.prototype.type = ZYDesign.Enum.NODETYPE.JOBTITLE;
        // 节点类型
        JobTitleNode.prototype.typeInt = 20;
        // 类型列表字段
        JobTitleNode.prototype.typeListKey = "jobTitleNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        JobTitleNode.prototype.optionConstructor = ZYDesign.Class.JobTitleOptionConnector;
        // 类型名
        JobTitleNode.prototype.typeName = "职位节点";
        // 类型图标
        JobTitleNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        JobTitleNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 调用父类同名方法
            JobTitleNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.jobTitleId;    // 职位ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        JobTitleNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            JobTitleNode.base.initOption.call(this, opt, option);
            // 职位ID
            option.jobTitleId = opt.extField_1 == undefined ? 0 : opt.extField_1;
        }
        return JobTitleNode;
    })();

    // 收入节点类 继承题目基类
    Class.IncomeNode = (function () {
        /**
            收入节点类
        */
        function IncomeNode() {
            if (!(this instanceof IncomeNode)) {
                return;
            }
            // 继承题目基类
            Class.InfoNode.call(this);
        }

        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, IncomeNode);

        // 节点类型
        IncomeNode.prototype.type = ZYDesign.Enum.NODETYPE.INCOME;
        // 节点类型
        IncomeNode.prototype.typeInt = 21;
        // 类型列表字段
        IncomeNode.prototype.typeListKey = "incomeNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        IncomeNode.prototype.optionConstructor = ZYDesign.Class.IncomeOptionConnector;
        // 类型名
        IncomeNode.prototype.typeName = "收入节点";
        // 类型图标
        IncomeNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        IncomeNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 调用父类同名方法
            IncomeNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.incomeStartId;    // 开始收入组ID
            optionJson.extField_2 = option.incomeEndId;    // 结束收入组ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        IncomeNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            IncomeNode.base.initOption.call(this, opt, option);
            // 开始收入ID
            option.incomeStartId = opt.extField_1 == undefined ? 0 : opt.extField_1;
            // 结束收入ID
            option.incomeEndId = opt.extField_2 == undefined ? 0 : opt.extField_2;

        }
        return IncomeNode;
    })();

    // 收入节点类 继承信息节点类
    Class.FamilyIncomeNode = (function () {
        /**
            收入节点类
        */
        function FamilyIncomeNode() {
            if (!(this instanceof FamilyIncomeNode)) {
                return;
            }
            // 继承题目基类
            Class.InfoNode.call(this);

        }

        // 继承信息节点类
        Class.inheritPrototype(Class.InfoNode, FamilyIncomeNode);

        // 节点类型
        FamilyIncomeNode.prototype.type = ZYDesign.Enum.NODETYPE.FAMILYINCOME;
        // 节点类型
        FamilyIncomeNode.prototype.typeInt = 22;
        // 类型列表字段
        FamilyIncomeNode.prototype.typeListKey = "familyIncomeNodes";
        // 选项构造函数(每个子类的选项构造函数如有不同需重新定义)
        FamilyIncomeNode.prototype.optionConstructor = ZYDesign.Class.IncomeOptionConnector;
        // 类型名
        FamilyIncomeNode.prototype.typeName = "家庭收入节点";
        // 类型图标
        FamilyIncomeNode.prototype.typeIcon = "";

        /**
            收集选项Json信息
            @option 选项
            @optionJson 用来存储选项json数据的对象
         */
        FamilyIncomeNode.prototype.collectOption = function (option, optionJson) {
            // 参数检查
            if (!option || !optionJson) {
                return;
            }
            // 调用父类同名方法
            FamilyIncomeNode.base.collectOption.call(this, option, optionJson);
            optionJson.extField_1 = option.incomeStartId;    // 开始收入组ID
            optionJson.extField_2 = option.incomeEndId;      // 结束收入组ID
        }

        /**
            根据原始数据初始化选项
            @opt 原始数据
            @option 要初始化的选项
        */
        FamilyIncomeNode.prototype.initOption = function (opt, option) {
            // 参数检查
            if (!opt || !option) {
                return;
            }
            // 先调用父类同名方法
            FamilyIncomeNode.base.initOption.call(this, opt, option);
            // 开始收入ID
            option.incomeStartId = opt.extField_1 == undefined ? 0 : opt.extField_1;
            // 结束输入ID
            option.incomeEndId = opt.extField_2 == undefined ? 0 : opt.extField_2;
        }
        return FamilyIncomeNode;
    })();
})();