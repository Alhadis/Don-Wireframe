"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SDD_CLASS_ACTIVE = "active";
var SDD_CLASS_OPEN = "open";
var SDD_ACTIVE_NAME = "activeStyledDropdown";

var StyledDropdown = (function () {
	function StyledDropdown(element) {
		var _this = this;

		_classCallCheck(this, StyledDropdown);

		this.element = element;
		this.field = element.querySelector("select");
		this.optionList = element.querySelector(".opts");
		this.options = this.optionList.children;

		if (!this.options.forEach) this.options.forEach = Array.prototype.forEach;

		window.addEventListener("click", function (e) {
			return _this.onClick(e);
		});
		window.addEventListener("keyup", function (e) {
			return _this.onKeyUp(e);
		});
	}

	/** Get/set whether the dropdown's currently opened */

	_createClass(StyledDropdown, [{
		key: "onClick",

		/**
   * Handler to toggle menus and select items when clicked/pressed.
   *
   * @param {MouseEvent} e
   */
		value: function onClick(e) {
			var t = e.target,
			    clickedOption = undefined;

			/** Check if the clicked target was one of the dropdown's options */
			if (this.open) for (var i = 0, l = this.options.length; i < l; ++i) {
				if (this.options[i] === e.target) {
					this.selectedIndex = i;
					break;
				}
			}

			if (this.element.contains(t)) {
				this.open = !this.open;
				e.preventDefault();
				return false;
			} else this.open = false;
		}

		/**
   * Handler to close menu if the escape key's been punched
   *
   * @param {KeyboardEvent} e
   */
	}, {
		key: "onKeyUp",
		value: function onKeyUp(e) {
			switch (e.keyCode) {
				case 27:
					{
						/** ESC key */
						this.open = false;
						break;
					}
			}
		}
	}, {
		key: "open",
		get: function get() {
			var e = this.element;
			return e && e.classList.contains(SDD_CLASS_OPEN);
		},
		set: function set(i) {
			var e = this.element;

			if (e) {
				var opened = e.classList.toggle(SDD_CLASS_OPEN, i);
				if (opened) document[SDD_ACTIVE_NAME] = this;

				/** Remove reference to instance if it was the last one that was opened */
				else if (!opened && document[SDD_ACTIVE_NAME] == this) document[SDD_ACTIVE_NAME] = null;
			}
		}

		/** Get/set the zero-based index of the currently-selected option */
	}, {
		key: "selectedIndex",
		get: function get() {
			return this.field.selectedIndex;
		},
		set: function set(i) {
			this.options.forEach(function (e, index) {
				e.classList.toggle(SDD_CLASS_ACTIVE, index === i);
			});
			this.field.selectedIndex = i;

			/** TODO: Use modern event constructors and find a way to support IE separately * /
   let changed = new Event("change", {
   	bubbles: true,
   	cancelable: false
   }); /**/

			/** The following two lines are deprecated and should be replaced with what's above (but IE's too shit) */
			var changed = document.createEvent("Event");
			changed.initEvent("change", true, false);

			this.field.dispatchEvent(changed);
		}
	}]);

	return StyledDropdown;
})();

