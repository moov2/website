/* global $ */

"use strict";

/**
 * Useful helper functions to assist with testing.
 */

module.exports = (function () {
	/**
	 * DOM element that contains DOM elements used to assist with unit tests.
	 */
	var $sandbox = $('.js-sandbox');
	
	if ($sandbox.length === 0) {
		throw('Element with `js-sandbox` class must be added to test DOM');
	}
	
	/**
	 * Appends HTML to the sandbox element.
	 */
	var addHtml = function (html) {
		$sandbox.append(html);
	};
	
	/**
	 * Removes all HTML from the DOM sandbox.
	 */
	var cleanDom = function () {
		$sandbox.html('');
	};
	
	/**
	 * Dispatches a DOM click event from the provided element.
	 */
	var click = function (elOrSelector) {
		var $el = typeof elOrSelector.trigger === 'function' ? elOrSelector : $(elOrSelector);
		$el.trigger('click');
	};
	
	return {
		addHtml: addHtml,
		cleanDom: cleanDom,
		click: click
	};
})();

