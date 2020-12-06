import {Game} from "./modules/game.js";
import {docHandler} from "./modules/docHandler.js"


var socket = io();
socket.emit('new player'); //on new connection send a new player "ping" to server

var game = new Game(socket, document.getElementById('canvas'), 600, 800, "/public/assets/images/imageData.json", 16);
var docsHandler = new docHandler(socket);


window.onload = function(){
    var dropdown = document.getElementById("avatarSelect")

    game.getJSON().then(data =>{
    for(var avatar in data){
        let option = document.createElement("option");
        option.text = avatar;
        option.value = avatar;
        dropdown.add(option);
        }
    })



}





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
docsHandler.callbackHolder();
