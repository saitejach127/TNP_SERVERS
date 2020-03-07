var net = require('net');
var isbusy = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var server = net.createServer((socket) => {
    // socket.pipe(socket);
    console.log("R1 conection");
    socket.on('data', (data) => {
        data = JSON.parse(data.toString());
        console.log(data);
        if(data["type"] == "beat"){
            console.log("Heart beat from : ", socket.remotePort);
            data = {
                "busy" : isbusy
            }
            socket.write(JSON.stringify(data));
            socket.destroy();
        } else {
            console.log("to judge");
            // isbusy = true;
            setTimeout(() => {
                if(data["rounds"].length == 0){
                    var client = new net.Socket();
                    client.connect(9000, '127.0.0.1', () => {
                        client.write(JSON.stringify(data));
                        client.destroy();
                    });
                }
            },4000);
            // isbusy = false;
        }
        
    })
})

server.listen(8001, '127.0.0.1', () => {
    console.log("R1 : ", server.address());
})