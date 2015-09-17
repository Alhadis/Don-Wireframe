"use strict";

const DEVICE_PIXEL_RATIO	= "devicePixelRatio";


class TimeRope{

	constructor(canvas, knots, opts){

		/** Get our art supplies together */
		this.canvas		= canvas || document.appendChild(New("canvas", {width: "100%", height: "100%"}));
		this.context	= this.canvas.getContext("2d");
		this.pixelRatio	= DEVICE_PIXEL_RATIO in window ? window[DEVICE_PIXEL_RATIO] : 1;
		this.knots		= knots || [];


		/** Additional arguments */
		opts			= opts || {};
		this.width		= opts.width || 1;
		this.colour		= opts.colour || "#000";
		this.dotted		= undefined === opts.dotted ? false : opts.dotted;

		/** Paint the first frame */
		this.redraw();
	}



	set dotted(i){
		let	context = this.context,
			dashFn	= "setLineDash";

		if(dashFn in context){
			let size = this.width * 2;
			context[dashFn]([0.01, size, 0, size / 2]);
			context.lineCap = "round";
		}
	}


	get colour(){ return this.context.strokeStyle; }
	set colour(i){
		if("number" === typeof i){
			let rgb	= [
				(i & 0xFF0000) >> 16,
				(i & 0x00FF00) >> 8,
				(i & 0x0000FF) >> 0
			];

			i = "#" + rgb.map(c => c.toString(16)).join("");
		}
		this.context.strokeStyle = i;
	}


	/** Get/set the rope's thickness */
	get width(){ return this.context.lineWidth / this.pixelRatio; }
	set width(i){ this.context.lineWidth = i * this.pixelRatio; }



	/** Redraws the rope's geometry after its control points have changed. */
	redraw(){

		let canvas		= this.canvas;
		let context		= this.context;

		/** Clear the canvas's existing contents */
		context.clearRect(0, 0, canvas.width, canvas.height);

		/** Store the current canvas properties before they get reset */
		let width		= this.width;
		let colour		= this.colour;
		let dotted		= this.dotted;

		/** Update the dimensions of the canvas's drawing area */
		let canvasBox	= canvas.parentNode.getBoundingClientRect();
		canvas.width	= canvasBox.width  * this.pixelRatio;
		canvas.height	= canvasBox.height * this.pixelRatio;
		
		this.width		= width;
		this.colour		= colour;
		this.dotted		= dotted;


		/** Draw something */
		let knots		= this.knots;

		for(let i = 0, l = knots.length; i < l; ++i){
			let prevPoint	= knots[i-1] || knots[0];

			let fromX		= prevPoint[0] * this.pixelRatio;
			let fromY		= prevPoint[1] * this.pixelRatio;
			let toX			= knots[i][0] * this.pixelRatio;
			let toY			= knots[i][1] * this.pixelRatio;

			context.quadraticCurveTo(
				(toX - fromX) * .5,
				(toY - fromY) * .5,
				toX,
				toY
			);
			0 && context.bezierCurveTo(
				(toX - fromX) * .5,
				(toY - fromY) * .5,
				
				//(toX - fromX) * .66,
				//(toY - fromY) * .66,
				toX,
				toY,
				toX,
				toY
			);
		}
		context.stroke();
	}
	
	
}
