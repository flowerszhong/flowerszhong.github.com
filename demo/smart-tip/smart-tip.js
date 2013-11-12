var SmartTip = function(options) {
    this.options = options;
    this.el = null;
    this._init();
}

SmartTip.prototype = {
    _init: function() {
        var options = this.options;
        this.container = options.container;
        this.trigger = options.trigger;
        this.content = options.content;
        this.drawTip();
    },

    drawTip: function() {
        var dom = ['<div class="smart-tip">',
            '<div class="st-arrow">',
            '<em class="st-arrow-1"></em>',
            '<em class="st-arrow-2"></em>',
            '</div>',
            '<div class="st-content"></div>',
            '</div>'
        ];
        var $el = this.el = $(dom.join('')).hide();
        this.$contentWrap = this.el.find('.st-content').append(this.content);
        this.$arrow = this.el.find(".st-arrow");
        this.container.append(this.el);
        this.show();
    },

    getArrowDirection: function() {
        var containerOffset = this.container.get(0).getBoundingClientRect();
        var triggerOffset = this.trigger.get(0).getBoundingClientRect();
        var tipSize = {
            width: 100,
            height: 130
        };
        var arrowSize = {
            width: 10,
            height: 10
        }
        var dir = caculateDirection(containerOffset, triggerOffset, tipSize, arrowSize);
        var offsetLeft = triggerOffset.left - containerOffset.left,
            offsetTop = triggerOffset.top - containerOffset.top;
        if (dir == "st-lt") {
            offsetLeft = triggerOffset.width + offsetLeft + arrowSize.width;
            offsetTop = offsetTop + triggerOffset.height / 2;
        }

        if (dir == "st-lb") {
            offsetLeft = triggerOffset.width + offsetLeft + arrowSize.width;
            offsetTop = offsetTop - tipSize.height + triggerOffset.height / 2;
        }

        if (dir == "st-rt") {
            offsetLeft = offsetLeft - tipSize.width - arrowSize.width;
            offsetTop = offsetTop + triggerOffset.height / 2;
        }

        if (dir == "st-rb") {
            offsetLeft = offsetLeft - tipSize.width - arrowSize.width;
            offsetTop = offsetTop + triggerOffset.height / 2 - tipSize.height;
        }

        if (dir == "st-bl") {
            offsetTop = offsetTop - tipSize.height - arrowSize.height;
        }

        if (dir == "st-br") {
            offsetLeft = offsetLeft + triggerOffset.width - tipSize.width;
            offsetTop = offsetTop - arrowSize.height - tipSize.height;
        }

        if (dir == "st-tl") {
            offsetTop = offsetTop + triggerOffset.height + arrowSize.height;
        }

        this.setArrowStyle(dir);

        this.el.attr("class", "smart-tip " + dir).css({
            top: offsetTop,
            left: offsetLeft
        });
    },

    setArrowStyle : function (dir) {
        var arrowSize =  10;

        var dir = dir.split('-')[1];
        var positionMapping = {
            "l" : "left",
            "r" : "right",
            "b" : "bottom",
            "t" : "top"
        }

        this.$arrow.css({
            top : "",
            left : "",
            bottom : "",
            right : ""
        });

        var borderColor = "red",
            bgColor = "green";
        var tipBorderColor = 1;

        this.$arrow.css(positionMapping[dir[0]], - arrowSize + "px").css(positionMapping[dir[1]],0);
        // .st-lt .st-arrow-1{
        //     border-width: 5px;
        //     border-color:blue blue transparent transparent;
        //     top:0;
        //     left:0;
        // }

        // .st-lt .st-arrow-2{
        //     border-width: 4px;
        //     border-color: white white transparent transparent;
        //     right: -1px;
        //     top: 1px;
        // }

        var _maping = ["t","r","b","l"];

        var arrowBorderWidth = arrowSize/5;
        var $arrow1 = this.$arrow.find(".st-arrow-1"),
            $arrow2 = this.$arrow.find(".st-arrow-2");

        var reverseMapping = {
            "l" : "right",
            "t" : "bottom",
            "r" : "left",
            "b" : "top"
        };

        $arrow1.css({
            "border-width" : arrowBorderWidth,
            "border-color" : "",
            "top" : 0,
            "left" : 0
        });

        $arrow2.css({

        })

    },

    show: function() {
        this.getArrowDirection();
        this.el.show();
        return this.el;
    },
    attachTo: function($trigger) {
        this.trigger = $trigger;
    },
    renderContent: function(content) {
        this.$contentWrap.empty().append(content);
    },
    setStyle: function() {

    }

};

function caculateDirection(containerOffset, triggerOffset, tipSize, arrowSize) {
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
    var a_h = arrowSize.height,
        a_w = arrowSize.width;

    if ((_b + tip_h < B) && (_r + tip_w + a_w < R)) {
        return "st-lt";
    }

    if ((_t - tip_h > T) && (_r + tip_w + a_w < R)) {
        return "st-lb";
    }

    if ((_t - tip_h - a_h > T) && (_l + tip_w < R)) {
        return "st-bl";
    }

    if ((_t - tip_h - a_h > T) && (_r - tip_w > L)) {
        return "st-br";
    }

    if ((_b + tip_h + a_h < B) && (_l + tip_w < R)) {
        return "st-tl";
    }

    if ((_t + tip_h < B) && (_l - tip_w - a_w) > L) {
        return "st-rt";
    }

    if ((_t - tip_h - a_h > T) && (_l - tip_w - a_w > L)) {
        return "st-rb";
    }

    var leftLargeThanRight = (_l - L) > (R - _r);
    var topLargeThanBottom = (_t - T) > (B - _b);
    dir = "st-" + (leftLargeThanRight ? "r" : "l") + (topLargeThanBottom ? "b" : "t");
    return dir;
}