;(function($,window,document,undefined){
    var MU=function () {

    }
    var requestId = 0;
    var urls= commonUrl;
    $.extend({
        "rpc_ajax":function (options) {
            var mu = new MU();
            mu.execute(options.url, options.method, options.dataArgs, options.successCallback);
        },
        "rpc_json":function (options) {
            var mu=new MU();
            return mu.getRpcJson(options.method, options.dataArgs);
        },
        urls:urls
    });
    $.fn.extend({
        "ajax_loader":function (options) {
            var mu=new MU();
            if($(this).hasClass("ajax-loader")){
                $(this).removeClass("ajax-loader");
            }else{
                $(this).append(mu.loader(options));
            }
            var loader_width=$(".ajax-loader").children().width();
            $(".ajax-loader").find('.preloader').css('left','50%').css('margin-left',-(loader_width/2));
        }
    })
    
    /**
     * 加载动画
     * @param options
     */
    MU.prototype.loader=function (options) {
        var template='<div class="ajax-loader"><div class="preloader '+options.size+' '+options.color+'">'+
                '<svg class="pl-circular" viewBox="25 25 50 50">'+
                '<circle class="plc-path" cx="50" cy="50" r="20" />'+
                '</svg>'+
                '<p>Please wait...</p>'+
                '</div></div>';
        template=$(template);
        return template;

    }
    MU.prototype.execute=function (url, method, dataArgs, successCallback) {
        return new JsonRpcRequest({
            url : url,
            method : method,
            dataArgs : dataArgs,
            successCallback : successCallback
        });
    }
    MU.prototype.getRpcJson=function (method, dataArgs) {
        return jsonRpcData({
            method : method,
            dataArgs : dataArgs
        });
    }
    var jsonRpcData=function (options) {
        var jsonData = {
            id : requestId++,
            method : options.method,
            params : options.dataArgs,
            token  : sessionStorage.getItem('integralThroughTrain_token')
        };
        return JSON.stringify(jsonData);
    }
    var JsonRpcRequest = function(options)
    {

        this.options = {
            type : "POST",
            url : urls + options.url,
            contentType : "application/json",
            dataType : "json",
            data : jsonRpcData(options),
            success : function(jsonResult) {
                if (null != options.successCallback)
                    options.successCallback(jsonResult.result);
            },
            error : function(info){
                alert("error");
                if(null != options.errorCallback) options.errorCallback(info);
            },
            timeout : function(info){
                alert("timeout");
                if(null != options.timeoutCallback) options.timeoutCallback(info);
            }
        };

        this.execute = function(){
            $.ajax(this.options);
        };

        this.execute();
    }

})(jQuery,window,document);
