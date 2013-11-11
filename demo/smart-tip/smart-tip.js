var SmartTip = function (options) {
    this.options = options;
    this.el = null;
    this._init();
}

SmartTip.prototype = {
    _init : function () {
        var options = this.options;
        this.container = options.container;
        this.trigger = options.trigger;
        this.content = options.content;
        this.drawTip();
    },

    drawTip : function () {
        var dom = [ '<div class="smart-tip">',
                        '<div class="st-arrow">',
                            '<em class="st-arrow-1"></em>',
                            '<em class="st-arrow-2"></em>',
                        '</div>',
                        '<div class="st-content"></div>',
                    '</div>'];
        this.el = $(dom.join('')).hide();
        this.$contentWrap = this.el.find('.st-content').append(this.content);
        this.container.append(this.el);
        this.show();
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
        var offsetLeft = triggerOffset.left - containerOffset.left,
            offsetTop = triggerOffset.top - containerOffset.top;
        if(dir == "st-lt"){
            offsetLeft = triggerOffset.width + offsetLeft + arrowSize.width;
        }

        if(dir == "st-lb"){
            offsetLeft = triggerOffset.width + offsetLeft + arrowSize.width;
            offsetTop = offsetTop - tipSize.height;
        }

        if(dir == "st-tl"){
            
        }

        this.el.attr("class","smart-tip " + dir).css({
            top: offsetTop,
            left: offsetLeft
        });
    },

    show : function () {
        this.getArrowDirection();
        this.el.show();
        return this.el;
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

    if((_b + tip_h < B) && (_r + tip_w + a_w < R)){
        return "st-lt";
    }

    if((_t - tip_h > T) && (_r + tip_w + a_w < R)){
        return "st-lb";
    }

    if((_t - tip_h - a_h > T) && (_l + tip_w < R)){
        return "st-bl";
    }

    if((_t - tip_h - a_h > T) && (_r - tip_w > L)){
        return "st-br";
    }

    if((_b + tip_h + a_h > B) && (_l + tip_w < R)){
        return "st-tl";
    }

    


}