export class Input{
    /**
     * Input class contructor
     * 
     */
    constructor(){
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;

        this.e = false;
        this.space = false;

    }
    /**
     * Method to create Input class
     * @param {Element} keyElement The element to lsiten for keypresses
     * @return {Input}
     */
    static create(keyElement){
        const input = new Input();
        input.applyEventHandlers(keyElement);
        return input;
    }
    /**
     * Key down event handler
     * @param {Event} event The vent passed to the event handler 
     */
    onKeyDown(event){
        switch(event.keyCode){
            case 65: //A
                this.left = true;
                break;
            case 87: //W
                this.up = true;
                break;
            case 68: //d
                this.right = true;
                break;
            case 83: //s
                this.down = true;
                break; 
            case 69: //e
                this.e = true;
                break;
            case 32: //space
                this.space = true;
                break;
            default:
                break;
        }
    }
    /**
     * Key up event handler
     * @param {Event} event 
     */
    onKeyUp(event){
        switch(event.keyCode){
            case 65: //A
                this.left = false;
                break;
            case 87: //W
                this.up = false;
                break;
            case 68: //d
                this.right = false;
                break;
            case 83: //s
                this.down = false;
                break; 
            case 69: //e
                this.e = false;
                break;
            case 32: //space
                this.space = false;
                break;
            default:
                break;
        }
    }
    /**
     * Applies the vent handles in the DOM
     * @param {Element} keyElement 
     */
    applyEventHandlers(keyElement){
        keyElement.addEventListener('keydown', this.onKeyDown.bind(this));
        keyElement.addEventListener('keyup', this.onKeyUp.bind(this));
    }

}