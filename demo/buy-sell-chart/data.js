(function(window, undefined) {
    var PORTFOLIOS = ["A", "B", "C", "D", "E", "F", "G",
            "H", "I", "J", "K", "L", "M", "N",
            "O", "P", "Q", "R", "S", "T",
            "U", "V", "W", "X", "Y", "Z"
    ];

    function _buildHoldings (PORTFOLIOS) {
        var ret = [];
        for (var i = PORTFOLIOS.length - 1; i >= 0; i--) {
            ret.push(PORTFOLIOS[i] + 1);
            ret.push(PORTFOLIOS[i] + 2);
            ret.push(PORTFOLIOS[i] + 3);
            ret.push(PORTFOLIOS[i] + 4);
            ret.push(PORTFOLIOS[i] + 5);
        };

        return ret;
    }
    var _HOLDINGS = _buildHoldings(PORTFOLIOS);

    var _dateRange = [508896000000, Date.now()],
        _valueRange = [0,100];


    function _buildData () {
        // var d = {
        //     "date" : _dateRange[1] - randomInt(),
        //     "value" : randomInt(120),
        //     "weight" : randomInt(100),
        //     "average1" : randomInt(150),
        //     "average2" : randomInt(100),
        //     "name" : _HOLDINGS[randomInt(126)],
        //     "type" : Math.random()>0.5 ? "Buy" : "Sell"
        // }

        var data = {
            average : [],//to be line
            buysell : []//to be circles
        }

        var range = _dateRange;
        var _month = 86400 * 1000 *30;
        var _quater = _month * 3;
        for (var i = range[0]; i <= range[1]; i = i+ _quater) {
            var _averageData = {
                "date" : i,
                "a1" : randomRange(400,440),
                "a2" : randomRange(300,340),
                "name" : _HOLDINGS[randomRange(0,126)]
            }
            data.average.push(_averageData);


            var j = randomRange(1,5);
            while(j>0){
                var _v = randomRange(100,480);
                var _d = {
                    "date" : i,
                    "weight" : randomRange(0,20),
                    "name" : _HOLDINGS[randomRange(0,126)],
                    "type" : Math.random()>0.5? "buy" : "sell",
                    "value" : _v,
                    "top" : _v < 460 ? _v + 20: 460,
                    "bottom" : _v > 40 ? _v - 20 : 20 
                }
                data.buysell.push(_d);
                j--;
            }

        };

        // console.log(JSON.stringify(data));
        return data;  
    };

    function randomRange (start,end){
        return start + parseInt((end - start) * Math.random());
    }

    window.mockdata = _buildData();
})(this);