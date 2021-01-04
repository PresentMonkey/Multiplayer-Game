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


    var map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var mapIndex = 0;
    var block_w = 80;
    var block_h = 80;



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
            context.fillText("Press E (MUST HAVE A USERNAME)", 320, 280);
            context.fillRect(272, 292, 92, 104);
            context.font = "10px Arial";
            context.fillText(player.username, player.x, player.y + imageRadius + 10);
            context.drawImage(images.avatars[player.avatar].imageObject, player.x - imageRadius, player.y - imageRadius); //Draws image
          }

          if (player.world === 2) {
            context.beginPath();
            context.globalCompositeOperation = "destination-over";
            /*context.fillStyle = "blue";
            context.fillRect(100, 455, 200, 1);*/
            context.fillStyle = "black";
            //context.fillRect(640 + 1018 - (camera.x), 406, 84, 124);

            context.drawImage(images.backgrounds.fb1.imageObject, camera.x - 640, 0, 1280, 720, 0, 0, 1280, 720);

            context.beginPath();
            context.globalCompositeOperation = "source-over";
            context.font = "10px Arial";
            context.fillText("Press E", 640 + 990 - (camera.x), 450);
            context.font = "10px Arial";
            if (player.username != camera.username) {
              context.fillText(player.username, player.x - camera.x + 656, player.y + imageRadius + 10);
              context.drawImage(images.avatars[player.avatar].imageObject, player.x - camera.x + 640, player.y - imageRadius); //Draws image
            }
            if (player.username == camera.username) {
              context.globalCompositeOperation = "source-over";
              context.fillText(player.username, 656, player.y + imageRadius + 10);

              context.drawImage(images.avatars[player.avatar].imageObject, 640, player.y - imageRadius)
              camera.x = player.x;
              camera.y = player.y;
            }


          }
          /*
          for(var why = 0; why < 720; why++){
          for(var ecks = 0; ecks < 1280; ecks++, mapIndex++){
            console.log("in tile loop");
            var tile_x = ecks * block_w;
            var tile_y = why * block_h;

            var tile_type = map[mapIndex];

            context.globalCompositeOperation = "destination-over";

            if(tile_type == 1){
              context.drawImage(images.tiles.dirt.imageObject, tile_x, tile_y,)
            }
            if(tile_type == 0){
              context.drawImage(images.tiles.sky.imageObject, tile_x, tile_y,)
            }

          }
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
