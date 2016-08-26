/* global $ */

"use strict";

var assert = require('chai').assert,
	helpers = require('helpers');

suite('components/toggleCss', function() {
	var toggleCss = require('components/toggle-css');
	
	/**
	 * Helper that adds an example DOM element to the sandbox container.
	 */
	var addValidElementToDom = function (count) {
		count = count || 1;
		
		for (var i = 0; i < count; i++) {
			helpers.addHtml('<a href="#toggle-css-test" class="js-toggle-css" data-target=".js-element" data-css="is-active"></a>');
		}
	};
	
	setup(function () {
		helpers.addHtml('<div class="js-element"></div>');
	});
	
	teardown(function () {
		helpers.cleanDom();
	});
	
	suite('return', function () {
		test('empty when no elements', function () {
			assert.equal(0, toggleCss().length);
		});
		
		test('excludes invalid elements', function () {
			var expectedLength = 1;
			
			helpers.addHtml('<div class="js-toggle-css" data-css="is-active"></div>');
			helpers.addHtml('<div class="js-toggle-css" data-target=".js-element"></div>');
			addValidElementToDom(expectedLength);
			
			assert.equal(expectedLength, toggleCss().length);
		});
		
		test('contains object for each valid element', function () {
			var expectedLength = 3;
			
			addValidElementToDom(expectedLength);
			
			assert.equal(expectedLength, toggleCss().length);
		});
	});
	
	suite('clicking element', function () {
		var $target;
		
		setup(function () {
			$target = $('.js-element');
			
			addValidElementToDom();
			toggleCss();	
		});
	
		test('adds class when target doesn\'t have CSS applied', function () {
			helpers.click('.js-toggle-css');

			var classes = $target.attr('class') ? $target.attr('class').split(' ') : [];
			assert.isTrue(classes.indexOf('is-active') >= 0);
		});
		
		test('removes class when target already has CSS applied', function () {
			$target.addClass('is-active');

			helpers.click('.js-toggle-css');
			
			var classes = $target.attr('class') ? $target.attr('class').split(' ') : [];
			assert.isTrue(classes.indexOf('is-active') === -1);
		});
		
		test('should not modify URL when adding CSS', function () {
			helpers.click('.js-toggle-css');
			
			assert.isTrue(window.location.href.indexOf('#toggle-css-test') === -1);
		});
		
		test('should not modify URL when removing CSS', function () {
			$target.addClass('is-active');
			
			helpers.click('.js-toggle-css');
			
			assert.isTrue(window.location.href.indexOf('#toggle-css-test') === -1);
		});
	});
});