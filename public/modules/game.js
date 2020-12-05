export class Game{
    constructor(socket, canvas, height, width, imagePath, imageRadius){
        this.socket = socket;
        this.canvas = canvas;
        this.height = height;
        this.width = width;
        this.imagePath = imagePath;
        this.imageRadius = imageRadius;
        this.canvas.height=height;
        this.canvas.width=width;
        var globalImages;
        this.globalImages = globalImages;
       // this.images = {}; //images object to hold images
        
/*
        function getImages(path){
          var imagesFunc;
          fetch(path) //get images json file
          .then(function(response){
            if(response.status !== 200){
              console.log('Problem loading charactert json. Status code: ' + response.status);
              return;
            }
            response.json().then(function(data){
              imagesFunc = data.images;
              for(var avatarName in imagesFunc){ //create images for each entry in the images json
                imagesFunc[avatarName].imageObject = new Image();
                imagesFunc[avatarName].imageObject.src = imagesFunc[avatarName].path;
              };
            });
          }).catch(function(err){
            console.log('fetch Error: ', err);
          })
          return imagesFunc;
        }

       // this.images = getImages(imagePath);

        */

        
        
        //this.img = new Image();
        //this.img.src = imagePath;

        //load all images (maybe find a better system later?)
        

       
    }
    loadImages(){
      let imagePath = this.imagePath;
      var images;
      async function fetchImages(){
        try{
          let reponse = await fetch(imagePath);
          if(!reponse.ok){
            const message = `An error has occured: ${reponse.status}`;
            throw new Error(message);
          }
          var imageJSON = await reponse.json();
        }
        finally{
          images = imageJSON.images;
          for(let avatarName in images){ //create images for each entry in the images json
            images[avatarName].imageObject = new Image();
            images[avatarName].imageObject.src = images[avatarName].path;
          };
          return images;
        }
        
      }
      fetchImages().then(reponse => {
        globalImages = reponse;
      })





/*
      function success(response){
        response.json().then(data => {
          images = data.images;
          for(let avatarName in images){ //create images for each entry in the images json
            images[avatarName].imageObject = new Image();
            images[avatarName].imageObject.src = images[avatarName].path;
          };
          console.log(images);
        }).then(return function(){
          console.log(images);
          return images, true;
        })
      }
      fetch(imagePath)
        .then(response => {
          success(response);
        })
        .catch(err => {
          console.log("Image could not be loaded error: " + err);
        })
        */
    }
    
    update(){
        var $this = this;
        var imageIsLoaded;
        var imageRadius = this.imageRadius;
        var context = canvas.getContext('2d');
        var images; 
        //console.log(images);

      

        this.loadImages();
        console.log(globalImages);
        /*
        this.loadImages().then(reponse =>{
          if(reponse){
            imageIsLoaded = true;
            images = reponse;
          }
        })*/
        

        if(imageIsLoaded){
          this.socket.on('state', function(players) { //Run everytime a state object is recived from server
            context.clearRect(0, 0, 800, 600); //Clear canvas
            context.fillStyle = 'black';
            for (var id in players) { //Move through every player object in players object
              var player = players[id];
              context.font = "10px Arial";
              context.textAlign = "center";
              context.fillText(player.username, player.x, player.y + imageRadius + 10); //Draws username
              context.drawImage(images.billy.imageObject, player.x - imageRadius, player.y - imageRadius); //Draws image

              //context.beginPath();  //Legacy code to draw dot instead of image
              //context.arc(player.x, player.y, 2, 0, 2 * Math.PI);
              //context.fill();
            }
          });
        };

    }
    inputHandler(){
      
    }

}
