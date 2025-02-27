var poolHashrateData;
var poolHashrateChart;

var statData;
var poolKeys;

function buildChartData(){
    var pools = {};

    poolKeys = [];
    for (var i = 0; i < statData.length; i++){
        for (var pool in statData[i].pools){
            if (poolKeys.indexOf(pool) === -1)
                poolKeys.push(pool);
        }
    }

    for (var i = 0; i < statData.length; i++) {
        var time = statData[i].time * 1000;
		for (var f = 0; f < poolKeys.length; f++){
            var pName = poolKeys[f];
            var a = pools[pName] = (pools[pName] || {
                hashrate: []
            });
            if (pName in statData[i].pools){
                a.hashrate.push([time, statData[i].pools[pName].hashrate]);
            }
            else{
                a.hashrate.push([time, 0]);
            }
        }
    }

    poolHashrateData = [];
    for (var pool in pools){
       poolHashrateData.push({
            key: pool,
            values: pools[pool].hashrate
        });
		$('#statsHashrateAvg' + pool).text(getReadableHashRateString(calculateAverageHashrate(pool)));
    }
}

function calculateAverageHashrate(pool) {
    var count = 0;
    var total = 1;
    var avg = 0;
    for (var i = 0; i < poolHashrateData.length; i++) {
        count = 0;
        for (var ii = 0; ii < poolHashrateData[i].values.length; ii++) {
            if (pool == null || poolHashrateData[i].key === pool) {
                count++;
                avg += parseFloat(poolHashrateData[i].values[ii][1]);
            }
        }
        if (count > total)
            total = count;
    }
    avg = avg / total;
    return avg;
}

function getReadableHashRateString(hashrate){
	hashrate = (hashrate * 2);
	if (hashrate < 1000000) {
		return (Math.round(hashrate / 1000) / 1000 ).toFixed(2)+' Sol/s';
	}
    var byteUnits = [ ' Sol/s', ' KSol/s', ' MSol/s', ' GSol/s', ' TSol/s', ' PSol/s' ];
    var i = Math.floor((Math.log(hashrate/1000) / Math.log(1000)) - 1);
    hashrate = (hashrate/1000) / Math.pow(1000, i + 1);
    return hashrate.toFixed(2) + byteUnits[i];
}

function timeOfDayFormat(timestamp){
    var dStr = d3.time.format('%I:%M %p')(new Date(timestamp));
    if (dStr.indexOf('0') === 0) dStr = dStr.slice(1);
    return dStr;
}

function displayCharts(){
    nv.addGraph(function() {
        poolHashrateChart = nv.models.lineChart()
            .margin({left: 80, right: 30})
            .x(function(d){ return d[0] })
            .y(function(d){ return d[1] })
            .useInteractiveGuideline(true);

        poolHashrateChart.xAxis.tickFormat(timeOfDayFormat);

        poolHashrateChart.yAxis.tickFormat(function(d){
            return getReadableHashRateString(d);
        });

        d3.select('#poolHashrate').datum(poolHashrateData).call(poolHashrateChart);

        return poolHashrateChart;
    });
}

function triggerChartUpdates(){
    poolHashrateChart.update();
}

nv.utils.windowResize(triggerChartUpdates);

$.getJSON('/api/pool_stats', function(data){
    statData = data;
    buildChartData();
    displayCharts();
});

statsSource.addEventListener('message', function(e){
    var stats = JSON.parse(e.data);
    statData.push(stats);

    var newPoolAdded = (function(){
        for (var p in stats.pools){
            if (poolKeys.indexOf(p) === -1)
                return true;
        }
        return false;
    })();

    if (newPoolAdded || Object.keys(stats.pools).length > poolKeys.length){
        buildChartData();
        displayCharts();
    }
    else {
        var time = stats.time * 1000;
        for (var f = 0; f < poolKeys.length; f++) {
            var pool =  poolKeys[f];
            for (var i = 0; i < poolHashrateData.length; i++) {
                if (poolHashrateData[i].key === pool) {
                    poolHashrateData[i].values.shift();
                    poolHashrateData[i].values.push([time, pool in stats.pools ? stats.pools[pool].hashrate : 0]);
					$('#statsHashrateAvg' + pool).text(getReadableHashRateString(calculateAverageHashrate(pool)));
                    break;
                }
            }
        }
        triggerChartUpdates();
    }
});

$.getJSON('/api/blocks', function(data){
    var blocks = Object.values(data);
    var pools = Object.keys(data);

    /* go through all blocks listed on /api/blocks */
    for(var i = 0; i < blocks.length; i++) {
        var blocksobj = blocks[i].split(":");

    /*set the tx variable */
    var tx = blocksobj[1];
    };
    /*ERROR HERE FOR SOME FUCKING REASON*/
    document.getElementById(tx).innerHTML = "...";

    /*go through each block to check the pool then conduct the GET request*/
    for(var i = 0; i < pools.length; i++) {
            var pools1 = pools[i].split(":");
    }
    if (String(pools1).startsWith('komodo')) {
           // document.getElementById(tx).innerHTML = "kmd";
            //apiRequest.open('GET', 'https://kmdexplorer.io/insight-api-komodo/tx/'+tx+'');
    }
        else if (String(pools1).startsWith('redfox'))  {
            //document.getElementById(tx).innerHTML = "redfox";
            //apiRequest.open('GET', 'http://rfox.explorer.dexstats.info/insight-api-komodo/tx/'+tx+'');
        }
        else if (String(pools1).startsWith('pirate'))  {
            //document.getElementById(tx).innerHTML = "pirate";
            //apiRequest.open('GET', 'http://pirate.explorer.dexstats.info/insight-api-komodo/tx/'+tx+'');
        }
            else {
              //  document.getElementById(tx).innerHTML = "other";
            }




    // Create a request variable and assign a new XMLHttpRequest object to it.
    //var apiRequest = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    //apiRequest.open('GET', 'https://kmdexplorer.io/insight-api-komodo/tx/'+tx+'');
    
    //apiRequest.open('GET', 'https://kmdexplorer.io/insight-api-komodo/tx/'+tx+'');
    //apiRequest.addEventListener("error", transferFailed);
    //apiRequest.addEventListener("progress", updateProgress);
    //apiRequest.open('GET', 'http://rfox.explorer.dexstats.info/insight-api-komodo/tx/'+tx+'');

    //apiRequest.onload = function kmdExplorerAPI() {
        //Begin accessing JSON data here
   //     var data = JSON.parse(this.response);
     //   document.getElementById(tx).innerHTML = (parseFloat(data.vout[0].value).toFixed(2)); //blocks[1]    
    //};

    //Send request
    //apiRequest.send();
    
});

//progress and error outputs
//function updateProgress (oEvent) {
 //   document.getElementById(tx).innerHTML = "...";
//  };
  
 // function transferFailed(evt) {
 //   document.getElementById(tx).innerHTML = "???";
 // };