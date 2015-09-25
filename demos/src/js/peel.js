"use strict";

const DEVICE_PIXEL_RATIO = "devicePixelRatio";

let imageSize = document.getElementById("image-size");
let canvasSize = document.getElementById("canvas-size");


/**
 * PEEL /piːl/ (noun).
 *
 * 1. A long, shovel-like utensil for sliding bread into and out of an oven.
 * 2. Also a DON-specific class named after the effect it reminded the developer of.
 *
 * To put the second definition into more informative terms, this is a view controller
 * for animating the DON® logo as the user scrolls over the navigation menu. The shape
 * of the logo, coupled with the reminder of pizza and flatbread served with pepperoni
 * underneath it, is responsible for the class's odd choice of name.
 */
class Peel{

	/**
	 * Creates a new Peel instance.
	 *
	 * @param {HTMLCanvasElement} canvas   HTML canvas to work within
	 * @param {CanvasImageSource} logo     DON logo to animate
	 * @param {NodeList|Array}    slides   Masthead images to gently rotate
	 * @constructor
	 */
	constructor(canvas, logo, slides){

		/** DOM references */
		this.canvas	= canvas;
		this.logo	= logo;
		this.slides	= slides;


		/** Canvas properties */
		this.pixelRatio		= DEVICE_PIXEL_RATIO in window ? window[DEVICE_PIXEL_RATIO] : 1;

		canvas.width		= window.innerWidth * this.pixelRatio;
		canvas.height		= window.innerHeight * this.pixelRatio;
		this.contextType	= "2d" || getWebGLSupport(); /** Order swapped; won't deal with WebGL just yet */
		this.context		= canvas.getContext(this.contextType);

		this.draw();
	}


	draw(){
		let context			= this.context;
		let image			= this.slides[0];

		/** Wipe the canvas clean of all pixel data before drawing another frame */
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);


		/** Start performing calculations here */
		let canvasBox		= this.canvas.getBoundingClientRect();
		let canvasWidth		= canvasBox.width  * this.pixelRatio;
		let canvasHeight	= canvasBox.height * this.pixelRatio;

		let canvasRatio		= canvasWidth / canvasHeight;
		let imageRatio		= image.naturalWidth / image.naturalHeight;
		
		
		let imageWidth, imageHeight;
		if(canvasRatio > imageRatio){
			imageWidth		= canvasWidth;
			imageHeight		= canvasRatio * imageHeight;
		}
		else{
			imageWidth		= imageRatio * canvasHeight;
			imageHeight		= canvasHeight;
		}

		let x				= (imageWidth  - canvasWidth)  / 2;
		let y				= (imageHeight - canvasHeight) / 2;

		this.canvas.width	= canvasWidth;
		this.canvas.height	= canvasHeight;
		if(!seeThrough)
			this.context.drawImage(image, -x, -y, imageWidth, imageHeight);

		/** Keep some feedback on the screen */
		canvasSize.textContent	= `Canvas: ${Math.round(imageWidth)} × ${Math.round(imageHeight)}`;
		imageSize.textContent	= `Image:  ${Math.round(imageWidth)} × ${Math.round(imageHeight)} @ [${-Math.round(x)},${-Math.round(y)}]`;

		/** Queue the next frame */
		window.requestAnimationFrame(() => this.draw());
	}
}
