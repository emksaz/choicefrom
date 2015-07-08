(function ($) {
    $.fn.extend({
        
		"InitUpload":function(options){

		    _options = options;
			var strHtml="";
			//strHtml+="<div>";
			strHtml+="<div class='panelext'>";
				strHtml+="<div class='closebtnext'>";
					strHtml+="<div onclick='$(\"this\").CloseUpload()'></div>";
				strHtml+="</div>";
				strHtml+="<div>";
					strHtml+="<div class='uploadpaneel'>";
						strHtml+="<div id='i_select_files'>";
						strHtml+="</div>";
						strHtml+="<div id='i_stream_files_queue'>";
						strHtml+="</div>";
						strHtml+="<button class='custombtn' onclick='javascript:_t.upload();'>开始上传</button><button onclick='javascript:_t.cancel();' class='custombtn'>取消</button>";
						strHtml+="<div id='i_stream_message_container' class='stream-main-upload-box none' style='overflow: auto;height:200px;'>";
						strHtml+="</div>";
						
					strHtml+="</div>";
				strHtml+="</div>";

			strHtml+="</div>";

		 //strHtml+="</div>";
		 $(".panelext").remove();
		 $("#uploadDiv").append(strHtml);




/**
 * 配置文件（如果没有默认字样，说明默认值就是注释下的值）
 * 但是，on*（onSelect， onMaxSizeExceed...）等函数的默认行为
 * 是在ID为i_stream_message_container的页面元素中写日志
 */

		 $(".btnUpload").click(function () {
		     if (_IsComplated) {
		         _input = $(".custom_btn").index($(this).parent());
		         $("#btn_Upload").click();
		     }
		     else {
		         alert(Prompt.UploadPrompt,"green");
		     }
		 });
	_IsComplated=true;
	var config = {
	    parentfolder: "\\",
	    childfolder: "\\",
	    width:"72",
	    height:"72",
	    iscrop:false, ///是否切图
	    CompanyID: "",///公司ID
	    QuesID: "",///问卷ID
	    UType: "",///上传类型：1表示封面上传 2:表示公司头像上传
	    LoadingName: "",///进程名称
	    Scope:null,///页面对象
	    Http:null,///页面对象
		browseFileId : "i_select_files", /** 选择文件的ID, 默认: i_select_files */
		browseFileBtn : "<div>上传图片</div>", /** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
		dragAndDropArea: "i_select_files", /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
		dragAndDropTips: "<span></span>", /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
		filesQueueId : "i_stream_files_queue", /** 文件上传容器的ID, 默认: i_stream_files_queue */
		filesQueueHeight : 200, /** 文件上传容器的高度（px）, 默认: 450 */
		messagerId : "i_stream_message_container", /** 消息显示容器的ID, 默认: i_stream_message_container */
		multipleFiles: false, /** 多个文件一起上传, 默认: false */
		autoUploading: true, /** 选择文件后是否自动上传, 默认: true */
		autoRemoveCompleted : true, /** 是否自动删除容器中已上传完毕的文件, 默认: false */
		maxSize: 2097152,//, /** 单个文件的最大大小，默认:2G */
//		retryCount : 5, /** HTML5上传失败的重试次数 */
//		postVarsPerFile : { /** 上传文件时传入的参数，默认: {} */
//			param1: "val1",
//			param2: "val2"
//		},
		swfURL : "swf/FlashUploader.swf", /** SWF文件的位置 */
		tokenURL: "/UploadRoot/UploadFile.aspx?action=gettoken", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
		frmUploadURL: "/UploadRoot/upload.php?action=fd;", /** Flash上传的URI */
		uploadURL: "/UploadRoot/UploadFile.aspx?action=upext", /** HTML5上传的URI */
//		simLimit: 200, /** 单次最大上传文件个数 */
		extFilters: [".jpg", ".gif", ".png", ".jpeg", ".bmp"], /** 允许的文件扩展名, 默认: [] */
		onSelect: function (list) {
		    
		    try {
		        isselectfile = "1";
		    } catch (a)
		    { }
		    _IsComplated = false;
		}, /** 选择文件后的响应事件 */
		onMaxSizeExceed: function (size, limited, name) {
		    alert('文件超过最大上限。');
		    _IsComplated = true;
		}, /** 文件大小超出的响应事件 */
//		onFileCountExceed: function(selected, limit) {alert('onFileCountExceed')}, /** 文件数量超出的响应事件 */
		onExtNameMismatch: function (name, filters) {
		    alert('选择的文件类型不正确。');
		    _IsComplated = true;
		}, /** 文件的扩展名不匹配的响应事件 */
//		onCancel : function(file) {alert('Canceled:  ' + file.name)}, /** 取消上传文件的响应事件 */
		onComplete: function (file) {
		    _IsComplated = true;
		    if(config.iscrop)//需要切割图片的时候调用
		    {
		        if (config.UType == "2") { 
		            config.Scope.UUserInfo.FileName = file.token;
		        }
		        config.Http.post('/Upload/CropBitmap', { fileName: file.token, uplaodPath: config.parentfolder, companyID: config.CompanyID, uType: config.UType, quesID: config.QuesID }).success(function (data) {
		            if(data.IsSuccess)
		            {
		                if(config.UType=="1")
		                {
		                    config.Scope.QSummary.SummaryQFacePpicture = data.FileUrl;
		                    config.Scope.QSummary.FileSize = data.FileSize + "MB";
		                    config.Scope.QSummary.FileName = data.FileName;
		                }
		               
		                if (config.UType == "2") {
		                    config.Scope.UUserInfo.Portrait = data.FileUrl;
		                }
		            }
		        });
		    }

			
			
		}, /** 单个文件上传完毕的响应事件 */
		onUploadProgress:function(e)
		{
		    if (config.UType == "2") {
		        $('#RadioProgressBar').data('radialIndicator').value(e);
		    }
		    else {
                $("#" + config.LoadingName).css({ "width": e + "%" });
		    }
		    
		    
		}
//		onQueueComplete: function() {alert('onQueueComplete')}, /** 所以文件上传完毕的响应事件 */
//		onUploadError: function(status, msg) {alert('onUploadError')} /** 文件上传出错的响应事件 */
	};
	config = $.extend(config, options);
	var _t = new Stream(config);
	return _t;
		},
	
    });
})(jQuery);