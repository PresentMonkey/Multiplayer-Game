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

server.listen(port, function () {
  console.log(`Starting server on port ${port}`)
})

var worldoneplayer = {}; //player object (maybe use redis for this later???)
var worldtwoplayer = {};
var worldchange = 1;

io.on('connection', function (socket) {
  var p = 0;
  if (p == 0) {
    socket.join('worldone');
    socket.leave('worldtwo');
    p += 1
  }
  function createplayers(worldplayer, identity) {
    console.log(worldchange)
    socket.on('new player', function () {
      worldplayer[socket.id] = { //When a new player connects, thier socket id will be used as a player ID and placed in the global player object with some predetermined protoype
        x: 400,
        y: 300,
        username: " ", //placeholder for it to not show undefined
        avatar: "Alien",
        world: identity
      };
    });

    socket.on('username', (data, callback) => { //On username websocket sent add thier username to their player object
      if (data.length > 9) {
        callback({ status: "too long" });
      }
      else {
        worldplayer[socket.id].username = data;
        callback({ status: 'ok' });
      }
    });
    socket.on('avatar', (data, callback) => {
      worldplayer[socket.id].avatar = data;
      callback({ status: "ok" });
    });

    socket.on('disconnect', function () { //Delete specific player's object on disconnect
      delete worldplayer[socket.id];
    });
    socket.on('movement', function (data) { //function to handle player movement


      var imageradius = 16; //Move this to a better location later?

      if (worldchange === 1) {
        var player = worldoneplayer[socket.id] || {}; //Don't know what this does??
        
        if (data.left && player.x > 0 + imageradius) {
          player.x -= 3;
        }
        if (data.up && player.y > 0 + imageradius) {
          player.y -= 3;
        }
        if (data.right && player.x < 1920 - imageradius) {
          player.x += 3;
        }
        if (data.down && player.y < 1080 - imageradius) {
          player.y += 3;
        }
        player.world = 1;
        if (data.interact && player.x > 172 && player.x < 226 & player.y > 234 && player.y < 336) { //press e
          player.world = 2;
          socket.join('worldtwo');
          socket.leave('worldone');
          var worldchange = 2;
        }
      }
      if (worldchange === 2) {
        player = worldtwoplayer[socket.id] || {}; //Don't know what this does??
        if (data.left && player.x > 0 + imageradius) {
          player.x -= 3;
        }
        if (data.up && player.y > 0 + imageradius) {
          player.y -= 3;
        }
        if (data.right && player.x < 1920 - imageradius) {
          player.x += 3;
        }
        if (data.down && player.y < 1080 - imageradius) {
          player.y += 3;
        }
        player.world = 2;
        if (data.tester && player.x > 490 && player.x < 574 & player.y > 300 && player.y < 400) { //press q
          player.world = 1;
          socket.join('worldone');
          socket.leave('worldtwo');
          var worldchange = 1;
        }
      }

    });
  }
  createplayers(worldoneplayer, 1);
  createplayers(worldtwoplayer, 2);
});
setInterval(function () {  //send players every 60sec
  //io.sockets.emit('state', worldoneplayer);
  io.sockets.to('worldone').emit('state', worldoneplayer);
  io.sockets.to('worldtwo').emit('state', worldtwoplayer);
}, 1000 / 60);
