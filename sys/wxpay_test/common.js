/*!
 * 羽扇科技——微信模块公用js
 */
window.ys={};
window.ys.wechat={
	
    wxConfig: function()//设置微信分享链接
    {

		var url=window.location.href;
		
        var iPos=url.indexOf("#");
        if(iPos>0)
        	url=url.substring(0,iPos);
		   
        //获得配置
        $.ajax({
            type: "GET",
            url: '/dingdong/ddmz/jsConfig',
            cache: false,
            data: {
                url: url
            },
            success: function(ret){
                    var config = ret;
                    wx.config({
                        debug: false,
                        appId: config.appId,
                        timestamp: config.timestamp,
                        nonceStr: config.nonceStr,
                        signature: config.signature,
                        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ','chooseImage','previewImage','uploadImage','downloadImage','chooseWXPay']
                    });
                    
                
            }
            
        }); 
    	wx.checkJsApi({
    	    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ','chooseImage','previewImage','uploadImage','downloadImage','chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
    	    success: function(res) {
    	    	alert(JSON.stringify(res));
    	        // 以键值对的形式返回，可用的api值true，不可用为false
    	        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    	    },
			fail: function(res) {
    	    	alert(JSON.stringify(res));
    	        // 以键值对的形式返回，可用的api值true，不可用为false
    	        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    	    }
    	}); 
    },
    wxShare: function(shareObj)//设置微信分享链接
    {
		if(!window.wx)return;
        ys.wechat.wxConfig();
        wx.ready(function(){
            wx.onMenuShareAppMessage(shareObj); //好友   
            //alert(wx.onMenuShareTimeline);
            wx.onMenuShareTimeline(shareObj);//朋友圈
        });
    }
	
}



	        		