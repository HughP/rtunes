var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8081);

function handler (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end('Hello, world!');
}

io.configure('development', function() {
  io.set('log level', 1);

  io.set('transports', [ 'websocket' ]);
});

io.sockets.on('connection', function (socket) {
    console.log('connection established');

    var readStream = fs.createReadStream("/songs/1.mp3", 
                                         {'flags': 'r',
                                          'encoding': 'binary', 
                                          'mode': 0666, 
                                          'bufferSize': 64 * 1024});
    readStream.on('data', function(data) {
        console.log(typeof data);
        console.log('sending chunk of data')
        socket.send(data);
    });

    socket.on('disconnect', function () {
        console.log('connection droped');
    });
});

console.log('Server running at http://127.0.0.1:8081/');