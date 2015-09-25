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
	 * @param {HTMLCanvasElement} canvas              HTML canvas to work within
	 * @param {Object}            opts                Hash of options configuring animation behaviour
	 * @param {CanvasImageSource} opts.logo           DON logo to animate
	 * @param {NodeList|Array}    opts.slides         Masthead images to rotate in and out of sight
	 * @param {Number}            opts.slideDuration  Milliseconds between rotations
	 * @param {Number}            opts.fadeSpeed      Duration of opacity transition, in milliseconds
	 * @constructor
	 */
	constructor(canvas, opts){
		opts		= opts || {};

		/** DOM references */
		this.canvas			= canvas;
		this.logo			= opts.logo;
		this.slides			= opts.slides;
		this.slideIndex		= opts.slideIndex    || 0;
		this.slideDuration	= opts.slideDuration || 1000;
		this.fadeSpeed		= opts.fadeSpeed     || 250;


		/** Canvas properties */
		this.pixelRatio		= DEVICE_PIXEL_RATIO in window ? window[DEVICE_PIXEL_RATIO] : 1;
		canvas.width		= window.innerWidth  * this.pixelRatio;
		canvas.height		= window.innerHeight * this.pixelRatio;
		this.contextType	= "2d" || getWebGLSupport(); /** Order swapped; won't deal with WebGL just yet */
		this.context		= canvas.getContext(this.contextType);

		/** Animation/timing properties */
		this.previousTime	= 0;
		this.currentTime	= 0;
		this.draw(window.performance.now());

		/*~ DEBUGGING: */
		//this.canvas.style.backgroundImage = `url(${this.slides[0].src})`;
	}
	
	
	/** Zero-based index of the currently-displayed slide */
	get slideIndex(){ return this._slideIndex || 0; }
	set slideIndex(i){
		if(~~i >= this.slides.length) i = 0;

		this._slideIndex	= i;
		this.currentSlide	= this.slides[i];
		this.nextSlide		= this.slides[this.slideIndex + 1] || this.slides[0];
	}



	/**
	 * Composites an image slide onto the canvas
	 *
	 * @param {CanvasImageSource} image - Image source to draw
	 * @param {Number}            alpha - Opacity of the composited image
	 */
	drawSlide(image, alpha){
		this.context.globalAlpha = alpha;
		let canvasWidth		= this.canvas.width;
		let canvasHeight	= this.canvas.height;

		let canvasRatio		= canvasWidth / canvasHeight;
		let imageRatio		= image.naturalWidth / image.naturalHeight;
 

		let imageWidth, imageHeight;
		if(canvasRatio > imageRatio){
			imageWidth		= canvasWidth;
			imageHeight		= imageRatio / canvasHeight;
		}

		else{
			imageWidth		= imageRatio * canvasHeight;
			imageHeight		= canvasHeight;
		}

		let x	= (imageWidth  - canvasWidth)  / 2;
		let y	= (imageHeight - canvasHeight) / 2;
		this.context.drawImage(image, -x, -y, imageWidth, imageHeight);
	}



	/**
	 * Renders a new canvas frame, replacing the previous one.
	 *
	 * @param {DOMHighResTimeStamp} time - Current timestamp, passed from requestAnimationFrame
	 */
	draw(time){
		/** Update our time-tracking */
		let currentTime		= time % this.slideDuration;
		
		/** We've wrapped back to the beginning of the rotation cycle, so update our image pointers */
		if(currentTime < this.currentTime)
			++this.slideIndex;



		let context			= this.context;

		/** Wipe the canvas clean of all pixel data before drawing another frame */
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);


		/** Start performing calculations here */
		let canvasBox		= this.canvas.getBoundingClientRect();

		/** Set the canvas's internal dimensions to its element's bounding box */
		this.canvas.width	= canvasBox.width  * this.pixelRatio;
		this.canvas.height	= canvasBox.height * this.pixelRatio;

		this.drawSlide(this.currentSlide, 1);
		
		



		/** Check if we're close enough to the end of a cycle to start fading in the next image */
		let beginFading = this.slideDuration - this.fadeSpeed;
		if(currentTime >= beginFading){
			let slideAlpha = (currentTime - beginFading) / (this.slideDuration - beginFading);
			this.drawSlide(this.nextSlide, slideAlpha);
		}

		/** Store the current time for later comparison */
		this.currentTime = currentTime;


		/** Queue the next frame */
		window.requestAnimationFrame(t => this.draw(t));
	}
}
