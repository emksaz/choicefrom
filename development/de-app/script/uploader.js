/**
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