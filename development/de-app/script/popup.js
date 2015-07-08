setTimeout(function() {
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
