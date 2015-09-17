"use strict";

class Drag{

	constructor(target, opts){
		this.target		= target;
		
		/** Extract options */
		opts			= opts || {};
		this.onDrag		= opts.onDrag || this.onDrag || null;

		this.onRelease	= this.onRelease.bind(this);
		this.onMove		= this.onMove.bind(this);
		this.dragging	= true;
	}


	set dragging(i){
		let action	= i ? "add" : "remove";
		let method	= action + "EventListener";

		this.target.classList[action]("dragging");
		window[method]("mousemove", this.onMove);
		window[method]("mouseup", this.onRelease);
		window[method]("blur", this.onRelease);
	}


	dragTo(x, y){
		this.target.style.transform = "translate3d("+x+"px, "+y+"px, 0)";
	}


	onMove(e){
		this.dragTo(e.pageX, e.pageY);
		if(this.onDrag)
			this.onDrag.call(this, e);
	}

	onRelease(e){
		this.dragTo(e.pageX, e.pageY);
		this.dragging = false;
	}
	
}
