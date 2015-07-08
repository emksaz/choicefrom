//FastClick
$(function () {
    FastClick.attach(document.body);
});

//判断是pc端 还是 手机端
function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        console.log("iphone");
        $(function() {
            click_bt("div.dropdown-event", "ul.dropdown");
        });
    }
    catch (e) {
        $(function() {
           pchover();
        });
    }
}
isTouchDevice();



$(function(){
    $('ul.dropdown').css('opacity', 0);
    $('ul.floating').css('opacity', 0);
});

function pchover(){
    $("div.dropdown-event").hover(function(){
        $('ul.dropdown',this).css('visibility', 'visible');
        $('ul.dropdown',this).fadeTo(200, 1);
        $('ul.floating',this).css('visibility', 'visible');
        $('ul.floating',this).fadeTo('fast', 1);
    }, function(){
        $('ul.dropdown',this).css('visibility', 'hidden');
        $('ul.dropdown',this).fadeTo('fast', 0);
        $('ul.floating',this).css('visibility', 'hidden');
        $('ul.floating',this).fadeTo('fast', 0);
    });
}

//setting-select配额条件选择按钮
var Pe_selectindex;//配额选择框索引
//开关点击按钮,切换显示和消失option菜单
$(function(){
    click_bt("button.select","ul.option");
});

function click_bt(btname,ulname){
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


//点击空白处 关闭所有"ul.option"
$(function(){

   /*clickempty("div.dropdown-event","ul.downul");*/
    clickempty("ul.downul");
 });

function clickempty(ulname){
    $(document).click(function(e){
      if($(e.target).hasClass("downul")==false){
          closeAll(ulname);
      }
    })
}


//选中下拉列表内容,自动关闭所有下拉列表,并将选中的内容赋值给首选项
$(function(){
    select_CloseAll("button.select span","ul.option","ul.option li",false);
});
function select_CloseAll(btname_span,ulname,liname,istovaule){
    $(liname).click(function(){
        //获取当前所点击的文字内容
        if(istovaule){
            var this_text = $(this).text();
            //将文字内容赋值给对应的"button.select"
            $(btname_span).eq(Pe_selectindex).text(this_text);
        }

        //关闭所有的"ul.option"
        closeAll(ulname);
    })
}

//设置当前"ul.option"为visible可见
function open_option(name,index){
    $(name).eq(index).css('visibility', 'visible');
    $(name).eq(index).fadeTo('fast', 1);
}

//设置当前"ul.option"为hidden可不可见
function close_option(name,index){
    $(name).eq(index).css('visibility', 'hidden');
    $(name).eq(index).fadeTo('fast', 0);
}

//同一关闭所有的"ul.option"
function closeAll(ulname){
    var All_mun = $(ulname).length;
      for(var i=0;i<All_mun;i++){
          if( $(ulname).eq(i).css("visibility")=="visible"){
              close_option(ulname,i);
              console.log("closetrue");
          }
      }

}

//左上角菜单按钮控制
var click_mun =1;//定义开关,定义全局变量
//开关点击按钮,切换显示和消失menu菜单
$(function(){
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
});

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

//---------------------------- help --------------------------------------------------------

$(function() {
    var elm = $('.help-menu');
    var startPos = $(elm).offset().top;
    $.event.add(window, "scroll", function() {
        var p = $(window).scrollTop();
        $(elm).css('position',((p) > startPos) ? 'fixed' : 'static');
        $(elm).css('top',((p) > startPos) ? '0px' : '');
    });
});

//---------------------------- help --------------------------------------------------------

$(function(){
    $(".help-list").click(function(){
        var sectionNumber = $(this).attr("rel");
        $.scrollTo('#'+sectionNumber,500);
    });
    $(".scrolltop").click(function(){
        $("html, body").animate({scrollTop: "0"});
    });
});
