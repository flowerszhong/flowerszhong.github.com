/*
 * build 2013.8.7
 * gill gong
 */
define(function(require) {
    var $ = require("M4jquery"),
        jquerySvgPlugin = require("mr-jquery/jquery.svg"),
        stackedbarCss = require("css!mr-chart-dir/stackedbar/css/stackedbar.css"),
        jquerySvgDomPlugin = require("mr-jquery/jquery.svgdom"),
        ChartCore = require("M4chart/chartcore");


    var E = {};
    E = $.extend(ChartCore.E, E);
    var S = ChartCore.S;
    var T = ChartCore.T;
    var C = {};
    //======================ToolTip========================//
    var ToolTip = function(container) {
        this.container = container;
        this.posX = 0;
        this.posY = 0;
        this.perHeight = 12;
        this.perFontDis = 5;
        this.width = 73;
        this.linePadd = 2;
        this.padding = 5;
        this.nameDoms = [];
        this.attrDoms = [];
        this.nameHeight = 0;
        this.attrHeight = 0;
        this.offset = {
            level: 9,
            vertical: 9
        };
        this.flag = true;
    };

    ToolTip.prototype = {
        SVG_NS: "http://www.w3.org/2000/svg",
        _setValue: function(isName, arr) {
            var domArr = isName ? this.nameDoms : this.attrDoms;
            var parentDom = isName ? this.textDomForName : this.textDomForAttr;
            var len = arr.length,
                i = 0,
                k = 0;
            if (len > 0) {
                while (i < domArr.length && i < len) {
                    domArr[i].textContent = arr[i];
                    i++;
                }
                for (; i < len; i++) {
                    var tspan = this._addNewTspan(this.perHeight, arr[i], parentDom);
                    domArr.push(tspan);
                }
                for (; i < domArr.length; i++) {
                    $(domArr[i]).remove();
                    domArr.splice(i, 1);
                    i--;
                }
            }
            return i != 0;
        },
        _setItemStyle: function(contents) {
            var len = contents.length,
                j = 0;
            var betterData = [];
            for (var i = 0; i < len; i++) {
                var eachContent = contents[i];
                if (eachContent.length * this.perFontDis > this.width) {
                    var charNum = parseInt(this.width / this.perFontDis);
                    j = 0;
                    while (j < eachContent.length) {
                        betterData.push(eachContent.substr(j, charNum));
                        j = j + charNum;
                    }
                } else {
                    betterData.push(eachContent);
                }
            }
            return betterData;
        },
        _contentTemplate: function(direction) {
            if (this.flag) {
                this.contentGroup = $(document.createElementNS(this.SVG_NS, "g"));
                this.textDomForName = $(document.createElementNS(this.SVG_NS, "text"));
                this.textDomForAttr = $(document.createElementNS(this.SVG_NS, "text"));
                //  this.line = $(document.createElementNS(this.SVG_NS, "line"));
                this.offsetDom = $(document.createElementNS(this.SVG_NS, "polygon"));
                this.rectDom = $(document.createElementNS(this.SVG_NS, "rect"));
                this.contentGroup.append(this.textDomForName);
                this.contentGroup.append(this.textDomForAttr);
                // this.contentGroup.append(this.line);
                this.container.append(this.offsetDom);
                this.container.append(this.rectDom);
                this.container.append(this.contentGroup);
                this.rectDom.attr({
                    "pointer-events": "none"
                });
                this.contentGroup.attr({
                    "pointer-events": "none"
                });
                this.offsetDom.attr({
                    "pointer-events": "none"
                });
                this.flag = false;
            }
            return this.contentGroup;
        },
        _sortTextDom: function(direction) {
            /*var direction = direction||this.direction;
        if( direction === "TOP"||direction==="RIGHT" ) {
          this.textDomForAttr.attr("y",0);
          var lineDis = this.attrHeight+this.linePadd;
          this.line.attr({ "x1":0 , "y1":lineDis,"x2":this.width ,"y2":lineDis }).hide();
          this.textDomForName.attr("y",lineDis+this.linePadd);        
        }*/
            //if(direction === "DOWN"||direction==="LEFT") {        
            this.textDomForName.attr("y", 0);
            var lineDis = this.nameHeight + this.linePadd;
            // this.line.attr({ "x1":0 , "y1":lineDis,"x2":this.width ,"y2":lineDis }).hide();
            this.textDomForAttr.attr("y", lineDis + this.linePadd);
            //}
            this.textDomForName.hide();
            this.textDomForAttr.hide();
        },
        _addNewTspan: function(dy, con, parentDom) {
            var tspan = document.createElementNS(this.SVG_NS, "tspan");
            tspan.textContent = con;
            tspan = $(tspan);
            tspan.attr({
                "x": 0,
                "dy": dy
            });
            if (parentDom) {
                parentDom.append(tspan);
            }
            return tspan.get(0);
        },
        _generateFrame: function(isOut) {
            var totalHeight = this.nameHeight + (this.attrHeight == 0 ? 0 : this.attrHeight + 2 * this.linePadd);
            var self = this,
                offset = this.offset,
                direction = {};
            var outerWidth = self.width + 2 * self.padding,
                outerHeight = totalHeight + 2 * self.padding;

            direction.rightStrategy = function() {
                var checkPoint = {
                    x: self.posX + outerWidth + offset.level,
                    y: self.posY - outerHeight
                };
                if (!isOut(checkPoint)) {
                    var points = self.posX + "," + self.posY + " " + (self.posX + offset.level) + "," + self.posY +
                        " " + (self.posX + offset.level) + "," + (self.posY - offset.vertical);
                    self.offsetDom.attr({
                        'points': points
                    });
                    self.okPoint = {
                        'x': self.posX + offset.level,
                        'y': self.posY - outerHeight
                    };
                    self.rectDom.attr({
                        'x': self.okPoint.x,
                        'y': self.okPoint.y,
                        'height': outerHeight,
                        'width': outerWidth
                    });
                    self.direction = "RIGHT";
                    return true;
                }
                return false;
            };
            direction.downStrategy = function() {
                var checkPoint = {
                    x: self.posX + outerWidth + offset.level,
                    y: self.posY + outerHeight
                };
                if (!isOut(checkPoint)) {
                    var points = self.posX + "," + self.posY + " " + (self.posX + offset.level) + "," + self.posY +
                        " " + (self.posX + offset.level) + "," + (self.posY + offset.vertical);
                    self.offsetDom.attr({
                        'points': points
                    });
                    self.rectDom.attr({
                        'x': self.posX + offset.level,
                        'y': self.posY,
                        'height': outerHeight,
                        'width': outerWidth
                    });
                    self.okPoint = {
                        'x': self.posX + offset.level,
                        'y': self.posY
                    };
                    self.direction = "DOWN";
                    return true;
                }
            },
            direction.leftStrategy = function() {
                var checkPoint = {
                    x: self.posX - outerWidth - self.offset.level,
                    y: self.posY + outerHeight
                };
                if (!isOut(checkPoint)) {
                    var points = self.posX + "," + self.posY + " " + (self.posX - offset.level) + "," + self.posY +
                        " " + (self.posX - offset.level) + "," + (self.posY + offset.vertical);
                    self.offsetDom.attr({
                        'points': points
                    });
                    self.rectDom.attr({
                        'x': checkPoint.x,
                        'y': self.posY,
                        'height': outerHeight,
                        'width': outerWidth
                    });
                    self.okPoint = {
                        'x': checkPoint.x,
                        'y': self.posY
                    };
                    self.direction = "LEFT";
                    return true;
                }
                return false;

            };
            self.offsetDom.hide();
            self.rectDom.hide();
            for (ele in direction) {
                var bool = direction[ele]();
                if (bool) return true;
            }
            return false;
        },
        //====================API===================================//
        addName: function(nameArr) {
            this.contentName = this._setItemStyle(nameArr);
            this.nameHeight = this.contentName.length * this.perHeight;
            return this;
        },
        addAttr: function(attrArr) {
            this.contentAttr = this._setItemStyle(attrArr);
            this.attrHeight = this.contentAttr.length * this.perHeight;
            return this;
        },
        setBackConf: function(conf) {
            this.rectDom.attr(conf);
            this.offsetDom.attr(conf);
            return this;
        },
        setPos: function(x, y) {
            this.posX = x;
            this.posY = y;
            return this;
        },
        setContentConf: function(conf) {
            this.textDomForName.attr(conf);
            this.textDomForAttr.attr(conf);
            return this;
        },
        setValue: function(contentName, contentAttr) {
            this._setValue(true, contentName);
            this._setValue(false, contentAttr);
            return this;
        },
        generateToolTip: function(isOut) {
            this._contentTemplate();
            this._generateFrame(isOut);
            this._sortTextDom();
            this.setValue(this.contentName, this.contentAttr);
            if (!this.okPoint) return this;
            var translate = "translate(" + (this.okPoint.x + this.padding) + "," + (this.okPoint.y + this.padding) + ")";
            this.contentGroup.attr("transform", translate);
            return this;
        },
        addClass : function (_className) {
            // this.offsetDom.addClass(_className);
            // this.rectDom.addClass(_className);
            this.contentGroup.addClass(_className);
            // this.textDomForName.addClass(_className);
            // this.textDomForAttr.addClass(_className);
            return this;
        },
        showAll: function(hideOffsetDomFlg) {
            if(!hideOffsetDomFlg){
                this.offsetDom.show();
            }
            this.rectDom.show();
            this.contentGroup.show();
            this.textDomForName.show();
            this.textDomForAttr.show();
            return this;
        },
        hide: function() {
            this.offsetDom.hide();
            this.rectDom.hide();
            this.contentGroup.hide();
            this.textDomForName.hide();
            this.textDomForAttr.hide();
        },
        destroy: function() {
            this.offsetDom.remove();
            this.rectDom.remove();
            this.contentGroup.remove();
            this.textDomForName.remove();
            this.textDomForAttr.remove();
        }
    };

    //=========================Stacked Bar============================================================//
    var StackedBar_H = function(container) {
        this.superinit();
        this.option = this.defaultOption();
        // container
        this.container = $(container);
        this.width = this.container.width();
        this.height = this.container.height();
        this.offset = this.container.offset();
        this._activeType = "fund";
        this.init();
    };
    StackedBar_H.prototype = {
        VERSION: "1.0.130529A",
        E: E,
        mapping_index_data: [],
        mapping_index_sum: [],
        basePos: 0,
        defaultOption: function() {
            return {
                className: "stackedbar",
                style: {
                    lablenameforbar: {
                        "text-anchor": "start",
                        //  "font-family" : "Univers",
                        "font-size": 13
                        //  "fill" : "#ff9a54"
                    },
                    tips: {
                        "tipsFont": {
                            fill: "white",
                            'font-size': 13,
                            'font-family': "Univers"
                        },
                        "tipsBack": {
                            fill: "#ff9a54",
                            opacity: 1
                        }
                    },
                    bar: {
                        "opacity": 1,
                        stroke: "#ffffff",
                        "stroke-width": 2
                    },
                    barOpacity: {
                        "overlap": 0.7,
                        "overweight": 0.5,
                        "unique": 0.3
                    },
                    hideOpacity: 0.2,
                    activePicPath: "http://flowerszhong.github.io/demo/circles-intersection/slash-bg-pattern.png"
                },
                dataFormat: {
                    x: "allocation",
                    y: "allocation"
                },
                labelName: {
                    dis_x: 150
                },
                //
                coordinate: {
                    axis_x: {
                        id: "axis_x",
                        title: {
                            value: "",
                            style: {
                                display: null
                            }
                        },
                        line: {
                            extend: false,
                            onTop: false,
                            lineColor: "black",
                            lineWidth: 1
                        },
                        item: {
                            style: {
                                "pointer-events": "none",
                                "text-anchor": "middle",
                                fill: "#666666",
                                dx: -5,
                                dy: 15
                            },
                            mark: {
                                display: true,
                                width: 1,
                                lineWidth: 2,
                                lineColor: "#ffffff"
                            },
                            grid: {
                                display: false
                            },
                            cell: {
                                opacity: 1,
                                fill: {
                                    x1: "0%",
                                    x2: "0%",
                                    y1: "0%",
                                    y2: "100%",
                                    stop: [{
                                        offset: 0,
                                        "stop-color": "#AEBBD3",
                                        "stop-opacity": 0.3
                                    }, {
                                        offset: 0.38,
                                        "stop-color": "#AEBBD3",
                                        "stop-opacity": 0.8
                                    }, {
                                        offset: 1,
                                        "stop-color": "#AEBBD3",
                                        "stop-opacity": 0.2
                                    }]
                                },
                                "fill-opacity": 0.2,
                                display: S.NONE
                            },
                            back: {
                                display: false
                            },
                            hover: {
                                stroke: "#bbbbbb",
                                "stroke-width": 1
                            }
                        },
                        first: {
                            mark: {
                                display: true
                            }
                        },
                        last: {
                            style: {
                                dx: -20,
                                dy: 15
                            }
                        },
                        type: S.BOTTOM,
                        space: 100,
                        width: 25
                    },
                    axis_y: {
                        id: "axis_y",
                        title: {
                            value: "",
                            style: {
                                display: false
                            }
                        },
                        line: {
                            extend: 4,
                            onTop: false,
                            lineColor: "#ffffff",
                            lineWidth: 2,
                            display: false
                        },
                        item: {
                            style: {
                                "pointer-events": "auto",
                                "text-anchor": "end",
                                fill: "#FF6E11",
                                dx: 0,
                                dy: 3
                            },
                            mark: {
                                lineColor: "#bbbbbb",
                                lineWidth: 1,
                                width: 160,
                                display: false
                            },
                            grid: {
                                display: false
                            }
                        },
                        first: {
                            mark: {
                                lineColor: "#FF6E11",
                                display: true
                            }
                        },
                        last: {
                            mark: {
                                display: false
                            },
                            style: {
                                dy: 0
                            }
                        },
                        paddingTop: 20,
                        paddingBottom: 0,
                        baseValue: 0,
                        type: S.LEFT,
                        width: 160
                    }
                },
                graph: {
                    back: {
                        fill: "#ffffff",
                        opacity: 0
                    }
                },
                back: {
                    fill: "#ffffff",
                    opacity: 0
                }
            };
        },
        init: function() {
            var self = this;
            this.container.empty().css({
                position: S.RELATIVE
            });
            this.graph = $(S.DIV).css({
                position: S.ABSOLUTE
            }).appendTo(this.container);
            this.renderer = new ChartCore.Renderer(S.SVG);
            this.svg_root = this.renderer.init(this.width, this.height);
            this.svg_back = $(this.renderer.drawGroup({}, this.svg_root));
            this.svg_coordinate = $(this.renderer.drawGroup({}, this.svg_root));
            this.coordinate = new ChartCore.Coordinate(this);
            this.coordinate.divisionHandler = function(axis, minValue, maxValue, num) {
                if (axis.direction == S.X) {
                    return self.divisionXaxis(axis, minValue, maxValue, num);
                } else {
                    return self.divisionYaxis(axis, minValue, maxValue, num);
                }
            };
            this.svg_main = $(this.renderer.drawGroup({}, this.svg_root));
            this.svg_face = $(this.renderer.drawGroup({}, this.svg_root));
            this.graph.append(this.svg_root);
            
            return this;
        },
        addDefaultEvents: function() {
            var self = this;
            this.svg_list.on("mouseover","rect",function (e) {
                self.tipForMouseOver(e);
            }).on("mouseout","rect",function (e) {
                self.tipForMouseOut(e);
            }).on("click","rect",function (e) {
                self.svg_list.addClass("pined");
                self.svg_list.find("rect.pined").removeClass("pined");
                $(this).addClass("pined");
                self.pinToolTip(e);
            })

            this.axis_y_node.on("mouseover","text",function () {
                var $this = $(this);
                $this.removeClass("gray").addClass("hover").siblings().removeClass("hover").addClass("gray");
                var _name = $(this).attr('data-name');
                self.hoverLabel(_name);

                var _data = this.__data__;
                if(_data){
                    self.showLabelTooltips(this,_data);
                }

            })
            .on("mouseout","text",function () {
                var _name = $(this).attr('data-name');
                self.unHoverLabel(_name);
            })
            .on("dblclick","text",function () {
                var _data = this.__data__;
                if(_data){
                    console.log(_data)
                }
            })
            .on("mouseleave",function () {
                $(this).find('g.axis_y_label').find("text").removeClass("hover gray");
            });


            this.svg_main.bind("drop drag dragstart dragend dragenter dragleave dragover", function(e) {
                return false;
            });
        },

        showLabelTooltips : function (el,innerData) {
            var _x = 0,
                _y = parseInt(el.getAttribute('y'),10);
            console.log(_x,_y);
            _y = _y < 100 ? _y + 10 : _y - 15;

            var self = this;
            var _isOut = function(pox) {
                var rect = self.coordinate.rect;
                if (pox.x > rect.width || pox.y > rect.height || pox.x < 0 || pox.y < 0) {
                    return true;
                }
                return false;
            };

            var barConf = this.getStyle("tips");
            barConf.tipsBack.fill = el.getAttribute("fill");
            var hideOffsetDomFlg = true;
            //==============tooltip====================//
            var tips1 = this._label_tip1 = this._label_tip1 ? this._label_tip1 : new ToolTip($(self.svg_tips));

            console.log(tips1);
            console.log(innerData);
            tips1.setPos(_x, _y)
                .addName(["_className", innerData.overlap + "%", (innerData.overlapHoldingNumber + " Holdings")])
                .addAttr(["_name", innerData.allocation + "%" , (innerData.allocationHoldingNumber + " Holdings")])
                .generateToolTip(_isOut)
                .setContentConf(barConf.tipsFont)
                .setBackConf(barConf.tipsBack)
                .showAll(hideOffsetDomFlg);

            tips1.addClass("label-tooltip-1");


            var tips2 = this._label_tip2 = this._label_tip2 ? this._label_tip2  : new ToolTip($(self.svg_tips));
            tips2.setPos(_x+ 90, _y)
                .addName(["_className", innerData.overlap + "%", (innerData.overlapHoldingNumber + " Holdings")])
                .addAttr(["_name", innerData.allocation + "%" , (innerData.allocationHoldingNumber + " Holdings")])
                .generateToolTip(_isOut)
                .setContentConf(barConf.tipsFont)
                .setBackConf(barConf.tipsBack)
                .showAll(hideOffsetDomFlg);
            tips2.addClass("label-tooltip-2");

            var tips3 = this._label_tip3 =  this._label_tip3 ? this._label_tip3 : new ToolTip($(self.svg_tips));

            tips3.setPos(_x+ 180, _y)
                .addName(["_className", innerData.overlap + "%", (innerData.overlapHoldingNumber + " Holdings")])
                .addAttr(["_name", innerData.allocation + "%" , (innerData.allocationHoldingNumber + " Holdings")])
                .generateToolTip(_isOut)
                .setContentConf(barConf.tipsFont)
                .setBackConf(barConf.tipsBack)
                .showAll(hideOffsetDomFlg);
            tips3.addClass("label-tooltip-3");

        },

        //=======================API====================================//
        activeBars: function(type) {
            var barDoms = this.svg_list.children();
            for (var i = 0; i < barDoms.length; i++) {
                if (barDoms[i].getAttribute("class") === type) {
                    var children = $(barDoms[i]).find("." + C.item_back);
                    for (var j = 0; j < children.length; j++) {
                        children[j].setAttribute("fill", "url(#_image_)");
                    }
                }
            }
        },
        activeShare: function() {
            if (this._actived) {
                this.unActiveBars("overweight");
                this.unActiveBars("unique");
                this._actived = false;
            } else {
                this.activeBars("overweight");
                this.activeBars("unique");
                this._actived = true;
            }
        },
        unActiveBars: function(type) {
            var barDoms = this.svg_list.children();
            for (var i = 0; i < barDoms.length; i++) {
                if (barDoms[i].getAttribute("class") === type) {
                    var children = $(barDoms[i]).find("." + C.item_back);
                    for (var j = 0; j < children.length; j++) {
                        children[j].setAttribute("fill", "transparent");
                    }
                }
            }
        },
        hightBars: function(type) {
            var hideOpacity = this.getStyle("hideOpacity");
            var barDoms = this.svg_list.children();
            for (var i = 0; i < barDoms.length; i++) {
                if (barDoms[i].getAttribute("class") === type) {
                    barDoms[i].setAttribute("opacity", 1);
                } else {
                    barDoms[i].setAttribute("opacity", hideOpacity);
                }
            }
        },
        hideOtherBars: function(currentDom) {
            var hideOpacity = this.getStyle("hideOpacity");
            var barDoms = this.svg_list.addClass("fade-out");
            $(currentDom).addClass("hover");
        },
        fadeOutOtherLabels : function (_name) {
            var $labels =  this.axis_y_node.find('.axis_y_label');
            $labels.find("text").removeClass("hover").addClass("gray");
            $labels.find('[data-name="'+ _name + '"]').removeClass("gray").addClass("hover");
        },
        recoverLabels : function () {
            var $labels =  this.axis_y_node.find('.axis_y_label');
            $labels.find("text").removeClass("gray hover");
        },
        recoverBars: function(currentDom) {
            var barDoms = this.svg_list.removeClass("fade-out");
            $(currentDom).removeClass("hover")
        },

        hoverLabel : function (_name) {
            this.svg_list.addClass("label-fade-out").find("rect[data-name='" + _name + "']").addClass("label-hover");
        },
        unHoverLabel : function (_name) {
            this.svg_list.removeClass("label-fade-out").find("rect[data-name='" + _name + "']").removeClass("label-hover");
            if(this._label_tip1){
                this._label_tip1.hide();
            }
            if(this._label_tip2){
                this._label_tip2.hide();
            }
            if(this._label_tip3){
                this._label_tip3.hide();
            }
        },

       
        //===========================================================//
        tipForMouseOut: function(event) {
            if (this.tips) {
                this.tips.hide();
            }
            this.recoverBars(event.target);
            this.recoverLabels();
        },
        tipForMouseOver: function(event) {
            var targetDom = event.target,
                $targetDom = $(targetDom),
                self = this;
            var innerData = this.getTipData(targetDom),
                _name = innerData.name;
            var _className = $targetDom.parent().attr("class");

            var x = Math.round((targetDom.getAttribute("x") - 0) + (targetDom.getAttribute("width") - 0));
            var y = Math.round((targetDom.getAttribute("y") - 0) + 0.5 * (targetDom.getAttribute("height") - 0));
            var _isOut = function(pox) {
                var rect = self.coordinate.rect;
                if (pox.x > rect.width || pox.y > rect.height || pox.x < 0 || pox.y < 0) {
                    return true;
                }
                return false;
            };
            var barConf = this.getStyle("tips");
            barConf.tipsBack.fill = targetDom.getAttribute("fill");
            //==============tooltip====================//
            this.tips = this.tips || new ToolTip($(this.svg_tips));
            this.tips.setPos(x, y)
                .addName([_className, innerData.overlap + "%", (innerData.overlapHoldingNumber + " Holdings")])
                .addAttr([_name, innerData.allocation + "%" , (innerData.allocationHoldingNumber + " Holdings")])
                .generateToolTip(_isOut)
                .setContentConf(barConf.tipsFont)
                .setBackConf(barConf.tipsBack)
                .showAll();

            // this.hideOtherBars(targetDom);
            this.svg_list.addClass("fade-out");
            $targetDom.addClass("hover");
            this.fadeOutOtherLabels(_name);
            //========================================//
        },

        pinToolTip: function(event) {

            if (this.pinTips) {
                this.pinTips.destroy();
            }
            this.pinTips = this.tips;
            this.tips = null;
        },
        getTipData: function(dom) {
            for (var i = 0, len = this.mapping_index_data.length; i < len; i++) {
                var innerDom = this.mapping_index_data[i];
                if (innerDom.rect == dom) {
                    return innerDom.data;
                }
            }
            return null;
        },
        //x-axis===========================================================
        divisionXaxis: function(axis, minValue, maxValue, num) {
            var arr = [],
                maxAllocation = Math.round(this.data.maxAllocation);
            while (maxAllocation % 2 != 0) {
                maxAllocation++;
            }
            arr.push({
                value: 0,
                label: '0'
            });
            arr.push({
                value: 0.5 * maxAllocation,
                label: 0.5 * maxAllocation + '%'
            });
            arr.push({
                value: maxAllocation,
                label: maxAllocation + '%'
            });
            return arr;
        },
        //y-axis =====================================================
        divisionYaxis: function(axis, minValue, maxValue, num) {
            var arr = [];
            var innerData = this.data.data,
                format = this.getDataFormat();
            arr.push({
                value: innerData[0].scale_y - 0.8,
                label: ""
            });
            for (var i = 0, l = innerData.length; i < l; i++) {
                var scaleValue = innerData[i][format.y];
                arr.push({
                    value: innerData[i].scale_y,
                    label: scaleValue + "%"
                });
            }
            arr.push({
                value: innerData[i - 1].scale_y + 0.8,
                label: ""
            });
            return arr;
        },
        dataProcess: function() {
            this.style = this.getStyle();
            var innerData = this.data.data;
            var maxAllocation = 0,
                f = this.getDataFormat();
            for (var i = 0; i < innerData.length; i++) {
                innerData[i].scale_y = i;
                if (maxAllocation < innerData[i][f.x]) {
                    maxAllocation = innerData[i][f.x];
                }
            }
            this.data.maxAllocation = maxAllocation;
        },
        drawNow: function() {
            clearTimeout(this.timeid);
            this.drawStart();
            this.renderer.setSize(this.width, this.height);
            $(this.renderer.defs).empty();
            this.dataProcess();
            var op = this.option;
            var cln = op.className;
            C = {
                graph: cln + "_graph",
                //background
                back: cln + "_back",
                //coordinate
                coordinate: cln + "_coordinate",
                //main
                face: cln + "_face",

                tips: cln + "_tooltip",
                main: cln + "_main",
                main_back: cln + "_main_back",
                main_area: cln + "_main_area",
                main_mask: cln + "_main_mask",
                list: cln + "_list",
                item: cln + "_item",
                item_back: cln + "_back_image",
                menu: cln + "_menu"
            };
            this.graph.removeClass().addClass(C.graph);
            this.svg_coordinate.attr({
                "class": C.coordinate
            });
            this.coordinate.draw(this.svg_coordinate);
            this.axis_x = this.coordinate.getAxisById("axis_x", S.X);
            this.axis_y = this.coordinate.getAxisById("axis_y", S.Y);
            this.axis_y_node = this.axis_y.node;
            // ======================================================
            this.drawBack();
            this.drawFace();
            this.drawMain();
        },
        generateImagePattern: function() {
            var imagePath = this.getStyle("activePicPath");
            var defs = this.renderer.create(S.DEFS, {});
            var pattern = this.renderer.create("pattern", {
                id: "_image_",
                x: 0,
                y: 0,
                patternUnits: "userSpaceOnUse",
                height: 150,
                width: 200
            }, defs);
            var image = this.renderer.drawImage({
                x: 0,
                y: 0,
                height: 150,
                width: 200
            }, pattern);
            image.setAttributeNS(S.SVG_LINK, "xlink:href", imagePath);
            this.svg_main_area.append(defs);
            return defs;
        },
        drawBack: function() {
            this.svg_back.empty().attr({
                "class": C.back
            });
            this.renderer.drawRect($.extend({
                width: this.width,
                height: this.height
            }, this.option.back), this.svg_back);
            return this;
        },
        drawFace: function() {
            this.svg_face.empty().attr({
                "class": C.face
            });
            var transform = "translate(" + this.coordinate.rect.left + "," + this.coordinate.rect.top + ")";
            this.svg_tips = this.renderer.drawGroup({
                "class": C.tips,
                "transform": transform
            }, this.svg_face);
            return this;
        },
        drawMain: function() {
            this.svg_main.empty().attr({
                "class": C.main
            });
            var rect = this.coordinate.rect;
            this.svg_main_back = $(this.renderer.drawRect($.extend({
                "class": C.main_back,
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            }, this.option.graph.back), this.svg_main));
            var area = this.renderer.create(S.SVG, {
                "class": C.main_area,
                xmlns: S.SVG_NS,
                "xmlns:xlink": S.SVG_LINK,
                overflow: S.HIDDEN,
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            }, this.svg_main);
            this.svg_main_area = $(area);
            this.generateImagePattern();
            this.svg_list = $(this.renderer.drawGroup({
                "class": C.list
            }, area));
            this.drawBars();
            this.insertNameForBars();
            this.drawComplete();
            this.addDefaultEvents();
            this._reset();
            return this;
        },
        insertNameForBars: function() {
            var doms = this.axis_y.option.data;
            var data = this.data.data,
                distance = this.option.labelName.dis_x || 190;
            var lableConf = this.getStyle("lablenameforbar");
            for (var i = 0; i < doms.length; i++) {
                var dom = doms[i].elements.text;
                if (dom) {
                    var posX = dom.getAttribute("x") - distance,
                        posY = dom.getAttribute("y");
                    lableConf.y = posY;
                    lableConf.x = posX;
                    var tspan = this.renderer.drawTspan(lableConf, doms[i].elements.text);
                    var _name = data[i-1].name;
                    dom.__data__ = data[i-1];
                    $(dom).attr("data-name",_name);
                    tspan.textContent = _name;
                }
            }
        },
        _reset: function() {
            this.tips = null;
            this._actived = false;
        },
        setData: function() {
            if (arguments.length) {
                this.data = arguments[0];
                this.drawType = "data";
            }
            var axis_y = this.option.coordinate.axis_y;
            axis_y.item.style.fill = this.data.style.overlap;
            axis_y.first.mark.lineColor = this.data.style.overlap;
            return this.draw();
        },
        drawBars: function() {
            var groupDom = [];
            var innerData = this.data.data,
                size = innerData.length;
            var scale_x = this.data.scale_x,
                style = this.data.style;
            for (var i = 0; i < scale_x.length; i++) {
                var name = scale_x[i];
                groupDom[name] = this.renderer.drawGroup({
                    "class": name
                }, this.svg_list);
            }
            if (size > 0) {
                var barHeight = this.axis_y.getCoord(0) - this.axis_y.getCoord(1);
                var barOpacity = this.getStyle("barOpacity");
                for (var i = 0, l = innerData.length; i < l; i++) {
                    var item = innerData[i];
                    var barData = this.getElementData(item, "bar");
                    var y = this.axis_y.getCoord(item.scale_y) - 0.5 * barHeight,
                        x = 0;
                    for (var k = 0; k < scale_x.length; k++) {
                        var width = this.axis_x.getCoord(item[scale_x[k]]);
                        barData = ChartCore.SVG.getElementData(barData, {
                            'class': C.item,
                            fill: style[scale_x[k]],
                            'x': x,
                            'y': y,
                            'width': width,
                            'height': barHeight,
                            'data-name' : item.name
                        });
                        barData.opacity = barOpacity[scale_x[k]];
                        var rect = this.renderer.drawRect(barData, groupDom[scale_x[k]]);
                        var backGroundConf = ChartCore.SVG.getElementData(barData, {
                            "class": C.item_back,
                            fill: "transparent",
                            "pointer-events": 'none',
                            'x': x,
                            'y': y,
                            'width': width,
                            'height': barHeight
                        });
                        this.renderer.drawRect(backGroundConf, groupDom[scale_x[k]]);
                        this.mapping_index_data.push({
                            "rect": rect,
                            "data": item
                        });
                        x = x + width;
                    }
                }
            }
        },
        //quick get style <data></data>
        getElementData: function(data, name1, name2) {
            var name = name1;
            var styleO = this.style ? this.style[name] : {};
            var styleD = data.style ? data.style[name] : {};
            if (name2) {
                name = name2;
                styleO = styleO ? styleO[name] : {};
                styleD = styleD ? styleD[name] : {};
            }
            return ChartCore.SVG.getElementData(styleO, styleD, {
                id: data.id,
                "class": C["item_" + name]
            });
        },
        toString: function() {
            return "[object StackedBar]";
        }
    };
    StackedBar_H.prototype = $.extend(new ChartCore.ChartBase(), StackedBar_H.prototype);
    StackedBar_H.prototype.constructor = StackedBar_H;
    return StackedBar_H;
});