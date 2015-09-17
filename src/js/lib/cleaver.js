(function(){
	"use strict";



	var Cleaver	=	function(opts){
		var THIS		=	this,
			BOX			=	"getBoundingClientRect",
			ADD			=	"add",
			REMOVE		=	"remove",
			PIN_CLASS	=	"pin-logo",
			htmlClass	=	document.documentElement.classList,

			blade		=	opts.blade,
			sheath		=	opts.sheath,
			animations	=	opts.animations || [],
			numAnim		=	animations.length,
			burger		=	document.querySelector("#mode-1") || {},


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
			belowFold	=	scraper[BOX]().top - keyedRange(window.innerWidth, menuHeights) <= 0,


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


			/** Updates the position of each affected element */
			redraw	=	function(e){
				var	diff,
					PIN_NAV		=	"pin-nav",
					bladeBox	=	blade[BOX](),
					sheathBox	=	sheath[BOX](),
					scraperBox	=	scraper[BOX](),
					navBox		=	navLeft[BOX](),
					width		=	window.innerWidth,
					belowFold	=	scraperBox.top - keyedRange(width, menuHeights) <= 0;



				/** Above the fold line */
				if(!belowFold){
					htmlClass.remove(PIN_NAV);
					burger.checked	=	true;

					/** Blade's sinking into the meat... */
					if((diff = bladeBox.bottom - sheathBox.top) >= 0){
						setProgress(diff / keyedRange(width, thresholds));
						htmlClass[ sheathBox.top < bladeBox.top	? ADD : REMOVE](PIN_CLASS);
					}

					/** Nope, the blade's far above the meat */
					else{
						htmlClass[REMOVE](PIN_CLASS);
						setProgress(0);
					}
				}


				/** Below the fold, far enough that the nav's been stuck to the window's top-edge */
				else{
					htmlClass.add(PIN_CLASS);
					htmlClass.add(PIN_NAV);
					setProgress(1);
				}

				/** Queue the next frame */
				window.requestAnimationFrame(redraw);
			};

		window.requestAnimationFrame(redraw);
		window.addEventListener("resize", redraw);
	};



	/** Export */
	window.Cleaver	=	Cleaver;
}());
