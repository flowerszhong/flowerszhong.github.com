/**
 * @build 2011.11.30
 * @author Kevin Zhu
 */
define(["domReady!", "M4jquery", "css!M4chart/css/chart.css"], function(document, $, css, undefined) {
  if (!$) {
    throw new Error("ChartCore require jquery $");
  }
  var NS = {};
  //====================================================================================================
  // enum and const
  var S = {
    SVG : "svg",
    SVG_NS : "http://www.w3.org/2000/svg",
    SVG_LINK : "http://www.w3.org/1999/xlink",
    SVG_DTD : '<?xml version="1.0" encoding="utf-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
    VML : "vml",
    CANVAS : "canvas",
    //
    X : "x",
    Y : "y",
    R : "r",
    DOT : ".",
    _ : "_",
    COMMA : ",",
    SPACE : " ",
    ALL : "all",
    NONE : "none",
    AUTO : "auto",
    TRUE : "true",
    FALSE : "false",
    NUMBER : "number",
    BOOLEAN : "boolean",
    //
    LEFT : "left",
    RIGHT : "right",
    TOP : "top",
    BOTTOM : "bottom",
    WIDTH : "width",
    HEIGHT : "height",
    //
    H : "h",
    V : "v",
    //
    L : "l",
    O : "o",
    C : "c",
    //
    YEARLY : "yearly",
    QUARTERLY : "quarterly",
    MONTHLY : "monthly",
    WEEKLY : "weekly",
    DAILY : "daily",
    HOURLY : "hourly",
    HALFHOURLY : "halfhourly",
    MINUTELY : "minutely",
    //
    ID : "id",
    CLASS : "class",
    COLOR : "color",
    ALPHA : "alpha",
    ABSOLUTE : "absolute",
    RELATIVE : "relative",
    SELECTED : "selected",
    HIDDEN : "hidden",
    VISIBLE : "visible",
    XHREF : "xlink:href",
    //
    STRING : "string",
    OBJECT : "object",
    FUNCTION : "function",
    // shape
    G : "g",
    CIRCLE : "circle",
    RECT : "rect",
    ROUNDRECT : "roundrect",
    ELLIPSE : "ellipse",
    LINE : "line",
    POLYLINE : "polyline",
    POLYGON : "polygon",
    PATH : "path",
    TEXT : "text",
    TSPAN : "tspan",
    IMAGE : "image",
    FILTER : "filter",
    LABEL : "label",
    //
    HREF : "href",
    DESC : "desc",
    DEFS : "defs",
    // html
    DIV : "<div></div>"
  };
  NS.S = S;
  //====================================================================================================
  // custom events
  var E = {
    //system =================================
    MOUSEOVER : "mouseover",
    MOUSEOUT : "mouseout",
    MOUSEDOWN : "mousedown",
    MOUSEMOVE : "mousemove",
    MOUSEUP : "mouseup",
    MOUSEENTER : "mouseenter",
    MOUSELEAVE : "mouseleave",
    //Requires jquery.mousewheel.js
    MOUSEWHEEL : "mousewheel",
    CLICK : "click",
    DBLCLICK : "dblclick",
    CONTEXTMENU : "contextmenu",
    //
    FOCUS : "focus",
    BLUR : "blur",
    FOCUSIN : "focusin",
    FOCUSOUT : "focusout",
    //
    KEYDOWN : "keydown",
    KEYPRESS : "keypress",
    KEYUP : "keyup",
    ENTER : "enter",
    //common =================================
    CHANGE : "change",
    RESIZE : "resize",
    SCROLL : "scroll",
    SELECT : "select",
    SUBMIT : "submit",
    HOVER : "hover",
    ERROR : "error",
    DISPLAY : "display",
    //draw ===================================
    DRAW_START : "draw_start",
    DRAW_UPDATE : "draw_update",
    DRAW_COMPLETE : "draw_complete",
    //item ===================================
    ITEM_SELECT : "item_select",
    ITEM_HOVER : "item_hover",
    ITEM_OVER : "item_over",
    ITEM_OUT : "item_out",
    ITEM_CLICK : "item_click",
    ITEM_DBLCLICK : "item_dblclick",
    //main ===================================
    MAIN_OVER : "main_over",
    MAIN_OUT : "main_out",
    MAIN_CLICK : "main_click",
    MAIN_DBLCLICK : "main_dblclick",
    MAIN_CONTEXTMENU : "main_contextmenu",
    //back ===================================
    BACK_CLICK : "back_click",
    //move ===================================
    MOVE_START : "move_start",
    MOVE : "move",
    MOVE_COMPLETE : "move_complete",
    //will delete later
    MOVE_END : "move_end",
    //zoom ===================================
    ZOOM_START : "zoom_start",
    ZOOM : "zoom",
    ZOOM_COMPLETE : "zoom_complete",
    //clip ===================================
    CLIP_START : "clip_start",
    CLIP : "clip",
    CLIP_COMPLETE : "clip_complete",
    //data ===================================
    DATA_CHANGE : "data_change",
    DATA_READY : "data_ready"
  };
  NS.E = E;
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.Tools}
   */
  NS.Tools = function() {
  };
  NS.Tools.prototype = {
    o : function(msg) {
      msg += "";
      var body = document.body;
      if (body) {
        var div = document.createElement("div");
        div.innerHTML = msg;
        body.appendChild(div);
      } else {
        document.write("<div>" + msg + "</div>");
      }
    },
    distance : function(a, b) {
      var dx = a.x - b.x;
      var dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    outrect : function(target, container, partly) {
      if (target && container) {
        if (partly) {
          if (target.x < container.x || target.x + target.width > container.x + container.width || target.y < container.y || target.y + target.height > container.y + container.height) {
            return true;
          }
        } else {
          if (target.x + target.width < container.x || target.x > container.x + container.width || target.y + target.height < container.y || target.y > container.y + container.height) {
            return true;
          }
        }
      }
      return false;
    },
    array : function(data) {
      if (!data) {
        return [];
      }
      if (data instanceof Array) {
        return data;
      }
      return [data];
    },
    tohas : function(data) {
      var result = {};
      if (data) {
        if (typeof (data) === S.OBJECT) {
          if (data instanceof Array) {
            for ( var i = 0, l = data.length; i < l; i++) {
              var n = data[i];
              if (n) {
                result[n] = true;
              }
            }
          } else {
            for ( var k in data) {
              result[k] = true;
            }
          }
        } else {
          result[data] = true;
        }
      }
      return result;
    },
    //if is number
    isnum : function(num) {
      if (typeof (num) !== S.NUMBER) {
        return false;
      }
      if (isNaN(num)) {
        return false;
      }
      return true;
    },
    // format to number
    // if int then try to parse to int
    tonum : function(num, isInt) {
      if (typeof (num) !== S.NUMBER) {
        if (isInt) {
          num = parseInt(num);
        } else {
          num = parseFloat(num);
        }
      }
      if (isNaN(num)) {
        num = 0;
      } else {
        num = NS.Tools.clamp(num, -Number.MAX_VALUE, Number.MAX_VALUE);
      }
      return num;
    },
    numfix : function(num, fix) {
      var n = NS.Tools.tonum;
      return n(n(num).toFixed(n(fix, true)));
    },
    log10 : function(x) {
      //Math.log(x) / Math.log(10)
      return Math.log(x) / Math.LN10;
    },
    clamp : function(num, min, max) {
      return Math.max(Math.min(num, max), min);
    },
    per : function(num) {
      num = NS.Tools.tonum(num);
      num = NS.Tools.clamp(num, 0, 1);
      return num;
    },
    datatable : function(json) {
      if (!json || !json.table) {
        return null;
      }
      var cols = json.table.cols;
      var rows = json.table.rows;
      if (!$.isArray(cols) || !$.isArray(rows)) {
        return null;
      }
      var list = [];
      var len = rows.length;
      //(len);
      for ( var i = 0; i < len; i++) {
        var c = rows[i].c;
        if (!c) {
          continue;
        }
        //copy points
        var item = {};
        for ( var j = 0, l = c.length; j < l; j++) {
          item[cols[j].id] = c[j].v;
        }
        list.push(item);
      }
      return list;
    },
    //if have same attributes with a target
    same : function(o, t) {
      if (o === t) {
        return true;
      }
      if (!o || !t) {
        return false;
      }
      if (typeof (o) === S.FUNCTION || typeof (t) === S.FUNCTION) {
        return false;
      }
      if (NS.Tools.hasfun(o) || NS.Tools.hasfun(t)) {
        return false;
      }
      for ( var k in o) {
        var ok = o[k];
        var tk = t[k];
        if (typeof (ok) === S.OBJECT && typeof (tk) === S.OBJECT) {
          if (!NS.Tools.same(ok, tk)) {
            return false;
          }
        } else if (ok != tk) {
          return false;
        }
      }
      return true;
    },
    hasfun : function(obj) {
      if (typeof (obj) === S.OBJECT) {
        for ( var k in obj) {
          if (typeof (obj[k]) === S.FUNCTION) {
            return true;
          }
        }
      }
      return false;
    },
    //copy a object
    copy : function() {
      var c = {};
      var l = arguments.length;
      if (!l) {
        return c;
      }
      var deep = true;
      if (arguments[l - 1] === false) {
        deep = false;
      }
      for ( var i = 0; i < l; i++) {
        var o = arguments[i];
        if (!o || typeof (o) !== S.OBJECT) {
          continue;
        }
        //copy
        for ( var n in o) {
          var v = o[n];
          if (v === c[n]) {
            continue;
          }
          if (v === null) {
            //delete
            delete c[n];
          } else if (deep && typeof (v) === S.OBJECT) {
            //deep copy
            if (v instanceof Array) {
              c[n] = [].concat(v);
            } else {
              c[n] = NS.Tools.copy(c[n], v);
            }
          } else {
            c[n] = v;
          }
        }
      }
      return c;
    },
    /*
     * fit with scalemode
     */
    //0: no scale
    //1: scale with keep width/height (default)
    //2: scale without keep width/height
    //3: scale with keep width/height and cut outside
    fit : function(pw, ph, tw, th, scalemode) {
      scalemode = parseInt(scalemode);
      var rect = {
        x : 0,
        y : 0,
        width : tw,
        height : th,
        sx : 1,
        sy : 1,
        pw : pw,
        ph : ph
      };
      if (scalemode < 0 || scalemode > 3) {
        return rect;
      }
      //no sacle=========================
      //0: no scale
      if (scalemode == 0) {
        return rect;
      }
      //scale============================
      //2: scale without keep width/height
      rect.sx = pw / tw;
      rect.sy = ph / th;
      if (scalemode == 1) {
        //1: scale with keep width/height
        if (rect.sx > rect.sy) {
          rect.sx = rect.sy;
        } else if (rect.sx < rect.sy) {
          rect.sy = rect.sx;
        }
        rect.x = (pw - tw * rect.sx) * 0.5;
        rect.y = (ph - th * rect.sy) * 0.5;
      } else if (scalemode == 3) {
        //3: scale with keep width/height and cut outside
        if (rect.sx > rect.sy) {
          rect.sy = rect.sx;
        } else if (rect.sx < rect.sy) {
          rect.sx = rect.sy;
        }
        rect.x = (pw - tw * rect.sx) * 0.5;
        rect.y = (ph - th * rect.sy) * 0.5;
      }
      return rect;
    },
    /*
     * return a nice number list for coordinate axis
     */
    // http://gurge.com/blog/2008/04/02/google-chart-tips-for-ruby-hackers/
    // http://wiki.tcl.tk/9503
    // http://mustafashaik.wordpress.com/2010/11/20/nice-numbers-for-graph-labels/
    nicenum : function(min, max, num) {
      function nice(x, round) {
        var expv = Math.floor(Math.log(x) / Math.log(10));
        var f = x / Math.pow(10, expv);
        var nf;
        if (round) {
          if (f < 1.5) {
            nf = 1;
          } else if (f < 3) {
            nf = 2;
          } else if (f < 7) {
            nf = 5;
          } else {
            nf = 10;
          }
        } else {
          if (f <= 1) {
            nf = 1;
          } else if (f <= 2) {
            nf = 2;
          } else if (f <= 5) {
            nf = 5;
          } else {
            nf = 10;
          }
        }
        return nf * Math.pow(10, expv);
      }
      // default is 4
      num = num || 4;
      if (min == max) {
        max = min + 1;
      } else if (min > max) {
        var n = min;
        min = max;
        max = n;
      }
      var r = nice(max - min, false);
      var d = nice(r / (num - 1), true);
      var s = NS.Tools.mul(Math.floor(min / d), d);
      var e = NS.Tools.mul(Math.ceil(max / d), d);
      var arr = [];
      var v = s;
      while (v <= e) {
        arr.push(v);
        v = NS.Tools.add(v, d);
      }
      //(s + ", " + d + ", " + e + "\n" + arr);
      return arr;
    },
    //time division
    timediv : function(dateFrom, dateTill) {
      dateFrom = new Date(dateFrom);
      dateTill = new Date(dateTill);
      var from = dateFrom;
      var till = dateTill;
      if (dateTill - dateFrom < 0) {
        from = dateTill;
        till = dateFrom;
      }
      if (till.getFullYear() != from.getFullYear()) {
        if (till.getFullYear() - from.getFullYear() < 2 && till.getMonth() <= from.getMonth()) {
          return S.MONTHLY;
        }
        return S.YEARLY;
      } else if (till.getMonth() != from.getMonth()) {
        if (till.getMonth() - from.getMonth() < 2 && till.getDate() <= from.getDate()) {
          return S.DAILY;
        }
        return S.MONTHLY;
      } else if (till.getDate() != from.getDate()) {
        if (till.getDate() - from.getDate() < 2 && till.getHours() <= from.getHours()) {
          return S.HOURLY;
        }
        return S.DAILY;
      } else if (till.getHours() != from.getHours()) {
        if (till.getHours() - from.getHours() < 2 && till.getMinutes() <= from.getMinutes()) {
          return S.MINUTELY;
        }
        return S.HOURLY;
      } else {
        return S.MINUTELY;
      }
    },
    //collide Brownian Motion
    collide : function(data, min, max) {
      min = isNaN(min) ? -Number.MAX_VALUE : min;
      max = isNaN(max) ? Number.MAX_VALUE : max;
      //sort list =======================================================
      var sortList = function(list) {
        list.sort(function(a, b) {
          var av = NS.Tools.isnum(a.order) ? a.order : a.value;
          var bv = NS.Tools.isnum(b.order) ? b.order : b.value;
          return av - bv;
        });
        return list;
      };
      //update all children value ==========================================
      var updateChildren = function(item) {
        var children = item.children;
        if (!children) {
          return;
        }
        sortList(children);
        var start = item.value - item.range * 0.5;
        for ( var i = 0, l = children.length; i < l; i++) {
          var child = children[i];
          child.value = start + child.range * 0.5;
          updateChildren(child);
          start += child.range;
        }
      };
      //range fixing by min/max ===========================================
      var clampValue = function(list) {
        list = NS.Tools.array(list);
        for ( var i = 0, l = list.length; i < l; i++) {
          var item = list[i];
          var r = item.range * 0.5;
          var v = NS.Tools.clamp(item.value, min + r, max - r);
          //keep value for sort
          item.order = item.value;
          //clamp value
          item.value = v;
          //update group value include all children
          updateChildren(item);
        }
        sortList(list);
      };
      //parse list =======================================================
      var parseList = function(list) {
        if (list instanceof Array) {
          var size = list.length;
          if (size > 0) {
            var value = 0;
            var range = 0;
            for ( var i = 0; i < size; i++) {
              var item = list[i];
              value += item.value;
              range += item.range;
            }
            return {
              range : range,
              value : value / size
            };
          }
        }
        return null;
      };
      //group items if overlap ===========================================
      var groupOverlap = function(data) {
        //fixing all by min/max first
        clampValue(data);
        //
        var dataSize = data.length;
        if (dataSize < 2) {
          return data;
        }
        //must be 2 more can overlap
        var list = [];
        var last = null;
        var team = {
          children : []
        };
        //try to group if overlap
        for ( var i = 0; i < dataSize; i++) {
          var item = data[i];
          if (last) {
            if (last.value + last.range * 0.5 > item.value - item.range * 0.5) {
              //overlap
              team.children.push(item);
            } else {
              team = {
                children : []
              };
              list.push(team);
              team.children.push(item);
            }
          } else {
            //first time
            list.push(team);
            team.children.push(item);
          }
          //keep last item at last
          last = item || last;
        }
        var listSize = list.length;
        //if any group
        if (listSize < dataSize) {
          //update average value and total range for a team list
          for ( var i = 0; i < listSize; i++) {
            var item = list[i];
            var info = parseList(item.children);
            if (info) {
              item.value = info.value;
              item.range = info.range;
            }
          }
          //group fixing by min and max
          clampValue(list);
          //group team list
          return groupOverlap(list);
        }
        //no overlap
        return data;
      };
      //ungroup list ======================================================
      var ungroupList = function(data) {
        var list = [];
        for ( var i = 0, l = data.length; i < l; i++) {
          var item = data[i];
          if (item.children) {
            var team = ungroupList(item.children);
            for ( var j = 0, s = team.length; j < s; j++) {
              list.push(team[j]);
            }
          } else {
            list.push(item);
          }
        }
        return list;
      };
      //==================================================================
      //fix all range before sort
      clampValue(data);
      //(data);
      var info = parseList(data);
      if (info) {
        if (info.range > max - min) {
          var start = min + (max - min) * 0.5 - info.range * 0.5;
          for ( var i = 0, l = data.length; i < l; i++) {
            var item = data[i];
            item.value = start + item.range * 0.5;
            start += item.range;
          }
          return data;
        }
      }
      //group overlap to list
      var list = groupOverlap(data);
      //(list);
      //ungroup list
      list = ungroupList(list);
      //(list);
      return list;
    },
    /*
     * float number fixing, Floating-Point Arithmetic
     * http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
     */
    // return float part length
    flen : function(n) {
      var a = String(n).split(".");
      if (a.length > 1) {
        return a[1].length;
      }
      return 0;
    },
    // return float as int
    fint : function(n) {
      return parseInt(String(n).replace(".", ""));
    },
    // +
    add : function(n1, n2) {
      var r1 = NS.Tools.flen(n1);
      var r2 = NS.Tools.flen(n2);
      if (r1 + r2 == 0) {
        return n1 + n2;
      } else {
        var m = Math.pow(10, Math.max(r1, r2));
        return (Math.round(n1 * m) + Math.round(n2 * m)) / m;
      }
    },
    // -
    sub : function(n1, n2) {
      return NS.Tools.add(n1, -n2);
      /*
      var r1 = NS.Tools.flen(n1);
      var r2 = NS.Tools.flen(n2);
      if (r1 + r2 == 0) {
        return n1 - n2;
      } else {
        var m = Math.pow(10, Math.max(r1, r2));
        var n = (r1 >= r2) ? r1 : r2;
        return ((n1 * m - n2 * m) / m).toFixed(n);
      }
      */
    },
    // *
    mul : function(n1, n2) {
      var r1 = NS.Tools.flen(n1);
      var r2 = NS.Tools.flen(n2);
      if (r1 + r2 == 0) {
        return n1 * n2;
      } else {
        var m1 = NS.Tools.fint(n1);
        var m2 = NS.Tools.fint(n2);
        return (m1 * m2) / Math.pow(10, r1 + r2);
      }
    },
    // /
    div : function(n1, n2) {
      var r1 = NS.Tools.flen(n1);
      var r2 = NS.Tools.flen(n2);
      if (r1 + r2 == 0) {
        return n1 / n2;
      } else {
        var m1 = NS.Tools.fint(n1);
        var m2 = NS.Tools.fint(n2);
        return (m1 / m2) * Math.pow(10, r2 - r1);
      }
    },
    //zero fixed
    zero : function(s, l) {
      s += "";
      l = l || 2;
      if (s.length < l) {
        var n = l - s.length;
        s = Math.pow(10, n).toString().substr(1) + s;
      }
      return s;
    }
  };
  NS.Tools = NS.Tools.prototype;
  var T = NS.T = NS.Tools;
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.Cursor}
   */
  NS.Cursor = function() {
    var list = {
      grab : "url({path}/grab.cur), auto",
      grabbing : "url({path}/grabbing.cur), move",
      crop : "url({path}/crop.cur), auto"
    };
    var path = (window.location.protocol == "file:") ? "../../components/chart/images" : "/ct/trunk/components/chart/images";
    var navu = navigator.userAgent.toLowerCase();
    var gecko = navu.indexOf("gecko") != -1 && navu.indexOf("firefox") != -1;
    var webkit = false;
    if (!gecko) {
      webkit = navu.indexOf("webkit") != -1;
    }
    //(navu, gecko, webkit);
    for ( var k in list) {
      var str = list[k];
      if (webkit) {
        //css3 fixing for webkit
        var arr = str.split(",");
        arr[0] += " 8 0 ";
        str = arr.join(",");
      }
      str = str.replace("{path}", path);
      list[k] = str;
    }
    if (gecko) {
      list.grab = "-moz-grab";
      list.grabbing = "-moz-grabbing";
    }
    return list;
  };
  NS.Cursor = new NS.Cursor();
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.Color}
   */
  NS.Color = function() {
    //make default web 216 safe color list
    var table = ["00", "33", "66", "99", "CC", "FF"];
    for ( var i = 0; i < 6; i++) {
      for ( var j = 0; j < 6; j++) {
        for ( var k = 0; k < 6; k++) {
          this.lib.web.push("#" + table[i] + table[j] + table[k]);
        }
      }
    }
    //
  };
  NS.Color.prototype = {
    cache : {},
    from : "ms",
    index : 0,
    lib : {
      web : [],
      ms : ["#728fb2", "#87aa32", "#e96610", "#9b0033", "#283f6e", "#f1ad02", "#006065"]
    },
    get : function(numid) {
      //get a list with a number
      if (T.isnum(numid) && numid > 0 && numid < 216) {
        return this.getList(numid);
      }
      //get color from a id
      return this.getColor(numid);
    },
    getColor : function(id) {
      //from cache
      var color = this.cache[id];
      if (color) {
        return color;
      }
      //from new one
      var list = this.lib[this.from];
      if (list) {
        color = list[this.index];
        //next index
        this.index++;
        if (this.index >= list.length) {
          this.index = 0;
        }
      } else {
        color = this.random();
      }
      //keep to cache
      if (id) {
        this.cache[id] = color;
      }
      return color;
    },
    getList : function(len) {
      var list = [];
      for ( var i = 0; i < len; i++) {
        list.push(this.random());
      }
      return list;
    },
    random : function() {
      var num = Math.round(Math.random() * 0xffffff);
      var str = num.toString(16);
      var len = str.length;
      if (len < 6) {
        var n = 6 - len;
        str += Math.pow(10, n).toString().substr(1);
      }
      str = "#" + str.toUpperCase();
      return str;
    }
  };
  NS.Color = new NS.Color();
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.CSSManager}
   */
  NS.CSSManager = function() {
  };
  NS.CSSManager.prototype = {
    timeout : null,
    timeval : null,
    csslist : null,
    //callback handler
    loadcallback : null,
    //timeout duration
    loadduration : 10000,
    loadstopped : false,
    loadstop : function() {
      this.loadstopped = true;
      clearTimeout(this.timeout);
      clearInterval(this.timeval);
    },
    loadcomplete : function() {
      this.loadstop();
      var self = this;
      setTimeout(function() {
        if (typeof (self.loadcallback) === S.FUNCTION) {
          self.loadcallback.call(self);
        }
      }, 100);
    },
    //check styleSheets
    loadcheck : function() {
      if (this.loadstopped) {
        return this;
      }
      var loaded = 0;
      var sheets = document.styleSheets;
      var len = sheets.length;
      for ( var i = 0; i < len; i++) {
        var href = sheets[i].href;
        if (this.loadcheckhref(href)) {
          loaded++;
        }
      }
      var total = this.csslist.length;
      if (loaded >= total) {
        //all done
        this.loadcomplete();
        return;
      }
      return this;
    },
    loadcheckhref : function(href) {
      for ( var i = 0, l = this.csslist.length; i < l; i++) {
        var url = this.csslist[i];
        if (href == url) {
          return true;
        }
      }
      return false;
    },
    loadremove : function(link) {
      var href = link.href;
      for ( var i = 0; i < this.csslist.length; i++) {
        var url = this.csslist[i];
        if (href == url) {
          this.csslist.splice(i, 1);
          break;
        }
      }
      return this;
    },
    load : function(csslist, callback, duration) {
      this.loadcallback = callback;
      this.loadstop();
      if (csslist && !(csslist instanceof Array)) {
        csslist = [csslist];
      }
      this.csslist = [];
      var head = document.head;
      if (!head) {
        this.loadcomplete();
        return this;
      }
      var self = this;
      for ( var i = 0, l = csslist.length; i < l; i++) {
        var href = csslist[i];
        if (!href) {
          continue;
        }
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "" + href;
        //IE/FF/Opera, Not Chrome
        link.onload = link.onerror = function() {
          self.loadremove(this);
        };
        head.appendChild(link);
        this.csslist.push(link.href);
      }
      //
      if (!this.csslist.length) {
        this.loadcomplete();
        return this;
      }
      //start
      this.loadstopped = false;
      //
      //final check
      this.timeval = setInterval(function() {
        self.loadcheck();
      }, 100);
      //timeout check
      duration = Math.max(0, parseInt(duration));
      duration = duration || this.loadduration;
      this.timeout = setTimeout(function() {
        self.loadcomplete();
      }, duration);
      //
      return this;
    },
    remove : function(csslist, callback) {
      if (csslist && !(csslist instanceof Array)) {
        csslist = [csslist];
      }
      var len = csslist.length;
      if (len) {
        var temp = document.createElement("link");
        for ( var i = 0; i < len; i++) {
          var href = csslist[i];
          if (href) {
            temp.href = href;
            this.removehref(temp.href);
          }
        }
      }
      if (typeof (callback) === S.FUNCTION) {
        callback.call(this);
      }
      return this;
    },
    removehref : function(href) {
      var links = document.getElementsByTagName("link");
      for ( var i = 0, l = links.length; i < l; i++) {
        var link = links[i];
        if (link && link.href == href && link.parentNode) {
          link.parentNode.removeChild(link);
          break;
        }
      }
      return this;
    }
  };
  NS.CSSManager = NS.CSSManager.prototype;
  //====================================================================================================
  /**
   * @constructor
   * @param mode
   * @returns {NS.Mapping}
   */
  NS.Mapping = function(mode) {
    // 0 Linear, 1 Logarithm
    this.mode = mode == 1 ? 1 : 0;
  };
  NS.Mapping.prototype = {
    mode : 0,
    //start coord
    sCoord : 0,
    //end coord
    eCoord : 0,
    //start value
    sValue : 0,
    //end value
    eValue : 0,
    //cache ================================
    //cache for Linear
    perCoord : 0,
    perValue : 0,
    //cahce for Logarithm
    fixValue : 0,
    sLogValue : 0,
    eLogValue : 0,
    //======================================
    getRange : function() {
      return {
        sCoord : this.sCoord,
        eCoord : this.eCoord,
        sValue : this.sValue,
        eValue : this.eValue
      };
    },
    setRange : function(sCoord, eCoord, sValue, eValue) {
      this.sCoord = T.tonum(sCoord);
      this.eCoord = T.tonum(eCoord);
      this.sValue = T.tonum(sValue);
      this.eValue = T.tonum(eValue);
      //("coord:" + this.sCoord + " -> " + this.eCoord + " / value:" + this.sValue + " -> " + this.eValue);
      // cache ====================================
      if (this.mode == 1) {
        if (this.sValue < 1) {
          this.fixValue = 1 - this.sValue;
        } else {
          this.fixValue = 0;
        }
        this.sLogValue = Math.log(this.sValue + this.fixValue);
        this.eLogValue = Math.log(this.eValue + this.fixValue);
      } else {
        if (this.eCoord == this.sCoord) {
          this.perCoord = 0;
        } else {
          this.perCoord = 1 / (this.eCoord - this.sCoord) * (this.eValue - this.sValue);
        }
        if (this.eValue == this.sValue) {
          this.perValue = 0;
        } else {
          this.perValue = 1 / (this.eValue - this.sValue) * (this.eCoord - this.sCoord);
        }
      }
      //============================================
      return this;
    },
    getValueByCoord : function(num) {
      num = T.tonum(num);
      if (this.mode == 1) {
        if (this.eCoord == this.sCoord) {
          return 0;
        } else {
          var n = (num - this.sCoord) * (this.eLogValue - this.sLogValue);
          var m = this.eCoord - this.sCoord;
          var v = Math.pow(Math.E, this.sLogValue + n / m);
          return v;
        }
      } else {
        return this.sValue + (num - this.sCoord) * this.perCoord;
      }
    },
    getCoordByValue : function(num) {
      num = T.tonum(num);
      if (this.mode == 1) {
        if (this.eValue == this.sValue) {
          return 0;
        } else {
          var n = Math.log(num + this.fixValue) - this.sLogValue;
          var m = (this.eCoord - this.sCoord) / (this.eLogValue - this.sLogValue);
          var v = this.sCoord + n * m;
          return v;
        }
      } else {
        return this.sCoord + (num - this.sValue) * this.perValue;
      }
    },
    toString : function() {
      return "[object Mapping]";
    }
  };
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.Easing}
   */
  //t current time
  //b beginning value
  //c change in value
  //d duration
  NS.Easing = function() {
  };
  NS.Easing.prototype = {
    linear : function(t, b, c, d) {
      return c * t / d + b;
    },
    easeInQuad : function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad : function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad : function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      }
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic : function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic : function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic : function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart : function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart : function(t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart : function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      }
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint : function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint : function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint : function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine : function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine : function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine : function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo : function(t, b, c, d) {
      return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo : function(t, b, c, d) {
      return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo : function(t, b, c, d) {
      if (t == 0) {
        return b;
      }
      if (t == d) {
        return b + c;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      }
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc : function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc : function(t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc : function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      }
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic : function(t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t == 0) {
        return b;
      }
      if ((t /= d) == 1) {
        return b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic : function(t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t == 0) {
        return b;
      }
      if ((t /= d) == 1) {
        return b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic : function(t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t == 0) {
        return b;
      }
      if ((t /= d / 2) == 2) {
        return b + c;
      }
      if (!p) {
        p = d * (.3 * 1.5);
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) {
        return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      }
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack : function(t, b, c, d, s) {
      if (s == undefined) {
        s = 1.70158;
      }
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack : function(t, b, c, d, s) {
      if (s == undefined) {
        s = 1.70158;
      }
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack : function(t, b, c, d, s) {
      if (s == undefined) {
        s = 1.70158;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
      }
      return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeInBounce : function(t, b, c, d) {
      return c - NS.Easing.easeOutBounce(d - t, 0, c, d) + b;
    },
    easeOutBounce : function(t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
      } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
      }
    },
    easeInOutBounce : function(t, b, c, d) {
      if (t < d / 2) {
        return NS.Easing.easeInBounce(t * 2, 0, c, d) * .5 + b;
      }
      return NS.Easing.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
  };
  NS.Easing = NS.Easing.prototype;
  //====================================================================================================
  /**
   * @constructor
   * @param option
   * @returns {NS.Animate}
   */
  NS.Animate = function(option) {
    for (k in option) {
      this[k] = option[k];
    }
    this.animation_init();
  };
  NS.Animate.prototype = {
    //animation target
    target : null,
    //default is Easing.linear
    easing : null,
    //freq per second
    fps : 50,
    freq : null,
    //delay time before run
    delay : 0,
    //total time
    duration : 100,
    //from data
    from : 0,
    //till data
    till : 1,
    //current data(private)
    data : 0,
    //
    exact : true,
    //time record
    time : null,
    timeout : null,
    timeval : null,
    //if stopped then stop everything
    stopped : false,
    /*
     * private function
     * ===================================================================
     */
    animation_init : function() {
      this.delay = T.tonum(this.delay, true);
      if (this.delay > 0) {
        var self = this;
        this.timeout = setTimeout(function() {
          self.animation_run();
        }, this.delay);
      } else {
        this.animation_run();
      }
    },
    animation_run : function() {
      //if call stop before delay time
      if (this.stopped) {
        return this;
      }
      //ready
      this.freq = this.freq || Math.ceil(1000 / this.fps);
      this.duration = parseInt(this.duration) || 100;
      if (typeof (this.easing) !== S.FUNCTION) {
        this.easing = NS.Easing.linear;
      }
      //start callback, maybe cost musch time outside
      this.start();
      //if call stop in start callback
      if (this.stopped) {
        return this;
      }
      //
      if (!this.exact) {
        this.time = new Date();
      }
      //
      var self = this;
      this.timeval = setInterval(function() {
        //if call stop in running
        if (self.stopped) {
          return this;
        }
        //fixed animation do not run if start before some codes
        if (self.exact) {
          self.exact = false;
          self.time = new Date();
        }
        var now = new Date();
        var t = now - self.time;
        var d = self.duration;
        if (t < d) {
          self.data = self.animation_calculate(t, d, self.from, self.till, self.from);
          //step callback
          self.step(self.data);
        } else {
          //last time step callback
          self.step(self.till);
          //complete callback
          self.complete();
          //clear
          self.stop();
        }
      }, this.freq);
    },
    //stop loop calculate if back to self
    animation_calculate : function(t, d, from, till, self) {
      if (typeof (from) === S.OBJECT && typeof (till) === S.OBJECT) {
        if (from instanceof Array && till instanceof Array) {
          //if array
          var v = [];
          for ( var i = 0, l = from.length; i < l; i++) {
            if (till[i] === undefined || from[i] === self) {
              v[i] = from[i];
            } else {
              v[i] = this.animation_calculate(t, d, from[i], till[i], self);
            }
          }
          return v;
        } else {
          //if object
          var v = {};
          for ( var k in from) {
            if (till[k] === undefined || from[k] === self) {
              v[k] = from[k];
            } else {
              v[k] = this.animation_calculate(t, d, from[k], till[k], self);
            }
          }
          return v;
        }
      } else if (T.isnum(from) && T.isnum(till)) {
        //must be number
        var b = from;
        var c = till - b;
        return this.easing.call(this, t, b, c, d);
      } else {
        //just return from value if NOT number
        return from;
      }
    },
    /*
     * animation callback
     * =================================================================
     */
    //callback when start, but after delay time
    start : function() {
    },
    //callback when every step running, pass current data 
    step : function(data) {
    },
    //callback when completed, but before stop
    complete : function() {
    },
    /*
     * stop everything
     * =================================================================
     */
    stop : function() {
      //force to send till info, but not call complete function
      if (arguments[0]) {
        this.step(this.till);
      }
      //stop everything now
      this.stopped = true;
      //clear everything
      clearTimeout(this.timeout);
      clearInterval(this.timeval);
      this.target = null;
      this.easing = null;
      this.from = 0;
      this.till = 1;
      this.data = 0;
    },
    toString : function() {
      return "[object Animate]";
    }
  };
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.SVG}
   */
  NS.SVG = function() {
  };
  NS.SVG.prototype = {
    attr : function(elem, name, value) {
      if (!elem) {
        return;
      }
      if (typeof (elem.get) === S.FUNCTION) {
        elem = elem.get(0);
      }
      var nType = elem.nodeType;
      if (!nType || nType === 3 || nType === 8 || nType === 2) {
        return elem;
      }
      if (typeof (name) === S.OBJECT) {
        for ( var k in name) {
          NS.SVG.attr(elem, k, name[k]);
        }
        return elem;
      }
      if (value !== undefined) {
        if (value === null) {
          elem.removeAttribute(name);
        } else {
          elem.setAttribute(name, value);
        }
        return elem;
      } else {
        return elem.getAttribute(name);
      }
    },
    point : function() {
      return (arguments[0] || 0) + S.COMMA + (arguments[1] || 0);
    },
    matrix : function() {
      return "matrix(" + Array.prototype.slice.call(arguments).join(S.COMMA) + ")";
    },
    //transform
    translate : function() {
      return "translate(" + Array.prototype.slice.call(arguments).join(S.COMMA) + ")";
    },
    scale : function() {
      var str = "scale(" + Array.prototype.slice.call(arguments).join(S.COMMA) + ")";
      return str;
    },
    rotate : function() {
      var str = "rotate(" + Array.prototype.slice.call(arguments).join(S.COMMA) + ")";
      return str;
    },
    skewX : function() {
      return "skewX(" + arguments[0] + ")";
    },
    skewY : function() {
      return "skewY(" + arguments[0] + ")";
    },
    /**
     * @function
     * @param t
     *          type left, top, bottom, right
     * @param l
     *          arrow length
     * @param s
     *          arrow postion scale
     * @param x
     *          offset x
     * @param y
     *          offset y
     * @param w
     *          width
     * @param h
     *          height
     * @param r
     *          radius for border
     * @returns {String} svg path d
     */
    getTipPath : function(t, l, s, x, y, w, h, r) {
      if (!w || !h) {
        return "";
      }
      var p = NS.SVG.point;
      var arr = [];
      //arrow position fixing
      var v = 0;
      if (t === S.LEFT || t === S.RIGHT) {
        v = (l + r) / h;
      } else if (t === S.TOP || t === S.BOTTOM) {
        v = (l + r) / w;
      }
      s = T.clamp(s, v, 1 - v);
      //if short than r
      arr.push("M" + p(x, y + r));
      arr.push("Q" + p(x, y) + " " + p(x + r, y));
      if (t === S.TOP) {
        arr.push("h" + (w * s - r - l));
        arr.push("l" + p(l, -l));
        arr.push("l" + p(l, l));
      }
      arr.push("L" + p(x + w - r, y));
      arr.push("Q" + p(x + w, y) + " " + p(x + w, y + r));
      if (t === S.RIGHT) {
        arr.push("v" + (h * s - r - l));
        arr.push("l" + p(l, l));
        arr.push("l" + p(-l, l));
      }
      arr.push("L" + p(x + w, y + h - r));
      arr.push("Q" + p(x + w, y + h) + " " + p(x + w - r, y + h));
      if (t === S.BOTTOM) {
        arr.push("h" + (-w + w * s + r + l));
        arr.push("l" + p(-l, l));
        arr.push("l" + p(-l, -l));
      }
      arr.push("L" + p(x + r, y + h));
      arr.push("Q" + p(x, y + h) + " " + p(x, y + h - r));
      if (t === S.LEFT) {
        arr.push("v" + (-h + h * s + r + l));
        arr.push("l" + p(-l, -l));
        arr.push("l" + p(l, -l));
      }
      arr.push("L" + p(x, y + r));
      return arr.join(S.SPACE);
    },
    //get ellipse by 2 arc
    getArcPath : function(x, y, rx, ry, rotation, clockwise) {
      ry = ry || rx;
      rotation = rotation || 0;
      var c = S.COMMA;
      var rs = "a" + rx + c + ry;
      var es = (rx * 2) + c + "0";
      var arr = ["M" + (x - rx) + c + y];
      arr.push(rs);
      arr.push(rotation + c);
      if (clockwise) {
        arr.push("1,1");
      } else {
        arr.push("1,0");
      }
      arr.push(es);
      arr.push(rs);
      arr.push(rotation + c);
      if (clockwise) {
        arr.push("0,1");
      } else {
        arr.push("0,0");
      }
      arr.push("-" + es);
      arr.push("z");
      return arr.join(S.SPACE);
    },
    //center point x,y
    getEllipsePath : function(x, y, w, h, clockwise) {
      var kappa = .5522848;
      var p = NS.SVG.point;
      var f = T.numfix;
      var c = S.COMMA;
      //
      var rx = f(w * 0.5, 1);
      var ry = f(h * 0.5, 1);
      var ox = f(rx * kappa, 1);
      var oy = f(ry * kappa, 1);
      //
      var arr = ["M" + p(f(x - rx, 1), y)];
      if (clockwise) {
        arr.push("c" + p(0, -oy) + c + p(f(rx - ox, 1), -ry) + c + p(rx, -ry));
        arr.push("s" + p(rx, f(ry - oy, 1)) + c + p(rx, ry));
        arr.push("s" + p(f(ox - rx, 1), ry) + c + p(-rx, ry));
        arr.push("s" + p(-rx, f(-ry + oy, 1)) + c + p(-rx, -ry));
      } else {
        arr.push("c" + p(0, oy) + c + p(f(rx - ox, 1), ry) + c + p(rx, ry));
        arr.push("s" + p(rx, f(-ry + oy, 1)) + c + p(rx, -ry));
        arr.push("s" + p(f(ox - rx, 1), -ry) + c + p(-rx, -ry));
        arr.push("s" + p(-rx, f(ry - oy, 1)) + c + p(-rx, ry));
      }
      arr.push("z");
      return arr.join(S.SPACE);
    },
    getRectPath : function(x, y, w, h) {
      var p = NS.SVG.point;
      var f = T.numfix;
      var arr = ["M" + p(x, y)];
      arr.push("h" + f(w, 1));
      arr.push("v" + f(h, 1));
      arr.push("h" + f(-w, 1));
      arr.push("v" + f(-h, 1));
      arr.push("z");
      return arr.join(S.SPACE);
    },
    //get line data for svg format
    getElementData : function() {
      var copy = T.copy.apply(this, arguments);
      //auto change to svg element parameter
      var out = {};
      for ( var n in copy) {
        var v = copy[n];
        if (n === "lineWidth") {
          n = "stroke-width";
          v = T.tonum(v, true);
        } else if (n === "lineColor") {
          n = "stroke";
        } else if (n === "fillColor") {
          n = "fill";
        }
        out[n] = v;
      }
      return out;
    },
    addGradientFill : function(renderer, data, id, color) {
      var fill = data.fill;
      if (typeof (fill) !== S.OBJECT) {
        return;
      }
      var types = {
        linear : "linear",
        radial : "radial"
      };
      var type = types[fill.type] || types.linear;
      var defs = $(renderer.defs);
      var def = defs.find("#" + id);
      if (!def.length) {
        def = $(renderer.create(type + "Gradient", {
          id : id
        }, defs));
      }
      if (type == types.radial) {
        def.attr({
          cx : fill.cx,
          cy : fill.cy,
          r : fill.r,
          fx : fill.fx,
          fy : fill.fy
        });
      } else {
        def.attr({
          x1 : fill.x1,
          x2 : fill.x2,
          y1 : fill.y1,
          y2 : fill.y2
        });
      }
      def.empty();
      var stop = fill.stop;
      if ($.isArray(stop)) {
        for ( var i = 0, l = stop.length; i < l; i++) {
          var item = stop[i];
          if (color) {
            item["stop-color"] = color;
          }
          renderer.create("stop", item, def);
        }
      }
      data.fill = "url(#" + id + ")";
    },
    getRect : function(target, svg_root) {
      var rect = {
        x : 0,
        y : 0,
        width : 0,
        height : 0
      };
      if (!target) {
        return rect;
      }
      if (svg_root && !$.contains(document.body, svg_root)) {
        var hc = NS.SVG.HiddenContainer;
        if (!hc) {
          //do not remove this hidden reusable container
          hc = $(S.DIV).css({
            top : -1080,
            left : -1920,
            position : S.ABSOLUTE,
            visibility : S.HIDDEN
          }).attr({
            id : "global_hidden_container_for_svg"
          });
          $(document.body).append(hc);
          NS.SVG.HiddenContainer = hc;
        }
        hc.append(svg_root);
      }
      //copy top, left, right, bottom
      if (target.getBoundingClientRect) {
        var bound = target.getBoundingClientRect();
        for ( var k in bound) {
          rect[k] = bound[k];
        }
      }
      //box
      var bbox = null;
      if (target.getBBox) {
        try {
          bbox = target.getBBox();
        } catch (e) {
          //(target);
        }
      }
      if (bbox) {
        rect.x = bbox.x;
        rect.y = bbox.y;
        rect.width = bbox.width;
        rect.height = bbox.height;
      } else {
        //(target);
        target = $(target);
        var offset = target.offset();
        var width = target.width();
        var height = target.height();
        rect.x = offset.left;
        rect.y = offset.top;
        rect.width = width;
        rect.height = height;
      }
      //(rect);
      return rect;
    },
    contains : function(container, target) {
      container = $(container).get(0);
      target = $(target).get(0);
      //(container, target);
      if (!container || !target) {
        return false;
      }
      if (container.compareDocumentPosition) {
        return container.compareDocumentPosition(target) & 16;
      }
      return false;
    },
    getPath : function() {
      var a = [];
      var n = false;
      for ( var i = 0; i < arguments.length; i++) {
        var v = arguments[i];
        if (T.isnum(v)) {
          if (n) {
            a.push(S.COMMA);
          }
          a.push(T.numfix(v, 1));
          n = true;
        } else {
          a.push(v);
          n = false;
        }
      }
      var s = a.join("");
      return s;
    }
  };
  NS.SVG = NS.SVG.prototype;
  //====================================================================================================
  /**
   * @constructor
   * @param type
   */
  NS.Renderer = function(type) {
    if (this.support(type)) {
      return this.getRenderer(type);
    }
    // auto select
    if (this.support(S.SVG)) {
      type = S.SVG;
    } else if (this.support(S.VML)) {
      type = S.VML;
    } else if (this.support(S.CANVAS)) {
      type = S.CANVAS;
    }
    if (this.support(type)) {
      return this.getRenderer(type);
    }
    throw new Error(this + " NOT support " + type);
  };
  NS.Renderer.prototype = {
    /**
     * @function
     * @param {String}
     *          type svg, vml, canvas
     * @returns {NS.SVGRenderer|NS.CANVASRenderer|NS.VMLRenderer}
     */
    getRenderer : function(type) {
      if (type == S.CANVAS) {
        return new NS.CANVASRenderer();
      } else if (type == S.VML) {
        return new NS.VMLRenderer();
      } else {
        return new NS.SVGRenderer();
      }
    },
    /**
     * @function
     * @param {String}
     *          type svg, vml, canvas
     * @returns {Boolean}
     */
    support : function(type) {
      // renderer enabled
      var SupportSVG = !!document.createElementNS && !!document.createElementNS(S.SVG_NS, S.SVG).createSVGRect;
      var SupportVML = $.browser.msie;
      var SupportCANVAS = !!document.createElement(S.CANVAS).getContext;
      //
      if (type == S.SVG) {
        return SupportSVG;
      } else if (type == S.VML) {
        return SupportVML;
      } else if (type == S.CANVAS) {
        return SupportCANVAS;
      } else {
        return false;
      }
    },
    /**
     * @function
     * @returns {String}
     */
    toString : function() {
      return "[object Renderer]";
    }
  };
  //====================================================================================================
  /**
   * @constructor
   */
  NS.RendererBase = function() {
  };
  NS.RendererBase.prototype = {
    /**
     * @property
     */
    type : undefined,
    /**
     * @property
     */
    root : null,
    /**
     * @property
     */
    width : 0,
    /**
     * @property
     */
    height : 0,
    /**
     * @function
     */
    init : function() {
    },
    /**
     * @function
     */
    setSize : function() {
    },
    /**
     * @function
     */
    drawCircle : function() {
    },
    /**
     * @function
     */
    drawEllipse : function() {
    },
    /**
     * @function
     */
    drawRect : function() {
    },
    /**
     * @function
     */
    drawRoundRect : function() {
    },
    /**
     * @function
     */
    drawLine : function() {
    },
    /**
     * @function
     */
    drawPolyline : function() {
    },
    /**
     * @function
     */
    drawPolygon : function() {
    },
    /**
     * @function
     */
    drawPath : function() {
    },
    /**
     * @function
     */
    drawText : function() {
    },
    /**
     * @function
     */
    drawImage : function() {
    },
    /**
     * @function
     */
    drawGroup : function() {
    },
    /**
     * @function
     * @returns {Boolean}
     */
    support : NS.Renderer.prototype.support,
    /**
     * @function
     * @returns {String}
     */
    toXMLString : function() {
      return "";
    },
    /**
     * @function
     * @returns {String}
     */
    toString : function() {
      return "[object " + this.type.toUpperCase() + "Renderer]";
    }
  };
  //====================================================================================================
  /**
   * @constructor
   * @extends NS.RendererBase
   */
  NS.SVGRenderer = function() {
  };
  NS.SVGRenderer.prototype = {
    /**
     * @property
     */
    type : S.SVG,
    /**
     * @property
     */
    width : 0,
    /**
     * @property
     */
    height : 0,
    /**
     * @property
     */
    root : null,
    /**
     * @property
     */
    desc : null,
    /**
     * @property
     */
    defs : null,
    init : function(width, height, parent, child) {
      // SVG root
      this.root = this.create(S.SVG, {
        //fixed for IE9
        overflow : S.HIDDEN,
        xmlns : S.SVG_NS,
        "xmlns:xlink" : S.SVG_LINK,
        version : 1.1
      }, parent, child);
      this.setSize(width, height);
      //description
      this.desc = this.createElement(S.DESC);
      this.root.appendChild(this.desc);
      //defined
      this.defs = this.createElement(S.DEFS);
      this.root.appendChild(this.defs);
      return this.root;
    },
    /**
     * @function
     * @param width
     * @param height
     */
    setSize : function(width, height) {
      var t = T;
      width = Math.max(0, t.tonum(width, true));
      height = Math.max(0, t.tonum(height, true));
      if (this.width != width || this.height != height) {
        this.width = width;
        this.height = height;
        NS.SVG.attr(this.root, {
          width : this.width,
          height : this.height
        });
      }
    },
    createElement : function(name) {
      if (document.createElementNS) {
        return document.createElementNS(S.SVG_NS, name);
      } else {
        return document.createElement(name);
      }
    },
    /**
     * @function
     * @param name
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    create : function(name, data, parent, child) {
      name = name || S.G;
      var node = this.createElement(name);
      // attrs
      if (data) {
        for ( var k in data) {
          var v = data[k];
          if (v === undefined || v === null) {
            continue;
          }
          if ((k === S.HREF || k === S.XHREF) && name === S.IMAGE) {
            node.setAttributeNS(S.SVG_LINK, S.HREF, v);
          } else {
            node.setAttribute(k, v);
          }
        }
      }
      // append text or children
      if (name === S.TEXT || child) {
        if (name === S.TEXT && $.isArray(child)) {
          // for text tspan list
          for ( var i = 0, l = child.length; i < l; i++) {
            var item = child[i];
            if (typeof (item) === S.OBJECT) {
              var tspan = item.value;
              delete item.value;
              this.drawTspan(item, node, tspan);
            } else {
              $(node).append(item);
            }
          }
        } else {
          $(node).append(child);
        }
      }
      // append to parent
      if (parent) {
        $(parent).append(node);
      }
      return node;
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawCircle : function(data, parent, child) {
      //cx, cy, r
      return this.create(S.CIRCLE, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawEllipse : function(data, parent, child) {
      //cx, cy, rx, ry
      return this.create(S.ELLIPSE, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawRect : function(data, parent, child) {
      //x, y, width, height
      return this.create(S.RECT, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawRoundRect : function(data, parent, child) {
      //x, y, width, height, rx, ry
      return this.drawRect(data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    // path
    drawLine : function(data, parent, child) {
      //x1, y1, x2, y2
      return this.create(S.LINE, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawPolyline : function(data, parent, child) {
      //points
      return this.create(S.POLYLINE, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawPolygon : function(data, parent, child) {
      //points
      return this.create(S.POLYGON, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawPath : function(data, parent, child) {
      //d
      return this.create(S.PATH, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawText : function(data, parent, child) {
      //x, y, dx, dy, rotate, textLength, lengthAdjust
      return this.create(S.TEXT, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawTspan : function(data, parent, child) {
      //x, y, dx, dy, rotate, textLength
      return this.create(S.TSPAN, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawImage : function(data, parent, child) {
      //x, y, width, height, xlink:href
      return this.create(S.IMAGE, data, parent, child);
    },
    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawGroup : function(data, parent, child) {
      return this.create(S.G, data, parent, child);
    },
    /**
     * @function
     * @returns {String}
     */
    toXMLString : function() {
      var str = "";
      if (this.root) {
        var parent = this.root.parentNode;
        if (parent) {
          str = parent.innerHTML;
        } else {
          var temp = document.createElement("div");
          temp.appendChild(this.root);
          str = temp.innerHTML;
        }
        if (str) {
          // SVG format sanitize
          str = str.replace(/ href=/g, ' xlink:href=');
          // add SVG DTD
          str = S.SVG_DTD + str;
        }
      }
      return str;
    }
  };
  NS.SVGRenderer.prototype = $.extend(new NS.RendererBase(), NS.SVGRenderer.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @extends NS.RendererBase
   */
  NS.VMLRenderer = function() {
  };
  NS.VMLRenderer.prototype = {
    type : S.VML
  };
  NS.VMLRenderer.prototype = $.extend(new NS.RendererBase(), NS.VMLRenderer.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @extends NS.RendererBase
   */
  NS.CANVASRenderer = function() {
  };
  NS.CANVASRenderer.prototype = {
    type : S.CANVAS
  };
  NS.CANVASRenderer.prototype = $.extend(new NS.RendererBase(), NS.CANVASRenderer.prototype);
  //====================================================================================================
  /**
   * @constructor
   */
  NS.EventBase = function() {
  };
  NS.EventBase.prototype = {
    //event type
    events : E,
    //custom event dispather
    dispather : null,
    //event function
    bind : function() {
      var dispather = this.dispather || $(this);
      dispather.bind.apply(dispather, arguments);
      return this;
    },
    one : function() {
      var dispather = this.dispather || $(this);
      dispather.one.apply(dispather, arguments);
      return this;
    },
    unbind : function() {
      var dispather = this.dispather || $(this);
      dispather.unbind.apply(dispather, arguments);
      return this;
    },
    send : function(type, data) {
      var dispather = this.dispather || $(this);
      dispather.trigger(type, data);
      return this;
    }
  };
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.Collection}
   */
  NS.Collection = function() {
    this.dispather = $(this);
    this.events = E;
    this.init();
  };
  NS.Collection.prototype = {
    position : 0,
    list : [],
    init : function() {
      //must be init the list to []
      this.list = [];
      return this;
    },
    toggle : function(data) {
      return this.has(data) ? this.remove(data) : this.add(data);
    },
    has : function(data) {
      this.position = -1;
      for ( var i = 0, l = this.size(); i < l; i++) {
        var item = this.list[i];
        if (this.equal(item, data)) {
          this.position = i;
          return true;
        }
      }
      return false;
    },
    add : function(data, unshift) {
      if (unshift) {
        return this.prepend(data);
      }
      return this.append(data);
    },
    append : function(data) {
      this.list.push(data);
      this.position = this.size() - 1;
      this.send(E.CHANGE, this.get());
      return this;
    },
    prepend : function(data) {
      this.list.unshift(data);
      this.position = 0;
      this.send(E.CHANGE, this.get());
      return this;
    },
    addafter : function(data, target) {
      if (this.has(target)) {
        this.list.splice(this.position, 0, data);
        this.position += 1;
        this.send(E.CHANGE, this.get());
      } else {
        this.append(data);
      }
      return this;
    },
    swap : function(a, b) {
      var ha = this.has(a);
      var ia = this.position;
      var hb = this.has(b);
      var ib = this.position;
      if (ha && hb) {
        this.list.splice(ia, 1, b);
        this.list.splice(ib, 1, a);
        this.position = ib + 1;
        this.send(E.CHANGE, this.get());
      }
      return this;
    },
    remove : function(data) {
      for ( var i = 0, l = this.size(); i < l; i++) {
        var item = this.list[i];
        if (this.equal(item, data)) {
          this.list.splice(i, 1);
          this.position = i;
          break;
        }
      }
      this.send(E.CHANGE, this.get());
      return this;
    },
    set : function(list) {
      this.list = list || [];
      this.position = this.size() - 1;
      this.send(E.CHANGE, this.get());
      return this;
    },
    get : function() {
      return this.list;
    },
    empty : function() {
      return this.set([]);
    },
    each : function(callback) {
      if (typeof (callback) === S.FUNCTION) {
        for ( var i = 0, l = this.size(); i < l; i++) {
          var item = this.list[i];
          var tof = callback.call(this, i, item);
          if (tof === false) {
            break;
          }
        }
      }
      return this;
    },
    find : function(data) {
      if (this.has(data)) {
        return this.list[this.position];
      }
      return null;
    },
    //can NOT using length, caused event bind do NOT work
    size : function() {
      return this.list.length;
    },
    equal : function(a, b) {
      if (a == b) {
        return true;
      }
      if (typeof (a) === S.OBJECT && typeof (b) === S.OBJECT) {
        if ((a.id != undefined && b.id != undefined && a.id == b.id) || T.same(a, b)) {
          return true;
        }
      }
      return false;
    },
    toString : function() {
      return "[object Collection]";
    }
  };
  NS.Collection.prototype = $.extend(new NS.EventBase(), NS.Collection.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.ScrollPane}
   */
  NS.ScrollPane = function() {
    this.dispather = $(this);
    this.events = E;
    this.option = this.defaultOption();
    this.init();
    if (arguments.length) {
      this.draw(arguments[0]);
    }
  };
  NS.ScrollPane.prototype = {
    option : null,
    defaultOption : function() {
      return {
        className : "scrollpane",
        //scrollbar : "system",
        scrollbar : {},
        wheelSize : 60,
        outside : false,
        main : {
          style : {
            margin : 0,
            padding : 0,
            border : S.NONE,
            width : 240,
            height : S.AUTO,
            "max-height" : 260
          },
          //space between scrollbar
          space : 3
        }
      };
    },
    init : function() {
      var self = this;
      //container
      this.container = $(S.DIV).css({
        position : S.RELATIVE
      });
      //main=================================
      this.main = $(S.DIV).css({
        position : S.RELATIVE,
        overflow : S.HIDDEN
      }).appendTo(this.container);
      //pane
      this.pane = $(S.DIV).css({
        position : S.RELATIVE
      }).bind(E.RESIZE, function(e) {
        self.draw();
      }).appendTo(this.main);
      //scrollbar=============================
      this.sbar = $(S.DIV).css({
        position : S.ABSOLUTE,
        overflow : S.HIDDEN
      }).appendTo(this.container);
      this.scrollbar = new NS.ScrollBar(this.sbar);
      //events ====================
      this.main.bind(E.MOUSEWHEEL, function(e, d) {
        if (self.scrollbar.visible) {
          self.mousewheel(d);
          return false;
        }
      });
      this.scrollbar.bind(E.CHANGE, function(e, d) {
        self.setPosition(d);
      });
      return this;
    },
    draw : function() {
      if (arguments.length) {
        this.option = $.extend(true, this.defaultOption(), arguments[0]);
      }
      var op = this.option;
      var clsn = op.className;
      //set style
      this.container.removeClass().addClass(clsn);
      this.main.removeClass().addClass(clsn + "_main").css(op.main.style);
      this.pane.removeClass().addClass(clsn + "_pane");
      this.sbar.removeClass().addClass(clsn + "_sbar");
      //must be in document
      if (!$.contains(document.body, this.container.get(0))) {
        return this;
      }
      //always top left
      this.pane.css({
        left : 0,
        top : 0,
        width : S.AUTO,
        height : S.AUTO
      });
      //default scrollpane is H
      this.paneL = 0;
      this.paneT = 0;
      this.mainW = this.main.width();
      this.mainH = this.main.height();
      this.paneW = this.pane.width();
      this.paneH = this.pane.height();
      this.scrollbar.hide();
      //no scrollbar ===========================================
      if (this.paneH <= this.mainH) {
        return this;
      }
      //system scrollbar =======================================
      if (op.scrollbar === "system") {
        this.main.css({
          overflow : S.AUTO
        });
        return this;
      }
      //custom scrollbar =======================================
      this.main.css({
        overflow : S.HIDDEN
      });
      //
      var scrollBarOption = $.extend({}, op.scrollbar, {
        height : this.mainH
      });
      this.scrollbar.show(scrollBarOption);
      var sbarW = this.scrollbar.width();
      var paneW = this.mainW;
      //
      if (op.outside) {
        //outside bar
        this.sbar.css({
          left : this.mainW + op.main.space,
          right : null,
          top : 0
        });
      } else {
        //inside bar
        this.sbar.css({
          left : null,
          right : 0,
          top : 0
        });
        paneW = this.mainW - sbarW - op.main.space;
      }
      //
      this.pane.width(paneW);
      //
      this.paneW = this.pane.width();
      this.paneH = this.pane.height();
      this.setScrollBar();
      return this;
    },
    setPosition : function(pos) {
      pos = T.per(pos);
      this.paneT = (this.mainH - this.paneH) * pos;
      this.setTop();
      return this;
    },
    setTop : function() {
      this.paneT = T.clamp(this.paneT, (this.mainH - this.paneH), 0);
      this.pane.css({
        top : this.paneT
      });
      this.send(E.CHANGE, this);
      return this;
    },
    mousewheel : function(d) {
      d = T.tonum(d);
      var size = d * this.option.wheelSize;
      //position
      var position = this.pane.position();
      this.paneL = position.left;
      this.paneT = position.top;
      this.paneT += size;
      //
      this.setTop();
      //
      this.setScrollBar();
      return this;
    },
    setScrollBar : function() {
      var len = 0;
      var pos = 0;
      if (this.paneH) {
        len = this.mainH / this.paneH;
      }
      if (this.paneH > this.mainH) {
        pos = this.paneT / (this.mainH - this.paneH);
      }
      this.scrollbar.setData(len, pos);
      return this;
    },
    //api =========================================================================
    appendTo : function(selector) {
      this.container.appendTo(selector);
      return this;
    },
    append : function(selector) {
      //rest container size
      this.pane.css({
        width : S.AUTO,
        height : S.AUTO
      }).append(selector);
      //redraw
      this.draw();
      return this;
    },
    find : function(selector) {
      return this.pane.find(selector);
    },
    empty : function() {
      this.pane.unbind().empty();
      this.draw();
      return this;
    },
    toString : function() {
      return "[object ScrollPane]";
    }
  };
  NS.ScrollPane.prototype = $.extend(new NS.EventBase(), NS.ScrollPane.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @param container
   * @returns {NS.ScrollBar}
   */
  NS.ScrollBar = function(container) {
    this.dispather = $(this);
    this.events = E;
    this.option = this.defaultOption();
    this.container = $(container);
    if (!this.container.length) {
      throw new Error(this + " require a container");
    }
    this.init();
  };
  NS.ScrollBar.prototype = {
    visible : false,
    //scroll
    scrolling : false,
    scrollX : 0,
    scrollY : 0,
    timeout : null,
    animate : null,
    //drag
    dragging : false,
    dragStartPos : 0,
    dragStartX : 0,
    dragStartY : 0,
    dragNowX : 0,
    dragNowY : 0,
    //thumb len and pos
    //0-1
    len : 0,
    pos : 0,
    thumbLen : 0,
    thumbPos : 0,
    //
    option : null,
    defaultOption : function() {
      return {
        width : 6,
        height : 100,
        //
        minSize : 10,
        //
        scrollDelay : 300,
        scrollDuration : 200,
        scrollSize : 100,
        //v, h
        mode : S.H,
        //thumb button
        thumb : {
          background : "#cccccc",
          "border-radius" : "2px"
        },
        //track back
        track : {
          background : "#dddddd",
          opacity : 0.2
        }
      };
    },
    init : function() {
      this.main = $(S.DIV).css({
        position : S.RELATIVE,
        overflow : S.HIDDEN
      });
      this.track = $(S.DIV).css({
        overflow : S.HIDDEN
      }).appendTo(this.main);
      this.thumb = $(S.DIV).css({
        position : S.ABSOLUTE,
        overflow : S.HIDDEN,
        top : 0,
        left : 0
      }).appendTo(this.main);
      this.container.append(this.main);
      //events ====================
      var self = this;
      this.track.bind(E.MOUSEDOWN, function(e) {
        self.scrollStart(e);
        $(window).one(E.MOUSEUP, function(e) {
          if (self.scrolling) {
            self.scrollStop();
          } else {
            self.scrollComplete();
          }
        });
        return false;
      });
      this.thumb.bind(E.MOUSEDOWN, function(e) {
        self.dragStart(e);
        $(window).one(E.MOUSEUP, function(e) {
          $(window).unbind(E.MOUSEMOVE);
          self.dragComplete();
        });
        $(window).bind(E.MOUSEMOVE, function(e) {
          self.dragNow(e);
        });
        return false;
      });
      return this;
    },
    //drag =======================================================================
    dragStart : function(e) {
      this.dragging = true;
      this.dragStartPos = this.thumbPos;
      this.dragStartX = e.pageX;
      this.dragStartY = e.pageY;
    },
    dragNow : function(e) {
      if (!this.dragging) {
        return;
      }
      this.dragNowX = e.pageX;
      this.dragNowY = e.pageY;
      //
      var offsetX = this.dragNowX - this.dragStartX;
      var offsetY = this.dragNowY - this.dragStartY;
      var op = this.option;
      var offset = (op.mode !== S.H) ? offsetX : offsetY;
      var posnow = this.dragStartPos + offset;
      var size = (op.mode !== S.H) ? this.width() : this.height();
      var pos = posnow / (size - this.thumbLen);
      //(pos);
      this.scrollChange(pos);
    },
    dragComplete : function() {
      this.dragging = false;
    },
    //scroll =====================================================================
    scrollStart : function(e) {
      //end position
      var offset = this.track.offset();
      this.scrollX = e.pageX - offset.left;
      this.scrollY = e.pageY - offset.top;
      //
      this.scrollStop();
      var self = this;
      this.timeout = setTimeout(function() {
        self.scrollNow();
      }, this.option.scrollDelay);
    },
    scrollNow : function() {
      this.scrolling = true;
      var from = this.pos;
      var till = 0;
      if (this.option.mode !== S.H) {
        till = this.scrollX / this.width();
      } else {
        till = this.scrollY / this.height();
      }
      //(from + " to " + till);
      var self = this;
      this.animate = new NS.Animate({
        duration : this.option.scrollDuration,
        from : from,
        till : till,
        step : function(pos) {
          self.scrollChange(pos);
        }
      });
    },
    scrollComplete : function() {
      this.scrollStop();
      var op = this.option;
      var scrollSize = op.scrollSize;
      var pageSize = (op.mode !== S.H) ? this.width() : this.height();
      if (scrollSize > pageSize) {
        scrollSize = pageSize;
      }
      var targetSize = pageSize / this.len;
      var targetPos = this.pos * (pageSize - targetSize);
      //
      var from = this.pos;
      var till = 0;
      if (op.mode !== S.H) {
        till = this.scrollX / this.width();
      } else {
        till = this.scrollY / this.height();
      }
      //
      if (till > from) {
        targetPos -= scrollSize;
      } else if (till < from) {
        targetPos += scrollSize;
      }
      var pos = targetPos / (pageSize - targetSize);
      //
      this.scrollChange(pos);
    },
    scrollChange : function(pos) {
      this.setPos(pos);
      this.send(E.CHANGE, this.pos);
    },
    scrollStop : function() {
      this.scrolling = false;
      clearTimeout(this.timeout);
      if (this.animate) {
        this.animate.stop();
        this.animate = null;
      }
    },
    //position ===================================================================
    setData : function(len, pos) {
      this.setLen(len);
      this.setPos(pos);
      return this;
    },
    setLen : function(len) {
      len = T.per(len);
      if (len == this.len) {
        return this;
      }
      this.len = len;
      var op = this.option;
      var n = (op.mode !== S.H) ? S.WIDTH : S.HEIGHT;
      var v = op[n];
      var thumbData = {};
      this.thumbLen = T.clamp(len * v, op.minSize, v);
      thumbData[n] = this.thumbLen;
      this.thumb.css(thumbData);
      return this;
    },
    setPos : function(pos) {
      pos = T.per(pos);
      if (pos == this.pos) {
        return this;
      }
      this.pos = pos;
      var op = this.option;
      var n = (op.mode !== S.H) ? S.WIDTH : S.HEIGHT;
      var p = (op.mode !== S.H) ? S.LEFT : S.TOP;
      var v = op[n] - this.thumbLen;
      var thumbData = {};
      this.thumbPos = pos * v;
      this.thumbPos = T.clamp(this.thumbPos, 0, v);
      thumbData[p] = this.thumbPos;
      this.thumb.css(thumbData);
      return this;
    },
    //scrollbar ===================================================================
    show : function() {
      if (arguments.length) {
        this.option = $.extend(true, this.defaultOption(), arguments[0]);
      }
      var op = this.option;
      var mainData = {
        width : op.width,
        height : op.height
      };
      //track=====================
      var trackData = $.extend({}, op.track, mainData);
      this.track.css(trackData);
      //thumb=====================
      var thumbData = {
        width : op.minSize,
        height : op.minSize
      };
      if (op.mode !== S.H) {
        thumbData.height = op.height;
        if (this.thumbLen) {
          thumbData.width = this.thumbLen;
        }
      } else {
        thumbData.width = op.width;
        if (this.thumbLen) {
          thumbData.height = this.thumbLen;
        }
      }
      //(thumbData);
      thumbData = $.extend({}, op.thumb, thumbData);
      this.thumb.css(thumbData);
      //
      this.main.css(mainData).show();
      //
      this.visible = true;
      return this;
    },
    hide : function() {
      this.visible = false;
      this.main.hide();
      return this;
    },
    remove : function() {
      this.hide();
      this.unbind();
      this.thumb.unbind();
      this.track.unbind();
      this.main.unbind().empty().remove();
    },
    //api ========================================================================
    width : function() {
      return this.option.width || this.main.width();
    },
    height : function() {
      return this.option.height || this.main.height();
    },
    toString : function() {
      return "[object ScrollBar]";
    }
  };
  NS.ScrollBar.prototype = $.extend(new NS.EventBase(), NS.ScrollBar.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @param option
   * @returns {NS.Icon}
   */
  NS.Icon = function() {
    this.dispather = $(this);
    this.events = E;
    this.option = this.defaultOption();
    this.width = this.option.width;
    this.height = this.option.height;
    this.renderer = new NS.Renderer(S.SVG);
    this.svg_root = this.renderer.init(this.width, this.height);
    //save name
    this.graph = this.svg_root;
    //add Default Events
    var self = this;
    this.bind(E.MOUSEOVER, function(e, d) {
      self.setStyle(self.option.hover);
    }).bind(E.MOUSEOUT, function(e, d) {
      self.setStyle(self.option.style);
    });
    //draw
    if (arguments[0]) {
      this.draw(arguments[0]);
    }
  };
  NS.Icon.prototype = {
    //default icons
    icons : {
      sendout : {
        width : 160,
        height : 160,
        data : "M0,160 C0,100, 30,40 90,40 L90,0 L160,70 L90,140 L90,100 C50,100 0,140 0,160 z"
      },
      arrowtop : {
        width : 160,
        height : 160,
        data : "M80,30 L150,120 L10,120 L80,30"
      },
      arrowright : {
        width : 160,
        height : 160,
        data : "M120,80 L30,150 L30,10 L120,80"
      },
      arrowbottom : {
        width : 160,
        height : 160,
        data : "M80,120 L150,30 L10,30 L80,120"
      },
      arrowleft : {
        width : 160,
        height : 160,
        data : "M30,80 L120,150 L120,10 L30,80"
      },
      zoomin : {
        width : 160,
        height : 160,
        data : "{zoom}M97,100H83V77h-23v-14h23V40h14v23h23v14H97V100z"
      },
      zoomout : {
        width : 160,
        height : 160,
        data : "{zoom}M60,77v-14h60v14H60z"
      },
      zoomreset : {
        width : 160,
        height : 160,
        data : "M0,60c0,0,20,0,21,0C26,26,55,0,90,0c39,0,70,31,70,70s-31,70,-70,70c-17,0,-33,-6,-45,-17c7,-9,9,-12,15,-20c8,7,19,12,30,12c25,0,45,-20,45,-45c0,-25,-20,-45,-45,-45c-21,0,-39,15,-44,35C50,60,65,60,65,60l-32,50L0,60zM83,74V40h14v28l17,17l-10,10L83,74z"
      },
      search : {
        width : 160,
        height : 160,
        data : "M100,121 L140,160 C150,160 160,150 160,140 L121,100" + NS.SVG.getArcPath(70, 70, 70, 70) + NS.SVG.getArcPath(70, 70, 45, 45, 0, true)
      },
      indicator : {
        width : 160,
        height : 160,
        data : NS.SVG.getArcPath(80, 80, 80, 80) + NS.SVG.getArcPath(80, 80, 62, 62, 0, true) + NS.SVG.getEllipsePath(80, 80, 25, 25) + "M61,91 L69,99 L107,56 L105,54M48,118A50,50 0,1,1 112,118L106,111A40,40 0,1,0 54,111M112,118L118,112L122,115L115,122M130,84L130,76L135,75L135,85M118,48L112,42L115,38L122,45M84,30L76,30L75,25L85,25M48,42L42,48L38,45L45,38M30,76L30,84L25,85L25,75M42,112L48,118L45,122L38,115"
      }
    },
    common : {
      zoom : "M90,140c-14,0,-27,-4,-39,-12C50,130,20,160,20,160l-15,-5l-5,-15c0,0,30,-30,32,-32C24,97,20,84,20,70C20,31,51,0,90,0c39,0,70,31,70,70S129,140,90,140zM90,25c-25,0,-45,20,-45,45c0,25,20,45,45,45c25,0,45,-20,45,-45C135,45,115,25,90,25z"
    },
    option : null,
    style : null,
    listData : null,
    listItem : null,
    defaultOption : function() {
      return {
        container : null,
        //icon data or name
        //support miltipe layer
        data : null,
        //
        delay : 0,
        //default size
        width : 16,
        height : 16,
        //default scalemode
        scalemode : 1,
        style : {
          icon : {
            fill : "#666666",
            opacity : 0.8
          },
          back : {
            opacity : 0
          }
        },
        hover : {
          icon : {
            opacity : 1
          },
          back : {
            opacity : 0
          }
        }
      };
    },
    draw : function(option) {
      //option
      this.option = $.extend(true, this.defaultOption(), option);
      //
      var op = this.option;
      this.width = T.tonum(op.width);
      this.height = T.tonum(op.height);
      if (this.width <= 0 || this.height <= 0) {
        return this;
      }
      //data =============================================
      var data = op.data;
      //get data from name
      if (typeof (data) === S.STRING) {
        data = this.icons[data];
        if (data) {
          for ( var k in this.common) {
            data.data = data.data.replace("{" + k + "}", this.common[k]);
          }
        }
      }
      if (!data) {
        return this;
      }
      //(data);
      //draw ==============================================
      this.renderer.setSize(this.width, this.height);
      if (this.svg_main) {
        this.svg_main.empty();
      } else {
        this.svg_main = $(this.renderer.drawGroup({}, this.svg_root));
      }
      //back==========================
      this.svg_back = this.renderer.drawRect({
        width : this.width,
        height : this.height
      }, this.svg_main);
      //icon==========================
      this.svg_list = $(this.renderer.drawGroup({}, this.svg_main));
      //parse data to a list
      this.listData = T.array(data.data);
      this.listItem = [];
      //style
      this.setStyle(op.style);
      //size==========================
      var ow = T.tonum(data.width);
      var oh = T.tonum(data.height);
      //scalemode ====================
      if (op.scalemode) {
        var fit = T.fit(this.width, this.height, ow, oh, op.scalemode);
        //(fit);
        var translate = NS.SVG.translate(fit.x, fit.y);
        var scale = NS.SVG.scale(fit.sx, fit.sy);
        NS.SVG.attr(this.svg_list, {
          transform : translate + S.SPACE + scale
        });
      }
      //append graph
      if (op.container) {
        $(op.container).append(this.svg_root);
      }
      //events ============================================
      var self = this;
      this.svg_main.unbind().bind([E.MOUSEOVER, E.MOUSEOUT, E.CLICK, E.DBLCLICK, E.MOUSEDOWN, E.MOUSEUP].join(S.SPACE), function(e) {
        self.send(e.type, e);
      });
      return this;
    },
    setStyle : function(style) {
      this.style = style;
      //
      var backStyle = NS.SVG.getElementData(this.style.back);
      NS.SVG.attr(this.svg_back, backStyle);
      //
      this.drawList();
    },
    drawList : function() {
      for ( var i = 0, l = this.listData.length; i < l; i++) {
        var data = this.listData[i];
        var item = this.listItem[i];
        //
        var pathData = NS.SVG.getElementData(this.style.icon);
        if (!pathData.d) {
          if (typeof (data) === S.STRING) {
            pathData.d = data;
          } else {
            $.extend(true, pathData, data);
          }
        }
        //
        if (item) {
          NS.SVG.attr(item, pathData);
        } else {
          this.listItem[i] = this.renderer.drawPath(pathData, this.svg_list);
        }
      }
    },
    remove : function() {
      this.svg_main.unbind();
      this.unbind();
      $(this.svg_root).remove();
    },
    toString : function() {
      return "[object Icon]";
    }
  };
  NS.Icon.prototype = $.extend(new NS.EventBase(), NS.Icon.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @param coordinate
   * @param option
   * @returns {NS.Axis}
   */
  NS.Axis = function(coordinate, option) {
    this.coordinate = coordinate;
    this.renderer = coordinate.renderer;
    this.node = $(this.renderer.drawGroup({}, coordinate.node));
    this.option = this.defaultOption();
    this.setOption(option);
  };
  NS.Axis.prototype = {
    coordinate : null,
    renderer : null,
    node : null,
    team : null,
    axis : null,
    option : null,
    mapping : null,
    range : null,
    direction : S.Y,
    num : 3,
    scale : 1,
    offset : 0,
    //grid Data Fix when drag out of area
    gridOffset1 : 0,
    gridOffset2 : 0,
    //
    cache_index_section : null,
    hovring_cell : null,
    defaultOption : function() {
      return {
        id : null,
        //axis start from where
        start : 0,
        //axis total width
        width : 50,
        //every item min space
        space : 50,
        // TOP, BOTTOM, LEFT, RIGHT
        type : S.LEFT,
        // 0 Linear, 1 Logarithm
        mode : 0,
        //for label hide
        autohidemode : 1,
        //title 
        title : {
          value : "",
          style : {
            display : false,
            x : 5,
            y : 18,
            color : "#cccccc",
            "text-anchor" : "start",
            "font-weight" : "bold",
            "font-family" : "Verdana",
            "font-size" : 12
          }
        },
        // axis line
        line : {
          // TOP, BOTTOM, LEFT, RIGHT, false
          extend : false,
          // true, false
          onTop : true,
          // line drawing from where
          start : 0,
          //
          lineWidth : 1,
          lineColor : "#333333"
        },
        // item and items
        item : {
          value : 0,
          label : "",
          style : {
            //"display" : "block",
            //start | middle | end 
            "text-anchor" : "middle",
            //http://www.w3.org/TR/css3-linebox/#FontBaseline
            // some browser do NOT support like IE9
            //"dominant-baseline" : "middle",
            //auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical 
            //"alignment-baseline" : "middle",
            //baseline | sub | super 
            //"baseline-shift" : "baseline",
            "pointer-events" : S.NONE,
            "font-size" : 12,
            "font-family" : "Verdana",
            //normal | italic | oblique 
            //"font-style" : "normal",
            //normal | small-caps 
            //"font-variant" : "normal",
            //normal | bold | bolder | lighter | <number>
            //"font-weight" : "normal",
            //normal | wider | narrower | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded 
            //"font-stretch" : "normal",
            //stroke : "#000000",
            fill : "#000000"
          },
          mark : {
            width : 5,
            lineWidth : 1,
            lineColor : "#333333"
          },
          grid : {
            lineType : "solid",
            lineWidth : 1,
            lineColor : "#cccccc"
          },
          cell : {
            // false: without drawing
            // none: drawing but without showing
            // null: default drawing and showing
            display : false,
            "pointer-events" : S.NONE,
            "fill-opacity" : 0,
            fill : "#ffffff"
          },
          back : {
            display : false,
            cursor : "pointer",
            "fill-opacity" : 0,
            fill : "#ffffff"
          },
          hover : {
            fill : S.NONE,
            "pointer-events" : S.NONE
          }
        },
        first : {
          style : {}
        },
        last : {
          style : {}
        },
        data : []
      };
    },
    setOption : function() {
      if (arguments.length && arguments[0]) {
        var new_option = arguments[0];
        var old_option = this.defaultOption();
        //append the option to current option
        if (arguments[1]) {
          old_option = this.option;
        }
        this.option = $.extend(true, old_option, new_option);
      }
      var op = this.option;
      if (op.type == S.TOP || op.type == S.BOTTOM) {
        this.direction = S.X;
      } else {
        this.direction = S.Y;
      }
      //default id
      op.id = op.id || "axis" + this.direction;
      return this;
    },
    zooming : function(keepdata) {
      var chart = this.coordinate.owner;
      var scale = chart.scale;
      var offset = (this.direction === S.Y) ? chart.zoomY : chart.zoomX;
      //update grid offset
      this.gridOffset1 = 0;
      this.gridOffset2 = 0;
      var rect = this.coordinate.rect;
      var size = (this.direction === S.Y) ? rect.width : rect.height;
      var minPos = -(size * this.scale - size);
      if (this.direction == S.Y) {
        if (chart.zoomX > 0) {
          this.gridOffset1 = chart.zoomX;
        } else if (chart.zoomX < minPos) {
          this.gridOffset2 = chart.zoomX - minPos;
        }
      } else {
        if (chart.zoomY > 0) {
          this.gridOffset1 = chart.zoomY;
        } else if (chart.zoomY < minPos) {
          this.gridOffset2 = chart.zoomY - minPos;
        }
      }
      //redraw axis
      if (this.scale != scale || this.offset != offset || this.gridOffset1 != 0 || this.gridOffset2 != 0) {
        this.scale = scale;
        this.offset = offset;
        if (!keepdata) {
          this.option.data = null;
        }
        this.draw();
      }
    },
    draw : function() {
      var op = this.option;
      this.range = this.getRange();
      //(this.range);
      // mapping =================================================
      this.mapping = new NS.Mapping(op.mode);
      // coord ===================================================
      this.minCoord = 0;
      this.maxCoord = 0;
      if (this.direction === S.X) {
        this.minCoord = this.range.x1;
        this.maxCoord = this.range.x2;
      } else {
        this.minCoord = this.range.y2;
        this.maxCoord = this.range.y1;
      }
      //zooming fix ============================================
      //(this.scale, this.offset);
      if (this.direction === S.X) {
        this.maxCoord = this.minCoord + (this.maxCoord - this.minCoord) * this.scale;
      } else {
        this.minCoord = this.maxCoord + (this.minCoord - this.maxCoord) * this.scale;
      }
      this.minCoord += this.offset;
      this.maxCoord += this.offset;
      //
      // value =================================================
      this.minValue = Number.MAX_VALUE;
      this.maxValue = -Number.MAX_VALUE;
      // data list 
      var data = op.data;
      if (!$.isArray(data) || !data.length) {
        var dataRange = this.coordinate.dataRange;
        var dlen = dataRange.length;
        if (dlen) {
          for ( var i = 0; i < dlen; i++) {
            var dr = dataRange[i];
            if (!dr) {
              continue;
            }
            var mm = dr[op.id];
            if (mm) {
              if (mm.min < this.minValue) {
                this.minValue = mm.min;
              }
              if (mm.max > this.maxValue) {
                this.maxValue = mm.max;
              }
            }
          }
        }
        //auto division =======================================
        var size = this.coordinate.rect.width;
        if (this.direction == S.Y) {
          size = this.coordinate.rect.height;
        }
        //auto add the size
        size = size * this.scale;
        if (op.space) {
          this.num = Math.floor(size / op.space);
        }
        //(this.minValue, this.maxValue);
        data = op.data = this.coordinate.divisionHandler(this, this.minValue, this.maxValue, this.num);
        //(data);
      }
      //==========================================================
      // format data list
      var len = data.length;
      if (len) {
        for ( var i = 0; i < len; i++) {
          // to object
          if (typeof (data[i]) !== S.OBJECT || data[i].value === undefined) {
            var tempData = {};
            if (data[i] instanceof Array && data[i].length > 1) {
              tempData.value = data[i][0];
              tempData.label = data[i][1] + "";
            } else {
              tempData.value = data[i];
              tempData.label = data[i] + "";
            }
            data[i] = tempData;
          }
          //
          var dataItem = $.extend(true, {}, op.item);
          if (i == 0 && op.first) {
            dataItem = $.extend(true, dataItem, op.first);
          } else if (i == len - 1 && op.last) {
            dataItem = $.extend(true, dataItem, op.last);
          }
          data[i] = $.extend(true, dataItem, data[i]);
        }
        this.minValue = data[0].value;
        //this.maxValue != this.minValue
        if (len > 1) {
          this.maxValue = data[len - 1].value;
        }
      }
      // coord and value mapping =================================
      //(this.minCoord, this.maxCoord, this.minValue, this.maxValue);
      // set mapping 
      this.mapping.setRange(this.minCoord, this.maxCoord, this.minValue, this.maxValue);
      // draw start ==============================================
      var type = op.type;
      var rect = this.coordinate.rect;
      var range = this.range;
      this.node.empty().attr({
        id : op.id,
        "class" : op.id,
        display : S.NONE
      });
      // draw all group ==========================================
      var list;
      this.team = {};
      list = ["back", "cell", "line", "mark", "grid", "label", "title", "hover"];
      for ( var i = 0, l = list.length; i < l; i++) {
        var s = list[i];
        this.team[s] = $(this.renderer.drawGroup({
          "class" : op.id + S._ + s
        }, this.node));
      }
      // draw line ==============================================
      var lineData = NS.SVG.getElementData(op.line, {
        extend : null,
        onTop : null,
        start : null
      });
      var lineStart = op.line.start;
      var lineWidth = lineData["stroke-width"];
      var lineFixed = lineStart + lineWidth * 0.5;
      if (type == S.TOP) {
        lineData.x1 = range.x1;
        lineData.x2 = range.x2;
        lineData.y1 = lineData.y2 = range.y1 - lineFixed;
      } else if (type == S.RIGHT) {
        lineData.x1 = lineData.x2 = range.x1 + lineFixed;
        lineData.y1 = range.y1;
        lineData.y2 = range.y2;
      } else if (type == S.BOTTOM) {
        lineData.x1 = range.x1;
        lineData.x2 = range.x2;
        lineData.y1 = lineData.y2 = range.y1 + lineFixed;
      } else {
        lineData.x1 = lineData.x2 = range.x1 - lineFixed;
        lineData.y1 = range.y1;
        lineData.y2 = range.y2;
      }
      // extend fix
      var extend = op.line.extend;
      if (typeof (extend) === S.NUMBER) {
        if (type == S.LEFT || type == S.RIGHT) {
          lineData.y1 -= extend;
          lineData.y2 += extend;
        } else if (type == S.TOP || type == S.BOTTOM) {
          lineData.x1 -= extend;
          lineData.x2 += extend;
        }
      } else if (extend) {
        extend = String(extend).toLowerCase();
        if (extend == S.TOP && (type == S.LEFT || type == S.RIGHT)) {
          lineData.y1 = 0;
        } else if (extend == S.RIGHT && (type == S.TOP || type == S.BOTTOM)) {
          lineData.x2 = rect.outerWidth;
        } else if (extend == S.BOTTOM && (type == S.LEFT || type == S.RIGHT)) {
          lineData.y2 = rect.outerHeight;
        } else if (extend == S.LEFT && (type == S.TOP || type == S.BOTTOM)) {
          lineData.x1 = 0;
        } else if (extend != S.FALSE) {
          if (type == S.TOP || type == S.BOTTOM) {
            lineData.x1 = 0;
            lineData.x2 = rect.outerWidth;
          } else {
            lineData.y1 = 0;
            lineData.y2 = rect.outerHeight;
          }
        }
      }
      //required
      if (lineData.display !== false) {
        this.axis = this.renderer.drawLine(lineData, this.team.line);
      }
      // draw item =======================================
      for ( var i = 0; i < len; i++) {
        this.drawItem(i, data[i], lineStart, lineWidth);
      }
      //move to top
      if (op.line.onTop) {
        this.node.append(this.team.line);
      }
      //draw back and cell ===============================
      //save the index cache for section click
      this.cache_index_section = [];
      if (len > 1) {
        for ( var i = 0; i < len - 1; i++) {
          this.drawBackCell(i, data[i], data[i + 1]);
        }
      }
      // (this.cache_index_section);
      // draw title =====================================
      var titleData = NS.SVG.getElementData(op.title.style);
      if (titleData.display !== false && op.title.value) {
        this.renderer.drawText(titleData, this.team.title, op.title.value);
      }
      //events ==================================================
      var self = this;
      var type = E.MOUSEOVER + S.SPACE + E.MOUSEOUT + S.SPACE + E.CLICK;
      this.node.unbind().bind(type, function(e) {
        var $dom = $(e.target);
        var index = $dom.attr("index");
        e.index = index;
        var pcls = $dom.parent().attr(S.CLASS);
        var isBack = pcls == op.id + "_back";
        var data = self.cache_index_section[index];
        if (!data || !data.from || !data.till) {
          return false;
        }
        e.data = data;
        if (e.type === E.MOUSEOVER) {
          if (isBack) {
            self.send(E.ITEM_OVER, e);
          }
        } else if (e.type === E.MOUSEOUT) {
          if (isBack) {
            self.send(E.ITEM_OUT, e);
          }
        } else if (e.type === E.CLICK) {
          if (isBack) {
            self.send(E.ITEM_CLICK, e);
          }
        }
      });
      // show now ===============================================
      this.node.attr({
        display : null
      });
      // autohide ===============================================
      this.autohideLabel();
      //=========================================================
      return this;
    },
    //auto hide lable for x-axis
    autohideLabel : function() {
      if (!this.option.autohidemode || this.direction === S.Y || this.option.width <= 5) {
        return this;
      }
      var data = this.option.data;
      var len = data.length;
      //get rect to list
      var list = [];
      for ( var i = 0; i < len; i++) {
        var item = data[i];
        if (!item.elements.text) {
          continue;
        }
        var rect = NS.SVG.getRect(item.elements.text);
        if (!rect || !rect.width) {
          continue;
        }
        list.push({
          item : item.elements.text,
          rect : rect
        });
      }
      len = list.length;
      if (len < 3) {
        return this;
      }
      //range
      //from mid
      var mid = Math.round(len * 0.5);
      var midRect = list[mid].rect;
      var min = midRect.left;
      var max = midRect.left + midRect.width;
      //padding fixing for text left and right
      var padding = 2;
      // ->
      for ( var i = mid + 1; i < len; i++) {
        var item = list[i];
        if (item.rect.left < max - padding) {
          NS.SVG.attr(item.item, {
            display : S.NONE
          });
        } else {
          max = item.rect.left + item.rect.width;
        }
      }
      // <-
      for ( var i = mid - 1; i >= 0; i--) {
        var item = list[i];
        if (item.rect.left + item.rect.width > min + padding) {
          NS.SVG.attr(item.item, {
            display : S.NONE
          });
        } else {
          min = item.rect.left;
        }
      }
      return this;
    },
    drawItem : function(index, item, lineStart, lineWidth) {
      //(item);
      var op = this.option;
      var type = op.type;
      var rect = this.coordinate.rect;
      // position ===============================================
      var pos = Math.round(this.mapping.getCoordByValue(item.value));
      if (!T.isnum(pos)) {
        return this;
      }
      //(pos);
      var px = py = pos;
      //outside fix ==============================================
      var outside = false;
      var lastone = false;
      if (this.direction === S.Y) {
        if (pos < rect.top || pos > rect.top + rect.height) {
          outside = true;
        } else if (pos == rect.top + rect.height) {
          lastone = true;
        }
        px = this.range.x1;
      } else {
        if (pos < rect.left || pos > rect.left + rect.width) {
          outside = true;
        } else if (pos == rect.left + rect.width) {
          lastone = true;
        }
        py = this.range.y1;
      }
      //(op.id, position);
      // ========================================================
      //mark
      var markData = NS.SVG.getElementData(item.mark, {
        index : index,
        width : null
      });
      var markLineWidth = markData["stroke-width"];
      var markWidth = item.mark.width;
      var markPixelFix = markLineWidth * 0.5;
      //grid
      var gridData = NS.SVG.getElementData(item.grid, {
        index : index,
        lineType : null
      });
      var gridLineWidth = item.grid.lineWidth;
      var gridPixelFix = gridLineWidth * 0.5;
      //label
      // dx dy fix, firefox do NOT support dx/dy when text-anchor is end
      var textX = px + (parseInt(item.style.dx) || 0);
      var textY = py + (parseInt(item.style.dy) || 0);
      // ========================================================
      //save all position
      var position = {};
      if (type == S.TOP) {
        textY -= lineStart + lineWidth;
        position = {
          mark : {
            x1 : px + markPixelFix,
            y1 : py - lineStart - markWidth,
            x2 : px + markPixelFix,
            y2 : py - lineStart
          },
          grid : {
            x1 : px + gridPixelFix,
            y1 : rect.top,
            x2 : px + gridPixelFix,
            y2 : rect.top + rect.height
          },
          back : {
            x1 : px,
            y1 : py - op.width,
            x2 : px,
            y2 : py
          },
          cell : {
            x1 : px,
            y1 : rect.top,
            x2 : px,
            y2 : rect.top + rect.height
          }
        };
      } else if (type == S.RIGHT) {
        textX += lineStart + lineWidth;
        position = {
          mark : {
            x1 : px + lineStart,
            y1 : py + markPixelFix,
            x2 : px + lineStart + markWidth,
            y2 : py + markPixelFix
          },
          grid : {
            x1 : rect.left,
            y1 : py + gridPixelFix,
            x2 : rect.left + rect.width,
            y2 : py + gridPixelFix
          },
          back : {
            x1 : px,
            y1 : py,
            x2 : px + op.width,
            y2 : py
          },
          cell : {
            x1 : rect.left,
            y1 : py,
            x2 : rect.left + rect.width,
            y2 : py
          }
        };
      } else if (type == S.BOTTOM) {
        textY += lineStart + lineWidth;
        position = {
          mark : {
            x1 : px + markPixelFix,
            y1 : py + lineStart,
            x2 : px + markPixelFix,
            y2 : py + lineStart + markWidth
          },
          grid : {
            x1 : px + gridPixelFix,
            y1 : rect.top,
            x2 : px + gridPixelFix,
            y2 : rect.top + rect.height
          },
          back : {
            x1 : px,
            y1 : py,
            x2 : px,
            y2 : py + op.width
          },
          cell : {
            x1 : px,
            y1 : rect.top,
            x2 : px,
            y2 : rect.top + rect.height
          }
        };
      } else {
        textX -= lineStart + lineWidth;
        position = {
          mark : {
            x1 : px - lineStart - markWidth,
            y1 : py + markPixelFix,
            x2 : px - lineStart,
            y2 : py + markPixelFix
          },
          grid : {
            x1 : rect.left,
            y1 : py + gridPixelFix,
            x2 : rect.left + rect.width,
            y2 : py + gridPixelFix
          },
          back : {
            x1 : px - op.width,
            y1 : py,
            x2 : px,
            y2 : py
          },
          cell : {
            x1 : rect.left,
            y1 : py,
            x2 : rect.left + rect.width,
            y2 : py
          }
        };
      }
      //save text position
      position.text = {
        x : textX,
        y : textY
      };
      //lastone fix =============================================
      if (lastone) {
        for ( var k in position) {
          var lw = gridLineWidth;
          if (k == "mark" || k == "back") {
            lw = markLineWidth;
          }
          if (this.direction == S.Y) {
            position[k].y1 -= lw;
            position[k].y2 -= lw;
          } else {
            position[k].x1 -= lw;
            position[k].x2 -= lw;
          }
        }
      }
      // ========================================================
      var textData = NS.SVG.getElementData(item.style, {
        index : index,
        x : textX,
        y : textY,
        dx : null,
        dy : null
      });
      //cache position info
      item.position = position;
      //cache all elements for dom
      item.elements = {};
      //(item);
      //out of range
      if (outside) {
        return this;
      }
      if (markData.display !== false) {
        markData = NS.SVG.getElementData(markData, position.mark);
        item.elements.mark = this.renderer.drawLine(markData, this.team.mark);
      }
      if (gridData.display !== false) {
        gridData = NS.SVG.getElementData(gridData, position.grid);
        if (this.direction == S.Y) {
          gridData.x1 += this.gridOffset1;
          gridData.x2 += this.gridOffset2;
        } else {
          gridData.y1 += this.gridOffset1;
          gridData.y2 += this.gridOffset2;
        }
        item.elements.grid = this.renderer.drawLine(gridData, this.team.grid);
      }
      if (textData.display !== false && item.label) {
        item.elements.text = this.renderer.drawText(textData, this.team.label, item.label);
      }
      //draw cell and back
      return this;
    },
    drawBackCell : function(index, _from, _till) {
      var list;
      var from = _from;
      var till = _till;
      //y-axis should reverse
      if (this.direction === S.Y) {
        from = _till;
        till = _from;
      }
      this.cache_index_section[index] = {
        from : from,
        till : till
      };
      var fromPos = from.position;
      var tillPos = till.position;
      //(fromPos, tillPos);
      if (!fromPos || !tillPos) {
        return this;
      }
      var rect = this.coordinate.rect;
      list = ["back", "cell"];
      for ( var i = 0; i < list.length; i++) {
        var s = list[i];
        var data = NS.SVG.getElementData(from[s], {
          index : index,
          x : fromPos[s].x1,
          y : fromPos[s].y1,
          width : T.clamp(tillPos[s].x2 - fromPos[s].x1, 0, rect.width),
          height : T.clamp(tillPos[s].y2 - fromPos[s].y1, 0, rect.height)
        });
        //range fix, do NOT out of main area
        if (this.direction === S.Y) {
          if (data.y > rect.top + rect.height || data.y + data.height < rect.top) {
            data.display = false;
          } else {
            if (data.y < rect.top) {
              data.height = data.y + data.height - rect.top;
              data.y = rect.top;
            }
            if (data.y + data.height > rect.top + rect.height) {
              data.height = rect.top + rect.height - data.y;
            }
          }
        } else {
          if (data.x > rect.left + rect.width || data.x + data.width < rect.left) {
            data.display = false;
          } else {
            if (data.x < rect.left) {
              data.width = data.x + data.width - rect.left;
              data.x = rect.left;
            }
            if (data.x + data.width > rect.left + rect.width) {
              data.width = rect.left + rect.width - data.x;
            }
          }
        }
        //draw rect elem
        if (data.display !== false) {
          var id = ["gradient", this.coordinate.owner.token, this.option.id, s].join(S._);
          NS.SVG.addGradientFill(this.renderer, data, id);
          this.renderer.drawRect(data, this.team[s]);
        }
      }
      return this;
    },
    showCell : function(value, type) {
      var index = NaN;
      if (type == "value") {
        //get index from value
        var l = this.cache_index_section.length;
        if (l > 0 && value) {
          for ( var i = 0; i < l; i++) {
            var sect = this.cache_index_section[i];
            if (value >= sect.from.value && value <= sect.till.value) {
              index = i;
              break;
            }
          }
        }
      } else {
        index = value;
      }
      //cache
      if (index == this.indexSection) {
        return this;
      }
      this.indexSection = index;
      //
      if (this.hovring_cell) {
        this.hovring_cell.attr({
          display : S.NONE
        });
        this.hovring_cell = null;
      }
      if (!T.isnum(index)) {
        return this;
      }
      //(index);
      this.hovring_cell = this.node.find(S.DOT + this.option.id + "_cell").children("[index=" + index + "]");
      this.hovring_cell.attr({
        display : null
      });
      return this;
    },
    getCoord : function(value) {
      var coord = this.mapping.getCoordByValue(value);
      var rect = this.coordinate.rect;
      if (this.direction == S.Y) {
        return coord - rect.top;
      } else {
        return coord - rect.left;
      }
    },
    getValue : function(coord) {
      var rect = this.coordinate.rect;
      if (this.direction == S.Y) {
        coord += rect.top;
      } else {
        coord += rect.left;
      }
      return this.mapping.getValueByCoord(coord);
    },
    getRange : function() {
      var op = this.option;
      var type = op.type;
      var rect = this.coordinate.rect;
      var range = {};
      if (type == S.TOP) {
        range.x1 = rect.left;
        range.x2 = rect.left + rect.width;
        range.y1 = range.y2 = op.start + op.width;
      } else if (type == S.RIGHT) {
        range.x1 = range.x2 = rect.outerWidth - op.start - op.width;
        range.y1 = rect.top;
        range.y2 = rect.top + rect.height;
      } else if (type == S.BOTTOM) {
        range.x1 = rect.left;
        range.x2 = rect.left + rect.width;
        range.y1 = range.y2 = rect.outerHeight - op.start - op.width;
      } else {
        range.x1 = range.x2 = op.start + op.width;
        range.y1 = rect.top;
        range.y2 = rect.top + rect.height;
      }
      return range;
    },
    toString : function() {
      return "[object Axis]";
    }
  };
  NS.Axis.prototype = $.extend(new NS.EventBase(), NS.Axis.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @param owner
   * @returns {NS.Coordinate}
   */
  NS.Coordinate = function(owner) {
    this.owner = owner;
    this.renderer = owner.renderer;
  };
  NS.Coordinate.prototype = {
    owner : null,
    renderer : null,
    node : null,
    option : null,
    rect : null,
    dataRange : null,
    dataLength : 0,
    //save all as Array
    list : null,
    //save all as Object
    axis : null,
    draw : function(node) {
      this.node = $(node);
      this.node.empty();
      var option = this.owner.option.coordinate;
      if (!option) {
        return this;
      }
      //filter custom array prototype parameters, keep option is object
      if ($.isArray(option)) {
        var object = {};
        for ( var i = 0, l = option.length; i < l; i++) {
          object[i] = option[i];
        }
        option = object;
      }
      this.option = option;
      // init axis range ==========================================
      this.rect = {
        top : 0,
        right : 0,
        bottom : 0,
        left : 0,
        width : 0,
        height : 0,
        outerWidth : this.renderer.width,
        outerHeight : this.renderer.height
      };
      for ( var id in option) {
        var op = option[id];
        if (typeof (op) !== S.OBJECT) {
          continue;
        }
        op.id = op.id || id;
        op.width = T.tonum(op.width, true);
        if (!op.type || $.inArray(op.type, [S.TOP, S.RIGHT, S.BOTTOM, S.LEFT]) == -1) {
          op.type = S.LEFT;
        }
        op.start = this.rect[op.type];
        this.rect[op.type] += op.width;
      }
      this.rect.width = Math.max(0, this.rect.outerWidth - this.rect.left - this.rect.right);
      this.rect.height = Math.max(0, this.rect.outerHeight - this.rect.top - this.rect.bottom);
      // create axis ===========================================
      this.list = [];
      this.axis = {
        first_x : null,
        first_y : null
      };
      //if need auto get the axis data list
      var autoRange = false;
      for ( var id in option) {
        var data = option[id];
        if (!data) {
          continue;
        }
        if (!$.isArray(data.data) || !data.data.length) {
          autoRange = true;
        }
        var axis = new NS.Axis(this, data);
        //save all
        if (axis.direction == S.X && !this.axis.first_x) {
          this.axis.first_x = axis;
        } else if (axis.direction == S.Y && !this.axis.first_y) {
          this.axis.first_y = axis;
        }
        this.axis[id] = axis;
        if (data.id) {
          this.axis[data.id] = axis;
        }
        this.list.push(axis);
      }
      // data range ============================================
      if (autoRange) {
        this.getAllDataRange(this.axis.first_x.option.id, this.axis.first_y.option.id);
      }
      // draw axis =============================================
      for ( var i = 0, l = this.list.length; i < l; i++) {
        var axis = this.list[i];
        if (axis instanceof NS.Axis) {
          axis.draw.apply(axis, arguments);
        }
      }
      return this;
    },
    zooming : function() {
      for ( var i = 0, l = this.list.length; i < l; i++) {
        var axis = this.list[i];
        if (axis instanceof NS.Axis) {
          axis.zooming.apply(axis, arguments);
        }
      }
      return this;
    },
    getAxisById : function(id, direction) {
      var axis = this.axis[id];
      if (!axis) {
        if (direction === S.Y) {
          axis = this.axis.first_y;
        } else {
          axis = this.axis.first_x;
        }
      }
      return axis;
    },
    defaultDivisionHandler : function(axis, minValue, maxValue, num) {
      //default using nicenum
      return T.nicenum(minValue, maxValue, num);
    },
    // division api
    divisionHandler : function(axis, minValue, maxValue, num) {
      return this.defaultDivisionHandler(axis, minValue, maxValue, num);
    },
    defaultRangeHandler : function(dataList, dataFormat) {
      var range = {
        minX : Number.MAX_VALUE,
        maxX : -Number.MAX_VALUE,
        minY : Number.MAX_VALUE,
        maxY : -Number.MAX_VALUE
      };
      for ( var i = 0, len = dataList.length; i < len; i++) {
        var item = dataList[i];
        if (item) {
          //x
          var x = item[dataFormat.x];
          if (T.isnum(x)) {
            if (x < range.minX) {
              range.minX = x;
            }
            if (x > range.maxX) {
              range.maxX = x;
            }
          }
          //y
          var y = item[dataFormat.y];
          if (T.isnum(y)) {
            if (y < range.minY) {
              range.minY = y;
            }
            if (y > range.maxY) {
              range.maxY = y;
            }
          }
        }
      }
      // do NOT same when only 1 item
      if (range.minX == range.maxX) {
        range.maxX += 1;
      }
      if (range.minY == range.maxY) {
        range.maxY += 1;
      }
      //(range);
      return range;
    },
    // range api
    rangeHandler : function(dataList, dataFormat) {
      return this.defaultRangeHandler(dataList, dataFormat);
    },
    // get every data's range
    getAllDataRange : function(first_x_id, first_y_id) {
      this.dataLength = 0;
      this.dataRange = [];
      var data = this.owner.data;
      for ( var i = 0; i < data.length; i++) {
        var d = data[i];
        if (!d || !$.isArray(d.data) || !d.data.length) {
          continue;
        }
        if (d.data.length > this.dataLength) {
          this.dataLength = d.data.length;
        }
        // custom format for the data
        var dataFormat = $.extend({}, this.owner.option.dataFormat, d.dataFormat);
        var dataRange = this.rangeHandler(d.data, dataFormat);
        var range = {};
        d.axis = d.axis || {};
        d.axis.x = d.axis.x || first_x_id;
        d.axis.y = d.axis.y || first_y_id;
        range[d.axis.x] = {
          min : dataRange.minX,
          max : dataRange.maxX
        };
        range[d.axis.y] = {
          min : dataRange.minY,
          max : dataRange.maxY
        };
        //keep the data range in data
        d.dataRange = range;
        //keep the data valid in data
        d.dataValid = (dataRange.minY == Number.MAX_VALUE || dataRange.maxY == -Number.MAX_VALUE || dataRange.minX == Number.MAX_VALUE || dataRange.maxX == -Number.MAX_VALUE) ? false : true;
        //
        this.dataRange.push(range);
      }
    },
    toString : function() {
      return "[object Coordinate]";
    }
  };
  //====================================================================================================
  /**
   * @constructor
   * @param owner
   * @returns {Legend}
   */
  NS.Legend = function(owner, container, data) {
    this.owner = owner;
    this.renderer = owner.renderer;
    this.container = container;
    this.data = data;
    if (data && data.length) {
      this.init();
    }
  };
  NS.Legend.prototype = {
    owner : null,
    renderer : null,
    container : null,
    //
    data : null,
    mapping_id_data : {},
    mapping_id_item : {},
    //lock style 
    lock : false,
    //current hover id
    hoverId : null,
    hovering : null,
    //
    defaultOption : function() {
      return {
        dx : 1,
        dy : 1,
        space : 0,
        style : {
          data : [{
            type : "text"
          }, {
            type : "icon"
          }],
          text : {
            value : "",
            x : 1,
            y : 14,
            cursor : "pointer",
            //"pointer-events" : S.NONE,
            "text-anchor" : "start",
            "font-size" : 14,
            "font-family" : "Verdana",
            "font-weight" : "bold",
            fill : "#000000"
          },
          icon : {
            d : "line",
            "stroke-linejoin" : "round",
            "stroke-linecap" : "round",
            "stroke-width" : 2,
            stroke : "#000000"
          },
          del : {
            d : "del",
            cursor : "pointer",
            "stroke-linejoin" : "round",
            "stroke-linecap" : "round",
            "stroke-width" : 2,
            stroke : "#000000",
            opacity : 0.5
          },
          edit : {
            d : "edit",
            cursor : "pointer",
            "stroke-width" : 1,
            stroke : "#000000",
            opacity : 0.5
          },
          back : {
            fill : "#ffffff",
            stroke : S.NONE,
            opacity : 0
          }
        },
        hover : {
          data : [{
            type : "text"
          }, {
            type : "del"
          }, {
            type : "edit"
          }],
          text : {},
          icon : {},
          del : {},
          edit : {},
          back : {
            stroke : "#999999",
            opacity : 1
          }
        }
      };
    },
    init : function() {
      this.addDefaultEvents();
      //draw
      this.draw();
      //
      return this;
    },
    addDefaultEvents : function() {
      var self = this;
      this.bind(E.MOUSEENTER, function(e, d) {
        self.hover(d.id, true);
      }).bind(E.MOUSELEAVE, function(e, d) {
        self.hover(d.id, false);
      }).bind(E.MOUSEOVER, function(e, d) {
        self.hoverIcon(d, true);
      }).bind(E.MOUSEOUT, function(e, d) {
        self.hoverIcon(d);
      }).bind(E.MOUSEDOWN, function(e, d) {
      }).bind(E.CLICK, function(e, d) {
      });
      return this;
    },
    hover : function(id, hover) {
      if (this.lock) {
        return this;
      }
      if (this.hovering) {
        this.hoverItem(this.hovering, false);
      }
      id = id || this.hoverId;
      this.hoverId = id;
      //
      this.hovering = this.getHovering();
      this.hoverItem(this.hovering, hover);
      return this;
    },
    hoverItem : function(item, hover) {
      if (!item) {
        return this;
      }
      NS.SVG.attr(item.style, {
        display : hover ? S.NONE : S.VISIBLE
      });
      NS.SVG.attr(item.hover, {
        display : hover ? S.VISIBLE : S.NONE
      });
      return this;
    },
    hoverIcon : function(d, hover) {
      var cn = d.className;
      if (cn !== "del" && cn !== "edit") {
        return this;
      }
      var data = this.mapping_id_data[d.id];
      if (!data) {
        return this;
      }
      var defaultOpacity = data.style[cn].opacity;
      data.container.find("." + cn).each(function(i, k) {
        var opacity = $(this).attr("opacity");
        if (opacity != "0") {
          $(this).attr({
            opacity : hover ? 1 : defaultOpacity
          });
        }
      });
      if (cn === "edit") {
        return this;
      }
      data.container.find(".text").each(function(i, k) {
        $(this).attr({
          opacity : hover ? defaultOpacity : 1
        });
      });
      return this;
    },
    //legend
    draw : function() {
      var pos = 0;
      for ( var i = 0, l = this.data.length; i < l; i++) {
        var item = this.data[i];
        if (!item) {
          continue;
        }
        item = $.extend(true, this.defaultOption(), item);
        item.id = item.id || "legend_" + i;
        this.drawItem(item);
        //
        NS.SVG.attr(item.container, {
          transform : NS.SVG.translate(pos, 0)
        });
        pos += item.width;
      }
      return this;
    },
    drawItem : function(item) {
      //create container for item
      item.container = $(this.renderer.drawGroup({
        id : item.id
      }, this.container));
      this.container.prepend(item.container);
      //events
      var self = this;
      item.container.bind([E.CLICK, E.MOUSEDOWN, E.MOUSEOVER, E.MOUSEOUT, E.MOUSEENTER, E.MOUSELEAVE].join(S.SPACE), function(e) {
        var dom = $(e.target);
        //
        var cn = dom.attr(S.CLASS);
        if (cn) {
          e.className = cn;
        }
        //
        var id = dom.attr(S.ID);
        if (id) {
          e.id = id;
        }
        self.send(e.type, e);
      });
      //
      var styleGroup = this.drawItemStyle(item, $.extend(true, {}, item.style));
      var hoverGroup = this.drawItemStyle(item, $.extend(true, {}, item.style, item.hover));
      //
      this.mapping_id_item[item.id] = {
        container : item.container,
        style : styleGroup,
        hover : hoverGroup
      };
      this.hover(item.id);
      //
      this.mapping_id_data[item.id] = item;
      //
      return item;
    },
    drawItemStyle : function(item, style) {
      var id = item.id;
      var group = this.renderer.drawGroup({
        id : id
      }, item.container);
      //================================================
      var posX = item.dx;
      var posY = item.dy;
      //back ===========================================
      var backW = 0;
      var backH = 0;
      var backData = NS.SVG.getElementData(style.back, {
        id : id,
        "class" : "back",
        width : backW,
        height : backH
      });
      backData.transform = NS.SVG.translate(posX, posY);
      var back = this.renderer.drawRect(backData, group);
      //================================================
      posX += item.space;
      //list ===========================================
      var list = this.renderer.drawGroup({
        id : id
      }, group);
      //data ===========================================
      for ( var i = 0, l = style.data.length; i < l; i++) {
        var data = style.data[i];
        if (!data) {
          continue;
        }
        var type = data.type;
        //copy common style data for dom
        data = $.extend(true, {}, style[type], data, {
          id : id,
          "class" : type,
          type : null
        });
        if (type === "text") {
          //text ===========================================
          var textData = NS.SVG.getElementData(data, {
            value : null
          });
          textData.transform = NS.SVG.translate(posX, posY);
          var text = this.renderer.drawText(textData, list, data.value);
          //================================================
          var rectText = NS.SVG.getRect(text);
          backH = Math.ceil(rectText.height);
          posX += Math.ceil(rectText.width) + item.space;
        } else if (type === "icon") {
          //icon ===========================================
          var iconData = NS.SVG.getElementData(data);
          iconData.d = this.getIconData(iconData.d);
          iconData.transform = NS.SVG.translate(posX, posY);
          var icon = this.renderer.drawPath(iconData, list);
          var rectIcon = NS.SVG.getRect(icon);
          posX += Math.ceil(rectIcon.width + rectIcon.x * 2) + item.space;
        } else if (type === "del") {
          //del ===========================================
          var delData = NS.SVG.getElementData(data);
          delData.d = this.getIconData(delData.d);
          delData.transform = NS.SVG.translate(posX, posY);
          var del = this.renderer.drawPath(delData, list);
          var rectDel = NS.SVG.getRect(del);
          posX += Math.ceil(rectDel.width + rectDel.x * 2) + item.space;
          //event mask
          delData.opacity = 0;
          delData.d = this.getIconData("mask", rectDel);
          this.renderer.drawPath(delData, list);
        } else if (type === "edit") {
          //edit ===========================================
          var editData = NS.SVG.getElementData(data);
          editData.d = this.getIconData(editData.d);
          editData.transform = NS.SVG.translate(posX, posY);
          var edit = this.renderer.drawPath(editData, list);
          var rectEdit = NS.SVG.getRect(edit);
          posX += Math.ceil(rectEdit.width + rectEdit.x * 2) + item.space;
          //event mask
          editData.opacity = 0;
          editData.d = this.getIconData("mask", rectEdit);
          this.renderer.drawPath(editData, list);
        }
      }
      //================================================
      backW = posX - item.dx;
      //back size ======================================
      NS.SVG.attr(back, {
        width : backW,
        height : backH
      });
      //keep w/h
      if (!item.width && !item.height) {
        var rectMain = NS.SVG.getRect(group);
        item.width = Math.ceil(rectMain.width);
        item.height = Math.ceil(rectMain.height);
      }
      return group;
    },
    getIconData : function(d, rect) {
      var P = NS.SVG.point;
      if (d === "bar") {
        d = "M4,14 L4,12 M7,14 L7,8 M10,14 L10,10 M13,14 L13,4";
      } else if (d === "line") {
        d = "M4,14 L14,4";
      } else if (d === "del") {
        d = "M4,14 L14,4 M4,4 L14,14";
      } else if (d === "edit") {
        d = "M" + P(12, 4);
        d += "L" + P(5, 11);
        d += "L" + P(4, 14);
        d += "L" + P(7, 13);
        d += "L" + P(14, 6);
        d += "z";
      } else if (d === "mask") {
        d = "M" + P(rect.x, rect.y);
        d += "L" + P(rect.x + rect.width, rect.y);
        d += "L" + P(rect.x + rect.width, rect.y + rect.height);
        d += "L" + P(rect.x, rect.y + rect.height);
        d += "L" + P(rect.x, rect.y);
      }
      return d;
    },
    getHovering : function() {
      return this.mapping_id_item[this.hoverId] || {};
    },
    /*
     * class print
     */
    toString : function() {
      return "[object Legend]";
    }
  };
  NS.Legend.prototype = $.extend(new NS.EventBase(), NS.Legend.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @extends NS.EventBase
   */
  NS.ChartBase = function() {
  };
  NS.ChartBase.prototype = {
    VERSION : "1.0.120220A",
    //8 length token for new class
    token : "12345678",
    //timer ===============================
    /*
     * time tags, using for record/debug
     * 0 new class
     * 1 draw but not start
     * 2 draw start
     * 3 draw complete
     */
    time0 : new Date(),
    time1 : null,
    time2 : null,
    time3 : null,
    //using for async drawing
    timeid : null,
    //using for other async
    timeout : null,
    //using for animation
    timeval : null,
    //global config =======================
    //option
    option : {},
    //style
    style : {},
    //data
    data : [],
    //container display ===================
    visible : true,
    container : null,
    width : 0,
    height : 0,
    offset : {
      left : 0,
      top : 0
    },
    renderer : null,
    //
    graph : null,
    coordinate : null,
    //for hover ===========================
    hoversrc : null,
    hovering : null,
    //for data API ========================
    mapping_id_data : {},
    mapping_id_item : {},
    //draw ================================
    //optimize redraw
    drawType : "",
    //draw delay
    drawDelay : 1,
    //finish drawing
    drawCompleted : false,
    //using for stop events 
    enabled : true,
    //move parameters ====================
    //using for move/zoom/clip
    moveEnabled : false,
    moveOffsetX : 0,
    moveOffsetY : 0,
    moveStartX : 0,
    moveStartY : 0,
    moveLastX : 0,
    moveLastY : 0,
    moveNowX : 0,
    moveNowY : 0,
    //super init function =================
    superinit : function() {
      this.token = Math.random().toString().substr(2, 8);
      this.time0 = new Date();
      return this;
    },
    //basic function ======================
    defaultStyle : function() {
      return {};
    },
    defaultOption : function() {
      return {};
    },
    init : function() {
      return this;
    },
    /*
     * option api
     */
    setOption : function() {
      this.option = this.getOption.apply(this, arguments);
      this.drawType = "option";
      this.draw();
      return this;
    },
    getOption : function() {
      var option = this.option;
      if (arguments.length && arguments[0]) {
        var new_option = arguments[0];
        var old_option = this.defaultOption();
        //append the option to current option
        if (arguments[1]) {
          old_option = this.option;
        }
        option = $.extend(true, old_option, new_option);
      }
      return option;
    },
    /*
     * style api
     */
    setStyle : function() {
      this.style = this.getStyle.apply(this, arguments);
      // do NOT draw, style depend on data
      return this;
    },
    getStyle : function() {
      var style = this.style;
      if (arguments.length && arguments[0]) {
        var new_style = arguments[0];
        var old_style = this.defaultStyle();
        //append the style to current style
        if (arguments[1]) {
          old_style = this.style;
        }
        style = $.extend(true, old_style, new_style);
      }
      return style;
    },
    //quick get data style
    getDataStyle : function(data, name, append) {
      data = data || {};
      var styleO = this.style || {};
      var styleD = data.style || {};
      if (name) {
        if (typeof (name) === S.STRING) {
          var list = name.split(S.DOT);
          while (list.length) {
            var key = list.shift();
            styleO = styleO[key] || {};
            styleD = styleD[key] || {};
          }
        } else {
          append = $.extend(true, name, append);
        }
      }
      return NS.SVG.getElementData(styleO, styleD, append);
    },
    /*
     * data api
     */
    setData : function() {
      if (arguments.length) {
        this.data = arguments[0];
        this.drawType = "data";
      }
      return this.draw();
    },
    getData : function() {
      return this.data;
    },
    addData : function(data, unshift) {
      data = T.array(data);
      for ( var i = 0, l = data.length; i < l; i++) {
        if (unshift) {
          this.data.unshift(data[i]);
        } else {
          this.data.push(data[i]);
        }
      }
      this.draw();
      return this;
    },
    delData : function() {
      return this;
    },
    getDataFormat : function(dataFormat) {
      return $.extend({}, this.option.dataFormat, dataFormat);
    },
    getDataById : function(id) {
      return this.mapping_id_data[id];
    },
    getItemById : function(id) {
      return this.mapping_id_item[id];
    },
    /*
     * draw api
     */
    draw : function() {
      this.time1 = new Date();
      clearTimeout(this.timeid);
      if (arguments.length) {
        if (arguments[0]) {
          return this.drawNow();
        }
      }
      if (this.drawDelay > 0) {
        var self = this;
        this.timeid = setTimeout(function() {
          self.drawNow();
        }, this.drawDelay);
      } else {
        this.drawNow();
      }
      return this;
    },
    drawNow : function() {
      clearTimeout(this.timeid);
      // start
      this.drawStart();
      this.drawMain();
      this.drawComplete();
      return this;
    },
    //draw step
    drawStart : function() {
      this.time2 = new Date();
      this.drawCompleted = false;
      this.send(E.DRAW_START, this);
      return this;
    },
    drawMain : function() {
      //this.renderer.setSize(this.width, this.height);
      //do it youself
      //draw main graph here
      //draw back
      //draw coordinate
      //draw list
      this.drawList();
      //draw top
    },
    drawList : function() {
      //do it youself
    },
    drawComplete : function() {
      this.drawCompleted = true;
      this.time3 = new Date();
      this.send(E.DRAW_COMPLETE, this);
      return this;
    },
    /*
     * svg exporting
     */
    // get svg xml string content for exporting
    getSVG : function() {
      return this.renderer.toXMLString();
    },
    /*
     * find child from current container
     */
    find : function(context) {
      return $(this.container).find(context);
    },
    /*
     * i18n for label
     */
    i18n : function(data) {
      data = data || {};
      var label = data.label || data.value;
      if (T.isnum(data.toFixed)) {
        label = T.tonum(label).toFixed(data.toFixed);
      }
      return label;
    },
    /*
     * resize
     */
    setSize : function() {
      var w = this.width;
      var h = this.height;
      if (arguments.length) {
        var nw = T.tonum(arguments[0], true);
        if (nw >= 0) {
          w = nw;
        }
        if (arguments.length > 1) {
          var nh = T.tonum(arguments[1], true);
          if (nh >= 0) {
            h = nh;
          }
        }
      }
      if (this.width != w || this.height != h) {
        this.width = w;
        this.height = h;
        this.drawType = "resize";
        this.draw();
      }
      return this;
    },
    /*
     * visible
     */
    show : function() {
      this.container.show();
      this.visible = true;
      this.send(E.DISPLAY, true);
      return this;
    },
    hide : function() {
      this.container.hide();
      this.visible = false;
      this.send(E.DISPLAY, false);
      return this;
    },
    /*
     * destroy
     */
    remove : function() {
      this.hide();
      this.unbind();
      this.container.empty();
    },
    destroy : function() {
      this.remove();
      this.container.remove();
    },
    /*
     * class print
     */
    toString : function() {
      return "[object ChartBase]";
    }
  };
  NS.ChartBase.prototype = $.extend(new NS.EventBase(), NS.ChartBase.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.ChartZoom}
   */
  NS.ChartZoom = function() {
    //plugin for ChartBase, chart zoom support
  };
  NS.ChartZoom.prototype = {
    //for zoom in/zoom out ================
    animate : null,
    drawing : false,
    //
    level : 0,
    scale : 1,
    zoomX : 0,
    zoomY : 0,
    //for context menu when right click
    menu : null,
    //default zoom option
    //refer to global this.option.zoom
    zoomOption : {
      maxLevel : 10,
      zoomPerLevel : 2,
      zoomZPerLevel : 1.5,
      duration : 500,
      easing : NS.Easing.easeOutQuart,
      fps : 50
    },
    /*
     * zoom functions
     */
    getZoomOption : function() {
      return T.copy(this.zoomOption, this.option.zoom);
    },
    getZoomOffset : function(scale, mx, my, tw, th) {
      //center of area by current scale
      var ox = mx / (tw * this.scale);
      var oy = my / (th * this.scale);
      //offset by new scale
      var offsetX = -tw * scale * ox + tw * 0.5;
      var offsetY = -th * scale * oy + th * 0.5;
      return {
        offsetX : offsetX,
        offsetY : offsetY
      };
    },
    getScaleByLevel : function(level) {
      var zmop = this.getZoomOption();
      this.level = T.clamp(level, 0, zmop.maxLevel);
      var scale = 1 + this.level * zmop.zoomPerLevel;
      return scale;
    },
    /*
     * get size by scale
     * z is 1.5X
     */
    getScaleSize : function(r, z) {
      r = T.tonum(r);
      var scale = this.scale;
      if (scale <= 1) {
        return r;
      }
      //There are ten levels of zooming
      //2X zoom per level for X and Y axis. 
      //1.5X zoom per level for Z variable
      if (z) {
        var zmop = this.getZoomOption();
        var scaleZ = 1 + (scale - 1) * (zmop.zoomZPerLevel / zmop.zoomPerLevel) * 0.5;
        return scaleZ * r;
      }
      //normal scale
      return scale * r;
    },
    setZoom : function(level) {
      var scale = this.getScaleByLevel(level);
      if (scale == this.scale || !this.coordinate) {
        return this;
      }
      var rect = this.coordinate.rect;
      var tw = rect.width;
      var th = rect.height;
      var mx = -this.zoomX + tw * 0.5;
      var my = -this.zoomY + th * 0.5;
      var offset = this.getZoomOffset(scale, mx, my, tw, th);
      var animation = true;
      if (arguments.length > 1) {
        animation = arguments[1];
      }
      this.zoomTo(scale, offset.offsetX, offset.offsetY, animation);
      return this;
    },
    zoomStop : function() {
      this.drawing = false;
      if (this.animate) {
        this.animate.stop();
        this.animate = null;
      }
      return this;
    },
    zoomTo : function(scale, zoomX, zoomY, animation, beyond) {
      this.zoomStop();
      // no animation 
      if (!animation) {
        this.zoomNow(scale, zoomX, zoomY, beyond);
        return this;
      }
      //animation start
      this.send(E.ZOOM_START, this);
      //
      var zmop = this.getZoomOption();
      this.animate = new NS.Animate({
        fps : zmop.fps,
        duration : zmop.duration,
        easing : zmop.easing,
        target : this,
        from : {
          scale : this.scale,
          zoomX : this.zoomX,
          zoomY : this.zoomY
        },
        till : {
          scale : scale,
          zoomX : zoomX,
          zoomY : zoomY
        },
        start : function() {
          this.target.drawing = true;
        },
        step : function(data) {
          this.target.zoomNow(data.scale, data.zoomX, data.zoomY, beyond);
        },
        complete : function() {
          this.target.drawing = false;
          this.target.animate = null;
          this.target.send(E.ZOOM_COMPLETE, self);
          this.target = null;
        }
      });
      return this;
    },
    zoomNow : function(scale, zoomX, zoomY, beyond) {
      if ((scale == this.scale && zoomX == this.zoomX && zoomY == this.zoomY) || !this.coordinate) {
        return this;
      }
      //new scale
      this.scale = scale;
      //new zoom offset
      var rect = this.coordinate.rect;
      var tw = rect.width;
      var th = rect.height;
      var sx = -(tw * scale - tw);
      var sy = -(th * scale - th);
      //do NOT allow out of area
      if (!beyond) {
        var clamp = T.clamp;
        zoomX = clamp(zoomX, sx, 0);
        zoomY = clamp(zoomY, sy, 0);
      }
      this.zoomX = zoomX;
      this.zoomY = zoomY;
      //draw zoom
      this.drawZoom();
      return this;
    },
    drawZoom : function() {
      //do it youself
    },
    //draw right click menu
    drawMenu : function(clsn, offsetX, offsetY) {
      var self = this;
      var rect = this.coordinate.rect;
      var c = {
        i : clsn + "_zoomin",
        o : clsn + "_zoomout",
        c : clsn + "_center",
        ci : "chart_menu_zoomin",
        co : "chart_menu_zoomout",
        cc : "chart_menu_center",
        ni : "Zoom In",
        no : "Zoom Out",
        nc : "Center Chart Here"
      };
      //menu init and events ============
      $(window).one(E.CLICK, function(e) {
        //hide menu when click any others
        self.menu.hide();
      });
      this.menu.empty().unbind().click(function(e) {
        var elem = $(e.target);
        var scale = null;
        if (elem.hasClass(c.i)) {
          scale = self.getScaleByLevel(self.level + 1);
        } else if (elem.hasClass(c.o)) {
          scale = self.getScaleByLevel(self.level - 1);
        } else if (elem.hasClass(c.c)) {
          scale = self.scale;
        }
        if (scale !== null) {
          var mx = offsetX - self.zoomX;
          var my = offsetY - self.zoomY;
          var tw = rect.width;
          var th = rect.height;
          var offset = self.getZoomOffset(scale, mx, my, tw, th);
          self.zoomTo(scale, offset.offsetX, offset.offsetY, true);
        }
      }).bind(E.CONTEXTMENU, function(e) {
        //disabled menu right click again 
        return false;
      });
      //menu list =======================
      var zmop = this.getZoomOption();
      if (this.level < zmop.maxLevel) {
        $(S.DIV).addClass(c.ci + S.SPACE + c.i).html(c.ni).appendTo(this.menu);
      }
      if (this.level > 0) {
        $(S.DIV).addClass(c.co + S.SPACE + c.o).html(c.no).appendTo(this.menu);
        $(S.DIV).addClass(c.cc + S.SPACE + c.c).html(c.nc).appendTo(this.menu);
      }
      //menu position ====================
      this.menu.css({
        left : offsetX + rect.left,
        top : offsetY + rect.top
      }).show();
    }
  };
  //=====================================================================================
  /**
   * @constructor
   * @param container
   * @returns {NS.Tips}
   */
  NS.Tips = function(container) {
    this.dispather = $(this);
    this.events = E;
    this.option = this.defaultOption();
    this.style = this.defaultStyle();
    // container
    this.body = document.body;
    this.container = $(container || this.body);
    if (!this.container.length) {
      throw new Error(this + " require a container");
    }
    /*
     * initialize
     */
    this.init();
  };
  NS.Tips.prototype = {
    VERSION : "1.0.120618A",
    nowX : 0,
    nowY : 0,
    //slide up/slide down
    slideStatus : null,
    slideExpect : null,
    slideTarget : null,
    //
    cache_back_data : null,
    cache_list_data : null,
    //
    reverse : {
      left : S.RIGHT,
      right : S.LEFT,
      top : S.BOTTOM,
      bottom : S.TOP
    },
    defaultOption : function() {
      return {
        className : "tips",
        container : null,
        //for container z-index and pointer-events
        zIndex : 99999,
        pointerEvents : null,
        //
        delay : 1,
        space : 12,
        position : S.LEFT + S.RIGHT + S.TOP + S.BOTTOM,
        //
        minWidth : 20,
        minHeight : 20,
        maxWidth : 1920,
        maxHeight : 1920,
        //
        data : "",
        style : {
          "font-size" : 12,
          "font-family" : "Verdana",
          "white-space" : "nowrap",
          "line-height" : "100%",
          color : "#000000",
          margin : 0,
          padding : "8px 8px"
        },
        //target range
        target : {
          x : 0,
          y : 0,
          width : 0,
          height : 0
        },
        //holder range, max Full HD
        holder : {
          //if exact in holder
          exact : false,
          x : 0,
          y : 0,
          width : 1920,
          height : 1080
        },
        //SVG back
        back : {
          radius : 5,
          arrowSize : 5,
          style : {
            fill : "#ffffff",
            "stroke-width" : 2,
            stroke : "#000000",
            opacity : 0.9
          }
        },
        //animation for moving
        animation : {
          animate : true,
          duration : 300,
          easing : NS.Easing.easeOutQuart,
          fps : 50
        }
      };
    },
    init : function() {
      this.graph = $(S.DIV).css({
        width : 0,
        height : 0,
        padding : 0,
        margin : 0,
        //must be top and left, no scroll bar
        top : -1080,
        left : -1920,
        position : S.ABSOLUTE
      }).appendTo(this.container);
      // graph renderer, using SVG
      this.renderer = new NS.Renderer(S.SVG);
      this.svg_root = this.renderer.init(0, 0);
      NS.SVG.attr(this.svg_root, {
        "pointer-events" : S.NONE
      });
      this.svg_back = $(this.renderer.drawPath({}, this.svg_root));
      this.graph.append(this.svg_root);
      //
      this.main = $(S.DIV).css({
        //background : "#ff0000",
        padding : 0,
        margin : 0,
        position : S.ABSOLUTE
      }).appendTo(this.graph);
      this.hideNow();
      //
      var self = this;
      this.graph.unbind().bind([E.MOUSEOVER, E.MOUSEOUT, E.CLICK, E.DBLCLICK, E.MOUSEDOWN, E.MOUSEUP, E.MOUSEENTER, E.MOUSELEAVE].join(S.SPACE), function(e) {
        self.send(e.type, e);
      });
      return this;
    },
    /*
     * draw
     */
    drawMain : function() {
      this.stop();
      var op = this.option;
      var cn = op.className;
      C = {
        main : cn + "_main",
        list : cn + "_list",
        item : cn + "_item",
        back : cn + "_back"
      };
      this.drawList();
      //========================================================
      if (!op.target) {
        return this;
      }
      //first time move to holder center =======================
      if (this.nowX == 0 && this.nowY == 0) {
        this.nowX = op.holder.x + op.holder.width * 0.5 - this.offset.left;
        this.nowY = op.holder.y + op.holder.height * 0.5 - this.offset.top;
        this.move();
      }
      // allow =================================================
      var allow = {
        left : null,
        right : null,
        top : null,
        bottom : null
      };
      var allowList = new Array();
      for ( var k in allow) {
        if (op.position.indexOf(k) == -1) {
          continue;
        }
        //base data
        var info = {
          type : k,
          //position
          x : 0,
          y : 0,
          //size
          width : 0,
          height : 0,
          //for exact fixing when position change
          offsetX : 0,
          offsetY : 0,
          //blank in holder
          blank : 0,
          //move distance to target
          distance : 0,
          //inner of holder
          inner : true
        };
        info = this.updateInfo(info);
        //
        allow[k] = info;
        allowList.push(info);
      }
      //(allowList);
      var len = allowList.length;
      if (!len) {
        return this;
      }
      var item = allowList[0];
      if (len > 1) {
        //choose inner
        var innerList = new Array();
        for ( var i = 0; i < len; i++) {
          if (allowList[i].inner) {
            innerList.push(allowList[i]);
          }
        }
        var slen = innerList.length;
        // has inner
        if (slen) {
          //choose distance shorter
          if (slen > 1) {
            innerList.sort(function(a, b) {
              if (a.distance > b.distance) {
                return 1;
              } else if (a.distance < b.distance) {
                return -1;
              } else {
                return 0;
              }
            });
          }
          item = innerList[0];
        } else {
          //choose space bigger
          allowList.sort(function(a, b) {
            if (a.blank > b.blank) {
              return -1;
            } else if (a.blank < b.blank) {
              return 1;
            } else {
              return 0;
            }
          });
          item = allowList[0];
          //if out of screen
          //if (item.x < 0 && allowList.length > 1) {
          //  item = allowList[1];
          //}
        }
      }
      //(item);
      if (!item) {
        return this;
      }
      //save current data
      this.data = item;
      //show graph ===============================================
      //class name will add in drawList
      this.showNow();
      //update offset and draw ===================================
      this.updateOffset();
      this.drawBack();
      //end position =============================================
      var tp = item.type;
      var ex = item.x + item.offsetX;
      var ey = item.y + item.offsetY;
      //NO animation =============================================
      if (!op.animation || !op.animation.animate) {
        this.nowX = ex;
        this.nowY = ey;
        this.move();
        return this;
      }
      //keeping out of target ====================================
      if ((tp === S.LEFT && this.nowX > ex) || (tp === S.RIGHT && this.nowX < ex)) {
        this.nowX = ex;
        this.move();
      } else if ((tp === S.TOP && this.nowY > ey) || (tp === S.BOTTOM && this.nowY < ey)) {
        this.nowY = ey;
        this.move();
      }
      // animation ===============================================
      this.animate = new NS.Animate({
        target : this,
        fps : op.animation.fps,
        duration : op.animation.duration,
        easing : op.animation.easing,
        from : {
          nowX : this.nowX,
          nowY : this.nowY
        },
        till : {
          nowX : ex,
          nowY : ey
        },
        step : function(data) {
          this.target.nowX = data.nowX;
          this.target.nowY = data.nowY;
          this.target.move();
        },
        complete : function() {
          this.target.animate = null;
        }
      });
      //
      return this;
    },
    //get container offset
    getOffset : function() {
      var offset = {
        left : 0,
        top : 0
      };
      var isbody = (this.container.get(0) == this.body) ? true : false;
      if (!isbody) {
        offset = this.container.offset();
      }
      return offset;
    },
    drawList : function() {
      var op = this.option;
      //update container offset
      this.offset = this.getOffset();
      //if nothing change then return
      var listData = {
        zIndex : op.zIndex,
        pointerEvents : op.pointerEvents,
        container : op.container,
        style : op.style,
        data : op.data
      };
      if (T.same(listData, this.cache_list_data)) {
        //("same");
        return this;
      }
      this.cache_list_data = listData;
      //clear first
      this.main.empty();
      //set z-index and auto width and height ====================
      this.graph.removeClass().addClass(op.className).css({
        "z-index" : op.zIndex,
        "pointer-events" : op.pointerEvents
      });
      this.main.removeClass().addClass(C.main);
      this.initMain();
      //change container =========================================
      if (op.container) {
        var container = $(op.container || this.body);
        if (container.length && container.get(0) != this.container.get(0)) {
          container.append(this.graph);
          this.container = container;
          this.offset = this.getOffset();
        }
      }
      //create new list ==========================================
      this.list = $(S.DIV).addClass(C.list).css(op.style);
      //append content
      var data = T.array(op.data);
      for ( var i = 0, l = data.length; i < l; i++) {
        var t = data[i];
        if (!t) {
          continue;
        }
        var text = t;
        var style = {};
        //music be Object
        if ($.isPlainObject(t)) {
          text = t.text || t;
          style = t.style || {};
        }
        $(S.DIV).addClass(C.item).append(text).css(style).appendTo(this.list);
      }
      //append to main display
      this.main.append(this.list);
      //for scrollbar fixing 
      this.send(E.DRAW_UPDATE, this.main);
      //
      this.sizeMain();
      //
      return this;
    },
    //before content change
    initMain : function() {
      this.main.css({
        left : 0,
        top : 0,
        width : S.AUTO,
        height : S.AUTO,
        "border-radius" : this.option.back.radius
      });
    },
    //after content change
    sizeMain : function() {
      var op = this.option;
      var tw = this.main.width();
      var th = this.main.height();
      //max and min fix
      var mw = T.clamp(tw, op.minWidth, op.maxWidth);
      var mh = T.clamp(th, op.minHeight, op.maxHeight);
      if (mw != tw) {
        this.main.width(mw);
      }
      if (mh != th) {
        this.main.height(mh);
      }
    },
    drawBack : function() {
      var op = this.option;
      var space = op.space;
      var back = op.back;
      var data = this.data;
      //
      var bw = this.main.width();
      var bh = this.main.height();
      var bt = this.reverse[data.type];
      var bl = back.arrowSize;
      var br = back.radius;
      //get arrow path data
      var bs = 0.5;
      if (bt === S.LEFT || bt === S.RIGHT) {
        if (data.offsetY && bh) {
          bs = 1 - T.clamp((0.5 + data.offsetY / bh), 0, 1);
        }
      } else if (bt === S.TOP || bt === S.BOTTOM) {
        if (data.offsetX && bw) {
          bs = 1 - T.clamp((0.5 + data.offsetX / bw), 0, 1);
        }
      }
      var bx = space;
      var by = space;
      //
      var backData = NS.SVG.getElementData(back.style, {
        "class" : C.back,
        d : NS.SVG.getTipPath(bt, bl, bs, bx, by, bw, bh, br)
      });
      //if nothing change then just return =======
      if (T.same(backData, this.cache_back_data)) {
        return this;
      }
      this.cache_back_data = backData;
      //svg position fixing =======================
      NS.SVG.attr(this.svg_root, {
        style : "left: -" + space + "px; top : -" + space + "px; position: " + S.ABSOLUTE
      });
      //svg size fixing ===========================
      this.renderer.setSize(bw + space * 2, bh + space * 2);
      //draw back =================================
      NS.SVG.attr(this.svg_back, backData);
      return this;
    },
    updateInfo : function(info) {
      var space = this.option.space;
      var target = this.addCenter(this.option.target);
      var holder = this.addCenter(this.option.holder);
      //size
      info.width = this.main.width();
      info.height = this.main.height();
      //position and blank
      var type = info.type;
      if (type === S.LEFT) {
        info.x = target.x - space - info.width;
        info.y = target.cy - info.height * 0.5;
        info.blank = info.x - holder.x;
      } else if (type === S.RIGHT) {
        info.x = target.x + target.width + space;
        info.y = target.cy - info.height * 0.5;
        info.blank = (holder.x + holder.width) - (info.x + info.width);
      } else if (type === S.TOP) {
        info.x = target.cx - info.width * 0.5;
        info.y = target.y - space - info.height;
        info.blank = info.y - holder.y;
      } else if (type === S.BOTTOM) {
        info.x = target.cx - info.width * 0.5;
        info.y = target.y + target.height + space;
        info.blank = (holder.y + holder.height) - (info.y + info.height);
      }
      //if in holder area
      info.inner = !T.outrect(info, holder, true);
      //container position offset fixing
      info.x -= this.offset.left;
      info.y -= this.offset.top;
      //the distance between with current position
      info.distance = T.distance(info, {
        x : this.nowX,
        y : this.nowY
      });
      return info;
    },
    //if not inner and need exact position fixing
    updateOffset : function() {
      var offset = this.offset;
      var holder = this.option.holder;
      var data = this.data;
      var type = data.type;
      //
      if (holder.exact && !data.inner) {
        if (type === S.LEFT || type === S.RIGHT) {
          //offset y fixing
          var y = T.clamp(data.y + offset.top, holder.y, holder.y + holder.height - data.height) - offset.top;
          data.offsetY = y - data.y;
        } else if (type === S.TOP || type === S.BOTTOM) {
          //offset x fixing
          var x = T.clamp(data.x + offset.left, holder.x, holder.x + holder.width - data.width) - offset.left;
          data.offsetX = x - data.x;
        }
      }
    },
    /*
     * slide 
     */
    slideStop : function() {
      if (this.slider) {
        this.slider.stop();
        this.slider = null;
      }
    },
    slideUp : function(clsn, delay) {
      return this.slide(S.TOP, clsn, delay);
    },
    slideDown : function(clsn, delay) {
      return this.slide(S.BOTTOM, clsn, delay);
    },
    slide : function(type, clsn, delay) {
      clearTimeout(this.timeout);
      //whatever the expect status
      this.slideExpect = type;
      //get target
      this.slideTarget = this.main.find(clsn);
      //start animation
      delay = T.tonum(delay, true);
      if (delay > 0) {
        var self = this;
        this.timeout = setTimeout(function() {
          self.slideNow(type);
        }, delay);
      } else {
        this.slideNow(type);
      }
      return this;
    },
    slideNow : function(type) {
      if (this.slideStatus === type) {
        return this;
      }
      this.slideStop();
      if (!this.slideTarget || !this.slideTarget.length) {
        return this;
      }
      //
      var height = this.slideTarget.height();
      var from, till;
      if (type === S.BOTTOM) {
        from = 0;
        till = height;
      } else {
        from = height;
        till = 0;
      }
      //
      this.slider = new NS.Animate({
        target : this,
        from : from,
        till : till,
        start : function() {
          this.target.slideTarget.css({
            display : "",
            height : from,
            overflow : S.HIDDEN
          });
        },
        step : function(data) {
          this.target.initMain();
          this.target.slideTarget.css({
            height : data
          });
          this.target.sizeMain();
          this.target.slideUpdate();
        },
        complete : function() {
          var data = {
            overflow : "",
            height : ""
          };
          if (till == 0) {
            data.display = S.NONE;
          }
          this.target.initMain();
          this.target.slideTarget.css(data);
          this.target.sizeMain();
          this.target.slideUpdate();
          //finaly status
          this.target.slideStatus = type;
          this.target.slideCheck(type);
        }
      });
      return this;
    },
    //expect status
    slideCheck : function(type) {
      if (type !== this.slideExpect) {
        this.slideNow(this.slideExpect);
      }
      return this;
    },
    slideUpdate : function() {
      var data = this.updateInfo(this.data);
      this.updateOffset();
      this.drawBack();
      this.nowX = data.x + data.offsetX;
      this.nowY = data.y + data.offsetY;
      this.move();
      return this;
    },
    /*
     * set to top layer
     */
    setIndexToTop : function() {
      this.container.append(this.graph);
      return this;
    },
    /*
     * add cx and cy for a rect
     */
    addCenter : function(rect) {
      if (rect) {
        rect.cx = rect.x + rect.width * 0.5;
        rect.cy = rect.y + rect.height * 0.5;
      }
      return rect;
    },
    /*
     * show
     */
    show : function() {
      this.option = this.getOption.apply(this, arguments);
      this.drawDelay = this.option.delay;
      this.draw();
      return this;
    },
    move : function() {
      this.graph.css({
        left : this.nowX,
        top : this.nowY
      });
      return this;
    },
    hide : function() {
      this.stop();
      var self = this;
      this.timeout = setTimeout(function() {
        self.hideNow();
      }, 100);
      return this;
    },
    showNow : function() {
      this.graph.css({
        visibility : S.VISIBLE
      });
      this.visible = true;
      this.send(E.DISPLAY, true);
      return this;
    },
    hideNow : function() {
      this.stop();
      this.graph.css({
        visibility : S.HIDDEN
      });
      this.visible = false;
      this.send(E.DISPLAY, false);
      return this;
    },
    stop : function() {
      clearTimeout(this.timeid);
      clearTimeout(this.timeout);
      if (this.animate) {
        this.animate.stop();
      }
      this.slideStop();
      return this;
    },
    remove : function() {
      this.hideNow();
      this.graph.unbind().empty().remove();
    },
    destroy : function() {
      this.unbind();
      this.remove();
    },
    /*
     * using for alert(ClassName) print info
     */
    toString : function() {
      return "[object Tips]";
    }
  };
  NS.Tips.prototype = $.extend(new NS.ChartBase(), NS.Tips.prototype);
  //Singleton
  NS.Tips.getInstance = function(singleton, _container) {
    singleton = "instanceTips" + (singleton || "");
    if (!NS[singleton]) {
      NS[singleton] = new NS.Tips(_container);
    }
    return NS[singleton];
  };
  //delete a instance
  NS.Tips.delInstance = function(singleton) {
    singleton = "instanceTips" + (singleton || "");
    if (NS[singleton]) {
      NS[singleton].remove();
      delete NS[singleton];
    }
  };
  //====================================================================================================
  /**
   * @constructor
   * @returns {NS.ChartZoom}
   */
  NS.ChartClip = function() {
    //plugin for ChartBase, chart data clip support
  };
  NS.ChartClip.prototype = {
    //clip mode
    clipMode : false,
    //clip name
    clipName : "clip",
    //clip move/crop
    clipType : "",
    //current rect position
    clipPosition : null,
    //clip crop ========================================
    //save position data when start
    clipCropData : null,
    //current type when dragging
    clipCropType : "",
    //all crop list: north, west, south, east
    clipCropInfo : {
      n : null,
      w : null,
      s : null,
      e : null,
      nw : null,
      ne : null,
      sw : null,
      se : null
    },
    //clip list ========================================
    clipList : null,
    clipPane : null,
    clipListMain : null,
    clipListHead : null,
    clipListBody : null,
    //clip option ======================================
    //refer to global this.option.clip
    clipOption : {
      //default position
      position : {
        x : 87,
        y : 87,
        width : 65,
        height : 65
      },
      //inner rect style
      inner : {
        fill : "#000000",
        "fill-opacity" : 0,
        stroke : "#000000",
        lineWidth : 1
      },
      //outer back style
      outer : {
        fill : "#000000",
        opacity : 0.2
      },
      //crop style
      crop : {
        stroke : "#000000",
        lineWidth : 6
      },
      list : {
        space : 15,
        position : S.LEFT + S.RIGHT,
        minHeight : 50,
        style : {
          margin : 0,
          padding : "5px 5px"
        },
        back : {
          radius : 10,
          arrowSize : 10,
          style : {
            fill : "#E6E7E8",
            "stroke-width" : 1,
            stroke : "#E6E7E8",
            opacity : 0.9
          }
        }
      },
      scrollpane : {}
    },
    getClipOption : function() {
      return T.copy(this.clipOption, this.option.clip);
    },
    getClipData : function() {
      //do it youself
      return [];
    },
    //clip mode
    setClip : function() {
      var fun = null;
      var val = !this.clipMode;
      var len = arguments.length;
      if (len) {
        for ( var i = 0; i < len; i++) {
          var a = arguments[i];
          if (typeof (a) === S.BOOLEAN) {
            val = a;
          } else if (typeof (a) === S.FUNCTION) {
            fun = a;
          }
        }
      }
      this.clipMode = val ? true : false;
      //draw
      if (this.clipMode) {
        this.showClip();
      } else {
        this.hideClip();
      }
      //callback
      if (fun) {
        fun.call(this, this.clipMode);
      }
      return this;
    },
    setClipCursor : function() {
      var ci = arguments[0];
      var cc = ci;
      if (arguments.length > 1) {
        cc = arguments[1];
      }
      var attr = NS.SVG.attr;
      attr(this.svg_main_clip_inner, {
        cursor : ci
      });
      attr(this.svg_main_clip, {
        cursor : cc
      });
    },
    setClipType : function(type) {
      this.clipType = type;
    },
    setClipCrop : function(type, data) {
      this.clipCropType = type;
      this.clipCropData = data;
    },
    //clip events ==========================================================
    addClipEvents : function() {
      var self = this;
      this.bind(E.CLIP_START, function(e, d) {
        var clsn = d.className;
        var co = self.clipName + "_outer";
        var ci = self.clipName + "_inner";
        if (clsn == co) {
          self.setClipType("");
        } else if (clsn == ci) {
          self.setClipType("move");
          self.setClipCursor(NS.Cursor.grabbing);
        } else if (clsn) {
          self.setClipType("crop");
          var cc = self.clipName + "_crop_";
          var type = clsn.replace(cc, "");
          var data = T.copy(self.clipPosition);
          self.setClipCrop(type, data);
          self.setClipCursor(type + "-resize");
        }
        self.clipStart();
      }).bind(E.CLIP, function(e, d) {
        if (self.clipType == "move") {
          self.clipMove();
        } else if (self.clipType == "crop") {
          self.clipCrop();
        } else {
          self.clipDrag();
        }
      }).bind(E.CLIP_COMPLETE, function(e, d) {
        //reset cursor
        self.setClipCursor(NS.Cursor.grab, null);
        self.clipComplete();
      });
      //zoom update
      this.bind(E.ZOOM_COMPLETE, function(e, d) {
        if (self.clipMode) {
          self.clipComplete();
        }
      });
      //clear
      this.bind(E.DRAW_START, function(e, d) {
        if (self.clipMode) {
          self.hideClip();
        }
      });
    },
    //
    clipStart : function() {
      this.hideClipList();
    },
    clipComplete : function() {
      this.showClipList();
    },
    //clip drag =========================================================
    clipDrag : function() {
      var offset = this.container.offset();
      var rect = this.coordinate.rect;
      var x = this.moveStartX - offset.left - rect.left;
      var y = this.moveStartY - offset.top - rect.top;
      var w = this.moveNowX - this.moveStartX;
      var h = this.moveNowY - this.moveStartY;
      this.clipPosition = {
        x : x,
        y : y,
        width : w,
        height : h
      };
      this.drawClip();
    },
    //clip move =========================================================
    clipMove : function() {
      this.clipPosition.x += this.moveOffsetX;
      this.clipPosition.y += this.moveOffsetY;
      this.drawClip();
    },
    //clip crop =========================================================
    clipCrop : function() {
      var data = this.clipCropData;
      var dx = this.moveLastX - this.moveStartX;
      var dy = this.moveLastY - this.moveStartY;
      var w = data.width + dx;
      var h = data.height + dy;
      var n = this.clipCropType;
      if (n.indexOf("n") != -1) {
        this.clipPosition.y = data.y + dy;
        this.clipPosition.height = data.height - dy;
      } else if (n.indexOf("s") != -1) {
        if (h < 0) {
          this.clipPosition.y = data.y + h;
          this.clipPosition.height = -h;
        } else {
          this.clipPosition.y = data.y;
          this.clipPosition.height = h;
        }
      }
      if (n.indexOf("w") != -1) {
        this.clipPosition.x = data.x + dx;
        this.clipPosition.width = data.width - dx;
      } else if (n.indexOf("e") != -1) {
        if (w < 0) {
          this.clipPosition.x = data.x + w;
          this.clipPosition.width = -w;
        } else {
          this.clipPosition.x = data.x;
          this.clipPosition.width = w;
        }
      }
      //
      this.drawClip();
    },
    //clip init =========================================================
    showClip : function() {
      this.hideClip();
      //
      var cpop = this.getClipOption();
      var rect = this.coordinate.rect;
      this.clipName = this.option.className + "_main_clip";
      //init clip ========
      this.svg_main_clip = $(this.renderer.create(S.SVG, {
        "class" : this.clipName,
        overflow : S.HIDDEN,
        x : rect.left,
        y : rect.top,
        width : rect.width,
        height : rect.height
      }, this.svg_main));
      //
      var gd = NS.SVG.getElementData;
      //
      this.svg_main_clip_outer = this.renderer.drawPolygon(gd(cpop.outer, {
        //cursor : NS.Cursor.crop,
        "class" : this.clipName + "_outer"
      }), this.svg_main_clip);
      //
      this.svg_main_clip_inner = this.renderer.drawRect(gd(cpop.inner, {
        cursor : NS.Cursor.grab,
        "class" : this.clipName + "_inner"
      }), this.svg_main_clip);
      //
      this.svg_main_clip_crop = this.renderer.drawGroup({
        "class" : this.clipName + "_crop"
      }, this.svg_main_clip);
      //crop list
      for ( var n in this.clipCropInfo) {
        var d = {
          "class" : this.clipName + "_crop_" + n,
          cursor : n + "-resize"
        };
        if (n.length == 1) {
          d.opacity = 0;
        }
        this.clipCropInfo[n] = this.renderer.drawLine(gd(cpop.crop, d), this.svg_main_clip_crop);
      }
      //list main
      if (!this.clipList) {
        this.clipList = new NS.Tips(this.container);
      }
      if (!this.clipPane) {
        this.clipPane = new NS.ScrollPane(cpop.scrollpane);
      }
      var clsn = this.clipName + "_list";
      this.clipListMain = $('<div class="' + clsn + '_html clearfix"></div>');
      this.clipListHead = $(S.DIV).addClass(clsn + "_head chart_list_head clearfix").appendTo(this.clipListMain);
      this.clipListBody = $(S.DIV).addClass(clsn + "_body chart_list_body clearfix").appendTo(this.clipListMain);
      //bt_send
      var bt_send = $(S.DIV).addClass(clsn + "_bt_send floatrt").appendTo(this.clipListHead);
      new NS.Icon({
        container : bt_send,
        width : 25,
        height : 20,
        scalemode : 2,
        data : "sendout"
      });
      this.clipPane.appendTo(this.clipListBody);
      //draw default ========
      this.clipPosition = cpop.position;
      this.drawClip();
      this.clipComplete();
      return this;
    },
    hideClip : function() {
      if (this.svg_main_clip) {
        this.svg_main_clip.remove();
        this.svg_main_clip = null;
      }
      this.hideClipList();
    },
    //draw clip =========================================================
    drawClip : function() {
      var cpop = this.getClipOption();
      var rect = this.coordinate.rect;
      var pw = rect.width;
      var ph = rect.height;
      //
      var pos = this.clipPosition;
      //position fixing
      var clamp = T.clamp;
      var w = pos.width;
      var h = pos.height;
      var x = clamp(pos.x, 0, pw - w);
      var y = clamp(pos.y, 0, ph - h);
      if (w < 0) {
        w = -w;
        x = x - w;
      }
      if (h < 0) {
        h = -h;
        y = y - h;
      }
      //
      this.clipPosition = {
        x : x,
        y : y,
        width : w,
        height : h
      };
      //draw area fixing
      w -= 1;
      w = clamp(w, 1, pw - 1);
      h -= 1;
      h = clamp(h, 1, ph - 1);
      //
      var a = NS.SVG.attr;
      var p = NS.SVG.point;
      //back
      var bps = [p(0, 0), p(pw, 0), p(pw, ph), p(0, ph), p(0, 0), p(x, y), p(x, y + h), p(x + w, y + h), p(x + w, y), p(x, y)];
      a(this.svg_main_clip_outer, {
        points : bps.join(S.SPACE)
      });
      //
      a(this.svg_main_clip_inner, {
        x : x + 0.5,
        y : y + 0.5,
        width : w,
        height : h
      });
      //crop list
      var c = NS.SVG.getElementData(cpop.crop);
      var l = c["stroke-width"] || 6;
      var r = l * 0.5;
      for ( var n in this.clipCropInfo) {
        var d = {
          x1 : x,
          y1 : y,
          x2 : x,
          y2 : y
        };
        if (n == "n") {
          d.x2 += w;
        } else if (n == "s") {
          d.y1 += h;
          d.x2 += w;
          d.y2 += h;
        } else if (n == "w") {
          d.y2 += h;
        } else if (n == "e") {
          d.x1 += w;
          d.x2 += w;
          d.y2 += h;
        } else if (n == "nw") {
          d.x1 -= r;
          d.x2 += r;
        } else if (n == "ne") {
          d.x1 += w - r;
          d.x2 += w + r;
        } else if (n == "sw") {
          d.x1 -= r;
          d.y1 += h;
          d.x2 += r;
          d.y2 += h;
        } else if (n == "se") {
          d.x1 += w - r;
          d.y1 += h;
          d.x2 += w + r;
          d.y2 += h;
        }
        a(this.clipCropInfo[n], d);
      }
    },
    //clip list =========================================================
    showClipList : function() {
      var clsn = this.clipName + "_list";
      var cpop = this.getClipOption();
      //clip data ===============================================
      //clear           
      this.clipPane.empty();
      //create
      var main = $(S.DIV).addClass(clsn + "_main chart_list_main").unselectable();
      var dataList = this.getClipData();
      if (!dataList || !dataList.length) {
        main.html("No results");
      } else {
        var len = dataList.length;
        var l = len.toString().length;
        for ( var i = 0; i < len; i++) {
          var data = dataList[i];
          if (!data) {
            continue;
          }
          var name = data.name;
          if (len > 1) {
            name = T.zero(i + 1, l) + ", " + name;
          }
          var code = data.code;
          if (!code) {
            code = "N/A";
          }
          var item = $(S.DIV).addClass(clsn + "_item chart_list_item clearfix").attr({
            id : data.id,
            title : name
          });
          $(S.DIV).addClass(clsn + "_linert chart_list_itemrt floatrt").html(code).appendTo(item);
          $(S.DIV).addClass(clsn + "_linelt chart_list_itemlt floatlt").html(name).appendTo(item);
          main.append(item);
          if (i < len - 1) {
            $(S.DIV).addClass(clsn + "_line chart_list_line").appendTo(main);
          }
        }
      }
      this.clipPane.append(main);
      //events ==================================================
      var self = this;
      this.clipPane.find(".chart_list_item").bind([E.MOUSEENTER, E.MOUSELEAVE].join(S.SPACE), function(e) {
        var dom = $(e.target);
        var id = dom.attr(S.ID);
        if (id && e.type === E.MOUSELEAVE) {
          //hover out using empty id
          id = "";
        }
        self.send(E.ITEM_HOVER, id);
      });
      //
      //draw=====================================================
      var option = $.extend(true, {}, cpop.list, {
        className : clsn,
        delay : 0,
        animation : null,
        data : this.clipListMain
      });
      //target and holder
      var rect = this.coordinate.rect;
      var offset = this.container.offset();
      //
      var pos = this.clipPosition;
      var target = {
        x : pos.x,
        y : pos.y,
        width : pos.width,
        height : T.clamp(pos.height, 0, option.minHeight)
      };
      target.x += rect.left + offset.left;
      target.y += rect.top + offset.top;
      //
      option.target = target;
      option.holder = {
        exact : true,
        x : rect.left + offset.left,
        y : target.y,
        width : rect.width,
        height : rect.height
      };
      //
      var pane = this.clipPane;
      this.clipList.unbind().bind(E.DRAW_UPDATE, function(e, d) {
        //require get dom width and height
        //draw the scrollbar after append to document body 
        pane.draw();
      }).show(option);
      //update shadow by arrow type
      var shadow = "5px 5px 5px rgba(0,0,0,0.3)";
      if (this.clipList.data.type == S.LEFT) {
        shadow = "-" + shadow;
      }
      this.clipList.main.css({
        "box-shadow" : shadow
      });
      return this;
    },
    hideClipList : function() {
      if (this.clipList) {
        this.clipList.hideNow();
      }
    }
  };
  //=====================================================================================
  /**
   * @constructor
   * @param container
   * @returns {NS.InfoBar}
   */
  NS.InfoBar = function(container) {
    this.dispather = $(this);
    this.events = E;
    this.style = this.defaultStyle();
    this.option = this.defaultOption();
    // container
    this.container = $(container);
    if (!this.container.length) {
      throw new Error(this + " require a container");
    }
    /*
     * initialize
     */
    this.init();
  };
  NS.InfoBar.prototype = {
    VERSION : "1.0.130227A",
    defaultStyle : function() {
      return {
        main : {
          border : "1px solid #999999",
          "border-radius" : "10px"
        },
        list : {},
        item : {
          cursor : "pointer",
          padding : "0px 10px",
          "font-size" : "14px",
          "text-align" : "center"
        },
        spacer : {
          height : "14px",
          width : "1px",
          margin : "3px 0px",
          overflow : S.HIDDEN,
          background : "#999999"
        }
      };
    },
    defaultOption : function() {
      return {
        className : "infobar",
        id : "inforbar",
        height : 20,
        widthmode : S.AUTO
      };
    },
    init : function() {
      this.main = $(S.DIV).appendTo(this.container);
      var self = this;
      this.main.unbind().bind([E.MOUSEOVER, E.MOUSEOUT, E.CLICK, E.DBLCLICK, E.MOUSEENTER, E.MOUSELEAVE].join(S.SPACE), function(e) {
        var elem = $(e.target);
        var id = elem.attr(S.ID);
        if (id) {
          e.id = id;
        }
        var isItem = false;
        if (elem.hasClass(self.option.className + "_item")) {
          isItem = true;
        }
        //
        if (e.type === E.MOUSEOVER) {
          if (isItem) {
            self.send(E.ITEM_OVER, e);
          }
        } else if (e.type === E.MOUSEOUT) {
          if (isItem) {
            self.send(E.ITEM_OUT, e);
          }
        } else if (e.type === E.CLICK) {
          if (isItem) {
            self.send(E.ITEM_CLICK, e);
          }
          self.send(E.MAIN_CLICK, e);
        } else if (e.type === E.DBLCLICK) {
          if (isItem) {
            self.send(E.ITEM_DBLCLICK, e);
          }
          self.send(E.MAIN_DBLCLICK, e);
        } else if (e.type === E.MOUSEENTER) {
          self.send(E.MAIN_OVER, e);
        } else if (e.type === E.MOUSELEAVE) {
          self.send(E.MAIN_OUT, e);
        }
      });
      this.list = $(S.DIV).appendTo(this.main);
      return this;
    },
    /*
     * draw
     */
    drawMain : function() {
      var clsn = this.option.className;
      this.main.removeClass().addClass(clsn).css(this.style.main);
      //
      this.width = this.container.width();
      this.height = this.option.height;
      this.list.empty().addClass(clsn + "_list clearfix").css(this.style.list);
      var len = this.data.length;
      if (!len) {
        return this;
      }
      var itemWidthPercent = Math.floor(100 / len) + "%";
      for ( var i = 0; i < len; i++) {
        var data = this.data[i];
        if (!data) {
          continue;
        }
        var item = $(S.DIV).addClass(clsn + "_item floatlt").attr(S.ID, data.id).appendTo(this.list);
        item.append(data.label || "");
        var itemStyle = this.getDataStyle(item, "item", {
          height : this.height,
          "line-height" : this.height + "px"
        });
        if (this.option.widthmode == S.AUTO) {
          itemStyle.padding = 0;
          itemStyle.margin = 0;
          itemStyle.width = itemWidthPercent;
        }
        item.css(itemStyle);
        if (i < len - 1) {
          $(S.DIV).addClass(clsn + "_spacer floatlt").css(this.style.spacer).appendTo(this.list);
        }
      }
      return this;
    },
    /*
     * using for alert(ClassName) print info
     */
    toString : function() {
      return "[object InfoBar]";
    }
  };
  NS.InfoBar.prototype = $.extend(new NS.ChartBase(), NS.InfoBar.prototype);
  //====================================================================================================
  /**
   * @constructor
   * @param container
   * @returns {NS.Loading}
   */
  NS.Loading = function(container) {
    // container
    this.body = document.body;
    this.container = $(container || this.body);
    if (!this.container.length) {
      throw new Error(this + " require a container");
    }
    this.option = this.defaultOption();
    /*
     * initialize
     */
    this.init();
  };
  //TODO error icon
  NS.Loading.prototype = {
    VERSION : "1.0.120703A",
    option : null,
    visible : true,
    defaultOption : function() {
      return {
        className : "chart_loading",
        zIndex : 99999,
        text : "",
        top : 0,
        left : 0,
        width : 16,
        height : 16,
        scalemode : 1,
        style : {
          color : "#cccccc",
          stroke : "#cccccc",
          opacity : 0.8
        }
      };
    },
    init : function() {
      var op = this.option;
      this.graph = $(S.DIV).addClass(op.className).css({
        width : 0,
        height : 0,
        padding : 0,
        margin : 0,
        //must be top and left, no scroll bar
        top : -1080,
        left : -1920,
        "z-index" : op.zIndex,
        "pointer-events" : S.NONE,
        position : S.ABSOLUTE
      }).appendTo(this.container);
      this.main = $(S.DIV).css({
        padding : 0,
        margin : 0,
        position : S.ABSOLUTE
      }).appendTo(this.graph);
      //
      this.renderer = new NS.Renderer(S.SVG);
      this.svg_root = this.renderer.init(this.option.width, this.option.height);
      NS.SVG.attr(this.svg_root, {
        "pointer-events" : S.NONE
      });
      this.main.append(this.svg_root);
      //
      this.text = $(S.DIV).css({
        padding : 0,
        margin : 0,
        overflow : S.HIDDEN,
        "white-space" : "nowrap",
        position : S.ABSOLUTE
      }).appendTo(this.main);
      return this;
    },
    info : function(text) {
      if (text) {
        var op = this.option;
        var tw = op.width;
        var th = op.height;
        this.text.html(text).css({
          left : tw + 2,
          top : 0,
          height : th,
          color : op.style.color,
          "line-height" : th + "px"
        }).show();
      } else {
        this.text.hide().empty();
      }
    },
    show : function() {
      clearInterval(this.timeval);
      this.visible = true;
      //=============================================
      var op = this.option;
      if (arguments.length && arguments[0]) {
        var new_option = arguments[0];
        var old_option = this.defaultOption();
        if (arguments[1]) {
          old_option = this.option;
        }
        op = $.extend(true, old_option, new_option);
      }
      this.option = op;
      //=============================================
      this.graph.removeClass().addClass(op.className).css({
        "z-index" : op.zIndex
      });
      //
      var tw = op.width;
      var th = op.height;
      this.renderer.setSize(tw, th);
      //
      var ox = tw * 0.5;
      var oy = th * 0.5;
      this.translate = NS.SVG.translate(ox, oy);
      //
      var pathData = NS.SVG.getElementData(op.style, {
        color : null,
        transform : this.translate
      });
      if (!pathData.d) {
        var arr = [];
        var p = NS.SVG.point;
        var ro = Math.min(ox, oy);
        var ri = ro * 0.5;
        var num = 12;
        var len = 360 / num;
        for ( var i = 0; i < num; i++) {
          var r = (i * len) * Math.PI / 180;
          var xi = ri * Math.sin(r);
          var yi = ri * Math.cos(r);
          var xo = ro * Math.sin(r);
          var yo = ro * Math.cos(r);
          var s = "M" + p(xi, yi) + "L" + p(xo, yo);
          arr.push(s);
        }
        var d = arr.join(S.SPACE);
        //
        pathData.d = d;
      }
      if (this.svg_path) {
        NS.SVG.attr(this.svg_path, pathData);
      } else {
        this.svg_path = this.renderer.drawPath(pathData, this.svg_root);
      }
      //
      this.info(op.text);
      //
      this.graph.css({
        left : op.left,
        top : op.top
      }).show();
      //
      this.rotation = 0;
      var self = this;
      this.timeval = setInterval(function() {
        self.update();
      }, 50);
      return this;
    },
    update : function() {
      this.rotation += 5;
      if (this.rotation > 360) {
        this.rotation -= 360;
      }
      var rotate = NS.SVG.rotate(this.rotation);
      NS.SVG.attr(this.svg_path, {
        transform : this.translate + S.SPACE + rotate
      });
    },
    hide : function() {
      clearInterval(this.timeval);
      this.visible = false;
      this.graph.hide();
      return this;
    },
    remove : function() {
      this.hide();
      this.graph.unbind().empty().remove();
    },
    toString : function() {
      return "[object Loading]";
    }
  };
  //Singleton
  NS.Loading.getInstance = function(singleton, _container) {
    singleton = "instanceLoading" + (singleton || "");
    if (!NS[singleton]) {
      NS[singleton] = new NS.Loading(_container);
    }
    return NS[singleton];
  };
  //delete a instance
  NS.Loading.delInstance = function(singleton) {
    singleton = "instanceLoading" + (singleton || "");
    if (NS[singleton]) {
      NS[singleton].remove();
      delete NS[singleton];
    }
  };
  /**
   * return everything for require
   */
  return NS;
});