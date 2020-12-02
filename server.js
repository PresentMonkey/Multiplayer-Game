const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');


const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = 3000;

app.set('port', port);
app.use('/public', express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

server.listen(port, function(){
  console.log(`Starting server on port ${port}`)
})

io.on('connection', function(socket){
  socket.on('message', function(data){
    console.log(data);
  });
});


var players = {};

io.on('connection', function(socket){
  socket.on('new player', function(){
    players[socket.id] = {
      x: 400,
      y: 300,
      username: " ", //placeholder for it to not show undefined
    };
  });
  socket.on('username', function(data){
      players[socket.id].username = data;
  });
  socket.on('disconnect', function(){
    delete players[socket.id];
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    var imageradius = 16;
    if (data.left && player.x > 0 + imageradius) {
      player.x -= 5;
    }
    if (data.up && player.y > 0 + imageradius) {
      player.y -= 5;
    }
    if (data.right && player.x < 800 - imageradius) {
      player.x += 5;
    }
    if (data.down && player.y < 600 - imageradius) {
      player.y += 5;
    }

    
  });
});


setInterval(function(){
  io.sockets.emit('state', players);
}, 1000/60);
