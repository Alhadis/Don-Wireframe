"use strict";


/**
 * Creates a bouncy ball to flick around the screen.
 */
class Ball{

	constructor(x, y){
		let div = document.body.appendChild(document.createElement("div"));
		div.className = "ball";

		this.element = div;
		this.x = x || 500;
		this.y = y || 500;

		this.vx	=	0;
		this.ax	=	.2;
	}


	onEnterFrame(){
		this.vx	+= this.ax;
		this.x	+= this.vx;		
	}


	get x(){	return parseFloat(this.element.style.left);	}
	set x(i){	this.element.style.left = i + "px";			}

	get y(){	return parseFloat(this.element.style.top);	}
	set y(i){	this.element.style.top = i + "px";			}
}


class Flick{

	constructor(opts){
		opts = opts || {};

		/** Record the instance's initial value/time */
		this.initValue		=	opts.initValue	|| 0;
		this.initTime		=	opts.initTime	|| window.performance.now();

		/** Determine how far/fast it needs to travel to fire something */
		this.maxValue		=	opts.maxValue	|| 600;
		this.maxTime		=	opts.maxTime	|| 1000;

		/** Callbacks */
		this.done			=	opts.done   || () => {};
		this.expire			=	opts.expire || () => {};
	}


	update(value, time){
		if(undefined === this.result){
			time = time || window.performance.now();

			let timeDiff	= time - this.initTime;

			if(timeDiff >= this.maxTime){
				this.result = false;
				this.expire();
			}

			else if(Math.abs(value - this.initValue) >= this.maxValue){
				this.result = true;
				this.done();
			}
		}
	}
}





let	speedometer = document.getElementById("speedometer"),
	subject		= document.getElementById("subject");



var flick;

subject.addEventListener("scroll", function(e){
	var y	=	e.target.scrollTop;

	if(!flick)
		flick	=	new Flick({
			initValue:		y,
			maxValue:		200,
			maxTime:		50,
			done:	function(){
				console.info("YA ESTA!");
				flick = null;
			},

			expire: function(){
				console.error("LENTO, HOMBRE");
				flick = null;
			}
		});

	else{
		flick.update(y);
	}
});
