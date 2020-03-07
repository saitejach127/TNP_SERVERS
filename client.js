var net = require('net');

var server = net.createServer((socket) => {
    socket.on('data',(data) => {
        console.log(data.toString());
        server.close();
    });
});

var client = new net.Socket()
client.connect(8000, '127.0.0.1', () => {
    console.log(client.address().port)
    server.listen(client.address().port +1, '127.0.0.1');
    client.on('data',(data) => {
        console.log(data.toString());
    })
});

