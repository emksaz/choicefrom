//FastClick
$(function () {
    FastClick.attach(document.body);
});

//判断是手机端 还是 pc端
function isTouchDevice(){
    var system = {
        win: false,
        mac: false,
        xll: false,
        ipad:false
    };
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") >= 0;
    system.mac = p.indexOf("Mac") >= 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") >= 0);
    //system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
    //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面

    //识别所有win,mac,X11系统,认为是pc端 反之 是手机端
    if (system.win || system.mac || system.xll) {
        document.removeEventListener('touchend', touchendFunc, false);
        try {
            //pc端可触摸
            document.createEvent("TouchEvent");
            //手机端只能click
            //pchover("div.dropdown-event","ul.downul");
            click_bt(".dropdown-bt", "ul.downul");
            console.log("pc可触摸");
        }
        //pc端不可触摸
        catch (e) {
            //pc端hover,click都可以
            console.log("pc不可触摸");
            // click_bt(".dropdown-bt", "ul.downul");
            pchover("div.dropdown-event", "ul.downul");
            clickempty("dropdown-bt", "ul.downul");
        }
    } else {
        document.addEventListener('touchend', touchendFunc, false);
        click_bt(".dropdown-bt", "ul.downul");
    }
}

//判断是pc端 还是 手机端
$(function(){
    isTouchDevice();
});

function pchover(btname, ulname) {

    $(ulname).css('visibility', 'hidden');
    $(ulname).children().css({
        'visibility': 'hidden',
        'display': 'none',
        "height": ''
    });
    $(btname).unbind('mouseenter').unbind('mouseleave');
        $(btname).hover(function(){
            $(ulname, this).css('visibility', 'visible');
            $(ulname, this).children().css({
                'visibility': 'visible',
                'display': '',
                "height": ''
            });
            $(ulname, this).stop(true).fadeTo(200, 1);
         
        }, function(){
            $(ulname, this).css('visibility', 'hidden');
            $(ulname, this).children().css({
                'visibility': 'hidden',
                'display': 'none',
                    "height":'0px'
            });
            $(ulname, this).stop(true).fadeTo('fast', 0);
        });



}

var Pe_selectindex;//选择框索引

//点击按钮出下拉框
function click_bt(btname, ulname) {
    $(btname).unbind('click');
    $(btname).click(function(){
        //获取点击当前按钮的索引
        Pe_selectindex = $(btname).index(this);
        console.log("Pe_selectindex="+Pe_selectindex);
        //除了当前区域,将其他的 下拉列表 隐藏
        $(ulname).slice(0,Pe_selectindex).css('visibility', 'hidden');
        $(ulname).slice(Pe_selectindex+1).css('visibility', 'hidden');

        //判断,如果当前的下拉列表是隐藏的,点击后显示.反之也执行
        if($(ulname).eq(Pe_selectindex).css("visibility")=="hidden"){
            open_option(ulname,Pe_selectindex);
        }else{
            close_option(ulname,Pe_selectindex);
        }
    })
}

//手机触摸屏touchend监听事件
function touchendFunc() {
    try{
        clickempty("dropdown-bt", "ul.downul");
    }catch (e){
        console.log('touchMoveFunc：' + e.message);
    }
}

//点击空白处 关闭所有下拉列表
$(function(){
    clickempty("dropdown-bt", "ul.downul");
    which_browser();

 });

//点击空白处 关闭所有下拉列表,注意这里的btname 是 class的名的字符串,不是JQ写法
function clickempty(btname,ulname){
    $(document).click(function(e){
        var parentEls =$(e.target).parents()
            .map(function () {
                return this.className;
            }).get().join(", ");
        var ownEls =$(e.target).map(function () {
            return this.className;
        }).get().join(", ");

        if((parentEls.indexOf(btname)<=0)&&(ownEls.indexOf(btname)<=0))
        {
            closeAll(ulname);
        }
    })
}

//设置当前"ul.option"为visible可见
function open_option(ulname,index){
    $(ulname).eq(index).css('visibility', 'visible');
    $(ulname).eq(index).fadeTo('fast', 1);
    $(ulname).eq(index).children().css({
        'visibility': 'visible',
        'display': '',
        "height": ''
    });
 
}
//设置当前"ul.option"为hidden可不可见
function close_option(ulname, index) {

    $(ulname).eq(index).css('visibility', 'hidden');
    $(ulname).eq(index).fadeTo('fast', 0);
    $(ulname).eq(index).children().css({
        'visibility': 'hidden',
        'display': 'none',
        "height": '0px'
    });
}
//同一关闭所有的"ul.option"
function closeAll(ulname){
    //var All_mun = $(ulname).length;
    //for(var i=0;i<All_mun;i++){
    //    if( $(ulname).eq(i).css("visibility")=="visible"){
    //        close_option(ulname,i);
    //    }
    //}
    //$(ulname).css('visibility', 'hidden');
    $(ulname).children().css({
        'visibility': 'hidden',
        'display': 'none',
    });

    $(ulname).css('visibility', 'hidden');
 
}

//左上角菜单按钮控制
var click_mun =1;//定义开关,定义全局变量
//开关点击按钮,切换显示和消失menu菜单
$(function(){
    menuButton();

});

function menuButton()
{
    $("a.menu-button").click(function(){
        click_mun++;
        if(click_mun%2==0){
            $(".menu").css('visibility', 'visible');
            $(".menu").fadeTo('fast', 1);
        }else{
            $('.menu').css('visibility', 'hidden');
            $('.menu').fadeTo('fast', 0);
        }
    })
}

//当屏幕大于767时 显示menu菜单,小于767时消失menu菜单
$(window).bind("resize", resizeWindow);
function resizeWindow() {
    var win_width = window.innerWidth;//获取屏幕宽度
    if(win_width>991){
        click_mun=1;
        if($(".menu").css("visibility")=="hidden"){
            $(".menu").css('visibility', 'visible');
            $(".menu").fadeTo('fast', 1);
        }
    }
    else{
        if(($(".menu").css("visibility")=="visible")&&(click_mun==1)){
            $('.menu').css('visibility', 'hidden');
            $('.menu').fadeTo('fast', 0);
        }
    }
}

var system_event = {
    animation_remove: function () {
        $('body').addClass("RemoveBgAnimation");
    }
}


//识别浏览器
function which_browser() {
    //自动识别浏览器类型,并获取型号
    var agent = navigator.userAgent.toLowerCase();
    var regStr_ie = /msie [\d.]+;/gi;
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi;
    var regStr_saf = /safari\/[\d.]+/gi;

    var browser = navigator.appName;
    var b_version = navigator.appVersion;
    var version = parseFloat(b_version);

    if (agent.indexOf("msie") > 0 || ((browser == "Netscape" || browser == "Microsoft Internet Explorer") && version <= 4))//识别出IE浏览器,
    {
        system_event.animation_remove();
    }

}
