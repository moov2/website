"use strict";

var assert = require('chai').assert,
	sinon = require('sinon');

suite('browser', function() {
	var browser = require('browser');
	
	test('should call provided enhancements', function () {
		var spies = [sinon.spy(), sinon.spy(), sinon.spy()];
		browser(spies);
		
		for (var i = 0; i < spies.length; i++) {
			assert.isTrue(spies[i].calledOnce);
		}
	});
});