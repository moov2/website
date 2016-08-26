"use strict";

/**
 * Primary object that is executed at the entry point of the application
 * JavaScript. This modules primary function is to house the different layers
 * of the application.
 */

var app = function () {
	return {
		/**
		 * Adds new layer to application.
		 */
		addLayer: function (layer) {
			if (!layer) {
				return;
			}
			
			layer();
		}
	};
};

module.exports = app;