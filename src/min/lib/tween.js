"use strict";

(function () {
	"use strict";

	/*<*/
	var UNDEF,
	   

	/** Applies De Casteljau's algorithm to an array of points to ascertain the final midpoint. */
	deCasteljau = function deCasteljau(points, p) {
		var a,
		    b,
		    i,
		    p = p || .5,
		    midpoints = [];

		while (points.length > 1) {

			for (i = 0; i < points.length - 1; ++i) {
				a = points[i];
				b = points[i + 1];

				midpoints.push([a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]);
			}

			points = midpoints;
			midpoints = [];
		}

		return [points[0], a, b];
	},
	   
	/*>*/

	Tween = function Tween(args) {

		/** Mandatory arguments */
		var from = args.from,
		    to = args.to,
		    target = args.target,
		    property = args.property,
		   

		/** Optional: uses default values if omitted */
		suffix = args.suffix || "",
		    points = args.curve || Tween.LINEAR,
		    duration = args.duration || 1000,
		    fps = args.fps || 60,
		   

		/** Optional: ignored if omitted */
		onStep = args.onStep,
		    onDone = args.onDone,
		   

		/** Internal use */
		delay = 1 / fps * 1000,
		   

		/** Function called repeatedly to update the targeted property */
		step = function step(progress, iterations) {

			var midpoint = deCasteljau(points, progress),
			    value = midpoint[0][1];

			/** Detect when the tween's finished. */
			if (value >= 1) {
				target[property] = to + suffix;

				/** If we were given a callback to execute when finished, trigger it. */
				if (UNDEF !== onDone) onDone();
			} else {
				if (progress) {
					target[property] = from + (to - from) * value + suffix;

					/** Pass two multipliers to the onStep callback: progress (timing) and value */
					if (UNDEF !== onStep) onStep(progress, value);
				}

				setTimeout(function () {
					step(delay * iterations / duration, ++iterations);
				}, delay);
			}
		};

		step(0, 0);
	};

	/** Define some preset easing functions */
	var START = [0, 0],
	    END = [1, 1],
	    EASE_START = [.42, 0],
	    EASE_END = [.58, 1];

	Tween.LINEAR = [START, END];
	Tween.EASE = [START, [.25, .1], [.25, 1], END];
	Tween.EASE_IN = [START, EASE_START, END, END];
	Tween.EASE_IN_OUT = [START, EASE_START, EASE_END, END];
	Tween.EASE_OUT = [START, START, EASE_END, END];

	/** Export */
	window.Tween = Tween;
})();

