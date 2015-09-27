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
		this.slideDuration	= opts.slideDuration || 5000;
		this.fadeSpeed		= opts.fadeSpeed     || 2000;


		/** Canvas properties */
		this.pixelRatio		= DEVICE_PIXEL_RATIO in window ? window[DEVICE_PIXEL_RATIO] : 1;
		canvas.width		= window.innerWidth  * this.pixelRatio;
		canvas.height		= window.innerHeight * this.pixelRatio;
		this.contextType	= "2d" || getWebGLSupport(); /** Order swapped; won't deal with WebGL just yet */
		this.context		= canvas.getContext(this.contextType);


		/** Animation/timing properties */
		this.previousTime	= 0;
		this.currentTime	= 0;
		this.dirty			= true;
		this.draw(window.performance.now());
	}


	/** Height of the DON logo; will also set width proportionally */
	get logoSize(){ return this._logoSize || 190; }
	set logoSize(i){
		i = ~~i;
		
		/** Make sure there's a change before flagging the canvas as dirty */
		if(i !== this._logoSize){
			this._logoSize	= i;
			this.dirty		= true;
		}
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
			imageRatio		= image.naturalHeight / image.naturalWidth;
			imageWidth		= canvasWidth;
			imageHeight		= imageRatio * canvasWidth;
		}

		else{
			imageWidth		= imageRatio * canvasHeight;
			imageHeight		= canvasHeight;
		}

		let scrollY	= window.pageYOffset * 2;
		let x		= -((imageWidth  - canvasWidth)  / 2);
		let y		= -((imageHeight - canvasHeight) / 2) - (scrollY * .7);
		let scale	= 1.15;
		this.context.drawImage(image, x, y, imageWidth * scale, imageHeight * scale);
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
		let pixelRatio		= this.pixelRatio;
		let width			= window.innerWidth;
		let height			= window.innerHeight;

		/** Wipe the canvas clean of all pixel data before drawing another frame */
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);


		/** Start performing calculations here */
		let canvasBox		= this.canvas.getBoundingClientRect();
		let canvasWidth		= canvasBox.width  * pixelRatio;
		let canvasHeight	= canvasBox.height * pixelRatio;
		

		/** Set the canvas's internal dimensions to its element's bounding box */
		this.canvas.width	= canvasWidth;
		this.canvas.height	= canvasHeight;

		this.drawSlide(this.currentSlide, 1);



		/** Check if we're close enough to the end of a cycle to start fading in the next image */
		let beginFading = this.slideDuration - this.fadeSpeed;
		if(currentTime >= beginFading)
			this.drawSlide(this.nextSlide, (currentTime - beginFading) / (this.slideDuration - beginFading));
		
		/** Restore opacity level so DON is good and opaque */
		this.context.globalAlpha = 1;


		/** Erase the portion of the masthead that should be hidden by the content below */
		let navHeight	= 64;
		let clipBottom	= ((height - window.pageYOffset) - navHeight) * pixelRatio;
		context.clearRect(0, clipBottom, width * pixelRatio, height * pixelRatio);


		/** Colour-in the region where the navigation bar's sitting */
		context.fillStyle	= "#111c4e";
		context.fillRect(0, clipBottom, width * pixelRatio, navHeight * pixelRatio);


		/** Finally, add the giant DON logo */
		let position	= window.pageYOffset + (height / 2);
		let startAt		= (height + navHeight) * .85;
		let scale		= (position - startAt) / ((height + navHeight) - startAt);
		scale			= scale < 0 ? 0 : (scale > 1 ? 1 : scale);

		let from		= 1;
		let to			= 0.666;
		let logoHeight	= this.logoSize * (from + ((to - from) * scale));
		let logoWidth	= logoHeight * 1.248;
		logoHeight		*= pixelRatio;
		logoWidth		*= pixelRatio;

		let x			= (canvasWidth  / 2) - (logoWidth / 2);
		let yOffset		= logoHeight / 2.29;
		let y			= (height / 2) + yOffset;

		/** Logo's hit the end its scale region; pin it to the nav */
		if(scale === 1){
			y = (height * 1.5) + (yOffset * 2.2) - window.pageYOffset * 2;
		}
		this.context.drawImage(this.logo, x, y, logoWidth, logoHeight);



		/** Store the current time for later comparison */
		this.currentTime = currentTime;


		/** Queue the next frame */
		window.requestAnimationFrame(t => this.draw(t));
	}
}
