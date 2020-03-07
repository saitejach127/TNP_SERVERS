var net = require('net');

function blaa() {
    var client = net.Socket();
client.connect(8001, '127.0.0.1');
client.on('data', (data) => {
    console.log(data.toString());
})
var data = {
    "type" : "beat"
}
client.write(JSON.stringify(data));
}
blaa();