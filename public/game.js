var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

function sendPong(data){
    socket.emit('message', data);
}

socket.emit('new player');
setInterval(function(){
    socket.emit('movement', movement);
}, 1000/60);



var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}
document.getElementById("gameCanvas").addEventListener('keydown', function(event){
    switch(event.keyCode){
        case 65: //A
            movement.left = true;
            break;
        case 87: //w
            movement.up = true;
            break;
        case 68: //d
            movement.right = true;
            break;
        case 83: //s
            movement.down = true;
            break;
    }
}, true);
document.getElementById("gameCanvas").addEventListener('keyup', function(event){
    switch(event.keyCode){
        case 65: //A
            movement.left = false;
            break;
        case 87: //w
            movement.up = false;
            break;
        case 68: //d
            movement.right = false;
            break;
        case 83: //s
            movement.down = false;
            break;
    }
});



var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'black';
  for (var id in players) {
    var player = players[id];
    context.font = "20px Arial";
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.drawImage("assets/pfp1.png", player.x, player.y);
    context.fillText(player.username , player.x + 20, player.y);
  }
});


document.getElementById("usernameInputButton").addEventListener("click", function(){
    var username = document.getElementById("usernameInputForm").value;
    socket.emit('username', username);
});
document.getElementById("usernameInputForm").addEventListener('submit', function(){
    var username = document.getElementById("usernameInputForm").value;
    socket.emit('username', username);
});

