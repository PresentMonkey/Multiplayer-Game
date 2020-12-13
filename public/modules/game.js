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
		this.update();
       
	}
	async getJSON(){
		let imagePath = this.imagePath;
		let response = await fetch(imagePath);
		if(!response.ok){
			throw new Error(`HTTP error! Status: ${response.status}`);
		} else{
			let json = await response.json();
			return Promise.resolve(json);
		}
  }
  async loadImages(){
	let data = await this.getJSON();
	for(var avatar in data.images){
        let path = data.images[avatar].path;
        data.images[avatar] = new Image();
        data.images[avatar].src = path;
    }
	return Promise.resolve(data);
  }
	update(){
		var imageJSON;
		this.loadImages().then(data =>{
			imageJSON = data;
		});
		var imageRadius = this.imageRadius;
		var context = this.canvas.getContext('2d');

	this.socket.on('state', players => { //Run everytime a state object is recived from server
		if(imageJSON){ //checks for data inside imagejson before loading
			var images = imageJSON.images;
			context.clearRect(0, 0, 800, 600); //Clear canvas
					context.fillStyle = 'black';
					for (var id in players) { //Move through every player object in players object
						var player = players[id];
						context.font = '10px Arial';
						context.textAlign = 'center';
						context.fillText(player.username, player.x, player.y + imageRadius + 10); //Draws username
						context.drawImage(images[player.avatar], player.x - imageRadius, player.y - imageRadius); //Draws image

						//context.beginPath();  //Legacy code to draw dot instead of image
						//context.arc(player.x, player.y, 2, 0, 2 * Math.PI);
						//context.fill();
					}

		}

		});
        

	}
	inputHandler(){
      
	}

}
