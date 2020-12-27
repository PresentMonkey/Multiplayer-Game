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
      for(var imageType in json){
        for(var image in json[imageType]){
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
          }
          if (player.world === 2){
            context.globalCompositeOperation = "destination-over";
            context.beginPath();
            context.fillStyle = "blue";
            context.fillRect(100, 455, 200, 1);
            context.fillStyle = "grey";
            context.fillRect(418, 406, 84, 124);
            context.fillStyle = "black";
            context.fillRect(0, 526, 1280, 526);
            context.drawImage(images.backgrounds.fb1.imageObject, 0, 0);
            context.beginPath();
            context.globalCompositeOperation = "source-over";
            context.font = "10px Arial";
            context.fillText("Press E", 525, 450);
          }
          /*if(player.world ===3){
            context.drawImage(images.backgrounds.fb1.imageObject, 0, 0);
            console.log('worldthree');
          }*/
          
          context.font = "10px Arial";
          context.fillText(player.username, player.x, player.y + imageRadius + 10);
          context.drawImage(images.avatars[player.avatar].imageObject, player.x - imageRadius, player.y - imageRadius); //Draws image

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
