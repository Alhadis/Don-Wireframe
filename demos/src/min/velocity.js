"use strict";

/**
 * Creates a bouncy ball to flick around the screen.
 */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ball = (function () {
	function Ball(x, y) {
		_classCallCheck(this, Ball);

		var div = document.body.appendChild(document.createElement("div"));
		div.className = "ball";

		this.element = div;
		this.x = x || 500;
		this.y = y || 500;

		this.vx = 0;
		this.ax = .2;

		var counter = 0;
		var onEnterFrame = (function (time) {
			this.vx += this.ax;
			this.x += this.vx;
			++counter;
			if (counter < 100) window.requestAnimationFrame(onEnterFrame);
		}).bind(this);

		window.requestAnimationFrame(onEnterFrame);
	}

	_createClass(Ball, [{
		key: "x",
		get: function get() {
			return parseFloat(this.element.style.left);
		},
		set: function set(i) {
			this.element.style.left = i + "px";
		}
	}, {
		key: "y",
		get: function get() {
			return parseFloat(this.element.style.top);
		},
		set: function set(i) {
			this.element.style.top = i + "px";
		}
	}]);

	return Ball;
})();

var speedometer = document.getElementById("speedometer"),
    subject = document.getElementById("subject");

subject.addEventListener("scroll", function (e) {});

