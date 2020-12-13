export class Drawing{
    /**
     * Drawing class contructor
     * @param {CanvasRenderingContext2D} context The canvas context to draw to
     * @param {Object} images The json with image data  
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
        let jsonPath = '/public/assets/images/imageData.json'
        const context = canvas.getContext('2d');
        var images = {};
        fetch(jsonPath).then(data =>{
            images = data;
            for(let character in images.characters){
                let path = images.characters[character].path;
                images.characters[character] = new Image();
                images.characters[character].src = path;
            }
        }).catch(e => {
            console.error('Error proccessing images '+ e);
        });
        return new Drawing(context, images);
    }
    drawPlayers(){
        
    }
}