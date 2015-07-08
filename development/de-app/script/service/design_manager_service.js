

/**
    设计总管理模块
*/
angular.module('designManager', [])
/**
    注册一个服务
*/
.factory("designManager", ["$timeout", "$rootScope", "$http", "recordManager", function ($timeout, $rootScope, $http, recordManager) {
    // 返回一个总体管理对象
    return new (function () {
        // 当前对象
        var designManager = ZYDesign.DesignManager = this,
            hinter = ZYDesign.Hinter;


        /**
            维持画布尺寸
            @isResize 是否窗口大小发生变哈
        */
        function maintainChart(isResize) {
            // 设定画布和鹰眼的尺寸
            // 计算宽度
            var chartWidth = $(document.body).width() - 337;
            // 宽度有最低限度
            chartWidth = (chartWidth >= (1024 - 337)) ? chartWidth : (1024 - 337);
            // 计算高度
            var chartHeight = $(document.body).height() - 67;
            // 设定画布页面元素尺寸
            $("#chart_content").css("width", chartWidth).css("height", chartHeight);
            // 设定鹰眼页面元素尺寸
            $("#chart_eye").css("width", chartWidth * 0.15).css("height", chartHeight * 0.15);
            // 画布偏量
            designManager.chartXDiffer = chartWidth / 2;
            designManager.chartYDiffer = chartHeight / 2;
            // 鹰眼偏量
            designManager.eyeXDiffer = chartWidth / 2 * 0.15;
            designManager.eyeYDiffer = chartHeight / 2 * 0.15;

            // 重新计算容器信息
            designManager.getContainerInfo();
            console.log("container info initialized!");
            // 窗口大小变化时需要刷新页面
            if (isResize) {
                designManager.checkVisibleOfNodesAndConns();
                designManager.digest();


            }
        }

        /**
          处理页面所有的tips
      */
        function handleTips() {
            if (!ZYDesign.Config.tipsEnable) {
                return;
            }
            //Tips配置
            var dataList = {
                "#node_box_Select": {//选择
                    side: 2, msg: "<h5 class='TipsTile'>选择题节点</h5>" +
                                    "<p class='TipsTitle2'>" +
                                    " 选择题由题目内容和选项两部分构成。</br>" +
                                    "         题目内容就是用陈述句或疑问句描述出问题的情景和想获得得答案。</br>" +
                                    "         选项是指与题目内容有直接关联的备选答案。</br>" +
                                    "   “其他”选项有助于获得进一步的信息，特别是当选项无法覆盖所有可能的情况时。</br>" +
                                    "</p>" +

                                    "<h5  class='TipsTile'>参考示意图</h5>" +
                                    "<img src='/Images/TipsPics/tips_select.jpg'>" +

                                    "<h5 class='TipsTile'>其他信息:</h5>" +

                                    "<ul class='TipsTitle2'>" +
                                    "   <li>高级设置面板中可设定本题是否必答。</li>" +
                                    "   <li>高级设置面板中可设定多选题和选项随机。</li>" +
                                    "  <li>可为选择题添加“其他”选项。</li>" +
                                    "  <li>可为选择题节点设定题目的图片。</li>" +
                                    "  <li>选项前的字母为键盘快捷键，在使用键盘时，直接按字母键完成选择。</li>" +
                                    "</ul>"
                },
                "#node_box_Marking": {//打分
                    side: 2, msg: "打分题"
                },
                "#node_box_Fillblank": {//填空
                    side: 2, msg: "<h5 class='TipsTile'>填空题节点</h5>" +
                                  "<p class='TipsTitle2'>" +
                                    "填空题由问题描述和填空选项构成。通常先给出问题描述，在而后的选项输入框中输入与问题对应的答案。</br>" +
                                    "问卷设计过程中,输入选项中的文字将以提示信息的形式显示在最终问卷中,提示受访者输入正确的内容.</br>" +
                                    "可对文字内容进行验证,例如输入内容必须为文字、邮箱地址等。</br>" +
                                    "</p>" +
                                    "<h5 class='TipsTile'>参考示意图</h5>" +
                                    "<img src='/Images/TipsPics/tips_input.jpg'>" +
                                    "<h5 class='TipsTile'>其他信息:</h5>" +
                                    "<ul class='TipsTitle2'>" +
                                        "<li>高级设置面板中可设定本题是否必答。</li>" +
                                        "<li>高级设置面板中可对输入的文字内容进行验证。</li>" +
                                        "<li>可为填空题节点设定题目的图片。</li>" +
                                    "</ul>"
                },
                "#node_box_Sequencing": {//排序
                    side: 2, msg: "排序4"
                },
                "#node_box_Matrix": {//矩阵
                    side: 2, msg: "矩阵5"
                },
                "#node_box_SelectPic": {//图片选择题
                    side: 2, msg: "图片选择题图片选择题图片选择题图片选择题图片选择题图片选择题图片选择题图片选择题图片选择题"
                },
                "#node_box_Vidio": {//视频
                    side: 2, msg: "视频节点"
                },
                "#node_box_End": {//结束
                    side: 2, msg: "<h5 class='TipsTile'>结束节点</h5>" +
                                  "<p class='TipsTitle2'>" +
                                  "结束节点是一份问卷的终止节点，等同于问卷的封底。</br>" +
                                  "当受访者完成问卷时，将看到结束描述中的文字。</br>" +
                                  "一份问卷可以有多个结束节点,分别对应问卷不同的结束情况。</br>" +
                                  "</p>" +
                                  "<h5 class='TipsTile'>其他信息:</h5>" +
                                  "<ul class='TipsTitle2'>" +
                                  "<li>结束节点中设置的图片即为该问卷的封底。</li>" +
                                  "<li>问卷生成时系统将生成一个结束节点。</li>" +
                                  "</ul>"
                },
                "#node_box_ScreenSelect": {//赠别选择题
                    side: 2, msg: "赠别选择题"
                },
                "#node_editor_media": {//媒体库
                    side: 4, msg: "<h5 class='TipsTile'>添加媒体</h5>" +
                                    "<p class='TipsTitle2'>" +
                                    "在问卷题目中添加图片等媒体丰富了问卷的形式，同时有助于准确地表达问题的核心。</br>" +
                                    "点击<img src='/Images/TipsPics/tips_midia_pic.jpg' style='margin-left: 10px;margin-right: 10px'> 上传图片按钮添加图片媒体到资源库。</br>" +
                                    "添加图片到媒体库后，选择问卷中题目节点，点选<img src='/Images/TipsPics/tips_addmedia.jpg' style='margin-left: 10px;margin-right: 10px'> 添加媒体按钮，即可在下拉列表中选择媒体库中的图片。" +
                                    "</p>" +
                                    "<h5 class='TipsTile'>其他信息:</h5>" +
                                    "<ul class='TipsTitle2'>" +
                                    "<li>还可以选择节点，为该节点添加媒体，在下拉列表中点选“添加图片”。</li>" +
                                    "</ul>"
                },
                "#node_editor_otherOption": {//其它选项
                    side: 4, msg: "<h5 class='TipsTile'>“其他”选项</h5>" +
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
                                "</ul>"
                },
                "#node_editor_verify": {//输入验证
                    side: 4, msg: "<h5 class='TipsTile'>输入内容验证</h5>" +
                                "<p class='TipsTile2'>当希望受访者输入特定内容时，可使用验证功能对文字内容进行有效性判断。</br></p>" +
                                "<h5 class='TipsTile'>验证选项:</h5>" +
                                "<ul class='TipsTile2'>" +
                                    "<li>字数：只接受文字输入，设定可输入文字字数的上限和下限。</li>" +
                                    "<li>整数：只接受整数输入，设定可输入数值的上限和下限。</li>" +
                                    "<li>小数：只接受整数和小数输入，设定可输入数值的上限和下限。</li>" +
                                    "<li>日期：选择制定日期。</li>" +
                                    "<li>邮件地址：只接受邮件地址格式。</li>" +
                                    "<li>手机号码：只接受手机号码格式。</li>" +
                                "</ul>"
                },
            }
            $(document.body).delegate(".nodes_help", "mouseover", function (e) {
                var targetID = "#" + e.currentTarget.id;
                for (var key in dataList) {
                    //对应tips消息
                    if (key == targetID) {
                        //隐藏之前的tips
                        $($(".jq_tips_box")).remove();
                        //加载当前tips
                        $(this).tips({
                            side: dataList[key].side,  //1,2,3,4 分别代表 上右下左
                            msg: dataList[key].msg,//tips的文本内容
                            time: 5,//默认为2 自动关闭时间 单位为秒 0为不关闭 （点击提示也可以关闭）
                            ClientX: e.clientX,
                            ClientY: e.clientY
                        });
                    }
                }

            }).delegate(".jq_tips_box", "mouseleave", function () {
                setTimeout(function () {
                    //鼠标移开tips内容隐藏
                    $($(".jq_tips_box")).remove();
                }, 500);
            });
        }

        /**
            处理窗口尺寸变化事件
        */
        function handleWindowResize() {
            // 只有停下变化1秒后才会执行
            clearTimeout(handleWindowResize.run);
            // 节流处理
            handleWindowResize.run = setTimeout(function () {
                maintainChart(true);
            }, 1000)
        }

        /**
            处理页面鼠标移动事件
        */
        function handleBodyMouseMove(e) {
            // 记录鼠标最后位置
            designManager.lastMousePos.x = e.pageX;
            designManager.lastMousePos.y = e.pageY;
        }

        function handleBodykeyDown(evt) {

            // 模态窗口下不响应按键
            if (designManager.hasModal()) {
                return;
            }
            var env = ZYDesign.Environment,
                cfg = ZYDesign.HotKey,
                ctrlKey = env.isMac ? evt.metaKey : evt.ctrlKey,
                del = env.isMac ? cfg.DeleteMac : cfg.Delete,
                tagName = evt.target.tagName.toUpperCase(),
                isInput = tagName == "INPUT" || tagName == "TEXTAREA";

            // 输入入框中的情况需要判断是否处理
            if (isInput) {
                if (!ZYDesign.Config.customInputZY) {
                    return;
                }
                var selfFn = arguments.callee;
                if (!selfFn.nodeEditor) {
                    selfFn.nodeEditor = $("[data-id='node_editor']")[0];
                }
                var isRedoUndo = (evt.keyCode == 89 || evt.keyCode == 90) && ctrlKey,
                    isInEditor = selfFn.nodeEditor && selfFn.nodeEditor.contains(evt.target);
                // 不在节点编辑区内,或者不是重做撤销皆不处理
                if (!isInEditor || !isRedoUndo) {
                    return;
                }
            }
            // SHIFT组合键
            if (evt.shiftKey) {
                if (ctrlKey) {
                    // SHIFT CTRL组合键
                    switch (evt.keyCode) {
                        // 保存备份版本
                        case cfg.Save:
                            // 打开版本保存保存窗口
                            designManager.versionSaveManager.open();
                            evt.preventDefault();
                            designManager.digest();
                            // 阻止浏览器的默认保存操作
                            break;
                    }
                }
            } else
                // CTRL 组合键控制
                if (ctrlKey) {
                    switch (evt.keyCode) {
                        // 保存
                        case cfg.Save:
                            // 保存问卷信息
                            designManager.save("N", null, null, "Y", "");
                            // 重置自动保存
                            designManager.autoSaveManager.reset();
                            designManager.digest();
                            evt.preventDefault();
                            // 阻止浏览器的默认保存操作
                            break;
                            // 缩小
                        case cfg.Zoomout:
                            // 缩小画布区域
                            designManager.zoomOut();
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 放大
                        case cfg.Zoomin:
                            // 放大画布区域
                            designManager.zoomIn();
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 撤销
                        case cfg.Undo:
                            // 撤销上次操作
                            if (recordManager.undo()) {
                                designManager.digest();
                            }
                            evt.preventDefault();
                            break;
                            // 重做
                        case cfg.Redo:
                            // 重做上次操作
                            recordManager.redo() && designManager.digest();
                            evt.preventDefault();
                            break;
                            // 发布
                        case cfg.Release:
                            // 发布版本
                            this.handleReleaseIconClick();
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 全选
                        case cfg.SelectAll:
                            // 全选画布区域内容
                            designManager.selectAll();
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 帮助
                        case cfg.Help:
                            // 暂未实现
                            break;
                            // 调试
                        case cfg.Test:
                            // 调试
                            designManager.test();
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 默认100%显示
                        case cfg.ShowDefault:
                            designManager.showDefault();
                            designManager.digest();
                            evt.preventDefault();
                            // 暂未实现
                            break;
                            // 预览
                        case cfg.Preview:
                            // 暂未实现
                            break;
                            // 复制到剪切板
                        case cfg.Copy:
                            // 复制到剪切板
                            designManager.clipBoard.copy(false);
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 粘帖
                        case cfg.Paste:
                            // 粘贴到当前鼠标位置
                            designManager.clipBoard.paste(designManager.lastMousePos.x, designManager.lastMousePos.y);
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 即时复制
                        case cfg.Dulplicate:
                            // 即时复制节点
                            designManager.clipBoard.dulplicate(0, 0);
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 剪切
                        case cfg.Clip:
                            // 剪切到剪切板
                            designManager.clipBoard.copy(true);
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 断开连接
                        case cfg.Break:
                            // 断开所选节点的连接
                            designManager.breakConnOfSelectedNodes();
                            designManager.digest();
                            evt.preventDefault();
                            break;
                    }
                    // 单键
                } else {
                    switch (evt.keyCode) {
                        // delete键 删除所选
                        case del:
                            // 移除所选
                            designManager.removeSelected();
                            designManager.digest();
                            evt.preventDefault();
                            break;
                            // 显示全部
                        case cfg.ShowAll:
                            // 自适应比例以显示全部节点
                            designManager.showAll();
                            designManager.digest();
                            evt.preventDefault();
                            break;
                    }

                }
        }

        // 初始化
        $(document.body).ready(function () {
            // 页面tips
            handleTips();
            // 维持画布尺寸
            maintainChart();
            console.log("window loaded,start forming chart!");
            // 标记画布已生成
            designManager.chartFormed = true;
            console.log("chart forming successed!");
            // 窗口大小发生变化时维护画布大小
            $(window).resize(function () {
                // resize中做很复杂的动作一般都会使用节流策略
                // 这里会在每个具体执行任务的方法里进行节流处理
                // 否则画面会很卡
                // 维持画布大小
                handleWindowResize();
            });
            $(document.body).on({
                mousemove: handleBodyMouseMove,
                keydown: handleBodykeyDown,
            });
            designManager.useLoadIcon = !!$("#design_loader").length;
        });

        // 鼠标在页面上最后停留的位置
        this.lastMousePos = {
            x: 0,
            y: 0,
        }

        // 画布区域边框信息存储对象
        // 画布区域是即使只有一个节点,也会占满一个整屏的图像显示区域
        // 节点区域是一个能包含所有可视节点的矩形框区域,
        // 当节点区域大于等于图像容器区域时,画布区域和节点区域是一样大的.
        // 当节点区域小于图像区域时,画布区域相当于图像容器的大小.
        // 画布区域的信息主要用来控制鹰眼全图比例
        // 节点区域的信息主要用来控制全部显示
        this.borderInfo = {
            left: 0,           // 画布区域左边位置(缩放后)
            top: 0,            // 画布区域顶边位置(缩放后)
            right: 0,          // 画布区域右边位置(缩放后)
            bottom: 0,         // 画布区域底部位置(缩放后)
            width: 0,          // 画布区域高度(缩放后)
            height: 0,         // 画布区域宽度(缩放后)
            originLeft: 0,     // 画布区域左边位置(原始)
            originTop: 0,      // 画布区域顶边位置(原始)
            originRight: 0,    // 画布区域右边位置(原始)
            originBottom: 0,   // 画布区域底部位置(原始)
            originWidth: 0,    // 画布区域高度(原始) 
            originHeight: 0,   // 画布区域宽度(原始)
            nodesTop: 0,       // 节点区域顶边位置(缩放后)
            nodesLeft: 0,      // 节点区域左边位置(缩放后)
            nodesRight: 0,     // 节点区域右边位置(缩放后)
            nodesBottom: 0,    // 节点区域底边位置(缩放后)
            nodesWidth: 0,     // 节点区域宽度位置(缩放后)
            nodesHeight: 0,    // 节点区域高度位置(缩放后)
        };
        // 容器信息
        this.containerInfo = {
            width: 0,   // 宽度
            height: 0,  // 高度
            centerX: 0, // 中心X
            centerY: 0, // 中心Y
            top: 0,     // 顶部
            left: 0,    // 左边
            right: 0,   // 右边
            bottom: 0   // 底部
        };
        // 最后的甄别题排序号
        this.lastCheckNo = 0;
        // 最后的设计题排序号
        this.lastDesignNo = 0;
        // 画布顶部位置
        this.top = 0;
        // 画布左边位置
        this.left = 0;
        // 画布宽度
        this.width = 0;
        // 画布高度
        this.height = 0;
        // 鹰眼顶部位置
        this.viewTop = 0;
        // 鹰眼左边位置
        this.viewLeft = 0;
        // 鹰眼宽度
        this.viewWidth = 100;
        // 鹰眼高度
        this.viewHeight = 100;
        // 数据是否发生改变
        this.dirty = false;
        // 是否正在保存
        this.saving = false;
        // 保存类型是否为自动保存
        this.auto = false;
        // 是否显示网格标志
        this.grid = localStorage.getItem("chart_grid") == "true" ? true : false;
        // X轴坐标偏移
        this.transX = 0;
        // Y轴坐标偏移
        this.transY = 0;
        // chart缩放率
        this.chartZoomRate = 1;
        // eye缩放率
        this.eyeZoomRate = 0.2;
        // 当前被选中的节点
        this.currentNode = {};
        // 临时的连接对象
        this.tempConncetion = null;
        // 连接对象列表
        this.connections = [];
        // 问卷Id
        this.questionnairUuid = "";
        // 问卷名
        this.questionnairName = "";
        // 公司ID
        this.companyId = "";
        // 问卷编号
        this.qNumber = "";
        // 问卷状态
        this.qStatus = 0;
        // 混合节点群(不包括虚拟节点)
        this.mixNodes = [];
        // 虚拟节点(一般有两个,用来维持画布大小)
        this.vitualNodes = [];
        // 开始节点
        this.startNode = null;
        // 获取画布区坐标X偏移(为了实现中心放大,需将svg默认中心从左上角移到画布区域中心)
        this.chartXDiffer = $("#chart_content").width() / 2;
        // 获取画布区坐标Y偏移(为了实现中心放大,需将svg默认中心从左上角移到画布区域中心)
        this.chartYDiffer = $("#chart_content").height() / 2;
        // 获取鹰眼区坐标X偏移
        this.eyeXDiffer = $("#chart_eye").width() / 2;
        // 获取鹰眼区坐标Y偏移
        this.eyeYDiffer = $("#chart_eye").height() / 2;
        // 是否使用加载动画
        this.useLoadIcon = this.useLoadIcon || false;
        // 画布区域是否已生成
        this.chartFormed = false;
        // 最后保存时间
        this.lastSaveTime = "";

        // 选择框管理器
        this.selectRectManager = new (function () {
            this.parent = designManager;
            this.left = 0;           // 左边
            this.top = 0;            // 上边
            this.right = 0;          // 右边
            this.bottom = 0;         // 下边
            this.width = 0;          // 宽度
            this.height = 0;         // 高度
            this.status = 0;         // 状态 0:初始状态 1:已经开始尚未完成 2:已完成
            this.startX = 0;         // 初始点坐标X
            this.startY = 0;         // 初始点坐标Y
            /**
                获取左边位置
            */
            this.getLeft = function () {
                return this.left - this.parent.chartXDiffer;
            },
            /**
                获取顶部位置
            */
            this.getTop = function () {
                return this.top - this.parent.chartYDiffer;
            },
            /**
                获取右边位置
            */
            this.getRight = function () {
                return this.right - this.parent.chartXDiffer;
            },
            /**
                获取底部位置
            */
            this.getBottom = function () {
                return this.bottom - this.parent.chartYDiffer;
            },
            /**
                重置到初始状态
            */
            this.reset = function () {
                // 已经是初始状态
                if (this.status == 0) {
                    return;
                }
                // 初始化各个属性
                this.left = 0;
                this.top = 0;
                this.right = 0;
                this.bottom = 0;
                this.width = 0;
                this.height = 0;
                this.status = 0;
                this.startX = 0;
                this.startY = 0;
                this.status = 0;
            },
            /**
                开始配置选择框
                @x 开始点X坐标
                @y 开始点Y坐标
            */
            this.start = function (x, y) {
                this.left = this.startX = x;
                this.top = this.startY = y;
                // 标记为已经开始
                this.status = 1;
            },
            /**
                改变大小
                @x 当前点X坐标
                @y 当前点Y坐标
            */
            this.resize = function (x, y) {
                // 尚未开始
                if (this.status != 1) {
                    // 先开始
                    this.start(x, y);
                    // 已经开始
                } else {
                    // 从初始点向左框选
                    if (x < this.startX) {
                        this.left = x;
                        this.right = this.startX;
                        // 从初始点向右框选
                    } else {
                        this.left = this.startX
                        this.right = x;
                    }
                    // 从开始点向上框选
                    if (y < this.startY) {
                        this.top = y;
                        this.bottom = this.startY
                        // 从开始点想下框选
                    } else {
                        this.top = this.startY
                        this.bottom = y;
                    }
                    // 计算高度和宽度
                    this.width = this.right - this.left;
                    this.height = this.bottom - this.top;
                }
            },
            /**
                完成
            */
            this.finish = function () {
                // 非准备状态
                if (this.status != 1) {
                    return;
                }
                // 范围
                var range = this.parent.mixNodes.length;
                // 循环所有节点
                for (var i = 0; i < range; i++) {
                    // 一个节点
                    var node = this.parent.mixNodes[i];
                    // 该节点在选择框范围内
                    if (node.getX() >= this.getLeft() &&
                        node.getY() >= this.getTop() &&
                        node.getRight() <= this.getRight() &&
                        node.getBottom() <= this.getBottom() + 14) {
                        // 选中该节点
                        node.select();
                        // 置顶
                        this.parent.takeToTop(node);
                        // 置顶后该节点会移到队列末尾
                        // 所以循环索引应跌落
                        i--;
                        // 范围也因缩减
                        range--;
                    }
                }
                // 标记为已完成
                this.status = 2;
                this.reset();
            };

            /**
                修复位置
            */
            this.fixPosition = function () {
                $("#flow_select_rect").attr({
                    x: this.getLeft(),
                    y: this.getTop(),
                    width: this.width,
                    height: this.height,
                })
            }

        })();

        // 搜索管理器
        this.searchManager = new (function () {
            this.parent = designManager;               // 总控制模型引用
            this.nodes = [];                   // 搜索到的节点列表
            this.show = false;                 // 是否显示
            this.x = -1000;  // x坐标
            this.y = -1000;                      // y坐标
            /**
                搜索
                @keyword 关键字
            */
            this.search = function (keyword) {
                // 初始化搜索结果列表
                this.nodes = [];
                // 循环节点搜索
                for (var i = 0; i < this.parent.mixNodes.length; i++) {
                    // 一个节点
                    var node = this.parent.mixNodes[i];
                    // 搜到了关键字符合要求
                    if (node.hasKeyword(keyword)) {
                        // 添加到结果列表
                        this.nodes.push(node);
                    }
                }
                // 没有搜到任何结果
                if (this.nodes.length == 0) {
                    hinter.hint(Prompt.QSNRD_NoSearchInfo) // Prompt.QSNRD_NoSearchInfo
                    return;
                }
                this.open();
            };

            /**
                打开搜索结果显示框
            */
            this.open = function () {
                // 没有结果不打开
                if (this.nodes.length == 0) {
                    return;
                }
                if (this.x == -1000 && this.y == -1000) {
                    this.x = window.innerWidth - 780;
                    // 所有的搜索结果的高度 + 搜索结果的标题，底部的高度，10的间隔
                    this.y = window.innerHeight - (this.nodes.length + 1) * 37 - parseInt($("#footerbar").css("height")) - 10;
                }
                // 标记为显示
                this.show = true;
            }

            /**
                关闭搜索结果显示框
            */
            this.close = function () {
                // 标记为不显示
                this.show = false;
                // 清空结果
                this.nodes = [];
            }

            /**
                获取搜索框位置样式
            */
            this.getStyle = function () {
                return "top:" + this.y + "px;left:" + this.x + "px;visibility:inherit;position:absolute";
            }

            /**
                获取搜索列表的总高度
            */
            this.getSearchListStyle = function () {
                return "height:" + this.nodes.length * 37 + "px";
            }

            /**
                操作搜索框（有值，不隐藏）
            */
            this.wrapSearcher = function () {
                if ($("#search_txt").val()) { // 有值，不隐藏
                    $("#footerbar .search").css("width", "181px");
                    $("#footerbar .search>input").css("opacity", "1");
                } else { // 无值，隐藏
                    $("#footerbar .search").css("width", "43px");
                    $("#footerbar .search>input").css("opacity", "0");
                }
            }

            /**
                将搜索框显示出来
            */
            this.releaseSearcher = function () {
                $("#footerbar .search").css("width", "181px");
                $("#footerbar .search>input").css("opacity", "1");
            }

            /**
                修复位置
            */
            this.fixPosition = function () {
                $("#search").attr("style", this.getStyle());
            }

            /**
                从列表中移除某个节点
                @node 节点
            */
            this.remove = function (node) {
                var index = this.nodes.indexOf(node);
                if (index >= 0) {
                    this.nodes.splice(index, 1);
                }
            }
        })();

        // 校验管理器
        this.validateManager = new (function () {
            this.parent = designManager;
            this.invalidList = [];             // 非法结果列表
            this.show = false;                 // 是否显示            
            this.x = -1000;                     // X坐标
            this.y = -1000;                      // Y坐标
            this.valid = false;

            /**
                获取样式
            */
            this.getStyle = function () {
                return "top:" + this.y + "px;left:" + this.x + "px;position:absolute;";
            }

            /**
                校验
            */
            this.validate = function (isQuesTitleExits) {
                // 重置列表
                this.invalidList = [];
                var isValid = true;
                for (var i = 0; i < this.parent.mixNodes.length; i++) {
                    var node = this.parent.mixNodes[i];
                    // 校验该节点
                    var result = node.validate();
                    // 不合法
                    if (!result.isValid) {
                        // 加入不合法列表
                        result.node = node;
                        this.invalidList.push(result);
                        this.valid = isValid = false;
                    }
                }
                // 问卷重名验证
                if (isQuesTitleExits) {
                    var startResult = designManager.startNode.validateResult;
                    // 开始节点没有发现错误，验证重名
                    if (startResult.isValid) {
                        startResult.message = Prompt.QSNRD_QuesNameExist;
                        startResult.isValid = isValid = false;
                        // 加入不合法列表
                        startResult.node = designManager.startNode;
                        this.invalidList.push(startResult);
                    }
                }
                return isValid;
            }

            /**
                打开校验结果窗口
            */
            this.open = function (valid) {
                this.show = true;
                this.valid = valid;
                // 初始值
                if (this.x == -1000 && this.y == -1000) {
                    this.x = window.innerWidth - 500;
                    this.y = 40;
                }
                // 通过了校验显示二维码
                if (valid) {
                    $("#qrcode_renderer").attr("src", "");
                    $("#text_renderer").text("").attr("href", "");
                    this.getPreviewInfoAjax(function (data) {
                        $("#qrcode_renderer").attr("src", data.StrPath);
                        $("#text_renderer").text(data.QRlink).attr("href", data.QRlink);
                    })
                }
            }

            /**
                获取预览信息
                @callback 回调函数W
            */
            this.getPreviewInfoAjax = function (callback) {
                $http.post("/QM/DownLoadQRCode", {
                    quesID: this.parent.questionnairUuid,
                    linkSuffix: this.parent.questionnairUuid,
                }).success(function (data) {
                    if (callback instanceof Function) {
                        callback(data);
                    }
                }).error(function (data) {
                    RestLoginForDesign(data.Message);
                    hinter.hint(Prompt.QSNRD_GetPreviewFailed);
                })
            }

            /**
                关闭校验结果窗口
            */
            this.close = function () {
                this.show = false;
                this.invalidList = [];
            }

            /**
                修复位置
            */
            this.fixPosition = function () {
                $("#node_validate_result").attr("style", this.getStyle());
            }

            /**
                更新
                @node 节点
            */
            this.update = function () {
                this.validate();
            }

        })();

        // 选项批量添加管理器
        this.optionBatchAddManager = new (function () {
            // 窗口是否可见
            var show = false;
            // 添加类型 1:选项 2:纵选项 3:横选项
            var type = 1;

            /**
                获取编号列表
            */
            var getNumberList = function () {
                // 获取字符串
                var number = $("#option_batch_add_number").val();
                // 空字符
                if (!number) {
                    return [];
                }
                // 返回按换行符分割后的数组
                return number.split("\n");

            }

            /**
                获取文字列表
            */
            var getTextList = function () {
                // 获取字符串
                var text = $("#option_batch_add_text").val();
                // 空字符
                if (!text) {
                    return [];
                }
                var textList = text.split("\n"),
                    last = -1;
                for (var i = 0; i < textList.length; i++) {
                    if (textList[i]) {
                        last = i;
                    }
                }
                textList = textList.slice(0, last + 1);
                // 返回按换行符分割后的数组
                return textList;
            }

            /**
                应用选项
            */
            var applyOptions = function (numberList, textList) {
                // 追加长度
                var totalCount = numberList.length > textList.length ? numberList.length : textList.length,
                    curNode = designManager.currentNode,
                    isX = false,
                    key = "options",
                    changed = false;
                // 矩阵题横选项
                if (type == 3) {
                    key = "optionsY";
                    // 矩阵题纵选项
                } else if (type == 2) {
                    isX = true;
                    key = "optionsX";
                }
                var options = curNode[key],
                    optLen = options.length,
                    changeList = [];
                // 选择题其他选项排除在外
                if (curNode.isTypeOf("SELECT") && curNode.hasOtherOption()) {
                    optLen -= 1;
                }

                // 处理变化
                for (var i = 0; i < totalCount; i++) {
                    var number = numberList[i] || 0,
                        text = textList[i] || "",
                        optTemp = options[i];
                    // 是之前既有的选项,修改
                    if (i < optLen) {
                        if (optTemp.originText == text) {
                            continue;
                        }
                        // 记录下来
                        changeList.push({
                            option: optTemp,
                            type: "change",
                            oldValue: optTemp.originText || "",
                            newValue: text,
                        })
                        options[i].originText = text;
                        // 标记发生变化
                        changed = true;
                        // 新加选项,添加
                    } else {
                        var rs = curNode.addOption({ text: text }, isX);
                        // 记录下来
                        changeList.push({
                            option: rs,
                            type: "add",
                        })
                        // 标记发生变化
                        changed = true;
                    }
                }
                // 总数少于原选项数,删除
                if (totalCount < optLen) {
                    // 删除多余选项
                    var rss = curNode.removeOptionInRange(totalCount - 1, optLen - 1, isX);
                    // 记录下来
                    for (var i = 0; i < rss.length; i++) {
                        var rs = rss[i];
                        changeList.push({
                            option: rs,
                            type: "remove",
                        });
                    }
                    // 标记发生变化
                    changed = true;
                }

                if (!changed) {
                    return;
                }
                designManager.markChange();

                // 需要注册到操作历史
                recordManager.register({
                    descript: "批量编辑选项",
                    param: {
                        key: key,
                        isX: isX,
                        node: curNode,
                        changeList: changeList,
                    },
                    undo: function () {
                        var param = this.param;
                        for (var i = 0; i < param.changeList.length; i++) {
                            var item = param.changeList[i];
                            switch (item.type) {
                                case "change":
                                    item.option.originText = item.oldValue;
                                    break;
                                case "add":
                                    param.node.removeOption(item.option);
                                    break;
                                case "remove":
                                    param.node.addOption(item.option, param.isX);
                                    break;
                            }
                        }
                    },
                    redo: function () {
                        var param = this.param;
                        for (var i = 0; i < param.changeList.length; i++) {
                            var item = param.changeList[i];
                            switch (item.type) {
                                case "change":
                                    item.option.originText = item.newValue;
                                    break;
                                case "add":
                                    param.node.addOption(item.option, param.isX);
                                    break;
                                case "remove":
                                    param.node.removeOption(item.option);
                                    break;
                            }
                        }
                    }
                })
            }

            /**
                窗口是否可见
            */
            this.isVisible = function () {
                return show;
            }
            /**
                打开批量添加窗口
            */
            this.open = function () {
                var node = designManager.currentNode
                // 当前节点检查,非题目节点不处理
                if (!(node instanceof ZYDesign.Class.SubjectNode)) {
                    return;
                }
                var options = node.options;
                // 填空题
                if (node.isTypeOf("SELECT")) {
                    options = node.getNormalOptions();
                }
                // 矩阵题
                if (node.type == ZYDesign.Enum.NODETYPE.MATRIX) {
                    // 列模式
                    if (node.rowHiding) {
                        type = 2;
                        options = node.optionsX;
                        // 行模式
                    } else {
                        type = 3;
                        options = node.optionsY;
                    }
                    // 其他题目
                } else {
                    type = 1;
                }
                var originText = "",
                    last = 0;
                for (var i = 0; i < options.length; i++) {
                    var optTxt = options[i].originText;
                    if (optTxt) {
                        originText += optTxt;
                        last = originText.length;
                    }
                    if (i < options.length - 1) {
                        originText += "\n";
                    }
                }
                originText = originText.substr(0, last);
                var run = setInterval(function () {
                    var textarea = $("#option_batch_add_text");
                    if (textarea.length > 0) {
                        clearInterval(run);
                        textarea.text(originText)
                    }
                })
                show = true;
                $(document.body).addClass("modal-open");
            }

            /**
                应用选项
            */
            this.apply = function () {
                var textList = getTextList();
                if (textList.length == 0) {
                    return;
                }
                // 应用选项
                applyOptions(getNumberList(), textList);
                // 关闭窗口
                this.close();
            }

            /**
                关闭批量添加窗口
            */
            this.close = function () {
                show = false;
                type = 1;
                // 清空编号内容
                $("#option_batch_add_number").text("");
                // 清空文字内容
                $("#option_batch_add_text").text("");
                $(document.body).removeClass("modal-open");
            }

            /**
                更新页面
            */
            this.digest = function () {
                designManager.digest();
            }
        })();

        // 手动保存管理器
        this.versionSaveManager = new (function () {
            var parent = designManager,
                show = false,          // 是否显示
                relatedVersion = null;        // 相关版本 null:没有相关版本保存新版本 否则更改该版本的名字

            this.defaultName = "";

            /**
                是否可见
            */
            this.isVisible = function () {
                return show;
            }

            /**
                打开
                @ver 版本
            */
            this.open = function (version) {
                // 不可更改状态
                if (!parent.isAllowSave()) {
                    return;
                }
                show = true;
                relatedVersion = version;
                this.defaultName = relatedVersion ?
                    relatedVersion.verName :
                    parent.generateVersionName();
                $(document.body).addClass("modal-open");
            }

            /**
                保存
            */
            this.save = function () {
                // 不可更改状态
                if (!parent.isAllowSave()) {
                    return;
                }
                var verName = $("#ver_name_input").val();
                verName = verName ? verName : parent.generateVersionName();
                var that = this;
                // 检查名字是否重复,回调中根据检查结果进行回调
                parent.isExistVerNameAjax(verName,
                    function (exist) {               // 成功回调函数
                        // 名称已存在
                        if (exist) {
                            // 关闭保存窗口
                            that.close();
                            // 提示重名
                            parent.digest(function () {
                                hinter.hint(Prompt.QSNRD_VerNameExist);
                            });
                            // 名称可使用
                        } else {
                            // 只是更改名字
                            if (relatedVersion) {
                                that.changeVersionNameAjax(verName, relatedVersion.verID);
                                // 保存整个设计
                            } else {
                                parent.save("N", null, null, "N", verName);
                                // 重置自动保存
                                parent.autoSaveManager.reset();
                                // 关闭保存窗口
                                that.close();
                            }
                        }
                    }, function () {                    // 失败回调函数
                        hinter.hint(Prompt.QSNRD_JudgeRepaeatFailed)
                    });
                // 关闭保存窗口
                that.close();
            }

            /**
               更改版本名字
               @verName 版本名
               @verID 版本ID
            */
            this.changeVersionNameAjax = function (verName, verID) {
                var that = this;
                $http.post("/QD/EditDesignBakName", {
                    bakID: verID,
                    verName: verName
                }).success(function (data) {
                    // 更改成功
                    if (!data.returnError) {
                        // 更新内存中的名字
                        relatedVersion.verName = verName;
                    }
                    hinter.hint(Prompt.QSNRD_ChangeNameSuccess);
                    // 关闭
                    that.close();
                }).error(function (data) {
                    var errorMessage = "";
                    if (data || data.returnMessage) {
                        errorMessage = data || data.returnMessage;
                    }
                    RestLoginForDesign(errorMessage);
                    hinter.hint(Prompt.QSNRD_ChangeNameFauled);
                })


            }

            /**
                保存
            */
            this.close = function () {
                show = false;
                $(document.body).removeClass("modal-open");
            }

            /**
                获取管理器标题
            */
            this.getTitle = function () {
                return relatedVersion ? "更改版本名字" : "保存一个版本";
            }

            /**
                获取按钮文字
            */
            this.getBtnName = function () {
                return relatedVersion ? "更改并关闭" : "保存并关闭";
            }

            /**
                更新页面
            */
            this.digest = function () {
                designManager.digest();
            }
        })();

        // 自动保存管理器
        this.autoSaveManager = new (function () {
            var parent = designManager,
                interval = 1000 * 60 * 5,　// 间隔
                run = null;
            /**
                开始自动保存
            */
            this.start = function () {
                // 正在进行中则不处理
                if (run) {
                    return;
                }
                var manager = this;
                run = setTimeout(function () {
                    parent.save("N", function () {
                        manager.reset()
                    }, null, "Y", parent.generateVersionName());
                }, interval);
            }
            /**
                重置自动保存
            */
            this.reset = function () {
                // 停止
                this.stop();
                // 开始
                this.start();
            }

            /**
                停止自动保存
            */
            this.stop = function () {
                if (run) {
                    clearTimeout(run);
                    run = null;
                }
            }

        })();

        // 版本历史管理器
        this.versionHistoryManager = new (function () {
            var parent = designManager,
                show = false,         // 是否显示
                autoSaveList = [],    // 自动保存列表
                backupList = [],      // 备份列表
                needUpdate = true,    // 是否需要更新
                dataReady = false;    // 数据是否已准备

            /**
                导入版本
                @verID 版本ID
            */
            function importVersion(verID) {
                $http.post("/QD/GetDesignBakByBakID", {
                    bakID: verID,
                }).success(function (data) {
                    if (!data.returnError) {
                        // 显示加载图标
                        parent.showLoader();
                        // 加载数据
                        parent.importJson({
                            nodeList: JSON.parse(data.val.DesignText),
                            mediaLib: JSON.parse(data.val.MediaLibrary),
                            imageUrl: data.URL,
                            theme: JSON.parse(data.val.theme),
                        }, true);
                        //默认选中开始节点（zy）
                        parent.selectNodeSingle(parent.startNode);
                        hinter.hint(Prompt.QSNRD_ImportVersionsFinish);
                        // 导入版本后所有操作记录清零
                        recordManager.clear();
                    }
                }).error(function (data) {
                    var errorMessage = "";
                    if (data || data.returnMessage) {
                        errorMessage = data || data.returnMessage;
                    }
                    RestLoginForDesign(errorMessage);
                    hinter.hint(Prompt.QSNRD_ImportVersionsFauled);
                })
            }

            /**
                打开版本管理窗口
            */
            this.open = function () {
                show = true;
                // 无需更新
                if (needUpdate) {
                    // 标记数据未准备好
                    dataReady = false;
                    $http.post("/QD/GetDesignBak", {
                        quesID: parent.questionnairUuid,
                    }).success(function (data) {
                        // 重置列表
                        backupList = [];
                        if (data instanceof Array) {
                            for (var i = 0; i < data.length; i++) {
                                var item = data[i];
                                backupList.push({
                                    verName: item.BakupName,
                                    verID: item.DesignBakID
                                });
                            }
                            // 数据已准备好
                            dataReady = true;
                            // 无需更新
                            needUpdate = false;
                        }
                    }).error(function (data) {
                        RestLoginForDesign(data);
                        hinter.hint(Prompt.QSNRD_GetVersionsListFauled);
                    })
                }
            }

            /**
                关闭版本管理
            */
            this.close = function () {
                show = false;
            }

            /**
                删除指定版本
                @version 要删除的版本
            */
            this.deleteVersion = function (version) {
                // 调用后台接口删除该版本
                $http.post("/QD/DelDesignBak", {
                    bakID: version.verID,
                }).success(function (data) {
                    // 删除成功
                    if (!data.returnError) {
                        // 清除内存中该条数据
                        for (var i = 0; i < backupList.length; i++) {
                            if (version == backupList[i]) {
                                backupList.splice(i, 1);
                                break
                            }
                        }
                        hinter.hint(Prompt.QSNRD_DeleteVersionsSuccess);
                    }
                }).error(function (data) {
                    var errorMessage = "";
                    if (data || data.returnMessage) {
                        errorMessage = data || data.returnMessage;
                    }
                    RestLoginForDesign(errorMessage);
                    hinter.hint(Prompt.QSNRD_DeleteVersionsFauled);
                })

            }
            /**
                改变版本名字
            */
            this.changeVersionName = function (version) {
                parent.versionSaveManager.open(version);
            }

            /**
                导入某个版本
                @verID 版本ID
            */
            this.importVersion = function (verID) {
                // 检查问卷状态并在回调中根据状态进行处理
                parent.getQuesStatusAjax(
                    function (status) {     // 获取状态成功回调函数
                        // 检查问卷状态
                        if (!parent.isAllowChangeStatus(status)) {
                            // 提示不可修改
                            hinter.hint(QSNRD_NoChangeForOnLine);
                            return;
                        }
                        // 确认
                        confirm(Prompt.QSNRD_ConfirmVersionImport, function () {
                            // 导入该版本
                            importVersion(verID);
                        }, null, "载入", "", "取消");
                    }, function () {        // 获取问卷失败回调函数
                        hinter.hint(Prompt.QSNRD_GetQuesStatusFauledImportFauled);
                    })
            }

            /**
                保存版本
            */
            this.saveVersion = function () {
                parent.versionSaveManager.open();
            }

            /**
                是否可见
            */
            this.isVisible = function () {
                return show;
            }

            /**
                获取自动保存列表
            */
            this.getAutoSaveList = function () {
                return autoSaveList;
            }

            /**
                获取备份列表
            */
            this.getBackupList = function () {
                return backupList;
            }

            /**
                设置下次需要更新
            */
            this.setUpdateNextTime = function () {
                needUpdate = true;
            }

            /**
                数据是否准备好
            */
            this.isDataReady = function () {
                return dataReady;
            }

            /**
                是否允许保存
            */
            this.isAllowSave = function () {
                return parent.isAllowSave();
            }
        })();

        // 图片上传管理器
        this.imageUploadManager = new (function () {
            var parent = designManager,
                me = this,
                worker = $(document.createElement("img")),
                task = {                    // 正在进行的任务
                    image: null,
                    editMode: true,
                },
                callback = null,           // 上传完成或关闭后的回调函数
                editMode = false,          // 是否为编辑模式
                uploading = false,         // 是否正在上传
                uploader = null,           // 上传对象
                show = false,              // 是否显示
                mediaBoxShow = false,      // 是否显示媒体库盒子
                pinned = false;            // 是否钉住盒子

            /**
                钉住盒子
            */
            this.pin = function () {
                pinned = true;
            }

            /**
                取消钉住盒子
            */
            this.canclePin = function () {
                pinned = false;
            }

            /**
                是否钉住盒子
            */
            this.isPinned = function () {
                return pinned;
            }

            /**
                关闭媒体库盒子
            */
            this.mediaClose = function () {
                mediaBoxShow = false;
            }

            /**
                切换打开/关闭媒体库盒子
            */
            this.mediaToggleShow = function () {
                mediaBoxShow = !mediaBoxShow;
            }

            /**
                是否显示媒体库盒子
            */
            this.mediaIsVisible = function () {
                return mediaBoxShow;
            }

            /**
                图片上传完的处理函数
                @file 文件信息
            */
            function handleUploadComplete(file) {
                uploading = false;
                $("#" + task.image.id + " #upload_canceller").hide();
                var image = task.image;
                task.image = null;
                // 新增模式
                if (!task.editMode) {
                    // 索引
                    image.index = me.imageList.length;
                    // 加入列表
                    me.imageList.push(image);
                    // 新增完后变成编辑模式
                    editMode = true;
                    // 编辑模式
                } else {
                    if (parent.startNode.image == image) {
                        parent.startNode.dirty = true;
                    }
                }
                //（新增编辑图片）上传成功切图（zy）
                image.reCut = true;
                // 存储容量
                image.size = file.size;
                // 本地文件名
                image.fileName = file.name;
                // 服务器文件名
                image.serverFileName = file.serverName;
                // 地址
                image.url = me.imageUrl;
                worker = $("#uploaded_image");
                // 图片测试对象事件监听
                worker.unbind().bind({
                    load: function (e) {
                        var imgElem = e.currentTarget;
                        // 读取宽高
                        image.originWidth = imgElem.naturalWidth;
                        image.originHeight = imgElem.naturalHeight;
                        // 默认自适应
                        image.fitAuto();
                        me.digest();
                    },
                    error: function () {
                        console.log("image loading failed!");
                    }
                })
                worker.attr("src", image.getBigImageStyle());
                parent.markChange(true);
                // 尝试回调
                if (callback instanceof Function) {
                    callback(image);
                    callback = null;
                }
            }


            /**
                图片上传进度处理函数
                @e 进度信息
            */
            function handleUploadProcess(e) {
                uploading = true;
                $("#" + task.image.id + " #upload_canceller").show();
                $("#" + task.image.id + " #upload_progressor").css("width", e + "%");
            }

            this.dropArrow = false;
            // 当前图片
            this.currentImage = null;
            // 当前图片列表
            this.imageList = [];
            // 远程目录
            this.imageUrl = "";
            /**
                导入图片库
                @list 图片库列表
                @imageUrl 远程目录
            */
            this.import = function (list, imageUrl) {
                // 记录下远程目录
                this.imageUrl = imageUrl;
                if (!(list instanceof Array)) {
                    return;
                }
                var reCut = this.imageList.length > 0 ? true : false;
                this.imageList = [];
                // 根据数据列表生成图片文件对象加入临时列表中
                for (var i = 0; i < list.length; i++) {
                    var image = new ZYDesign.Class.ImageModel();
                    var imgTemp = list[i];
                    for (var key in imgTemp) {
                        image[key] = imgTemp[key];
                    }
                    if (!image.id) {
                        image.id = ZYDesign.UuidUtil.generate();
                    }
                    // 生成url
                    image.url = this.imageUrl;
                    image.reCut = reCut;
                    this.imageList.push(image);
                }
            }

            /**
                导出图片库
            */
            this.export = function () {
                var list = [];
                var cutList = ""
                for (var i = 0; i < this.imageList.length; i++) {
                    var img = this.imageList[i];
                    list.push({
                        id: img.id,
                        index: img.index,
                        size: img.size,
                        fileName: img.fileName,
                        serverFileName: img.serverFileName,
                        cutX: img.cutX,
                        cutY: img.cutY,
                        originWidth: img.originWidth,
                        originHeight: img.originHeight,
                        settingWidth: img.settingWidth,
                        settingHeight: img.settingHeight
                    })
                    // 需要重新截图
                    if (img.reCut) {
                        if (cutList) {
                            cutList += ","
                        }
                        cutList += img.id;
                    }
                }
                return {
                    list: list,
                    cutList: cutList
                };
            }

            /**
                是否可见
            */
            this.isVisible = function () {
                return show;
            }

            /**
                打开上传图片管理窗口
                @cb 上传成功或关闭后的回调函数
            */
            this.open = function (cb) {
                // 不可更改
                if (!parent.isAllowSave()) {
                    hinter.hint(Prompt.QSNRD_OperationMediaDisable);
                    return;
                }
                callback = cb;
                show = true;
                // 当前有新增任务正在执行
                if (task.image && !task.editMode) {
                    // 显示该任务
                    this.currentImage = task.image;
                } else {
                    // 新开当前图片
                    this.currentImage = new ZYDesign.Class.ImageModel();
                }
                // 新增模式,非编辑模式
                editMode = false;
            }

            /**
                关闭上传图片管理窗口
                @ingoreCb 是否无视回调
            */
            this.close = function (ignoreCb) {
                // 清除当前图片
                this.currentImage = null;
                show = false;
                // 尝试回调
                if (callback instanceof Function && !ignoreCb) {
                    callback();
                    callback = null;
                }
            }

            /**
                编辑图片
                @image 图片
            */
            this.editImage = function (image) {
                // 不可更改
                if (!parent.isAllowSave()) {
                    hinter.hint(Prompt.QSNRD_OperationMediaDisable);
                    return;
                }
                callback = null;
                this.currentImage = image;
                show = true;
                // 编辑模式
                editMode = true;
            }

            /**
                上传图片
            */
            this.uploadImage = function () {
                // 正在上传中
                if (uploading) {
                    hinter.hint(Prompt.UploadPrompt);
                } else {
                    task.image = this.currentImage;
                    task.editMode = editMode;
                    $("#btn_Upload").click();
                }
            }
            /**
                删除图片对象
            */
            this.deleteImage = function (image) {
                // 不可更改
                if (!parent.isAllowSave()) {
                    hinter.hint(Prompt.QSNRD_OperationMediaDisable);
                    return;
                }
                if (this.getImageEngagement(image).isEngaged) {
                    hinter.hint(Prompt.QSNRD_ImageDeleteDisable);
                    return;
                }
                var afterDelete = false;
                for (var i = 0; i < this.imageList.length; i++) {
                    var imgTemp = this.imageList[i];
                    if (imgTemp == image) {
                        this.imageList.splice(i--, 1);
                        afterDelete = true;
                        parent.markChange(true);
                    }
                    if (afterDelete) {
                        imgTemp.index -= 1;
                    }
                }
            }

            /**
                获取图片的使用情况
                @image 图片
            */
            this.getImageEngagement = function (image) {
                if (!(image instanceof ZYDesign.Class.ImageModel)) {
                    return {
                        isEngaged: false,
                    };
                }
                for (var i = 0; i < parent.mixNodes.length; i++) {
                    var node = parent.mixNodes[i];
                    // 该节点使用了改图
                    if (node.image == image) {
                        return {
                            isEngaged: true,
                            nodeId: node.id,
                        }
                    }
                    // todo 有图片题的时候此处还需追加选项判断
                }
                return {
                    isEngaged: false,
                };
            }

            /**
                获取管理器窗口样式
            */
            this.getStyle = function () {
                var top = 0;
                // 有图片则调整位置
                if (this.currentImage) {
                    top = 42 + (this.currentImage.index) * 47
                }
                // 底部超出页面底部则换成箭头向下的方式
                if ((top + 295 + 100) > window.innerHeight) {
                    this.dropArrow = true;
                    // 上一一个体位
                    top -= 295;
                } else {
                    this.dropArrow = false;
                }
                // 仍然超出页面底部
                if ((top + 250 + 100) > window.innerHeight) {
                    top = window.innerHeight - 295 - 100;
                }
                return "top:" + top + "px";
            }

            /**
                根据图片ID获取图片对象
                @id 图片ID
            */
            this.getImageById = function (id) {
                if (!id) {
                    return;
                }
                for (var i = 0; i < this.imageList.length; i++) {
                    var image = this.imageList[i];
                    if (image.id == id) {
                        return image;
                    }
                }
            }

            /**
                取消上传
            */
            this.cancel = function () {
                if (uploader) {
                    uploader.cancel();
                    $("#" + task.image.id + " #upload_canceller").hide();
                    $("#" + task.image.id + " #upload_progressor").css("width", "0%");
                    uploading = false;
                    uploadingImage = null;
                }
            }

            /**
                初始化上传控件
            */
            this.initUploader = function () {
                if (uploader) {
                    return;
                }
                uploader = $("#uploadDiv").InitUpload({
                    parentfolder: "\\UploadFiles\\Photo\\",
                    CompanyID: parent.companyId,
                    QuesID: parent.questionnairUuid,
                    UType: "3",
                    // 指定上传完成的处理函数
                    complete: handleUploadComplete,
                    // 指定上传进度的处理函数
                    progress: handleUploadProcess,
                })
            }

            /**
                清空截图列表
            */
            this.clearCutList = function () {
                for (var i = 0; i < this.imageList.length; i++) {
                    this.imageList[i].reCut = false;
                }
            }


            /**
                更新页面
            */
            this.digest = function () {
                parent.digest();
            }
        })();

        // 页面管理器(管理其他管理器不管的东西)
        this.pageManager = new (function () {

        })();

        // 剪切板
        this.clipBoard = new (function () {
            var parent = designManager,
                list = [],           // 剪切板上的节点列表
                listX = 0,           // 节点列表X坐标
                listY = 0;           // 节点列表Y坐标
            /**
                将节点复制到剪切板
                @clip 是否剪切
            */
            this.copy = function (clip) {
                // 重置坐标
                listX = 0;
                listY = 0;
                var selected = [],
                    rss = [],
                    nodes = parent.mixNodes;
                for (var i = nodes.length - 1; i >= 0; i--) {
                    var node = nodes[i];
                    // 不允许被复制
                    if (node.copyDisabled) {
                        continue;
                    }
                    if (node.isSelected()) {
                        // 校准列表X坐标
                        if (listX > node.x || selected.length == 0) {
                            listX = node.x;
                        }
                        // 校准列表Y坐标
                        if (listY > node.y || selected.length == 0) {
                            listY = node.y;
                        }
                        var item = {
                            node: node,
                            x: node.x,
                            y: node.y
                        }
                        selected.push(item);
                        // 剪切的场合
                        if (clip) {
                            // 移除该节点
                            var rs = parent.removeNode(item.node);
                            if (rs) {
                                rss.push(rs);
                            }
                        }
                    }

                }
                // 有被切掉的节点
                if (rss.length > 0) {
                    // 需要注册到操作历史
                    recordManager.register({
                        descript: "剪切节点",
                        param: {
                            manager: designManager,
                            changeList: rss,
                        },
                        undo: function () { // 撤销 
                            var param = this.param;
                            // 恢复被切掉的节点及相关的连接
                            for (var i = 0; i < param.changeList.length; i++) {
                                var item = param.changeList[i];
                                param.manager.mixNodes.push(item.node);
                                for (var j = 0; j < item.conns.length; j++) {
                                    var conn = item.conns[j];
                                    param.manager.addConnection(conn);
                                }
                            }

                        },
                        redo: function () { // 重做 
                            var param = this.param;
                            for (var i = 0; i < param.changeList.length; i++) {
                                var item = param.changeList[i];
                                param.manager.removeNode(item.node);
                            }

                        }
                    });
                }

                list = selected;
            }

            /**
                粘贴
                @pageX 目标位置X坐标
                @pageY 目标位置Y坐标
                @ignorePos 无视坐标
            */
            this.paste = function (pageX, pageY, ignorePos) {
                if (list.length == 0) {
                    return;
                }
                var rss = [];
                // 无视坐标偏移
                if (ignorePos) {
                    // 所有节点无视坐标复制
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var rs = parent.copyNode(item.node, 0, 0, true);
                        if (rs) {
                            rss.push(rs);
                        }
                    }
                    // 需要考虑坐标偏移
                } else {
                    var elem = $("#chartLarger");
                    // 获得当前鼠标位置
                    var coord = parent.translateCoordinates(pageX, pageY, elem);
                    coord.x = (coord.x - parent.chartXDiffer) / parent.chartZoomRate + parent.chartXDiffer;
                    coord.y = (coord.y - parent.chartYDiffer) / parent.chartZoomRate + parent.chartYDiffer;
                    // 计算列表坐标偏移
                    var listDiffX = coord.x - listX;
                    var listDiffY = coord.y - listY;


                    for (var i = 0; i < list.length; i++) {
                        // 计算每个节点的偏移量
                        var item = list[i],
                            nodeDiffX = (listDiffX + (item.x - item.node.x)),
                            nodeDiffY = (listDiffY + (item.y - item.node.y));
                        var rs = parent.copyNode(item.node, nodeDiffX, nodeDiffY, true);

                        if (rs) {
                            rss.push(rs);
                        }
                    }
                }
                // 单选最后一个节点
                parent.selectNodeSingle(parent.mixNodes[parent.mixNodes.length - 1]);
                // 有变化
                if (rss.length > 0) {
                    // 需要注册到操作历史
                    recordManager.register({
                        descript: "复制节点",
                        param: {
                            manager: designManager,
                            changeList: rss,
                        },
                        undo: function () {
                            var param = this.param;
                            for (var i = 0; i < param.changeList.length; i++) {
                                var item = param.changeList[i];
                                param.manager.removeNode(item.copy);
                            }
                        },
                        redo: function () {
                            var param = this.param;
                            for (var i = 0; i < param.changeList.length; i++) {
                                var item = param.changeList[i];
                                param.manager.mixNodes.push(item.copy);
                            }
                        }
                    })
                }
            }
            /**
                即时复制
                @x 坐标X
                @y 坐标Y
            */
            this.dulplicate = function (x, y) {
                this.copy();
                this.paste(x, y, true);
            }

            /**
                是否是空剪切板
            */
            this.isEmpty = function () {
                return !list.length;
            }
        })();

        // 右键菜单
        this.contextMenu = new (function () {
            var parent = designManager,
                menu = ZYDesign.ContextMenu,
                left = 0,
                top = 0,
                show = false;
            this.list = [];
            this.list2 = [];
            this.list3 = [];
            for (var key in menu) {
                switch (key) {
                    case "showall":
                    case "showdefault":
                    case "zoomin":
                    case "zoomout":
                        this.list.push(menu[key]);
                        break;
                    case "optionbatch":
                    case "copy":
                    case "paste":
                    case "duplicate":
                    case "clip":
                    case "del":
                    case "bre":
                        this.list2.push(menu[key]);
                        break;
                    case "redo":
                    case "undo":
                    case "saveversion":
                        this.list3.push(menu[key]);
                        break;
                }
            }
            var width = 240,
                height = 29 * (this.list.length + this.list2.length + this.list3.length);
            /**
                获取样式
            */
            this.getStyle = function () {
                return "position:absolute;top:" + top + "px;left:" + left + "px;";
            }

            /**
                是否可见
            */
            this.isVisible = function () {
                return show;
            }

            /**
                检查选项可用性
            */
            this.checkEnable = function () {
                var copyEnable = false;
                clipEnable = false,
                delEnable = false,
                breEnable = false,
                batchEnable = false,
                redoEnable = false,
                undoEnable = false,
                saveversionEnable = false,
                showdefaultEnable = true,
                nodes = parent.mixNodes;
                // 检查可用性
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i]
                    if (!node.isSelected()) {
                        continue;
                    }
                    var a = node.copyDisabled;
                    // 可以批量输入
                    if (!node.optionbatchDisabled) {
                        batchEnable = true;
                    }
                    // 可以被复制
                    if (!node.copyDisabled) {
                        copyEnable = true;
                    }
                    // 可以断开连接
                    if (node.relatedConnections.length > 0) {
                        breEnable = true;
                    }
                    var b = node.removeDisabled;
                    // 可被删除
                    if (!node.removeDisabled) {
                        delEnable = true;
                        clipEnable = true;
                    }
                    if (copyEnable && clipEnable && delEnable && breEnable) {
                        break;
                    }
                }
                // 没有可删节点时,再检查连接
                if (!delEnable) {
                    var conns = parent.connections;
                    for (var i = 0; i < conns.length; i++) {
                        if (conns[i].isSelected()) {
                            delEnable = true;
                            break;
                        }
                    }
                }
                // 100% 显示的不可用性
                if (designManager.chartZoomRate == 1) {
                    showdefaultEnable = false;
                }
                // redo的可用性
                if (recordManager.isRedoEnabled()) {
                    redoEnable = true;
                }
                // undo的可用性
                if (recordManager.isUndoEnabled()) {
                    undoEnable = true;
                }
                // 保存版本的可用性
                if (designManager.versionHistoryManager.isAllowSave()) {
                    saveversionEnable = true;
                }
                // 设置可用性
                menu.copy.enable = copyEnable;
                menu.paste.enable = !parent.clipBoard.isEmpty();
                menu.duplicate.enable = copyEnable;
                menu.clip.enable = clipEnable;
                menu.del.enable = delEnable;
                menu.bre.enable = breEnable;
                menu.optionbatch.enable = batchEnable;
                menu.redo.enable = redoEnable;
                menu.undo.enable = undoEnable;
                menu.saveversion.enable = saveversionEnable;
                menu.showdefault.enable = showdefaultEnable;
            }

            /**
                打开菜单
            */
            this.open = function (x, y) {
                var pageWidth = window.innerWidth,
                    pageHeight = window.innerHeight;
                // 调整位置
                left = x + width <= pageWidth ? x : pageWidth - width; // 超过右侧则靠右侧
                top = y + height <= pageHeight ? y : y - height;      // 超过下侧则向上
                // 检查可用性
                this.checkEnable();
                show = true;
            }
            /**
                关闭菜单
            */
            this.close = function () {
                show = false;
            }

            /**
                执行菜单项功能
                @item 菜单项
            */
            this.executeItem = function (item) {
                // 检查可用性,不可用则不执行
                if (!item.enable) {
                    return;
                }
                switch (item.operation) {
                    // 复制
                    case "COPY":
                        // 复制到剪切板 registered in record
                        parent.clipBoard.copy(false);
                        break;
                        // 粘贴
                    case "PASTE":
                        // 粘贴 registered in record
                        parent.clipBoard.paste(left, top);
                        break;
                        // 即时复制
                    case "DUPLICATE":
                        // 即使复制所选节点到画布  registered in record
                        parent.clipBoard.dulplicate(left, top);
                        break;
                        // 剪切
                    case "CLIP":
                        // 剪切到剪切板  registered in record
                        parent.clipBoard.copy(true);
                        break;
                        // 删除
                    case "DELETE":
                        // 删除所选 registered in record
                        parent.removeSelected();
                        break;
                        // 断开连接
                    case "BREAK":
                        // 断开所选节点的连接 registered in record
                        parent.breakConnOfSelectedNodes();
                        break;
                        //选项批量输入
                    case "OPTIONBATCH":
                        // 断开所选节点的连接
                        parent.optionBatchAddManager.open();
                        break;
                        // 显示全部
                    case "SHOWALL":
                        // 显示全部节点
                        parent.showAll();
                        break;
                        // 100%显示
                    case "SHOWDEFAULT":
                        parent.showDefault();
                        break;
                        //  放大
                    case "ZOOMIN":
                        parent.zoomIn();
                        break;
                        // 缩小
                    case "ZOOMOUT":
                        parent.zoomOut();
                        break;
                        // redo
                    case "REDO":
                        // 重做上次操作
                        recordManager.redo() && designManager.digest();
                        break;
                        // undo
                    case "UNDO":
                        // 撤销上次操作
                        if (recordManager.undo()) {
                            designManager.digest();
                        }
                        break;
                        // 保存版本
                    case "SAVEVERSION":
                        parent.versionHistoryManager.saveVersion();
                        break;
                }
                // 关闭
                this.close();
            }
        })();

        // 节点盒子管理器
        this.nodeBoxManager = new (function () {
            var parent = designManager,
                pinned = true,
                show = true;

            this.baseNodeHide = false;
            this.checkNodeHide = false;
            this.toolNodeHide = false;
            /**
                钉住盒子
            */
            this.pin = function () {
                pinned = true;
            }

            /**
                取消钉住盒子
            */
            this.canclePin = function () {
                pinned = false;
            }

            /**
                打开盒子
            */
            this.open = function () {
                show = true;
            }

            /**
                关闭盒子
            */
            this.close = function () {
                show = false;
            }

            /**
                切换打开关闭盒子
            */
            this.toggleShow = function () {
                show = !show;
            }

            /**
                盒子是否被钉住
            */
            this.isPinned = function () {
                return pinned;
            }

            /**
                盒子是否显示
            */
            this.isVisible = function () {
                return show;
            }

            /**
                切换盒子钉住与否
            */
            this.togglePin = function () {
                pinned = !pinned;
            }

            /**
                添加节点
                @elem 触发该行为的元素
                @x 指定添加到的位置X
                @y 指定添加到的位置Y
            */
            this.addNode = function (elem, x, y) {
                if (elem.hasClass("column_button_disable")) {
                    return;
                }
                // 按钮Id
                var key = elem.attr("data-method");
                var isCheck = elem.attr("data-check")
                var mode = isCheck ? 1 : null;
                var rs = parent[key](null, mode, x, y);
                // 标记已发生改变
                parent.markChange(true);

                // 需要注册到操作记录
                recordManager.register({
                    descript: "添加节点",
                    param: {
                        node: rs,
                        manager: designManager
                    },
                    undo: function () {
                        var param = this.param;
                        param.manager.removeNode(param.node);
                    },
                    redo: function () {
                        var param = this.param;
                        param.manager.mixNodes.push(param.node);
                    }
                });

            }

            /**
                转换鼠标页面坐标为元素相对坐标
                @x 页面X坐标
                @y 页面Y坐标
                @elem 指定元素
            */
            this.transCoords = function (x, y, elem) {
                return parent.translateCoordinates(x, y, elem);
            }

            /**
                更新页面
            */
            this.digest = function () {
                parent.digest();
            }
        })();

        // 主题盒子管理器
        this.themeBoxManager = new (function () {
            var parent = designManager,
                themeBox = this,
                cfgTheme = ZYDesign.Theme,
                keys = ["bgColor", "quesColor", "btnBgColor", "btnColor", "selColor"],
                show = false,
                pinned = false; // 盒子是否被钉住

            /**
                钉住盒子
            */
            this.pin = function () {
                pinned = true;
            }

            /**
                取消钉住盒子
            */
            this.canclePin = function () {
                pinned = false;
            }

            /**
                是否钉住盒子
            */
            this.isPinned = function () {
                return pinned;
            }

            /**
                主题类
            */
            function ThemeModel(data) {
                if (!(this instanceof ThemeModel)) {
                    return;
                }
                data = data || {};
                this.bgColor = data.bgColor || "white";        // 背景颜色
                this.quesColor = data.quesColor || "black";    // 问题文字颜色
                this.btnBgColor = data.btnBgColor || "green";  // 按钮背景颜色
                this.btnColor = data.btnColor || "white";      // 按钮颜色
                this.selColor = data.selColor || "green";      // 选项文字颜色
                this.isSelected = false;                       // 是否被选中
                this.isCustom = data.isCustom || false;        // 是否使用了自定义列表项
                if (!ThemeModel.prototype.getColorStyle) {
                    ThemeModel.prototype.getColorStyle = function (key) {
                        return "background-color:" + this[key];
                    }
                }
            }
            // 推荐列表
            this.themeList = [];
            // 自定义列表
            this.customList = []
            // 初始化推荐列表
            for (var i = 0; i < cfgTheme.length; i++) {
                var data = cfgTheme[i];
                themeBox.themeList.push(new ThemeModel(data));
            }

            // 数据是否发生改变
            this.dirty = false;

            // 当前使用中的主题
            this.theme = new ThemeModel();
            // 初始化为不使用列表项
            this.theme.themeIndex = -1;


            /**
                打开
            */
            this.open = function () {
                show = true;
            }

            /**
                关闭
            */
            this.close = function () {
                show = false;
            }

            /**
                应用
                @theme 预应用主题
                @silent 是否静默模式
                @addMode 是否需要同时添加到自定义列表
            */
            this.apply = function (theme, silent, addMode) {
                // 已经是当前选择的主题
                if (theme.isSelected) {
                    return;
                }
                // 添加模式
                if (addMode) {
                    // 根据数据生成一个新主题
                    theme = new ThemeModel(theme);
                    // 标记该主题为自定义模式
                    theme.isCustom = true;
                    // 加入自定义列表
                    this.customList.push(theme);
                }
                // 初始化原主题
                var oldTheme = null;
                // 当前使用了主题列表中的主题
                if (this.theme.themeIndex >= 0) {
                    // 使用的是自定义列表
                    if (this.theme.isCustom) {
                        oldTheme = this.customList[this.theme.themeIndex];
                        // 使用的是推荐列表
                    } else {
                        oldTheme = this.themeList[this.theme.themeIndex];
                    }
                    // 使用了非列表方案
                } else {
                    oldTheme = this.theme;
                }

                // 使用预应用主题的数据
                this.theme.bgColor = theme.bgColor;
                this.theme.btnBgColor = theme.btnBgColor;
                this.theme.btnColor = theme.btnColor;
                this.theme.quesColor = theme.quesColor;
                this.theme.selColor = theme.selColor;
                this.theme.isCustom = theme.isCustom;

                // 处理推荐列表
                for (var i = 0; i < this.themeList.length; i++) {
                    var temp = this.themeList[i];
                    // 是预应用的主题
                    if (temp == theme) {
                        // 当前主题的索引记录
                        this.theme.themeIndex = i;
                        // 标记选中
                        temp.isSelected = true;
                        // 非预应用的主题
                    } else {
                        // 取消选中
                        temp.isSelected = false;
                    }
                }

                // 处理自定义列表
                for (var i = 0; i < this.customList.length; i++) {
                    var temp = this.customList[i];
                    // 是预应用的主题
                    if (temp == theme) {
                        // 当前主题的索引记录
                        this.theme.themeIndex = i;
                        // 标记选中
                        temp.isSelected = true;
                        // 非预应用的主题v
                    } else {
                        // 取消选中
                        temp.isSelected = false;
                    }
                }
                // 新主题
                var newTheme = theme;

                // 非静默模式
                if (!silent) {
                    // 标记发生变化
                    this.dirty = true;
                    parent.markChange();
                    // 重绘
                    this.rerender();
                    // 需要注册到操作历史
                    recordManager.register({
                        descript: addMode ? "添加自定义主题" : "更改主题颜色方案",
                        param: {
                            oldTheme: oldTheme,  // 原主题
                            newTheme: newTheme,  // 新主题
                            themeBox: this,       // 主题盒子对象
                            addMode: addMode,     // 是否为添加模式
                        },
                        undo: function () {      // 撤销函数
                            var param = this.param;
                            // 撤销到使用原主题
                            param.themeBox.apply(param.oldTheme);
                            // 添加模式的时候
                            if (param.addMode) {
                                // 需要从自定义列表中移除添加项
                                param.themeBox.customList.pop();
                            }
                        },
                        redo: function () {      // 重做函数
                            var param = this.param;
                            // 重新应用新主题
                            param.themeBox.apply(param.newTheme);
                            // 添加模式的时候
                            if (param.addMode) {
                                // 需要重新添加到自定义列表
                                param.themeBox.customList.push(param.newTheme);
                            }
                        }
                    })
                }
            }

            /**
                更改
                @key 键
                @value 值
            */
            this.change = function (key, value) {
                var oldValue = this.theme[key],          // 变更前的值
                    newValue = this.theme[key] = value,  // 变更后的值
                    former = null,                       // 变更前所使用到的方案,此处初始化为无
                    formerIndex = -1;                    // 变更前的索引,此处初始化为-1
                // 前后的值相同则不做处理
                if (oldValue.toUpperCase() == newValue.toUpperCase()) {
                    return;
                }
                // 发生变更后应该变成不使用任何方案
                this.theme.themeIndex = -1;
                // 是否在在默认方案中找到了当前选择的方案
                var foundInDefault = false;
                // 在默认方案中寻找当前选择的方案
                for (var i = 0; i < this.themeList.length; i++) {
                    var temp = this.themeList[i];
                    // 找到
                    if (temp.isSelected) {
                        // 记录该方案
                        former = temp;
                        // 记录索引
                        formerIndex = i;
                        // 取消选择
                        temp.isSelected = false;
                        // 标记在默认列表中找到
                        foundInDefault = true;
                        break;
                    }
                }
                // 在默认方案中未找到
                if (!foundInDefault) {
                    // 在自定义方案中寻找当前选择的方案
                    for (var i = 0; i < this.customList.length; i++) {
                        var temp = this.customList[i];
                        // 找到
                        if (temp.isSelected) {
                            // 记录该方案
                            former = temp;
                            // 记录索引
                            formerIndex = i;
                            // 取消选择
                            temp.isSelected = false;
                            break;
                        }
                    }
                }
                // 标记发生变化
                this.dirty = true;
                parent.markChange(key);
                // 重绘
                this.rerender(key);

                // 需要注册到操作历史
                recordManager.register({
                    descript: "更改主题颜色",
                    exclusive: true,
                    param: {
                        oldValue: oldValue,  // 原值
                        newValue: newValue,  // 新值
                        obj: this.theme,      // 变化对象
                        key: key,            // 变化属性
                        former: former,      // 之前应用的主题
                        formerIndex: formerIndex,   // 之前应用主题的索引
                        themeBox: themeBox,   // 当前管理对象
                    },
                    undo: function () {  // 撤销函数
                        var param = this.param;
                        // 撤销到原值
                        param.obj[param.key] = param.oldValue;
                        // 如果之前应用了某个方案
                        if (param.former) {
                            // 该方案应被重新选择
                            param.former.isSelected = true;
                            // 重新记录索引
                            param.obj.themeIndex = param.formerIndex;
                        }
                        // 重绘
                        param.themeBox.rerender(param.key);
                    },
                    redo: function () {  // 重做函数
                        var param = this.param;
                        // 重做到新值
                        param.obj[param.key] = param.newValue;
                        // 如果之前应用了某个方案
                        if (param.former) {
                            // 该方案应取消选择
                            param.former.isSelected = false;
                            // 取消记录索引
                            param.obj.themeIndex = -1;
                        }
                        // 重绘
                        param.themeBox.rerender(param.key);
                    }
                });
            }

            /**
                导入数据
                @data 主题数据
                @silent 是否静默模式
            */
            this.import = function (data, silent) {
                var formerTheme = null;
                // 之前没有任何主题信息
                if (!data) {
                    // 初始化为第一个
                    formerTheme = this.themeList[0];
                    // 之前有信息
                } else {
                    // 有自定义的主题
                    if (data.customs) {
                        // 导入自定义的主题
                        this.importCustom(JSON.parse(data.customs));
                    }
                    // 之前使用了主题列表中的主题
                    if (data.themeIndex >= 0) {
                        var list = null;
                        // 使用了自定义的主题
                        if (data.isCustom) {
                            // 使用自定义列表
                            list = this.customList;
                        } else {
                            list = this.themeList;
                        }
                        // 使用列表中的主题
                        formerTheme = list[data.themeIndex];
                        // 使用了非列表主题
                    } else {
                        formerTheme = data;
                    }
                }
                // 有主题信息则应用
                if (formerTheme) {
                    this.apply(formerTheme, silent);
                }

            }

            /**
                导入自定义列表
            */
            this.importCustom = function (customList) {
                this.customList = [];
                for (var i = 0; i < customList.length; i++) {
                    var item = customList[i];
                    this.customList.push(new ThemeModel(item));
                }

            }

            /**
                将当前主题保存为自定义主题
            */
            this.saveAsCustom = function () {
                if (this.customList.length >= 5) {
                    return;
                }
                // 添加并应用
                this.apply(this.theme, false, true);
            }

            /**
                移除一个自定义主题
            */
            this.removeCustom = function (custom) {
                var index = -1,       // 初始化该主题所在的索引
                    themeIndex = -1;  // 初始化当前主题索引
                // 寻找该自定义主题
                for (var i = 0; i < this.customList.length; i++) {
                    var temp = this.customList[i];
                    // 找到
                    if (temp == custom) {
                        // 记录索引
                        index = i;
                        // 从列表中移除
                        this.customList.splice(i, 1);
                        // 该自定义主题当前正在被使用
                        if (custom.isSelected) {
                            // 记录当前主题索引
                            themeIndex = i;
                            // 当前主题标记为非列表主题
                            this.theme.themeIndex = -1;
                        }
                        break;
                    }
                }
                // 未找到成功删除
                if (index == -1) {
                    return;
                }

                /**
                    标记发生变化
                */
                parent.markChange();
                // 更新页面
                parent.digest();

                // 需要注册到操作记录
                recordManager.register({
                    descript: "移除自定义主题方案",
                    param: {
                        custom: custom,           // 主题
                        index: index,             // 主题索引 
                        themeIndex: themeIndex,  // 当前主题索引
                        themeBox: this,          // 主题盒子对象
                    },
                    undo: function () {  // 撤销函数
                        var param = this.param;
                        // 撤销把主题加回去
                        param.themeBox.customList.splice(param.index, 0, param.custom);
                        // 该主题之前被使用
                        if (param.themeIndex >= 0) {
                            // 重新标记使用了该主题
                            param.themeBox.theme.themeIndex = param.themeIndex;
                        }
                    },
                    redo: function () {  // 重做函数
                        var param = this.param;
                        // 重新删除该主题
                        param.themeBox.customList.splice(param.index, 1);
                        // 该主题之前被使用
                        if (param.themeIndex >= 0) {
                            // 撤销标记使用了该主题
                            param.themeBox.theme.themeIndex = -1;
                        }
                    }
                })
            }

            /**
                导出
            */
            this.export = function () {
                this.theme.needCompile = this.dirty;
                this.dirty = false;
                return {
                    bgColor: this.theme.bgColor,
                    btnBgColor: this.theme.btnBgColor,
                    btnColor: this.theme.btnColor,
                    needCompile: this.theme.needCompile,
                    quesColor: this.theme.quesColor,
                    selColor: this.theme.selColor,
                    themeIndex: this.theme.themeIndex,
                    isCustom: this.theme.isCustom,
                    customs: JSON.stringify(this.customList),
                };
            }

            /**
                是否可见
            */
            this.isVisible = function () {
                return show;
            }

            /**
                显示/关闭
            */
            this.toggleShow = function () {
                show = !show;
            }

            /**
                再展现
                @key 指定的键
            */
            this.rerender = function (key) {
                var t = themeBox.theme;
                document.getElementById("show_phone").contentWindow.postMessage(
                    {
                        name: "response color",
                        bgColor: t.bgColor,
                        quesColor: t.quesColor,
                        btnColor: t.btnColor,
                        btnBgColor: t.btnBgColor,
                        selColor: t.selColor
                    },
                    "*"
                );

                // 有指定的key
                if (key) {
                    // 更新指定的颜色
                    $("[data-id='" + key + "']").attr("style", this.theme.getColorStyle(key));
                    // 没有指定的key
                } else {
                    // 更新所有颜色
                    for (var i = 0; i < keys.length; i++) {
                        var temp = keys[i];
                        $("[data-id='" + temp + "']").attr("style", this.theme.getColorStyle(temp));
                    }
                }


            }
            /**
                更新页面
            */
            this.digest = function () {
                parent.digest();
            }
            // 监听来窗口发来的信息
            window.addEventListener("message", function (event) {
                var data = event.data;
                // 是来自子窗口的颜色请求
                if (data && data.name == "request color") {
                    themeBox.rerender();
                }
            })

        })();

        /**
            help
        */
        this.helpManager = new (function () {
            this.x = 0;
            this.y = 0;
            this.show = false;//是否显示
            this.currentHelpText = "";//当前帮助的内容
            this.helpWidth = 300;//help的宽度

            /**
               help
           */
            this.help = function (evt, key) {
                var menu = ZYDesign.HelpMessage;
                this.currentHelpText = menu[key].text;
                this.open(evt.pageX);
            }

            /**
               当前help消息
           */
            this.getHelpText = function () {
                $("#context_help_text").html(this.currentHelpText);
            }
            /**
                打开help
            */
            this.open = function (currentPageX) {
                if (this.x == 0 && this.y == 0) {
                    var currentlength;
                    if (currentPageX + 300 > window.innerWidth) {
                        currentlength = parseInt($(".size_299_250").css("width"));//右侧编辑框的宽度
                        this.x = currentPageX - currentlength - this.helpWidth;
                    } else {
                        currentlength = parseInt($(".nodes_kit").css("width")) + parseInt($(".design_toolbar").css("width"));//左侧边框的宽度、节点盒子的宽度
                        this.x = currentPageX + (currentlength - currentPageX + 10);//   10的滚动条距离
                    }
                    this.y = 40;
                }
                //标记显示
                this.show = true;
            }

            /**
               关闭help
           */
            this.close = function () {
                this.show = false;
            }

            /**
                获取样式
            */
            this.getStyle = function () {
                return "top:" + this.y + "px;left:" + this.x + "px;position:absolute;width: " + this.helpWidth + "px";
            }

            /**
                修复位置
            */
            this.fixPosition = function () {
                $("#node_help_result").attr("style", this.getStyle());
            }

        })();

        /**
            页面弹出框管理器
        */
        this.PopupMessageManager = new (function () {
            var parent = designManager;
            var show = false;
            // 重定义地址
            var redirectUrl = "";
            // 弹框提示消息
            this.promptMessage = "";
            // 调用方法的key
            this.key = "";
            // 调用方法所需的参数
            this.argsValue = "";

            /**
                离开当前页面
                @url 目标url,如果没有则是关闭页面
            */
            this.leavePage = function (url) {
                promptMessage = Prompt.QSNRD_GiveupChange;
                redirectUrl = url;
                key = "leave";
                // 有未保存的修改而且是可修改的问卷状态
                if (parent.hasChange()) {
                    // 正在保存
                    if (parent.saving) {
                        // 提示保存中
                        hinter.hint(Prompt.QSNRD_PleaseWaitSaving);
                        // 未在保存
                    } else {
                        show = true;
                    }
                } else {
                    // 跳转到问卷设置页面
                    window.location.href = url;
                }
            }

            /**
                删除版本信息
            */
            this.deleteVersionInfo = function (version) {
                promptMessage = Prompt.QSNRD_ConfirmVersionDelete;
                key = "deleteVersion";
                show = true;
                argsValue = version;
            }


            /**
                当前弹框的提示信息
            */
            this.getPromptMessage = function () {
                return promptMessage;
            }

            /**
                是否显示弹框
            */
            this.isVisible = function () {
                return show;
            }

            /**
               关闭提示信息
           */
            this.close = function () {
                show = false;
            }

            /**
                保存信息
            */
            this.confirmOperation = function () {
                // 关闭窗口
                this.close();
                switch (key) {
                    case "leave":
                        // 保存设计信息，再跳转页面
                        parent.save(null, function () {
                            window.location.href = redirectUrl;
                        }, null, 'Y', null, function () {
                            window.location.href = redirectUrl;
                        })
                        break;
                    case "deleteVersion":
                        // 删除该版本
                        parent.versionHistoryManager.deleteVersion(argsValue);
                        break;


                }
            }

            /**
                不保存信息
            */
            this.cancelOperation = function () {
                // 关闭窗口
                this.close();
                switch (key) {
                    case "leave":
                        // 不保存设计信息，直接跳转页面
                        window.location.href = redirectUrl;
                        break;

                }
            }
        })();


        /**
            获取是否处于联网状态
        */
        this.getOnline = function () {
            return navigator.onLine;
        }

        /**
            标记变化
            @ignoreNode 是否忽略节点
        */
        this.markChange = function (ignoreNode) {
            this.dirty = true;
            // 不忽略节点且有当前节点
            if (this.currentNode && !ignoreNode) {
                // 当前节点标记变化
                this.currentNode.markChange();
            }
        }

        this.clearChange = function () {
            this.dirty = false;
            for (var i = 0; i < this.mixNodes.length; i++) {
                this.mixNodes[i].dirty = false;
            }
        }

        /**
            获取缩放率显示文字
        */
        this.getChartZoomRateText = function () {
            return Math.round(this.chartZoomRate * 10000) / 100 + "%";
        }

        /**
            初始化问卷设计
        */
        this.init = function () {
            // 问卷ID
            var quesID = $("#quesIDEx").val();
            // 既有问卷
            if (!quesID) {
                return this;
            }
            this.questionnairUuid = quesID;
            this.questionnairName = $("#quesName").val();
            this.qNumber = $("#QuesNumber").val();
            this.companyId = $("#companyId").val();
            // 当前对象引用
            var manager = this;
            // 请求问卷设计数据
            $http.post("/QD/GetDesignByQuesID", {
                quesID: this.questionnairUuid,
            }).success(function (data) {
                // 画布已生成则直接导入数据
                if (manager.chartFormed) {
                    console.log("chart detected, directly import data.");
                    manager.importData(data);
                    console.log("data imported.");
                    // 画布还生成则需等待画布生成再导入数据
                } else {
                    console.log("chart not detected, waiting for chart forming... data will be imported after chart formed.");
                    // 等待 
                    var run = setInterval(function () {
                        console.log("waiting...")
                        // 得到画布已生成
                        if (manager.chartFormed) {
                            console.log("chart formed, importing data.");
                            // 导入数据
                            manager.importData(data);
                            // 取消等待
                            clearInterval(run);
                            console.log("data imported.");
                        }
                    })
                }
            }).error(function (data) {
                RestLoginForDesign(data);
                hinter.hint(Prompt.QSNRD_GetDesignDataFauled);
            })
            this.imageUploadManager.initUploader();
            return this;
        }

        /**
            导入数据
            @data 数据
        */
        this.importData = function (data) {
            var manager = this;
            // 参数检查
            if (!data) {
                return;
            }
            // 无问卷概要内容,跳转到概要页面
            if (!data.IsValue && !data.val) {
                console.log("invalid questionnaire!");
                location.href = "/Home";
            }
                // 有问卷设计
            else {
                // 新问卷
                if (data.val == "new" || !data.val.nodeText) {
                    // 默认添加一个开始节点个一个结束节点（每次都加载问卷名称zy）
                    manager.addStartNode(null, null, null, null, manager.questionnairName);
                    manager.addEndNode();
                    // 添加虚拟节点
                    manager.addVitualNodes();
                    // 导入图片库
                    manager.imageUploadManager.import(null, data.URL);
                    // 既有问卷
                } else {
                    var quesJson = {}
                    // 将字符串数据转为JSON
                    quesJson.nodeList = JSON.parse(data.val.nodeText);
                    quesJson.mediaLib = data.val.MediaLibrary ?
                        JSON.parse(data.val.MediaLibrary) : {};
                    quesJson.theme = JSON.parse(data.val.theme);
                    quesJson.imageUrl = data.URL;
                    manager.qStatus = data.val.QStatus;
                    if (!manager.isAllowSave()) {
                        alert(Prompt.QSNRD_CurrentQuesSaveDisable)
                    }
                    // 导入数据
                    manager.importJson(quesJson);
                }
                //默认选中开始节点（zy）
                manager.selectNodeSingle(manager.startNode);
            }
            // 更新页面
            this.digest();
            // 开始自动保存
            manager.autoSaveManager.start();
        }

        /**
            导入Json数据生成问卷
            @questionairJson 问卷json数据
            @isImportVersion 是否导入版本
        */
        this.importJson = function (questionairJson, isImportVersion) {
            // 数据不对
            if (!questionairJson || !(questionairJson.nodeList instanceof Array)) {
                return;
            }
            // 问卷id不一致
            if (questionairJson.questionnairUuid &&
                this.questionnairUuid != questionairJson.questionnairUuid) {
                return;
            }
            // 重置
            this.reset();

            // 连接目标临时对象
            this.importJson.destList = [];
            // 添加虚拟节点
            this.addVitualNodes();
            // 导入图片库
            this.imageUploadManager.import(questionairJson.mediaLib.imageList, questionairJson.imageUrl);
            // 导入主题
            this.themeBoxManager.import(questionairJson.theme, !isImportVersion);
            // 要用来监视是否显示完毕的某个节点id
            var renderId = "";
            // 最近被添加的节点
            var node = null;
            // 循环所有节点数据
            for (var i = 0; i < questionairJson.nodeList.length; i++) {
                // 一条节点数据
                var nodeJson = questionairJson.nodeList[i];
                if (nodeJson.destList) {
                    // 循环该节点的连接目标
                    for (var j = 0; j < nodeJson.destList.length; j++) {
                        // 将该节点的连接目标暂存在连接目标临时对象纵
                        this.importJson.destList.push(nodeJson.destList[j]);
                    }
                }
                // 检查节点类型
                switch (nodeJson.type) {
                    // 选择题
                    case 1:
                        // 添加选择题
                        node = this.addSelectNode(nodeJson);
                        break;
                        // 打分题
                    case 2:
                        // 添加打分题
                        node = this.addMarkingNode(nodeJson);
                        break;
                        // 排序题
                    case 3:
                        // 添加排序题
                        node = this.addSequencingNode(nodeJson);
                        break;
                        // 填空题
                    case 4:
                        // 添加填空题
                        node = this.addFillblankNode(nodeJson);
                        break;
                        // 矩阵题
                    case 5:
                        // 添加矩阵题
                        node = this.addMatrixNode(nodeJson);
                        break;
                        // 开始节点
                    case 6:
                        // 添加开始节点
                        node = this.addStartNode(nodeJson, null, null, null, this.questionnairName);
                        break;
                        // 逻辑节点
                    case 7:
                        // 添加逻辑节点
                        node = this.addLogicNode(nodeJson);
                        break;
                        // 循环节点
                    case 8:
                        // 添加循环节点
                        node = this.addLoopNode(nodeJson);
                        break;
                        // 甄别节点
                    case 9:
                        // 添加甄别节点
                        node = this.addCheckNode(nodeJson);
                        break;
                        // 结束节点
                    case 10:
                        // 添加结束节点
                        node = this.addEndNode(nodeJson);
                        break;
                        // 备注节点
                    case 11:
                        // 添加备注节点
                        node = this.addCommentNode(nodeJson);
                        break;
                        // 随机节点
                    case 12:
                        // 添加随机节点
                        node = this.addRandomNode(nodeJson);
                        break;
                        // 地域节点
                    case 13:
                        // 添加地域信息节点
                        node = this.addRegionNode(nodeJson);
                        break;
                        // 性别节点
                    case 14:
                        // 添加性别节点
                        node = this.addGenderNode(nodeJson);
                        break;
                        // 年龄节点
                    case 15:
                        // 添加年龄组信息节点
                        node = this.addAgeGroupNode(nodeJson);
                        break;
                        // 婚姻节点
                    case 16:
                        // 添加婚姻状况节点
                        node = this.addMaritalStatusNode(nodeJson);
                        break;
                        // 学历节点
                    case 17:
                        // 添加学历信息节点
                        node = this.addEduStatusNode(nodeJson);
                        break;
                        // 职业节点
                    case 18:
                        // 添加职业信息节点
                        node = this.addOccupationNode(nodeJson);
                        break;
                        // 行业节点
                    case 19:
                        // 添加行业信息节点
                        node = this.addProfessionNode(nodeJson);
                        break;
                        // 职位节点
                    case 20:
                        // 添加职位信息节点
                        node = this.addJobTitleNode(nodeJson);
                        break;
                        // 收入节点
                    case 21:
                        // 添加收入信息节点
                        node = this.addIncomeNode(nodeJson);
                        break;
                        // 家庭收入节点
                    case 22:
                        // 添加家庭收入信息节点
                        node = this.addFamilyIncomeNode(nodeJson);
                        break;
                        // 图片选择节点
                    case 23:
                        node = this.addSelectPicNode(nodeJson);
                        break;
                }
                // 还没有任何监视的id且该节点需要被显示
                if (!renderId && node.visible) {
                    // 监视该节点
                    renderId = node.nodeUuid;
                }
            }
            this.importConnection(this.importJson.destList);
            this.hideLoader(renderId);
        }

        /**
            获取画布变换样式
        */
        this.getChartTransform = function () {
            // 拼接式样
            return "translate(" + (this.transX + this.chartXDiffer) + ","
                + (this.transY + this.chartYDiffer) + ") scale(" + this.chartZoomRate + ")";
        }

        /**
            获取鹰眼变换式样
        */
        this.getEyeTransform = function () {
            // 边框信息
            var borderInfo = this.getBorderInfo();
            // 容器信息
            var containerInfo = this.getContainerInfo();
            // 画布尺寸超出视口尺寸
            if (borderInfo.originHeight > containerInfo.height || borderInfo.originWidth > containerInfo.width) {
                var ratioX = this.eyeXDiffer * 2 / borderInfo.originWidth;
                var ratioY = this.eyeYDiffer * 2 / borderInfo.originHeight;
                this.eyeZoomRate = ratioX < ratioY ? ratioX : ratioY;
                // 画布尺寸未超出视口尺寸
            } else {
                this.eyeZoomRate = 0.15;
            }
            // 吊炸天移动变换
            // 根据偏移的不同程度还要和缩放率一起计算出额外偏移量
            var xDiff = (borderInfo.originLeft + borderInfo.originRight) * this.eyeZoomRate / 2;
            var yDiff = (borderInfo.originTop + borderInfo.originBottom) * this.eyeZoomRate / 2;
            // 拼接式样
            return "translate(" + (this.transX + this.eyeXDiffer - xDiff) + ","
                + (this.transY + this.eyeYDiffer - yDiff) + ") scale(" + this.eyeZoomRate + ")";
        }

        /**
            更新当前节点的位置
            @x X坐标
            @y Y坐标
        */
        this.moveCurrentNode = function (x, y) {
            // 存在当前节点
            if (this.currentNode) {
                // 更新位置
                this.currentNode.x += x / this.chartZoomRate;
                this.currentNode.y += y / this.chartZoomRate;
            }
        }

        /**
            重置
            没有刷新页面而重新导入设计数据之前需要重置
        */
        this.reset = function () {
            this.currentNode = null;
            this.tempConncetion = null;
            this.connections = [];
            this.chartZoomRate = 1;
            this.lastCheckNo = 0;
            this.lastDesignNo = 0;
            this.dirty = false;
            this.saving = false;
            this.mixNodes = [];
            this.startNode = null;
        }

        /**
            反选所有的对象
        */
        this.deselectAll = function () {
            // 循环反选所有节点
            for (var i = 0; i < this.mixNodes.length; i++) {
                // 反选
                this.mixNodes[i].deselect();
            }
            // 反选所有连接
            for (var i = 0; i < this.connections.length; i++) {
                // 反选
                this.connections[i].deselect();
            }
            this.currentNode = null;
        }

        /**
            选中所有的对象
        */
        this.selectAll = function () {
            // 循环反选所有节点
            for (var i = 0; i < this.mixNodes.length; i++) {
                // 反选
                this.mixNodes[i].select();
            }
            // 反选所有连接
            for (var i = 0; i < this.connections.length; i++) {
                // 反选
                this.connections[i].select();
            }
        }

        /**
            添加连接对象
            @connection 要被添加的对象
        */
        this.addConnection = function (connection) {
            // 参数检查
            if (!connection) {
                return;
            }
            // 建立双边关系
            connection.ApplyTwowayRelationship();
            // 加入到连接对象列表
            this.connections.push(connection);
        }

        /**
            删除连接对象
            @connection 要删除的连接对象
            @return null:未删除成功 connection:删除成功
        */
        this.removeConnection = function (connection) {
            // 参数检查
            if (!(connection instanceof ZYDesign.Class.ConnectionModel)) {
                return false;
            }
            for (var i = 0; i < this.connections.length; i++) {
                var conn = this.connections[i];
                // 找到该对象
                if (conn == connection) {
                    // 删除
                    this.connections.splice(i, 1);
                    // 移除双边关系
                    connection.removeTwowayRelationship();
                    // 删除成功标记变化
                    this.markChange(true);
                    return connection;
                }
            }
        }

        /**
            移除选中的对象
            return 被移除的项目
        */
        this.removeSelected = function () {
            var rss;
            // 移除选中的的节点
            var rsn = this.removeSelectedNode();
            // 移除选中的连接
            var rsc = this.removeSelectedConnection();
            // 有被移掉的项目
            if (rsn.nodes.length > 0 || rsc.length > 0) {
                // 整理结果
                rss = {
                    nodes: rsn.nodes,
                    conns: rsn.conns.concat(rsc)
                };
                // 需要注册到操作历史
                recordManager.register({
                    descript: "移除项目",
                    param: {
                        manager: designManager,
                        nodes: rss.nodes,
                        conns: rss.conns
                    },
                    undo: function () {
                        var param = this.param;
                        for (var i = 0; i < param.nodes.length; i++) {
                            var node = param.nodes[i];
                            param.manager.mixNodes.push(node);
                        }
                        for (var i = 0; i < param.conns.length; i++) {
                            var conn = param.conns[i];
                            param.manager.addConnection(conn);
                        }
                    },
                    redo: function () {
                        var param = this.param;
                        for (var i = 0; i < param.nodes.length; i++) {
                            var node = param.nodes[i];
                            param.manager.removeNode(node);
                        }
                        for (var i = 0; i < param.conns.length; i++) {
                            var conn = param.conns[i];
                            param.manager.removeConnection(conn);
                        }
                    }
                })
            }
            return rss;
        }

        /**
            删除被选择的连接
            @return 被删除的数量
        */
        this.removeSelectedConnection = function () {
            var rss = [];
            for (var i = this.connections.length - 1; i >= 0; i--) {
                var connection = this.connections[i];
                // 找到被选择的
                if (connection.isSelected()) {
                    // 删除
                    this.connections.splice(i--, 1);
                    rss.push(connection)
                    // 解除双边关系
                    connection.removeTwowayRelationship();
                    this.markChange(true);
                }
            }
            return rss;
        }
        /**
            删除被选中的节点
            @return 被删除的数量
        */
        this.removeSelectedNode = function () {
            var rsNodes = [],
                rsConns = [];
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                // 找到被选择的且可被删除的
                if (node.isSelected() && !node.removeDisabled) {
                    // 删除该节点
                    this.mixNodes.splice(i--, 1);
                    rsNodes.push(node);
                    // 是当前节点
                    if (this.currentNode == node) {
                        // 当前节点清除
                        this.currentNode = null;
                    }
                    // 移除与该节点相关联的连接
                    var rs = this.removeConnOfNode(node);
                    if (rs) {
                        rsConns = rsConns.concat(rs);
                    }
                    // 搜索列表中也要移除该节点
                    this.searchManager.remove(node);
                    this.markChange(true);
                }
            }
            // 有被删除的节点则校验列表更新
            if (rsNodes.length > 0) {
                this.validateManager.update();
            }
            return {
                nodes: rsNodes,
                conns: rsConns
            };
        }

        /**
            删除当前节点
            @return false:未删除成功 true:删除成功
        */
        this.removeCurrentNode = function () {
            var flag = this.removeNode(this.currentNode);
            if (flag) {
                this.currentNode = null;
            }
            return flag;

        }

        /**
            移除指定节点
            @node 需要被移除的节点
            @return null:未删除成功 obj:删除成功
        */
        this.removeNode = function (node) {
            // 参数检查
            if (!(node instanceof ZYDesign.Class.NodeBase)) {
                return;
            }
            // 该节点不能被移除
            if (node.removeDisabled) {
                return;
            }
            for (var i = 0; i < this.mixNodes.length; i++) {
                var tempNode = this.mixNodes[i];
                // 找到该节点
                if (tempNode == node) {
                    this.mixNodes.splice(i, 1).length;
                    // 移除与该节点相关联的连接
                    var conns = this.removeConnOfNode(node);
                    // 删除成功标记变化
                    this.markChange(true);
                    // 搜索列表中也要移除该节点
                    this.searchManager.remove(node);
                    // 校验列表更新
                    this.validateManager.update();
                    // 返回被移除的节点和连接
                    return {
                        node: node,
                        conns: conns
                    };
                }
            }
        }

        /**
            断开所选节点的所有连接
            @return 断开的数量
        */
        this.breakConnOfSelectedNodes = function () {
            var rss = [];
            // 找到被选则的节点,并断开其连接
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                if (node.isSelected()) {
                    rss = rss.concat(this.removeConnOfNode(node));
                }
            }
            if (rss.length > 0) {
                // 需要注册到操作历史
                recordManager.register({
                    descript: "断开连接",
                    param: {
                        manager: designManager,
                        conns: rss,
                    },
                    undo: function () {
                        var param = this.param;
                        for (var i = 0; i < param.conns.length; i++) {
                            var conn = param.conns[i];
                            param.manager.addConnection(conn);
                        }
                    },
                    redo: function () {
                        var param = this.param;
                        for (var i = 0; i < param.conns.length; i++) {
                            var conn = param.conns[i];
                            param.manager.removeConnection(conn);
                        }
                    }
                });
            }
            return rss;
        }

        /**
            移除某个选项的连接
            @node 节点
            @option 选项
        */
        this.removeConnOfOption = function (node, option) {
            var rss = [];
            // 参数检查
            if (!(node instanceof ZYDesign.Class.NodeBase) ||
                !(option instanceof ZYDesign.Class.OptionConnector) ||
                option.parent != node) {
                return rss;
            }
            // 普通选项
            if (option.belong == "options") {
                // 矩阵题的普通选项不能通过自身移除
                if (node instanceof ZYDesign.Class.MatrixNode) {
                    return rss;
                }
                // 在连接中查找是否该选项有相关连接
                for (var i = 0; i < node.relatedConnections.length; i++) {
                    var connection = node.relatedConnections[i];
                    // 存在连接
                    if (connection.source == option) {
                        // 移除该连接
                        var rs = this.removeConnection(connection);
                        if (rs) {
                            rss.push(rs);
                        }
                    }
                }
                // 纵横选项
            } else {
                // 初始化选项索引为纵选项
                var indexKey = "xIndex";
                // 横选项的场合
                if (option.belong == "optionsY") {
                    // 改为横选项索引
                    indexKey = "yIndex";
                }
                // 寻找和该横选项相关联的连接
                for (var i = 0; i < node.options.length; i++) {
                    var opt = node.options[i];
                    // 和该(纵)横项相关的矩阵选项
                    if (opt[indexKey] == option.index) {
                        // 在连接中查找是否该选项有相关连接
                        for (var j = 0; j < node.relatedConnections.length; j++) {
                            var connection = node.relatedConnections[j];
                            // 存在连接
                            if (connection.source == opt) {
                                // 删除相关连接
                                var rs = this.removeConnection(connection);
                                if (rs) {
                                    rss.push(rs);
                                }
                            }
                        }
                    }
                }
            }
            return rss;
        }

        /**
            断开与节点相关的连接
            @node 节点
            @return 被移除的连接
        */
        this.removeConnOfNode = function (node) {
            // 参数检查
            if (!(node instanceof ZYDesign.Class.NodeBase)) {
                return;
            }
            var conns = [];
            // 和该节点相关的连接对象统统删掉
            for (var i = 0; i < node.relatedConnections.length; i++) {
                // 删掉
                var conn = this.removeConnection(node.relatedConnections[i--]);
                if (conn) {
                    conns.push(conn);
                }
            }
            return conns;
        }

        /**
            移除临时连接对象
        */
        this.removeTempConnection = function () {
            // 数据检查
            if (this.connections.length == 0) {
                return;
            }
            // 获得最后的连接对象
            var lastConnection = this.connections[this.connections.length - 1];
            // 如果是临时连接对象
            if (lastConnection.temp) {
                // 移除
                this.connections.pop();
            }
            // 清除记录
            this.temmpConnection = null;
        }

        /**
            应用临时连接对象,将临时的连接对象转为真正的连接对象
        */
        this.applyTempConnection = function () {
            // 数据检查
            if (this.connections.length == 0) {
                return;
            }
            // 获得最后一个连接对象
            var lastConnection = this.connections[this.connections.length - 1];
            // 变为正式连接对象
            lastConnection.temp = false;
            // 建立双边关系
            lastConnection.ApplyTwowayRelationship();
            // 清除记录
            this.temmpConnection = null;
            return lastConnection;
        }

        /**
            获取连接许可
            @Source 目标连接点
            @Dest 源连接点
        */
        this.getConnectPermition = function (source, dest) {

            // 初始化连接许可
            var permition = {
                allowConnect: true,
                message: Prompt.QSNRD_ConnPermit, // Prompt.QSNRD_ConnPermit
            }

            // 起点和端点是同一个连接点
            if (source == dest) {
                permition.message = Prompt.QSNRD_ConnForbidToSelf; // Prompt.QSNRD_ConnForbidToSelf
                permition.allowConnect = false;
                return permition;
            }

            // 起点和端点在同一个节点内
            if (source.parent == dest.parent) {
                permition.message = Prompt.QSNRD_ConnForbidSameParent; // Prompt.QSNRD_ConnForbidSameParent
                permition.allowConnect = false;
                return permition;
            }

            // 两个连接点类型相同
            if (source.type == dest.type) {
                permition.message = Prompt.QSNRD_ConnForbidSameType; // Prompt.QSNRD_ConnForbidSameType
                permition.allowConnect = false;
                return permition;
            }

            // 该起点已经有既存的输出
            if (source.dest != null) {
                permition.message = Prompt.QSNRD_ConnForbidMultiOutput;  // Prompt.QSNRD_ConnForbidMultiOutput
                permition.allowConnect = false;
                return permition;
            }
            // 甄别节点和设计节点之间连接时,只允许甄别节点输出到设计节点,
            // 其他连接方式一律不允许
            if ((source.parent.mode == 0 && dest.parent.mode == 1) || // 从设计输出到甄别不允许
                    (dest.parent.mode == 0 && source.parent.mode == 1 && dest.exactType != ZYDesign.Enum.CONNEXACTTYPE.INPUTBASE)) {  // 从甄别输入到设计但目标不是输入口
                permition.message = "甄别节点只能处于设计节点前面"
                permition.allowConnect = false;
                return permition;
            }
            // 起点是随机开始输出口
            // 且之前已经指向该目标
            if (source.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART &&
                source.containDest(dest)) {
                permition.message = Prompt.QSNRD_ConnForbidAlreadyExist; // Prompt.QSNRD_ConnForbidAlreadyExist
                permition.allowConnect = false;
                return permition;
            }

            // 目标节点是自己的祖先节点
            if (this.isTryToOutputToAncestor(source, dest)) {
                permition.message = Prompt.QSNRD_ConnForbidBack; // Prompt.QSNRD_ConnForbidBack
                permition.allowConnect = false;
                return permition;

            }

            // 源头是随机开始或循环开始端口而且目标端口已经存在来源
            if ((source.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART ||
                source.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART) &&
                dest.sources.length > 0) {
                permition.message = Prompt.QSNRD_ConnForbidNoTool; // Prompt.QSNRD_ConnForbidNoTool
                permition.allowConnect = false;
                return permition;
            }
            // 该节点已经接受随机开始或循环开始
            if (dest.sources.length > 0 &&
                (dest.sources[0].exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART ||
                dest.sources[0].exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART)) {
                permition.message = Prompt.QSNRD_ConnForbidNoInput;  // Prompt.QSNRD_ConnForbidNoInput
                permition.allowConnect = false;
                return permition;
            }

            // 试图把非题目节点或包含非题目节点的节点群加到随机组中
            if ((source.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART ||
                 source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM) &&
                (dest.parent.commonType != ZYDesign.Enum.NODECOMMONTYPE.SUBJECT ||
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.FREEWITHTOOL)) {
                permition.message = Prompt.QSNRD_ConnForbidOnlySubjectAdd; // Prompt.QSNRD_ConnForbidOnlySubjectAdd
                permition.allowConnect = false;
                return permition;
            }
            // 试图从包含非题目节点的节点群输出都随机组节点
            if ((source.parent.commonType != ZYDesign.Enum.NODECOMMONTYPE.SUBJECT ||
                source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.FREEWITHTOOL) &&
                (dest.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART ||
                 dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM)) {
                permition.message = Prompt.QSNRD_ConnForbidOnlySubjectOutput; // Prompt.QSNRD_ConnForbidOnlySubjectOutput
                permition.allowConnect = false;
                return permition;
            }

            // 不同随机组之间的节点试图连接在一起
            if (source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM &&
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM &&
                !source.parent.hasRouteTo(dest.parent)) {
                permition.message = Prompt.QSNRD_ConnForbidCrossRandomGroup; // Prompt.QSNRD_ConnForbidCrossRandomGroup
                permition.allowConnect = false;
                return permition;
            }

            //试图连接随机组的节点和普通通路节点
            if ((source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.NORMAL &&
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM) ||
                (source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM &&
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.NORMAL)) {
                permition.message = Prompt.QSNRD_ConnForbidNormalToRandom; // Prompt.QSNRD_ConnForbidNormalToRandom
                permition.allowConnect = false;
                return permition;
            }

            //试图连接循环圈的节点和普通通路节点
            if ((source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.NORMAL &&
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP) ||
                (source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP &&
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.NORMAL)) {
                // 而且不是通过循环开始,循环结束进行连接
                if (source.exactType != ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART &&
                    dest.exactType != ZYDesign.Enum.CONNEXACTTYPE.LOOPEND) {
                    permition.message = Prompt.QSNRD_ConnForbidNormalToLoop;// Prompt.QSNRD_ConnForbidNormalToLoop
                    permition.allowConnect = false;
                    return permition;
                }

            }

            // 试图连接循环圈的节点和随机组节点
            if ((source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM &&
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP) ||
                (source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP &&
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM)) {
                permition.message = Prompt.QSNRD_ConnForbidLoopToRandom; // Prompt.QSNRD_ConnForbidLoopToRandom
                permition.allowConnect = false;
                return permition;
            }

            // 试图让普通状态节点或循环圈状态节点接受随机开始
            if (source.exactType == ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART &&
                (dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP ||
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.NORMAL
                )) {
                permition.message = Prompt.QSNRD_ConnForbidNoRandomStart; // Prompt.QSNRD_ConnForbidNoRandomStart
                permition.allowConnect = false;
                return permition;
            }

            // 试图让普通状态节点或随机组状态节点接受循环开始
            if (source.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART &&
                (dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM ||
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.NORMAL
                )) {
                permition.message = Prompt.QSNRD_ConnForbidNoLoopStart; // Prompt.QSNRD_ConnForbidNoLoopStart
                permition.allowConnect = false;
                return permition;
            }

            // 试图让普通状态节点或随机组状态节点接入循环结束
            if (dest.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPEND &&
                (source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.RANDOM ||
                source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.NORMAL
                )) {
                permition.message = Prompt.QSNRD_ConnForbidNoLoopEnd;// Prompt.QSNRD_ConnForbidNoLoopEnd
                permition.allowConnect = false;
                return permition;
            }

            //试图将终端节点接受循环开始或循环结束
            if ((source.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART &&
                dest.parent.commonType == ZYDesign.Enum.NODECOMMONTYPE.TERMINAL) ||
                (dest.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPEND &&
                source.parent.commonType == ZYDesign.Enum.NODECOMMONTYPE.TERMINAL)) {
                permition.message = Prompt.QSNRD_ConnForbidNoTerminal; // Prompt.QSNRD_ConnForbidNoTerminal
                permition.allowConnect = false;
                return permition;
            }

            ///**
            //    目标是循环节点且已有多选选择题题接入
            //*/
            //if (dest.parent.type == ZYDesign.Enum.NODETYPE.LOOP &&
            //    dest.sources.length > 0 &&
            //    dest.sources[0].parent.type == ZYDesign.Enum.NODETYPE.SELECT &&
            //    !dest.sources[0].parent.isSingleSelect() &&
            //    dest.exactType != ZYDesign.Enum.CONNEXACTTYPE.LOOPEND) {
            //    permition.message = Prompt.QSNRD_ConnForbidOnlyMultiToLoop;  // Prompt.QSNRD_ConnForbidOnlyMultiToLoop
            //    permition.allowConnect = false;
            //    return permition;
            //}

            //// 试图将多选选择题接入到已有输入的循环节点(循环结束输入口不受限制)
            //if (source.parent.type == ZYDesign.Enum.NODETYPE.SELECT &&
            //    !source.parent.isSingleSelect() &&
            //    dest.parent.type == ZYDesign.Enum.NODETYPE.LOOP &&
            //    dest.exactType != ZYDesign.Enum.CONNEXACTTYPE.LOOPEND &&
            //    dest.sources.length > 0) {
            //    permition.message = Prompt.QSNRD_ConnForbidNoMultiToLoop; // Prompt.QSNRD_ConnForbidNoMultiToLoop
            //    permition.allowConnect = false;
            //    return permition;
            //}

            // 循环圈或随机组的节点试图外连
            if (dest.parent.hasRouteTo(source.parent.getEngageDueToNode()) &&
                dest.exactType != ZYDesign.Enum.CONNEXACTTYPE.LOOPEND) {
                permition.message = Prompt.QSNRD_ConnForbidToolToOut; // Prompt.QSNRD_ConnForbidToolToOut
                permition.allowConnect = false;
                return permition;
            }

            // 外路节点试图连接到循环圈或随机组
            if (source.parent.hasRouteTo(dest.parent.getEngageDueToNode()) &&
                source.exactType != ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART &&
                source.exactType != ZYDesign.Enum.CONNEXACTTYPE.RANDOMSTART) {
                permition.message = Prompt.QSNRD_ConnForbidOutToTool; // Prompt.QSNRD_ConnForbidOutToTool
                permition.allowConnect = false;
                return permition;
            }

            // 不同循环圈的节点试图连接到一起
            if (source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP &&
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP &&
                source.parent.getEngageDueToNode() != dest.parent.getEngageDueToNode() &&
                dest.parent != source.parent.getEngageDueToNode() &&
                source.parent != dest.parent.getEngageDueToNode()) {
                permition.message = Prompt.QSNRD_ConnForbidCrossLoop; // Prompt.QSNRD_ConnForbidCrossLoop
                permition.allowConnect = false;
                return permition;
            }

            // 已属于某个循环圈的节点不能接受另外的循环开始
            if (source.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPSTART &&
                dest.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP &&
                dest.parent.getEngageDueToNode() != source.parent) {
                permition.message = Prompt.QSNRD_ConnForbidCrossLoopStart; // Prompt.QSNRD_ConnForbidCrossLoopStart
                permition.allowConnect = false;
                return permition;
            }

            // 已属于某个循环圈的节点不能接到另外的循环结束
            if (dest.exactType == ZYDesign.Enum.CONNEXACTTYPE.LOOPEND &&
                source.parent.getEngageStatus() == ZYDesign.Enum.NODESTATE.LOOP &&
                source.parent.getEngageDueToNode() != dest.parent) {
                permition.message = Prompt.QSNRD_ConnForbidCrossLoopEnd; // Prompt.QSNRD_ConnForbidCrossLoopEnd
                permition.allowConnect = false;
                return permition;
            }

            return permition;
        }

        /**
            创建一个连接对象
            @sourceConnector 源连接点
            @destConnector 目标连接点
            @temp 是否是临时连接对象
        */
        this.createConnection = function (sourceConnector, destConnector, temp) {
            if (!sourceConnector || !destConnector) {
                return;
            }
            // 初始化连接对象
            var connection = new ZYDesign.Class.ConnectionModel();
            // 记录源连接点
            connection.source = sourceConnector;
            // 记录目标连接点
            connection.dest = destConnector;
            // 临时标志
            connection.temp = temp;
            return connection;
        }

        /**
            判断是否尝试输出到祖先节点
            @source 源连接点
            @dest 目标连接点
        */
        this.isTryToOutputToAncestor = function (source, dest) {
            // 判断输出目标是不是祖先节点
            return this.isAncestor(source, dest);
        }

        /**
            判断输入点是否属于输出点的祖先节点
            @output 源输出口
            @input 目标输入口
        */
        this.isAncestor = function (output, input) {
            // 源节点没有输入口
            if (!output.parent.input) {
                return false;
            }
            // 输出点所在的节点的输入点的源列表
            var nodeSources = output.parent.input.sources;
            // 上一次测试过的节点
            var previousInputTested = null;
            // 循环输入点源列表
            for (var i = 0; i < nodeSources.length; i++) {
                // 其中一个源(即前一个节点的输出点)
                var previousOutput = nodeSources[i]
                // 得到前一个节点的输入点
                var previousInput = previousOutput.parent.input;
                // 上次已检测该节点
                if (previousInput == previousInputTested) {
                    continue;
                }
                // 标记为前一次测试过的节点可一定程度防止重复测试同一节点,节约时间.
                previousInputTested = previousInput;

                // 两个输入点相同
                if (previousInput == input) {
                    return true;
                }
                    // 不相同则递归查找更先前的节点
                else if (this.isAncestor(previousOutput, input)) {
                    return true;
                }
            }
            return false;
        }

        /**
            复制节点
            @node 节点
            @diffX 副本位置与节点位置X偏移量
            @diffY 副本位置与节点位置Y偏移量
            @noSingleSelect 被复制的节点是否不能被单选
            @return false:节点未复制成功 obj:节点复制成功
        */
        this.copyNode = function (node, diffX, diffY, noSingleSelect) {
            // 未指定偏移量时,不偏移
            diffX = (diffX || 30);
            diffY = (diffY || 30);
            // 参数检查
            if (!(node instanceof ZYDesign.Class.NodeBase)) {
                return false;
            }
            // 不允许复制的
            if (node.copyDisabled) {
                return false
            }
            var nodeJson = {};
            // 不允许单选
            if (noSingleSelect) {
                nodeJson.noSingleSelect = noSingleSelect;
            }
            // 复制数据
            node.cloneNodeJson(nodeJson, diffX, diffY);
            // 没有值或非法值
            if (!nodeJson || !nodeJson.addFnKey) {
                return false;
            }
            // 添加复制节点
            var rs = this[nodeJson.addFnKey](nodeJson);
            // 复制成功,标记变化;
            this.markChange(true);
            return {
                originNode: node,
                copy: rs
            };
        }

        /**
            添加虚拟节点
        */
        this.addVitualNodes = function () {
            // 第一个虚拟节点站位在左上角
            var vitualStart = new ZYDesign.Class.VitualNode();
            vitualStart.x = 0;
            vitualStart.y = 0;
            this.vitualNodes.push(vitualStart);
            // 第二个虚拟节点站位在右下角
            var vitualEnd = new ZYDesign.Class.VitualNode();
            vitualEnd.x = this.chartXDiffer * 2;
            vitualEnd.y = this.chartYDiffer * 2;
            this.vitualNodes.push(vitualEnd);
        }

        /**
            新加节点需特殊处理
            @node 节点
            @select 是否需要选择
        */
        this.handleNewNode = function (node, select) {
            this.mixNodes.push(node);
            // 是新加节点
            if (node.originData.isInit) {
                // 不能单选,则选择该节点
                if (node.originData.noSingleSelect) {
                    node.select();
                    delete node.originData.noSingleSelect;
                    // 可以单选则单选该节点
                } else {
                    this.selectNodeSingle(node);
                }
                // 新添加的甄别节点
                if (node.mode == 1) {
                    node.sortNo = ++this.lastCheckNo;
                    node.nodeName = "S" + node.sortNo;
                    // 新添加的设计题目节点
                } else if (node.mode == 0 && node.isSubject()) {
                    node.sortNo = ++this.lastDesignNo;
                    node.nodeName = "Q" + node.sortNo;
                }
                // 不是新加节点
            } else {
                node.sortNo = node.originData.sortNo;
                // 甄别节点
                if (node.mode == 1 && this.lastCheckNo < node.sortNo) {
                    this.lastCheckNo = node.sortNo;
                    // 设计题目节点
                } else if (node.mode == 0 && node.isSubject() && this.lastDesignNo < node.sortNo) {
                    this.lastDesignNo = node.sortNo;
                }
            }
            node.checkVisible();
        }


        /**
            导入连接对象
            @destList 连接对象数据列表
        */
        this.importConnection = function (destList) {
            // 循环连接对象数据列表
            for (var i = 0; i < destList.length; i++) {
                // 一个连接对象数据
                var destConn = destList[i];
                // 获取源连接点
                var sourceConnector = this.searchConnectorById(destConn.selfPortId);
                // 获取目标连接点
                var destConnector = this.searchConnectorById(destConn.destInputId);
                // 生成连接对象
                var connection = this.createConnection(sourceConnector, destConnector, false);
                // 添加连接对象
                this.addConnection(connection);
                connection.checkVisible();
            }
        }
        /**
            根据连接点Id获取连接点
            @connectorId 连接点Id
        */
        this.searchConnectorById = function (connectorId) {
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                // 从节点中寻找
                var connector = node.searchConnectorById(connectorId);
                // 找到了
                if (connector) {
                    return connector;
                }
            }
            return null;
        }

        /**
            显示全部
        */
        this.showAll = function () {
            // 显示全部的时候可能出现加载大量页面元素造成延迟
            // 需要显示加载图标
            this.showLoader();
            var that = this;
            // 由于开始执行任务时造成js单线程满占用
            // 导致空不出时间来描绘加载图标
            // 所以需要稍微掩饰执行任务
            setTimeout(function () {
                that.showAllDo();
                that.digest();
            });

            // 需要注册到操作历史
            recordManager.register({
                descript: "显示全部",
                param: {
                    manager: designManager,
                },
                undo: function () {
                    this.param.manager.showAll();
                },
                redo: function () {
                    this.param.manager.showAll();
                },
            })
        }

        /**
            显示全部
        */
        this.showAllDo = function () {
            var selfFn = arguments.callee;
            // 还原
            if (selfFn.done) {
                this.chartZoomRate = selfFn.oldZoomRate;
                this.moveNodes(selfFn.deltaX * this.chartZoomRate, selfFn.deltaY * this.chartZoomRate);
                selfFn.done = false;
                // 控制文字显示
                this.controlText();
                // 显示全部
            } else {
                selfFn.oldZoomRate = this.chartZoomRate;
                var oldX = this.startNode.x,
                    oldY = this.startNode.y;
                // 图像区域的信息
                var borderInfo = this.getBorderInfo();
                // 容器信息
                var containInfo = this.getContainerInfo();
                // 是否尝放大
                var tryZoomin = false

                // 图像区域比容器小且已全部显示
                if (borderInfo.nodesWidth <= containInfo.width &&
                    borderInfo.nodesHeight <= containInfo.height) {
                    // 已全部显示
                    if (borderInfo.nodesLeft >= containInfo.left &&
                        borderInfo.nodesTop >= containInfo.top &&
                        borderInfo.nodesRight <= containInfo.right &&
                        borderInfo.nodesBottom <= containInfo.bottom) {
                        // 缩放率大于等于1
                        if (this.chartZoomRate >= 1) {
                            // 不做任何处理
                            return;
                            // 缩放率不足1
                        } else {
                            // 尝试放大
                            tryZoomin = true;
                        }
                        // 未全部显示
                    } else {
                        // 尝试放大
                        tryZoomin = true;
                    }
                }
                // 默认缩放率
                var chartZoomRateX = 1;
                var chartZoomRateY = 1;
                // 缩放率是否发生变化
                var rateChanged = false;
                // 宽度过大
                if (borderInfo.nodesWidth > containInfo.width || tryZoomin) {
                    chartZoomRateX = containInfo.width / borderInfo.nodesWidth;
                    rateChanged = true;
                }

                // 高度过大
                if (borderInfo.nodesHeight > containInfo.height || tryZoomin) {
                    chartZoomRateY = containInfo.height / borderInfo.nodesHeight;
                    rateChanged = true;
                }
                this.chartZoomRate = (chartZoomRateX < chartZoomRateY) ?
                    chartZoomRateX * this.chartZoomRate :
                    chartZoomRateY * this.chartZoomRate;

                // 尝试放大的时候,最大不允许超过1
                if (tryZoomin && this.chartZoomRate > 1) {
                    this.chartZoomRate = 1;
                }

                // 缩放比率发生过变化
                if (rateChanged) {
                    // 重新获取边界
                    borderInfo = this.getBorderInfo();
                }

                // X偏移量
                var deltaX = this.chartXDiffer + borderInfo.nodesLeft - 6;
                // Y偏移量
                var deltaY = this.chartYDiffer + borderInfo.nodesTop - 24;
                // 移动位置
                this.moveNodes(-deltaX, -deltaY);
                // 控制文字显示
                this.controlText();
                // 重新检查节点和连接可见性
                var listenId = this.checkVisibleOfNodesAndConns();
                // 待元素加载完隐藏加载图标
                this.hideLoader(listenId);
                var newX = this.startNode.x,
                    newY = this.startNode.y;
                selfFn.deltaX = oldX - newX;
                selfFn.deltaY = oldY - newY;
                selfFn.done = true;
            }
        }

        /**
            获取整个画布容器信息
        */
        this.getContainerInfo = function () {
            // 容器信息
            this.containerInfo.width = this.chartXDiffer * 2;
            this.containerInfo.height = this.chartYDiffer * 2;
            this.containerInfo.centerX = 0;
            this.containerInfo.centerY = 0;
            if (this.containerInfo.width <= 0 || this.containerInfo.height <= 0) {
                this.containerInfo.width = 0;
                this.containerInfo.height = 0;

            }
            this.containerInfo.left = -this.containerInfo.width / 2;
            this.containerInfo.top = -this.containerInfo.height / 2;
            this.containerInfo.right = this.containerInfo.width / 2;
            this.containerInfo.bottom = this.containerInfo.height / 2;
            return this.containerInfo;
        }

        /**
            获取图像区域尺寸边框信息
        */
        this.getBorderInfo = function () {

            // 所有属性重置
            for (var key in this.borderInfo) {
                this.borderInfo[key] = 0;
            }
            // 是否第一次调整
            var firstFlag = true;
            // 节点列表
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                // 根据该节点来调整边框
                this.adjustBorderInfoByNode(this.borderInfo, node, firstFlag);
                firstFlag = false;
            }
            // 虚拟节点
            for (var i = 0; i < this.vitualNodes.length; i++) {
                var node = this.vitualNodes[i];
                this.adjustBorderInfoByNode(this.borderInfo, node, false);
            }

            // 计算尺寸
            this.borderInfo.width = this.borderInfo.right - this.borderInfo.left;
            this.borderInfo.height = this.borderInfo.bottom - this.borderInfo.top;
            this.borderInfo.originWidth = this.borderInfo.originRight - this.borderInfo.originLeft;
            this.borderInfo.originHeight = this.borderInfo.originBottom - this.borderInfo.originTop;
            this.borderInfo.nodesWidth = this.borderInfo.nodesRight - this.borderInfo.nodesLeft;
            this.borderInfo.nodesHeight = this.borderInfo.nodesBottom - this.borderInfo.nodesTop;
            // 画布真实位置及尺寸
            this.top = this.borderInfo.originTop;
            this.left = this.borderInfo.originLeft;
            this.width = this.borderInfo.originWidth;
            this.height = this.borderInfo.originHeight;

            // 图像显示区容器信息
            var containerInfo = this.getContainerInfo();
            // 鹰眼位置及尺寸
            this.viewTop = containerInfo.top / this.chartZoomRate;
            this.viewLeft = containerInfo.left / this.chartZoomRate;
            this.viewHeight = containerInfo.height / this.chartZoomRate;
            this.viewWidth = containerInfo.width / this.chartZoomRate;
            return this.borderInfo;
        }

        /**
            根据某个节点来调整整个图像区域的边框数据
            @borderInfo 边框信息
            @node 节点
            @firstFlag 是否为第一个节点
        */
        this.adjustBorderInfoByNode = function (borderInfo, node, firstFlag) {
            // 节点的左边比现在边框的左边还小
            if (borderInfo.left > (node.getX() * this.chartZoomRate) || firstFlag) {
                // 调整为节点的左边
                borderInfo.left = node.getX() * this.chartZoomRate;
                borderInfo.originLeft = node.getX();
                // 虚拟节点不用来计算节点区域
                if (!node.isVitual) {
                    borderInfo.nodesLeft = borderInfo.left;
                }
            }
            // 节点的上边比边框的上边还小
            if (borderInfo.top > (node.getY() * this.chartZoomRate) || firstFlag) {
                // 调整为节点的上边
                borderInfo.top = node.getY() * this.chartZoomRate;
                borderInfo.originTop = node.getY();
                // 虚拟节点不用来计算节点区域
                if (!node.isVitual) {
                    borderInfo.nodesTop = borderInfo.top;
                }
            }
            // 右边稍微多加一些距离使得显示全部的时候看起来更明显
            var right = node.getRight() + 16;
            // 节点的右边比边框的右边还大
            if (borderInfo.right < (right * this.chartZoomRate) || firstFlag) {
                // 调整为节点的右边
                borderInfo.right = right * this.chartZoomRate;
                borderInfo.originRight = right;
                // 虚拟节点不用来计算节点区域
                if (!node.isVitual) {
                    borderInfo.nodesRight = borderInfo.right;
                }
            }
            // 下边稍微多加一些距离使得显示全部的时候看起来更明显
            var bottom = node.getBottom() + 34;
            // 节点的底部比边框的底部还大
            if (borderInfo.bottom < (bottom * this.chartZoomRate) || firstFlag) {
                // 调整为节点的底部
                borderInfo.bottom = bottom * this.chartZoomRate;
                borderInfo.originBottom = bottom;
                // 虚拟节点不用来计算节点区域
                if (!node.isVitual) {
                    borderInfo.nodesBottom = borderInfo.bottom;
                }
            }
        }

        /**
            单选一个节点
            @node 节点
        */
        this.selectNodeSingle = function (node) {
            // 反选所有
            this.deselectAll();
            // 选中当前
            node.select();
            // 将该节点设置为当前节点
            this.currentNode = node;
            // 置顶
            this.takeToTop(node);
            // 处理选项文本框高度适应
            setTimeout(function () {
                $(".option_editor_input").each(function () {
                    $(this).css("height", this.scrollHeight);
                });
                if (!ZYDesign.Config.developMode) {
                    if (designManager.currentNode.isTypeIn("MARK,SELECTPIC")) {
                        $(".editor_developing").addClass("image_type_disabled");
                    }
                }
            })

        }

        /**
            添加选择题节点
            @nodeJson 节点的Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addSelectNode = function (nodeJson, mode, x, y) {
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.selectNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.SelectNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 有指定的模式
            if (mode == 1) {
                node.mode = mode;
            }
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加图片选择题节点
            @nodeJson 节点的Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addSelectPicNode = function (nodeJson, mode, x, y) {
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.selectPicNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.SelectPicNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }



        /**
            添加打分题节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addMarkingNode = function (nodeJson, mode, x, y) {
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.markingNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.MarkingNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 有指定的模式
            if (mode == 1) {
                node.mode = mode;
            }
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加排序题节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addSequencingNode = function (nodeJson, mode, x, y) {
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.sequencingNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.SequencingNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 有指定的模式
            if (mode == 1) {
                node.mode = mode;
            }
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
           添加填空题节点
           @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addFillblankNode = function (nodeJson, mode, x, y) {
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.fillblankNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.FillblankNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加矩阵题节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addMatrixNode = function (nodeJson, mode, x, y) {
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.matrixNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.MatrixNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加逻辑节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addLogicNode = function (nodeJson, mode, x, y) {
            if (!this.addLogicNode.lastSortNo) {
                this.addLogicNode.lastSortNo = 0;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.logicNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.LogicNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            // 新加节点
            if (node.originData.isInit) {
                node.sortNo = ++this.addLogicNode.lastSortNo;
                node.nodeName = "Logic" + node.sortNo;
                // 非新加节点
            } else {
                node.sortNo = node.originData.sortNo;
                if (this.addLogicNode.lastSortNo < node.sortNo) {
                    this.addLogicNode.lastSortNo = node.sortNo;
                }
            }
            return node;
        }

        /**
            初始化逻辑节点的条件关联题目信息
            @logicNode 逻辑节点
        */
        this.initLogicNodeSubject = function (logicNode) {
            // 逻辑选项循环
            for (var i = 0; i < logicNode.options.length; i++) {
                // 一个逻辑选项
                var logic = logicNode.options[i];
                // 条件循环
                for (var j = 0; j < logic.requires.length; j++) {
                    // 一个条件
                    var require = logic.requires[j]
                    // 条件相关的题目
                    require.relatedSubject = this.searchSubjectById(require.subjectId);
                }
            }
        }

        /**
            根据指定ID寻找题目节点
            @id 指定ID
        */
        this.searchSubjectById = function (id) {
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                // 找到了该节点
                if (node.nodeUuid == id) {
                    return node;
                }
            }
            return null;
        }

        /**
            添加循环节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addLoopNode = function (nodeJson, mode, x, y) {
            if (!this.addLoopNode.lastSortNo) {
                this.addLoopNode.lastSortNo = 0;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.loopNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.LoopNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            // 新加节点
            if (node.originData.isInit) {
                node.sortNo = ++this.addLoopNode.lastSortNo;
                node.nodeName = "Loop" + node.sortNo;
                // 非新加节点
            } else {
                node.sortNo = node.originData.sortNo;
                if (this.addLoopNode.lastSortNo < node.sortNo) {
                    this.addLoopNode.lastSortNo = node.sortNo;
                }
            }
            return node;
        }

        /**
           添加随机节点
           @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addRandomNode = function (nodeJson, mode, x, y) {
            if (!this.addRandomNode.lastSortNo) {
                this.addRandomNode.lastSortNo = 0;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.randomNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.RandomNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            // 新加节点
            if (node.originData.isInit) {
                node.sortNo = ++this.addRandomNode.lastSortNo;
                node.nodeName = "Random" + node.sortNo;
                // 非新加节点
            } else {
                node.sortNo = node.originData.sortNo;
                if (this.addRandomNode.lastSortNo < node.sortNo) {
                    this.addRandomNode.lastSortNo = node.sortNo;
                }
            }
            return node;
        }

        /**
           添加甄别节点
           @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addCheckNode = function (nodeJson, mode, x, y) {
            return;
            // 已经有甄别节点
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.CHECK)) {
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.checkNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.CheckNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
           添加结束节点
           @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addEndNode = function (nodeJson, mode, x, y) {
            if (!this.addEndNode.lastSortNo) {
                this.addEndNode.lastSortNo = 0;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.endNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.EndNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            // 新加节点
            if (node.originData.isInit) {
                node.sortNo = ++this.addEndNode.lastSortNo;
                node.nodeName = "End" + node.sortNo;
                // 非新加节点
            } else {
                node.sortNo = node.originData.sortNo;
                if (this.addEndNode.lastSortNo < node.sortNo) {
                    this.addEndNode.lastSortNo = node.sortNo;
                }
            }
            return node;
        }

        /**
           添加注释节点
           @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addCommentNode = function (nodeJson, mode, x, y) {
            if (!this.addCommentNode.lastSortNo) {
                this.addCommentNode.lastSortNo = 0;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.commentNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.CommentNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            // 新加节点
            if (node.originData.isInit) {
                node.sortNo = ++this.addCommentNode.lastSortNo;
                node.nodeName = "End" + node.sortNo;
                // 非新加节点
            } else {
                node.sortNo = node.originData.sortNo;
                if (this.addCommentNode.lastSortNo < node.sortNo) {
                    this.addCommentNode.lastSortNo = node.sortNo;
                }
            }
            return node;
        }

        /**
            添加开始节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
            @nodeName 指定的节点名
        */
        this.addStartNode = function (nodeJson, mode, x, y, nodeName) {
            // 当前已经有开始节点
            if (this.startNode) {
                return;
            }
            // 没有传入数据则使用初始节点数据
            var nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.startNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.StartNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 有指定的节点名
            if (nodeName) {
                node.nodeName = nodeName;
            }
            // 记录开始节点
            this.startNode = node;
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加地域信息节点
             @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addRegionNode = function (nodeJson, mode, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.REGION)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.regionNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.RegionNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
           添加性别信息节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addGenderNode = function (nodeJson, mode, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.GENDER)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.genderNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.GenderNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
          添加年龄信息节点
          @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addAgeGroupNode = function (nodeJson, mode, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.AGEGROUP)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.ageGroupNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.AgeGroupNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
          添加婚姻状况信息节点
          @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addMaritalStatusNode = function (nodeJson, mode, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.MARITALSTATUS)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.maritalStatusNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.MaritalStatusNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加学历信息节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addEduStatusNode = function (nodeJson, mode, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.EDUSTATUS)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.eduStatusNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.EduStatusNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加职业信息节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addOccupationNode = function (nodeJson, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.OCCUPATION)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.occupationNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.OccupationNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加行业信息节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addProfessionNode = function (nodeJson, mode, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.PROFESSION)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.professionNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.ProfessionNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加衔头信息节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addJobTitleNode = function (nodeJson, mode, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.JOBTITLE)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.jobTitleNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.JobTitleNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加收入信息节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addIncomeNode = function (nodeJson, mode, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.INCOME)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.incomeNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.IncomeNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            添加家庭收入信息节点
            @nodeJson 节点Json数据
            @x 指定的坐标X
            @y 指定的坐标Y
        */
        this.addFamilyIncomeNode = function (nodeJson, mode, x, y) {
            // 该类节点只允许一个
            if (this.hasNodesByType(ZYDesign.Enum.NODETYPE.FAMILYINCOME)) {
                hinter.hint(Prompt.QSNRD_OnlyOneSuchNode); // Prompt.QSNRD_OnlyOneSuchNode
                return;
            }
            // 没有传入数据则使用初始节点数据
            var nodeJson = nodeJson ? nodeJson : ZYDesign.Initial.familyIncomeNodeJson;
            // 生成一个节点实例
            var node = new ZYDesign.Class.FamilyIncomeNode();
            // 初始化节点
            node.init(nodeJson, x, y);
            // 处理新加节点
            this.handleNewNode(node);
            return node;
        }

        /**
            获取某个类型的节点群
        */
        this.getNodesByType = function (type) {
            // 初始化列表
            var nodes = [];
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                // 找到属于该类的节点
                if (node.isTypeOf(type)) {
                    // 推入列表
                    nodes.push(node);
                }
            }
            return nodes;
        }

        /**
            获取是否包含某类节点
        */
        this.hasNodesByType = function (type) {
            for (var i = 0; i < this.mixNodes.length; i++) {
                // 找到了属于该类的节点
                if (this.mixNodes[i].isTypeOf(type)) {
                    return true;
                }
            }
            return false;
        }

        /**
            将问卷内容导出为Json数据
            @dataHolder 数据储存对象
            @hasError 设计是否有错误
            @tested 是否经过测试
        */
        this.exportJson = function (dataHolder, hasError, tested) {
            // 没有错误
            if (hasError == "N") {
                // 为节点生成顺序
                this.generateNodeOrder();
            }
            var mediaLib = this.imageUploadManager.export()
            // 文本方式数据存储对象
            dataHolder.textHolder = {
                questionnairUuid: this.questionnairUuid,  // 问卷id
                qNumber: this.qNumber,                    // 问卷编号
                nodeText: null,                           // 转化为字符串后的节点列表数据
                errorInclude: hasError,                   // 是否包含错误
                tested: tested,                           // 是否经过测试
                nodeCount: 0,                             // 节点数
                MediaLibrary: JSON.stringify({            // 媒体库
                    imageList: mediaLib.list
                }),
                cutList: mediaLib.cutList,
                StartNode: {
                    IsSave: false
                },
                theme: this.themeBoxManager.export()
            };
            // 开始节点发生了变化
            if (this.startNode.dirty) {
                dataHolder.textHolder.StartNode = {
                    IsSave: true,
                    Title: this.startNode.nodeName,
                    Descript: this.startNode.question.originText,
                    MediaID: this.startNode.image ? this.startNode.image.id : "",
                }
            }
            // 字段方式数据存储对象
            dataHolder.fieldHolder = [];
            // 节点数据列表
            var nodeList = [];
            // 收集数据
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                // 备注节点不计数
                if (node.type != ZYDesign.Enum.NODETYPE.COMMENT) {
                    // 题目计数
                    dataHolder.textHolder.nodeCount++;
                }
                // 节点Json数据存储对象初始化
                var nodeJson = {};
                // 将该节点导出为json数据
                node.exportJson(this.questionnairUuid, nodeJson);
                // 添加到数据列表
                nodeList.push(nodeJson);
                // 推入字段方式节点列表
                dataHolder.fieldHolder.push(nodeJson);
            }
            // 节点列表json数据字符串化
            dataHolder.textHolder.nodeText = JSON.stringify(nodeList);
        }

        /**
            保存问卷数据
            @tested 是否经过测试
            @success 成功回调函数
            @hasError 设计是否有错误
            @isAuto 是否是自动保存
            @verName 版本名称
            @error 失败回调函数
        */
        this.save = function (tested, success, hasError, isAuto, verName, error) {
            // 不可更改状态
            if (!this.isAllowSave()) {
                return;
            }
            // 没有联网
            if (!this.getOnline()) {
                return;
            }
            // 没有新的修改且是自动保存(手动备份是无论有没有修改都会进行备份)
            if (!this.dirty && isAuto == "Y") {
                // 尝试回调
                if (success instanceof Function) {
                    success();
                }
                // 尝试更新页面
                this.digest();
                return;
            }
            // 正在保存
            if (this.saving) {
                return;
            }
            this.auto = isAuto == "Y" ? true : false;
            // 标记正在保存中
            this.saving = true;
            // 尝试更新页面
            this.digest();
            var that = this;
            this.isExistQuesNameAjax(
                function (exist) {
                    // 已存在同名问卷
                    if (exist) {
                        alert(Prompt.QSNRD_QuesNameExist);
                        // hinter.hint(Prompt.QSNRD_QuesNameExist);
                        // 标记保存过程已经结束
                        that.saving = false;
                        that.digest();
                        // 未能保存,调用失败回调函数
                        if (error instanceof Function) {
                            error();
                        }
                        // 未存在同名问卷
                    } else {
                        // 获取问卷状态并在回调中根据状态进行处理
                        that.getQuesStatusAjax(
                            function (status) {
                                // 检查问卷状态
                                // 不允许修改的状态
                                if (!that.isAllowChangeStatus(status)) {
                                    // 提示不可修改
                                    hinter.hint(Prompt.QSNRD_NoChangeForOnLine);
                                    // 标记保存过程已经结束
                                    that.saving = false;
                                    // 更新页面
                                    that.digest();
                                    // 未能保存,调用失败回调函数
                                    if (error instanceof Function) {
                                        error();
                                    }
                                    // 允许修改的状态
                                } else {
                                    // 获取配额信息根据检查结果进行处理
                                    that.getQuotaInfoAjax(
                                        function (quotaChanged) {  // 获取配额成功回调函数
                                            // 改变了配额
                                            if (quotaChanged) {
                                                // 提示无法保存
                                                hinter.hint(Prompt.QSNRD_NoChangeForQuota);
                                                // 标记保存过程已经结束
                                                that.saving = false;
                                                // 更新页面
                                                that.digest();
                                                // 未能保存,调用失败回调函数
                                                if (error instanceof Function) {
                                                    error();
                                                }
                                                // 未改变配额
                                            } else {
                                                // 保存
                                                that.saveAjax(tested, success, hasError, isAuto, verName, error);
                                            }
                                        },
                                        function () {           // 获取配额失败回调函数
                                            hinter.hint(Prompt.QSNRD_GetQuotaInfoFauled);
                                            // 标记保存过程已经结束
                                            that.saving = false;
                                            // 更新页面
                                            that.digest();
                                            // 未能保存,调用失败回调函数
                                            if (error instanceof Function) {
                                                error();
                                            }
                                        })

                                }
                            },
                            function () {
                                hinter.hint(Prompt.QSNRD_GetQuesInfoFauled);
                                // 标记保存过程已经结束
                                that.saving = false;
                                // 刷新页面
                                that.digest();
                                if (error instanceof Function) {
                                    error();
                                }
                            })
                    }

                },
                function (data) {
                    hinter.hint(Prompt.QSNRD_CheckQuesNameFauled);
                    // 标记保存过程已结束
                    that.saving = false;
                    // 刷新页面
                    that.digest();
                    if (error instanceof Function) {
                        error();
                    }
                }
            )
        }

        /**
            保存问卷数据
            @tested 是否经过测试
            @success 成功回调函数
            @hasError 设计是否有错误
            @isAuto 是否是自动保存
            @verName 版本名称
            @error 失败回调函数
        */
        this.saveAjax = function (tested, success, hasError, isAuto, verName, error) {
            var startTime = new Date().getTime();
            // 需要自己检测错误
            if (!hasError) {
                // 自行检测
                hasError = this.validate() ? "N" : "Y";
            }
            // 没有版本名
            if (!verName) {
                // 按时间生成一个
                verName = this.generateVersionName();
            }
            // 数据存储对象
            var dataHolder = {};
            // 导出为json数据
            this.exportJson(dataHolder, hasError, tested);
            // 引用当前对象
            var that = this;
            // 请求保存数据
            $.ajax(
                {
                    type: "POST",
                    url: "/QD/saveDesign",
                    data: {
                        dataText: JSON.stringify(dataHolder.textHolder),
                        dataField: JSON.stringify(dataHolder.fieldHolder),
                        isAuto: isAuto,
                        verName: verName,
                        cutList: dataHolder.textHolder.cutList,
                    },
                    dataType: "json",
                    error: function (data) {
                        var errorMessage = "";
                        if (data || data.errorMessage) {
                            errorMessage = data || data.errorMessage;
                        }
                        RestLoginForDesign(errorMessage);
                        hinter.hint(Prompt.QSNRD_SaveFailed);
                        // 保存失败
                        that.saving = false;
                        // 刷新页面
                        that.digest();
                        if (error instanceof Function) {
                            error(e);
                        }
                    },
                    success: function (data) {
                        that.lastSaveTime = that.generateVersionName();
                        var endTime = new Date().getTime();
                        var cost = Math.round((endTime - startTime) / 1000);
                        // 保存过程中出现错误
                        if (data.returnError) {
                            hinter.hint(Prompt.QSNRD_SaveFailed); // Prompt.QSNRD_SaveFailed
                            // 保存成功
                        } else {
                            that.clearChange();
                            hinter.hint("保存成功:" + verName + " 消耗时间:" + cost + "s");
                            // 手动保存时告诉版本管理器下次需要更新
                            if (isAuto == "N") {
                                that.versionHistoryManager.setUpdateNextTime();
                            }
                        }
                        that.saving = false;
                        that.imageUploadManager.clearCutList();
                        // 回调
                        if (success instanceof Function) {
                            success();
                        }
                        // 更新页面
                        that.digest();
                    }
                })


            //$http.post("/QD/saveDesign", {
            //    dataText: JSON.stringify(dataHolder.textHolder),
            //    dataField: JSON.stringify(dataHolder.fieldHolder),
            //    isAuto: isAuto,
            //    verName: verName,
            //    cutList: dataHolder.textHolder.cutList,
            //}).success(function (data) {
            //    // 保存过程中出现错误
            //    if (data.returnError) {
            //        console.log(Prompt.QSNRD_SaveFailed); // Prompt.QSNRD_SaveFailed
            //        // 保存成功
            //    } else {
            //        that.clearChange();
            //        var endTime = new Date().getTime();
            //        hinter.hint("保存成功:" + verName + " 消耗时间:" + (endTime - startTime));
            //        // 手动保存时告诉版本管理器下次需要更新
            //        if (isAuto == "N") {
            //            that.versionHistoryManager.setUpdateNextTime();
            //        }
            //    }
            //    that.saving = false;
            //    that.imageUploadManager.clearCutList();
            //    // 回调
            //    if (success instanceof Function) {
            //        success();
            //    }
            //}).error(function (data) {
            //    console.log(data);
            //    RestLoginForDesign(data.errorMessage);
            //    hinter.hint(Prompt.QSNRD_SaveFailed);
            //    // 保存失败
            //    that.saving = false;
            //    if (error instanceof Function) {
            //        error(e);
            //    }
            //})



        }

        /**
            调试
        */
        this.test = function () {
            // 没有联网
            if (!this.getOnline()) {
                return;
            }
            // 正在测试
            if (this.testing) {
                return;
            }
            // 标记正在测试
            this.testing = true;
            var that = this;
            // 获取问卷状态,回调中根据状态进行处理
            this.getQuesStatusAjax(
                function (status, isQuesTitleExits) {        // 获取问卷状态成功回调函数
                    // 已经定版不能修改的场合
                    if (!that.isAllowChangeStatus(status)) {
                        // 生成二维码
                        that.validateManager.open(true);
                        // 标记测试过程已结束
                        that.testing = false;
                        // 更新页面
                        that.digest();
                        // 其他可修改的状态
                    } else {
                        // 进行校验调试
                        that.testWithValidate(isQuesTitleExits);
                    }
                }, function () {           // 获取问卷状态失败回调函数
                    hinter.hint(Prompt.QSNRD_GetQuesStatusFauledDeBugFauled);
                    // 标记测试过程已结束
                    that.testing = false;
                });

        }

        /**
            校验调试
        */
        this.testWithValidate = function (isQuesTitleExits) {
            // 校验
            var isValid = this.validate(isQuesTitleExits);
            // 当前对象引用
            var manager = this;
            // 没有错误
            if (isValid) {
                // 已经过测试
                var tested = "Y";
                // 没有错误
                var hasError = "N"
                // 保存
                manager.save(tested,
                    function () { // 保存成功回调函数
                        // 生成二维码
                        manager.validateManager.open(true);
                        // 标记测试已做完
                        manager.testing = false;
                    },
                    hasError,
                    "Y",
                    this.generateVersionName(),
                    function () { // 保存失败回调函数
                        // 标记测试过程已结束
                        manager.testing = false;
                    });
                // 重置自动保存
                manager.autoSaveManager.reset();
                // 有错误
            } else {
                // 显示错误列表
                manager.validateManager.open();
                // 标记测试过程已结束
                manager.testing = false;
                // 更新页面
                manager.digest();
            }
        }

        /**
            生成版本名字
        */
        this.generateVersionName = function () {
            var dateStr = new Date().toString();
            var startIndex = dateStr.indexOf(" ") + 1;
            var index = dateStr.indexOf("GMT") - 1;
            return dateStr.substring(startIndex, index);
        }

        /**
            校验
        */
        this.validate = function (isQuesTitleExits) {
            return this.validateManager.validate(isQuesTitleExits);
        }

        /**
            移动节点群
            @deltaX X偏移量
            @deltaY Y偏移量
            @selectedOnly 是否只移动被选择的节点
        */
        this.moveNodes = function (deltaX, deltaY, selectedOnly) {
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                // 只针对被选节点时不处理未被选择的节点
                if (selectedOnly && !node.isSelected()) {
                    continue;
                }
                node.x += deltaX / this.chartZoomRate;
                node.y += deltaY / this.chartZoomRate;
            }
            // 移动整个画布的场合
            if (!selectedOnly) {
                // 虚拟节点也需要处理
                for (var i = 0; i < this.vitualNodes.length; i++) {
                    var node = this.vitualNodes[i];
                    node.x += deltaX / this.chartZoomRate;
                    node.y += deltaY / this.chartZoomRate;
                }
            }
        }

        /**
            移动指定的节点群
            @nodes 指定的节点
            @deltaX X偏移量
            @deltaY Y偏移量
        */
        this.moveSpecifiedNodes = function (nodes, deltaX, deltaY) {
            if (!(nodes instanceof Array)) {
                return;
            }
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                node.x += deltaX / this.chartZoomRate;
                node.y += deltaY / this.chartZoomRate;
            }
        }

        /**
            获取所有被选中的节点
        */
        this.getSelectedNodes = function () {
            var selectedNodes = [];
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                if (!node.isSelected()) {
                    continue;
                }
                selectedNodes.push(node);
            }
            return selectedNodes;
        }

        /**
            将指定节点放到顶层
            @node 节点
        */
        this.takeToTop = function (node) {
            // 已在最后
            if (this.mixNodes[this.mixNodes.length - 1] == node) {
                return;
            }
            for (var i = 0; i < this.mixNodes.length; i++) {
                var tempNode = this.mixNodes[i];
                // 找到了该节点
                if (tempNode == node) {
                    // 将该节点从列表中移到末尾
                    this.mixNodes.splice(i, 1);
                    this.mixNodes.push(node);
                }
            }
        }

        /**
            移除某个节点的选项输出
            @node 节点
            @option 指定选项,若未指定则默认为所有选项
        */
        this.removeOptionConnOfNode = function (node, option) {
            if (!(node instanceof ZYDesign.Class.SubjectNode)) {
                return [];
            }
            var rss = [];
            for (var i = 0; i < node.relatedConnections.length; i++) {
                var conn = node.relatedConnections[i];
                // 如果有指定的选项
                if (option) {
                    if (conn.source == option) {
                        var rs = this.removeConnection(conn);
                        if (rs) {
                            rss.push(rs);
                        }
                        return rss;
                    }
                } else {
                    // 该连接是从节点的选项输出的
                    if (conn.source.parent == node &&
                        conn.source instanceof ZYDesign.Class.OptionConnector) {
                        var rs = this.removeConnection(conn);
                        if (rs) {
                            rss.push(rs);
                        }
                        i--;
                    }
                }

            }
            return rss;
        }

        /**
            为当前节点添加选项
        */
        this.addOptionForCurrentNode = function () {
            //当前节点检查
            if (!(this.currentNode instanceof ZYDesign.Class.SubjectNode)) {
                return;
            }
            var isX = false;
            // 矩阵题
            if (this.currentNode.type == ZYDesign.Enum.NODETYPE.MATRIX) {
                // 列模式
                if (this.currentNode.rowHiding) {
                    isX = true
                    // 行模式
                }
            }
            var rs = this.currentNode.addOption({}, isX);
            this.markChange();
            // 需要注册到操作历史
            recordManager.register({
                descript: "添加选项",
                param: {
                    node: this.currentNode,
                    option: rs,
                },
                undo: function () {
                    var param = this.param;
                    param.node.removeOption(param.option);
                },
                redo: function () {
                    var param = this.param;
                    param.node.addOption(param.option);
                },
            })
        }

        /**
            判断是否存在模态窗口
        */
        this.hasModal = function () {
            return $(document.body).hasClass("modal-open")
        }

        /**
            检查问卷状态
            @success 成功回调函数
            @error 失败回调函数
        */
        this.getQuesStatusAjax = function (success, error) {
            // 获取当前问卷的状态
            $http.post("/QD/GetPMQuestionnaireStateByQuesID", {
                quesID: this.questionnairUuid,
                quesTitle: this.startNode.nodeName
            }).success(function (data) {
                // 有回调函数
                if (success instanceof Function) {
                    designManager.qStatus = data.QStatus;
                    // 回调
                    success(data.QStatus, data.isQuesTitleExits); // 问卷状态，问卷是否重名
                }
            }).error(function (data) {
                RestLoginForDesign(data);
                if (error instanceof Function) {
                    error(data);
                }
            })
        }

        /**
            获取配额信息
            @success 成功回调函数
            @error 失败回调函数
        */
        this.getQuotaInfoAjax = function (success, error) {
            var that = this;
            // 获取当前问卷的状态
            $http.post("/QD/GetQuotaNodeOption", {
                quesid: this.questionnairUuid,
            }).success(function (data) {
                // 有回调函数
                if (success instanceof Function) {
                    // 带着配额检测结果回调
                    success(that.isQuotaInfoChanged(data));
                }
            }).error(function (data) {
                RestLoginForDesign(data);
                if (error instanceof Function) {
                    error(data);
                }
            })
        }

        /**
            检查当前内容是否满足配合信息
            @data 配额数据
        */
        this.isQuotaInfoChanged = function (data) {
            // 参数检查
            if (!data) {
                return false;
            }
            // 被配额的节点列表
            var quotaNodeIdList = data.NodeList;
            // 被配额的选项列表
            var quotaOptionIdList = data.OptionList;
            // 列表检查
            if (!(quotaNodeIdList instanceof Array) ||
                !(quotaOptionIdList instanceof Array)) {
                return false;
            }
            // 没有任何被配额的选项或节点时就不处理了
            if (quotaOptionIdList.length == 0 &&
                quotaNodeIdList.length == 0) {
                return false;
            }
            // 获得当前问卷甄别模式的选项和节点
            var result = this.getNodesAndOptionsOfCheckMode();
            // 检查节点
            for (var i = 0; i < quotaNodeIdList.length; i++) {
                // 一个被配额的节点
                var quotaNodeId = quotaNodeIdList[i];
                // 初始化节点是否消失
                var nodeDisappeared = true;
                // 从现有甄别节点中找该节点
                for (var j = 0; j < result.nodeList.length; j++) {
                    var checkNode = result.nodeList[j];
                    // 找到了
                    if (checkNode.nodeUuid.toUpperCase() == quotaNodeId.toUpperCase()) {
                        nodeDisappeared = false;
                        break;
                    }
                }
                // 没找到,该节点不见了
                if (nodeDisappeared) {
                    return true;
                }
            }

            // 检查选项
            for (var i = 0; i < quotaOptionIdList.length; i++) {
                // 一个被配额的选项
                var quotaOptionId = quotaOptionIdList[i];
                // 初始化选项是否消失
                var optDisappeared = true;
                // 去选项列表中找
                for (var j = 0; j < result.optionList.length; j++) {
                    var option = result.optionList[j];
                    // 找到了这个选项
                    if (option.outputId.toUpperCase() == quotaOptionId.toUpperCase()) {
                        optDisappeared = false;
                    }
                }
                // 没找到,该选项不见了
                if (optDisappeared) {
                    return true;
                }
            }
            return false;
        }

        /**
            获取甄别模式的节点
        */
        this.getNodesAndOptionsOfCheckMode = function () {
            var result = {
                nodeList: [],    // 节点列表
                optionList: []   // 选项列表
            }
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                if (node.mode == 1) {
                    // 将该节点推入节点列表
                    result.nodeList.push(node);
                    // 有选项时收集选项
                    if (node.options instanceof Array) {
                        // 合并该节点的选项到选项列表
                        result.optionList = result.optionList.concat(node.options);
                    }
                }
            }
            return result;
        }

        /**
            判断某个版本名在服务器上是否存在
            @verName 版本名
            @success 成功回调函数
            @error 失败回调函数
        */
        this.isExistVerNameAjax = function (verName, success, error) {
            // 获取版本名是否重复
            $http.post("/QD/IsExisVerName", {
                verName: verName,
                quesID: this.questionnairUuid,
            }).success(function (data) {
                if (success instanceof Function) {
                    success(data == "名称重复。" ? true : false);
                }
            }).error(function (data) {
                RestLoginForDesign(data);
                if (error instanceof Function) {
                    error(data);
                }
            })
        }

        /**
            检查问卷名
        */
        this.isExistQuesNameAjax = function (success, error) {
            // 获取问卷名名是否重复
            // 获取版本名是否重复
            $http.post("/QD/IsExisQuesName", {
                title: this.startNode.nodeName,
                quesID: this.questionnairUuid,
            }).success(function (data) {
                if (success instanceof Function) {
                    success(data.returnError);
                }
            }).error(function (data) {
                var errorMessage = "";
                if (data || data.errorMessage) {
                    errorMessage = data || data.errorMessage;
                }
                RestLoginForDesign(errorMessage);
                if (error instanceof Function) {
                    error(errorMessage);
                }
            })
        }



        /**
            是否为可以更改的问卷状态
            @status 问卷状态
        */
        this.isAllowChangeStatus = function (status) {
            if (status == 4 ||     // 计划发布
                    status == 5 || // 发布在线
                    status == 6 || // 下线
                    status == 9) { // 系统锁定
                return false;
            }
            return true;
        }

        /**
            缩小
        */
        this.zoomOut = function () {
            // 已无法再缩小
            if (this.chartZoomRate <= 0.1) {
                return;
            }
            // 缩小是可能出现加载大量页面元素造成延迟的情况
            // 需要显示加载图标
            this.showLoader();
            var that = this;
            var oldRate = this.chartZoomRate;
            that.zoomOutDo();
            var newRate = this.chartZoomRate;
            // 注册到操作历史
            recordManager.register({
                descript: "缩小",
                param: {
                    manager: designManager,
                    oldRate: oldRate,
                    newRate: newRate,
                },
                undo: function () {
                    var param = this.param;
                    param.manager.chartZoomRate = param.oldRate;
                    param.manager.controlText();
                },
                redo: function () {
                    var param = this.param;
                    param.manager.chartZoomRate = param.newRate;
                    param.manager.controlText();
                },
            })

        }

        /**
            缩小
        */
        this.zoomOutDo = function () {
            // 已无法再缩小
            if (this.chartZoomRate <= 0.1) {
                return;
            }
            this.chartZoomRate = (Math.ceil(this.chartZoomRate * 10) - 1) / 10;
            // 控制文字可见性
            this.controlText();
            // 重新检查节点和连接可见性
            var listenId = this.checkVisibleOfNodesAndConns();
            // 元素加载完毕后隐藏加载图标
            this.hideLoader(listenId);
        }

        /**
            放大
        */
        this.zoomIn = function () {
            // 已无法再放大
            if (this.chartZoomRate >= 2) {
                return;
            }
            var oldRate = this.chartZoomRate;
            var newRate = this.chartZoomRate = (Math.floor(this.chartZoomRate * 10) + 1) / 10;
            // 控制文字可见性
            this.controlText();
            // 重新检查节点和连接可见性
            this.checkVisibleOfNodesAndConns();
            // 需要注册到操作历史
            recordManager.register({
                descript: "放大",
                param: {
                    manager: designManager,
                    oldRate: oldRate,
                    newRate: newRate,
                },
                undo: function () {
                    var param = this.param;
                    param.manager.chartZoomRate = param.oldRate;
                    param.manager.controlText();
                },
                redo: function () {
                    var param = this.param;
                    param.manager.chartZoomRate = param.newRate;
                    param.manager.controlText();
                },

            })
        }

        /**
            控制文字
        */
        this.controlText = function () {
            if (this.chartZoomRate <= 0.6) {
                if ($("#text_style_tag").length > 0) {
                    return;
                }
                var css = 'text { display: none; }',
                    head = document.head || document.getElementsByTagName('head')[0],
                    style = document.createElement('style');

                style.type = 'text/css';
                style.setAttribute("id", "text_style_tag")
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }

                head.appendChild(style);
            } else {
                $("#text_style_tag").remove();
            }
        }

        /**
            切换表格显示与否
        */
        this.toggleGrid = function () {
            this.grid = !this.grid;
            localStorage.setItem("chart_grid", this.grid);
        }

        /**
            转换鼠标页面坐标为元素相对坐标
            @x 页面X坐标
            @y 页面Y坐标
            @elem 指定元素
        */
        this.translateCoordinates = function (x, y, elem) {
            var svg_elem = elem.get(0);
            var matrix = svg_elem.getScreenCTM();
            var point = svg_elem.createSVGPoint();
            point.x = x;
            point.y = y;
            return point.matrixTransform(matrix.inverse());
        };

        /**
            按默认100%显示
        */
        this.showDefault = function () {
            this.chartZoomRate = 1;
        }

        /**
            更新页面数据
            @fn 要执行的方法
        */
        this.digest = function (fn, delay) {
            fn = fn || (function () { });
            $timeout(fn, delay);
        }

        /**
            错位当前节点的选项
            @belong 选项所属
            @srcIndex 错位原位置
            @tarIndex 错位目标位置
        */
        this.dislocateOptOfCurrNode = function (belong, srcIndex, tarIndex) {
            // 当前节点
            var node = this.currentNode;
            // 当前节点非题目节点则不处理
            if (!(node instanceof ZYDesign.Class.SubjectNode)) {
                return;
            }
            // 让节点选项错位
            node.dislocateOption(belong, srcIndex, tarIndex);

            // 需要注册到操作历史
            recordManager.register({
                descript: "选项错位",
                param: {
                    node: node,
                    srcIndex: srcIndex,
                    tarIndex: tarIndex,
                    belong: belong
                },
                undo: function () {
                    var param = this.param;
                    param.node.dislocateOption(param.belong, param.tarIndex, param.srcIndex);
                },
                redo: function () {
                    var param = this.param;
                    param.node.dislocateOption(param.belong, param.srcIndex, param.tarIndex);
                }
            });
        }

        /**
            为节点生成顺序
        */
        this.generateNodeOrder = function () {
            this.startNode.order = 0;
            var results = [this.startNode],
                seeds = [this.startNode],
                start = 0,
                end = seeds.length;
            do {
                // 循环当前的种子列表,往后搜
                for (var j = start; j < end; j++) {
                    var seed = seeds[j];
                    var result = seed.searchNextNodesByOrder();
                    // 将结果加入总结果列表
                    for (var k = 0; k < result.resultList.length; k++) {
                        var rs = result.resultList[k];
                        // 总结果列表中没有该节点
                        if (results.indexOf(rs) < 0) {
                            rs.order = results.length;
                            results.push(rs);
                        }
                    }
                    // 将种子加入到种子列表中
                    for (var k = 0; k < result.seedList.length; k++) {
                        var sd = result.seedList[k];
                        // 种子列表中不包含该种子
                        if (seeds.indexOf(sd) < 0) {
                            seeds.push(sd);
                        }
                    }
                }
                // 更新要搜索的种子范围
                start = end;
                end = seeds.length;
            } while (end > start)
        }

        /**
            使所有的的连线无效
        */
        this.disableConns = function () {
            for (var i = 0; i < this.connections.length; i++) {
                this.connections[i].disable = true;
            }
        }

        /**
            使所有的的连线有效
        */
        this.enableConns = function () {
            for (var i = 0; i < this.connections.length; i++) {
                this.connections[i].disable = false;
            }
        }

        /**
            更新节点位置
            该方法很牛叉,吊炸天,加速就靠你啦,哈哈.
            @selectedOnly 是否只更新被选择的节点
        */
        this.updateNodeFlowPosition = function (selectedOnly) {
            // 需要处理的连接
            var conns = [];
            // 需要处理的节点
            var nodes = [];
            //是否需要添加或移除节点元素
            var needRemoveOrAdd = false;
            // 检查并收集要处理的节点
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                // 只处理要求处理的
                if (!selectedOnly || node.isSelected()) {
                    // 该节点需要被添加或者删除
                    if (node.checkVisible()) {
                        // 标记需要添加或删除
                        needRemoveOrAdd = true;
                    }
                    // 收集该节点
                    nodes.push(node);
                    // 检查并收集要处理的连接
                    for (var j = 0; j < node.relatedConnections.length; j++) {
                        var conn = node.relatedConnections[j];
                        // 该连接需要被删除或添加
                        if (conn.checkVisible()) {
                            // 标记需要添加或删除
                            needRemoveOrAdd = true;
                        }
                        // 收集该连接
                        if (conns.indexOf(conn) < 0) {
                            conns.push(conn);
                        }
                    }
                }
            }
            // 有需要被添加或删除的元素
            if (needRemoveOrAdd) {
                // 交给angular刷新页面
                this.digest();
                console.log("refreshed by angular");
                // 没有需要添加或删除的元素
            } else {
                // 自己更新页面
                // 更新节点位置
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].fixPosition();
                }
                // 更新连接位置
                for (var i = 0; i < conns.length; i++) {
                    conns[i].fixPosition();
                }
                // 更新鹰眼视口框
                $("#eyeSvg").attr("transform", this.getEyeTransform());
                console.log("refreshed by self");
            }
        }

        /**
            检查所有节点和连接的可见性
        */
        this.checkVisibleOfNodesAndConns = function () {
            // 用来监听的id
            var listenId = "";
            // 检查节点
            for (var i = 0; i < this.mixNodes.length; i++) {
                var node = this.mixNodes[i];
                var rs = node.checkVisible();
                // 还没监听任何id且该节点由隐藏变为显示
                if (!listenId && rs && node.visible) {
                    // 监听这个id
                    listenId = node.nodeUuid;
                }
            }
            // 检查连接
            for (var i = 0; i < this.connections.length; i++) {
                var conn = this.connections[i];
                var rs = conn.checkVisible();
                // 还没监听任何id且该连接由隐藏变为显示
                if (!listenId && rs && node.visible) {
                    // 监听这个id
                    listenId = conn.uuid;
                }
            }
            return listenId;
        }

        /**
            获取鹰眼视口窗边框宽度
        */
        this.getEyeRectWidth = function () {
            return Math.round(0.8 / this.eyeZoomRate);
        };

        /**
            将某个节点带到中间
            @node 节点
        */
        this.takeToCenter = function (node) {
            if (!(node instanceof ZYDesign.Class.NodeBase)) {
                return;
            }
            // 偏量
            var deltaX = (this.chartXDiffer - node.x) * this.chartZoomRate,
                deltaY = (this.chartYDiffer - node.y) * this.chartZoomRate;
            // 照偏量移动所有节点
            this.moveNodes(deltaX, deltaY);
            // 重新检查节点和连线可见性
            this.checkVisibleOfNodesAndConns();
            // 需要注册到操作历史
            recordManager.register({
                descript: "节点定位移动画布",
                param: {
                    deltaX: deltaX,
                    deltaY: deltaY,
                    manager: designManager,
                },
                undo: function () {
                    var param = this.param;
                    param.manager.moveNodes(-deltaX, -deltaY);
                },
                redo: function () {
                    var param = this.param;
                    param.manager.moveNodes(deltaX, deltaY);
                }
            });
        }

        /**
            显示加载图标
        */
        this.showLoader = function () {
            if (!this.useLoadIcon) {
                return;
            }
            $("#design_loader").show();
            $(document.body).addClass("modal-open");
        }

        /**
            关闭加载图标
            @id 要监视的元素id
        */
        this.hideLoader = function (id) {
            if (!this.useLoadIcon) {
                return;
            }
            // 有元素id
            if (id) {
                // 则需要该元素加载完才关闭
                var run = setInterval(function () {
                    if ($("#" + id).length > 0) {
                        clearInterval(run);
                        $("#design_loader").hide();
                        $(document.body).removeClass("modal-open");
                    }
                })
                // 无元素id则直接关闭
            } else {
                $("#design_loader").hide();
                $(document.body).removeClass("modal-open");
            }

        }

        /**
            是否正在自动保存
        */
        this.isAutoSaving = function () {
            return this.saving && this.auto;
        }

        /**
            是否为自动保存
        */
        this.isManaulSaving = function () {
            return this.saving && !this.auto;
        }

        /**
            是否允许保存
        */
        this.isAllowSave = function () {
            return this.isAllowChangeStatus(this.qStatus);
        }


        /**
            是否有变化
        */
        this.hasChange = function () {
            return this.dirty && this.isAllowSave();
        }

        /**
            记录常规变化
            @obj 参与变化的对象
            @key 参与变化的属性
            @type 变化类型 -1:开始 1:结束 其他:变化中
            @descript 变化描述
        */
        this.recordCommonChange = function (obj, key, type, descript) {
            // 不使用自定义的文本框撤销重做事件
            if (!ZYDesign.Config.customInputZY) {
                // 变化中
                if (!type) {
                    this.designManager.markChange();
                }
                return;
            }
            var selfFn = arguments.callee;
            // 开始变化
            if (type == -1) {
                // 记录老数据
                selfFn.oldValue = obj[key];
                // 初始化标记此次还未发生变化
                selfFn.changed = false;
                // 变化结束
            } else if (type == 1) {
                // 中途发生了变化则记录升级
                if (selfFn.changed) {
                    // 升级
                    recordManager.upgrade();
                }
                // 变化中
            } else {
                // 标记此次已发生变化
                if (obj[key] != selfFn.oldValue) {
                    selfFn.changed = true;
                    this.markChange();
                    // 需要注册到操作历史
                    recordManager.register({
                        descript: descript,
                        exclusive: true,
                        param: {
                            obj: obj,
                            key: key,
                            oldValue: selfFn.oldValue,
                            newValue: obj[key],
                        },
                    })
                }
            }
        }


    })().init();
}]);