
//include depedencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');


const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = 3000; //port we will listen on

app.set('port', port);
app.use('/public', express.static(__dirname + '/public'));  //set static route for all requests to public (needed for files inside public folder to be accessible)


app.get('/', (req, res) => { //Sends index.html on page load
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

server.listen(port, function(){  
  console.log(`Starting server on port ${port}`)
})

var players = {}; //player object (maybe use redis for this later???)

io.on('connection', function(socket){
  socket.on('new player', function(){
    players[socket.id] = { //When a new player connects, thier socket id will be used as a player ID and placed in the global player object with some predetermined protoype
      x: 400,
      y: 300,
      username: " ", //placeholder for it to not show undefined
    };
  });
  socket.on('username', function(data){ //On username websocket sent add thier username to their player object
      players[socket.id].username = data;
  });
  socket.on('disconnect', function(){ //Delete specific player's object on disconnect (maybe save to database (mongodb?) later??, needed right now for their circle to disappear)
    delete players[socket.id];
  });
  socket.on('movement', function(data) { //function to handle player movement
    var player = players[socket.id] || {}; //Don't know what this does??
    var imageradius = 16; //Move this to a better location later?
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


setInterval(function(){  //60 times a second send the whole players object to every connection (maybe impement interpolation later for less "lag")
  io.sockets.emit('state', players);
}, 1000/60);
