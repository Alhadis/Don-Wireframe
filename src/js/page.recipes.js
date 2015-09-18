(function(){
	"use strict";

	var byRange		= document.getElementById('filter-range');
	var byMeal		= document.getElementById('filter-meal');


	document.querySelectorAll(".sdd").forEach(function(e){
		new StyledDropdown(e);

		e.addEventListener("change", function(e){
			var	target	= e.target,
				form	= target.form,
				c;

			for(var i = 0, l = form.length; i < l; ++i){
				c	= form[i];

				/** Prevent unused filters clogging up the URL */
				if("SELECT" === c.tagName && target !== c)
					c.value =
					c.name  = "";
			}

			e.target.form.submit();
		});
	});
}());
