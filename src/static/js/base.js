/* eslint-disable */
var localObj = window.location;
var contextPath = localObj.pathname.split("/")[1];
var basePath = localObj.protocol+"//"+localObj.host+"/"+contextPath+"/";
var baseVesion = "v1.0.0.1";
var gaID='UA-105665851-1';


$.ajaxSetup({
	type : 'post',
	cache : false,
	contentType : 'application/json',
	statusCode : {
		200 : function() {
			// alert("操作成功");
		},
		550 : function() {
			//alert("系统内部错误...");
		},
		400 : function() {
			// alert("请检查你的输入...");
		},
		403 : function() {
			//alert("没有该资源的权限...");
		},
		404 : function() {
			//alert("没有找到资源...");
		},
		500 : function() {
			//alert("系统内部错误...");
		}
	}
});
jQuery.axs=function(path,params, successfn,errorfn) {	
	//load();
    $.ajax({
        data: params,
        contentType : 'application/json',
        dataType:"json",
        type : 'post',
        url : basePath+path,
        success: function(d){
        	//dispalyLoad();
        	switch(d.code){
        	case 404:
        		successfn(d);
        		break;
        	case 400:
        		successfn(d);
        		break;
    		case 200:
        		successfn(d);
        		break;
    		case 100:
    			successfn(d);
    			//jAlert("请登录！","警告");
//    			window.location.href="login.html?backurl="+window.location.href;
    			break;
    		case 101:
//    			window.location.href=PortalLoginPath+"/login.html";
    			break;
    		case 102:
//    			window.location.href=PortalLoginPath+"/login.html";
    			break;
    		case 103:
//    			jAlert("请求无效","警告");
    			break;	
    		case 104:
//    			jAlert("系统异常","警告");
    			break;	
    		case 105:
//    			jAlert("请求不合法","警告");
    			break;		
    		case 605://email已存在register_usermax
//    			jAlert("email已被占用，请更换其他邮箱","警告");
    			break;	
    		case 606://机构成员
//    			jAlert(writelanguageinfotitle("register_usermax"),writelanguageinfotitle("basic_dictionary_warn_title"));
    			break;		
    		default:
    			successfn(d);
//    			jAlert("请求失败","警告");
    	}
        },
    	error:function(e){
    		//dispalyLoad();
    		try{
    			if(e!=null && e!=undefined){
	    			var msg = stringToJson(e.responseText);
	    			var data = msg.data[0].constraint;
    			}else{
    			}
	        }catch(e){
	        }
    	}
    });
};
jQuery.ins=function(path,params, successfn,errorfn) {   
    //load();
    $.ajax({
        data: params,
        async: false,
        contentType : 'application/json',
        dataType:"json",
        type : 'post',
        url : basePath+path,
        success: function(d){
            //dispalyLoad();
            switch(d.code){
            case 404:
                successfn(d);
                break;
            case 400:
                successfn(d);
                break;
            case 200:
                successfn(d);
                break;
            case 100:
                successfn(d);
                //jAlert("请登录！","警告");
//              window.location.href="login.html?backurl="+window.location.href;
                break;
            case 101:
//              window.location.href=PortalLoginPath+"/login.html";
                break;
            case 102:
//              window.location.href=PortalLoginPath+"/login.html";
                break;
            case 103:
//              jAlert("请求无效","警告");
                break;  
            case 104:
//              jAlert("系统异常","警告");
                break;  
            case 105:
//              jAlert("请求不合法","警告");
                break;      
            case 605://email已存在register_usermax
//              jAlert("email已被占用，请更换其他邮箱","警告");
                break;  
            case 606://机构成员
//              jAlert(writelanguageinfotitle("register_usermax"),writelanguageinfotitle("basic_dictionary_warn_title"));
                break;      
            default:
                successfn(d);
//              jAlert("请求失败","警告");
        }
        },
        error:function(e){
            //dispalyLoad();
            try{
                if(e!=null && e!=undefined){
                    var msg = stringToJson(e.responseText);
                    var data = msg.data[0].constraint;
                }else{
                }
            }catch(e){
            }
        }
    });
};
/**
 * 封装弹出框 info
 * @param msg
 */
// function eAlertInfo(msg){
// 	var msgbox="<div style='text-align:center;font-weight:bold;z-index:99999999'>"+msg+"</div>";
// 	$.messager.alert('提示', msgbox);
// }
/**
 * 封装冒泡 info
 * @param msg
 */
function stopEvent(event){ //阻止冒泡事件
    //取消事件冒泡
     var e=arguments.callee.caller.arguments[0]||event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
     if (e && e.stopPropagation) {
     // this code is for Mozilla and Opera
     e.stopPropagation();
     } else if (window.event) {
     // this code is for IE
      window.event.cancelBubble = true;
    }
}

/**
 * 时间毫秒 格式化时间yyyy-MM-dd 
 * @param date
 * @param row
 * @param index
 * @returns {String}
 */
function formattime(date, row, index) {
	if (date != null) {
		if (date == null) {
			return "";
		}
		date = new Date(date);
//		date = new Date(date.time);
		var y = date.getFullYear();
		var M = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var html = y + "-";
		if (M < 10) {
			html += "0";
		}
		html += M + "-";

		if (d < 10) {
			html += "0";
		}
		html += d + " ";
		/*
		if (h < 10) {
			html += "0";
		}
		html += h + ":";
		if (m < 10) {
			html += "0";
		}
		html += m + ":";
		if (s < 10) {
			html += "0";
		}
		html += s;*/
		return html;
	}else {
		return "";
	}
}
/**
 * 时间毫秒 格式化时间yyyy-MM-dd HH:mi:ss
 * @param date
 * @param row
 * @param index
 * @returns {String}
 */
function formattimess(date, row, index) {
	if (date != null) {
		if (date == null) {
			return "";
		}
		date = new Date(date);
//		date = new Date(date.time);
		var y = date.getFullYear();
		var M = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var html = y + "-";
		if (M < 10) {
			html += "0";
		}
		html += M + "-";

		if (d < 10) {
			html += "0";
		}
		html += d + " ";
		if (h < 10) {
			html += "0";
		}
		html += h + ":";
		if (m < 10) {
			html += "0";
		}
		html += m + ":";
		if (s < 10) {
			html += "0";
		}
		html += s;
		return html;
	}else {
		return "";
	}
}


String.prototype.replaceAll = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2);
}
//keycode封装
// function fireKeyEvent(el, evtType, keyCode){  
//     var doc = el.ownerDocument,  
//         win = doc.defaultView || doc.parentWindow,  
//         evtObj;  
//     if(doc.createEvent){  
//         if(win.KeyEvent) {  
//             evtObj = doc.createEvent('KeyEvents');  
//             evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );  
//         }  
//         else {  
//             evtObj = doc.createEvent('UIEvents');  
//             Object.defineProperty(evtObj, 'keyCode', {  
//                 get : function() { return this.keyCodeVal; }  
//             });       
//             Object.defineProperty(evtObj, 'which', {  
//                 get : function() { return this.keyCodeVal; }  
//             });  
//             evtObj.initUIEvent( evtType, true, true, win, 1 );  
//             evtObj.keyCodeVal = keyCode;  
//             if (evtObj.keyCode !== keyCode) {  
//                 console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");  
//             }  
//         }  
//         el.dispatchEvent(evtObj);  
//     }   
//     else if(doc.createEventObject){  
//         evtObj = doc.createEventObject();  
//         evtObj.keyCode = keyCode;  
//         el.fireEvent('on' + evtType, evtObj);  
//     }  
// }  


/*****easyUI validate封装****/
// $(document).ready(function(){
// 	 $.extend($.fn.validatebox.defaults.rules, {  
// 		 	maxLength:{
// 	          validator:function(value,param){
// 	            return value.length<=param[0];
// 	          },
// 	          message:'最多{0}个字'
// 	        },
// 	        minLength:{
// 	            validator:function(value,param){
// 	              return value.length >=param[0]
// 	            },
// 	            message:'至少输入{0}个字'
// 	          },
// 	        CHS: {
// 	            validator: function (value, param) {
// 	              return /^[\u0391-\uFFE5]+$/.test(value);
// 	            },
// 	            message: '请输入汉字'
// 	          },
// 	          english : {// 验证英语
// 	                validator : function(value) {
// 	                    return /^[A-Za-z]+$/i.test(value);
// 	                },
// 	                message : '请输入英文'
// 	            },
// 	            ip : {// 验证IP地址
// 	                validator : function(value) {
// 	                    return /\d+\.\d+\.\d+\.\d+/.test(value);
// 	                },
// 	                message : 'IP地址格式不正确'
// 	            },
// 	          ZIP: {
// 	            validator: function (value, param) {
// 	              return /^[0-9]\d{5}$/.test(value);
// 	            },
// 	            message: '邮政编码不存在'
// 	          },
// 	          QQ: {
// 	            validator: function (value, param) {
// 	              return /^[1-9]\d{4,10}$/.test(value);
// 	            },
// 	            message: 'QQ号码不正确'
// 	          },
// 	          mobile: {
// 	            validator: function (value, param) {
// 	              return /^(?:13\d|14\d|15\d|17\d|18\d)-?\d{5}(\d{3}|\*{3})$/.test(value);
// 	            },
// 	            message: '手机号码不正确'
// 	          },
// 	          tel:{
// 	            validator:function(value,param){
// 	              return /^(\d{3}-|\d{4}-)?(\d{8}|\d{7})?(-\d{1,6})?$/.test(value);
// 	            },
// 	            message:'电话号码不正确'
// 	          },
// 	          mobileAndTel: {
// 	            validator: function (value, param) {
// 	              return /(^([0\+]\d{2,3})\d{3,4}\-\d{3,8}$)|(^([0\+]\d{2,3})\d{3,4}\d{3,8}$)|(^([0\+]\d{2,3}){0,1}13\d{9}$)|(^\d{3,4}\d{3,8}$)|(^\d{3,4}\-\d{3,8}$)/.test(value);
// 	            },
// 	            message: '请正确输入电话号码'
// 	          },
// 	          number: {
// 	            validator: function (value, param) {
// 	              return /^[0-9]+.?[0-9]*$/.test(value);
// 	            },
// 	            message: '请输入数字'
// 	          },
// 	          money:{
// 	            validator: function (value, param) {
// 	             	return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
// 	             },
// 	             message:'请输入正确的金额'

// 	          },
// 	          mone:{
// 	            validator: function (value, param) {
// 	             	return (/^(([1-9]\d*)|\d)(\.\d{1,9})?$/).test(value);
// 	             },
// 	             message:'请输入整数或小数'

// 	          },
// 	          integer:{
// 	            validator:function(value,param){
// 	              return /^[+]?[1-9]\d*$/.test(value);
// 	            },
// 	            message: '请输入最小为1的整数'
// 	          },
// 	          integ:{
// 	            validator:function(value,param){
// 	              return /^[+]?[0-9]\d*$/.test(value);
// 	            },
// 	            message: '请输入整数'
// 	          },
// 	          range:{
// 	            validator:function(value,param){
// 	              if(/^[1-9]\d*$/.test(value)){
// 	                return value >= param[0] && value <= param[1]
// 	              }else{
// 	                return false;
// 	              }
// 	            },
// 	            message:'请输入{0}到{1}之间整数'
// 	          },
// 	          //select即选择框的验证
// 	          selectValid:{
// 	            validator:function(value,param){
// 	            	console.info("value="+value);
// 	            	if (value == "" || value.indexOf('请选择') >= 0) { 
// 	                    return false;  
// 	                 }else {  
// 	                    return true;  
// 	                 }    
// 	            },
// 	            message:'该下拉框为必选项'
// 	          },
// 	          idCode:{
// 	            validator:function(value,param){
// 	              return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
// 	            },
// 	            message: '请输入正确的身份证号'
// 	          },
// 	          loginName: {
// 	            validator: function (value, param) {
// 	              return /^[\u0391-\uFFE5\w]+$/.test(value);
// 	            },
// 	            message: '登录名称只允许汉字、英文字母、数字及下划线。'
// 	          },
// 	          equalTo: {
// 	            validator: function (value, param) {
// 	              return value == $(param[0]).val();
// 	            },
// 	            message: '两次输入的字符不一至'
// 	          },
// 	          englishOrNum : {// 只能输入英文和数字
// 	                validator : function(value) {
// 	                    return /^[a-zA-Z0-9_ ]{1,}$/.test(value);
// 	                },
// 	                message : '请输入英文、数字、下划线或者空格'
// 	            },
// 	           xiaoshu:{ 
// 	              validator : function(value){ 
// 	              return /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(value);
// 	              }, 
// 	              message : '最多保留两位小数！'    
// 	          	},
// 	          ddPrice:{
// 	          validator:function(value,param){
// 	            if(/^[1-9]\d*$/.test(value)){
// 	              return value >= param[0] && value <= param[1];
// 	            }else{
// 	              return false;
// 	            }
// 	          },
// 	          message:'请输入1到100之间正整数'
// 	        },
// 	        jretailUpperLimit:{
// 	          validator:function(value,param){
// 	            if(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)){
// 	              return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);
// 	            }else{
// 	              return false;
// 	            }
// 	          },
// 	          message:'请输入0到100之间的最多俩位小数的数字'
// 	        },
// 	        rateCheck:{
// 	          validator:function(value,param){
// 	            if(/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)){
// 	              return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);
// 	            }else{
// 	              return false;
// 	            }
// 	          },
// 	          message:'请输入0到1000之间的最多俩位小数的数字'
// 	        },
// 	        //验证汉字  
// 	        CHS: {  
// 	            validator: function (value) {  
// 	                return /^[\u0391-\uFFE5]+$/.test(value);  
// 	            },  
// 	            message: '只能输入汉字'  
// 	        },
// 	        //车牌验证
// 	        CNUM: {  
// 	        	validator: function (value) {  
// 	        		return /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(value);  
// 	        	},  
// 	        	message: '请输入正确车牌'  
// 	        },
// 	        //七位以上数字,字母,下划线
// 	        PWD: {  
// 	        	validator: function (value) {  
// 	        		return /^\w{6,30}$/.test(value);  
// 	        	},  
// 	        	message: '请输入6位以上数字,字母.'  
// 	        }
// 	 }); 
// });