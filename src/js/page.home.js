(function(DOC){
	"use strict";

	var BY_ID		=	"getElementById",
		QUERY		=	"querySelector",
		QUERY_ALL	=	QUERY + "All",
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
	var hero = DOC[BY_ID]("hero");
	new Rotator(hero, {autoplay: 5000});


	/** Parallax, etc */
	window.addEventListener("scroll", function(e){
		hero.style.transformOrigin = "50% "+(
			(1 - Math.min(window.pageYOffset / hero.getBoundingClientRect().height, 1)) * 100
		)+"%";
	});



	/** Horizontally-sliding row of range thumbnails */
	var rangeNav	= DOC[QUERY_ALL]("#range-carousel > i");
	window.ranges	= new RangeSlider(DOC[BY_ID]("carousel-items"), {
		pointer:	DOC[QUERY]("#range-pointer > i"),
		details:	DOC[BY_ID]("range-previews"),
		prev:		rangeNav[0],
		next:		rangeNav[1]
	});
	window.ranges.pointAt = 1;




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
			onDone:		openMenu ? function(){
				DOC[BY_ID]("mode-1").checked = false;
			} : UNDEF
		});
	}


	/** "Scroll down" button (only on mobile) */
	var cta	=	DOC[BY_ID]("cta");
	cta.addEventListener("click", function(e){
		scrollToNav(false);
		e.preventDefault();
		return false;
	});




	/**
	 * When tapping the hamburger menu, prevent it opening if the user's still scrolled up.
	 * Instead, scroll the page until the menu's touching the top of the window, THEN open
	 * the menu. This prevents the user seeing an unsightly translucent menu sliding in
	 * from above the navbar, clearly visible over the masthead behind it.
	 *
	 * Due to structural issues relating to z-index and document structure, it's rather
	 * difficult to suppress this; also, the contents of the menu probably won't be fully
	 * visible until the user's far enough down the page to see them.
	 */
	DOC[ QUERY ]("#topnav > .i").addEventListener("click", function(e){

		if(!DOC.documentElement.classList.contains("pin-nav")){
			scrollToNav(true);
			e.preventDefault();
			return false;
		}

	});
}(document));
