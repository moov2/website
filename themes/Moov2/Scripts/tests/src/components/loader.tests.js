"use strict";

var assert = require('chai').assert,
	sinon = require('sinon');

suite('components/loader', function() {
	var loader = require('components/loader');
	
	test('should initiate provided components', function () {
		var spies = [sinon.spy(), sinon.spy(), sinon.spy()];
		
		loader(spies);
		
		for (var i = 0; i < spies.length; i++) {
			assert.isTrue(spies[i].calledOnce);
		}
	});
});