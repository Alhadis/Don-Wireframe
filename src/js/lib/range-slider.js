(function(){
	"use strict";

	/*<*/
	var	QUERY		=	"querySelector",
		QUERY_ALL	=	QUERY + "All",
		ADD			=	"add",
		REMOVE		=	"remove",
		CLICK		=	"click",
		WIN			=	window,

		translateX	=	WIN.CSS_3D ? ["translate3d(", ",0,0)"] : ["translateX(", ")"],
		translateY	=	WIN.CSS_3D ? ["translate3d(0,", ",0)"] : ["translateY(", ")"];
	/*>*/



	var RangeSlider	=	function(node, opts){
		var THIS		=	this,
			opts		=	opts || {},

			/** Range entries */
			items		=	node.children,

			pointer		=	opts.pointer,	/** Arrowhead pointing to selected product */
			details		=	opts.details,	/** Item details, displayed on selection */
			prev		=	opts.prev,		/** Button to navigate backwards */
			next		=	opts.next,		/** Button to navigate forwards */


			/** Internal index of the currently-selected product */
			activeIndex	=	0,
			
			/** Internal value of the slideOffset property */
			columnOffset =	0,


			/** CSS class applied to selected products/details */
			activeClass	=	opts.activeClass || "active",


			/** CSS class applied to navigation arrows when one's hit the end of the reel */
			navEndClass	=	opts.navEndClass || "end",



			/**
			 * Internal helper function to reposition the pointer element and apply appropriate
			 * classes to HTML elements. Called when the viewport's size changes or a different
			 * item's been selected.
			 */
			refresh		= function(){
				
				/** Sanitise the column offset */
				THIS.columnOffset = columnOffset;

				/** Update which item's displayed in the detail view */
				details.children.forEach(function(e, index){
					e.classList[index === activeIndex ? ADD : REMOVE](activeClass);
				});


				/** Shift the pointer element if we have one */
				if(pointer){
					var width	= THIS.width;
					pointer.style[WIN.CSS_TRANSFORM] = translateX.join(
						((((activeIndex - columnOffset) / THIS.columns) * width) - width / 2) + (THIS.columnWidth / 2) + "px"
					);
				}
			};




		Object.defineProperties(THIS, {

			/** Zero-based index of the currently-selected/highlighted item. */
			activeIndex: {
				get: function(){ return activeIndex },
				set: function(i){
					i = clamp(Math.floor(i), 0, items.length - 1);
					if(i === activeIndex) return;
					activeIndex = i;
					refresh();
				}
			},


			/** Number of columns that're slid to the left */
			columnOffset: {
				get: function(){ return columnOffset },
				set: function(i){
					var max = items.length - THIS.columns;
					i = clamp(i, 0, max);


					/** Determine if any navigation arrows should be faded out */
					next && next.classList[(i >= max  &&  activeIndex >= THIS.columns)  ? ADD : REMOVE](navEndClass);
					prev && prev.classList[(i === 0   && !activeIndex)                  ? ADD : REMOVE](navEndClass);

					if(i === columnOffset) return;

					items.forEach(function(e){
						e.style[WIN.CSS_TRANSFORM] = translateX.join(-100 * i + "%");
					});

					columnOffset = i;
				}
			},

			
			/** Read-only access to the slider container's current width in pixels */
			width: {
				get: function(){ return node.getBoundingClientRect().width; }
			},

			/** Read-only access to the current width of each column */
			columnWidth: {
				get: function(){
					return items[0].getBoundingClientRect().width;
				}
			},

			/** Returns the current number of columns. Read-only. */
			columns: {
				get: function(){
					return Math.round(THIS.width / THIS.columnWidth);
				}
			}
		});


		/** Update pointer's position when viewport boundaries change; the column-count might change. */
		WIN.addEventListener("resize", function(){
			var col = THIS.columns;

			/** If the column count's dropped, and the active product's now out-of-sight, fix that. */
			if(activeIndex >= col)
				THIS.activeIndex = col - 1;

			setTimeout(refresh, 50);
		});



		/** Display each item's details on rollover */
		items.forEach(function(e, i){
			e.addEventListener("mouseover", function(){
				if(i >= columnOffset && i <= THIS.columns + columnOffset)
					THIS.activeIndex = i;
			});
		});


		/** Navigation handlers */
		prev && prev.addEventListener(CLICK, function(e){ --THIS.columnOffset; --THIS.activeIndex; });
		next && next.addEventListener(CLICK, function(e){ ++THIS.columnOffset; ++THIS.activeIndex; });

		THIS.activeIndex = THIS.columns / 2;
	};


	/** Export */
	WIN.RangeSlider = RangeSlider;
}());
