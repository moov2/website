"use strict";

/**
 * File acts as the input for browserify, which will handle compiling
 * modules into a single file. It shouldn't be necessary to add JS code
 * to this file, instead `app/app.js` should be used as the starting point
 * for JavaScript code.
 */

require('shoestring');

var app = require('app')(),
	browser = require('browser'),
	components = require('components/loader');

/**
 * Setup different layers of the application.
 */

app.addLayer(browser);
app.addLayer(components);