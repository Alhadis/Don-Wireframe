"use strict";var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||false;i.configurable=true;if("value"in i)i.writable=true;Object.defineProperty(e,i.key,i)}}return function(t,n,i){if(n)e(t.prototype,n);if(i)e(t,i);return t}}();function _classCallCheck(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}var SDD_CLASS_ACTIVE="active";var SDD_CLASS_OPEN="open";var SDD_ACTIVE_NAME="activeStyledDropdown";var StyledDropdown=function(){function e(t){var n=this;_classCallCheck(this,e);this.element=t;this.field=t.querySelector("select");this.optionList=t.querySelector(".opts");this.options=this.optionList.children;if(!this.options.forEach)this.options.forEach=Array.prototype.forEach;window.addEventListener("click",function(e){return n.onClick(e)});window.addEventListener("keyup",function(e){return n.onKeyUp(e)})}_createClass(e,[{key:"onClick",value:function t(e){var t=e.target,n=undefined;if(this.open)for(var i=0,o=this.options.length;i<o;++i){if(this.options[i]===e.target){this.selectedIndex=i;break}}if(this.element.contains(t)){this.open=!this.open;e.preventDefault();return false}else this.open=false}},{key:"onKeyUp",value:function n(e){switch(e.keyCode){case 27:{this.open=false;break}}}},{key:"open",get:function i(){var e=this.element;return e&&e.classList.contains(SDD_CLASS_OPEN)},set:function o(e){var t=this.element;if(t){var n=t.classList.toggle(SDD_CLASS_OPEN,e);if(n)document[SDD_ACTIVE_NAME]=this;else if(!n&&document[SDD_ACTIVE_NAME]==this)document[SDD_ACTIVE_NAME]=null}}},{key:"selectedIndex",get:function r(){return this.field.selectedIndex},set:function s(e){this.options.forEach(function(t,n){t.classList.toggle(SDD_CLASS_ACTIVE,n===e)});this.field.selectedIndex=e;var t=document.createEvent("Event");t.initEvent("change",true,false);this.field.dispatchEvent(t)}}]);return e}();"use strict";(function(){var e=document.getElementById("filter-range");var t=document.getElementById("filter-meal");document.querySelectorAll(".sdd").forEach(function(e){new StyledDropdown(e);e.addEventListener("change",function(e){var t=e.target,n=t.form,i;for(var o=0,r=n.length;o<r;++o){i=n[o];if("SELECT"===i.tagName&&t!==i)i.value=i.name=""}e.target.form.submit()})})})();