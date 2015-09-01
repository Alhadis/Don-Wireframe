(function(DOC){
	"use strict";
	var BY_ID		=	"getElementById",
		UNDEF;

	/** Masthead elements to animate as the user scrolls from the top of the page */
	var flyingDon	=	DOC[BY_ID]("flying-don"),
		top			=	DOC[BY_ID]("top"),
		logo		=	DOC[BY_ID]("logo"),
		navLeft		=	DOC[BY_ID]("topnav-l"),
		navRight	=	DOC[BY_ID]("topnav-r"),
		ourRange	=	DOC[BY_ID]("our-range"),
		pageBody	=	DOC[BY_ID]("page-body"),
		translateX	=	CSS_3D_SUPPORTED ? ["translate3d(", ",0,0)"] : ["translateX(", ")"],
		translateY	=	CSS_3D_SUPPORTED ? ["translate3d(0,", ",0)"] : ["translateY(", ")"];

	new Cleaver({
		blade:			flyingDon,
		sheath:			logo,
		scraper:		pageBody,
		thresholds:		{
			"0-600":	80,
			"601-880":	80,
			"880+":		120
		},

		menuHeights:	{
			"0-600":	0,
			"601-880":	60,
			"880+":		48
		},

		animations:	[
			{
				el:			flyingDon,
				property:	CSS_TRANSFORM,
				values:		["scale(", {
					"0-600": 	[1, null],
					"601-880":	[1, null],
					"880+":		[1, 0.666]
				}, "", ")"]
			},

			{
				el:			navLeft,
				property:	CSS_TRANSFORM,
				values:		[translateX[0], {
					"0-600": 	[0, 0],
					"601-880":	[0, 0],
					"880+":		[0, -6]
				}, "em", translateX[1]]
			},

			{
				el:			navRight,
				property:	CSS_TRANSFORM,
				values:		[translateX[0], {
					"0-600":	[0, 0],
					"601-880":	[0, 0],
					"880+":		[0, 6]
				}, "em", translateX[1]]
			},


			{
				el:			ourRange,
				property:	CSS_TRANSFORM,
				values:		[translateY[0], {
					"0-600": 	[0, 2.5],
					"601-880":	[0, 2.5],
					"880+":		[0, 4.5]
				}, "em", translateY[1]]
			},


			{
				el:			top,
				property:	"height",
				values:		["", {
					"0-600":	[2.875, 2.875],
					"601-880":	[2.875, 2.875],
					"880+":		[3.5, 4.5]
				}, "em", ""]
			}
		]
	});


	/** Masthead images gently fading in and out */
	new Rotator(DOC[BY_ID]("hero"), {autoplay: 5000});


	/**
	 * Scrolls the user to the page's navigation menu.
	 *
	 * @param {Boolean} openMenu - Opens the nav menu when finished (mobile only)
	 */
	function scrollToNav(openMenu){
		var from	=	scrollY,
			to		=	top.getBoundingClientRect().top;

		new Tween({
			target:		window,
			property:	"scrollOffset",
			curve:		Tween.EASE,
			from:		from,
			to:			scrollY + to,
			duration:	1000,
			onDone:		openMenu ? function(){
				DOC[BY_ID]("mode-1").checked = false;
			} : UNDEF
		});
	}


	/** "Scroll down" button (only on mobile) */
	var cta	=	DOC[BY_ID]("cta");
	cta.addEventListener("click", function(e){
		scrollToNav(true);
		e.preventDefault();
		return false;
	});
}(document));
