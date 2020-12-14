import {imageData} from '/public/lib/imageData.js';
export class ImageClass{
    /**
     * Constructor for ImageClass class
     * 
     */
    constructor(){



        var images;
        this.images = images;
        this.defaultImage = new Image();
        this.defaultImage.src = '/public/assets/images/billy/billy.png';
    }
    /**
     * Static function to create ImageClass class
     * @param {string} imagePath
     * @return {ImageClass} 
     */
    static create(){
        const imageclass = new ImageClass();
        imageclass.loadAvatars();
        return imageclass;

    }
    loadAvatars(){
        let data = imageData;
        console.log(data);
        for(let avatar in data.characters){
            let path = data.characters[avatar].path;
            data.characters[avatar] = new Image();
            data.characters[avatar].src = path;
        }
        this.images = data;
    
    }
    /**
     * Returns an image of said avatar name
     * @param {string} avatarName 
     */
    getAvatar(avatarName){
        if(this.images){
            return this.images.characters[avatarName];
        }else{
            return this.defaultImage;
        }
        
    }
}