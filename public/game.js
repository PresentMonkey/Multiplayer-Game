export class Game{
    constructor(socket, canvas, height, width, image, imageRadius){
        this.socket = socket;
        this.canvas = canvas;
        this.height = height;
        this.width = width;
        this.image = image;
        this.imageRadius = imageRadius;
        this.canvas.height=height;
        this.canvas.width=width;

        this.img = new Image();
        this.img.src = image;
       
    }
    drawPlayers(player){
      this.player = player;
      var context = canvas.getContext('2d');
      context.font = "10px Arial";
      context.textAlign = "center";
      context.fillText(player.username, player.x, player.y + this.imageradius + 10); //Draws username
      context.drawImage(this.img, player.x - this.imageradius, player.y - this.imageradius); //Draws image
    }
    update(){
        var localImage = this.img;
        var context = canvas.getContext('2d');
        var so = this.socket;
        so.on('state', function(players) { //Run everytime a state object is recived from server
            context.clearRect(0, 0, 800, 600); //Clear canvas
            context.fillStyle = 'black';
            for (var id in players) { //Move through every player object in players object
              var player = players[id];
              //var imageradius = 16; //MOVE TO CENTRALIZED LOCATION (maybe create custom image object with radious in it?)
              context.font = "10px Arial";
              context.textAlign = "center";
              context.fillText(player.username, player.x, player.y + 16 + 10); //Draws username
              context.drawImage(localImage, player.x - 16, player.y - 16); //Draws image
              //context.beginPath();  //Legacy code to draw dot instead of image
              //context.arc(player.x, player.y, 2, 0, 2 * Math.PI);
              //context.fill();
            }
          });
    }

}
