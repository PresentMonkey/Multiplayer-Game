import {ImageClass} from '/public/modules/image.js';

export class Drawing{
    /**
     * Drawing class contructor
     * @param {CanvasRenderingContext2D} context The canvas context to draw to
     * @param {ImageClass} images The image class
     */
    constructor(context, images){
        this.context = context;
        this.images = images;
        

        this.width = context.canvas.width;
        this.height = context.canvas.height;
    }

    /**
     * Static method to call instead of contructer (will create new image objects for json)
     * @param {Element} canvas The canvas element to draw to
     * @return {Drawing}
     */
    static create(canvas){
        const context = canvas.getContext('2d');
        context.font = '10px Arial';
        context.textAlign = 'center';
        context.fillStyle = 'black';
        const imageClass = ImageClass.create();
        return new Drawing(context, imageClass);
    }
    /**
     * Method to draw players 
     * @param {Object} players Players object
     */
    drawPlayers(players){
        for(let id in players){
            let player = players[id];
            this.context.drawImage(this.images.getAvatar(player.avatar), player.x, player.y);
        }
    }
    /**
     * Method to draw username
     * @param {Object} players
     */
    drawUsername(players){
        for(let id in players){
            let player = players[id];
            let context = this.context;
                context.fillText(player.username, player.x, player.y + 10);
        }
    }
    /**
     * Method to clear the canvas
     */
    clear(){
        this.context.clearRect(0,0, this.width, this.height);
    }
    /**
     * Method to update everything
     * @param {Object} players
     */
    update(players){
        this.clear();
        this.drawPlayers(players);
        this.drawUsername(players);
    }
}