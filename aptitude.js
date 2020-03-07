var net = require('net');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var server = net.createServer((socket) => {
	socket.pipe(socket);
	console.log("connection : ", socket.remoteAddress+" : " + socket.remotePort );
	socket.write("application recieved \n");
	socket.on('error' , (err) => { console.log(err) })
	setTimeout(() => {
		var data = {
			"type":"scores",
			"score":"some random",
			"rounds": [],
			"ip": socket.remoteAddress,
			"port": socket.remotePort
		}
		var rounds = checkStatus();
		while(true){
			if(rounds!="none"){
				break;
			}
			console.log("recheck")
			rounds = checkStatus();
		}
		console.log(rounds);
		if(rounds == "R1"){
			// data["rounds"].push("R2");
			// data["rounds"].push("R3");
			var client = new net.Socket();
			client.connect(8001, '127.0.0.1',() => {
				console.log("writing data to R1");
				client.write(JSON.stringify(data));
				client.destroy();
				socket.destroy();
			});
			
		} else if(rounds == "R2"){
			// data["rounds"].push("R3");
			// data["rounds"].push("R1");
			var client = net.Socket();
			client.connect(8002, '127.0.0.1', function() {
				client.write(JSON.stringify(data));
				client.destroy();
				socket.destroy();
			});
		} else if(rounds == "R3"){
			// data["rounds"].push("R1");
			// data["rounds"].push("R2");
			var client = net.Socket();
			client.connect(8003, '127.0.0.1', function() {
				client.write(JSON.stringify(data));
				client.destroy();
				socket.destroy();
			});
		}
	},4000);
})

function checkStatus(){
	let isR1 = false;
	let isR2 = false;
	let isR3 = false;
	var client = new net.Socket();
	client.connect(8001, '127.0.0.1');
	client.on('data', (data) => {
		console.log(data.toString());
		data = JSON.parse(data.toString());
		if(data["busy"]==true){
			isR1 = false;
		} else {
			isR1 = true;
			return "R1";
		}
		client.end(); 
	})
	var data = {
		"type" : "beat"
	}
	client.write(JSON.stringify(data));
	// var client = new net.Socket();
	// client.connect(8002, '127.0.0.1', function() {
	// 	var data = {
	// 		"type" : "beat"
	// 	}
	// 	client.write(JSON.stringify(data));
	// });

	// client.on('data', function(data) {
	// 	data = JSON.parse(data);
	// 	if(data["busy"]==true){
	// 		isR2 = false;
	// 	} else {
	// 		isR2 = true;
	// 	}
	// 	client.destroy(); 
	// });
	// var client = new net.Socket();
	// client.connect(8003, '127.0.0.1', function() {
	// 	var data = {
	// 		"type" : "beat"
	// 	}
	// 	client.write(JSON.stringify(data));
	// });

	// client.on('data', function(data) {
	// 	data = JSON.parse(data);
	// 	if(data["busy"]==true){
	// 		isR3 = false;
	// 	} else {
	// 		isR3 = true;
	// 	}
	// 	client.destroy(); 
	// });
	// if(isR1){
		return "R1";
	// } else if(isR2){
	// 	return "R2";
	// } else if(isR3){
	// 	return "R3";
	// } else {
	// 	return "none";
	// }
}

server.listen(8000, '127.0.0.1',() => { console.log("aptitude : ", server.address()) });