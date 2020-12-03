import {Game} from "./game.js";



//proload images
//var img = new Image();
//img.src = "/public/assets/pfp1.png";


var socket = io();

socket.emit('new player'); //on new connection send a new player "ping" to server



var game = new Game(socket, document.getElementById('canvas'), 600, 800, "/public/assets/pfp1.png", 16);


var movement = { //object to hold movement requests
    up: false,
    down: false,
    left: false,
    right: false
};
setInterval(function(){ //60 times a second send movement requests to server
    socket.emit('movement', movement);
}, 1000/60);



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


game.update();

document.getElementById("usernameInputButton").addEventListener("click", function(){ //When username submit button is pressed send username to server: bug to fix: make enter on form work as well
    var username = document.getElementById("usernameInputForm").value; //read form value
    socket.emit('username', username, (response)=>{
        if(response.status == "too long"){
            alert("Username too long");
        }

    });
});

