import { Drawing } from '/public/modules/drawing.js';
import { Input } from '/public/modules/input.js';


export class Game{
    /**
     * Game class contructor
     * @param {Socket} socket The socket connected to the server
     * @param {Drawing} drawing The drawing object for canvas render
     * @param {Input} input The input object for tracking user input
     * 
     */
    constructor(socket, drawing, input){
        this.socket = socket;
        this.drawing = drawing;
        this.input = input;


        this.players = {};

        this.animationFrameId = null;
    }
    /**
     * @param {Socket} socket The socket connected to the server
     * @param {string} canvasElementID The ID of the canvas element to render the game to
     * @return {Game}
     */
    static create(socket, canvasElementID){
        const canvas = document.getElementById(canvasElementID);
        canvas.width = 800; //temporary
        canvas.height = 600; 

        const drawing = Drawing.create(canvas);
        const input = Input.create(canvas);

        const game = new Game(socket, drawing, input);
        game.init();
        return game;
    }
    /**
     * Initializes the Game object
     */
    init(){
        this.socket.on('state', players =>{
            this.players = players;
        });
    }
    /**
     * Starts the animation and update loop
     */
    run(){
        this.update();
        this.draw();
        this.animationFrameId = window.requestAnimationFrame(this.run.bind(this));
    }
    /**
     * Stops the animations and update loop
     */
    stop(){
        window.cancelAnimationFrame(this.animationFrameId);
    }
    /**
     * Updates the client state of the game and sends user input to the server
     */
    update(){
        this.socket.emit('movement', {
            up: this.input.up,
            down: this.input.down,
            left: this.input.left,
            right: this.input.right,
            e: this.input.e,
            space: this.input.space
        });
    }
    /**
     * Draws the state of the game to canvas
     */
    draw(){
        this.drawing.clear();
        this.drawing.drawPlayers(this.players);
        this.drawing.drawUsername(this.players);
    }

}