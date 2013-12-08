// r1 <= r2
// r <= R

function area(r, R, d) {

    var part1 = r * r * Math.acos((d * d + r * r - R * R) / (2 * d * r));
    var part2 = R * R * Math.acos((d * d + R * R - r * r) / (2 * d * R));
    var part3 = 0.5 * Math.sqrt((-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R));

    var intersectionArea = part1 + part2 - part3;
    return intersectionArea;
}


function distance(r1, r2, s1) {

    if (s1 < 0.00001) {
        return r1 + r2;
    }

    if (s1 >= 0.99999) {
        return 0;
    }

    var a1 = r1 * r1 * Math.PI;
    var _a = a1 * s1;

    var d, diff = Number.MAX_VALUE;

    var r = range(r1, r2, s1),
        min = r.min,
        max = r.max;
    var count = 0;
    for (var i = min; i < max; i++) {
        count++;
        d = i;
        var _area = area(r1, r2, d);
        _diff = Math.abs(_area - _a);
        if (diff > _diff) {
            diff = _diff;
        } else {
            break;
        }
    };

    console.log(count);
    return d;

}

/**
 * [range description]
 * @param  {[type]} r1
 * @param  {[type]} r2
 * @param  {[type]} s1
 * @return {[type]}
 */
function range(r1, r2, s1) {
    var min = 1,
        max = r1 + r2;

    if (r1 == r2) {

    } else {
        min = Math.abs(r1 - r2);
    }

    if (s1 > 0.5) {
        max = max - r1;
        if (s1 < 0.75) {
            min = min + r1 / 2;
        }
    } else {
        min = r2;
        if (s1 > 0.25) {
            max = max - r1 / 2;
        }
    }
    return {
        'min': min,
        'max': max
    }
}