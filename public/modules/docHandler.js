export class docHandler{
	constructor(socket){
		this.socket = socket;
		this.callbackHolder();
	}
	callbackHolder(){
		var socket = this.socket;
		document.getElementById('usernameInputButton').addEventListener('click', function(){ //When username submit button is pressed send username to server: bug to fix: make enter on form work as well
			let username = document.getElementById('usernameInputForm').value; //read form value
			socket.emit('username', username, (response)=>{
				if(response.status == 'too long'){
					alert('Username too long');
				}
        
			});
		});
		document.getElementById('avatarSelectSubmit').addEventListener('click', function(){
			let avatar = document.getElementById('avatarSelect').value;
			socket.emit('avatar', avatar, (response) => {
				//do nothing for now
			});
		});       
        
	}
}