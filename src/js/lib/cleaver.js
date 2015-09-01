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
			
			
			/** Internal/ad-hoc crap */
			navLeft		=	animations[1].el,
			isLocked	=	false,
			threshold	=	120,


			/** Interpolates the scale/transforms of each element */
			setProgress		=	function(value){
				if(value > 1) value = 1;

				for(var a, from, to, v, i = 0; i < numAnim; ++i){
					a		=	animations[i];
					v		=	a.values;
					from	=	v[1];
					to		=	v[2];
					a.el.style[a.property]	=	v[0] + (from + ((to - from) * value)) + v[3] + v[4];
				}
			},


			/** Scroll handler: not debounced to provide the smoothest effect. */
			onScroll	=	function(e){
				var	diff,
					bladeBox	=	blade[BOX](),
					sheathBox	=	sheath[BOX](),
					scraperBox	=	scraper[BOX](),
					navBox		=	navLeft[BOX](),
					isLocked	=	scraperBox.top - 48 <= 0;

					htmlClass[isLocked ? ADD : REMOVE]("pin-nav");


				/** Above the fold line */
				if(!isLocked){

					/** Blade's sinking into the meat... */
					if((diff = bladeBox.bottom - sheathBox.top) >= 0){
						setProgress(diff / threshold);
						htmlClass[ sheathBox.top < bladeBox.top	?	ADD : REMOVE]("pin-logo");
					}
					
					else setProgress(0);
				}
			};


			onScroll();


		/** Global scroll handler */
		window.addEventListener("scroll",  onScroll);
	};



	/** Export */
	window.Cleaver	=	Cleaver;
}());
