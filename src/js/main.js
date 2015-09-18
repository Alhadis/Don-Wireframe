var	UNDEF,

	topnav		=  document.querySelector("#topnav"),


	/** Folding regions toggled by pure CSS */	
	folds		=  document.getElementsByClassName("fold"),


	/** Huge flying DON logo */
	flyingDon	=  document.getElementById("flying-don");



	/** Augment DOM interfaces with useful JavaScript methods */
	NodeList.prototype.forEach			=
	HTMLCollection.prototype.forEach	=	Array.prototype.forEach;
	if(window.StaticNodeList)
		window.StaticNodeList			=	Array.prototype.forEach;


	/** Gettable/settable answer to window.scrollY; makeshift solution until Tween has a workaround */
	Object.defineProperty(window, "scrollOffset", {
		get:	function(){ return window.scrollY },
		set:	function(i){ window.scrollTo(0, i) }
	});


/*=============================================================================*
	COMPATIBILITY
===============================================================================*/
var	CSS_TRANSFORM		=	cssPropPrefix("Transform"),

	CSS_3D_SUPPORTED	=	(function(propName){
		if(!propName) return false;

		var e	= New("div"),
			s	= e.style,
			v	= [["translateY(", ")"], ["translate3d(0,", ",0)"]]
		try{ s[propName] = v[1].join("1px"); } catch(e){}
		return v[+!!s[propName]] === v[1];
	}(CSS_TRANSFORM));


/** Cross-browser shim for requestAnimationFrame */
window.requestAnimationFrame	=
	window.requestAnimationFrame || window.webkitAnimationFrame || window.mozAnimationFrame ||
	window.msAnimationFrame || window.oAnimationFrame || function(callback){ return setTimeout(callback, 1000 / 60); };




/*=============================================================================*
	EVENT LISTENERS
===============================================================================*/


/** Global resize handler */
window.addEventListener("resize", (new function(){


	/** Fit each folding region to the height of its content */
	folds.forEach(function(o){
		o.style.maxHeight	=	o.scrollHeight + "px";
	});

	return this.constructor;
}).debounce(80));



/** Print function for recipe pages */
hashActions({
	printPage: function(){ window.print(); }
});


/**
 * Toggle a CSS class when hovering over the first nav-menu item to make the arrow
 * above it "glow". The generated arrow's otherwise unreachable with CSS selectors,
 * so JavaScript's needed to complete the effect.
 */
var firstLink	=	document.querySelector("#topnav-l > li > a");
firstLink.addEventListener("mouseover", function(e){	topnav.classList.add("glow");		});
firstLink.addEventListener("mouseout", function(e){		topnav.classList.remove("glow");	});
