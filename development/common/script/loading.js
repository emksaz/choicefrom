function loadingStart() {
    $("#LoadingDiv").show();
    $(".main-wrapper").prepend("<div class=\"background_opacity\"  ></div>");
    //$(".cs-container").append("<div class=\"loading\"><img src=\"/images/loading2_1.gif\" alt=\"54beb0156df32c81653dc36f_loading2.gif\" data-ix=\"loading-pictures\"></div>");
}
function loadingEnd() {
    $("#LoadingDiv").hide();
    //$('.loading').remove();
    $('.background_opacity').remove();
}

function QDloadingStart() {
    $(".design_group_block").prepend("<div class=\"wiat_for_assets_load\" data-ix=\"wait-for-assets-load\"></div>");
    $("#QDLoad").append("<div class=\"loading\"><img src=\"/images/loading2_1.gif\" alt=\"54beb0156df32c81653dc36f_loading2.gif\" data-ix=\"loading-pictures\"></div>");
}
function QDloadingEnd() {
    $('.loading').remove();
    $('.wiat_for_assets_load').remove();
}

$.extend({
    loaddingShow: function (configSettings) {
        var settings = {

        };
        $.extend(settings, configSettings);

        var str = "<div id=\"lodingDIV\" class=\"tips_bg alert_bg_show\">";
        str += "<div id=\"loading\"></div>";
        str += "</div>";
        $("body").append(str);

    },
    loaddingHide: function () {
        $('#lodingDIV').remove();
    }

});