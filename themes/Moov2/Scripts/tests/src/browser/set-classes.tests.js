/* global $ */
"use strict";

var assert = require('chai').assert;

suite('browser/setClasses', function() {
	var setClasses = require('browser/set-classes'),
		$html = $('html');
	
	setup(function () {

		// remove any CSS classes from root node.
		$html.prop('class', '');
	});
	
	test('should set `js` class on head of document', function () {
		setClasses();
	
		assert.isTrue($html.prop('class').split(' ').indexOf('js') > -1);
	});
	
	test('should remove `no-js` class from head of document', function () {
		$html.prop('class', 'no-js');
		
		setClasses();
		
		assert.isTrue($html.prop('class').split(' ').indexOf('no-js') === -1);
	});
	
	test('should remove `is-preload` class from head of document', function () {
		$html.prop('class', 'is-preload');
		
		setClasses();
		
		assert.isTrue($html.prop('class').split(' ').indexOf('is-preload') === -1);
	});
});