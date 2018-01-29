//引入其他js文件
document.write("<script language=javascript src='../js/jquery-1.10.2.min.js'></script>");
document.write("<script language=javascript src='../js/libs/lodash.js'></script>");
document.write("<script language=javascript src='../js/libs/jquery.md5.js'></script>");

//global config
var Develop = {
	baseUrl: 'http://114.55.255.164:8086/',
	baseUri: 'http://114.55.255.164:8084/'
};
var BaseUri = Develop.baseUrl;
var baseUri = Develop.baseUri;
//globa fuc
mui.plusReady(function() {

		window.common = {
			//localstorage fuc
			setLocVal: function(name, value) {
				localStorage[name] = value;
			},
			getLocVal: function(name) {
				var result = localStorage[name];
				if(typeof(result) == "undefined") {
					result = "";
				}
				return result;
			},
			clearLocVal: function(key) {
				if(!key) {
					localStorage.clear();
				} else {
					localStorage.removeItem(key);
				}
			},
			//验签算法
//			const generateSign = (json) => {
//			    let $this = this;
//			    let new_some_map = '';
//			    _(json).keys().sort().each((key) => {
//			        let value = json[key] instanceof Array ? 'Array' : json[key];
//			
//			        if (key != 'sign' && value !== '' && value !== null) new_some_map += key + '=' + value + '&'
//			    });
//			    new_some_map += 'key=1a2b3c4d_yimihaodi';
//			    console.log(new_some_map);
//			    return _.toLower(md5(new_some_map));
//			}
			getToken:function(){
				var token = '';
				if (common.getLocVal('token') !== token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
			      token = common.getLocVal('token');
			      return token;
			    }else {
			      return token;
			    }
			},
			generateSign: function(json){
				var new_some_map = '';
				_(json).keys().sort().each(function(key){
					var value = json[key] instanceof Array ? 'Array' : json[key];
					if (key != 'sign' && value !== '' && value !== null) new_some_map += key + '=' + value + '&'
				});
				new_some_map += 'key=1a2b3c4d_yimihaodi';
			    console.log(new_some_map);
			    return _.toLower(jQuery.md5_32(new_some_map));
			},
			//ajax fuc
			JsonPost: function(params, func) {
				//判断是否有网络
				var nt = plus.networkinfo.getCurrentType();
				if (nt == 0 || nt == 1) {
					common.alert("提示", "您的设备暂时没有网络连接！");
					common.closeLoading();
					return false;
				} else {
					if (nt != 3) {
						// common.toast("没有连接wifi,请注意流量哦~");
					}
				}
//				var oauth = {
//					oauth_token: common.getLocVal('oauth_token'),
//					oauth_token_secret: common.getLocVal('oauth_token_secret'),
//					x_postion: "320000"
//				}
				if (typeof params.data === 'undefined') {
					params.data = {};
				}

//				mui.extend(true, params.data, oauth);
				console.log(JSON.stringify(params));
				var oToken = common.getLocVal('token')?common.getLocVal('token'):'';
				mui.ajax(BaseUri + params.url, {
					data: params.data,
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					headers:{'Content-Type':'application/json','token':oToken},
					success:function(data){
						//console.log(common.getLocVal("taskUrl"));
//						if(common.getLocVal("taskUrl") != ''){
//							if(common.inArray(params.url,JSON.parse(common.getLocVal("taskUrl")))){
//								common.getTaskTip();
//							}
//						}
						
						func(data);
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						console.info(JSON.stringify(xhr))
						console.log(type+errorThrown);
						common.closeLoading();
						common.toast("哎呀~网络不给力~~");
					}
				});
			},
			otherPost: function(params, func) {
				//判断是否有网络
				var nt = plus.networkinfo.getCurrentType();
				if (nt == 0 || nt == 1) {
					common.alert("提示", "您的设备暂时没有网络连接！");
					common.closeLoading();
					return false;
				} else {
					if (nt != 3) {
						// common.toast("没有连接wifi,请注意流量哦~");
					}
				}
				if (typeof params.data === 'undefined') {
					params.data = {};
				}

				console.log(JSON.stringify(params));
				mui.ajax(baseUri + params.url, {
					data: params.data,
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
//					headers:{'Content-Type':'application/json'},
					success:function(data){
						func(data);
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						console.info(JSON.stringify(xhr))
						console.log(type+errorThrown);
						common.closeLoading();
						common.toast("哎呀~网络不给力~~");
					}
				});
			},
			//弹框提示
			alert: function(title, text, func) {
				plus.nativeUI.alert(text, func, title, "确定");
			},
			confirm: function(title, text, func) {

				plus.nativeUI.confirm(text, func, title, ['确定', '取消']);
			},
			confirms: function(title, text, btns, func) {
				btns = btns || ['确定', '取消'];
				plus.nativeUI.confirm(text, func, title, btns);
			},
			toast: function(text) {
				plus.nativeUI.toast(text);
			},
			//加载动画
			loading: function(title, text) {
				plus.nativeUI.showWaiting(title);
			},
			closeLoading: function() {
				plus.nativeUI.closeWaiting();
			},
			//回到应用首页
			goBackRoot: function() {
				var wvs = plus.webview.all();
				var root = plus.webview.getLaunchWebview();
				for (var i = 0; i < wvs.length; i++) {

					if (wvs[i].getURL() == root.getURL()) {
						root.reload();
						continue;
					}
					wvs[i].close("none");
				}
			},
			//基本验证
			isEmpty: function(str) {
				if (str == "" || str == " ") {
					return false;
				} else {
					return true;
				}
			},
			isTelphone: function(mobile) {
				var myreg = /^((13|14|15|17|18)+\d{9})$/;
				if (!myreg.test(mobile)) {
					return false;
				} else {
					return true;
				}
			},
			isIdcard: function(idcard){
				var idCard1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
				var idCard2 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
				if (idcard.length > 15) {
					if (!idCard1.test(idcard)) {
						return false;
					} else {
						return true;
					}
				} else{
					if (!idCard2.test(idcard)) {
						return false;
					} else {
						return true;
					}
				}
			}
			

		};

	});