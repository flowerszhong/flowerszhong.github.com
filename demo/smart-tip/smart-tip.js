var SmartTip = function(options) {
    this._init(options);
}

var reverseMapping = {
    "left": "right",
    "top": "bottom",
    "right": "left",
    "bottom": "top"
};

SmartTip.prototype = {
    defaultOptions: {
        trigger: null,
        container: $(document.body),
        content: "bala bala...",
        borderColor: null,
        color : "black",
        borderWidth: 1,
        borderRadius: 5,
        bgColor: null,
        width: null,
        height: null,
        arrowSize: 10
    },

    _init: function(options) {
        this.options = $.extend({}, this.defaultOptions, options);
        this.container = options.container;
        this.trigger = options.trigger;
        this.content = options.content;
        this.render();
    },

    render: function() {
        var dom = ['<div class="smart-tip">',
            '<div class="st-arrow">',
            '<em class="st-arrow-1"></em>',
            '<em class="st-arrow-2"></em>',
            '</div>',
            '<div class="st-content"></div>',
            '</div>'
        ];
        var $el = this.el = $(dom.join('')).css({
            width: this.options.width,
            height: this.options.height
        }).hide();
        this.$contentWrap = this.el.find('.st-content').append(this.content);
        this.$arrow = this.el.find(".st-arrow");
        this.container.append(this.el);
        // this.show();
    },

    calculateDirection: function() {
        if (!this.trigger) {
            return;
        }
        var options = this.options;
        var containerOffset = this.container.get(0).getBoundingClientRect();
        var triggerOffset = this.trigger.get(0).getBoundingClientRect();
        var tipSize = {
            width: options.width,
            height: options.height
        };
        var arrowSize = {
            width: options.arrowSize,
            height: options.arrowSize
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

        this.setStyle(dir);
        this.setOffset(offsetTop, offsetLeft);
    },

    setOffset: function(offsetTop, offsetLeft) {
        this.el.css({
            top: offsetTop,
            left: offsetLeft
        });
    },

    setStyle: function(dir) {
        var options = this.options;
        var arrowSize = options.arrowSize;

        this.el.attr("class", "smart-tip st-" + dir).css({
            width: options.width,
            height: options.height
        });

        var dirs = dir.split('-');
        dir1 = dirs[0];
        dir2 = dirs[1];

        var borderColor = options.borderColor,
            bgColor = options.bgColor;
        var tipBorderWidth = options.borderWidth;

        var contentStyle = {
            border: tipBorderWidth + "px solid " + borderColor,
            "background-color": bgColor,
            "border-radius": options.borderRadius,
            color: options.color
        };

        var borderRadiusDirMapping = {
            "right-bottom": "bottom-right",
            "right-top": "top-right",
            "left-bottom": "bottom-left",
            "left-top": "top-left"
        }
        var _dir = borderRadiusDirMapping[dir] || dir;
        contentStyle["border-" + _dir + "-radius"] = 0;
        this.$contentWrap.css(contentStyle);

        var arrowStyle = {
            top: "",
            left: "",
            bottom: "",
            right: "",
            width: arrowSize,
            height: arrowSize
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

    show: function(dir, offsetTop, offsetLeft) {
        if (arguments.length) {
            this.setStyle(dir);
            this.setOffset(offsetTop, offsetLeft);
        } else {
            this.calculateDirection();
        }

        this.el.show();
        return this.el;
    },
    toggle: function(showFlag) {
        this.el.toggle(showFlag);
    },
    hide: function() {
        this.el.hide();
    },

    hideArrow: function() {
        this.$arrow.hide();
    },
    attachTo: function($trigger) {
        this.trigger = $trigger;
    },
    renderContent: function(content) {
        this.$contentWrap.empty().append(content);
    },
    destroy: function() {
        this.el.remove();
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