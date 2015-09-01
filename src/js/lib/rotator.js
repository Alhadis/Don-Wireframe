(function(){
	"use strict";
	
	/*< Helper functions */
		/** Strips any text nodes from the immediate descendants of an element. */
		function pruneTextNodes(e,i){if(!e||!e.childNodes.length)return e;e.normalize();var t=e.lastChild,n=/^\s*$/;if(3===t.nodeType&&(!i||n.test(t.data))){e.removeChild(t);t=e.lastChild;if(!t)return e}while(t=t.previousSibling)if(3===t.nodeType&&(!i||n.test(t.data)))e.removeChild((t=t.nextSibling).previousSibling);return e};
	/*>/


	/*<*/
	var DOC		=	document,
		WIN		=	window,
		BODY	=	DOC.body,
		TRUE	=	true,
		FALSE	=	false,
		OBJ		=	Object,
		
		/** Dictionary */
		TEXT_CONTENT	=	"textContent",
		QUERY			=	"querySelector",
		QUERY_ALL		=	QUERY+"All",
		ADD_LISTENER	=	"addEventListener",
		POINT_EVENT		=	"click",
		RESIZE			=	"resize",
		STRING			=	"string",
		PROTOTYPE		=	"prototype",
		/*>*/



		Rotator		=	function(el, args){

			/** Pointer to the Rotator instance being created. */
			var THIS			=	this,


			/** Internal values for our getter/setter methods. */
				currentSlide	=	NaN,
				autoplay		=	0,
				autoplayTimer;


			OBJ.defineProperties(THIS, {

				/** Index of the currently visible slide. */
				currentSlide:{
					get: function(){ return currentSlide; },
					set: function(i){
						var max	=	THIS.slides.children.length - 1;

							 if(i < 0)		i = THIS.wrap ? max : 0;
						else if(i > max)	i = THIS.wrap ? 0 : max;

						currentSlide	=	i;
						THIS.update();

						/** If autoplaying, clear the last timer (if it was still running) and ready another automatic transition. */
						if(THIS.autoplay){
							clearTimeout(autoplayTimer);
							autoplayTimer = setTimeout(function(){ ++THIS.currentSlide; }, THIS.autoplay);
						}
					}
				},


				/** Number of milliseconds between automated transitions. */
				autoplay: {
					get:	function(){ return autoplay; },
					set:	function(i){

						/** Stay positive */
						if(i < 0) i = 0;

						/** No change? Bail. */
						if(i == autoplay) return;

						clearTimeout(autoplayTimer);
						if(i) autoplayTimer = setTimeout(function(){ ++THIS.currentSlide; }, i);

						autoplay = i;
					}
				}
			});


			/** Start assigning our arguments. */
			for(var i in args) THIS[i]	=	args[i];


			/** Tie a reference to the outer-most container defining our rotator. */
			THIS.el			=	el;

			/** Hook into its descendants. */
			THIS.navPrev	=	 (STRING === typeof THIS.navPrev)	? el[QUERY](THIS.navPrev)	:	THIS.navPrev;
			THIS.navNext	=	 (STRING === typeof THIS.navNext)	? el[QUERY](THIS.navNext)	:	THIS.navNext;
			THIS.slides		=	((STRING === typeof THIS.slides)	? el[QUERY](THIS.slides)	:	THIS.slides) || el;



			/** Good grief, IE8. Get it together. */
			if(!THIS.slides.children)
				OBJ.defineProperty(THIS.slides, "children", {
					get:	function(){
						for(var output = [], i = 0, c = this.childNodes, l = c.length; i < l; ++i)
							if(Node.ELEMENT_NODE === c[i].nodeType)
								output.push(c[i]);
						return output;
					}
				});



			/** Make DOM traversal easier. */
			if(!THIS.keepTextNodes)
				pruneTextNodes(THIS.slides);



			/** Event listeners */
			!THIS.navPrev || THIS.navPrev[ ADD_LISTENER ](POINT_EVENT, function(e){ --THIS.currentSlide; });
			!THIS.navNext || THIS.navNext[ ADD_LISTENER ](POINT_EVENT, function(e){ ++THIS.currentSlide; });

			DOC[ADD_LISTENER]("visibilitychange", function(){
				var state	=	this.visibilityState;

				if(THIS.autoplay){
					/** Window's losing focus/visibility: don't bother running transitions. */
					if(state === "unloaded" || state === "hidden")
						clearTimeout(autoplayTimer);

					/** Otherwise, we're gaining visibility, let's go. */
					else THIS.currentSlide	=	currentSlide;
				}
			});

			THIS.currentSlide	=	0;
			return THIS;
		};



		/** Define the Rotator class's default properties/methods. */
		Rotator[PROTOTYPE]	=	{

			/** Default DOM selectors. */
			navPrev:	".n.prev",
			navNext:	".n.next",
			slides:		"ul",


			/** Name of the CSS class applied to denote an active/displayed slide. */
			activeClass:	"active",

			/** Whether to wrap the slides list to the first or last item if setting .currentSlide out of bounds. */
			wrap:	true,


			/** Updates the active slide based on the .currentSlide property. */
			update:	function(){
				var	THIS		=	this,
					index		=	THIS.currentSlide,
					children	=	THIS.slides.children,
					length		=	children.length,
					rClass		=	new RegExp("(^|\\s)" + THIS.activeClass + "(?:\\s|$)", "g"),
					c, i		=	0;

				for(; i < length; ++i){
					c				=	children[i];

					/** IE9 and below don't support DOMTokenList/.classList. We'll do things the trickier way. */
					c.className		=	c.className.replace(rClass, "$1");

					if(i === index)
						c.className +=	THIS.activeClass;
				}
			}
		};
	
	
	/** Export */
	WIN.Rotator	=	Rotator;
}());
