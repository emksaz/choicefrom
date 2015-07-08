setTimeout(function () {
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

