var workerHashrateData;
var workerHashrateChart;
var workerHistoryMax = 160;

var statData;
var totalHash;
var totalImmature;
var totalBal;
var totalPaid;
var totalShares;

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

function getWorkerNameFromAddress(w) {
	var worker = w;
	if (w.split(".").length > 1) {
		worker = w.split(".")[1];
		if (worker == null || worker.length < 1) {
			worker = "noname";
		}
	} else {
		worker = "noname";
	}
	return worker;
}

function buildChartData(){
    var workers = {};
	for (var w in statData.history) {
		var worker = getWorkerNameFromAddress(w);
		var a = workers[worker] = (workers[worker] || {
			hashrate: []
		});
		for (var wh in statData.history[w]) {
			a.hashrate.push([statData.history[w][wh].time * 1000, statData.history[w][wh].hashrate]);
		}
		if (a.hashrate.length > workerHistoryMax) {
			workerHistoryMax = a.hashrate.length;
		}
	}
	
	var i=0;
    workerHashrateData = [];
    for (var worker in workers){
        workerHashrateData.push({
            key: worker,
			//disabled: (i > Math.min((_workerCount-1), 3)),
			disabled: false,
            values: workers[worker].hashrate
        });
		i++;
	}

	//pools statData
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
    }
}

function updateChartData(){
    var workers = {};
	for (var w in statData.history) {
		var worker = getWorkerNameFromAddress(w);
		// get a reference to lastest workerhistory
		for (var wh in statData.history[w]) { }
		//var wh = statData.history[w][statData.history[w].length - 1];
		var foundWorker = false;
		for (var i = 0; i < workerHashrateData.length; i++) {
			if (workerHashrateData[i].key === worker) {
				foundWorker = true;
				if (workerHashrateData[i].values.length >= workerHistoryMax) {
					workerHashrateData[i].values.shift();
				}
				workerHashrateData[i].values.push([statData.history[w][wh].time * 1000, statData.history[w][wh].hashrate]);
				break;
			}
		}
		if (!foundWorker) {
			var hashrate = [];
			hashrate.push([statData.history[w][wh].time * 1000, statData.history[w][wh].hashrate]);
			workerHashrateData.push({
				key: worker,
				values: hashrate
			});
			rebuildWorkerDisplay();
			return true;
		}
	}
	triggerChartUpdates();
	return false;
}

function calculateAverageHashrate(worker) {
	var count = 0;
	var total = 1;
	var avg = 0;
	for (var i = 0; i < workerHashrateData.length; i++) {
		count = 0;
		for (var ii = 0; ii < workerHashrateData[i].values.length; ii++) {
			if (worker == null || workerHashrateData[i].key === worker) {
				count++;
				avg += parseFloat(workerHashrateData[i].values[ii][1]);
			}
		}
		if (count > total)
			total = count;
	}
	avg = avg / total;
	return avg;
}

function triggerChartUpdates(){
    workerHashrateChart.update();
}

function displayCharts() {
    nv.addGraph(function() {
        workerHashrateChart = nv.models.lineChart()
            .margin({left: 80, right: 30})
            .x(function(d){ return d[0] })
            .y(function(d){ return d[1] })
            .useInteractiveGuideline(true);

        workerHashrateChart.xAxis.tickFormat(timeOfDayFormat);

        workerHashrateChart.yAxis.tickFormat(function(d){
            return getReadableHashRateString(d);
        });
        d3.select('#workerHashrate').datum(workerHashrateData).call(workerHashrateChart);
        return workerHashrateChart;
    });
}

function pirateminingCalc() {
	var _blocktime = 60; //seconds it.poolsConfigs[pool].blockTimeSeconds
	var _blockReward = 1; //need to change to whatever the coins BR is it.poolsConfigs[pool].blockRewardAmount
    var kmdBR = 3;
    var arrrBR = 128;
    var rfoxBR = 1;

	var _networkHashRate = parseFloat(networkSols) * 10000; //need to pull each coin network sol
	var _myHashRate = (totalHash / 1000000);
	var luckDays =  ((_networkHashRate / _myHashRate * _blocktime) / (24 * 60 * 60)).toFixed(3);
	//var miningCalc = _myHashRate/_networkHashRate * _blockReward * (86400 / _blocktime);

	var pirateminingCalc = _myHashRate/_networkHashRate * arrrBR * (86400 / _blocktime);

	return pirateminingCalc
	
}

function updateStats() {
	totalHash = statData.totalHash;
	totalPaid = statData.paid;
	totalBal = statData.balance;
	totalImmature = statData.immature;
	totalShares = statData.totalShares;
	networkSols = statData.networkSols;
	whatpool = statData.pool;

	// do some calculations
	var _blocktime = 60; //seconds
	var _networkHashRate = parseFloat(statData.networkSols) * 1.2;
	var _myHashRate = (totalHash / 1000000) * 2;
	var luckDays =  ((_networkHashRate / _myHashRate * _blocktime) / (24 * 60 * 60)).toFixed(3);

	var miningCalc = ((totalHash / 1000000) * 2)/(statData.networkSols) * 128 * (86400 / 60);

	// update miner stats
	$("#statsHashrate").text(getReadableHashRateString(totalHash));
	$("#statsHashrateAvg").text(getReadableHashRateString(calculateAverageHashrate(null)));
	$("#statsLuckDays").text(luckDays);
	$("#statsTotalImmature").text(totalImmature);
	$("#statsTotalBal").text(totalBal);
	$("#statsTotalPaid").text(totalPaid);
	$("#statsTotalShares").text(totalShares.toFixed(2));

	$("#miningCalc").text(statData.pools[pool].hashrate); //miningCalc.toFixed(2)
}
function updateWorkerStats() {
	// update worker stats
	var i=0;
	for (var w in statData.workers) { i++;
		var htmlSafeWorkerName = w.split('.').join('_').replace(/[^\w\s]/gi, '');
		var saneWorkerName = getWorkerNameFromAddress(w);
		$("#statsHashrate"+htmlSafeWorkerName).text(getReadableHashRateString(statData.workers[w].hashrate));
		$("#statsHashrateAvg"+htmlSafeWorkerName).text(getReadableHashRateString(calculateAverageHashrate(saneWorkerName)));
		$("#statsLuckDays"+htmlSafeWorkerName).text(statData.workers[w].luckDays);
		$("#statsPaid"+htmlSafeWorkerName).text(statData.workers[w].paid);
		$("#statsBalance"+htmlSafeWorkerName).text(statData.workers[w].balance);
		$("#statsShares"+htmlSafeWorkerName).text(Math.round(statData.workers[w].currRoundShares * 100) / 100);
		$("#statsDiff"+htmlSafeWorkerName).text(statData.workers[w].diff);
	}
}
function addWorkerToDisplay(name, htmlSafeName, workerObj) {
	var htmlToAdd = "";
	htmlToAdd = '<div class="mobWorker"><div class="bannerWorkers"><div class="boxStats">';
	if (htmlSafeName.indexOf("_") >= 0) {
		htmlToAdd+= '<div class="boxLowerHeader">'+htmlSafeName.substr(htmlSafeName.indexOf("_")+1,htmlSafeName.length)+'</div>';
	} else {
		htmlToAdd+= '<div class="boxLowerHeader">noname</div>';
	}
	htmlToAdd+='<div class="infotext"><span id="statsHashrate'+htmlSafeName+'">'+getReadableHashRateString(workerObj.hashrate)+'</span> (Now)</div>';
	htmlToAdd+='<div class="infotext"><span id="statsHashrateAvg'+htmlSafeName+'">'+getReadableHashRateString(calculateAverageHashrate(name))+'</span> (Avg)</div>';
	htmlToAdd+='<div class="infotext"><small>Diff:</small> <span id="statsDiff'+htmlSafeName+'">'+workerObj.diff+'</span></div>';
	htmlToAdd+='<div class="infotext"><small>Shares:</small> <span id="statsShares'+htmlSafeName+'">'+(Math.round(workerObj.currRoundShares * 100) / 100)+'</span></div>';
	htmlToAdd+='<div class="infotext"><small>Luck <span id="statsLuckDays'+htmlSafeName+'">'+workerObj.luckDays+'</span> Days</small></div>';
	htmlToAdd+='<div class="infotext"><small>Bal: <span id="statsBalance'+htmlSafeName+'">'+workerObj.balance+'</span></small></div>';
	htmlToAdd+='<div class="infotext"><small>Paid: <span id="statsPaid'+htmlSafeName+'">'+workerObj.paid+'</span></small></div>';
	htmlToAdd+='</div></div></div>';
	$("#boxesWorkers").html($("#boxesWorkers").html()+htmlToAdd);
}

function rebuildWorkerDisplay() {
	$("#boxesWorkers").html("");
	var i=0;
	for (var w in statData.workers) { i++;
		var htmlSafeWorkerName = w.split('.').join('_').replace(/[^\w\s]/gi, '');
		var saneWorkerName = getWorkerNameFromAddress(w);
		addWorkerToDisplay(saneWorkerName, htmlSafeWorkerName, statData.workers[w]);
	}
}

// resize chart on window resize
nv.utils.windowResize(triggerChartUpdates);

// grab initial stats
$.getJSON('/api/worker_stats?'+_miner, function(data){
    statData = data;
	for (var w in statData.workers) { _workerCount++; }
	buildChartData();
	displayCharts();
	rebuildWorkerDisplay();	
	updateStats();
});

// live stat updates
statsSource.addEventListener('message', function(e){
	// TODO, create miner_live_stats...
	// miner_live_stats will return the same josn except without the worker history
	// FOR NOW, use this to grab updated stats
	$.getJSON('/api/worker_stats?'+_miner, function(data){
		statData = data;
		// check for missing workers
		var wc = 0;
		var rebuilt = false;
		// update worker stats
		for (var w in statData.workers) { wc++; }
		// TODO, this isn't 100% fool proof!
		if (_workerCount != wc) {
			if (_workerCount > wc) {
				rebuildWorkerDisplay();
				rebuilt = true;
			}
			_workerCount = wc;
		}
		rebuilt = (rebuilt || updateChartData());
		updateStats();
		if (!rebuilt) {
			updateWorkerStats();
		}
	});
});
