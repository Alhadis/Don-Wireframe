/**
 * Clamp a value to ensure it sits within a designated range.
 *
 * Called with no arguments, this function returns a value to fall
 * between 0 - 1, offering a useful shorthand for validating multipliers.
 *
 * @param {Number} input - Value to operate upon
 * @param {Number} min - Lower threshold; defaults to 0
 * @param {Number} max - Upper threshold; defaults to 1
 * @return {Number}
 */
function clamp(input, min, max){
	return Math.min(Math.max(input, min || 0), undefined === max ? 1 : max);
}



/**
 * Wrapper for creating a new DOM element, optionally assigning it a hash of properties upon construction.
 *
 * @param {String} nodeType - Element type to create.
 * @param {Object} obj - An optional hash of properties to assign the newly-created object.
 * @return {Element}
 */
function New(nodeType, obj){
	var	node	=	document.createElement(nodeType), i,
		absorb	=	function(a, b){
			for(i in b)
				if(Object(a[i]) === a[i] && Object(b[i]) === b[i])
					absorb(a[i], b[i]);
				else a[i] =	b[i];
		};
	if(obj) absorb(node, obj);
	return node;
}



/** Returns the DOM property name of a designated CSS property. */
function cssPropPrefix(n){
	s	=	document.documentElement.style;
	if((prop = n.toLowerCase()) in s) return prop;
	for(var prop, s, p = "Webkit Moz Ms O Khtml", p = (p.toLowerCase() + p).split(" "), i = 0; i < 10; ++i)
		if((prop = p[i]+n) in s) return prop;
	return "";
}



/**
 * Stops a function from firing too quickly.
 *
 * This method returns a copy of the original function that runs only after the designated
 * number of milliseconds have elapsed. Useful for throttling onResize handlers.
 *
 * @param {Number} limit - Threshold to stall execution by, in milliseconds.
 * @param {Boolean} soon - If TRUE, will call the function *before* the threshold's elapsed, rather than after.
 * @return {Function}
 */
Function.prototype.debounce	=	function(limit, soon){
	var fn		=	this,
		limit	=	limit < 0 ? 0 : limit,
		started, context, args, timer,


		delayed	=	function(){

			/** Get the time between now and when the function was first fired. */
			var timeSince	=	Date.now() - started;

			if(timeSince >= limit){
				if(!soon) fn.apply(context, args);
				if(timer) clearTimeout(timer);
				timer = context = args	=	null;
			}

			else timer = setTimeout(delayed, limit - timeSince);
		};


	/** Debounced copy of the original function. */
	return function(){
		context		=	this,
		args		=	arguments;

		if(!limit)
			return fn.apply(context, args);

		started	=	Date.now();
		if(!timer){
			if(soon) fn.apply(context, args);
			timer	=	setTimeout(delayed, limit);
		}
	};
};
