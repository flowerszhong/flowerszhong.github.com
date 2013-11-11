var SmartTip = function (options) {
    this.options = options;
    this._init();
}

SmartTip.prototype = {
    _init : function () {
        var options = this.options;
        this.container = options.container;
        this.trigger = options.trigger;
    },

    getArrowDirection : function () {
        var containerOffset = this.container.get(0).getBoundingClientRect();
        var triggerOffset = this.trigger.get(0).getBoundingClientRect();
        var tipSize = {
            width : 100,
            height: 160
        };
        var arrowSize = {
            width: 10,
            height : 10
        }
        var dir = caculateDirection(containerOffset,triggerOffset,tipSize,arrowSize);
        if(){

        }
    },

    show : function () {
        
    }

};

function caculateDirection (containerOffset,triggerOffset,tipSize,arrowSize) {
    var dir;
    var L = containerOffset.left,
        R = containerOffset.right,
        T = containerOffset.top,
        B = containerOffset.bottom;
    var _l = triggerOffset.left,
        _r = triggerOffset.right,
        _t = triggerOffset.top,
        _b = triggerOffset.bottom;

    var tip_h = tipSize.height,
        tip_w = tipSize.width;
    var a_h = tipSize.height,
        a_w = tipSize.width;

    if((_r + tip_w + a_w < R) && (_b + tip_h > B)){
        return "st-lt";
    }


}