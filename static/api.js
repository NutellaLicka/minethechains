const blockAmount = document.getElementById('blockAmount');
var blockHash = '03903b52098d328706126cfd677c099b1b18454320367dcc6b647bcbedee690f';

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://kmdexplorer.io/insight-api-komodo/block/'+blockHash+'');

request.onload = function coingeckoAPI() {
//  Begin accessing JSON data here
  var dataa = JSON.parse(this.response);
//   Log each kmd to btc price
  if (request.status >= 200 && request.status < 400) {
    document.getElementById("blockAmount").innerHTML = "EXPLORER API, block hash= " + dataa.hash;

  } else {
    document.getElementById("blockAmount").innerHTML = "???";
  }

};

//Send request
request.send();