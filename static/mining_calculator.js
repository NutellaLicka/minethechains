	var _blocktime = 60; //seconds it.poolsConfigs[pool].blockTimeSeconds
	var _blockReward = 1; //need to change to whatever the coins BR is it.poolsConfigs[pool].blockRewardAmount
    var kmdBR = 3;
    var arrrBR = 128;
    var rfoxBR = 1;

	var _networkHashRate = parseFloat(networkSols) * 10000; //need to pull each coin network sol
	var _myHashRate = (totalHash / 1000000);
	var luckDays =  ((_networkHashRate / _myHashRate * _blocktime) / (24 * 60 * 60)).toFixed(3);
	//var miningCalc = _myHashRate/_networkHashRate * _blockReward * (86400 / _blocktime);

	var kmdminingCalc = _myHashRate/_networkHashRate * kmdBR * (86400 / _blocktime);
	var rfoxminingCalc = _myHashRate/_networkHashRate * arrrBR * (86400 / _blocktime);
	var arrrminingCalc = _myHashRate/_networkHashRate * rfoxBR * (86400 / _blocktime);
	var miningCalc = 20057.864363/1810824250000 * arrrBR * (86400 / _blocktime);

	stats.pools[pool].hashrate
	
	//var Ksum = theirHR/_kmdnetworkHashRate * kmdBR * (86400 / _blocktime);
	//var Asum = theirHR/_arrrnetworkHashRate * arrrBR * (86400 / _blocktime);
	//var Rsum = theirHR/_rfoxnetworkHashRate * rfoxBR * (86400 / _blocktime);	
	//document.getElementById("KMDoutput").innerHTML = Ksum;
	//document.getElementById("ARRRoutput").innerHTML = Asum;
	//document.getElementById("RFOXoutput").innerHTML = Rsum;

    
	$("#kmdMiningCalc").text(kmdminingCalc.toFixed(2));
	$("#rfoxMiningCalc").text(rfoxminingCalc.toFixed(2));
	$("#arrrMiningCalc").text(arrrminingCalc.toFixed(2));
	$("#NWSols").text(miningCalc.toFixed(2));