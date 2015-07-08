/**
	sts2
    应用总模块
*/
angular.module("ZYDesign", ["navBarModule", "toolBarModule", "sideBarModule", "footerBarModule", "nodesKitModule",
    "mediaKitModule", "themeKitModule", "popupSearchModule", "popupDebugModule", "popupBatchModule", "popupSaveModule",
    "popupMessageModule", "popupToplineModule", "markdownEditorModule", "nodeFlow", "eagleEye", "designManager", "recordManager",
    "versionDropModule", "commonSettingModule", "optionSettingModule", "otherSettingModule", "questionSettingModule", "typeSettingModule",
    "helpCenterModule", "rightClickModule", "normalOptionModule"
])
/**
    应用总控制器
	test
*/
.controller("ZYDesignController", ["$scope", "designManager", "recordManager",
    function ($scope, designManager, recordManager) {
        $scope.designManager = designManager;

        /**
            处理页面鼠标抬起事件
            @evt 事件参数
        */
        $scope.handleMouseUp = function (evt) {
            // 清除临时的连接对象
            if (designManager.tempConncetion) {
                designManager.removeTempConnection();
                designManager.tempConncetion = null;
            }
        }
    }
]);;
$(function () {
    var env = ZYDesign.Environment;
    if (!env.isWebkit) {
        confirm(Prompt.QSNRD_CurrentBrowserUseDisable + "<br>" + Prompt.QSNRD_AdviceBrowser,
            function () {
                $(".design_wrapper").show();
            }, function () {
                window.location.href = "/Home/Index#/QM";
            }, "继续", "", "退出");
    }else{
        $(".design_wrapper").show();
    }
})


/**
    应用总模块
*/
angular.module("ZYDesign", ["batchOption", "eagleEye", "nodeBox", "nodeEditor", "nodeFlow",
    "nodeSearcher", "helpBox", "nodeValidator", "themeBox", "versionHistory", "versionSave", "designManager","recordManager"])
/**
    应用总控制器
*/
.controller("ZYDesignController", ["$scope", "designManager", "recordManager", "$timeout", function ($scope, designManager, recordManager, $timeout) {
    // 总管理器
    $scope.designManager = ZYDesign.DesignManager = designManager;
    /**
        处理返回问卷设置按钮点击事件
    */
    $scope.handleBackIconClick = function () {
        var url = "/Home/DashBoard#/QM";
        designManager.leavePage(url);


    }

    /**
        处理发布按钮点击事件
    */
    $scope.handleReleaseIconClick = function () {
        var url = "/Home/DashBoard#/QMSet/Publish/" + $("#quesIDEx").val();
        designManager.leavePage(url);
    }

    /**
        处理切换节点盒子显示鼠标点击事件
    */
    $scope.handleToggleNodeBoxClick = function () {
        // 关闭/显示节点盒子
        designManager.nodeBoxManager.toggleShow();
        // 关闭主题盒子
        designManager.themeBoxManager.close();
    }

    /**
        处理切换主题盒子显示鼠标点击事件
    */
    $scope.handleToggleThemeBoxClick = function () {
        // 关闭/显示主题盒子
        designManager.themeBoxManager.toggleShow();
        // 关闭节点盒子
        designManager.nodeBoxManager.close();
    }

    /**
        处理页面鼠标抬起事件
        @evt 事件参数
    */
    $scope.handleMouseUp = function (evt) {
        // 清除临时的连接对象
        if (designManager.tempConncetion) {
            designManager.removeTempConnection();
            designManager.tempConncetion = null;
        }
    }

    /**
        处理缩小按钮点击事件
    */
    $scope.handleZoomOutClick = function () {
        // 画布内容缩小
        designManager.zoomOut();
    }

    /**
        处理放大按钮点击事件
    */
    $scope.chartSvgZoomIn = function () {
        // 画布内容放大
        designManager.zoomIn();
    }

    /**
        处理显示全部按钮点击事件
    */
    $scope.handleShowAllClick = function () {
        // 显示全部
        designManager.showAll();
    }

    /**
        处理保存按钮点击事件
    */
    $scope.handleSaveClick = function () {
        // 保存问卷信息
        designManager.save("N", null, null, "Y", "");
        // 重置自动保存
        designManager.autoSaveManager.reset();
    }

    /**
        处理调试按钮点击事件
    */
    $scope.handleTestClick = function () {
        // 调试问卷
        designManager.test();
    }

    /**
        处理搜索框键盘按下事件
        @evt 事件参数
    */
    $scope.handleSearcherKeydown = function (evt) {
        // 回车键按下时进行搜索
        if (evt.keyCode == 13) {
            var keyword = evt.currentTarget.value.trim();
            // 无关键字不处理
            if (!keyword) {
                return;
            }
            // 按关键字搜索
            designManager.searchManager.search(keyword);
        }
    }

    /**
        处理搜索按钮点击事件
    */
    $scope.handleSearchClick = function () {
        var keyword = $("#search_txt").val().trim();
        // 无关键字不处理
        if (!keyword) {
            return;
        }
        // 按关键字搜索
        designManager.searchManager.search(keyword);
    }

    /**
        处理表格显示切换按钮点击事件
    */
    $scope.handleGridToggleClick = function () {
        // 切换表格显示
        designManager.toggleGrid();
    }

    /**
        处理删除按钮点击事件
    */
    $scope.handleDeleteNodeClick = function () {
        // 删除当前被选中的项目
        designManager.removeSelected();
    }

    /**
        处理复制按钮点击事件
    */
    $scope.handleCopyNodeClick = function () {
        // 复制当前选中的节点
        designManager.clipBoard.dulplicate(0, 0);
    }

    /**
        处理断开连接按钮点击事件
        @evt 事件参数
        @node 节点对象
    */
    $scope.handleBreakConnClick = function () {
        // 移除所选节点的相关连接
        designManager.breakConnOfSelectedNodes();
    }

    /**
        处理选择器鼠标进入事件
    */
    $scope.handleSearcherMouseEnter = function () {
        // 放开搜索框
        designManager.searchManager.releaseSearcher();
    }

    /**
        处理选择器鼠标离开事件
    */
    $scope.handleSearcherMouseLeave = function () {
        // 包裹搜索框
        designManager.searchManager.wrapSearcher();
    }

    /**
        处理版本控制鼠标覆盖事件
    */
    $scope.handleVersionHistoryMouseEnter = function () {
        // 保持版本控制器打开状态
        designManager.versionHistoryManager.open();
    }

    /**
        处理版本控制鼠标离开事件
    */
    $scope.handleVersionHistoryMouseLeave = function () {
        // 关闭版本控制器
        designManager.versionHistoryManager.close();
    }
}]);;/**
    众研设计全局管理对象
    整个应用中就注入这一个全局变量
    防止全局变量污染
*/
(function () {
    var zy = window.ZYDesign = window.ZYDesign || {};

    // 自定义的类
    zy.Class = (function () {
        /**
            寄生原型继承通用方法
            @baseType 父类构造方法
            @childType 子类构造方法
        */
        function inheritPrototype(baseType, childType) {
            // 定义一个用于寄生的空构造函数
            var F = function () { };
            // 将基类的原型寄生到该空构造函数中
            F.prototype = baseType.prototype;
            // 子类继承该构造函数原型,也即继承了父类的原型.
            // 但不会继承父类的非原型成员
            childType.prototype = new F();
            // 将子类原型中的构造函数重新指向自身
            childType.prototype.constructor = childType;
            // 定义一个变量指向父类原型(用于子类方法中调用父类的同名原型方法)
            childType.base = baseType.prototype;
        }

        return {
            inheritPrototype: inheritPrototype
        }
    })();
    // 枚举
    zy.Enum = (function () {
        var Enum = {};
        // 节点状态枚举
        Enum.NODESTATE = {};
        Enum.NODESTATE.FREE = "FREE";
        Enum.NODESTATE.NORMAL = "NORMAL";
        Enum.NODESTATE.RANDOM = "RANDOM";
        Enum.NODESTATE.LOOP = "LOOP";
        Enum.NODESTATE.FREEWITHTOOL = "FREEWITHTOOL";

        // 节点类型枚举
        Enum.NODETYPE = {};
        Enum.NODETYPE.START = "START";
        Enum.NODETYPE.END = "END";
        Enum.NODETYPE.CHECK = "CHECK";

        Enum.NODETYPE.COMMENT = "COMMENT";

        Enum.NODETYPE.SUBJECT = "SUBJECT";
        Enum.NODETYPE.SELECT = "SELECT";
        Enum.NODETYPE.MARK = "MARK";
        Enum.NODETYPE.SEQUENCE = "SEQUENCE";
        Enum.NODETYPE.FILL = "FILL";
        Enum.NODETYPE.MATRIX = "MATRIX";
        Enum.NODETYPE.SELECTPIC = "SELECTPIC";

        Enum.NODETYPE.TOOL = "TOOL";
        Enum.NODETYPE.LOGIC = "LOGIC";
        Enum.NODETYPE.RANDOM = "RANDOM";
        Enum.NODETYPE.LOOP = "LOOP";

        Enum.NODETYPE.REGION = "REGION";
        Enum.NODETYPE.GENDER = "GENDER";
        Enum.NODETYPE.AGEGROUP = "AGEGROUP";
        Enum.NODETYPE.MARITALSTATUS = "MARITALSTATUS";
        Enum.NODETYPE.EDUSTATUS = "EDUSTATUS";
        Enum.NODETYPE.OCCUPATION = "OCCUPATION";
        Enum.NODETYPE.PROFESSION = "PROFESSION";
        Enum.NODETYPE.JOBTITLE = "JOBTITLE";
        Enum.NODETYPE.INCOME = "INCOME";
        Enum.NODETYPE.FAMILYINCOME = "FAMILYINCOME";

        // 节点基本类型枚举
        Enum.NODECOMMONTYPE = {};
        Enum.NODECOMMONTYPE.SUBJECT = "SUBJECT";
        Enum.NODECOMMONTYPE.INFO = "INFO";
        Enum.NODECOMMONTYPE.TOOL = "TOOL";
        Enum.NODECOMMONTYPE.TERMINAL = "TERMINAL";

        // 连接口类型枚举
        Enum.CONNTYPE = {};
        Enum.CONNTYPE.INPUT = "INPUT";
        Enum.CONNTYPE.OUTPUT = "OUTPUT";

        // 连接口精确类型枚举
        Enum.CONNEXACTTYPE = {};
        Enum.CONNEXACTTYPE.RANDOMSTART = "RANDOMSTART";
        Enum.CONNEXACTTYPE.LOOPSTART = "LOOPSTART";
        Enum.CONNEXACTTYPE.LOOPEND = "LOOPEND";
        Enum.CONNEXACTTYPE.OPTION = "OPTION";
        Enum.CONNEXACTTYPE.OUTPUTBASE = "OUTPUTBASE";
        Enum.CONNEXACTTYPE.INPUTBASE = "INPUTBASE"

        return Enum;
    })();
    // 设计总管理器
    zy.DesignManager = null;
    // 错误处理
    zy.ErrorHanlder = (function () {
        function log(msg) {
            console.log(msg);
        }
        return {
            log: log
        }
    })();
    // 文字工具
    zy.TextUtil = (function () {

        // 字符宽度配置 字体:13号
        var config = JSON.parse("{\"32\": 5.7, \"33\": 4.06, \"34\": 5.66, \"35\": 8.3, \"36\": 7.62, \"37\": 11.57, \"38\": 11.31, \"39\": 3.33," +
            " \"40\": 4.34, \"41\": 4.34, \"42\": 5.92, \"43\": 9.64, \"44\": 3.13, \"45\": 5.62, \"46\": 3.13, \"47\": 5.55, \"48\": 7.62, \"49\": 7.62," +
            " \"50\": 7.62, \"51\": 7.62, \"52\": 7.62, \"53\": 7.62, \"54\": 7.62, \"55\": 7.62, \"56\": 7.62, \"57\": 7.62, \"58\": 3.13, \"59\": 3.13," +
            " \"60\": 9.64, \"61\": 9.64, \"62\": 9.64, \"63\": 6.28, \"64\": 13.41, \"65\": 9.15, \"66\": 8.16, \"67\": 8.7, \"68\": 9.9, \"69\": 7.15," +
            " \"70\": 6.91, \"71\": 9.67, \"72\": 10.05, \"73\": 3.82, \"74\": 5.15, \"75\": 8.25, \"76\": 6.67, \"77\": 12.7, \"78\": 10.57, \"79\": 10.59," +
            " \"80\": 7.95, \"81\": 10.59, \"82\": 8.49, \"83\": 7.5, \"84\": 7.45, \"85\": 9.71, \"86\": 8.79, \"87\": 13.23, \"88\": 8.39, \"89\": 7.85," +
            " \"90\": 8.06, \"91\": 4.34, \"92\": 5.41, \"93\": 4.34, \"94\": 9.64, \"95\": 5.83, \"96\": 3.83, \"97\": 7.19, \"98\": 8.3, \"99\": 6.52," +
            " \"100\": 8.32, \"101\": 7.38, \"102\": 4.51, \"103\": 8.32, \"104\": 8, \"105\": 3.46, \"106\": 3.47, \"107\": 7.08, \"108\": 3.46, \"109\": 12.18," +
            " \"110\": 8.01, \"111\": 8.26, \"112\": 8.3, \"113\": 8.32, \"114\": 4.96, \"115\": 6.02, \"116\": 4.84, \"117\": 8.01, \"118\": 6.82, \"119\": 10.26," +
            " \"120\": 6.59, \"121\": 6.88, \"122\": 6.39, \"123\": 4.34, \"124\": 3.5, \"125\": 4.34, \"126\": 9.64, \"default\": 13 }");

        /**
            根据要求的宽度从头截取字符串
            @width 宽度
            @originStr 原始字符串
            @fontSize 要求字体
        */
        function cutStringByWidth(width, originStr, fontSize) {
            if (typeof originStr !== "string" || width <= fontSize) {
                return {};
            }
            // 当前字体与13号字体的比例
            var ratio = fontSize / 13;
            var subStr = "";
            var currWidth = 0;
            var list = originStr.split("");
            for (var i = 0; i < list.length; i++) {
                var chr = list[i];
                var unitWidth = config[chr.charCodeAt()];
                if (!unitWidth) {
                    unitWidth = config["default"];
                }
                currWidth += unitWidth * ratio
                if (currWidth > width) {
                    return {
                        text: subStr,
                        leftText: originStr.substring(subStr.length),
                        more: true
                    };
                }
                subStr += chr;
            }
            return {
                text: originStr,
                leftText: "",
                more: false
            };
        }

        /**
            按指定的长度截取带省略号的字符串
        */
        function getEllipsisByWidth(width, originStr, fontSize) {
            if (typeof originStr !== "string" || width <= fontSize) {
                return;
            }
            var division = cutStringByWidth(width, originStr, fontSize);
            return division.more ? division.text + "..." : division.text;
        }

        /**
            按要求的长度将字符串等分
            @width 宽度
            @originStr 原始字符串
            @fontSize 要求字体
        */
        function divideStringByWidth(width, originStr, fontSize) {
            if (typeof originStr !== "string" || width <= fontSize) {
                return;
            }
            var ary = [];
            var division = {
                text: "",
                leftText: "",
                more: false
            };
            do {
                division = cutStringByWidth(width, originStr, fontSize);
                ary.push(division.text);
                if (division.more) {
                    originStr = division.leftText;
                }
            } while (division.more)

            return ary;
        }

        /**
            判断某个键值是否为数字输入允许的键值
            @keyCode 键值
        */
        function isNumberInputKey(keyCode) {
            if (keyCode == 8 // 回退键允许
                || keyCode == 9 // 制表符允许
                || keyCode == 13 // 回车键允许
                || keyCode == 37 // 左箭头允许
                || keyCode == 39 // 右箭头允许
                || keyCode == 46 // DEL允许
                || keyCode == 110 // 小数点允许
                || (keyCode >= 48 && keyCode <= 57) // 数字允许
                || (keyCode >= 96 && keyCode <= 105)) { // 小键盘数字允许
                return true;
            }
        }

        return {
            getEllipsisByWidth: getEllipsisByWidth,
            divideStringByWidth: divideStringByWidth,
            isNumberInputKey: isNumberInputKey,
        }
    })();
    // UUID工具
    zy.UuidUtil = (function () {
        var config = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        function generate() {
            var uuid = new Array(36), rnd = 0, r;
            for (var i = 0; i < 36; i++) {
                if (i == 8 || i == 13 || i == 18 || i == 23) {
                    uuid[i] = '-';
                } else if (i == 14) {
                    uuid[i] = '4';
                } else {
                    if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[i] = config[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
            return uuid.join('');
        }
        return {
            generate: generate
        }
    })();
    // 颜色工具
    zy.ColorUtil = (function () {
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

        /**
            rgb颜色转成16进制颜色
            @rgb rgb颜色
        */
        function rgbToHex(rgb) {
            if (/^(rgb|RGB)/.test(rgb)) {
                var aColor = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
                var strHex = "#";
                for (var i = 0; i < aColor.length; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if (hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = rgb;
                }
                return strHex;
            } else if (reg.test(rgb)) {
                var aNum = rgb.replace(/#/, "").split("");
                if (aNum.length === 6) {
                    return rgb;
                } else if (aNum.length === 3) {
                    var numHex = "#";
                    for (var i = 0; i < aNum.length; i += 1) {
                        numHex += (aNum[i] + aNum[i]);
                    }
                    return numHex;
                }
            } else {
                return rgb;
            }
        };

        /**
            16进制颜色转为RGB格式
            @hex 16进制颜色
        */
        function hexToRgb(hex) {
            var sColor = hex.toLowerCase();
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                var sColorChange = [];
                for (var i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return "RGB(" + sColorChange.join(",") + ")";
            } else {
                return sColor;
            }
        };

        /**
            16进制颜色转为RGBA格式
            @hex 16禁止颜色
            @opacity 透明度
        */
        function hexToRgba(hex, opacity) {
            if (!opacity) {
                opacity = 1;
            }
            var sColor = hex.toLowerCase();
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                var sColorChange = [];
                for (var i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return "RGBA(" + sColorChange.join(",") + "," + opacity + ")";
            } else {
                return sColor;
            }
        };
        /**
            RGBA进制颜色转为RGB格式
        */
        function rgbaToRgb(r, g, b, a, r2, g2, b2) {
            var r3 = Math.round(((1 - a) * r2) + (a * r))
            var g3 = Math.round(((1 - a) * g2) + (a * g))
            var b3 = Math.round(((1 - a) * b2) + (a * b))
            return "rgb(" + r3 + "," + g3 + "," + b3 + ")";
        };

        return {
            rgbToHex: rgbToHex,
            hexToRgb: hexToRgb,
            hexToRgba: hexToRgba,
            rgbaToRgb: rgbaToRgb
        };
    })();
    // 字典
    zy.Dict = (function () {
        /**
            获取矩阵选择限制字典
        */
        function getMatrixSelectLimitTypeDict() {
            var dict = [
                {
                    id: 1,
                    text: "单选"
                },
                {
                    id: 2,
                    text: "行单选"
                },
                {
                    id: 3,
                    text: "列单选"
                },
                {
                    id: 4,
                    text: "行列单选"
                },
                {
                    id: 5,
                    text: "多选"
                },
            ]
            return dict;
        }

        /**
           获取填空限制类型字典
       */
        function getFillblankLimitTypeDict() {
            var dict = [
                {
                    id: 1,
                    text: "数字"
                },
                {
                    id: 2,
                    text: "文本"
                },
                {
                    id: 3,
                    text: "日期"
                },
            ]
            return dict;
        }

        /**
            获取小数位限制字典
        */
        function getDecimalDigitsDict() {
            return [
                {
                    id: 1,
                    value: 0,
                },
                {
                    id: 2,
                    value: 1,
                },
                {
                    id: 3,
                    value: 2,
                },
                {
                    id: 4,
                    value: 3,
                }
            ];
        }

        /**
            获取省级地区字典
        */
        function getProvinceDict() {
            return [
                {
                    text: "上海",
                    id: 0,
                },
                {
                    text: "江苏",
                    id: 1,
                },
                {
                    text: "浙江",
                    id: 2,
                }
            ];
        }

        /**
            获取地级地区字典
        */
        function getCityDict() {
            return [
                {
                    pid: 0,
                    text: "上海",
                    id: 0,
                },
                {
                    pid: 1,
                    text: "南京",
                    id: 1,
                },
                {
                    pid: 1,
                    text: "苏州",
                    id: 2,
                },
                {
                    pid: 2,
                    text: "杭州",
                    id: 3,
                },
                {
                    pid: 2,
                    text: "温州",
                    id: 4,
                },
            ];
        }

        /**
            获取县级地区字典
        */
        function getCountyDict() {
            return [
                {
                    pid: 0,
                    text: "徐汇区",
                    id: 0,
                },
                {
                    pid: 0,
                    text: "黄浦区",
                    id: 1,
                },
                {
                    pid: 1,
                    text: "玄武区",
                    id: 2,
                },
                {
                    pid: 1,
                    text: "江宁区",
                    id: 3,
                },
                {
                    pid: 2,
                    text: "姑苏区",
                    id: 4,
                },
                {
                    pid: 2,
                    text: "昆山市",
                    id: 5,
                },
                {
                    pid: 3,
                    text: "西湖区",
                    id: 6,
                },
                {
                    pid: 3,
                    text: "萧山市",
                    id: 7,
                },
                {
                    pid: 4,
                    text: "瑞安市",
                    id: 8,
                },
                {
                    pid: 4,
                    text: "苍南县",
                    id: 9,
                },
            ];
        }

        /**
           获取性别字典
       */
        function getGenderDict() {
            return [
                {
                    text: "全部",
                    id: 0,
                },
                {
                    text: "男",
                    id: 1,
                },
                {
                    text: "女",
                    id: 2,
                },
                {
                    text: "其他",
                    id: 3,
                }
            ]
        }

        /**
           获取年龄段字典
       */
        function getAgeGroupDict() {
            return [
                {
                    text: "10",
                    id: 0,
                },
                {
                    text: "20",
                    id: 1,
                },
                {
                    text: "30",
                    id: 2,
                },
                {
                    text: "40",
                    id: 3,
                }
            ]
        }

        /**
           获取婚姻状况字典
       */
        function getMaritalStatusDict() {
            return [
                {
                    text: "未婚",
                    id: 0,
                },
                {
                    text: "已婚",
                    id: 1,
                },
                {
                    text: "离婚",
                    id: 2,
                },
                {
                    text: "丧偶",
                    id: 3,
                }
            ]
        }

        /**
       获取婚姻状况字典
    */
        function getEduStatusDict() {
            return [
                {
                    text: "秀才",
                    id: 0,
                },
                {
                    text: "举人",
                    id: 1,
                },
                {
                    text: "贡士",
                    id: 2,
                },
                {
                    text: "进士",
                    id: 3,
                }
            ]
        }

        /**
           获取职业字典
       */
        function getOccupationDict() {
            return [
                {
                    text: "IT民工",
                    id: 0,
                },
                {
                    text: "码农",
                    id: 1,
                },
                {
                    text: "程序猿",
                    id: 2,
                },
                {
                    text: "程序媛",
                    id: 3,
                }
            ]
        }

        /**
           获取行业字典
       */
        function getProfessionDict() {
            return [
                {
                    text: "计算机",
                    id: 0,
                },
                {
                    text: "法律",
                    id: 1,
                },
                {
                    text: "黑社会",
                    id: 2,
                },
                {
                    text: "丐帮",
                    id: 3,
                }
            ]
        }

        /**
           获取职位字典
       */
        function getJobTitleDict() {
            return [
                {
                    text: "帮主",
                    id: 0,
                },
                {
                    text: "长老",
                    id: 1,
                },
                {
                    text: "堂主",
                    id: 2,
                },
                {
                    text: "喽啰",
                    id: 3,
                }
            ]
        }

        /**
           获取收入字典
       */
        function getIncomeDict() {
            return [
                {
                    text: "1000",
                    id: 0,
                },
                {
                    text: "2000",
                    id: 1,
                },
                {
                    text: "3000",
                    id: 2,
                },
                {
                    text: "50000",
                    id: 3,
                }
            ]
        }

        /**
            获取条件算法字典
        */
        function getRequireMethodDict() {
            return [
                {
                    text: "AND",
                    id: 0,
                },
                {
                    text: "OR",
                    id: 1,
                },
            ]
        }


        /**
            获取条件
        */
        function getRequireLimitDict() {
            return [
                {
                    text: "介于",
                    id: 0,
                },
                {
                    text: "不介于",
                    id: 1,
                },
                {
                    text: "等于",
                    id: 2,
                },
                {
                    text: "不等于",
                    id: 3,
                },
                {
                    text: "大于",
                    id: 4,
                },
                {
                    text: "小于",
                    id: 5,
                },
                {
                    text: "小于等于",
                    id: 6,
                },
                {
                    text: "大于等于",
                    id: 7,
                },
                {
                    text: "列举",
                    id: 8,
                },
            ]
        }

        /**
            获取检验方式字典
        */
        function getValidateTypeDict() {
            return {
                list: [
                    {
                        text: "字数",
                        id: 1,
                    },
                    {
                        text: "整数",
                        id: 2,
                    },
                    {
                        text: "小数",
                        id: 3,
                    },
                    {
                        text: "日期",
                        id: 4,
                    },
                    {
                        text: "邮件地址",
                        id: 5,
                    },
                    {
                        text: "手机号码",
                        id: 6,
                    }
                ],
                getItemById: function (id) {
                    for (var i = 0; i < this.list.length; i++) {
                        var item = this.list[i];
                        if (item.id == id) {
                            return item;
                        }
                    }
                }
            }
        }

        /**
            获取数据字典
        */
        function getDict() {
            var dict = {};
            // 填空题填空限制类型字典
            dict.fillLimitTypeDict = getFillblankLimitTypeDict();
            // 小数位限制类型字典
            dict.decimalDigitsDict = getDecimalDigitsDict();
            // 矩阵选择限制类型字典
            dict.selectTypeLimitDict = getMatrixSelectLimitTypeDict();
            // 省级地区字典
            dict.provinceDict = getProvinceDict();
            // 地级地区字典
            dict.cityDict = getCityDict();
            // 县级地区字典
            dict.countyDict = getCountyDict();
            /**
                获取某省级地区的下辖地级地区
                @id 省级ID
            */
            dict.getCityInProvice = function (id) {
                var dict = [];
                for (var i = 0; i < this.cityDict.length; i++) {
                    var city = this.cityDict[i];
                    if (city.pid == id) {
                        dict.push(city);
                    }
                }
                return dict;
            }

            /**
               获取某地级地区的下辖县级地区
               @id 省级ID
           */
            dict.getCountyInCity = function (id) {
                var dict = [];
                for (var i = 0; i < this.countyDict.length; i++) {
                    var county = this.countyDict[i];
                    if (county.pid == id) {
                        dict.push(county);
                    }
                }
                return dict;
            }
            // 性别字典
            dict.genderDict = getGenderDict();
            // 年龄段字典
            dict.ageGroupDict = getAgeGroupDict();
            // 婚姻状况字典
            dict.maritalStatusDict = getMaritalStatusDict();
            // 学历字典
            dict.eduStatusDict = getEduStatusDict();
            // 职业字典
            dict.occupationDict = getOccupationDict();
            // 行业字典
            dict.professionDict = getProfessionDict();
            // 职位字典
            dict.jobTitleDict = getJobTitleDict();
            // 收入字典
            dict.incomeDict = getIncomeDict();
            // 条件算法字典
            dict.requireMethodDict = getRequireMethodDict();
            // 条件限定字典
            dict.requireLimitDict = getRequireLimitDict();

            dict.ValidateTypeDict = getValidateTypeDict();
            /**
              从某本字典中获取某个项目
              @id 项目ID
              @dict 字典
          */
            dict.getItemByIdInDict = function (id, dict) {
                for (var i = 0; i < dict.length; i++) {
                    var item = dict[i];
                    if (item.id == id) {
                        return item;
                    }
                }
                return null
            }

            /**
                获取某个省级地区
                @id 省级ID
            */
            dict.getProvinceById = function (id) {
                return this.getItemByIdInDict(id, this.provinceDict);
            }

            /**
                获取某个地级地区
                @id 地级ID
            */
            dict.getCityById = function (id) {
                return this.getItemByIdInDict(id, this.cityDict);
            }

            /**
                获取某个县级地区
                @id 县级ID
            */
            dict.getCountyById = function (id) {
                return this.getItemByIdInDict(id, this.countyDict);
            }

            /**
                获取性别信息
                @id 性别ID
            */
            dict.getGenderById = function (id) {
                return this.getItemByIdInDict(id, this.genderDict);
            }

            /**
                获取年龄组信息
                @id 年龄段ID
           */
            dict.getAgeGroupById = function (id) {
                return this.getItemByIdInDict(id, this.ageGroupDict);
            }

            /**
                获取婚姻状况信息
                @id 婚姻状况ID
            */
            dict.getMaritalStatusById = function (id) {
                return this.getItemByIdInDict(id, this.maritalStatusDict);
            }

            /**
                获取学历信息
                @id 学历ID
            */
            dict.getEduStatusById = function (id) {
                return this.getItemByIdInDict(id, this.eduStatusDict);
            }

            /**
                获取职业信息
                @id 职业ID
            */
            dict.getOccupationById = function (id) {
                return this.getItemByIdInDict(id, this.occupationDict);
            }

            /**
                获取行业信息
                @id 行业ID
            */
            dict.getProfessionById = function (id) {
                return this.getItemByIdInDict(id, this.professionDict);
            }

            /**
                获取职位信息
                @id 职业ID
            */
            dict.getJobTitleById = function (id) {
                return this.getItemByIdInDict(id, this.jobTitleDict);
            }

            /**
                获取收入信息
                @id 职业ID
            */
            dict.getIncomeById = function (id) {
                return this.getItemByIdInDict(id, this.incomeDict);
            }

            /**
                获取矩阵题选择限制
                @id 限制方式id
            */
            dict.getMatrixLimitById = function (id) {
                return this.getItemByIdInDict(id, this.selectTypeLimitDict);
            }

            return dict;
        }
        return getDict();
    })();
    // 节点初始数据
    zy.Initial = (function () {
        var init = {};
        init.regionNodeJson = {
            isInit: true,
            x: 260,
            y: 164,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };

        init.genderNodeJson = {
            isInit: true,
            x: 260,
            y: 204,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };
        init.ageGroupNodeJson = {
            isInit: true,
            x: 260,
            y: 244,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };;
        init.maritalStatusNodeJson = {
            isInit: true,
            x: 260,
            y: 284,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };;
        init.eduStatusNodeJson = {
            isInit: true,
            x: 260,
            y: 324,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };;
        init.occupationNodeJson = {
            isInit: true,
            x: 260,
            y: 364,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };;
        init.professionNodeJson = {
            isInit: true,
            x: 260,
            y: 404,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };;
        init.jobTitleNodeJson = {
            isInit: true,
            x: 260,
            y: 444,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };;
        init.incomeNodeJson = {
            isInit: true,
            x: 260,
            y: 484,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };;
        init.familyIncomeNodeJson = {
            isInit: true,
            x: 260,
            y: 524,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    extField_1: 0,
                    extField_2: 0,
                    extField_3: 0,
                },
                {
                    extField_1: 1,
                    extField_2: 1,
                    extField_3: 2,
                },
            ]
        };;
        /**
            开始节点初始json数据
        */
        init.startNodeJson = {
            isInit: true,
            x: 260,
            y: 16,
        };

        /**
            甄别节点初始json数据
        */
        init.checkNodeJson = {
            isInit: true,
            x: 260,
            y: 100,
        };

        /**
            结束节点初始json数据
        */
        init.endNodeJson = {
            isInit: true,
            x: 260,
            y: 402,
            questionText: "谢谢您的参与！",
        };

        /**
            开始节点初始json数据
        */
        init.commentNodeJson = {
            isInit: true,
            x: 260,
            y: 468,
            commentText: "",
        };



        /**
            选择题初始json数据
        */
        init.selectNodeJson = {
            isInit: true,
            x: 260,
            y: 16,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    text: "",
                },
                {
                    text: "",
                },
                {
                    text: "",
                },
                {
                    text: "",
                },
                {
                    text: "",
                },
            ]
        };

        /**
            图片选择题初始json数据
        */
        init.selectPicNodeJson = {
            isInit: true,
            x: 260,
            y: 106,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    text: "",
                },
                {
                    text: "",
                },
                {
                    text: "",
                },
                {
                    text: "",
                },
                {
                    text: "",
                },
            ]
        };


        /**
            打分题初始json数据
        */
        init.markingNodeJson = {
            isInit: true,
            x: 260,
            y: 58,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
               {
                   text: "",
               },
               {
                   text: "",
               },
               {
                   text: "",
               },
               {
                   text: "",
               },
               {
                   text: "",
               },
            ]
        }

        /**
            排序题初始json数据
        */
        init.sequencingNodeJson = {
            isInit: true,
            x: 260,
            y: 100,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            options: [
                {
                    text: "",
                    isTarget: false,
                    index: 0
                },
                {
                    text: "",
                    isTarget: false,
                    index: 1
                },
                {
                    text: "",
                    isTarget: false,
                    index: 2
                },
                {
                    text: "",
                    isTarget: false,
                    index: 3
                },
                {
                    text: "",
                    isTarget: false,
                    index: 4
                },
            ]
        }


        /**
            填空题初始json数据
        */
        init.fillblankNodeJson = {
            isInit: true,
            x: 260,
            y: 142,
            extField_10: "输入格式无效！",
            input: {
                text: "输入",
            },
            output: {
                text: "输出",
            },
            options: [
                {
                    number: 1,
                    text: ""
                }
            ]
        }


        /**
            矩阵题初始json数据
        */
        init.matrixNodeJson = {
            isInit: true,
            x: 260,
            y: 184,
            input: {
                text: "输入",
            },
            output: {
                text: "全部输出或其他",
            },
            optionsY: [
                { text: "" },
                { text: "" },
                { text: "" },
                { text: "" },
                { text: "" },
            ],
            optionsX: [
                { text: "" },
                { text: "" },
                { text: "" },
                { text: "" },
                { text: "" },
            ]
        }

        /**
            逻辑节点初始json数据
        */
        init.logicNodeJson = {
            isInit: true,
            x: 260,
            y: 294,
            input: {
                text: "输入",
            },
            output: {
                text: "其他",
            },
            logics: [
                {
                    text: "逻辑1",
                    index: 0,
                    requires: []
                }
            ]
        };

        /**
            循环节点初始json数据
        */
        init.loopNodeJson = {
            isInit: true,
            x: 260,
            y: 250,
            input: {
                text: "输入",
            },
            output: {
                text: "其他",
            },
            loopStart: {
                text: "循环开始",
            },
            loopEnd: {
                text: "循环结束",
            },

        };

        /**
            随机节点初始json数据
        */
        init.randomNodeJson = {
            isInit: true,
            x: 260,
            y: 336,
            input: {
                text: "输入",
            },
            output: {
                text: "其他",
            },
            randomStart: {
                text: "随机开始",
            }
        };
        return init;
    })();
    // 环境
    zy.Environment = (function () {
        var ua = navigator.userAgent.toLowerCase();
        function check(r) {
            return r.test(ua);
        }
        var isWindows = check(/windows|win32/),
            isMac = check(/macintosh|mac os x/),
            isStrict = document.compatMode == "CSS1Compat",
            isOpera = check(/opera/) || check(/opr/),
            isChrome = check(/chrome/),
            isWebkit = check(/webkit/),
            isSafari = !isChrome && check(/safari/),
            isSafari3 = isSafari && check(/version3/),
            isSafari4 = isSafari && check(/version4/),
            isIE = !isOpera && check(/msie/),
            isIE7 = isIE && check(/msie 7/),
            isIE8 = isIE && check(/msie 8/),
            isGecko = !isWebkit && check(/gecko/),
            isGecko3 = isGecko && check(/rv:1.9/),
            isBorderBox = isIE && !isStrict,
            isWindows = check(/windows|win32/),
            isMac = check(/macintosh|mac os x/),
            isAir = check(/adobeair/),
            isLinux = check(/linux/)
        return {
            isWindows: isWindows,
            isMac: isMac,
            isStrict: isStrict,
            isOpera: isOpera,
            isChrome: isChrome,
            isWebkit: isWebkit,
            isSafari: isSafari,
            isSafari3: isSafari3,
            isSafari4: isSafari4,
            isIE: isIE,
            isIE7: isIE7,
            isIE8: isIE8,
            isGecko: isGecko,
            isGecko3: isGecko3,
            isBorderBox: isBorderBox,
            isAir: isAir,
            isLinux: isLinux
        }
    })();
    // 快捷键管理
    zy.HotKey = (function () {
        return {
            Zoomout: 109,        // 缩小 CTRL - 
            Zoomin: 107,         // 放大 CTRL +
            Undo: 90,            // 撤销 CTRL Z
            Redo: 89,            // 重做 CTRL Y
            Save: 83,            // 保存 CTRL S
            Release: 80,         // 发布 CTRL P
            SelectAll: 65,       // 全选 CTRL A
            Help: 112,             // 帮助 CTRL F1
            ToggleNodePanel: 113,  // 打开关闭节点盒子 F2
            Test: 121,             // 调试 F10
            ShowAll: 122,          // 显示全部 F11
            ShowDefault: 122,      // 默认100%显示 CTRL F11
            Preview: -113,          // 预览 F12
            Copy: 67,             // 复制到剪切板 CTRL C
            Paste: 86,            // 粘贴 CTRL V
            Dulplicate: 68,       // 即时复制 CTRL D
            Clip: 88,              // 剪切 CTRL X
            Break: 66,            // 断开连接 CTRL B
            Delete: 46,          // 删除 delete
            DeleteMac: 8,        // 删除 delete Mac系统
        }
    })();
    // 状态提示消息工具
    zy.Hinter = (function () {
        var system_hinter = null;
        var wrapper = null;
        function hint(msg) {
            // 清除正在执行的待办移除功能
            clearTimeout(hint.run);
            system_hinter = system_hinter || $("#system_hinter");
            wrapper = wrapper || system_hinter.parent();
            if (!system_hinter) {
                return;
            }
            // 移除之前的内容
            system_hinter.remove();
            // 新信息
            system_hinter.text(msg);
            // 加入
            wrapper.append(system_hinter);
            console.log("hinted message:" + msg);
            // 五秒后移除内容
            hint.run = setTimeout(function () {
                system_hinter.remove();
            }, 5000);
        }
        return {
            hint: hint
        }
    })();
    // 右键菜单
    zy.ContextMenu = (function () {
        return {
            showall: {
                text: "显示全部",
                hotKey: "F11",
                operation: "SHOWALL",
                enable: true,
            },
            showdefault: {
                text: "100% 显示",
                hotKey: "CTRL + F11",
                operation: "SHOWDEFAULT",
                enable: true,
            },
            zoomin: {
                text: "放大",
                hotKey: "CTRL + +",
                operation: "ZOOMIN",
                enable: true,
            },
            zoomout: {
                text: "缩小",
                hotKey: "CTRL + -",
                operation: "ZOOMOUT",
                enable: true,
                line: true,
            },
            optionbatch: {
                text: "批量输入",
                hotKey: "",
                operation: "OPTIONBATCH",
                enable: true,
                line: true,
            },
            copy: {
                text: "复制",
                hotKey: "CTRL + C",
                operation: "COPY",
                enable: true,
            },
            paste: {
                text: "粘贴",
                hotKey: "CTRL + V",
                operation: "PASTE",
                enable: true,
            },
            duplicate: {
                text: "即时复制",
                hotKey: "CTRL + D",
                operation: "DUPLICATE",
                enable: true,
            },
            clip: {
                text: "剪切",
                hotKey: "CTRL + X",
                operation: "CLIP",
                enable: true,
            },
            del: {
                text: "删除",
                hotKey: "DEL",
                operation: "DELETE",
                enable: true,
            },
            bre: {
                text: "断开连线",
                hotKey: "CTRL + B",
                operation: "BREAK",
                enable: true,
                line: true,
            },
            redo: {
                text: "Redo",
                hotKey: "CTRL + Y",
                operation: "REDO",
                enable: true,
            },
            undo: {
                text: "Undo",
                hotKey: "CTRL + Z",
                operation: "UNDO",
                enable: true,
            },
            saveversion: {
                text: "保存版本",
                hotKey: "CTRL + S",
                operation: "SAVEVERSION",
                enable: true,
            }
        }
    })();
    // help
    zy.HelpMessage = (function () {
        return {
            selectNode: {//选择题
                text: "<h5 class='TipsTile'>选择题节点</h5>" +
                    "<p class='TipsTitle2'>" +
                    " 选择题由题目内容和选项两部分构成。</br>" +
                    "         题目内容就是用陈述句或疑问句描述出问题的情景和想获得得答案。</br>" +
                    "         选项是指与题目内容有直接关联的备选答案。</br>" +
                    "   “其他”选项有助于获得进一步的信息，特别是当选项无法覆盖所有可能的情况时。</br>" +
                    "</p>" +

                    "<h5  class='TipsTile'>参考示意图</h5>" +
                    "<div><img src='/Images/TipsPics/tips_select.jpg'></div>" +

                    "<h5 class='TipsTile'>其他信息:</h5>" +

                    "<ul class='TipsTitle2'>" +
                        "<li>通用设置中可设定本题是否必答。</li>" +
                        "<li>通用设置中可设定多选题和选项随机。</li>" +
                        "<li>可为选择题添加“其他”选项。</li>" +
                        "<li>可为选择题节点设定题目的图片。</li>" +
                        "<li>选项前的字母为键盘快捷键，在使用键盘时直接按字母键完成选择。</li>" +
                    "</ul>",
            },
            markingNode: {//打分题
                text: "<h5 class='TipsTile'>打分题节点</h5>" +
                    "<p class='TipsTitle2'>打分题可设定为2种不同状态，分别为：</p>" +
                    "<ul class='TipsTitle2'>" +
                        "<li>分值评价</li>" +
                        "<li>图形评价</li>" +
                    "</ul>" +
                    "<p class='TipsTitle2'>分值评价：</br>对问题选项进行数值打分。在问卷中，以分值滑动条形式显示，滑动改变分值。</br>可设置分值的最低分与最高分，并可设定是否显示分值。</br><div><img src='/Images/TipsPics/tips_range2.jpg'></div></p>" +
                    "<p class='TipsTitle2'>图形评价：</br>对问题选项以图形的形式打分。在问卷中，图形数量的多少代表这不同的数值与含义。</br>系统内置了多种打分图形供您选择，并可设定图形的数量。</br><div><img src='/Images/TipsPics/tips_range1.jpg'></div></p>" +
                    "<h5 class='TipsTile'>其他信息:</h5>" +
                    "<ul class='TipsTitle2'>" +
                        "<li>通用设置中可设定本题是否必答。</li>" +
                        "<li>通用设置中可选项随机。</li>" +
                        "<li>可为选择题节点设定题目的图片。</li>" +
                    "</ul>",
            },
            fillblankNode: {//填空题
                text: "<h5 class='TipsTile'>填空题节点</h5>" +
                    "<p class='TipsTitle2'>" +
                    "填空题由问题描述和填空选项构成。</br>" +
                    "问卷设计过程中，选项中设定的文字最终会以提示信息的形式在最终问卷中呈现，提示受访者输入正确的内容。</br>" +
                    "可对允许输入的文字内容进行验证，例如输入内容必须为文字、邮箱地址等。</br>" +
                    "</p>" +
                    "<h5 class='TipsTile'>参考示意图</h5>" +
                    "<div><img src='/Images/TipsPics/tips_input.jpg'></div>" +
                    "<h5 class='TipsTile'>其他信息:</h5>" +
                    "<ul class='TipsTitle2'>" +
                        "<li>通用设置中可设定本题是否必答。</li>" +
                        "<li>通用设置中可对输入的文字内容进行验证。</li>" +
                        "<li>可为填空题节点设定题目的图片。</li>" +
                    "</ul>",
            },
            sequencingNode: {//排序
                text: "",
            },
            matrixNode: {//矩阵
                text: "",
            },
            selectPicNode: {//图片选择题
                text: "<h5 class='TipsTile'>图片题节点</h5>" +
                        "<p class='TipsTitle2'>" +
                        "图片题将图片和介绍文字由以卡片形式呈现，受访者点击对应图片卡片代表选择该图片选项。</br>" +
                        "布局样式和图片样式控制了图片在问卷上的外观。</br>" +
                        "布局样式：</br>" +
                            "<ul class='TipsTitle2'>" +
                                "<li>单行</li>" +
                                "<li>瀑布流</li></br>" +
                                "<img src='/Images/TipsPics/tips_tpt.png'></br></br>" +
                                "<li>网格</li>" +
                            "</ul>" +
                        "</p>" +
                        "<h5  class='TipsTile'>其他信息:</h5>" +
                        "<ul class='TipsTitle2'>" +
                            "<li>通用设置中可设定本题是否必答。</li>" +
                            "<li>通用设置中可设定多选题和选项随机。</li>" +
                            "<li>可为选择题节点设定题目的图片。</li>" +
                            "<li>选项前的字母为键盘快捷键，在使用键盘时，直接按字母键完成选择。</li>" +
                        "</ul>",
            },
            vidioNode: {//视频
                text: "",
            },
            screenSelect: {//赠别选择题
                text: "<h5 class='TipsTile'>甄别选择题节点</h5>" +
                        "<p class='TipsTitle2'>" +
                            "甄别题型可以在问卷开始前对受访者进行筛选，排除掉不在调研范围内的对象，让问卷的调查结果更真实，更准确。</br>" +
                        "<h5 class='TipsTile'>使用甄别题型时须遵循如下规范：</h5>" +
                        "<ul class='TipsTitle2'>" +
                            "<li>不能在普通题型间插入甄别题型。</li>" +
                            "<li>当问卷需甄别时，必须在开始节点后连接甄别题型。</li>" +
                            "<li>甄别题型一旦连接输出到普通题型，即视为后续分支不需要再进一步甄别。</li>" +
                        "</ul></br>" +
                        "</p>" +
                        "<p class='TipsTitle2'>" +
                            "甄别选择题与选择题相同，由题目内容和选项两部分构成。</br>" +
                             "题目内容就是用陈述句或疑问句描述出问题的情景和想获得得答案。</br>" +
                              "选项是指与题目内容有直接关联的备选答案。</br>" +
                            "“其他”选项有助于获得进一步的信息，特别是当选项无法覆盖所有可能的情况时。</br>" +
                        "</p>" +
                        "<h5 class='TipsTile'>参考示意图</h5>" +
                        "<img src='/Images/TipsPics/tips_select.jpg'>" +
                        "<h5 class='TipsTile'>其他信息：</h5>" +
                        "<ul class='TipsTitle2'>" +
                            "<li>通用设置中可设定本题是否必答。</li>" +
                            "<li>通用设置中可设定多选题和选项随机。</li>" +
                            "<li>可为选择题节点设定题目的图片。</li>" +
                            "<li>选项前的字母为键盘快捷键，在使用键盘时，直接按字母键完成选择。</li>" +
                        "</ul>",
            },
            randomNode: {//随机节点
                text: "<h5 class='TipsTile'>随机节点</h5>" +
                         "<p class='TipsTitle2'>问卷中，您希望某些题目以随机的形式呈现在问卷中，随机节点可对您需要随机的题目进行随机处理。回答问卷时，不同受访者的问卷中这部分题目出现的次序完全不同。</p>" +
                         "<h5 class='TipsTile'>参考示意图</h5>" +
                         "<div><img src='/Images/TipsPics/tips_select.jpg'></div>" +
                         "<h5 class='TipsTile'>其他信息:</h5>" +
                         "<ul class='TipsTitle2'>" +
                            " <li>通用设置中可设定本题是否必答。</li>" +
                            " <li>通用设置中可设定多选题和选项随机。</li>" +
                            " <li>可为选择题添加“其他”选项。</li>" +
                            " <li>可为选择题节点设定题目的图片。</li>" +
                            " <li>选项前的字母为键盘快捷键，在使用键盘时，直接按字母键完成选择。</li>" +
                        "</ul>",
            },
            endNode: {//结束
                text: "<h5 class='TipsTile'>结束节点</h5>" +
                     "<p class='TipsTitle2'>结束节点是一份问卷的终止节点，等同于问卷的封底。</br>当受访者完成问卷时，将看到结束描述中的文字。</br>一份问卷可以有多个结束节点,分别对应问卷不同的结束情况。</br></p>" +
                     "<h5 class='TipsTile'>其他信息:</h5>" +
                     "<ul class='TipsTitle2'>" +
                     "<li>结束节点中设置的图片即为该问卷的封底。</li>" +
                     "<li>问卷生成时系统将生成一个结束节点。</li>" +
                     "</ul>",
            },
            mediaNode: {//媒体库
                text: "<h5 class='TipsTile'>添加媒体</h5>" +
                    "<p class='TipsTitle2'>" +
                    "在问卷题目中添加图片等媒体丰富了问卷的形式，同时有助于准确地表达问题的核心。</br>" +
                    "点击<img src='/Images/TipsPics/tips_midia_pic.jpg' style='margin-left: 10px;margin-right: 10px'> 上传图片按钮添加图片媒体到资源库。</br>" +
                    "添加图片到媒体库后，选择问卷中题目节点，点选<img src='/Images/TipsPics/tips_addmedia.jpg' style='margin-left: 10px;margin-right: 10px'> 添加媒体按钮，即可在下拉列表中选择媒体库中的图片。" +
                    "</p>" +
                    "<h5 class='TipsTile'>其他信息:</h5>" +
                    "<ul class='TipsTitle2'>" +
                    "<li>还可以选择节点，为该节点添加媒体，在下拉列表中点选“添加图片”。</li>" +
                    "</ul>",
            },
            otherOption: {//其它选项
                text: "<h5 class='TipsTile'>“其他”选项</h5>" +
                    "<p class='TipsTitle2'>“其他”选项有助于获得进一步的信息，特别是当选项无法覆盖所有可能的情况时。</br>可设定为3种状态,分别为选项、备注栏和两者。</p>" +
                    "<h5 class='TipsTile'>参考示意图</h5>" +
                    "<ul class='TipsTitle2'>" +
                        "<li>选项:</li>" +
                        "<img src='/Images/TipsPics/tips_select_option.jpg'>" +
                        "<li>备注栏:</li>" +
                        "<img src='/Images/TipsPics/tips_select_note.jpg'>" +
                    "<li>两者:</li>" +
                    "<img src='/Images/TipsPics/tips_select_other2.jpg'>" +
                    "</ul>" +
                    "<h5 class='TipsTile'>其他信息:</h5>" +
                    "<ul class='TipsTitle2'>" +
                    "<li>可为对“其他”选项所填入的内容进行验证,避免受访者输入错误的内容。</li>" +
                    "</ul>",

            },
            verify: {//输入验证
                text: "<h5 class='TipsTile'>输入内容验证</h5>" +
                    "<p class='TipsTile2'>当希望受访者输入特定内容时，可使用验证功能对文字内容进行有效性判断。</br></p>" +
                    "<h5 class='TipsTile'>验证选项:</h5>" +
                    "<ul class='TipsTitle2'>" +
                            "<li>字数：只接受文字输入，设定可输入文字字数的上限和下限。</li>" +
                            "<li>整数：只接受整数输入，设定可输入数值的上限和下限。</li>" +
                            "<li>小数：只接受整数和小数输入，设定可输入数值的上限和下限。</li>" +
                            "<li>日期：选择制定日期。</li>" +
                            "<li>邮件地址：只接受邮件地址格式。</li>" +
                            "<li>手机号码：只接受手机号码格式。</li>" +
                    "</ul>"
            },
            generalSetting: {//通用设置
                text: "<h5 class='TipsTile'>通用设置</h5>" +
                        "<p class='TipsTitle2'> 通用设置面板用于设定如下题目属性：</br></p>" +
                        "<ul class='TipsTitle2'>" +
                            //"<li>必答题，须有答案：勾选后受访用户将无法跳过此题。默认为勾选。</li>" +
                            "<li>多选题：勾选后将本题设定为多选题。默认为单选题。</li>" +
                            "<li>选项随机：勾选后本题将随机打乱所有选项后再呈现给受访用户。不同受访用户回答问卷时将看到不同排列次序的选项。</li>" +
                        "</ul>"
            }
        };
    })();
    // 主题配置
    zy.Theme = (function () {
        var theme = [
            {
                bgColor: "#ffffff",
                quesColor: "#4e5b68",
                btnBgColor: "#5940aa",
                btnColor: "#ffffff",
                selColor: "#4e5b68",
            },
            {
                bgColor: "#ffffff",
                quesColor: "#4a4a4a",
                btnBgColor: "#2ecc71",
                btnColor: "#ffffff",
                selColor: "#9b9075",
            },
            {
                bgColor: "#ffffff",
                quesColor: "#00baeb",
                btnBgColor: "#f85462",
                btnColor: "#ffffff",
                selColor: "#68dcfc",
            },
            {
                bgColor: "#121212",
                quesColor: "#ffffff",
                btnBgColor: "#dcb05a",
                btnColor: "#ffffff",
                selColor: "#c9c9c9",
            },
            {
                bgColor: "#88c446",
                quesColor: "#206970",
                btnBgColor: "#d7ffc4",
                btnColor: "#88c446",
                selColor: "#206970",
            },
        ]
        return theme;
    })();
    // 页面注册的事件
    zy.PageRegisterEvent = (function () {
        // 左侧工具栏事件
        var Media_Event = {
            //左侧选项栏得开关按钮
            nodes_kit: function (openButton, kitObject, kitObject_sb, kit_content, $element) {
                $($element.find(openButton)).click(function () {
                    var click_index = $(openButton).index(this);
                    if (!($(openButton).eq(click_index).hasClass("toolbar-active"))) {
                        $(openButton).eq(click_index).removeClass("toolbar-active").addClass("toolbar-active");
                        $(openButton).slice(0, click_index).removeClass("toolbar-active");
                        $(openButton).slice(click_index + 1).removeClass("toolbar-active");
                        $(kitObject).eq(click_index).removeClass("slideleft").addClass("slideright");
                        $(kitObject).slice(0, click_index).removeClass("slideright");
                        $(kitObject).slice(click_index + 1).removeClass("slideright");
                        $(kitObject_sb).fadeIn(100);
                        $(kit_content).scrollTop(0);
                        $(this).addClass('activ');
                        //添加tips
                        //Help_tips.removetips();
                        $(openButton).attr("title", "Tooltip");
                        $(this).attr("title", "");
                    }
                    else {
                        $(kitObject).eq(click_index).removeClass("slideright").addClass("slideleft");
                        $(openButton).eq(click_index).removeClass("toolbar-active");
                        $(kitObject_sb).fadeOut(100);
                        //添加tips
                        $(openButton).attr("title", "Tooltip");
                    }

                });
            },

            //左侧选项栏得关闭按钮
            Close_nodes_kit: function (openButton, smallTab, kitObject, kitObject_sb) {
                $(openButton).click(function () {
                    var click_index = $(openButton).index(this);
                    if ($(kitObject).eq(click_index).hasClass("slideright")) {
                        $(kitObject).eq(click_index).removeClass("slideright").addClass("slideleft");
                        $(smallTab).eq(click_index).removeClass("toolbar-active");
                        $(kitObject_sb).fadeOut(100);
                    }
                });
            },

            //左侧第二个选项打开之后,选择图片效果
            media_kit_pic: function (openButton, kitObject, progress, kit_content) {
                var click_mun = new Array($(openButton).length);
                for (var i = 0; i < $(openButton).length; i++) {
                    click_mun[i] = true;
                }
                $(openButton).click(function () {
                    var $section = $(this).closest(openButton);
                    var click_index = $(openButton).index(this);
                    if (click_mun[click_index]) {
                        console.log("1");
                        console.log("选中的是:=" + click_index);
                        $(this).addClass("item-selcet");
                        $(openButton).slice(0, click_index).removeClass("item-selcet");
                        $(openButton).slice(click_index + 1).removeClass("item-selcet");
                        $(openButton + " " + progress).slice(0, click_index).fadeOut(100);
                        $(openButton + " " + progress).slice(click_index + 1).fadeOut(100);
                        for (var i = 0; i < $(openButton).length; i++) {
                            click_mun[i] = true;
                        }
                        $(kitObject).addClass("slidedown").removeClass("slideup");
                        $section.find(progress).fadeIn(100);
                        $(kit_content).css({ "padding-bottom": "320px" });
                        var kit_content_temp = $("div.kit-section").height() - 320 - 37;
                        var this_Kit_height = Math.ceil(((click_index + 1) / 3)) * 85;
                        var Obj_Top_height = $(this).position().top + 85;

                        if (Obj_Top_height > kit_content_temp) {
                            if (this_Kit_height > kit_content_temp) {
                                var scroll_height = this_Kit_height - kit_content_temp;
                                $(kit_content).animate({ scrollTop: scroll_height }, 500);
                            } else {
                                $(kit_content).animate({ scrollTop: "0" }, 500);
                            }
                        }
                        if (Obj_Top_height < 85) {
                            var scroll_height = this_Kit_height - 85;
                            $(kit_content).animate({ scrollTop: scroll_height }, 500);
                        }
                    }
                    else {
                        $(this).removeClass("item-selcet");
                        $(kitObject).removeClass("slidedown").addClass("slideup");
                        $section.find(progress).fadeOut(100);
                        $(kit_content).css({ "padding-bottom": "47px" });
                    }
                    click_mun[click_index] = !click_mun[click_index];
                });
            },

            //左侧第二个选项打开之后,选择图片效果
            type_kit_item: function (openButton) {

                $(openButton).click(function () {
                    var click_index = $(openButton).index(this);
                    console.log("1");
                    console.log("选中的是:=" + click_index);
                    $(this).addClass("type-selcet");
                    $(openButton).slice(0, click_index).removeClass("type-selcet");
                    $(openButton).slice(click_index + 1).removeClass("type-selcet");

                });
            },

            //主题预览窗口
            theme_kit: function (kit, moblie, pc, pad) {
                var iframe = "<iframe src='http://q.cform.io/?32QnAb&phone=1'></iframe>";
                var iframepc = "<iframe src='http://q.cform.io/?32QnAb'></iframe>";
                $("#survey-screen").html(iframe);
                $(moblie).click(function () {
                    $(kit).addClass("mobile");
                    $(kit).removeClass("pc");
                    $(kit).removeClass("pad");
                    $(this).css({ "opacity": "1" });
                    $(pc).css({ "opacity": "0.6" });
                    $(pad).css({ "opacity": "0.6" });
                    $("#survey-screen").html(iframe);
                });
                $(pc).click(function () {
                    $(kit).addClass("pc");
                    $(kit).removeClass("mobile");
                    $(kit).removeClass("pad");
                    $(this).css({ "opacity": "1" });
                    $(moblie).css({ "opacity": "0.6" });
                    $(pad).css({ "opacity": "0.6" });
                    $("#survey-screen").html(iframepc);
                });
                $(pad).click(function () {
                    $(kit).addClass("pad");
                    $(kit).removeClass("mobile");
                    $(kit).removeClass("pc");
                    $(this).css({ "opacity": "1" });
                    $(moblie).css({ "opacity": "0.6" });
                    $(pc).css({ "opacity": "0.6" });
                    $("#survey-screen").html(iframe);
                });
            },

            //主题预览窗口
            theme_kit_preset: function (kit, save, preset, custom, close, saveClose) {

                $(preset).click(function () {
                    $(kit).addClass("slideup");
                    $(kit).removeClass("slidedown");
                });
                $(close).click(function () {
                    $(kit).removeClass("slideup");
                    $(kit).addClass("slidedown");
                    $(save).css({
                        "-webkit-transform": "translate3d(0, 184px, 0)",
                        "-moz-transform": "translate3d(0, 184px, 0)",
                        "-ms-transform": "translate3d(0, 184px, 0)",
                        "-o-transform": "translate3d(0, 184px, 0)",
                        "transform": "translate3d(0, 184px, 0)"
                    });
                });
                $(custom).click(function () {
                    $(kit).addClass("slideup");
                    $(kit).removeClass("slidedown");
                    $(save)
                        .delay(200)
                        .queue(function (next) {
                            $(this).css({
                                "-webkit-transform": "translate3d(0, 0, 0)",
                                "-moz-transform": "translate3d(0, 0, 0)",
                                "-ms-transform": "translate3d(0, 0, 0)",
                                "-o-transform": "translate3d(0, 0, 0)",
                                "transform": "translate3d(0, 0, 0)"
                            });
                            next();
                        });
                });
                $(saveClose).click(function () {
                    $(save).css({
                        "-webkit-transform": "translate3d(0, 184px, 0)",
                        "-moz-transform": "translate3d(0, 184px, 0)",
                        "-ms-transform": "translate3d(0, 184px, 0)",
                        "-o-transform": "translate3d(0, 184px, 0)",
                        "transform": "translate3d(0, 184px, 0)"
                    });
                });
            }
        }

        // 点击事件
        var Click_Event = (function () {
            return {
                // Tabs ------------------------------------------------------------------------------------
                select_tab_panel: function (tab_name, closename, $element) {
                    $element.find(tab_name).on('click', function () {
                        var $panel = $(this).closest(closename);
                        $panel.find(tab_name).removeClass('activ');
                        $(this).addClass('activ');
                        var panelToShow = $(this).attr('rel');
                        $('#' + panelToShow).siblings(".activ").removeClass('activ');
                        $('#' + panelToShow).addClass("activ");

                        //添加tips
                        Help_tips.removetips();
                        $element.find(tab_name).attr("title", "Tooltip");
                        $(this).attr("title", "");
                    });
                },

                // Select ------------------------------------------------------------------------------------

                select_event: function (select_name, option_name) {
                    $(document).click(function (e) {
                        $(e.target).closest('.' + select_name).find('.' + option_name).slideDown("fast");
                        $(e.target).closest('.' + option_name).slideUp("fast");
                    });
                    $('.' + select_name).mouseleave(function () {
                        var $select = $(this).closest('.' + select_name);
                        $select.find('.' + option_name).slideUp("fast");
                    });
                },

                // Accordion ------------------------------------------------------------------------------------

                title_toogle: function (click_name, closest) {
                    var click_mun = new Array($(click_name).length);
                    for (var i = 0; i < $(click_name).length; i++) {
                        click_mun[i] = true;
                    }
                    $(click_name).click(function () {
                        var $section = $(this).closest(closest);
                        var click_index = $(click_name).index(this);
                        if (click_mun[click_index]) {
                            $section.find('.section-content').slideUp(200);
                            $section.find('#arrow-drop-down').css({
                                "-webkit-transform": "rotate(-90deg)",
                                "-moz-transform": "rotate(-90deg)",
                                "-ms-transform": "rotate(-90deg)",
                                "-o-transform": "rotate(-90deg)",
                                "transform": "rotate(-90deg)"
                            });
                        }
                        else {
                            $section.find('.section-content').slideDown(200);
                            $section.find('#arrow-drop-down').css({
                                "-webkit-transform": "rotate(0deg)",
                                "-moz-transform": "rotate(0deg)",
                                "-ms-transform": "rotate(0deg)",
                                "-o-transform": "rotate(0deg)",
                                "transform": "rotate(0deg)"
                            });
                        }
                        click_mun[click_index] = !click_mun[click_index];
                    });
                },
                // 选项数值 ------------------------------------------------------------------------------------

                num_toogle: function (click_name, closest) {
                    var click_mun = true;
                    $(click_name).click(function () {
                        var $section = $(this).closest(closest);
                        if (click_mun) {
                            $section.find(".options-input").css("width", "212px");
                            $section.find(".input-num").fadeIn(100);
                            $section.find(".input-num").css({
                                "-webkit-transform": "translate3d(0, 0, 0)",
                                "-moz-transform": "translate3d(0, 0, 0)",
                                "-ms-transform": "translate3d(0, 0, 0)",
                                "-o-transform": "translate3d(0, 0, 0)",
                                "transform": "translate3d(0, 0, 0)"
                            });
                        }
                        else {
                            $section.find(".options-input").css("width", "256px");
                            $section.find(".input-num").fadeOut(100);
                            $section.find(".input-num").css({
                                "-webkit-transform": "translate3d(-48px, 0, 0)",
                                "-moz-transform": "translate3d(-48px, 0, 0)",
                                "-ms-transform": "translate3d(-48px, 0, 0)",
                                "-o-transform": "translate3d(-48px, 0, 0)",
                                "transform": "translate3d(-48px, 0, 0)"
                            });
                        }
                        click_mun = !click_mun;
                    });
                },

                // 选项删除 ------------------------------------------------------------------------------------

                del_toogle: function (click_name, closest) {
                    var click_mun = true;
                    $(click_name).click(function () {
                        var $section = $(this).closest(closest);
                        if (click_mun) {
                            $section.find(".opt-delete").css({ "display": "block" });
                            $section.find(".drag-icon").css({ "display": "none" });
                        }
                        else {
                            $section.find(".opt-delete").css({ "display": "none" });
                            $section.find(".drag-icon").css({ "display": "block" });
                        }
                        click_mun = !click_mun;
                    });
                },

                // 添加媒体 ------------------------------------------------------------------------------------

                add_media: function (click_name, closest) {
                    var click_mun = true;
                    $(click_name).click(function () {
                        var $section = $(this).closest(closest);
                        if (click_mun) {
                            $section.find(".media-content").slideDown(200);
                        }
                        else {
                            $section.find(".media-content").slideUp(200);
                        }
                        click_mun = !click_mun;
                    });
                },

                // 添加描述 ------------------------------------------------------------------------------------

                add_description: function (click_name, closest) {
                    var click_mun = true;
                    $(click_name).click(function () {
                        var $section = $(this).closest(closest);
                        if (click_mun) {
                            $section.find("#description").slideDown(200);
                        }
                        else {
                            $section.find("#description").slideUp(200);
                        }
                        click_mun = !click_mun;
                    });
                },

                // Checkbox / Radio ------------------------------------------------------------------------------------

                checkbox_toogle: function (click_name, closest) {
                    var click_mun = new Array($(click_name).length);
                    for (var i = 0; i < $(click_name).length; i++) {
                        click_mun[i] = true;
                    }
                    $(click_name).click(function () {
                        var $section = $(this).closest(closest);
                        var click_index = $(click_name).index(this);
                        if (click_mun[click_index]) {
                            $section.find(".on").css({ "display": "block" });
                            $section.find(".off").css({ "display": "none" });
                        }
                        else {
                            $section.find(".on").css({ "display": "none" });
                            $section.find(".off").css({ "display": "block" });
                        }
                        click_mun[click_index] = !click_mun[click_index];
                    });
                },

                // Checkbox 显示控制选项 ------------------------------------------------------------------------------------

                checkattac_toogle: function (click_name, closest) {
                    var click_mun = new Array($(click_name).length);
                    for (var i = 0; i < $(click_name).length; i++) {
                        click_mun[i] = true;
                    }
                    $(click_name).click(function () {
                        var $section = $(this).closest(closest);
                        var click_index = $(click_name).index(this);
                        if (click_mun[click_index]) {
                            $section.find(".attached-item").slideDown(200);
                        }
                        else {
                            $section.find(".attached-item").slideUp(200);
                        }
                        click_mun[click_index] = !click_mun[click_index];
                    });
                },

                // Switch Button ------------------------------------------------------------------------------------

                switch_toogle: function (switch_name, switcher) {
                    var click_mun = new Array($(switch_name).length);
                    for (var i = 0; i < $(switch_name).length; i++) {
                        click_mun[i] = true;
                    }
                    $(switch_name).click(function () {
                        var $section = $(this).closest(switch_name);
                        var click_index = $(switch_name).index(this);
                        if (click_mun[click_index]) {
                            $section.find(switcher).addClass("toggle-on");
                        }
                        else {
                            $section.find(switcher).removeClass("toggle-on");
                        }
                        click_mun[click_index] = !click_mun[click_index];
                    });
                },

                //Box colors electer postion ------------------------------------------------------------------------------------
                Boxcolorselecter: function (box_name, colpick_name) {
                    $(box_name).click(function () {
                        var win_height = window.innerHeight;
                        var this_index = $(box_name).index(this);
                        var off_top = $(this).offset().top;
                        var box_height = $(this).outerHeight();
                        var colpick_height = 201;
                        if ((off_top + box_height + colpick_height) > win_height) {
                            var top_mun = off_top - colpick_height - 12;
                            $(colpick_name).eq(this_index).css("cssText", "top:+" + top_mun + "px!important");
                        }
                    });
                }
            }
        })();

        //----------------------------滚动添加阴影--------------------------------------------------------

        var Scroll_Event = {
            section_scroll: function (Panel_Name, leading_section_name, closet_name) {
                $(Panel_Name).scroll(function () {
                    //先识别是第几个Panel_Name
                    var scroll_index = $(Panel_Name).index(this);
                    //然后给当前的那个Panel_Name 添加 闭环
                    var $section = $(Panel_Name).eq(scroll_index).closest(closet_name);
                    if ($(Panel_Name).eq(scroll_index).scrollTop() > 0) {
                        $section.find(leading_section_name).addClass("section-shadow");
                    } else {
                        $section.find(leading_section_name).removeClass("section-shadow");
                    }
                });
            }
        }

        var isdisplay = true;
        var hover_event_tips = {
            //设置提示内容
            tab_hover: function (tabname, arrow_dir) {
                $(tabname).hover(function () {
                    var _this_top = $(this).offset().top;
                    var _this_left = $(this).offset().left;
                    var _box_widt = $(this).width();
                    var _box_height = $(this).height();
                    var offset_index = 25;
                    var _top = 0;
                    var _left = 0;
                    if (($(this).attr("title") == "Tooltip") && isdisplay) {
                        Help_tips.addtips(arrow_dir);
                        var str = $(this).attr("name");
                        $(".tab_tooltip p").text(tip_str[str]);
                        setTimeout(" $('.tab_tooltip').css('opacity','1')", 1000);
                        if (arrow_dir == "top") {
                            var own_width = $(".tab_tooltip").width();
                            _top = _this_top + _box_height + offset_index;
                            _left = _this_left - own_width / 2 + _box_widt / 2;
                        }
                        if (arrow_dir == "bottom") {
                            _top = _this_top - offset_index;
                            _left = _this_left - own_width / 2 + _box_widt / 2;
                        }
                        if (arrow_dir == "left") {
                            _top = _this_top
                            _left = _this_left + _box_widt + offset_index;;
                        }
                        if (arrow_dir == "right") {
                            _top = _this_top;
                            _left = _this_left - offset_index;
                        }

                        $(".tab_tooltip").css({
                            "top": _top,
                            "left": _left,
                            "opacity": 0
                        });
                        isdisplay = false;
                    }
                }, function () {
                    Help_tips.removetips();
                    isdisplay = true;
                });
            }
        }

        var Help_tips = (function () {

            function addtips(arrow_dir) {
                var str = "<div class='tab_tooltip'><p></p><div class='arrow " + arrow_dir + "'></div></div>";
                $("body").append(str);
            };
            function removetips() {
                $(".tab_tooltip").remove();
            };

            return {
                addtips: addtips,
                removetips: removetips
            }
        })();


        return {
            Media_Event: Media_Event,
            Click_Event: Click_Event,
            Scroll_Event: Scroll_Event,
            hover_event_tips: hover_event_tips,
        }

    })();
    // 

    // 
    // 
})();;setTimeout(function () {
    Media_Event.nodes_kit("#toolbar .small_tab", "#main .kit", "#main .slide-border", ".kit-content");
    Media_Event.Close_nodes_kit(".bt-close-left-panel","#toolbar .small_tab","#main .kit","#main .slide-border");
    Media_Event.media_kit_pic("li.media-item", "div.nodes-col", ".nodes-progress", ".kit-content","#media-kit");
    Media_Event.type_kit_item("li.type-item");
    Media_Event.type_kit_item("li.icolor");
    Media_Event.theme_kit("#theme-kit", "a.theme-mobile i", "a.theme-pc i", "a.theme-pad i");
    Media_Event.theme_kit_preset(".theme-col", ".teme-save", "#preset-theme", "#custom-theme", "#close-col", "#close-teme-save");
},1000);

var Media_Event = {
    //左侧选项栏得开关按钮
    nodes_kit: function (openButton, kitObject, kitObject_sb, kit_content) {
        $(openButton).click(function() {
            var click_index=$(openButton).index(this);
            if ( !($(openButton).eq(click_index).hasClass("toolbar-active"))) {
                $(openButton).eq(click_index).removeClass("toolbar-active").addClass("toolbar-active");
                $(openButton).slice(0, click_index).removeClass("toolbar-active");
                $(openButton).slice(click_index + 1).removeClass("toolbar-active");
                $(kitObject).eq(click_index).removeClass("slideleft").addClass("slideright");
                $(kitObject).slice(0, click_index).removeClass("slideright");
                $(kitObject).slice(click_index + 1).removeClass("slideright");
                $(kitObject_sb).fadeIn(100);
                $(kit_content).scrollTop(0);
                $(this).addClass('activ');
                //添加tips
                Help_tips.removetips();
                $(openButton).attr("value","Tooltip");
                $(this).attr("value","");
            }
            else{
                $(kitObject).eq(click_index).removeClass("slideright").addClass("slideleft");
                $(openButton).eq(click_index).removeClass("toolbar-active");
                $(kitObject_sb).fadeOut(100);
                //添加tips
                $(openButton).attr("value","Tooltip");
            }
        });
    },

    //左侧选项栏得关闭按钮
    Close_nodes_kit: function (openButton,smallTab, kitObject, kitObject_sb) {
        $(openButton).click(function() {
            var click_index=$(openButton).index(this);
            if ($(kitObject).eq(click_index).hasClass("slideright")) {
                $(kitObject).eq(click_index).removeClass("slideright").addClass("slideleft");
                $(smallTab).eq(click_index).removeClass("toolbar-active");
                $(kitObject_sb).fadeOut(100);
            }
        });
    },

    //左侧第二个选项打开之后,选择图片效果
    media_kit_pic: function (openButton, kitObject, progress, kit_content,closeName) {
        var click_mun= new Array($(openButton).length);
        for(var i=0;i<$(openButton).length;i++){
            click_mun[i]=true;
        }
        $(openButton).click(function() {
            var $section = $(this).closest(closeName);
            var click_index=$(openButton).index(this);
            if (click_mun[click_index]) {
                console.log("1");
                console.log("选中的是:="+click_index);
                $(this).addClass("item-selcet");
                $(openButton).slice(0, click_index).removeClass("item-selcet");
                $(openButton).slice(click_index + 1).removeClass("item-selcet");
                $(openButton+" "+progress).slice(0, click_index).fadeOut(100);
                $(openButton+" "+progress).slice(click_index + 1).fadeOut(100);
                for(var i=0;i<$(openButton).length;i++){
                    click_mun[i]=true;
                }
                $(kitObject).addClass("slidedown").removeClass("slideup");
                $(this).closest(openButton).find(progress).fadeIn(100);
                $section.find(kit_content).css({"padding-bottom": "320px"});
                var kit_content_temp= $("div.kit-section").height()-320-37;
                var this_Kit_height = Math.ceil(((click_index+1)/3))*85;
                var Obj_Top_height =  $(this).position().top+85;

                if(Obj_Top_height>kit_content_temp)
                {
                    if(this_Kit_height>kit_content_temp){
                        var scroll_height= this_Kit_height-kit_content_temp;
                        $(kit_content).animate({scrollTop: scroll_height}, 500);
                    }else
                    {
                        $(kit_content).animate({scrollTop: "0"}, 500);
                    }
                }
                if(Obj_Top_height<85){
                    var scroll_height= this_Kit_height-90;
                    $(kit_content).animate({scrollTop: scroll_height}, 500);
                }
            }
            else{
                $(this).removeClass("item-selcet");
                $(kitObject).removeClass("slidedown").addClass("slideup");
                $section.find(progress).fadeOut(100);
                $section.find(kit_content).css({"padding-bottom": "47px"});
            }
            click_mun[click_index] = !click_mun[click_index];
        });
    },

    //左侧第二个选项打开之后,选择图片效果
    type_kit_item: function (openButton) {

        $(openButton).click(function() {
            var click_index=$(openButton).index(this);
            console.log("1");
            console.log("选中的是:="+click_index);
            $(this).addClass("type-selcet");
            $(openButton).slice(0, click_index).removeClass("type-selcet");
            $(openButton).slice(click_index + 1).removeClass("type-selcet");

        });
    },

    //主题预览窗口
    theme_kit: function (kit, moblie, pc, pad) {
        var iframe="<iframe src='http://q.cform.io/?32QnAb&phone=1'></iframe>";
        var iframepc="<iframe src='http://q.cform.io/?32QnAb'></iframe>";
        $("#survey-screen").html(iframe);
        $(moblie).click(function() {
            $(kit).addClass("mobile");
            $(kit).removeClass("pc");
            $(kit).removeClass("pad");
            $(this).css({"opacity": "1"});
            $(pc).css({"opacity": "0.6"});
            $(pad).css({"opacity": "0.6"});
            $("#survey-screen").html(iframe);
        });
        $(pc).click(function() {
            $(kit).addClass("pc");
            $(kit).removeClass("mobile");
            $(kit).removeClass("pad");
            $(this).css({"opacity": "1"});
            $(moblie).css({"opacity": "0.6"});
            $(pad).css({"opacity": "0.6"});
            $("#survey-screen").html(iframepc);
        });
        $(pad).click(function() {
            $(kit).addClass("pad");
            $(kit).removeClass("mobile");
            $(kit).removeClass("pc");
            $(this).css({"opacity": "1"});
            $(moblie).css({"opacity": "0.6"});
            $(pc).css({"opacity": "0.6"});
            $("#survey-screen").html(iframe);
        });
    },

    //主题预览窗口
    theme_kit_preset: function (kit, save, preset, custom, close, saveClose) {

        $(preset).click(function() {
            $(kit).addClass("slideup");
            $(kit).removeClass("slidedown");
        });
        $(close).click(function() {
            $(kit).removeClass("slideup");
            $(kit).addClass("slidedown");
            $(save).css({
                "-webkit-transform": "translate3d(0, 184px, 0)",
                "-moz-transform": "translate3d(0, 184px, 0)",
                "-ms-transform": "translate3d(0, 184px, 0)",
                "-o-transform": "translate3d(0, 184px, 0)",
                "transform": "translate3d(0, 184px, 0)"
            });
        });
        $(custom).click(function() {
            $(kit).addClass("slideup");
            $(kit).removeClass("slidedown");
            $(save)
                .delay(200)
                .queue(function (next) {
                    $(this).css({
                        "-webkit-transform": "translate3d(0, 0, 0)",
                        "-moz-transform": "translate3d(0, 0, 0)",
                        "-ms-transform": "translate3d(0, 0, 0)",
                        "-o-transform": "translate3d(0, 0, 0)",
                        "transform": "translate3d(0, 0, 0)"
                    });
                    next();
                });
        });
        $(saveClose).click(function() {
            $(save).css({
                "-webkit-transform": "translate3d(0, 184px, 0)",
                "-moz-transform": "translate3d(0, 184px, 0)",
                "-ms-transform": "translate3d(0, 184px, 0)",
                "-o-transform": "translate3d(0, 184px, 0)",
                "transform": "translate3d(0, 184px, 0)"
            });
        });
    }
}

;setTimeout(function() {
    $('.color-box').colpick({
        layout:'hex',
        submit:0,
        colorScheme:'dark',
        onChange:function(hsb,hex,rgb,el,bySetColor) {
            $(el).css('background','#'+hex);
            // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
            if(!bySetColor) $(el).val(hex);
        }
    });

    $("#batch-input").click(function () {
        $("#batch").fadeIn("fast");
        $(".popup-background").fadeIn("fast");
    });

    $(".close-popup").click(function () {
        $(".popup").fadeOut("fast");
        $(".popup-background").fadeOut("fast");
    });
    $("a.debug").click(function () {
        $("#debug").css("visibility", "visible");
    });
    $("a.save-version").click(function () {
        $("#save").fadeIn("fast");
        $(".popup-background").fadeIn("fast");
    });
    $("a.leave").click(function () {
        $("#message").fadeIn("fast");
        $(".popup-background").fadeIn("fast");
    });
    $("a.topline").click(function () {
        $("#topline").fadeIn("fast");
        $("#topline").delay( 5000 ).fadeOut("fast");
    });
    $("a.win-edit").click(function () {
        $("#markdown").fadeIn("fast");
        $(".popup-background").fadeIn("fast");
    })
    $("a.search-button").click(function () {
        $("#search").css("visibility", "visible");
    })
},1000);
;
(function () {
    var zy = window.ZYDesign = window.ZYDesign || {};
    // 配置
    zy.Config = (function () {
        return {
            draggingSilent: true,       // 是否使用静默拖动模式
            optrRecordEnable: true,     // 是否开放操作记录 
            tipsEnable: false,          // 是否开放提示内容
            developMode: false,          // 是否为开发模式(测试环境设为true,正式环境设为false);
            customInputZY:true          // 是否文本框中使用自定义重做撤销 
        }
    })();
})();;setTimeout(function () {
    var el = document.getElementById('options');

    Sortable.create(el, {
        handle: '.drag-icon',
        animation: 250
    });

},1000);;var Help_tips = (function () {

    function addtips (arrow_dir){
        var str = "<div class='tab_tooltip'><p></p><div class='arrow "+arrow_dir+"'></div></div>";
        $("body").append(str);
    };
    function removetips (){
        $(".tab_tooltip").remove();
    };

    return{
        addtips:addtips,
        removetips:removetips
    }
})();

var tip_str = [];
tip_str[0]="tip0";
tip_str[1]="tip1";
tip_str[2]="tip2";
tip_str[3]="tip3";
tip_str[4]="tip4";
tip_str[5]="tip51231";
tip_str[6]="tip6123131tip6123131";;/*
$(function () {

    $(".drag").draggable();

});*/
;/**
    调用stream_v1实现上传图片功能
    当前版本支持单个文件同时上传,stream_v1本身支持多文件同时上传.
    如果以后有需要可实现多文件上传.
*/

(function ($) {
    $.fn.extend({
        "InitUpload": function (options) {
            var isBusy = false,    // 值允许一次上传一个文件
                config = {
                    iscrop: false,                  // 是否切图
                    autoRemoveCompleted: true,      // 是否自动删除容器中已上传完毕的文件, 默认: false 
                    maxSize: 2097152,              // 单个文件的最大大小，默认:2G 
                    tokenURL: "/UploadRoot/UploadFile.aspx?action=gettoken",            // 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌）
                    frmUploadURL: "/UploadRoot/upload.php?action=fd;",                  // Flash上传的URI
                    uploadURL: "/UploadRoot/UploadFile.aspx?action=upext",              // HTML5上传的URI */
                    extFilters: [".jpg", ".gif", ".png", ".jpeg", ".bmp"],              // 允许的文件扩展名, 默认: []
                    /**
                        点击上传按钮时的相应方法
                    */
                    onSelect: function (list) {
                        // 当前正忙
                        if (isBusy) {
                            alert(Prompt.UploadPrompt);
                        } else {
                            isBusy = true;
                        }    
                    },
                    /**
                        文件超过上限时的处理方法
                    */
                    onMaxSizeExceed: function (size, limited, name) {
                        alert(Prompt.QSNRD_FileExceedCeiling);
                        isBusy = false;
                    }, 
                    /**
                        上传完成后的处理方法
                        @ file 完成的文件的属性
                    */
                    onComplete: function (file) {
                        $.ajax({
                            type: "POST",
                            url: "/Upload/CropBitmap",
                            data: {
                                fileName: file.token,
                                uplaodPath: config.parentfolder,
                                companyID: config.CompanyID,
                                uType: config.UType,
                                quesID: config.QuesID
                            },
                            dataType: "json",
                            success: function (data) {
                                if (data.IsSuccess) {
                                    // 有回调
                                    if (options.complete instanceof Function) {
                                        var newFile = {
                                            name: file.name,
                                            url: data.FileUrl,
                                            size: file.size,
                                            serverName: data.FileName,
                                        }
                                        options.complete(newFile);
                                    }
                                }
                            },
                            error: function (data) {
                                RestLoginForDesign(data);
                            }
                        })
                        isBusy = false;
                    },

                    /**
                        处理上传进度的方法
                        @e 进度参数
                    */
                    onUploadProgress: function (e) {
                        // 有回调
                        if (options.progress instanceof Function) {
                            options.progress(e);
                        }
                    },

                    /**
                        处理取消上传的方法
                    */
                    onCancelAll: function () {
                        isBusy = false;
                    }
                };
            var strHtml = "";
            strHtml += "<div class='panelext'>";
            strHtml += "<div class='closebtnext'>";
            strHtml += "<div onclick='$(\"this\").CloseUpload()'></div>";
            strHtml += "</div>";
            strHtml += "<div>";
            strHtml += "<div class='uploadpaneel'>";
            strHtml += "<div id='i_select_files'>";
            strHtml += "</div>";
            strHtml += "<div id='i_stream_files_queue'>";
            strHtml += "</div>";
            strHtml += "<button class='custombtn' onclick='javascript:_t.upload();'>开始上传</button><button onclick='javascript:_t.cancel();' class='custombtn'>取消</button>";
            strHtml += "<div id='i_stream_message_container' class='stream-main-upload-box none' style='overflow: auto;height:200px;'>";
            strHtml += "</div>";
            strHtml += "</div>";
            strHtml += "</div>";
            strHtml += "</div>";
            $(".panelext").remove();
            $("#uploadDiv").append(strHtml);

            /**
                * 配置文件（如果没有默认字样，说明默认值就是注释下的值）
                * 但是，on*（onSelect， onMaxSizeExceed...）等函数的默认行为
                * 是在ID为i_stream_message_container的页面元素中写日志
            */
            var trigger = options
            config = $.extend(config, options);
            var _t = new Stream(config);
            return _t;
        }
    });
})(jQuery);