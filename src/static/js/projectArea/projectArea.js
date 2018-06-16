/**
 * 本JS禁用。无被使用
 */
	var moduleType="";//组件类型
	var drawType="area";//aera  barrier  gallery
	var areaCanvas = "";//正在使用的areaCanvasID
	var barrierCanvas = "";//正在使用的barrierCanvasID
	var galleryCanvas = "";//正在使用的galleryCanvasID
	var c;
	var ctx;
	var areaCanvasNum = 1;
	var barrierCanvasNum = 1;
	var galleryCanvasNum = 1;
	var nowAreaId = "";//当前操作的area
	var $drawArea_statu=true;//同一个canvas，多次绘制结束不会生成额外的表格数据
	var $drawBarrier_statu=true;
	var $drawGallery_statu=true;
	var points = [];
	var areaPoint = [];
	var clear_canvas_addArea=0;//保证回显后点击清除不会清除掉最后的canvas的图像
	//var areaId_state=null;//清空画布
	//var obstacle_state=null;
	
	/**
	 * 新增区域
	 * @param id
	 * @returns
	 */
	function addArea(id){
	    areaId_state=null;
	    
//	    console.log(areaPoint);
	    //防止操作者还没闭合就点击新建区域
        console.log(points[points.length-1]);
        if(points.length>1&&(Math.abs(points[points.length-1][0]-points[0][0])>5)&&(Math.abs(points[points.length-1][1]-points[0][1])>5)){
            $('#myDiv').children().eq(-1).remove();
        }
	    
	    points = [];
	    areaPoint = [];
//	    console.log(points);
//	    console.log(areaPoint);
	    if($('#myDiv').children('canvas[id*="areaId"]').length==0){
	        id = id+areaCanvasNum;
	    }else{
	        var $last_canvas_id_num_name=$('#myDiv').children('canvas[id^="areaId"]').attr('id').substring(0,6);
	        //console.log($('#myDiv').children('canvas[id^="areaId"]').eq(-1).attr('id'));
	        var $last_canvas_id_num=parseInt($('#myDiv').children('canvas[id^="areaId"]').eq(-1).attr('id').substring(6));
	        id=$last_canvas_id_num_name+($last_canvas_id_num+areaCanvasNum);
	        //console.log($last_canvas_id_num+areaCanvasNum);
	    }
		
		var html = '<canvas id="'+id+'" width="500" height="500" style="border:1px solid #CCCCCC;"></canvas>';
		$("#myDiv").append(html);
		areaCanvas = id;
		c = document.getElementById(areaCanvas);
		ctx = c.getContext("2d");
		ctx.strokeStyle='blue';
		c.addEventListener('mousemove',draw);
		c.addEventListener('click',savePoint);
	
		drawType = "area";
		$drawArea_statu=true;
		clear_canvas_addArea=1;
	}
	/**
	 * 新增障碍物
	 * @param id
	 * @returns
	 */
	function addBarrier(id,areaId){
	    var obstacle_state=null;
	    //防止操作者还没闭合就点击新建区域
        console.log(points[points.length-1]);
        if(points.length>1&&(Math.abs(points[points.length-1][0]-points[0][0])>5)&&(Math.abs(points[points.length-1][1]-points[0][1])>5)){
            $('#myDiv').children().eq(-1).remove();
        }
        
        points = [];
        areaPoint = [];
	    if($('#myDiv').children('canvas[id*="barrierId"]').length==0){
            id = id+barrierCanvasNum;
        }else{
            var $last_canvas_id_num_name=$('#myDiv').children('canvas[id^="barrierId"]').attr('id').substring(0,9);
            //console.log($('#myDiv').children('canvas[id^="areaId"]').eq(-1).attr('id'));
            var $last_canvas_id_num=parseInt($('#myDiv').children('canvas[id^="barrierId"]').eq(-1).attr('id').substring(9));
            id=$last_canvas_id_num_name+($last_canvas_id_num+areaCanvasNum);
            //console.log($last_canvas_id_num+areaCanvasNum);
        }
	    nowAreaId = areaId;
		var html = '<canvas id="'+id+'" width="500" height="500" style="border:1px solid #CCCCCC;"></canvas>';
		$("#myDiv").append(html);
		barrierCanvas = id;
		c = document.getElementById(barrierCanvas);
		ctx = c.getContext("2d");
		ctx.strokeStyle='red';
		c.addEventListener('mousemove',draw);
		c.addEventListener('click',savePoint);
		var html_details='<div name='+barrierCanvasNum+'>障碍物:'+barrierCanvasNum+'<button name="del">删除</button><input type="hidden" value="'+barrierCanvasNum+'"/></div>';
		//<button name="edit">修改</button>
		$('#canvas-details-barrier').append(html_details);
		/*$('#canvas-details-barrier button[name=del]').click(function(){
			var del_num=$(this).next().val();
			$("canvas[name='barrier"+del_num+"']").remove();
			
		})*/
		barrierCanvasNum =barrierCanvasNum+1;
		drawType = "barrier";
		$drawBarrier_statu=true;
		clear_canvas_addArea=1;
	}
	/**
	 * 新增运维通道
	 * @param id
	 * @returns
	 */
	function addGallery(id,areaId){
	    obstacle_state=null;
	    //防止操作者还没闭合就点击新建区域
        console.log(points[points.length-1]);
        if(points.length>1&&(Math.abs(points[points.length-1][0]-points[0][0])>5)&&(Math.abs(points[points.length-1][1]-points[0][1])>5)){
            $('#myDiv').children().eq(-1).remove();
        }
        
        points = [];
        areaPoint = [];
		//nowAreaId = areaId;
	    if($('#myDiv').children('canvas[id*="galleryId"]').length==0){
            id = id+galleryCanvasNum;
        }else{
            var $last_canvas_id_num_name=$('#myDiv').children('canvas[id^="galleryId"]').attr('id').substring(0,9);
            //console.log($('#myDiv').children('canvas[id^="areaId"]').eq(-1).attr('id'));
            var $last_canvas_id_num=parseInt($('#myDiv').children('canvas[id^="galleryId"]').eq(-1).attr('id').substring(9));
            id=$last_canvas_id_num_name+($last_canvas_id_num+areaCanvasNum);
            //console.log($last_canvas_id_num+areaCanvasNum);
        }
	    nowAreaId = areaId;
		var html = '<canvas id="'+id+'" width="500" height="500" style="border:1px solid #CCCCCC;"></canvas>';
		$("#myDiv").append(html);
		galleryCanvas = id;
		c = document.getElementById(galleryCanvas);
		ctx = c.getContext("2d");
		ctx.strokeStyle='green';
		c.addEventListener('mousemove',draw);
		c.addEventListener('click',savePoint);
		var html_details='<div name='+galleryCanvasNum+'>运维通道:'+galleryCanvasNum+'<button name="del">删除</button><input type="hidden" value="'+galleryCanvasNum+'"/></div>';
		//<button name="edit">修改</button>
		$('#canvas-details-gallery').append(html_details);
		/*$('#canvas-details-gallery button[name=del]').click(function(){
			var del_num=$(this).next().val();
			$("canvas[name='gallery"+del_num+"']").remove();
		})*/
		galleryCanvasNum =galleryCanvasNum+1;
		drawType = "gallery";
		$drawGallery_statu=true;
		clear_canvas_addArea=1
	}
	

	
	
	
	function draw(e){
	  if(points.length < 1) return;
	  ctx.clearRect(0,0,c.width,c.height); 
	  ctx.beginPath();
	  ctx.moveTo(points[0][0],points[0][1]);
	  for(var i = 1;i < points.length;i++){
	    ctx.lineTo(points[i][0], points[i][1]);
	  }
	  ctx.lineTo(e.offsetX, e.offsetY);
	  ctx.closePath();
	  ctx.stroke();
	}

	
	function savePoint(e){
//		c.addEventListener('mousemove',draw);
		//console.info("before"+points)
		var x = e.offsetX;
		var y= e.offsetY;
	  if(points.length>0){	  		
		  if(points.length>1&&(Math.abs(x-points[0][0])<=5)&&(Math.abs(y-points[0][1])<=5)){
		  	points.push([x, y]);
		  	console.info("闭合完毕");
		  	areaPoint.push(areaPoint[0]);
		  	console.log("传到后台的值"+areaPoint);
		  	console.info("开始复制+++");
		  	
		  	finishDraw();
		  	console.log(areaPoint);
            areaPoint = [];
            console.log(areaPoint);
		  	c.removeEventListener('mousemove',draw);
		  	console.info("连线关闭");
		  	
		  }else{
		  	console.info("连线打开");
		  }
	  }
	  if(points.length>1&&(Math.abs(x-points[0][0])<=5)&&(Math.abs(y-points[0][1])<=5)){
		  	points = [];
		  	
		  	
		}else{
			points.push([x, y]);
			var areaPointValue = '{"x":"'+x+'","y":"'+y+'"}';
			
			areaPoint.push(areaPointValue);
			areaPointValue = [];
		}
	  console.info("points"+points);
	}


	//从后台拿数据画出保存的图像
	function finishDraw(){
		if(drawType == 'area'){
			addAreaDB();
		}else if(drawType == 'barrier'){
			addBarrierDB();
		}else if(drawType == 'gallery'){
			addGalleryDB();
		}
	}
	/**
	 * 调取后台接口传入当前区域信息
	 * @returns
	 */
	function addAreaDB(){
		//var params = '{"corner":[' + areaPoint + '],"areaId":'+areaId_state+'}';
		var params = '{"corner":[' + areaPoint + ']}';
		$.axs("oa/projectArea/saveArea", params, function(data) {
			if(data!=null){
			    var project=data.data;
				var areaId = project.id;
				var areaName = project.name;
				//areaId_state=areaId;
				console.log(project);
//ZC??		本JS为第一阶段使用，如今作废		
				addAreaSuccess(areaId,areaName);//DB插入成功，前段左侧显示
			}
		});
	}
	/**
	 * 调取后台接口传入当前障碍物信息
	 * @returns
	 */
	function addBarrierDB(){
		//var params = '{"corner":[' + areaPoint + '],"areaId":'+nowAreaId+',"type":"1","obstacleId":'+obstacle_state+'}';
		var params = '{"corner":[' + areaPoint + '],"areaId":'+nowAreaId+',"type":"1"}';
		$.axs("oa/projectObstacle/saveObstacle", params, function(data) {
		    //console.log("1232543");
			if(data!=null){
			    var obstacle = data.data;
			   // console.log(corner);
				var obstacleId = obstacle.id;
				var obstacleName = obstacle.name;
				//obstacle_state=obstacleId;
				addbarrierSuccess(obstacleId,obstacleName,nowAreaId);//DB插入成功，前段左侧显示
			}
		});
	}
	function addGalleryDB(){
		//var params = '{"corner":[' + areaPoint + '],"areaId":'+nowAreaId+',"type":"2","obstacleId":'+obstacle_state+'}';
		var params = '{"corner":[' + areaPoint + '],"areaId":'+nowAreaId+',"type":"2"}';
		$.axs("oa/projectObstacle/saveObstacle", params, function(data) {
			if(data!=null){
			    var gallery = data.data;
				var galleryId = gallery.id;
				var galleryName = gallery.name;
				//obstacle_state=galleryId;
				addGallerySuccess(galleryId,galleryName,nowAreaId);//DB插入成功，前段左侧显示
			}
		});
	}
	/**
	 * 画区域成功后，显示
	 * @param areaId 后台返回的
	 * @param areaName 后台返回的
	 * @returns
	 */
	function addAreaSuccess(areaId,areaName){
	    if($drawArea_statu){
	        var moduleTypeHtml = '<option value="">请选择</option>'
	            for(var i=0;i<moduleType.length;i++){
	                moduleTypeHtml += '<option value="'+moduleType[i].id+'">'+moduleType[i].name+'</option>';
	            }
	            var html = '<div id="area_'+areaId+'">'
	            +'<table>'
	            +'<tr>'
	            +'<td>'+areaName+'</td>'
	            +'<td></td>'
	            +'<td><input type="button" onclick="delArea(\'area_'+areaId+'\',\''+areaCanvas+'\')" value="删除"/></td>'
	            +'</tr>'
	            +'<tr>'
	            +'<td>方位角(。):</td>'
	            +'<td><input type="text" id="azimuth_'+areaId+'" oninput="circle('+areaId+')"/></td>'
	            +'<td><div id="azimuth_'+areaId+'circliful"></div></td>'
	            +'</tr>'
	            +'<tr>'
	            +'<td>坡度角:</td>'
	            +'<td><input type="text" value="0" id="slope_'+areaId+'"/></td>'
	            +'<td>%</td>'
	            +'</tr>'
	            +'<tr>'
	            +'<td>护栏高度(m):</td>'
	            +'<td><input type="text" value="5" id="wallLength_'+areaId+'"/></td>'
	            +'<td></td>'
	            +'</tr>'
	            +'<tr>'
	            +'<td>护栏边距(m):</td>'
	            +'<td><input type="text" value="5" id="wallGap_'+areaId+'"/></td>'
	            +'<td></td>'
	            +'</tr>'
	            +'<tr>'
	            +'<td>组件品牌:</td>'
	            +'<td>'
	            +'<select onchange="getModuleList(\''+areaId+'\')" id="muduleType_'+areaId+'">'
	            +moduleTypeHtml
	            +'</select>'
	            +'</td>'
	            +'<td></td>'
	            +'</tr>'
	            +'<tr>'
	            +'<td>组件型号:</td>'
	            +'<td>'
	            +'<select id="mudule_'+areaId+'">'
	            +'</select>'
	            +'</td>'
	            +'<td></td>'
	            +'</tr>'
	            +'<tr>'
	            +'<td><input type="button" onclick="getModuleInfo(\''+areaId+'\')" value="组件详细信息"></td>'
	            +'<td></td>'
	            +'<td><input type="button" value="新建组件"></td>'
	            +'</tr>'
	            +'</table>'
	            +'</div>';
	            $("#areaId").append(html);
	             
	            var params_barrier = '{}';
	            $.axs("oa/projectArea/getByProjicetId", params_barrier, function(data) {
	                if(data.code==200){
	                    var projectList = data.data;
	                    //console.log(projectList);
	                        var html = '<div id="barrierList_'+projectList[projectList.length-1].id+'">';
	                        html += '</div>';
	                        html += '<div><input type="button" value="'+projectList[projectList.length-1].name+'(点击增加障碍物)" id="addBarrier_'+projectList[projectList.length-1].id+'" style="width:100%" onclick="addBarrier(\'barrierCorner\','+projectList[projectList.length-1].id+')"></div>';
	                        $("#barrierId").append(html);
	                    
	                }else{
	                    alert("操作异常");
	                }
	            });
	            
	            var params_gallery = '{}';
	            $.axs("oa/projectArea/getByProjicetId", params_gallery, function(data) {
	               if(data.code==200){
	                   var projectList = data.data;
	                   var n=projectList.length-1;
	                       var html = '<div id="galleryList_'+projectList[n].id+'">';
	                       html += '</div>';
	                       html += '<div id="galleryList_'+projectList[n].id+'"></div>';
	                       html += '<div><input type="button" value="'+projectList[n].name+'(点击增加通道)" id="addGallery_'+projectList[n].id+'" style="width:100%" onclick="addGallery(\'galleryId\','+projectList[n].id+')"></div>';
	                       $("#galleryId").append(html);
	               }else{
	                   alert("操作异常");
	               }
	           });
	    }
	    $drawArea_statu=false;
	}
	
	function addbarrierSuccess(barrierId,barrierIdName,areaId){
	    if($drawBarrier_statu){
	        $('#'+barrierCanvas).attr('id','barrierCorner_'+barrierId);
	        barrierCanvas='barrierCorner_'+barrierId;
	        var html = '<div id="barrier_'+barrierId+'">'
	        +'<table>'
	        +'<tr>'
	        +'<td>'+barrierIdName+'</td>'
	        +'<td></td>'
	        +'<td><input type="button" onclick="delbarrier(\'barrier_'+barrierId+'\',\''+barrierCanvas+'\')" value="删除"/></td>'
	        +'</tr>'
	        +'<tr>'
	        +'<td>障碍物边距(m):</td>'
	        +'<td><input type="text" value="1.2" id="bakstr1_'+barrierId+'"/></td>'
	        +'<td></td>'
	        +'</tr>'
	        +'<tr>'
	        +'<td>障碍物高度(m):</td>'
	        +'<td><input type="text" value="0.5" onchange="barrierShadow(\''+barrierCanvas+'\')" id="heigth_'+barrierId+'"/></td>'
	        +'<td></td>'
	        +'</tr>'
	        +'</table>'
	        +'</div>';
	        $("#barrierList_"+areaId).append(html);
	        
	    }
	    $drawBarrier_statu=false;
	}
	function addGallerySuccess(galleryId,galleryName,areaId){
		if($drawGallery_statu){
		    galleryCanvas=$('#'+galleryCanvas).attr('id','galleryCorner_'+galleryId);
		    var html = '<div id="gallery_'+galleryId+'">'
	        +'<table>'
	        +'<tr>'
	        +'<td>'+galleryName+'</td>'
	        +'<td></td>'
	        +'<td><input type="button" onclick="delgallery(\'gallery_'+galleryId+'\',\''+galleryCanvas+'\')" value="删除"/></td>'
	        +'</tr>'
	        +'<tr>'
	        +'<td>运维通道宽度(m):</td>'
	        +'<td><input type="text" value="0.5" id="bakstr1_'+galleryId+'"/></td>'
	        +'<td></td>'
	        +'</tr>'
	        +'</table>'
	        +'</div>';
	        $("#galleryList_"+areaId).append(html);
		}
		$drawGallery_statu=false;
	}
	/**
	 * 删除障碍物
	 * @param areaId  对应数据库的areaID
	 * @param canvasAreaId 对应页面canvasId
	 * @returns
	 */
	function delbarrier(barrierId,canvasBarrierId){
	    
	  
		//1:调ajax接口删除数据库
		//2:删除canvas
		//3:删除左侧区域
		var barrierDbId = barrierId.split("_")[1];
		var params = '{"obstacleId":"' + barrierDbId + '"}';
		$.axs("oa/projectObstacle/deleteObstacle", params, function(data) {
			if(data!=null&&data.code==200){
				$("#"+barrierId).remove();//删除左侧数据区域
				$("#"+canvasBarrierId).remove();//删除canvas区域
			}
		});
	}
	/**
	 * 删除运维通道
	 * @param areaId  对应数据库的areaID
	 * @param canvasAreaId 对应页面canvasId
	 * @returns
	 */
	function delgallery(galleryId,canvasGalleryId){
	    
	  
		//1:调ajax接口删除数据库
		//2:删除canvas
		//3:删除左侧区域
		var galleryDbId = galleryId.split("_")[1];
		var params = '{"obstacleId":"' + galleryDbId + '"}';
		$.axs("oa/projectObstacle/deleteObstacle", params, function(data) {
			if(data!=null&&data.code==200){
				$("#"+galleryId).remove();//删除左侧数据区域
				$("#"+canvasGalleryId).remove();//删除canvas区域
			}
		});
	}
	/**
	 * 删除区域
	 * @param areaId  对应数据库的areaID
	 * @param canvasAreaId 对应页面canvasId
	 * @returns
	 */
	function delArea(areaId,canvasAreaId){
	    
	  
		//1:调ajax接口删除数据库
		//2:删除canvas
		//3:删除左侧区域
		var areaDbId = areaId.split("_")[1];
		var params = '{"areaId":"' + areaDbId + '"}';
		$.axs("oa/projectArea/deleteArea", params, function(data) {
			if(data!=null&&data.code==200){
				$("#"+areaId).remove();//删除左侧数据区域
				$("#"+canvasAreaId).remove();//删除canvas区域
				$("#barrierList_"+areaDbId).remove();//删除障碍物区域				
				$("#addBarrier_"+areaDbId).remove();//删除障碍物按钮
				
				$("#galleryList_"+areaDbId).remove();//删除运维通道
				$("#addGallery_"+areaDbId).remove();//删除运维通道按钮
//ZC??				
			}
		});
	}
	//障碍物阴影
	function barrierShadow(canvasBarrierId){
	    var ctx=document.getElementById(canvasBarrierId);
	    var c=ctx.getContext('2d');
	    console.log(ctx);
	    
	    c.fillStyle="rgba(192,80,77,.3)";
	    c.beginPath();
	    
	    var params="{}";
	    //alert("1");
	    $.axs("oa/projectObstacle/calculateShadow", params, function(data) {
	        if(data!=null&&data.code==200){
    	        var projectList = data.data;
    	        var res=JSON.parse(projectList);
    	        if(res!=null){
    	            console.log(res);
    	            console.log(res[0].x);
    	            
                    c.moveTo(res[0].x,res[0].y);
                    for(var i=1;i<res.length;i++){
                        c.lineTo(res[i].x,res[i].y);
                        c.fill();
                    }
    	                
    	        }
	        }
            //console.log(projectList);
            
        });
	    
	}
	//清空画布
	
	/*//清空当前画布--区域
	function clearCanvasArea(areaId){
        //alert("111111111");
	      
        //1:调ajax接口删除数据库
        var areaDbId = areaId.split("_")[1];
        var params = '{"areaId":' + areaDbId + '}';
       // var params = '{"corner":[' + areaPoint + '],"areaId":'+nowAreaId+',"type":"1"}';
        $.axs("oa/projectArea/deleteCorner", params, function(data) {
            if(data!=null&&data.code==200){
                console.log("清除画布成功");
            }
        });
    }
	//清空当前画布--障碍物
    function clearCanvasBarrier(barrierId){
        //alert("111111111");
          
        //1:调ajax接口删除数据库
        var barrierDbId = barrierId.split("_")[1];
        var params = '{"obstacleId":"' + barrierDbId + '","obstacleId":'+obstacle_state+'}';
       // var params = '{"corner":[' + areaPoint + '],"areaId":'+nowAreaId+',"type":"1"}';
        $.axs("oa/projectObstacle/deleteCorner", params, function(data) {
            if(data!=null&&data.code==200){
                console.log("清除画布成功");
            }
        });
    }
  //清空当前画布--运维通道
    function clearCanvasGallery(galleryId){
        //alert("111111111");
          
        //1:调ajax接口删除数据库
        var galleryDbId = galleryId.split("_")[1];
        var params = '{"obstacleId":"' + galleryDbId + '","obstacleId":'+obstacle_state+'}';
       // var params = '{"corner":[' + areaPoint + '],"areaId":'+nowAreaId+',"type":"1"}';
        $.axs("oa/projectObstacle/deleteCorner", params, function(data) {
            if(data!=null&&data.code==200){
                console.log("清除画布成功");
            }
        });
    }*/
	/**
	 * 获得组件类型
	 * @returns
	 */
	function getModuleType(){
		var params = '';
		$.axs("oa/ModuleType/getModuleType", params, function(data) {
			if(data.code==200){
				moduleType = JSON.parse(data.data);
			}
		});
	}
	/**
	 * 获得组件列表
	 * @returns
	 */
	function getModuleList(areaId){
		var moduleTypeIdValue = $("#muduleType_"+areaId).find("option:selected").text();
		var params = '{"moduleTypeName":"' + moduleTypeIdValue + '"}';
		$.axs("oa/Module/getModuleList", params, function(data) {
			if(data.code==200){
				module = JSON.parse(data.data);
				$("#mudule_"+areaId).empty();
				var moduleHtml = "";
				for(var i=0;i<module.length;i++){
					$("#mudule_"+areaId).append('<option value="'+module[i].id+'">'+module[i].moduleName+'</option>');
				}
				
			}
		});
	}
	
	function getModuleInfo(areaId){
		var moduleTypeText = $("#muduleType_"+areaId).find("option:selected").text();
		var moduleText = $("#mudule_"+areaId).find("option:selected").text();
		var object = new Object();
		object.moduleTypeName = moduleTypeText;
		object.moduleName = moduleText;
		var params = JSON.stringify(object);
		$.axs("oa/Module/getModuleInfo", params, function(data) {
			if(data.code==200){
				var module = JSON.parse(data.data);
				if(module!=null&&module.length>0){
					var mod = module[0];
					if(mod.moduleName!=null){
						$("#moduleName").empty().val(mod.moduleName);
					}
					if(mod.wp!=null){
						$("#wp").empty().val(mod.wp);
					}
					if(mod.wpm!=null){
						$("#wpm").empty().val(mod.wpm);
					}
					if(mod.imp!=null){
						$("#imp").empty().val(mod.imp);
					}
					if(mod.voc!=null){
						$("#voc").empty().val(mod.voc);
					}
					if(mod.tkVoc!=null){
						$("#tkVoc").empty().val(mod.tkVoc);
					}
					if(mod.isc!=null){
						$("#isc").empty().val(mod.isc);
					}
					if(mod.batterySize!=null){
						$("#batterySize").empty().val(mod.batterySize);
					}
					if(mod.batteryNum!=null){
						$("#batteryNum").empty().val(mod.batteryNum);
					}
					var batterLWH = "";
					if(mod.muduleLength!=null){
						batterLWH+=(mod.muduleLength);
					}
					if(mod.muduleWidth!=null){
						batterLWH+=("*"+mod.muduleWidth);
					}
					if(mod.muduleThick!=null){
						batterLWH+=("*"+mod.muduleThick);
					}
					$("#muduleLength").empty().val(batterLWH);
					$('.index-mask').show();
					$('.index-message').show();
				}
			}
		});
	}
	
	function circle(areaId){
           var azimuth = $('#azimuth_'+areaId).val();
           var statHtml = '<div id="myStat_'+areaId+'" data-dimension="30" data-width="2" data-fontsize="38" data-type="full" data-total="90" data-part="'+azimuth+'" data-bgcolor="#fff" data-fill="#eee"></div>';
           $('#azimuth_'+areaId+"circliful").empty().append(statHtml);
           $('#myStat_'+areaId).circliful();
	        
	}
	//yucx 
	/**
     * 获得组件列表
     * @returns
     */
    function getModule(){
        var moduleTypeIdValue = $("#moduleType").find("option:selected").text();
        var params = '{"moduleTypeName":"' + moduleTypeIdValue + '"}';
        $.axs("oa/Module/getModuleList", params, function(data) {
            if(data.code==200){
                module = JSON.parse(data.data);
                $("#module").empty();
                var moduleHtml = "";
                for(var i=0;i<module.length;i++){
                    $("#module").append('<option value="'+module[i].id+'">'+module[i].moduleName+'</option>');
                }
                
            }
        });
    }
