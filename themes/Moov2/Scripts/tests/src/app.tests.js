"use strict";

var assert = require('chai').assert,
	sinon = require('sinon');

suite('app', function() {
	var app;
	
	setup(function () {
		app = require('app')();
	});
	
	suite('addLayer', function () {
		test('should call provided argument', function () {
			var testLayer = sinon.spy();
			
			app.addLayer(testLayer);
			
			assert.isTrue(testLayer.calledOnce);
		});
		
		test('should not error when argument is undefined', function () {
			app.addLayer();
		});
	});
});

