var satelliteMap = L.tileLayer.chinaProvider('Google.Satellite.Map', {
    maxZoom : 20,
    minZoom : 5
});

var map = L.map("map", {
	editable:true,
    center : [ 31.23, 121.47 ],
    zoom : 18,
    layers : [ satelliteMap ],
    zoomControl : false,
    attributionControl:false
});
var falsg=false;//默认无右键
var rightOb=false;

var isDrawObstacle=false;//记录是否绘制了障碍物
var isDrawHouse=false;//记录是否绘制了屋顶

var drawnItems = new L.FeatureGroup();
var layer_str;
//编辑
var prev_edit_id;//记录上一个编辑的多边形
var now_edit_id;
var prev_layer_mes;//记录上一个layer
var statu_limit_house=1;//限制(点击多边形开始，同时再点击他结束。然后再点击其他的多边形，确保他不会进入edit_post_house()函数里，毕竟仅仅是为了打开编辑)
var statu_limit_barrier=1;//同上
var layer_click_time_area=0;
//var timer;//定时器
var circleGroup1 = new L.FeatureGroup();
map.addLayer(circleGroup1);
drawnItems.on("click",function(e){
    stopEvent(e);
    var layer = e.layer;
    layer_str=layer.id;
    now_edit_id=layer.id;
    var before_layer=prev_edit(now_edit_id);
    var before_layer_arr=before_layer._latlngs[0];

    /***
     * 编辑中的直角提示 
     * lastPoint： 当前编辑点的上一个点
     * nextPoint： 当前编辑点的下一个点
     */
    var lastPoint,nextPoint; 
    //鼠标拖动的时候进行计算垂直，如果在一定范围误差内垂直，则给出邻边提示
    map.on('editable:vertex:drag', function (e) {
        circleGroup1.clearLayers();
        var point18=map.project(e.latlng,18);
        var x=Math.round(point18.x);
        var y=Math.round(point18.y);
        var d1=Math.pow(map.project(lastPoint,18).x-map.project(nextPoint,18).x,2)+Math.pow(map.project(lastPoint,18).y-map.project(nextPoint,18).y,2);
        var d2=Math.pow(map.project(nextPoint,18).x-x,2)+Math.pow(map.project(nextPoint,18).y-y,2);
        var d3=Math.pow(map.project(lastPoint,18).x-x,2)+Math.pow(map.project(lastPoint,18).y-y,2);
        var rang = 200;
        //d1 斜边，d2 d3是直角边
        if(d1-rang<=d3+d2&&d3+d2<=d1+rang){
            var latlngs = [];
            latlngs.push(lastPoint);
            latlngs.push(e.latlng);
            latlngs.push(nextPoint);
            var polyline = L.polyline(latlngs, { color: '#f5e74e',  
                opacity: 0.5,  
                weight: 9 });
            circleGroup1.addLayer(polyline);
        }
    })
    //编辑拖动结束，取消所有的垂直提示
    map.on('editable:vertex:dragend', function (e) {
        circleGroup1.clearLayers();
    })
    //数遍选择vertex的时候获得上下相邻的两个顶点
    map.on('editable:vertex:mousedown', function (e) {
    	 circleGroup1.clearLayers();
        var layer = e.layer;
        var lnglat = layer._latlngs[0];
        var lastPointIndex,nextPointIndex;
        for(var i = 0 ;i<lnglat.length;i++){
            if(e.latlng.lat==lnglat[i].lat&&e.latlng.lng==lnglat[i].lng){
                if(i==lnglat.length-1){
                    lastPointIndex = i-1;
                    nextPointIndex = 0;
                    console.info("before1:"+(i-1)+" after:"+(0));
                }else if(i==0){
                    lastPointIndex = lnglat.length-1;
                    nextPointIndex = i+1;
                    console.info("before2:"+(lnglat.length-1)+" after:"+(i+1));
                }else{
                    lastPointIndex = i-1;
                    nextPointIndex = i+1;
                    console.info("before3:"+(i-1)+" after:"+(i+1));
                }
            }
        }
        lastPoint = lnglat[lastPointIndex];
        nextPoint =  lnglat[nextPointIndex];
    })
    if(layer_str.indexOf("house")>-1){
    	var par = '{"id":"1"}';
    	//分页数据
    	$.ins("oa/projectArea/getAreaListByProjicetId", par, function(data) {
    		if(data.code==200&&data.data.length>0){
    			var projectAreaList = data.data;
    			if(projectAreaList.length>5){
	    			for (var i = 0; i < projectAreaList.length; i++) {
						if(projectAreaList[i].bakstr1==layer_str){
							var projectSize = Math.ceil((i+1)/5);
							$("#areaPage").find("span").removeClass("round");
							$("#areaPage"+projectSize).attr("class","round");
							getAllAreaList(projectSize-1);
							break;
						}
					}
    			}
    		}
    	});
    	
        $("#"+layer_str).siblings().css('background-color','#FFF').end().css('background-color','#f5f5f5');
        $("#"+layer_str).addClass('title_active').siblings().removeClass('title_active');
        for(var i in map._layers) {
            if (map._layers[i] instanceof L.Polygon) {
                if(map._layers[i].id.indexOf("house")>-1){
                    map._layers[i].setStyle({color:house_b_color,opacity:house_l_opacity,fillOpacity: house_f_opacity});  
                };
                if(map._layers[i].id.indexOf("barrier")>-1){
                    map._layers[i].setStyle({color:barrier_b_color,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity});
                };
                if((map._layers[i].id.indexOf("house")>-1||map._layers[i].id.indexOf("barrier")>-1)&&map._layers[i].id!=layer.id){
                    map._layers[i].disableEdit();
                    //map._layers[i].enableEdit();
                };
                if(map._layers[i].id ==now_edit_id){
//                  if(map._layers[i].editing._enabled!=true){
                  if(map._layers[i].editEnabled()!=true){
                      //map._layers[i].editing.enable();
                      map._layers[i].enableEdit();
                      if(prev_edit_id!=null&&prev_layer_mes!=null&&prev_edit_id!=now_edit_id&&statu_limit_house!=0){
                          var prev_layer=prev_edit(prev_edit_id);
                          if(prev_layer.id.indexOf("house")>-1){
                              //clearTimeout(timer);
                              //timer=setTimeout(function () {
                                  if(layer_click_time_area==0||(layer_click_time_area!=L.GeometryUtil.geodesicArea(prev_layer._latlngs[0]))){
                                      edit_post_house(prev_layer._latlngs,prev_edit_id,prev_layer_mes);
                                  };
                                 // edit_post_house(prev_layer._latlngs,prev_edit_id,prev_layer_mes);
                              //}, 500);
                          }else if(prev_layer.id.indexOf("barrier")>-1){
                              //setTimeout(function () {
                              if(layer_click_time_area==0||(layer_click_time_area!=L.GeometryUtil.geodesicArea(prev_layer._latlngs[0]))){
                                  edit_post_barrier(prev_layer._latlngs,prev_edit_id,prev_layer_mes);
                              };
                                 // edit_post_barrier(prev_layer._latlngs,prev_edit_id,prev_layer_mes); 
                              //}, 500 + Math.random() * 1500);
                          }
                      };
                      statu_limit_house=1;
                      prev_edit_id=now_edit_id;
                      prev_layer_mes=layer;
                      layer_click_time_area=L.GeometryUtil.geodesicArea(map._layers[i]._latlngs[0]);
                  }else{
                      //map._layers[i].editing.disable();
                      //map._layers[i].disableEdit();
                      //var now_layer=prev_edit(now_edit_id);
                      //setTimeout(function () {
//                          if(layer_click_time_area!=L.GeometryUtil.geodesicArea(now_layer._latlngs[0])){
                          /*if(layer_click_time_area==0||(layer_click_time_area!=L.GeometryUtil.geodesicArea(now_layer._latlngs[0]))){
                              edit_post_house(now_layer._latlngs,now_edit_id,layer);
                          };*/
                          
                      //}, 500 + Math.random() * 1500);
                          //layer_click_time_area=L.GeometryUtil.geodesicArea(map._layers[i]._latlngs[0]);
                      //console.info("执行结果："+complete(now_layer._latlngs,now_edit_id,layer));
                      //edit_post_house(now_layer._latlngs,now_edit_id,layer); 
                      //statu_limit_house=0;
                  }
              };
                if(map._layers[i].id ==layer_str){
                    map._layers[i].setStyle({color:"#f5e74e",opacity:house_l_opacity,fillOpacity: house_f_opacity});
                    house_detail_id=layer_str;
                    var ol=map._layers[i];
                    showDetailDesign();
                    showTab1();
                    rightOb=true;
                    if(rightOb==true){
                        $("#map").contextMenu({
                            menu: [
                                {
                                    text: "复制",
                                    trigger: 'none',
                                    callback: function() {
                                        getOffset(layer_str,rightOb);
                                        rightOb=false;
                                    }
                                    
                                },
                                {
                                    text: "删除",
                                    trigger: 'none',
                                    callback: function() {
                                        deleteAreaHouse(layer_str,rightOb);
                                        rightOb=false;
                                    }
                                }
                            ]
                        })
                    }
                }
            }
        }
    };
    if(layer_str.indexOf("barrier")>-1){
    	var barPa = '{"type":"1"}';
    	$.ins("oa/projectObstacle/getObstacleValue", barPa, function(data) {
        	if(data.code==200&&data.data.length>0){
        		var projectBarList = data.data;
        		$("#barPage").show();
                //分页数据
                var projectSize = Math.ceil(data.data.length/5);
                var str = "<ul>";
                str+="<li><span onclick='barPageUp()'  class='icon_arrow1_left' ></span></li>";
                str+="<li><span id='barPage1' class='round1' onclick='changeBarPageNum(this,0)'>1</span></li>";
                for (var i = 2; i <= projectSize; i++) {
                    var j = i-1;
                    str+='<li><span id="barPage'+i+'" onclick=changeBarPageNum(this,'+j+')>'+i+'</span></li>';
                }
                str+="<li><span onclick='barPageDown()'  class='icon_arrow1_right'></span></li>";
                str+="</ul>";
                $("#barPage").html(str);
                $("#height2").find(".create_roof").remove();
        		if(projectBarList.length>5){
	    			for (var i = 0; i < projectBarList.length; i++) {
						if(projectBarList[i].bakstr1==layer_str){
							var barSize = Math.ceil((i+1)/5);
							$("#barPage").find("span").removeClass("round1");
							$("#barPage"+barSize).attr("class","round1");
							getAllBarrierList(barSize-1);
							break;
						}
					}
    			}else{
    				getAllBarrierList(0);
    			}
            }
        })
        $("#"+layer_str).siblings().css('background-color','#FFF').end().css('background-color','#f5f5f5');
        $("#"+layer_str+" .angle_ipt5").css('background-color','#f5f5f5').parents("div[id^='barrier']").siblings().find('.angle_ipt5').css('background-color','#FFF');
        for(var i in map._layers) {
            if (map._layers[i] instanceof L.Polygon) {
                if(map._layers[i].id.indexOf("house")>-1){
                    map._layers[i].setStyle({color:house_b_color,opacity:house_l_opacity,fillOpacity: house_f_opacity});  
                    //map._layers[i].editing.disable();
                };
                if(map._layers[i].id.indexOf("barrier")>-1){
                    map._layers[i].setStyle({color:barrier_b_color,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity});
                    //map._layers[i].editing.disable();
                };
                if((map._layers[i].id.indexOf("house")>-1||map._layers[i].id.indexOf("barrier")>-1)&&map._layers[i].id!=layer.id){
                    //var prev_layer=prev_edit();
                    //map._layers[i].editing.disable();
                    map._layers[i].disableEdit();
                };
                if(map._layers[i].id ==now_edit_id){
                    if(map._layers[i].editEnabled()!=true){
                        //map._layers[i].editing.enable();
                        map._layers[i].enableEdit();
                        if(prev_edit_id!=null&&prev_layer_mes!=null&&prev_edit_id!=now_edit_id&&statu_limit_barrier!=0){
                            var prev_layer=prev_edit(prev_edit_id);
                            if(prev_layer.id.indexOf("house")>-1){
                                //setTimeout(function () {
                                if(layer_click_time_area==0||(layer_click_time_area!=L.GeometryUtil.geodesicArea(prev_layer._latlngs[0]))){
                                    edit_post_house(prev_layer._latlngs,prev_edit_id,prev_layer_mes);
                                };
                                //}, 500 + Math.random() * 1500);
                            }else if(prev_layer.id.indexOf("barrier")>-1){
                                //setTimeout(function () {
                                if(layer_click_time_area==0||(layer_click_time_area!=L.GeometryUtil.geodesicArea(prev_layer._latlngs[0]))){
                                    edit_post_barrier(prev_layer._latlngs,prev_edit_id,prev_layer_mes);
                                };
                                //}, 500 + Math.random() * 1500);
                            }
                        };
                        statu_limit_barrier=1;
                        statu_limit_house=1;
                        prev_edit_id=now_edit_id;
                        prev_layer_mes=layer;
                        layer_click_time_area=L.GeometryUtil.geodesicArea(map._layers[i]._latlngs[0]);
                    }else{
                        //map._layers[i].editing.disable();
                        //map._layers[i].disableEdit();
                        //var now_layer=prev_edit(now_edit_id);
                        //setTimeout(function () {
                            //edit_post_barrier(now_layer._latlngs,now_edit_id,layer); 
                        //}, 500 + Math.random() * 1500);
                        //statu_limit_barrier=0;
                        //layer_click_time_area=L.GeometryUtil.geodesicArea(map._layers[i]._latlngs[0]);
                    }
                };
                if(map._layers[i].id ==layer_str){
                    map._layers[i].setStyle({color:"#f5e74e",opacity:0.8,fillOpacity: 0.5});
                    //map._layers[i].editing.enable();
                    falsg=true;//障碍物
                    showTab2();
                    if(falsg==true){
                        $("#map").contextMenu({
                            menu: [
                                {
                                    text: "复制",
                                    callback: function() {
                                        getCopyObstacle(layer_str,falsg);
                                        falsg=false;
                                    }
                                },
                                {
                                    text: "删除",
                                    callback: function() {
                                        deleteObstacle(layer_str,falsg);
                                        falsg=false;
                                    }
                                }
                            ]
                        });
                    }
                }
            }
        }
    }
//    map._layers[i].setStyle({color:"#3388ff",opacity:0.8,fillOpacity: 0.5});
},this);

drawnItems.on("dblclick//this function is cancel",function(e){
    stopEvent(e);
    var layer = e.layer;
    now_edit_id=layer.id;
    var before_layer=prev_edit(now_edit_id);
    var before_layer_arr=before_layer._latlngs[0];
    
    /***
     * 编辑中的直角提示 
     * lastPoint： 当前编辑点的上一个点
     * nextPoint： 当前编辑点的下一个点
     */
    var lastPoint,nextPoint;
   
    //鼠标拖动的时候进行计算垂直，如果在一定范围误差内垂直，则给出邻边提示
    map.on('editable:vertex:drag', function (e) {
    	circleGroup1.clearLayers();
    	var point18=map.project(e.latlng,18);
    	var x=Math.round(point18.x);
    	var y=Math.round(point18.y);
    	var d1=Math.pow(map.project(lastPoint,18).x-map.project(nextPoint,18).x,2)+Math.pow(map.project(lastPoint,18).y-map.project(nextPoint,18).y,2);
    	var d2=Math.pow(map.project(nextPoint,18).x-x,2)+Math.pow(map.project(nextPoint,18).y-y,2);
    	var d3=Math.pow(map.project(lastPoint,18).x-x,2)+Math.pow(map.project(lastPoint,18).y-y,2);
    	var rang = 700;
    	//d1 斜边，d2 d3是直角边
    	if(d1-rang<=d3+d2&&d3+d2<=d1+rang){
    		circleGroup1.clearLayers();
    		var latlngs = [];
    		latlngs.push(lastPoint);
    		latlngs.push(e.latlng);
    		latlngs.push(nextPoint);
    		var polyline = new L.polyline(latlngs, { color: '#f5e74e',  
			    opacity: 0.5,  
			    weight: 9 });
    		circleGroup1.addLayer(polyline);
    	}
    })
    //编辑拖动结束，取消所有的垂直提示
    map.on('editable:vertex:dragend', function (e) {
    	circleGroup1.clearLayers();
    })
    //数遍选择vertex的时候获得上下相邻的两个顶点
    map.on('editable:vertex:mousedown', function (e) {
    	circleGroup1.clearLayers();
    	var layer = e.layer;
        var lnglat = layer._latlngs[0];
        var lastPointIndex,nextPointIndex;
        for(var i = 0 ;i<lnglat.length;i++){
        	if(e.latlng.lat==lnglat[i].lat&&e.latlng.lng==lnglat[i].lng){
        		if(i==lnglat.length-1){
        			lastPointIndex = i-1;
        			nextPointIndex = 0;
        			console.info("before1:"+(i-1)+" after:"+(0));
        		}else if(i==0){
        			lastPointIndex = lnglat.length-1;
        			nextPointIndex = i+1;
        			console.info("before2:"+(lnglat.length-1)+" after:"+(i+1));
        		}else{
        			lastPointIndex = i-1;
        			nextPointIndex = i+1;
        			console.info("before3:"+(i-1)+" after:"+(i+1));
        		}
        	}
        }
        lastPoint = lnglat[lastPointIndex];
        nextPoint =  lnglat[nextPointIndex];
        circleGroup1.clearLayers();
    })
    //event.stopPropagation();
    //event.preventDefault();
    var layer = e.layer;
    now_edit_id=layer.id;
        if(now_edit_id.indexOf("house")>-1){
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                	var flag66 = map._layers[i];
                    //关闭非当前编辑的编辑状态图形
                    if((map._layers[i].id.indexOf("house")>-1||map._layers[i].id.indexOf("barrier")>-1)&&map._layers[i].id!=layer.id){
                        map._layers[i].disableEdit();
                    	//map._layers[i].enableEdit();
                    };
                    if(map._layers[i].id ==now_edit_id){
//                        if(map._layers[i].editing._enabled!=true){
                    	if(map._layers[i].editEnabled()!=true){
                            //map._layers[i].editing.enable();
                        	map._layers[i].enableEdit();
                            if(prev_edit_id!=null&&prev_layer_mes!=null&&prev_edit_id!=now_edit_id&&statu_limit_house!=0){
                                var prev_layer=prev_edit(prev_edit_id);
                                if(prev_layer.id.indexOf("house")>-1){
                                	setTimeout(function () {
                                		edit_post_house(prev_layer._latlngs,prev_edit_id,prev_layer_mes);
                                	}, 500 + Math.random() * 1500);
                                }else if(prev_layer.id.indexOf("barrier")>-1){
                                	setTimeout(function () {
                                		edit_post_barrier(prev_layer._latlngs,prev_edit_id,prev_layer_mes); 
                                	}, 500 + Math.random() * 1500);
                                }
                            };
                            statu_limit_house=1;
                            prev_edit_id=now_edit_id;
                            prev_layer_mes=layer;
                        }else{
                            //map._layers[i].editing.disable();
                        	map._layers[i].disableEdit();
                            var now_layer=prev_edit(now_edit_id);
//                            setTimeout(function () {
                                edit_post_house(now_layer._latlngs,now_edit_id,layer);
//                            }, 500 + Math.random() * 1500);
                            //console.info("执行结果："+complete(now_layer._latlngs,now_edit_id,layer));
                            //edit_post_house(now_layer._latlngs,now_edit_id,layer); 
                            statu_limit_house=0;
                        }
                    };
                }
            }
        };
        if(now_edit_id.indexOf("barrier")>-1){
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if((map._layers[i].id.indexOf("house")>-1||map._layers[i].id.indexOf("barrier")>-1)&&map._layers[i].id!=layer.id){
                        //var prev_layer=prev_edit();
                        //map._layers[i].editing.disable();
                    	map._layers[i].disableEdit();
                    };
                    if(map._layers[i].id ==now_edit_id){
                        if(map._layers[i].editEnabled()!=true){
                            //map._layers[i].editing.enable();
                        	map._layers[i].enableEdit();
                            if(prev_edit_id!=null&&prev_layer_mes!=null&&prev_edit_id!=now_edit_id&&statu_limit_barrier!=0){
                                var prev_layer=prev_edit(prev_edit_id);
                                if(prev_layer.id.indexOf("house")>-1){
                                	setTimeout(function () {
                                		edit_post_house(prev_layer._latlngs,prev_edit_id,prev_layer_mes);
                                	}, 500 + Math.random() * 1500);
                                }else if(prev_layer.id.indexOf("barrier")>-1){
                                	setTimeout(function () {
                                		edit_post_barrier(prev_layer._latlngs,prev_edit_id,prev_layer_mes); 
                                	}, 500 + Math.random() * 1500);
                                }
                            };
                            statu_limit_barrier=1;
                            prev_edit_id=now_edit_id;
                            prev_layer_mes=layer;
                        }else{
                            //map._layers[i].editing.disable();
                        	map._layers[i].disableEdit();
                            var now_layer=prev_edit(now_edit_id);
                            setTimeout(function () {
                            	edit_post_barrier(now_layer._latlngs,now_edit_id,layer); 
                            }, 500 + Math.random() * 1500);
                            statu_limit_barrier=0;
                        }
                    };
                }
            }
        }
},this);

//判断页面上有无打开的多边形
/*function complete(nowLayerLatLngs,now_edit_id,layer){
    var timer1 = setTimeout(edit_post_house(nowLayerLatLngs,now_edit_id,layer),2000);
    return 1;
}*/
function prev_edit(id){
    for(var j in map._layers) {
        if(map._layers[j].id == id){
            return map._layers[j];
            break;
        }
    }
}
function edit_post_house(latLngs,id,layer){
    //编辑的corner获取
    console.log("----------------------------------:"+id+"  layerId:"+layer.id);
    var edit_default=[];
    for(var i=0;i<latLngs[0].length;i++){
        var point_default_zoom=map.project(latLngs[0][i],18);
       // console.log(point_default_zoom);
        var echo_point_x=point_default_zoom.x;
        var echo_point_y=point_default_zoom.y;
        var echo_value='{"x":"'+echo_point_x+'","y":"'+echo_point_y+'"}';
        edit_default.push(echo_value);
    };
    edit_default.push(edit_default[0]);
    console.log(edit_default);
    //删除已有的方位角
    for(var i in map._layers){
        if(map._layers[i].id == "mark"+id.substring(5)){
            map.removeLayer(map._layers[i]);
            break;
        }
    };
    //编辑的方位角获取
    /*var point_first=map.project(latLngs[0][0],18);
    console.log(point_first);
    var point_second=map.project(latLngs[0][1],18);*/
    var marker_id=id.substring(5);
    var direction_x=layer.getCenter().lat;
    var direction_y=layer.getCenter().lng;
    console.log(direction_x);
    var direction_center_translate=map.project(layer.getCenter(),18);
    var direction;
    var params_direction = '{"areaId":"'+id+'"}';
    $.ins("oa/projectArea/getAreaByListId", params_direction, function(data){
        if(data.data!=null){
            var projectData=data.data;
            direction=projectData.direction;
            console.log(direction);
            console.log("here,man !!!");
        }
    });
    getHouseCenter(marker_id,direction_x,direction_y,direction);
    console.log(direction);
    //女儿墙
  //删除女儿墙
    for(var j in map._layers) {
        if (map._layers[j] instanceof L.Polygon){
            if(map._layers[j].id.indexOf("parapetCorner"+id.substring(5))>-1){
               map.removeLayer(map._layers[j]);
            };
        }
    }
      var area_id_plus;
      var projectDataWallLength;//护栏高度
      var params_del_girl = '{"areaId":"'+id+'"}';
      $.ins("oa/projectArea/deleteWallByAreaId", params_del_girl, function(data) {
          if(data.code==200){
              var project=data.data;
              area_id_plus=project.id;
              projectDataWallLength=project.wallLength;
          }
      });
    //女儿墙传给后台
      for(var i=0;i<edit_default.length-1;i++){
          var arr1=eval('('+edit_default[i]+')'); 
          var arr2=eval('('+edit_default[i+1]+')'); 
          var arr_two=[arr1,arr2];
          girl_wall_arr=arr_two;
          mathAreaPosition(0.01,projectDataWallLength,area_id_plus);
      }
      var params = '{"corner":[' + edit_default + '],"directionAngle":"'+[direction_x,direction_y]+'","direction":"'+direction+'","areaId":"'+id+'","name":"","module":"","azimuth":"","slope":"","totalArea":"","wallLength":"","wallGap":"","areaType":"","slopeUnit":""}';
      $.ins("oa/projectArea/updateArea", params, function(data) {
          if(data.code==200){
              var project=data.data;
              changePowerMoneyTotalCapaCity(project);
          }
      });
      renewParapet(id,1.2);
}
//障碍物编辑保存回显
function edit_post_barrier(latLngs,id,layer){
    //编辑的corner获取
    var edit_default=[];
    for(var ii=0;ii<latLngs[0].length;ii++){
        var point_default_zoom=map.project(latLngs[0][ii],18);
        var echo_point_x=point_default_zoom.x;
        var echo_point_y=point_default_zoom.y;
        var echo_value='{"x":"'+echo_point_x+'","y":"'+echo_point_y+'"}';
        edit_default.push(echo_value);
    };
    edit_default.push(edit_default[0]);
    //删除障碍物阴影
    var barrier_shadow_id="shadow_b"+id.substring(7);
    for(var j in map._layers) {
        if (map._layers[j] instanceof L.Polygon) {
            if(map._layers[j].id == barrier_shadow_id){
                map.removeLayer(getLayById(barrier_shadow_id));//_1为同层图形的ID
                break;
            }
        }
    };
    var proDataAreaIdHeigth;
    var params = '{"corner":[' + edit_default + '],"obstacleId":"'+id+'","name":"","type":"1","totalArea":"","heigth":"","shadow":""}';
    $.ins("oa/projectObstacle/updateObstacle", params, function(data) {
        if(data.code==200){
            var project = data.data;
            proDataAreaIdHeigth=project.height;
            changePowerMoneyTotalCapaCity(project);
        }
    })
    barrierShadow(proDataAreaIdHeigth,id);
}

$('#map').on("click",".leaflet-div-icon",function(e){
    stopEvent(e);
});

//点击页面其他部分重置颜色
$(document).click(function(e){
	reset();
});
function reset(){
	if(isDrawObstacle){
		isDrawObstacle=false;
		return;
	}
	circleGroup1.clearLayers();	
    rightOb=false;
    falsg=false;
    $('#map').contextmenu(function(e) {
        e.preventDefault();
        $(".ui-context-menu").css('display','none');
    });
        //$('div[id*="house"]').css('background-color','#FFF');
        $('div[id^="barrier"]').css('background-color','#FFF');
        $('.angle_ipt5').css('background-color','#FFF');
        for(var i in map._layers) {
            if (map._layers[i] instanceof L.Polygon) {
                if(map._layers[i].id.indexOf("house")>-1){
                    map._layers[i].setStyle({color:house_b_color,opacity:house_l_opacity,fillOpacity: house_f_opacity});
                    if(map._layers[i].editEnabled()==true){
                        map._layers[i].disableEdit();
                        var layer = map._layers[i];
                        var now_edit_id=layer.id;
                        var now_layer=prev_edit(now_edit_id);
                        //setTimeout(function () {
                        if(layer_click_time_area==0||(layer_click_time_area!=L.GeometryUtil.geodesicArea(now_layer._latlngs[0]))){
                            edit_post_house(now_layer._latlngs,now_edit_id,layer);
                            layer_click_time_area = 0;
                        };
//                            edit_post_house(now_layer._latlngs,now_edit_id,layer);
                        //}, 500 + Math.random() * 1500);
                        statu_limit_house=0;
                    };
                };
                if(map._layers[i].id.indexOf("barrier")>-1){
                    map._layers[i].setStyle({color:barrier_b_color,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity});
                    if(map._layers[i].editEnabled()==true){
                        map._layers[i].disableEdit();
                        var layer = map._layers[i];
                        var now_edit_id=layer.id;
                        var now_layer=prev_edit(now_edit_id);
                        //setTimeout(function () {
                        if(layer_click_time_area==0||(layer_click_time_area!=L.GeometryUtil.geodesicArea(now_layer._latlngs[0]))){
                            edit_post_barrier(now_layer._latlngs,now_edit_id,layer);
                            layer_click_time_area = 0;
                        };
//                            edit_post_barrier(now_layer._latlngs,now_edit_id,layer); 
                        //}, 500 + Math.random() * 1500);
                        statu_limit_barrier=0;
                    };
                };
            }
        };
        if(rightOb==false){
            document.oncontextmenu=new Function("event.returnValue=false;");
            document.onselectstart=new Function("event.returnValue=false;");
        }
}
//
map.addLayer(drawnItems);
        var lay;
        // Truncate value based on number of decimals
        var _round = function(num, len) {
            return Math.round(num*(Math.pow(10, len)))/(Math.pow(10, len));
        };
        // Helper method to format LatLng object (x.xxxxxx, y.yyyyyy)
        var strLatLng = function(latlng) {
            return "("+_round(latlng.lat, 6)+", "+_round(latlng.lng, 6)+")";
        };
        // Generate popup content based on layer type
        // - Returns HTML string, or null if unknown object
        var roofId=0;//区域
        var obstacle=0;//障碍物
        var operation=0;//运维通道
        var ids = 1;//自增
        var house=0;//表示正在操作什么类型的多边形
        var barrier=0;
        var gallery=0;
        var house_id;//左列表格的id及切片的id
        var obstacle_id;
        var gallery_id;
        var gallery_id_poly;//生成运维通道的多边形id
        var pointXY;//坐标
        var point_arr=[];//运维通道的坐标（对象）
        var point=[];
        var echo_default=[];
        var gallery_shadow=[];
        //var ling_shi_num=0;
        var girl_wall=[];
        var girl_wall_arr=[];
        //var barrierListId
        var getPopupContent = function(layer) {
            lay = layer;
            // Marker - add lat/long
            if (layer instanceof L.Marker) {
                return strLatLng(layer.getLatLng());
            // Circle - lat/long, radius
            } else if (layer instanceof L.Circle) {
                 var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
                    area = L.GeometryUtil.geodesicArea(latlngs);
                //return "Area1: "+L.GeometryUtil.readableArea(area, true);
            // Rectangle/Polygon - area
            } else if (layer instanceof L.Polygon) {
                // 区域闭环;
                var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
                        area = L.GeometryUtil.geodesicArea(latlngs);
                //point_arr=[];
                
                //return "Area1: "+L.GeometryUtil.readableArea(area, true);
            // Polyline - distance
            } 
            return null;
        };
        //改变障碍物高度
        var barHeight;
        function clickBarHeight(flag){
            barHeight = $(flag).val();
        }
        function changeBarHeight(flag){
            var barrier_height=$(flag).val();
            if(barrier_height==barHeight){
                return;
            }
            if(barrier_height==0){
                var barrier_shadow_num=this_barrierList.substring(7);
                var barrier_shadow_id="shadow_b"+barrier_shadow_num;
                var id =this_barrierList;
                for(var i in map._layers) {
                    if (map._layers[i] instanceof L.Polygon) {
                        if(map._layers[i].id == barrier_shadow_id){
                            map._layers[i].setStyle({color:"#FFFFFF",opacity:0});
                        }
                    }
                    
                }
            };
            this_barrierList=$(flag).parents('div[id*="barrier"]').attr('id');
            var params = '{"obstacleId":"'+this_barrierList+'","name":"'+'","type":"1","totalArea":"'+'","heigth":"'+barrier_height+'","shadow":"'+'","corner":"'+'"}';
            $.ins("oa/projectObstacle/updateObstacle", params, function(data) {
                if(data.code==200){
                    var project = data.data;
                    changePowerMoneyTotalCapaCity(project);
                }
            })
            barrierShadow(barrier_height,this_barrierList);
            ga('send','event', 'input','modify','修改障碍物高度');
        }
        
        // Object created - bind popup to layer, add to feature group
        map.on(L.Draw.Event.CREATED, function(event) {
            var layer = event.layer;
            var params;
            var latlngs_area;
            if(house==1){
                layer.id ='house'+ids;
                house_id=layer.id;
                
            }else if(barrier==1){
                layer.id ='barrier'+ids;
                obstacle_id=layer.id;
            }
            else{
                //drawnItems.addLayer(layer);
            };
            var content = getPopupContent(layer);
            if (content !== null) {
                layer.bindPopup(content);
            }
            drawnItems.addLayer(layer);
            //分割线
            latlngs_area=[];
            if(btn_polygon_type=="区域"){
                $("#areaPage").show();
                ids+=1;
                for(var i in map._layers) {
                    if (map._layers[i] instanceof L.Polygon) {
                        if(map._layers[i].id == house_id){
                            latlngs_area=map._layers[i]._latlngs;
                            map._layers[i].setStyle({color:house_b_color,opacity:house_l_opacity,fillOpacity: house_f_opacity});
                            layer_click_time_area=L.GeometryUtil.geodesicArea(map._layers[i]._latlngs[0]);
                            prev_edit_id = map._layers[i].id;
	                        prev_layer_mes = map._layers[i];
                            break;
                        }
                    }
                    
                };
                for(var i=0;i<latlngs_area[0].length;i++){
                    var point_default_zoom=map.project(latlngs_area[0][i],18);
                    var echo_point_x=point_default_zoom.x;
                    var echo_point_y=point_default_zoom.y;
                    var echo_value='{"x":"'+echo_point_x+'","y":"'+echo_point_y+'"}';
                    echo_default.push(echo_value);
                };
                console.log(echo_default);
                //方位角
                var point_first=map.project(latlngs_area[0][0],18);
                var point_second=map.project(latlngs_area[0][1],18);
                var marker_id=house_id.substring(5);
                var direction_x=layer.getCenter().lat;
                var direction_y=layer.getCenter().lng;
                var direction_center_translate=map.project(layer.getCenter(),18);
                var direction=0;
//                var direction=getDirectionAngle(point_first,point_second,direction_center_translate);
//                direction=Math.round(direction);
                if(point_first.y-1<=point_second.y&&point_second.y<=point_first.y+1){
                    var point_third=map.project(latlngs_area[0][2],18);
                    if(point_third.y<point_first.y){
                        direction=0;
                    }else if(point_third.y>point_first.y){
                        direction=180;
                    }
                };
                getHouseCenter(marker_id,direction_x,direction_y,direction);
                console.log(direction);
//              上传的坐标
                var echo_default_end=echo_default[echo_default.length-1];
                var echo_default_end_prev=echo_default[echo_default.length-2];
                if(echo_default_end==echo_default_end_prev){
                    echo_default.splice(-1,1);
                }
                echo_default.push(echo_default[0]);
                var scale = map.getZoom();
                drawAreaShow();
                var area_id_plus;
                direction=0;
                var params = '{"corner":[' + echo_default + '],"areaListId":"' + house_id + '","scale":"' + scale + '","directionAngle":"'+[direction_x,direction_y]+'","direction":"'+direction+'"}';
                $.axs("oa/projectArea/saveArea", params, function(data){
                   if(data.code==200){
                	   statu_limit_house=1;
                       var project=data.data;
                       area_id_plus=project.id;
                       drawAreaInfo(project);
                       for(var i=0;i<echo_default.length-1;i++){
                           var arr1=eval('('+echo_default[i]+')'); 
                           var arr2=eval('('+echo_default[i+1]+')'); 
                           var arr_two=[arr1,arr2];
                           girl_wall_arr=arr_two;
                           mathAreaPosition(0.01,1.2,area_id_plus);
                       }
                       var params1 = '{"areaId":"'+house_id+'"}';
                       $.ins("oa/projectArea/getParapetShadowByListId", params1, function(data){})
                       var params2 = '{"areaListId":"' + house_id + '"}';
                       $.axs("oa/projectArea/getAreaAndCapacityForSaveArea", params2, function(data){
                           if(data.code==200){
                               var projectArea=data.data;
                               changePowerMoneyTotalCapaCity(projectArea);
                           }
                       })
                       $('#'+house_id).click();
                       renewParapet(house_id,1.2)
                       echo_default=[];
                       
                      /* house_detail_id=house_id;
                       $("#"+house_id).addClass('title_active').siblings().removeClass('title_active');
                       showDetailDesign();
                       $("#"+house_id).siblings().css('background-color','#FFF').end().css('background-color','#f5f5f5');
                       for(i in map._layers) {
                           if (map._layers[i] instanceof L.Polygon) {
                               if(map._layers[i].id.indexOf("house")>-1){
                                   map._layers[i].setStyle({color:house_b_color,weight: 2,opacity:house_l_opacity,fillOpacity:house_f_opacity});  
                               };
                               if(map._layers[i].id.indexOf("barrier")>-1){
                                   map._layers[i].setStyle({color:barrier_b_color,weight: 2,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity});
                               };
                               if(map._layers[i].id ==house_id){
                                   map._layers[i].setStyle({color:"#f5e74e",opacity:0.8,fillOpacity: 0.5});
                               }
                           }
                       }*/
                   }
                });
                 // 移除click事件
                 map.removeEventListener('click', getLatling());
                 $('#toReport').attr('class','generate_btn3');
                 point_arr=[];
            };
   
            if(btn_polygon_type=="障碍物"){
            	$("#barPage").show();
                ids+=1;
                var barrier_height=1;
                for(var i in map._layers) {
                    if (map._layers[i] instanceof L.Polygon) {
                        if(map._layers[i].id == obstacle_id){
                            latlngs_area=map._layers[i]._latlngs;
                            map._layers[i].setStyle({color:barrier_b_color,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity});
                            layer_click_time_area=L.GeometryUtil.geodesicArea(map._layers[i]._latlngs[0]);
                            prev_edit_id = map._layers[i].id;
	                        prev_layer_mes = map._layers[i];
                            break;
                        }
                    }
                };
                for(var i=0;i<latlngs_area[0].length;i++){
                    var point_default_zoom=map.project(latlngs_area[0][i],18);
                    var echo_point_x=point_default_zoom.x;
                    var echo_point_y=point_default_zoom.y;
                    var echo_value='{"x":"'+echo_point_x+'","y":"'+echo_point_y+'"}';
                    echo_default.push(echo_value);
                };
//              上传的坐标
                var echo_default_end=echo_default[echo_default.length-1];
                var echo_default_end_prev=echo_default[echo_default.length-2];
               
                if(echo_default_end==echo_default_end_prev){
                    echo_default.splice(-1,1);
                }
                echo_default.push(echo_default[0]);
                var scale = map.getZoom();
                var params = '{"corner":[' + echo_default + '],"type":"1","obstacleListId":"' + obstacle_id + '","scale":"' + scale + '","isShow":"1","areaId":"","heigth":""}';
                $.ins("oa/projectObstacle/saveObstacle", params, function(data) {
                    if(data.code==200){
                    	isDrawObstacle=true;
                    	statu_limit_house=1;
                        var project=data.data;
                        drawObstacleInfo(project);
                        this_barrierList=obstacle_id;
                        barrierShadow(barrier_height,this_barrierList);
                        
                    }
                   
                });
                $.axs("oa/projectObstacle/getAreaAndCapacityForObstacle", params, function(data) {
                    if(data.code==200){
                        var project = data.data;
                        changePowerMoneyTotalCapaCity(project);
                        
                    }
                })
                
                $('#'+obstacle_id).click();
                echo_default=[];
                // 移除click事件
                map.removeEventListener('click', getLatling());
                //btn_continue=true;
                point_arr=[];
            }
            
        });
        //获取多边形的中点
        function getHouseCenter(id,x,y,directionAngle){
            console.log(directionAngle);
            var greenIcon = L.icon({
                iconUrl: poly_center_url,
                iconSize:     [13, 29], // size of the icon
                iconAnchor:   [6.6, 14.6], // point of the icon which will correspond to marker's location
            });
            var marker=L.marker([x,y], {icon: greenIcon,rotationAngle:directionAngle});
            var layer_mark=marker;
            layer_mark.id="mark"+id;
            drawnItems.addLayer(layer_mark);
        }
        //改变左列数据，方位角同步改变
        //获取角度
        function getDirectionAngle(direAngle_start,direAngle_end,center){
            var x1=Math.round(direAngle_start.x);
            var y1=Math.round(direAngle_start.y);
            var x2=Math.round(direAngle_end.x);
            var y2=Math.round(direAngle_end.y);
            console.log(typeof direAngle_start);
            console.log(direAngle_start.x);
            //第一条线的斜率
            var k=(y2-y1)/(x2-x1);
            console.log(k);
            var k_angle=Math.atan(k)*180/Math.PI;
            console.log(k_angle)+"here";
            var angle_first_res=line_angle(k_angle);
            console.log("是否可能大于180..."+angle_first_res);
            var res=directionAangle(x1,x2,y1,y2,angle_first_res,center);
           // console.log(res);
            //反斜率
            return res;
        }
      //判断箭头指向。一
        function line_angle(k_angle){
            if(k_angle<0){
                k_angle=k_angle+180;
                return line_angle(k_angle);
                
            };
            return k_angle;
        }
        //通过第一第二点判断箭头指向。二
        function directionAangle(x1,x2,y1,y2,angle_first_res,center){
            console.log(center);
            var x=center.x;
            var y=center.y;
            var twoPoLength=Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
            //两个辅助点
            var point1_x=x-10;
            var point1_y=y-10;
            var point2_x=x+10;
            var point2_y=y+10;
            //point1的边长
            var point1_length1=Math.sqrt(Math.pow((point1_x-x1),2)+Math.pow((point1_y-y1),2));
            var point1_length2=Math.sqrt(Math.pow((point1_x-x2),2)+Math.pow((point1_y-y2),2));
            var point1_length=point1_length1+point1_length2;
            //point2的边长
            var point2_length1=Math.sqrt(Math.pow((point2_x-x1),2)+Math.pow((point2_y-y1),2));
            var point2_length2=Math.sqrt(Math.pow((point2_x-x2),2)+Math.pow((point2_y-y2),2));
            var point2_length=point2_length1+point2_length2;
            //面积
            var p1=(twoPoLength+point1_length1+point1_length2)/2;
            var s1=p1*(p1-twoPoLength)*(p1-point1_length1)*(p1-point1_length2); 
            var p2=(twoPoLength+point2_length1+point2_length2)/2;
            var s2=p2*(p2-twoPoLength)*(p2-point2_length1)*(p2-point2_length2);
            /*if(angle_first_res>0&&angle_first_res<45){
                return angle_first_res+180;
            };*/
            if(s1<s2){
                if(angle_first_res>0&&angle_first_res<45){
                    return angle_first_res+180;
                };
                 return angle_first_res;
              };
            if(s1>s2){
                if(angle_first_res>0&&angle_first_res<45){
                    return angle_first_res;
                };
                 return angle_first_res+180;
            };
//            if(point1_length<point2_length){
//                return angle_first_res;
//            };
//            if(point1_length>point2_length){
//                return angle_first_res+180;
//            };
            /*
            if(x1>x&&x2>x){
                angle_first_res=angle_first_res+180;
            };
            if(y1>y&&y2>y){
                angle_first_res=angle_first_res+180;
            };
            return angle_first_res;*/
        }
        // Object(s) edited - update popups
        map.on(L.Draw.Event.EDITED, function(event) {
            var layers = event.layers,
            
                content = null;
            layers.eachLayer(function(layer) {
                content = getPopupContent(layer);
                if (content !== null) {
                    layer.setPopupContent(content);
                }
            });
            //ids+=1;
        });
        map.on('moveend', function() {
           var x = map.getSize().x;
           var y = map.getSize().y;
           var zoom = map.getZoom();//缩放等级
           var maxMeters = map.containerPointToLatLng([0, y]).distanceTo( map.containerPointToLatLng([x,y]));
           var meterPerPixel = maxMeters/x;//m/px(一个像素代表多少米)
           meterPix = (x/maxMeters).toFixed(2);//m/px(一米代表多少像素)
       });
        function drawHouse(e){
            //map.closePopup();
            fireKeyEvent($("#map")[0], 'keyup', 27); 
            if(close_btn==true){
                getLatling();
                btn_polygon_type="区域";
                polygon =  new L.Draw.Polygon(map,{shapeOptions:{color:"#f5e74e",weight: 2,opacity:house_l_opacity,fillOpacity:house_f_opacity}});
                polygon.enable();
                house=1;
                barrier=0;
                gallery=0;
                echo_default=[];//防止用户连续点击未闭合的情况下保存坐标
            }
            ga('send','event', 'button','click','绘制屋顶');
        }
        
        function drawBarrier(e){
            fireKeyEvent($("#map")[0], 'keyup', 27); 
            if(close_btn==true){
                getLatling();
                btn_polygon_type="障碍物";
                polygon =  new L.Draw.Polygon(map,{shapeOptions:{color:"#f5e74e",weight: 2,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity}});
                polygon.enable();
                barrier=1;
                house=0;
                gallery=0;
                barrier_poly_type=0;
                echo_default=[];
            }
            ga('send','event', 'button','click','绘制障碍物');
        }
        var polyline;
        //复制屋顶
        var firstLat = 0;
        var lastLon = 0;
        var projectDataId;
        function getOffset(layer_str,rightOb){
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if(map._layers[i].id.indexOf("house")>-1){
                        map._layers[i].setStyle({color:house_b_color,opacity:house_l_opacity,fillOpacity: house_f_opacity});
                        map._layers[i].disableEdit();
                    };
                    if(map._layers[i].id.indexOf("barrier")>-1){
                        map._layers[i].setStyle({color:barrier_b_color,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity});
                        map._layers[i].disableEdit();
                    };
                }
            }
            if(rightOb==true){
            var params='{"areaId":"'+layer_str+'"}';
            $.axs("/oa/projectArea/copyArea", params, function(data) {
                if(data.code==200){
                	var projectData=data.data.copyProjectArea;
                   //屋顶地图加载
                   var res=projectData.corner;
                   projectDataId=projectData.id;
                   var res_id=projectData.bakstr1;
                   var area_corner=JSON.parse(res);
                   var area_point_arr=[];
                   for(var j=0;j<area_corner.length-1;j++){
                       var la=map.unproject(area_corner[j],18);
                       var point=[la.lat,la.lng];
                       area_point_arr.push(point);
                       if(j==0){
                           firstLat = la.lat;
                       }
                       if(j==(area_corner.length-2)){
                           lastLon = la.lng
                       }
                   }
                   var polygon = new L.Polygon(area_point_arr,{
                       color: "#f5e74e",
                       opacity:0.8,
                       fillOpacity: 0.25,
                       draggable:true
                   });
                   polygon.on('dragstart',   onDragStart).on('dragend',   onDragEnd);//监听图形移动停止事件
                   polygon.on('click',onClickStop);
                   var layer = polygon;
                   layer.id = res_id;
                   ids=parseInt(res_id.substring(5));
                   ids+=1;
                   drawnItems.addLayer(layer);
                   layer.enableEdit();
                   prev_edit_id = layer.id;
                   var pa = '{"id":"1"}';
                   //分页数据
                   $.axs("oa/projectArea/getAreaListByProjicetId", pa, function(data) {
                       if(data.code==200&&data.data.length>0){
                           var projectSize = Math.ceil(data.data.length/5);
                           var str = "<ul>";
                           str+="<li><span onclick='pageUp()'><</span></li>";
                           str+="<li><span id='areaPage1' class='round' onclick='changePageNum(this,0)'>1</span></li>";
                           for (var i = 2; i <= projectSize; i++) {
                               var j = i-1;
                               str+='<li><span id="areaPage'+i+'" onclick=changePageNum(this,'+j+')>'+i+'</span></li>';
                           }
                           str+="<li><span onclick='pageDown()'>></span></li>";
                           str+="</ul>";
                           $("#areaPage").html(str);
                           $("#rooftitle").empty();
                           getAllAreaList(0);
                       }
                   });
                }   
            });
            }else{
                console.info("区域复制失败");
            }
            ga('send','event', 'button','click','地图上复制屋顶');
        }
        
        var  dragArea;
        //图形拖动开始触发函数
        function onDragStart(e){
         dragArea = this;
            var polygonId = e.target.id;
            var girl_shadow_id="parapetCorner"+polygonId.substring(5);
          //删除marker
            for(var i in map._layers) {
                if(map._layers[i].id == "mark"+polygonId.substring(5)){
                    map.removeLayer(map._layers[i]);
                    break;
                }
            };
          //删除之前同名的女儿墙阴影
            for(var j in map._layers) {
                if (map._layers[j] instanceof L.Polygon){
                    if(map._layers[j].id.indexOf("parapetCorner"+polygonId.substring(5))>-1){
                        map.removeLayer(map._layers[j]);
                    };
                }
            }
        }
        var astop;
        var timeout;
        function onClickStop(e){
            clearTimeout(timeout);
            dragArea.dragging.disable();
            astop=dragArea.dragging.disable();
             if(astop._enabled==false){
                 timeout=window.setTimeout("onClickStart()",1000);
             } 
        }
        
        function onClickStart(){
            if (typeof(astop) == "undefined") { 
                
             }  else{
                 if(astop._enabled==false){
                     dragArea.dragging.enable();
                 }  
             }
        }
        var dragOA;
        //图形拖动停止触发该函数
        var area_point_arrts=[];
        function onDragEnd(e){
            dragOA = this;
            dragOA.dragging.disable();
            var polygonId = e.target.id;
            var girl_shadow_id="parapetCorner"+polygonId.substring(5);
            var latlngs = e.target._latlngs[0];
            console.log(latlngs);
            var area_point_arrt=[];
            var marker_id=polygonId.substring(5);
            var direction_x=e.target.getCenter().lat;
            var direction_y=e.target.getCenter().lng;
            //var point_first=map.project(latlngs[0],18);
            //var point_second=map.project(latlngs[1],18);
            //var direction_center_translate=map.project(e.target.getCenter(),18);
            //console.log("here"+direction_center_translate.x);
            //var direction=getDirectionAngle(point_first,point_second,direction_center_translate);
            //direction=direction+90;
            //var direction=0;
            //direction=Math.round(direction);
            var direction;
            var params_direction = '{"areaId":"'+polygonId+'"}';
            $.ins("oa/projectArea/getAreaByListId", params_direction, function(data){
                if(data.data!=null){
                    var projectData=data.data;
                    direction=projectData.direction;
                    console.log(direction);
                    console.log("here,man !!!");
                    
                }
            });
            getHouseCenter(marker_id,direction_x,direction_y,direction);
            for(var j=0;j<latlngs.length;j++){
                var lat=map.project(latlngs[j],18);
                var object = new Object();
                object.x=parseFloat(lat.x).toFixed(8);
                object.y=parseFloat(lat.y).toFixed(8);
                area_point_arrt.push(object);
                //console.info(area_point_arrt);
            }
           
            area_point_arrt.push(area_point_arrt[0]);
            area_point_arrts=area_point_arrt;
            var params='{"areaId":"'+polygonId+'","coner":'+JSON.stringify(area_point_arrt)+',"directionAngle":"'+[direction_x,direction_y]+'"}';
           $.ins("oa/projectArea/updatePoint", params, function(data) {
              if(data.data!=null){
               var projectData=data.data;
               var projectAreaId=projectData.id;
              var projectDataWallLength=projectData.wallLength;
               for(var i=0;i<area_point_arrt.length-1;i++){
                   var arr1=area_point_arrt[i]; 
                   var arr2=area_point_arrt[i+1]; 
                   var arr_two=[arr1,arr2];
                   girl_wall_arr=arr_two;
                   mathAreaPosition(0.01,projectDataWallLength,projectAreaId);
               };
               var params1 = '{"areaId":"'+polygonId+'"}';
               $.ins("oa/projectArea/getParapetShadowByListId", params1, function(data){})
                renewParapet(polygonId,projectDataWallLength);
                area_point_arrt=[];
                dragOA.dragging.enable();
              }   
          });
           
           var psa='{"bakstr1":"'+polygonId+'","coner":'+JSON.stringify(area_point_arrts)+'}';
           $.axs("oa/projectArea/getSaveMoveCapatity",psa, function(data){
               if(data.data!=null){
                   var projectData=data.data;
                   changePowerMoneyTotalCapaCity(projectData);
               }
           });
           $('#'+polygonId).click();
           var prev_layer=prev_edit(polygonId);
           layer_click_time_area=L.GeometryUtil.geodesicArea(prev_layer._latlngs[0]);
        }
        
        //删除复制的区域
        function deleteAreaHouse(mid,rightOb){
            if(rightOb==true){
            	$('#map').contextmenu(function(e) {
                    e.preventDefault();
                    $(".ui-context-menu").css('display','none');
                });
                var id =mid;
                var id_num=mid.substring(5);
                var girl_wall="parapetCorner"+id_num;
              //删除marker
                for(var i in map._layers) {
                    if(map._layers[i].id == "mark"+id.substring(5)){
                        map.removeLayer(map._layers[i]);
                    }
                };
                for(var i in map._layers) {
                    if (map._layers[i] instanceof L.Polygon){
                        if(map._layers[i].id == id){
                            for(var j in map._layers) {
                                if (map._layers[j] instanceof L.Polygon){
                                    if(map._layers[j].id.indexOf("parapetCorner"+id.substring(5))>-1){
                                        map.removeLayer(map._layers[j]);
                                    };

                                }
                            }
                            map.removeLayer(map._layers[i]);
                            break;
                        };

                    }
                }
                $("#"+mid).remove();
                $(".create_roof_type").hide();
                //console.log($('#rooftitle').children().length);
                if($('#rooftitle').children().size()==0){
                    $(".create_roof_type").hide();
                  //屋顶为0，删除所有障碍物，障碍物阴影
                    var params1 = '{"type":"1"}';
                    $.axs("oa/projectObstacle/getObstacleValue", params1, function(data) {
                        if(data.code==200){
                           var projectList = data.data;
                           if(projectList.length==0){
                           }else if(projectList.length>0&&$('#rooftitle').children().size()==0){
                                 for(var i=0;i<projectList.length;i++){
                                     var b_id=projectList[i].bakstr1;
                                     var barrier_shadow_id="shadow_b"+b_id.substring(7);
                                     for(var j in map._layers) {
                                         if (map._layers[j] instanceof L.Polygon) {
                                             if(map._layers[j].id == b_id){
                                                 map.removeLayer(map._layers[j]);
                                                 map.removeLayer(getLayById(barrier_shadow_id));//_1为同层图形的ID
                                                 $("#"+b_id).remove();
                                                 break;
                                             }
                                         }
                                     };
                                     var params2 = '{"obstacleId":"'+b_id+'","type":"1"}';
                                     $.axs("oa/projectObstacle/deleteObstacle", params2, function(data) {
                                         if(data.code==200){
                                        	 prev_edit_id = null;
                                         }
                                     })
                                 }
                                 $(".create_roof_type").hide();
                           }
                        }
                    })
                }
                var params = '{"areaId":"'+id+'"}';
                $.ins("oa/projectObstacle/getByAreaId", params, function(data) {
                    if(data.code==200 && data.data.length>0){
                        var obstavleAndWay = data.data;
                        for (var i = 0; i < obstavleAndWay.length; i++) {
                            if(obstavleAndWay[i].type==1){
                                //障碍物
                                var barrier_del_id=obstavleAndWay[i].bakstr1;
                                clearAreaBarrier(barrier_del_id);
                            }
                        }
                    }
                    
                })
                $.axs("oa/projectArea/deleteArea", params, function(data) {
                  var project = data.data;
                  if(data.code==200){
                	  prev_edit_id = null;
                  }
                  //分页数据
                  var pa = '{"id":"1"}';
                  $.ins("oa/projectArea/getAreaListByProjicetId", pa, function(data) {
                      if(data.code==200&&data.data.length>0){
                          var projectSize = Math.ceil(data.data.length/5);
                          var str = "<ul>";
                          str+="<li><span onclick='pageUp()'><</span></li>";
                          str+="<li><span class='round' onclick='changePageNum(this,0)'>1</span></li>";
                          for (var i = 2; i <= projectSize; i++) {
                              var j = i-1;
                              str+='<li><span id="areaPage'+i+'" onclick=changePageNum(this,'+j+')>'+i+'</span></li>';
                          }
                          str+="<li><span onclick='pageDown()'>></span></li>";
                          str+="</ul>";
                          $("#areaPage").html(str);
                          $("#rooftitle").empty();
                          getAllAreaList(0);
                      }else{
                          $("#areaPage").hide();
                          $(".prompt_box").show();
                          $(".circle").show();
                          $(".create_roof_type").hide();
                      }
                  })
                    var params3 = '{"areaListId":"' + house_id + '"}';
		              $.axs("oa/projectArea/getAreaAndCapacityForDelArea", params3, function(data) {
		                  if(data.code==200){
		                      var project = data.data;
		                      changePowerMoneyTotalCapaCity(project);
		                  }
		              })
		              //handoverReport();
              })       
            }
            else{
                console.info("删除失败");
            }
            ga('send','event', 'button','click','地图上删除屋顶');
        }
        var heigth;
        //复制障碍物
        function getCopyObstacle(layer_strId,falsg){
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if(map._layers[i].id.indexOf("house")>-1){
                        map._layers[i].setStyle({color:house_b_color,opacity:house_l_opacity,fillOpacity: house_f_opacity});
                        map._layers[i].disableEdit();
                    };
                    if(map._layers[i].id.indexOf("barrier")>-1){
                        map._layers[i].setStyle({color:barrier_b_color,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity});
                        map._layers[i].disableEdit();
                    };
                }
            }
            if(falsg==true){
            var params='{"areaId":"'+layer_strId+'"}';
            $.axs("oa/projectObstacle/copyObstacle", params, function(data) {
                if(data.code==200){
                    var projectData=data.data.copyProjectObstsacle;
                    heigth= projectData.heigth;
                   //障碍物加载
                   var res=projectData.corner;
                   var res_id=projectData.bakstr1;
                   var area_corner=JSON.parse(res);
                   var area_point_arr=[];
                   for(var j=0;j<area_corner.length-1;j++){
                       var la=map.unproject(area_corner[j],18);
                       var point=[la.lat,la.lng];
                       area_point_arr.push(point);
                       if(j==0){
                           firstLat = la.lat;
                       }
                       if(j==(area_corner.length-2)){
                           lastLon = la.lng
                       }
                   }
                   var polygon = new L.Polygon(area_point_arr,{
                       color: "#f5e74e",
                       opacity:0.8,
                       fillOpacity: 0.25,
                       draggable:true
                   });
                   polygon.on('dragstart', onDragStartObstacle).on('dragend',   onDragEndObstacle);//监听图形移动停止事件
                   polygon.on('click',onClickStopObstacle);
                   var layer = polygon;
                   layer.id = res_id;
                   drawnItems.addLayer(layer);
                   layer.enableEdit();
                   prev_edit_id = layer.id;
                   ids=parseInt(res_id.substring(7));
                   ids+=1;
                   var pa = '{"type":"1"}';
                   //判断项目是否存在绘制好的障碍物
                   $.ins("oa/projectObstacle/getObstacleValue", pa, function(data) {
                       if(data.code==200&&data.data.length>0){
                           //分页数据
                           var projectSize = Math.ceil(data.data.length/5);
                           var str = "<ul>";
                           str+="<li><span onclick='barPageUp()'  class='icon_arrow1_left' ></span></li>";
                           str+="<li><span id='barPage1' class='round1' onclick='changeBarPageNum(this,0)'>1</span></li>";
                           for (var i = 2; i <= projectSize; i++) {
                               var j = i-1;
                               str+='<li><span id="barPage'+i+'" onclick=changeBarPageNum(this,'+j+')>'+i+'</span></li>';
                           }
                           str+="<li><span onclick='barPageDown()'  class='icon_arrow1_right'></span></li>";
                           str+="</ul>";
                           $("#barPage").html(str);
                           $("#height2").find(".create_roof").remove();
                           getAllBarrierList(0);
                       }
                   })
                }
            });
            }else{
                console.info("失败");
            } 
            ga('send','event', 'button','click','地图上复制障碍物');
        }
        var obstacleDragging;
       function onDragStartObstacle(e){
           obstacleDragging=this;
           var polygonId = e.target.id;
           var barrier_shadow_id="shadow_b"+polygonId.substring(7);
           //删除之前同名的障碍物阴影
           for(var i in map._layers) {
               if (map._layers[i] instanceof L.Polygon) {
                   if(map._layers[i].id == barrier_shadow_id){
                       map.removeLayer(getLayById(barrier_shadow_id));//_1为同层图形的ID
                       break;
                   }
               }
           }
       }
      //障碍物拖动停止触发该函数
       var ostop;
       var otimeout;
       function onClickStopObstacle(e){
           clearTimeout(otimeout);
           obstacleDragging.dragging.disable();
           ostop=obstacleDragging.dragging.disable();
            if(ostop._enabled==false){
                otimeout=window.setTimeout("onClickStartObstacle()",1000);
            } 
      
       }
       function onClickStartObstacle(){
           if (typeof(ostop) == "undefined") { 
               
            }  else{
                if(ostop._enabled==false){
                    obstacleDragging.dragging.enable();
                }  
            }
       }
         
        //var dragOb;
        var proDataAreaId;//区域id判断障碍物有没有放在屋顶上面
        var  projectDataAreaId;
        function onDragEndObstacle(e){
            var polygonId = e.target.id;
            obstacleDragging.dragging.disable();
            var barrier_shadow_id="shadow_b"+polygonId.substring(7);
            var latlngs = e.target._latlngs[0];
            var area_point_arrt=[];
            
            for(var j=0;j<latlngs.length;j++){
                var lat=map.project(latlngs[j],18);
                var object = new Object();
                object.x=parseFloat(lat.x).toFixed(8);
                object.y=parseFloat(lat.y).toFixed(8);
                area_point_arrt.push(object);
            }
            area_point_arrt.push(area_point_arrt[0]);        
            var params='{"areaId":"'+polygonId+'","coner":'+JSON.stringify(area_point_arrt)+'}';
           $.ins("oa/projectObstacle/saveUpdateCopyObstacle", params, function(data) {
              console.info("复制障碍物成功");
              if(data.code==200){
                  proDataAreaId=data.data.projectObstacle;  
                  projectDataAreaId=proDataAreaId.areaId;
                var  proDataAreaIdHeigth=proDataAreaId.heigth;
                  barrierShadow(proDataAreaIdHeigth,polygonId);
                  obstacleDragging.dragging.enable();
              }
          });
           $.axs("oa/projectObstacle/getAreaAndCapacityForObstacle", params, function(data) {
               if(data.code==200){
                   var project = data.data;
                   changePowerMoneyTotalCapaCity(project);
               }
           })
           if(projectDataAreaId!=null){
               if(dragArea!=null){
                   dragArea.dragging.disable();
               }
           }
           
           $('#'+polygonId).click();
           var prev_layer=prev_edit(polygonId);
           layer_click_time_area=L.GeometryUtil.geodesicArea(prev_layer._latlngs[0]);
        }
        
        
        
        //删除复制的障碍物
        function deleteObstacle(obj,falsg){
            if(falsg==true){
            $('#map').contextmenu(function(e) {
            	e.preventDefault();
            	$(".ui-context-menu").css('display','none');
            });
            var gallery_poly='barry_polygon_'+obj.substring(7);//删除运维通道宽度
            var barrier_shadow_id="shadow_b"+obj.substring(7);
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if(map._layers[i].id == obj){
                        map.removeLayer(map._layers[i]);
                        break;
                    }
                }
            };
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if(map._layers[i].id == barrier_shadow_id){
                        map.removeLayer(getLayById(barrier_shadow_id));
                        break;
                    }
                }
            }
            $("#"+obj).remove();
            var id_str=obj;
            if(id_str.indexOf("barrier")>-1){
                var params = '{"obstacleId":"'+obj+'","type":"1"}';
                $.axs("oa/projectObstacle/deleteObstacle", params, function(data) {
                    if(data.code==200){
                    	prev_edit_id = null;
                        var project = data.data;
                        var pa = '{"type":"1"}';
                        $.axs("oa/projectObstacle/getObstacleValue", pa, function(data) {
                            if(data.code==200&&data.data.length>0){
                                //分页数据
                                var projectSize = Math.ceil(data.data.length/5);
                                var str = "<ul>";
                                str+="<li><span onclick='barPageUp()'><</span></li>";
                                str+="<li><span id='barPage1' class='round1' onclick='changeBarPageNum(this,0)'>1</span></li>";
                                for (var i = 2; i <= projectSize; i++) {
                                    var j = i-1;
                                    str+='<li><span id="barPage'+i+'" onclick=changeBarPageNum(this,'+j+')>'+i+'</span></li>';
                                }
                                str+="<li><span onclick='barPageDown()'>></span></li>";
                                str+="</ul>";
                                $("#barPage").html(str);
                                $("#height2").find(".create_roof").remove();
                                getAllBarrierList(0);
                            }
                        })
                        $.axs("oa/projectObstacle/getAreaAndCapacityForObstacle", params, function(data) {
	                        if(data.code==200){
	                            var project = data.data;
	                            changePowerMoneyTotalCapaCity(project);
	                        }
	                    })
                    }
                })
            }else{
                //alert("未知错误");
            }
          
            }
            ga('send','event', 'button','click','地图上删除障碍物');
        }
          //新建/回显女儿墙  
          function renewParapet(id,wallLength){
              var id_num=id.substring(5);
              var girl_wall_num=1;
              var params = '{"areaId":"'+id+'"}';
              $.ins("oa/projectObstacle/getWallByAreaListId", params, function(data){
                  if(data.code==200&&data.data!=null&&data.data.length>0){
                      var projectList = data.data;
                      for(var i=0;i<projectList.length;i++){
                    	  if(projectList[i].shadow!=null&&projectList[i].shadow!=""){
                          var res=projectList[i].shadow;
                          var girl_shadow=JSON.parse(res);
                          var girl_shadow_arr=[];
                          for(var j=0;j<girl_shadow.length-1;j++){
                              var la=map.unproject(girl_shadow[j],18);
                              var point=[la.lat,la.lng];
                              girl_shadow_arr.push(point);
                          };
                          var polygon = new L.Polygon(girl_shadow_arr,{
                              color:"#000000",
                              opacity:0,
                              fillOpacity: 0.25,
                              width:0
                          });
                          var layer = polygon;
                          layer.id="parapetCorner"+id_num+"_"+girl_wall_num;
                          drawnItems.addLayer(layer);
                          girl_wall_num++;
                    	  }
                      }
                  }
              });
          }
      //求女儿墙坐标
        function mathAreaPosition(num,height,id){
            var pie = (num*meterPix)/2;
            var x1=girl_wall_arr[0].x;
            var y1=girl_wall_arr[0].y;
            var x2=girl_wall_arr[1].x;
            var y2=girl_wall_arr[1].y;
            var k=(y2-y1)/(x2-x1);
            var k_angle=360*Math.atan2(y2-y1, x2-x1)/(2*Math.PI);
            var qie = k_angle-90;
            //("第1次切角："+qie)
            var x1_1 = accAdd(x1,(pie*Math.cos(qie*Math.PI/180)));
            var y1_1 = accAdd(y1,(pie*Math.sin(qie*Math.PI/180)));
            var gallery_point1='{"x":"'+x1_1+'","y":"'+y1_1+'"}';
            //("起点的第1个映射点："+x1_1+","+y1_1)
            var x2_1 = accAdd(x2,(pie*Math.cos(qie*Math.PI/180)));
            var y2_1 = accAdd(y2,(pie*Math.sin(qie*Math.PI/180)));
            var gallery_point2='{"x":"'+x2_1+'","y":"'+y2_1+'"}';
            //("终点的第1个映射点："+x2_1+","+y2_1)
            qie = qie+180;
            //("第2次切角："+qie)
            var x1_2 = accAdd(x1,(pie*Math.cos(qie*Math.PI/180)));
            var y1_2 = accAdd(y1,(pie*Math.sin(qie*Math.PI/180)));
            var gallery_point3='{"x":"'+x1_2+'","y":"'+y1_2+'"}';
            //("起点的第2个映射点："+x1_2+","+y1_2)
            var x2_2 = accAdd(x2,(pie*Math.cos(qie*Math.PI/180)));
            var y2_2 = accAdd(y2,(pie*Math.sin(qie*Math.PI/180)));
            //("终点的第2个映射点："+x2_2+","+y2_2)
            var gallery_point4='{"x":"'+x2_2+'","y":"'+y2_2+'"}';
            var scale = map.getZoom();
            girl_wall.push(gallery_point1);
            girl_wall.push(gallery_point2);
            girl_wall.push(gallery_point3);
            girl_wall.push(gallery_point4);
            girl_wall.push(girl_wall[0]);
            var params = '{"corner":[' + girl_wall + '],"type":"1","obstacleListId":"","scale":"' + scale + '","isShow":"0","heigth":"'+height+'","areaId":"'+id+'"}';
            $.ins("oa/projectObstacle/saveObstacle", params, function(data) {
                if(data.code==200){
                    
                }
            });
            girl_wall=[];
        }
        //map.removeLayer(map._layers.id.indexOf("parapetCorner")>-1);
        //删除区域
        function clearArea(btn){
            stopEvent(event);
            var id =$(btn).parent().parent().attr('id');
            var girl_id="parapetCorner"+id.substring(5);
            //删除marker
            for(var i in map._layers) {
                if(map._layers[i].id == "mark"+id.substring(5)){
                    map.removeLayer(map._layers[i]);
                }
            };
          //删除house和女儿墙
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon){
                    if(map._layers[i].id == id){
                        for(var j in map._layers) {
                            if (map._layers[j] instanceof L.Polygon){
                                if(map._layers[j].id.indexOf("parapetCorner"+id.substring(5))>-1){
                                   map.removeLayer(map._layers[j]);
                                };
                            }
                        }
                        map.removeLayer(map._layers[i]);
                        break;
                    };

                }
            }
            console.log(map._layers);
            $(btn).parent().parent().remove();
            $(".create_roof_type").hide();
            if($('#rooftitle').children().size()==0){
            	//屋顶为0，删除所有障碍物，障碍物阴影
                  var params1 = '{"type":"1"}';
                  $.axs("oa/projectObstacle/getObstacleValue", params1, function(data) {
                      if(data.code==200){
                         var projectList = data.data;
                         if(projectList.length==0){
                         }else if(projectList.length>0&&$('#rooftitle').children().size()==0){
                               for(var i=0;i<projectList.length;i++){
                                   var b_id=projectList[i].bakstr1;
                                   var barrier_shadow_id="shadow_b"+b_id.substring(7);
                                   for(var j in map._layers) {
                                       if (map._layers[j] instanceof L.Polygon) {
                                           if(map._layers[j].id == b_id){
                                               map.removeLayer(map._layers[j]);
                                               map.removeLayer(getLayById(barrier_shadow_id));//_1为同层图形的ID
                                               $("#"+b_id).remove();
                                               break;
                                           }
                                       }
                                   };
                                   var params2 = '{"obstacleId":"'+b_id+'","type":"1"}';
                                   $.axs("oa/projectObstacle/deleteObstacle", params2, function(data) {
                                       if(data.code==200){
                                    	   prev_edit_id = null;
                                       }
                                   })
                               }
                               $(".create_roof_type").hide();
                         }
                      }
                  })
              }
              var params = '{"areaId":"'+id+'"}';
              $.ins("oa/projectObstacle/getByAreaId", params, function(data) {
                  if(data.code==200 && data.data.length>0){
                      var obstavleAndWay = data.data;
                      for (var i = 0; i < obstavleAndWay.length; i++) {
                          if(obstavleAndWay[i].type==1){
                              //障碍物
                              var barrier_del_id=obstavleAndWay[i].bakstr1;
                              clearAreaBarrier(barrier_del_id);
                          }
                      }
                  }
              })
              $.axs("oa/projectArea/deleteArea", params, function(data) {
                  var project = data.data;
                  if(data.code==200){
                	  prev_edit_id = null;
                  }
                  //分页数据
                  var pa = '{"id":"1"}';
                  $.ins("oa/projectArea/getAreaListByProjicetId", pa, function(data) {
                      if(data.code==200&&data.data.length>0){
                          var projectSize = Math.ceil(data.data.length/5);
                          var str = "<ul>";
                          str+="<li><span onclick='pageUp()'><</span></li>";
                          str+="<li><span class='round' onclick='changePageNum(this,0)'>1</span></li>";
                          for (var i = 2; i <= projectSize; i++) {
                              var j = i-1;
                              str+='<li><span id="areaPage'+i+'" onclick=changePageNum(this,'+j+')>'+i+'</span></li>';
                          }
                          str+="<li><span onclick='pageDown()'>></span></li>";
                          str+="</ul>";
                          $("#areaPage").html(str);
                          $("#rooftitle").empty();
                          getAllAreaList(0);
                      }else{
                          $("#areaPage").hide();
                          $(".prompt_box").show();
                          $(".circle").show();
                          $(".create_roof_type").hide();
                      }
                  })
                  var params3 = '{"areaListId":"' + house_id + '"}';
	              $.axs("oa/projectArea/getAreaAndCapacityForDelArea", params3, function(data) {
	                  if(data.code==200){
	                      var project = data.data;
	                      if(project.totalCapacityFrom==0){
	                          project.totalArea=0;
	                      }
	                      changePowerMoneyTotalCapaCity(project);
	                  }
	              })
              })
        }
        //删除区域同时删除包含的障碍物
        function clearAreaBarrier(id){
            var id=id;
            var barrier_shadow_id="shadow_b"+id.substring(7);
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if(map._layers[i].id == id){
                        map.removeLayer(map._layers[i]);
                        map.removeLayer(getLayById(barrier_shadow_id));//_1为同层图形的ID
                        break;
                    };
                }
            }
            $("#"+id).remove();
        }
        //屋顶选中高亮
        $(".house-content").on("click",".icon_edit,.create_roof",function(){
            stopEvent(event);
            var id=$(this).closest('div[id*="house"]').attr('id');
            $("#"+id).siblings().css('background-color','#FFF').end().css('background-color','#f5f5f5');
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if(map._layers[i].id.indexOf("house")>-1){
                        map._layers[i].setStyle({color:house_b_color,weight: 2,opacity:house_l_opacity,fillOpacity:house_f_opacity});
                        //map._layers[i].editing.disable();
                        map._layers[i].disableEdit();
                    };
                    if(map._layers[i].id.indexOf("barrier")>-1){
                        map._layers[i].setStyle({color:barrier_b_color,weight: 2,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity});
                        //map._layers[i].editing.disable();
                        map._layers[i].disableEdit();
                    };
                    if(map._layers[i].id ==id){
                        map._layers[i].setStyle({color:"#f5e74e",opacity:0.8,fillOpacity: 0.25});
                        //map._layers[i].editing.enable();
                        map._layers[i].enableEdit();
                        now_edit_id = map._layers[i].id;
                        if(prev_edit_id!=null&&prev_layer_mes!=null&&prev_edit_id!=now_edit_id&&statu_limit_house!=0){
                        	var prev_layer=prev_edit(prev_edit_id);
	                        if(layer_click_time_area==0||(layer_click_time_area!=L.GeometryUtil.geodesicArea(prev_layer._latlngs[0]))){
								edit_post_house(prev_layer._latlngs,prev_edit_id,prev_layer_mes);
	                        }
                        }
                        prev_edit_id = map._layers[i].id;
                        prev_layer_mes = map._layers[i];
                        statu_limit_house=1;
                        layer_click_time_area=L.GeometryUtil.geodesicArea(map._layers[i]._latlngs[0]);
                        rightOb=true;
                        $("#map").contextMenu({
                            menu: [
                                {
                                    text: "复制",
                                    trigger: 'none',
                                    callback: function() {
                                        getOffset(id,rightOb);
                                        rightOb=false;
                                    }
                                    
                                },
                                {
                                    text: "删除",
                                    trigger: 'none',
                                    callback: function() {
                                        deleteAreaHouse(id,rightOb);
                                        rightOb=false;
                                    }
                                }
                            ]
                        })
                    }
                    
                }
            }
        });
        //障碍物选中高亮
        $("#barrier-content").on("click",".icon_edit,.create_roof",function(){
            stopEvent(event);
            var id=$(this).closest('div[id*="barrier"]').attr('id');
            $("#"+id).siblings().css('background-color','#FFF').end().css('background-color','#f5f5f5');
            $("#"+id+" .angle_ipt5").css('background-color','#f5f5f5').parents("div[id^='barrier']").siblings().find('.angle_ipt5').css('background-color','#FFF');
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if(map._layers[i].id.indexOf("house")>-1){
                        map._layers[i].setStyle({color:house_b_color,weight: 2,opacity:house_l_opacity,fillOpacity:house_f_opacity});
                        map._layers[i].disableEdit();
                    };
                    if(map._layers[i].id.indexOf("barrier")>-1){
                        map._layers[i].setStyle({color:barrier_b_color,weight: 2,opacity:barrier_l_opacity,fillOpacity:barrier_f_opacity});
                        map._layers[i].disableEdit();
                    };
                    if(map._layers[i].id ==id){
                        map._layers[i].setStyle({color:"#f5e74e",opacity:0.8,fillOpacity: 0.5});
                        map._layers[i].enableEdit();
                        now_edit_id=map._layers[i].id;
                        if(prev_edit_id!=null&&prev_layer_mes!=null&&prev_edit_id!=now_edit_id&&statu_limit_barrier!=0){
                            var prev_layer=prev_edit(prev_edit_id);
                            if(layer_click_time_area==0||(layer_click_time_area!=L.GeometryUtil.geodesicArea(prev_layer._latlngs[0]))){
                                edit_post_barrier(prev_layer._latlngs,prev_edit_id,prev_layer_mes);
                            };
                        };
                        prev_edit_id = map._layers[i].id;
                        prev_layer_mes = map._layers[i];
                        statu_limit_barrier=1;
                        layer_click_time_area=L.GeometryUtil.geodesicArea(map._layers[i]._latlngs[0]);
                        falsg=true;
                        $("#map").contextMenu({
                            menu: [
                                {
                                    text: "复制",
                                    callback: function() {
                                        getCopyObstacle(id,falsg);
                                        falsg=false;
                                    }
                                },
                                {
                                    text: "删除",
                                    callback: function() {
                                        deleteObstacle(id,falsg);
                                        falsg=false;
                                    }
                                }
                            ]
                        });
                    }
                }
            }
        });
        //删除障碍物和运维通道
        function clearMap(btn){
        	var pa = '{"type":"1"}';
            var id =$(btn).parent().parent().parent().attr('id');
            var gallery_poly='barry_polygon_'+id.substring(7);//删除运维通道宽度
            var barrier_shadow_id="shadow_b"+id.substring(7);
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if(map._layers[i].id == id){
                        map.removeLayer(map._layers[i]);
                        map.removeLayer(getLayById(barrier_shadow_id));//_1为同层图形的ID
                        break;
                    }
                }
            }
            $(btn).parent().parent().parent().remove();
            var id_str=id;
            if(id_str.indexOf("barrier")>-1){
                var params = '{"obstacleId":"'+id+'","type":"1"}';
                $.axs("oa/projectObstacle/deleteObstacle", params, function(data) {
                    if(data.code==200){
                    	prev_edit_id = null;
                        var project = data.data;
                      //分页数据
                        var pa = '{"type":"1"}';
                        $.ins("oa/projectObstacle/getObstacleValue", pa, function(data) {
                            if(data.code==200&&data.data.length>0){
                                //分页数据
                                var projectSize = Math.ceil(data.data.length/5);
                                var str = "<ul>";
                                str+="<li><span onclick='barPageUp()'><</span></li>";
                                str+="<li><span id='barPage1' class='round1' onclick='changeBarPageNum(this,0)'>1</span></li>";
                                for (var i = 2; i <= projectSize; i++) {
                                    var j = i-1;
                                    str+='<li><span id="barPage'+i+'" onclick=changeBarPageNum(this,'+j+')>'+i+'</span></li>';
                                }
                                str+="<li><span onclick='barPageDown()'>></span></li>";
                                str+="</ul>";
                                $("#barPage").html(str);
                                $("#height2").find(".create_roof").remove();
                                getAllBarrierList(0);
                            }
                        })
                    }
                    $.axs("oa/projectObstacle/getAreaAndCapacityForObstacle", params, function(data) {
                        if(data.code==200){
                            var project = data.data;
                            changePowerMoneyTotalCapaCity(project);
                        }
                    })
                    $.axs("oa/projectObstacle/getObstacleValue", pa, function(data) {
	            		if(data.code==200&&data.data.length>0){
	            			
	            		}else{
	            			$("#barPage").hide();
	            		}
	            	})
                });
            }else{
                //alert("未知错误");
            }
        }
        
        /**
         * 根据已知id获得layer对象
         * @param {Object} id
         */
        function getLayById(id){
            for(var i in map._layers) {
                if(map._layers[i].id == id){
                    return map._layers[i];
                    break;
                }
            }
        }
        //经纬度转坐标；坐标转经纬度
        function getLatling(){
            map.on('click', function(e) {
                doStuff(e);
            });
            //直角提示--绘制屋顶时鼠标拖动事件
            map.on('mousemove', function(e) {
            	doStuf(e);
            });
            function doStuff(e) {
            	circleGroup.clearLayers();
            	circleGroup1.clearLayers();
                var point_test=map.latLngToLayerPoint(e.latlng);
               //相对于zoom为18时的坐标
                var point_default_zoom=map.project(e.latlng,18);
               // console.log(point_default_zoom);
                var echo_point_x=point_default_zoom.x;
                var echo_point_y=point_default_zoom.y;
                var echo_value='{"x":"'+echo_point_x+'","y":"'+echo_point_y+'"}';
                //echo_default.push(echo_value);
                //ling_shi_num++;
                //console.log("第"+ling_shi_num+"个点");
                //console.log(point_default_zoom);
                //障碍物
                //运维通道zoom等级的像素算运维通道的四个点
                var point_gallery_value=[echo_point_x,echo_point_y];
                point_arr.push(point_gallery_value);
                //经纬度转坐标
                pointXY = map.latLngToLayerPoint(e.latlng);
                //传到后台的值
                var pointXY_x=pointXY.x;
                var pointXY_y=pointXY.y;
                //坐标转经纬度
                var pointlatlng = map.layerPointToLatLng(pointXY);
                //传到后台的值
                var pointlatlngXY_x=pointlatlng.lat;
                var pointlatlngXY_y=pointlatlng.lng;
                var pointlatlng_value={"x":pointlatlngXY_x,"y":pointlatlngXY_y};
            }
        }
        
        //直角提示--绘制屋顶时鼠标拖动至90度给出提醒
        var circleGroup = new L.FeatureGroup();
        map.addLayer(circleGroup);
        function doStuf(e){
        	circleGroup.clearLayers();
        	var point18=map.project(e.latlng,18);
      		var x=Math.round(point18.x);
      		var y=Math.round(point18.y);
      		if(point_arr.length>=2){
      			if(point_arr[point_arr.length-1][0]==point_arr[point_arr.length-2][0]&&point_arr[point_arr.length-1][1]==point_arr[point_arr.length-2][1]){
          			point_arr.pop();
          			point_arr.pop();
          			return;
          		}
      			var d1=Math.pow(point_arr[point_arr.length-2][0]-point_arr[point_arr.length-1][0],2)+Math.pow(point_arr[point_arr.length-2][1]-point_arr[point_arr.length-1][1],2);
				var d2=Math.pow(point_arr[point_arr.length-1][0]-x,2)+Math.pow(point_arr[point_arr.length-1][1]-y,2);
				var d3=Math.pow(point_arr[point_arr.length-2][0]-x,2)+Math.pow(point_arr[point_arr.length-2][1]-y,2);
				if(d3-200<=d1+d2&&d1+d2<=d3+200){
					var layer = e.target;
					var latlngs = [];
					var pointLast = point_arr[point_arr.length-1];
					latlngs.push(map.unproject(pointLast,18))
					latlngs.push(map.unproject(point18,18))
					/*var circle = L.circle(e.latlng, {
						radius: 5,
		                color: '#FAEBD7',
		                fillColor:'#FAEBD7',
		                fillOpacity:1
					});*/
					var polyline = L.polyline(latlngs, { color: '#f5e74e',  
					    opacity: 0.5,  
					    weight: 9 });
					circleGroup.addLayer(polyline);
				}else{
					circleGroup.clearLayers();
      			}
      		}
        }
        $(document).keydown(function(event){
        	if(event.keyCode == 27){
        		point_arr=[];
        		map.removeEventListener('click');
        		circleGroup.clearLayers();
        	}
        })
        
        //障碍物阴影显示
        function barrierShadow(num,this_barrierList){
            var barrier_shadow_height=num;
            var shadow_num=this_barrierList.substring(7);
            //拿阴影坐标
            var params1 = '{"obstacleId":"'+this_barrierList+'","type":"1"}';
            $.ins("oa/projectObstacle/getObstacleByListId", params1, function(data) {
                if(data.code==200 && data.data!=null){
                    var projectList = data.data;
                    //if(projectList.shadow!=null && projectList.shadow!=""){
                        var res=projectList.shadow;
                        var barrier_shadow=JSON.parse(res);
                        if(barrier_shadow!=null&&barrier_shadow.length>0){
                            for(var j=0;j<barrier_shadow.length-1;j++){
                                var la=map.unproject(barrier_shadow[j],18);
                                var point=[la.lat,la.lng];
                                barrier_shadow_point.push(point);
                            }
                        }
                    //}
                }
            })
            if(barrier_poly_type==1){
                var barrier_shadow_num=this_barrierList.substring(7);
                var barrier_shadow_id="shadow_b"+barrier_shadow_num;
                var id =this_barrierList;
                for(var i in map._layers) {
                    if (map._layers[i] instanceof L.Polygon) {
                        if(map._layers[i].id == barrier_shadow_id){
                            //同时删除通道范围
                            map.removeLayer(getLayById(barrier_shadow_id));//_1为同层图形的ID
                            break;
                            //setZIndexOffset
                        }
                    }
                }
                var polygon1 = new L.Polygon(barrier_shadow_point,{
                    color: '#000000',
                    weight: 0,
                    opacity:shadow_l_opacity,
                    fillOpacity: shadow_f_opacity
                }); 
                var layer = polygon1;
                layer.id=barrier_shadow_id;
                drawnItems.addLayer(layer);
                for(var i in map._layers) {
                    if (map._layers[i] instanceof L.Polygon) {
                        if(map._layers[i].id == barrier_shadow_id){
                            //同时删除通道范围
                            drawnItems._layers[i].bringToBack();
                            break;
                       }
                    }
                }
                barrier_shadow_point=[];
                return;
            }
            var polygon = new L.Polygon(barrier_shadow_point,{
                color: '#000000',
                weight: 0,
                opacity:shadow_l_opacity,
                fillOpacity: shadow_f_opacity
            });
            barrier_shadow_point=[];
            var layer = polygon;
            layer.id="shadow_b"+shadow_num;
            drawnItems.addLayer(layer);
            for(var i in map._layers) {
                if (map._layers[i] instanceof L.Polygon) {
                    if(map._layers[i].id == layer.id){
                        //map.removeLayer(map._layers[i]);//删除通道直线
                        //同时删除通道范围
                        drawnItems._layers[i].bringToBack();
                        break;
                   }
                }
            }
            barrier_poly_type=1;
        }
       function accAdd(arg1,arg2){
    	   var r1,r2,m;
    	   try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    	   try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    	   m=Math.pow(10,Math.max(r1,r2))
    	   return (arg1*m+arg2*m)/m;
       } 
       // 拖动
       function getJiaodu(x1,y1,x2,y2){
            var x=(x2-x1);
            var y=(y2-y1);
            var z=Math.sqrt(x*x+y*y);
            var jiaodu=360*Math.atan(y/x)/(2*Math.PI);
            //最终角度
            return jiaodu;
        }
       function getAngle(px1, py1, px2, py2) {
    	   //两点的x、y值
    	   x = px2-px1;
    	   y = py2-py1;
    	   hypotenuse = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
    	   //斜边长度
    	   cos = x/hypotenuse;
    	   radian = Math.acos(cos);
    	   //求出弧度
    	   angle = 180/(Math.PI/radian);
    	   //用弧度算出角度        
    	   if (y<0) {
    		   angle = -angle;
    	   } else if ((y == 0) && (x<0)) {
    		   angle = 180;
    	   }
    	   return angle;
       }
            
            //障碍物、屋顶tab页切换
            function showTab1(){
            	$("#showActive").siblings().removeClass("active");
            	$("#showActive").addClass("active");
            	$("#barrier-content").hide();
            	$(".house-content").show();
            	var bwidth = $("#showActive").children().width();
            	var width =  $("#showActive").width();
            	$(".underline").css({"left":48 ,})
            }
            //障碍物、屋顶tab页切换
            function showTab2(){
            	$("#zhang").siblings().removeClass("active");
                $("#zhang").addClass("active");
                $("#barrier-content").show();
                $(".house-content").hide();
                var bwidth = $("#zhang").children().width();
                var width =  $("#zhang").width();
                $(".underline").css({"left":195,})
            }
