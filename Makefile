# Directories to read/write files to/from
CSSDIR			:=	src/css
JSDIR			:=	src/js
OBJDIR			:=	src/min


# CLI arguments for each program used to build our files
OPTS_CLEANCSS	:=	--skip-advanced
OPTS_UGLIFYJS	:=	--mangle



#==============================================================================

# Primary CSS tasks
css:				css-main css-contact css-dictionary css-home css-ranges css-timeline
css-main:			$(OBJDIR)/min.css
css-contact:		$(OBJDIR)/page.contact.css
css-dictionary:		$(OBJDIR)/page.dictionary.css
css-home:			$(OBJDIR)/page.home.css
css-ranges:			$(OBJDIR)/page.range-list.css
css-timeline:		$(OBJDIR)/page.timeline.css


# Build the main/global CSS bundle
$(OBJDIR)/min.css: $(OBJDIR)/fonts.css $(OBJDIR)/global.css $(OBJDIR)/main.css
	cat $^ > $@

# Build a single CSS file
$(OBJDIR)/%.css: $(CSSDIR)/%.css
	@mkdir -p "$(@D)"
	myth $< | cleancss $(OPTS_CLEANCSS) > $@


#==============================================================================

# Primary JS tasks
js:					js-main js-home js-recipes
js-main:			$(OBJDIR)/min.js
js-home:			$(OBJDIR)/home.js
js-recipes:			$(OBJDIR)/recipes.js


# Macros
clear-subdir	=	rmdir "$(sort $(filter-out $(OBJDIR),$(1)))";
USE_STRICT		:=	"use strict";

define compress-js
	printf '%s' '$(USE_STRICT)' > $@
	cat $^ | sed -E s/'$(USE_STRICT)'//g | uglifyjs $(OPTS_UGLIFYJS) >> $@
endef



# Main/global JS
$(OBJDIR)/min.js: $(OBJDIR)/lib/utils.js $(OBJDIR)/lib/tween.js $(OBJDIR)/main.js
	$(compress-js)


# Homepage
$(OBJDIR)/home.js: $(OBJDIR)/lib/cleaver.js $(OBJDIR)/lib/rotator.js $(OBJDIR)/lib/range-slider.js $(OBJDIR)/page.home.js
	$(compress-js)
	

# Recipe listing
$(OBJDIR)/recipes.js: $(OBJDIR)/lib/sdd.js $(OBJDIR)/page.recipes.js
	$(compress-js)


# Build a single JavaScript file
$(OBJDIR)/%.js: $(JSDIR)/%.js
	@mkdir -p "$(@D)"
	babel $< > $@



#==============================================================================

# Chucks everything that was built into freakin' /dev/null
clean:
	@rm -rf $(wildcard $(OBJDIR)/*) 2>/dev/null || { echo 'Nothing to clean'; }



# Enter the Watchman
PWD := $(shell pwd)
watch:
	watchman watch $(PWD) > /dev/null
	watchman -- trigger $(PWD) remake-css $(CSSDIR)/'*.css' -- make css > /dev/null
	watchman -- trigger $(PWD) remake-js  $(JSDIR)/'*.js'   -- make js > /dev/null

unwatch:
	watchman watch-del $(PWD) > /dev/null
