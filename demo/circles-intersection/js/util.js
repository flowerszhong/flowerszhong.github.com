function area ( radius1, radius2,distance) {
    var r = radius1;
    var R = radius2;
    var d = distance;
    if(R < r){
        // swap
        r = radius2;
        R = radius1;
    }
    var part1 = r*r*Math.acos((d*d + r*r - R*R)/(2*d*r));
    var part2 = R*R*Math.acos((d*d + R*R - r*r)/(2*d*R));
    var part3 = 0.5*Math.sqrt((-d+r+R)*(d+r-R)*(d-r+R)*(d+r+R));

    var intersectionArea = part1 + part2 - part3;
    return intersectionArea;
}

function caculate (r1,r2) {
    var min = 0,
        max = r1 + r2;
    for (var i = min; i < max; i++) {
        var distance = i;
        var _area = area(r1,r2,distance);
    };
}


function distance (r1, r2, s1) {
    var a1 = r1*r1*Math.PI;
    var _a = a1 * s1;

    var d,diff = 10000000;

    var r  = range(r1,r2,s1),
        min = r.min,
        max = r.max;

    if(s1<0.00001){
        return r1 + r2;
    }

    if(s1>=0.99999){
        return 0;
    }

    for (var i = min; i < max; i++) {
        d = i;
        var _area = area(r1,r2,d);
        _diff = Math.abs(_area - _a);
        if(diff >_diff){
            diff = _diff;
        }else{
            break;
        }

        // console.log("area : " + _area);
        // console.log("radius1 : " + r1);
        // console.log("radius2 : " + r2);
        // console.log("distance :" + d);
    };

    return d;

}

function range (r1, r2, s1) {
    var min = 1,
        max = r1+r2;

        if(r1 == r2){

        }else{
            min = Math.abs(r1-r2);
        }

        if(s1>0.5){
            max = max - r1;
        }
    return {
        'min' : min,
        'max' : max
    }
}