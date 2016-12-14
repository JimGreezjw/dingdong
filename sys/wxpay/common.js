﻿//﻿/*!
// * 羽扇科技——微信模块公用js
// */
window.ys={};
window.ys.wechat= {

    wxConfig: function ()//设置微信分享链接
    {
        var url = window.location.href;
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
            success: function (ret) {
                alert(JSON.stringify(ret));            	
                var config = ret;
                wx.config({
                    debug: true,
                    appId: config.appId,
                    timestamp: config.timestamp,
                    nonceStr: config.nonceStr,
                    signature: config.signature,
                    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'chooseWXPay']
                });
            },
            fail: function (ret) {
                alert(JSON.stringify(ret));
            }
        });
        wx.checkJsApi({
            jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {
                alert(JSON.stringify(res));
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });
    },
    wxShare: function (shareObj)//设置微信分享链接
    {
        if (!window.wx)return;
        ys.wechat.wxConfig();
        wx.ready(function () {
            wx.onMenuShareAppMessage(shareObj); //好友
            wx.onMenuShareTimeline(shareObj);//朋友圈
        });
    },
    wxPay: function () {
        //获得配置
        var userId = localStorage["ddUserId"];
        var totalFee = $("#totalFee").val();

        $.ajax({
            type: "GET",
            url: "http://www.yushansoft.com/dingdong/ddmz/payToken",
            cache: false,
            data: {
                userId: userId,
                totalFee: totalFee
            },
            success: function (ret) {
                if (ret.responseDesc == "OK") {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', ret.tokenConfig,
                        function (res) {
                          //alert(JSON.stringify(res));
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                            	history.back(-1);
                            } else {
                            	alert("微信充值失败,请稍后重试!");
                            }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                        }
                    );
                }
                else {
                }
            }

        });
    }
    ,

wxUpload:function () {
    localStorage.setItem("attatchNo","");
    localStorage.setItem("localIds","");
    ys.wechat.wxConfig();
    wx.ready(function(){
        wx.chooseImage({
            success: function(res){
                var attatchNo;
                var localIds;
                if(res.localIds.length>5){
                    alert("最多上传5张！");
                }else{
                    var i = 0; var length = res.localIds.length;
                    var upload = function() {
                        var localId=res.localIds[i];
                        var img = "#img"+i;
                        var img1=$(img);
                        img1.attr("src",localId);
                        img1.show();

                        wx.uploadImage({
                            localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                var serverId = res.serverId; // 返回图片的服务器端ID
//                                alert("the wx serverId is "+serverId);
                                $.ajax({
                                    url : "/dingdong/yusFiles",
                                    type : "POST",
                                    cache : "false",
                                    data : {
                                        userId :localStorage["ddUserId"],
                                        wxServerId : serverId
                                    },
                                    success : function(result) {
                                        if (1 == result.responseStatus) {
                                            fileId = result.yusFiles[0].id;

                                            if(attatchNo){
                                                attatchNo = attatchNo+','+fileId;
                                                localIds = localIds+','+localId;
                                            }else{
                                                attatchNo = fileId;
                                                localIds = localId;
                                            }
                                            //如果还有照片，继续上传
                                            i++;
                                            if (i < length) {
                                                upload();
                                            }else{

//                                                alert("应写入数据库attatchRef 的文件ID "+attatchNo);
                                                localStorage.setItem("attatchNo",attatchNo);
                                                localStorage.setItem("localIds",localIds);
                                            }
                                            //ys.showMsg("图片上传成功！")
                                        }
                                        else
                                        {
                                            alert(result.responseDesc);
                                        }
                                    }
                                });
                            }
                        })
                    };
                    upload();
                }

            }
        })
    })

    }
};



