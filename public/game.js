//proload images
var img = new Image();
img.src = "/public/assets/pfp1.png";


var socket = io();

socket.emit('new player'); //on new connection send a new player "ping" to server
setInterval(function(){ //60 times a second send movement requests to server
    socket.emit('movement', movement);
}, 1000/60);


var movement = { //object to hold movement requests
    up: false,
    down: false,
    left: false,
    right: false
}
document.getElementById("gameCanvas").addEventListener('keydown', function(event){  //function to handle keypresses
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
document.getElementById("gameCanvas").addEventListener('keyup', function(event){ //function to handle key unpresses
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
canvas.width = 800; //set how big it should be
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) { //Run everytime a state object is recived from server
  context.clearRect(0, 0, 800, 600); //Clear canvas
  context.fillStyle = 'black';
  for (var id in players) { //Move through every player object in players object
    var player = players[id];
    var imageradius = 16; //MOVE TO CENTRALIZED LOCATION (maybe create custom image object with radious in it?)
    context.font = "10px Arial";
    context.textAlign = "center";
    context.fillText(player.username, player.x, player.y + imageradius + 10); //Draws username
    context.drawImage(img, player.x - imageradius, player.y - imageradius); //Draws image
    //context.beginPath();  //Legacy code to draw dot instead of image
    //context.arc(player.x, player.y, 2, 0, 2 * Math.PI);
    //context.fill();
  }
});


document.getElementById("usernameInputButton").addEventListener("click", function(){ //When username submit button is pressed send username to server: bug to fix: make enter on form work as well
    var username = document.getElementById("usernameInputForm").value; //read form value
    socket.emit('username', username, (response)=>{
        if(response.status == "too long"){
            alert("Username too long");
        }

    });
});

