var net = require('net');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var server = net.createServer((socket) => {
    console.log("judge connection");
    socket.on('data', (data) => {
        data = JSON.parse(data.toString());
        console.log(data);
        var host = data["ip"];
        var port = data["port"] + 1;
        var client = new net.Socket();
        client.connect(port, host, () => {
            client.write(JSON.stringify(data));
            client.destroy();
        });
       
    })
})

server.listen(9000, '127.0.0.1', () => { console.log("Judge : ", server.address()) });