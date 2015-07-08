var Help_tips = (function () {

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
tip_str[6]="tip6123131tip6123131";