(function(){
	"use strict";



	var Cleaver	=	function(opts){
		var THIS		=	this,
			BOX			=	"getBoundingClientRect",
			ADD			=	"add",
			REMOVE		=	"remove",
			htmlClass	=	document.documentElement.classList,

			blade		=	opts.blade,
			sheath		=	opts.sheath,
			animations	=	opts.animations || [],
			numAnim		=	animations.length,


			/** Once scrolled past this element's top edge, the nav/logo becomes fixed */
			scraper		=	opts.scraper,


			/** The fixed-position logo that splits the nav in two */
			blade		=	opts.blade,


			keyedRange	=	function(value, object){
				var i, range, min, max;
				for(i in object){
					range	=	i.split(/\s*[-+]\s*/gm).filter(function(a){return a});
					min		=	+range[0];
					max		=	+range[1];
					if(value >= min && (!max || value < max))
						return object[i];
				}
			},



			/** Internal/ad-hoc crap */
			thresholds	=	opts.thresholds  || [],
			menuHeights	=	opts.menuHeights || [],
			navLeft		=	animations[1].el,
			isLocked	=	scraper[BOX]().top - keyedRange(window.innerWidth, menuHeights) <= 0,


			/** Interpolates the scale/transforms of each element */
			setProgress		=	function(value){
				if(value > 1) value = 1;

				var width	=	window.innerWidth;
				for(var a, r, from, to, v, i = 0; i < numAnim; ++i){
					a		=	animations[i];
					v		=	a.values;
					r		=	keyedRange(width, v[1]);
					from	=	r[0];
					to		=	r[1] === null ? (sheath.offsetWidth / a.el.offsetWidth) : r[1];

					var result	=	v[0] + (from + ((to - from) * value)) + v[2] + v[3];
					a.el.style[a.property]	=	result;
				}
			},


			/** Scroll handler: not debounced to provide the smoothest effect. */
			onScroll	=	function(e){
				var	diff,
					bladeBox	=	blade[BOX](),
					sheathBox	=	sheath[BOX](),
					scraperBox	=	scraper[BOX](),
					navBox		=	navLeft[BOX](),
					width		=	window.innerWidth,
					isLocked	=	scraperBox.top - keyedRange(width, menuHeights) <= 0;

					htmlClass[isLocked ? ADD : REMOVE]("pin-nav");


				/** Above the fold line */
				if(!isLocked){

					/** Blade's sinking into the meat... */
					if((diff = bladeBox.bottom - sheathBox.top) >= 0){
						setProgress(diff / keyedRange(width, thresholds));
						
						
						htmlClass[ sheathBox.top < bladeBox.top	?	ADD : REMOVE]("pin-logo");
					}

					/** Nope, the blade's far above the meat */
					else setProgress(0);
				}


				/** Below the fold, far enough that the nav's been stuck to the window's top-edge */
				else{
					htmlClass.add("pin-logo");
					setProgress(1);
				}
			};

			onScroll();
			setTimeout(onScroll, 20);


		window.addEventListener("scroll", onScroll);
		window.addEventListener("resize", (function(e){
			onScroll();
		}).debounce(20));
	};



	/** Export */
	window.Cleaver	=	Cleaver;
}());
