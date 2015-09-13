"use strict";

const SDD_CLASS_ACTIVE	= "active";
const SDD_CLASS_OPEN	= "open";
const SDD_ACTIVE_NAME	= "activeStyledDropdown";


class StyledDropdown{

	constructor(element){
		this.element	= element;
		this.field		= element.querySelector("select");
		this.optionList	= element.querySelector(".opts");
		this.options	= this.optionList.children;
		
		if(!this.options.forEach)
			this.options.forEach = Array.prototype.forEach;

		window.addEventListener("click", e => this.onClick(e));
		window.addEventListener("keyup", e => this.onKeyUp(e));
	}



	/** Get/set whether the dropdown's currently opened */
	get open(){
		let e = this.element;
		return e && e.classList.contains(SDD_CLASS_OPEN);
	}
	set open(i){
		let e = this.element;

		if(e){
			let opened = e.classList.toggle(SDD_CLASS_OPEN, i);
			if(opened) document[SDD_ACTIVE_NAME] = this;

			/** Remove reference to instance if it was the last one that was opened */
			else if(!opened && document[SDD_ACTIVE_NAME] == this)
				document[SDD_ACTIVE_NAME] = null;
		}
	}



	/** Get/set the zero-based index of the currently-selected option */
	get selectedIndex(){ return this.field.selectedIndex; }
	set selectedIndex(i){
		this.options.forEach((e, index) => { e.classList.toggle(SDD_CLASS_ACTIVE, index === i); });
		this.field.selectedIndex = i;

		/** TODO: Use modern event constructors and find a way to support IE separately * /
		let changed = new Event("change", {
			bubbles: true,
			cancelable: false
		}); /**/

		/** The following two lines are deprecated and should be replaced with what's above (but IE's too shit) */
		let changed = document.createEvent("Event");
		changed.initEvent("change", true, false);

		this.field.dispatchEvent(changed);
	}




	/**
	 * Handler to toggle menus and select items when clicked/pressed.
	 *
	 * @param {MouseEvent} e
	 */
	onClick(e){
		let t = e.target, clickedOption;

		/** Check if the clicked target was one of the dropdown's options */
		if(this.open) for(let i = 0, l = this.options.length; i < l; ++i){
			if(this.options[i] === e.target){
				this.selectedIndex = i;
				break;
			}
		}

		if(this.element.contains(t)){
			this.open = !this.open;
			e.preventDefault();
			return false;
		}

		else this.open = false;
	}




	/**
	 * Handler to close menu if the escape key's been punched
	 *
	 * @param {KeyboardEvent} e
	 */
	onKeyUp(e){
		switch(e.keyCode){
			case 27:{ /** ESC key */
				this.open = false;
				break;
			}
		}
	}
}
