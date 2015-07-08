
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
})();