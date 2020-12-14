import {Game} from './modules/newgame.js';
import {docHandler} from './modules/docHandler.js';
import {imageData} from '/public/lib/imageData.js';


var socket = io();
socket.emit('new player'); //on new connection send a new player "ping" to server

var game = Game.create(socket, 'canvas');
var docsHandler = new docHandler(socket);

game.run();


window.onload = function(){
	var dropdown = document.getElementById('avatarSelect');
		for(var avatar in imageData.characters){
			let option = document.createElement('option');
			option.text = avatar;
			option.value = avatar;
			dropdown.add(option);
		}

};
