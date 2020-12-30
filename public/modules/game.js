export class Game {
  constructor(socket, canvas, height, width, imagePath, imageRadius) {
    this.socket = socket;
    this.canvas = canvas;
    this.height = height;
    this.width = width;
    this.imagePath = imagePath;
    this.imageRadius = imageRadius;
    this.canvas.height = height;
    this.canvas.width = width;

  }
  async getJSON() {
    let imagePath = this.imagePath;
    let response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      let json = await response.json();
      return Promise.resolve(json);
    }
  }

  async loadImages() {
    let imagePath = this.imagePath;
    let response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      let json = await response.json();
      for (var imageType in json) {
        for (var image in json[imageType]) {
          json[imageType][image].imageObject = new Image();
          json[imageType][image].imageObject.src = json[imageType][image].path;
        }
      }
      return Promise.resolve(json);
    }

  }
  update() {

    var images;
    var imageIsLoaded;
    var imageRadius = this.imageRadius;
    var context = canvas.getContext('2d');
    var buffer = canvas.getContext("2d");

    var myWidth = window.innerWidth - 5;
    var myHeight = window.innerHeght - 5;
    context.canvas.width = 1280;
    context.canvas.height = 720;

    if (!imageIsLoaded) { //only load images if images not already loaded
      this.loadImages().then(data => {
        imageIsLoaded = true;
        images = data;
      })
        .catch(e => {
          console.log(`error` + e.message);
        });
    }

    /*socket.on('connect', function() {
      socket.emit('room', worldone);
    });*/




    var camera = { //When a new player connects, thier socket id will be used as a player ID and placed in the global player object with some predetermined protoype
      x: 530,
      y: 510,
      x_velo: false,
      y_velo: false,
      x_velo_1: false,
      jumping: false,
      colliding: false
    };
    var movement = { //object to hold movement requests
      up: false,
      down: false,
      left: false,
      right: false,
      interact: false
    };
    document.getElementById("gameCanvas").addEventListener('keydown', function (event) {  //function to handle keypresses
      switch (event.keyCode) {
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
        case 69:
          movement.interact = true;
          break;
        case 81:
          movement.tester = true;
          break;

      }
    }, true);
    document.getElementById("gameCanvas").addEventListener('keyup', function (event) { //function to handle key unpresses
      switch (event.keyCode) {
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
        case 69:
          movement.interact = false;
          break;
        case 81:
          movement.tester = false;
          break;
      }
    });
    if (movement.up && camera.jumping == false) {
      camera.y_velo -= 3;
      if (camera.y_velo < -9) {
        camera.jumping = true;
      }
    }
    if (movement.left && camera.jumping == false) {
      camera.x_velo -= .25;
    }
    if (camera.jumping && movement.left) {
      camera.x_velo -= .005 * Math.pow(.25, .2);
    }

    if (movement.right && camera.jumping == false) {
      camera.x_velo += .25;
    }
    if (camera.jumping && movement.right) {
      camera.x_velo += .005 * Math.pow(.25, .2);
    }

    camera.y_velo += .3; //gravity
    camera.x += camera.x_velo;
    camera.y += camera.y_velo;
    camera.y_velo *= 0.9; //gravity
    if (camera.jumping == false) { //friction
      camera.x_velo *= 0.9;
    }
    if (camera.jumping == true) { //friction
      camera.x_velo *= 1;
    }

    if (camera.y > 511) {
      camera.jumping = false;
      camera.y = 511;
      camera.y_velo = 0;
    }

    document.getElementById("usernameInputButton").addEventListener("click", function () { //When username submit button is pressed send username to server: bug to fix: make enter on form work as well
      camera.username = document.getElementById("usernameInputForm").value;
    });



    this.socket.on('state', function (playerz) { //Run everytime a state object is recived from server
      if (imageIsLoaded) {
        context.clearRect(0, 0, 1280, 720); //Clear canvas
        context.fillStyle = 'black';
        for (var id in playerz) { //Move through every player object in players object
          var player = playerz[id];
          var p = 0;
          context.textAlign = "center";

          if (player.world === 1) {
            context.font = "10px Arial";
            context.fillText("Press E", 320, 280);
            context.font = "10px Arial";
            context.fillText(player.username, player.x, player.y + imageRadius + 10);
            context.drawImage(images.avatars[player.avatar].imageObject, player.x - imageRadius, player.y - imageRadius); //Draws image
          }

          if (player.world === 2) {
            if (movement.up && camera.jumping == false) {
              camera.y_velo -= 3;
              if (camera.y_velo < -9) {
                camera.jumping = true;
              }
            }
            if (movement.left && camera.jumping == false) {
              camera.x_velo -= .25;
            }
            if (camera.jumping && movement.left) {
              camera.x_velo -= .005 * Math.pow(.25, .2);
            }

            if (movement.right && camera.jumping == false) {
              camera.x_velo += .25;
            }
            if (camera.jumping && movement.right) {
              camera.x_velo += .005 * Math.pow(.25, .2);
            }

            camera.y_velo += .3; //gravity
            camera.x += camera.x_velo;
            camera.y += camera.y_velo;
            camera.y_velo *= 0.9; //gravity
            if (camera.jumping == false) { //friction
              camera.x_velo *= 0.9;
            }
            if (camera.jumping == true) { //friction
              camera.x_velo *= 1;
            }

            if (camera.y > 511) {
              camera.jumping = false;
              camera.y = 511;
              camera.y_velo = 0;
            }
            console.log(movement);
            console.log(camera);
            context.globalCompositeOperation = "destination-over";
            context.beginPath();
            /*context.fillStyle = "blue";
            context.fillRect(100, 455, 200, 1);
            context.fillStyle = "grey";
            context.fillRect(418, 406, 84, 124);*/
            context.fillStyle = "black";
            context.fillRect(0, 526, 1280, 526);
            context.drawImage(images.backgrounds.fb1.imageObject, camera.x, 0, 1280, 720, 0, 0, 1280, 720);
            context.beginPath();
            context.globalCompositeOperation = "source-over";
            context.font = "10px Arial";
            context.fillText("Press E", 640 - (camera.x), 450);
            context.font = "10px Arial";
            if (player.username != camera.username) {
              context.fillText(player.username, player.x, player.y + imageRadius + 10);
              context.drawImage(images.avatars[player.avatar].imageObject, player.x, player.y - imageRadius); //Draws image
            }
            if(player.username == camera.username){
              context.fillText(player.username, 640, player.y + imageRadius + 10);
            }
            context.drawImage(images.avatars["Alien"].imageObject, 640, camera.y - imageRadius)

          }
          /*if(player.world ===3){
            context.drawImage(images.backgrounds.fb1.imageObject, 0, 0);
            console.log('worldthree');
          }*/



          /*context.beginPath();  //Legacy code to draw dot instead of image
          context.arc(player.x, player.y, 2, 0, 2 * Math.PI);
          context.fillStyle = "#FFFF00";
          context.fill();*/
        }
      }
    });
  }
  inputHandler() {
  }
}
