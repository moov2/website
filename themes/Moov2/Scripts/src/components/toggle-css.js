/* global $ */

"use strict";

/**
 * When user clicks a DOM element a CSS class can be applied
 * to another element on the DOM. Below is an example of how
 * to setup toggleCss for an element on the DOM.
 * 
 * <div class="js-toggle-css" data-target=".js-target" data-css="is-active" />
 * 
 * In the example above, when the element is clicked by the user
 * the `is-active` class is toggled on any elements on the DOM whose
 * selector matches `.js-target`. If `.js-target` has `is-active`
 * as a CSS class, this will be removed when the `.js-toggle-css` element
 * is clicked, but if the `is-active` class doesn't exist it is added.
 * 
 * If the toggleCss element doesn't contain `data-target` or `data-css`
 * then it is ignored.
 */

var toggleCss = function ($el) {
	var css = $el.attr('data-css'),
		target = $el.attr('data-target'),
		$target = $(target);
	
	/**
	 * Adds event listener to element to trigger the toggling of CSS.
	 */
	var init = function () {
		if (!valid()) {
			return;
		}
	
		$el.on('click', toggle);
		
		return {
			$el: $el,
			$target: $target,
			css: css,
			toggle: toggle
		};
	};
	
	/**
	 * Toggles the CSS on the `$target` element. Function must return false
	 * in order to prevent default hyperlink behaviour.
	 */
	var toggle = function () {
		var classes = $target.attr('class').toLowerCase().split(' ');
		
		// loop over classes and removing class if match.
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] === css.toLowerCase()) {
				$target.removeClass(css);
				return false;
			}
		}
		
		$target.addClass(css);
		
		return false;
	};
	
	/**
	 * Returns flag indicating whether the element has valid attributes.
	 */
	var valid = function () {
		return css && $target.length > 0;
	};

	return init();
};

module.exports = function () {
	var SELECTOR = '.js-toggle-css',
		$els = $(SELECTOR),
		instances = [];
	
	// check if elements exist on the DOM.
	if ($els.length === 0) {
		return instances;
	}
	
	for (var i = 0; i < $els.length; i++) {
		var instance = toggleCss($($els[i]));
		
		if (instance) {
			instances.push(instance);
		}
	}
	
	return instances;
};