export class docHandler{
    constructor(socket){
        this.socket = socket;
    }
    callbackHolder(){
        var socket = this.socket;
        document.getElementById("usernameInputButton").addEventListener("click", function(){ //When username submit button is pressed send username to server: bug to fix: make enter on form work as well
            let username = document.getElementById("usernameInputForm").value; //read form value
            socket.emit('username', username, (response)=>{
                if(response.status == "too long"){
                    alert("Username too long");
                }
        
            });
        });
        
    }
}