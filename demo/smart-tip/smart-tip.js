
var SmartTip = function(options) {
    this.options = options;
    this.el = null;
    this._init();
}


var reverseMapping = {
    "left": "right",
    "top": "bottom",
    "right": "left",
    "bottom": "top"
};

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
        if (dir == "left-top") {
            offsetLeft = triggerOffset.width + offsetLeft + arrowSize.width;
            offsetTop = offsetTop + triggerOffset.height / 2;
        }

        if (dir == "left-bottom") {
            offsetLeft = triggerOffset.width + offsetLeft + arrowSize.width;
            offsetTop = offsetTop - tipSize.height + triggerOffset.height / 2;
        }

        if (dir == "right-top") {
            offsetLeft = offsetLeft - tipSize.width - arrowSize.width;
            offsetTop = offsetTop + triggerOffset.height / 2;
        }

        if (dir == "right-bottom") {
            offsetLeft = offsetLeft - tipSize.width - arrowSize.width;
            offsetTop = offsetTop + triggerOffset.height / 2 - tipSize.height;
        }

        if (dir == "bottom-left") {
            offsetTop = offsetTop - tipSize.height - arrowSize.height;
        }

        if (dir == "bottom-right") {
            offsetLeft = offsetLeft + triggerOffset.width - tipSize.width;
            offsetTop = offsetTop - arrowSize.height - tipSize.height;
        }

        if (dir == "top-left") {
            offsetTop = offsetTop + triggerOffset.height + arrowSize.height;
        }

        this.setArrowStyle(dir);

        this.el.attr("class", "smart-tip " + dir).css({
            top: offsetTop,
            left: offsetLeft
        });
    },

    setArrowStyle: function(dir) {
        var arrowSize = 10;

        var dirs = dir.split('-');
        dir1 = dirs[0];
        dir2 = dirs[1];

        var borderColor = "red",
            bgColor = "green";
        var tipBorderWidth = 1;

        var arrowStyle = {
            top: "",
            left: "",
            bottom: "",
            right: ""
        };

        arrowStyle[dir1] = 0 - arrowSize;
        arrowStyle[dir2] = 0;

        this.$arrow.css(arrowStyle);

        var arrowBorderWidth = arrowSize / 2;
        var $arrow1 = this.$arrow.find(".st-arrow-1"),
            $arrow2 = this.$arrow.find(".st-arrow-2");

        $arrow1.css({
            "border-width": arrowBorderWidth + "px",
            "border-color": getBorderColor(dir1, dir2, borderColor),
            "top": 0,
            "left": 0
        });



        var arrow2Style = {
            top: "",
            left: "",
            bottom: "",
            right: "",
            "border-width": arrowBorderWidth - tipBorderWidth,
            "border-color": getBorderColor(dir1, dir2, bgColor),
        }

        arrow2Style[reverseMapping[dir1]] = (0 - tipBorderWidth) + "px";
        arrow2Style[dir2] = tipBorderWidth + "px";

        $arrow2.css(arrow2Style);

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
        return "left-top";
    }

    if ((_t - tip_h > T) && (_r + tip_w + a_w < R)) {
        return "left-bottom";
    }

    if ((_t - tip_h - a_h > T) && (_l + tip_w < R)) {
        return "bottom-left";
    }

    if ((_t - tip_h - a_h > T) && (_r - tip_w > L)) {
        return "bottom-right";
    }

    if ((_b + tip_h + a_h < B) && (_l + tip_w < R)) {
        return "top-left";
    }

    if ((_t + tip_h < B) && (_l - tip_w - a_w) > L) {
        return "right-top";
    }

    if ((_t - tip_h - a_h > T) && (_l - tip_w - a_w > L)) {
        return "right-bottom";
    }

    var leftLargeThanRight = (_l - L) > (R - _r);
    var topLargeThanBottom = (_t - T) > (B - _b);
    dir = (leftLargeThanRight ? "right" : "left") + "-" + (topLargeThanBottom ? "bottom" : "top");
    return dir;
}


function getBorderColor(dir1, dir2, color) {
    var colorMapping = {
        top: "transparent",
        right: "transparent",
        bottom: "transparent",
        left: "transparent"
    }

    dir1 = reverseMapping[dir1];

    colorMapping[dir1] = color;
    colorMapping[dir2] = color;
    return colorMapping.top + " " + colorMapping.right + " " +
        colorMapping.bottom + " " + colorMapping.left;
}