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
      let images = json.images
      return Promise.resolve(images);
    }
  }

  async loadImages() {
    let imagePath = this.imagePath;
    let response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      let json = await response.json();
      let images = json.images
      for (var avatar in images) {
        images[avatar].imageObject = new Image();
        images[avatar].imageObject.src = images[avatar].path;
      }
      return Promise.resolve(images);
    }

  }
  update() {
    var images;
    var imageIsLoaded;
    var imageRadius = this.imageRadius;
    var context = canvas.getContext('2d');
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
        console.log(playerz);
        context.clearRect(0, 0, 800, 600); //Clear canvas
        context.fillStyle = 'black';
        for (var id in playerz) { //Move through every player object in players object
          var player = playerz[id];
          console.log(playerz);
          context.font = "10px Arial";
          context.textAlign = "center";
          context.fillText(player.username, player.x, player.y + imageRadius + 10); //Draws username
          context.drawImage(images[player.avatar].imageObject, player.x - imageRadius, player.y - imageRadius); //Draws image

          //context.beginPath();  //Legacy code to draw dot instead of image
          //context.arc(player.x, player.y, 2, 0, 2 * Math.PI);
          //context.fill();

        }

      }

    });

  }
  inputHandler() {
  }
}
