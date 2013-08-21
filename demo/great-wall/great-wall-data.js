/**
 * Great Wall Mock Data
 * @authors Matthew zhong (flowerszhong@gmail.com)
 * @date    2013-08-20 11:01:12
 * @version $Id$
 */

(function(window, undefined) {
	var _dateRange = [Date.parse(new Date("2008-01-01")), Date.now()];

	function _buildData() {

		var data = [];

		var range = _dateRange;
		var _month = 86400 * 1000 * 30;
		var _quater = _month * 3;
		for (var i = range[0]; i < range[1]; i = i + _quater) {
			var item = {
				"date": i,
				"y" : randomRange(1,100)
			}
			data.push(item);
		};

		console.log(JSON.stringify(data));
		return data;
	};

	function randomRange(start, end) {
		return start + parseInt((end - start) * Math.random());
	}

	window.mockdata = _buildData();
})(this);