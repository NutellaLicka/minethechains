const blockAmount = document.getElementById('blockAmount');
var blockHash = '03903b52098d328706126cfd677c099b1b18454320367dcc6b647bcbedee690f';

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
//request.open('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=komodo&vs_currencies=btc&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true');
//request.open('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=komodo&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true');
//ARRR to USD https://api.coingecko.com/api/v3/simple/price?ids=pirate-chain&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true
//ARRR to BTC https://api.coingecko.com/api/v3/simple/price?ids=pirate-chain&vs_currencies=btc&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true

request.open('GET', 'https://kmdexplorer.io/insight-api-komodo/block/'+blockHash+'');

request.onload = function coingeckoAPI() {
//  Begin accessing JSON data here
  var dataa = JSON.parse(this.response);
//   Log each kmd to btc price
  if (request.status >= 200 && request.status < 400) {
//    document.getElementById("komodoHash").innerHTML = "BTC/KMD Price: " + dataa.komodo.btc + "BTC, 24hr Volume: " + dataa.komodo.btc_24h_vol;
//    document.getElementById("komodoHash").innerHTML = "BTC/USD Price: " + dataa.komodo.usd + "BTC, 24hr Volume: " + dataa.komodo.usd_24h_vol;
    document.getElementById("komodoHash").innerHTML = "EXPLORER API, block hash= " + dataa.hash;

  } else {
    document.getElementById("komodoHash").innerHTML = "???";
  }

};

//Send request
request.send();