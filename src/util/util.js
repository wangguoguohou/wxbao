const utils = {}

utils.getDirectionAngle = function(direAngle_start, direAngle_end, center) {
    var x1 = Math.round(direAngle_start.x);
    var y1 = Math.round(direAngle_start.y);
    var x2 = Math.round(direAngle_end.x);
    var y2 = Math.round(direAngle_end.y);
    console.log(typeof direAngle_start);
    console.log(direAngle_start.x);
    //第一条线的斜率
    var k = (y2-y1)/(x2-x1);
    console.log(k);
    var k_angle = Math.atan(k)*180/Math.PI;
    console.log(k_angle)
    var angle_first_res = line_angle(k_angle);
    console.log("是否可能大于180..."+angle_first_res);
    var res= directionAangle(x1, x2, y1, y2, angle_first_res, center);
    console.log(res);
    //反斜率
    return res;
}

function line_angle(k_angle) {
    if(k_angle < 0){
        k_angle = k_angle + 180;
        return line_angle(k_angle);
    };
    return k_angle;
}

 //通过第一第二点判断箭头指向
 function directionAangle(x1, x2, y1, y2, angle_first_res, center){
    console.log(center);
    var x = center.x;
    var y = center.y;
    var twoPoLength = Math.sqrt(Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2));
    //两个辅助点
    var point1_x =x-10;
    var point1_y=y-10;
    var point2_x=x+10;
    var point2_y=y+10;
    //point1的边长
    var point1_length1 = Math.sqrt(Math.pow((point1_x-x1), 2) + Math.pow((point1_y-y1), 2));
    var point1_length2 = Math.sqrt(Math.pow((point1_x-x2), 2) + Math.pow((point1_y-y2), 2));
    var point1_length = point1_length1+point1_length2;
    //point2的边长
    var point2_length1 = Math.sqrt(Math.pow((point2_x-x1), 2) + Math.pow((point2_y-y1), 2));
    var point2_length2 = Math.sqrt(Math.pow((point2_x-x2), 2) + Math.pow((point2_y-y2), 2));
    var point2_length = point2_length1 + point2_length2;
    //面积
    var p1=(twoPoLength + point1_length1 + point1_length2) / 2;
    var s1=p1 * (p1 - twoPoLength) * (p1 - point1_length1) * (p1 - point1_length2); 
    var p2=(twoPoLength + point2_length1 + point2_length2) / 2;
    var s2=p2 * (p2 - twoPoLength) * (p2 - point2_length1) * (p2 - point2_length2);
    /*if(angle_first_res>0&&angle_first_res<45){
        return angle_first_res+180;
    };*/
    if(s1 < s2){
        if(angle_first_res > 0 && angle_first_res < 45){
            return angle_first_res + 180;
        };
         return angle_first_res;
      };
    if(s1 > s2){
        if(angle_first_res > 0 && angle_first_res < 45){
            return angle_first_res;
        };
        return angle_first_res + 180;
    };
    // if(point1_length<point2_length){
    //     return angle_first_res;
    // };
    // if(point1_length>point2_length){
    //     return angle_first_res+180;
    // };
    /*
    if(x1>x&&x2>x){
        angle_first_res=angle_first_res+180;
    };
    if(y1>y&&y2>y){
        angle_first_res=angle_first_res+180;
    };
    return angle_first_res;
    */
}

export default utils