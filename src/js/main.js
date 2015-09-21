(function(){
	
var	DOC				=	document,
	WIN				=	window,
	QUERY			=	"querySelector",
	QUERY_ALL		=	QUERY + "All",
	BY_CLASS		=	"getElementsByClassName",
	ADD_LISTENER	=	"addEventListener",
	UNDEF,


	/** Top navigation menu */
	top			=  DOC[QUERY]("#top"),
	topnav		=  DOC[QUERY]("#topnav"),
	topnavCtrl	=  DOC.getElementById("mode-1"),
	subMenus	=  topnav[BY_CLASS]("sub-menu"),


	/** Folding regions toggled by pure CSS */	
	folds		=  DOC[BY_CLASS]("fold"),


	/** Huge flying DON logo */
	flyingDon	=  DOC[QUERY]("#flying-don");



	/** Augment DOM interfaces with useful JavaScript methods */
	NodeList.prototype.forEach			=
	HTMLCollection.prototype.forEach	=	Array.prototype.forEach;
	if(WIN.StaticNodeList)
		WIN.StaticNodeList				=	Array.prototype.forEach;


	/** Gettable/settable answer to window.scrollY; makeshift solution until Tween has a workaround */
	Object.defineProperty(WIN, "scrollOffset", {
		get:	function(){ return WIN.scrollY },
		set:	function(i){ WIN.scrollTo(0, i) }
	});


/*=============================================================================*
	COMPATIBILITY
===============================================================================*/
WIN.CSS_TRANSFORM		= cssPropPrefix("Transform"),
WIN.CSS_3D_SUPPORTED	= (function(propName){
	if(!propName) return false;

	var e	= New("div"),
		s	= e.style,
		v	= [["translateY(", ")"], ["translate3d(0,", ",0)"]]
	try{ s[propName] = v[1].join("1px"); } catch(e){}
	return v[+!!s[propName]] === v[1];
}(WIN.CSS_TRANSFORM));



/** Cross-browser shim for requestAnimationFrame */
WIN.requestAnimationFrame	=
	WIN.requestAnimationFrame || WIN.webkitAnimationFrame || WIN.mozAnimationFrame ||
	WIN.msAnimationFrame || WIN.oAnimationFrame || function(callback){ return setTimeout(callback, 1000 / 60); };




/*=============================================================================*
	EVENT LISTENERS
===============================================================================*/


/** Global resize handler */
WIN[ADD_LISTENER]("resize", (new function(){
	var fit = function(o){ o.style.maxHeight = o.scrollHeight + "px"; };

	/** Fit each folding region to the height of its content */
	folds.forEach(fit);
	subMenus.forEach(fit);

	return this.constructor;
}).debounce(80));



/** Print function for recipe pages */
hashActions({
	printPage: function(){ WIN.print(); }
});


/**
 * Toggle a CSS class when hovering over the first nav-menu item to make the arrow
 * above it "glow". The generated arrow's otherwise unreachable with CSS selectors,
 * so JavaScript's needed to complete the effect.
 */
var firstLink	=	DOC[QUERY]("#topnav-l > li > a");
firstLink[ADD_LISTENER]("mouseover", function(e){	topnav.classList.add("glow");		});
firstLink[ADD_LISTENER]("mouseout", function(e){	topnav.classList.remove("glow");	});


/** Close #topnav when the ESC key's pressed */
DOC[ADD_LISTENER]("keyup", function(e){
	if(27 === e.keyCode)
		topnavCtrl.checked = true;
});


/** Also close #topnav if the user clicks somewhere else on the page. */
DOC[ADD_LISTENER]("click", function(e){
	if(!top.contains(e.target))
		topnavCtrl.checked = true;
});


}());
