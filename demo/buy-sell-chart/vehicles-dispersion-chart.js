define(function(require){
	require("css!mr-vehicles-dispersion-chart/css/vehicles-dispersion-chart.css");
	var $ = require("M4jquery");
	var ChartCore = require("M4chart/chartcore");		

	var E = {
		ICON_CLICK : "icon_click",
		ICON_OVER : "icon_over",
		ICON_OUT : "icon_out",
		BACK_CLICK : "back_click",
		MAIN_OVER : "main_over",
		MAIN_OUT : "main_out",
		MAIN_CLICK : "main_click",
		MAIN_DBLCLICK : "main_dblclick",
		MAIN_CONTEXTMENU : "main_contextmenu",
		AXIS_CLICK : "axis_click",
		MOVE_VALUE : "move_value",
		MOVE_INDEX : "move_index",
		DRILL_DOWN : "drill_down"
	};
	E = $.extend(ChartCore.E, E);
	var S = ChartCore.S;
	var T = ChartCore.T;
	var C = {};
	var colors = ['#B40021', '#FF5700', '#FFBD00', '#938700', '#008088', '#6483C8', '#1B229A'];//TODO
	var bottomHeight = 30;
 

	function createTempData(){
		
		var data = {
			axles : [{
					id : 'axle1',
					scales : [0, 2, 4, 6, 8, 10],
					title : 'Exp'
				}, {
					id : 'axle2',
					scales : [0, 20, 40, 60, 80, 100],
					title : 'Min Invest'
				}, {
					id : 'axle3',
					scales : [-5.0, 0, 5, 10, 15, 20],
					title : 'Cash'
				}, {
					id : 'axle4',
					scales : [-20, 16, 52, 88, 124, 160],
					title : 'Equity'
				}, {
					id : 'axle5',
					scales : [-25, 15, 55, 95, 135, 175],
					title : 'Bond'
				}

			],
			lines : [
					{
						id : '123-1',
						data : {
							'axle1' : 1,
							'axle2' : 80,
							'axle3' : -4,
							'axle4' : 100,
							'axle5' : 20
						}
					}, 
					{
						id : '123-2',
						data : {
							'axle1' : 2,
							'axle2' : 36,
							'axle3' : 0,
							'axle4' : 0,
							'axle5' : 60
						}
					}, 
					{
						id : '123-3',
						data : {
							'axle1' : 5,
							'axle2' : 55,
							'axle3' : 11,
							'axle4' : 30,
							'axle5' : -18
						}
					}, 
					{
						id : '123-4',
						data : {
							'axle1' : 8,
							'axle2' : 77,
							'axle3' : -3,
							'axle4' : -15,
							'axle5' : 100
						}
					}, 
					{
						id : '123-5',
						data : {
							'axle1' : 4,
							'axle2' : 10,
							'axle3' : 15,
							'axle4' : 150,
							'axle5' : 160
						}
					}, 
					{
						id : '123-6',
						data : {
							'axle1' : 9,
							'axle2' : 60,
							'axle3' : 17,
							'axle4' : 110,
							'axle5' : 156
						}
					}

			]
		};
 
		return data;
	} 

//   
	function convertCoordinate(svg, x, y) {//transformToSvgCoordinate
		var a = svg.getScreenCTM();
		var svgX = a.e;
		var svgY = a.f;

		var screenX = x;
		var screenY = y;
		return {
			x : screenX - svgX,
			y : screenY - svgY
		};
	}


	var VehiclesDispersionChart = function($container){
		this.container = $container;
		this.width = this.container.width();
		this.height = this.container.height() - bottomHeight;
		//this.offset = this.container.offset();
		this.axles = {};
		this.init();
		this.lines = [];	
	};
	VehiclesDispersionChart.prototype = {
		init : function(){
			var self = this;
			this.container.empty().css({
				position : S.RELATIVE
			});
			// main graph =====================================================
			// using for export, do NOT append any other elements to graph
			this.graph = $(S.DIV).unselectable().css({
				position : S.ABSOLUTE
			}).appendTo(this.container);
			// SVG ============================================================
			// graph renderer, using SVG
			this.renderer = new ChartCore.Renderer(S.SVG);
			this.svg_root = this.renderer.init(this.width, this.height);
			//background ======================================================
			this.svg_back = $(this.renderer.drawGroup({}, this.svg_root));
			//coordinate ======================================================
			this.svg_coordinate = $(this.renderer.drawGroup({}, this.svg_root));
			this.coordinate = new ChartCore.Coordinate(this);
			//main =============================================================
			this.svg_main = $(this.renderer.drawGroup({}, this.svg_root));
			this.graph.append(this.svg_root);
			this.addBottomPanel();
			return this;
		},

		addBottomPanel : function(){
			var $panel = this.$bottomPanel = $("<div class='mr-vd-chart-bottom'></div>");
			$panel.css('top',this.height);
			this.container.append($panel);
		},

		setData : function(data){
			this.data = createTempData();
			this.draw();
		},
		
		draw : function(){
			this.drawAxles();
			this.drawLines();
		},
		drawAxles : function(){
		
			var axleGroup = this.renderer.drawGroup({
				'class' : 'mr-vd-chart-cols',
			}, this.svg_root);

			
			var x = 0;
			var bgColors = ['#F2F2F2', 'none'];
			var axles = this.data.axles;
			var w = this.width / axles.length;
			for(var i=0; i<axles.length; i++){
				var axleData = axles[i];
				var scales = axleData.scales;
				var opt = {
					renderer : this.renderer,
					parent : axleGroup,
					width : w,
					bgcolor : bgColors[i%2],
					transformX : x,
					height : this.height,
					style : "cursor: crosshair;",
					min : scales[0],
					max : scales[scales.length-1],
					scaleWidth : 30,
					scaleOpacity : 0.9,
					scaleStroke : 2,
					scaleColor : 'red',
					scaleData : scales,
					data : scales,//TODO
					title : axleData.title
				};
				var axle = new Axle(this, opt);
				axle.draw();
				this.axles[axleData.id] = axle;
				x = x+w;
			}

		},
		drawLines : function(){
			this.lines = {};
			var lineGroup = this.renderer.drawGroup({
				'class' : 'mr-vd-chart-lines',
			}, this.svg_root);

			var linesData = this.data.lines;
			var len = linesData.length;
			for(var i=0; i<len; i++){
				var line = new Line(this, linesData[i]);
				line.draw();
			}	
		},
		bindEvent : function(){
			var $svg = $(this.svg_root);
			//disable default drag and drop event
	 		$svg.bind("drop drag dragstart dragend dragenter dragleave dragover", function(e) {
				return false;
			});
		},

	};
	var Line = function(chart, data){
		this.data = data;
		this.chart = chart;
	};
	Line.prototype = {
		draw : function(){
			var axles = this.chart.axles;
			var data = this.data.data;
			var renderer = this.chart.renderer;
			var color = 'red', clazz = 'clazz'; //TODO
			for(var p in data){
				if(data.hasOwnProperty(p)){
               		 var value = data[p], axle = axles[p];
               		 var axleIndex = axle.index;
               		 var y = convertValueToY(value, axle);
               		 var x = null;//
               		
               		 this._drawAxleScaleLine(renderer, axle, color, y);
				}
			}
		},
		_drawAxleScaleLine : function(renderer, axle, color, y){
			var w = axle.scaleWidth;
			renderer.drawLine({
				x1 : axle.width,
				y1 : y,
				x2 : axle.width - w,
				y2 : y,	
			//	'class' : clazz, TODO
				opacity : axle.scaleOpacity,
				'stroke-width' : axle.scaleStroke,
				stroke : color,
				fill : color
			}, axle.rootDom);
		}
	};
	var Axle = function(chart, opt){
		this.chart = chart;
		this.paddingTop = 30; //TODO
		this.title = opt.title;
		this.renderer = opt.renderer;
		this.scaleData = opt.scaleData || [];
		this.scaleOpacity = opt.scaleOpacity;
		this.scaleStroke = opt.scaleStroke;
		this.data = opt.data || [];
		this.min = opt.min;
		this.max = opt.max;
		this.rate = -1;
		this.width = opt.width;
		this.scaleWidth = opt.scaleWidth;
		this.bgcolor = opt.bgcolor;
		this.transformX  = opt.transformX;
		this.height = opt.height - this.paddingTop; //pixel TODO
		this.parent = opt.parent;
		this.filterMin = this.min;
		this.filterMax = this.max;
		this.rootDom = null;
		this.calcMinMaxAndRate();
	};
	Axle.prototype = {
		calcMinMaxAndRate : function(){
			if(!this.scaleData || !this.scaleData.length || this.min === undefined || this.max === undefined){
				return;
			}
			var len = this.scaleData.length;
			this.min = this.scaleData[0]<this.min? this.scaleData[0]: this.min;
			this.max = this.scaleData[len - 1]>this.max? this.scaleData[len - 1]: this.max;
			this.rate = (this.max - this.min) / this.height;
		},
	 
		draw : function(){
			//draw parent
			var colG = this.rootDom = this.renderer.drawGroup({
					"class" : "mr-vd-chart-col",
					transform : 'translate(' + this.transformX + ',' + 0 + ')'
				}, this.parent);
				var colBG = this.renderer.drawRect({
					"class" : "mr-vd-chart-col-bg",
					y : 0,
					height : this.height + this.paddingTop,
					x : 0,
					width : this.width,
					style : "cursor: crosshair;",
					fill : this.bgcolor
			}, colG);

			this.drawScale();
			this.drawFilter();
			this.drawBottom();
		},
		drawBottom : function(){
			var gap = 3;
			var w = this.width - gap;
			var $bottom = $("<div class='mr-vd-chart-bottom-axle'></div>");
			$bottom.text(this.title);
			$bottom.css('left', this.transformX).width(w);
			this.chart.$bottomPanel.append($bottom);
		},
		drawScale : function(){
			var scaleData = this.scaleData;
			var x = this.width;
			var renderer = this.renderer;
			for(var i=0; i<scaleData.length; i++){
				var y = this._convertValueToY(scaleData[i]);
				renderer.drawText({
					x : x,
					y : y,
					//'class' : 'label',
					'text-anchor' : 'end'
				}, this.rootDom, scaleData[i]);
			}
			this.drawMinMaxScale();
		},

		drawFilter : function(){

		},
		drawMinMaxScale : function(){

		},
		_convertValueToY : function(value){
			var relativeValue = value - this.min;
			var y = this.height - relativeValue/this.rate + this.paddingTop;
			return y;
		}
	};

	function convertValueToY(value, axle){
			var relativeValue = value - axle.min;
			var y = axle.height - relativeValue/axle.rate + axle.paddingTop;
			return y;
	}

	VehiclesDispersionChart.prototype = $.extend(new ChartCore.ChartBase(), VehiclesDispersionChart.prototype);
	VehiclesDispersionChart.prototype.constructor = VehiclesDispersionChart;
	return VehiclesDispersionChart;
});

