# Orchard Development Theme

This project offers a useful starting point for developing a theme for Orchard. Use the source files in this project as the starting point for an Orchard theme. The theme is full of useful goodies for automating development tasks and optimising the theme for deployment.

## Prerequisites

In order to work with this theme you'll need to make sure you have the following tools.

### Grunt

At Moov2, Grunt is our preferred automation tool. It's easy to get started with and extensible with hundreds of [plugins available via NPM](http://gruntjs.com/plugins) and it's straight forward creating your own. In this project Grunt is used to automate obtaining Orchard source files, managing custom modules, themes & configuration and deploying Orchard (with a focus on deploying to Azure).   

In order to install Grunt you'll need to have Node.JS installed to give you access to the node package manager (NPM). The command below will install Grunt globally and make `grunt` available on the command line. This project was developed against Grunt `v0.4.x`.

`npm install -g grunt-cli`

### NodeJS

As mentioned above, Grunt is used heavily in this project therefore Node.JS is required. The version of Grunt this project is using is compatible with stable Node.js versions >= `0.8.0`. To install Node.JS [visit the homepage](https://nodejs.org/), which will display options to install (recommend "Stable").

### Orchard 

An Orchard theme isn't useful without a version of Orchard to use it. Download the source files or production ready release from the Orchard website. Alternatively, use our [Orchard Development project](https://github.com/moov2/orchard-development), which assists with developing and deploying Orchard.

## Getting Started

[Download the source files](https://github.com/moov2/orchard-development-theme/archive/master.zip) into a directory named after your own theme. It's not critical, but the `package.json` file should be modified to reflect the project that the theme is associated to.

## Developing

Once you've got the source files into your own theme your in a position to begin extending the theme for your project. Whenever you're working on the theme you need to run the following command:

	npm run develop

Alternatively you can run the `develop.cmd` file, which acts as a shortcut for the command above. This command runs in the background watching source files for changes triggering of compilation of CSS and JavaScript files. 

### CSS

At Moov2 we use a preprocessors to extend the capabilities of CSS. Our preprocessor of choice is [Sass](http://sass-lang.com/). The compilation of Sass to CSS is handle by Grunt, which uses [libsass](http://sass-lang.com/libsass) to perform the conversion.

Out of the box, this project includes a handful of useful partials that assist with speeding up constructing CSS for the theme. Each partial contains documentation on it's contribution to the final CSS file. [BEM](http://cssguidelin.es/#bem-like-naming) is the default naming convention for CSS that comes with the theme.

Any changes to `*.scss` files while the `develop` command is running compile Sass files into `Site.css`.

### JavaScript

This theme comes with a snippet of JavaScript, however under the hood it has a powerful set of features that assist with writing consistent, optimised and tested JavaScript.

#### Browserify

At Moov2 we favour developing JavaScript in a modular style then use a tool to handle bundling modules into a single compressed file that is referenced in the HTML. Our tool of choice is [browserify](http://browserify.org/), which [integrates easily](https://www.npmjs.com/package/grunt-browserify) with Grunt.

Any changes to `*.js` files while the `develop` command is running will bundle modules referenced in `index.js` into a single file named `bundle.js`.

#### JSHint

JSHint is used to improve the quality of the projects JavaScript and ensure multiple developers are writing code in a consistent manner. Edit the `.jshintrc` file to [customise options](http://jshint.com/docs/options/) for your project.

Any changes to `*.js` files while the `develop` command is running will lint the JS code and output any discrepancies. It should be noted, any discrepancies when building a distributable version will cause the build to fail.

#### Testing

Developing JavaScript using a modular approach lends itself well for writing tests for you code. Each module can be tested in isolation through unit tests. This project uses the popular [Mocha](https://mochajs.org/) JavaScript testing framework for running unit tests. An example set of unit tests can be found in the `Scripts\tests` directory to help get you started.

Any changes to `*.js` files while the `develop` command is running will run all the unit tests code and display the results. It should be noted, any test failures during the distributable build will cause the build to fail.

## Distributable

The files in this project are source files that aren't ready for production. Running the command below will create a fully optimised production ready version of the theme, which will be saved to the `dist` directory in the root directory of the theme.

`npm run dist`

The command above is a shortcut for running the `dist` Grunt task.

## Deploying Assets to Azure CDN
    
One of the main objective of this theme is to assist with improving the overall page speed to the client. It's [recommended](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/quick-start-quide#TOC-Use-of-CDN:) that client side assets (media, scripts & styles) should be served via a CDN to reduce distance files travel from server to client globally and it also reduced the amount of requests handle by the server(s) hosting the site.

To serve assets from a CDN they have to first be uploaded to the CDN and then all the URLs in the HTML need to point to the CDN. Luckily this has all been catered for already and can be done by passing arguments to the `dist` grunt task as shown below.

	grunt dist -cdnUrl=http://az123456.vo.msecnd.net -container=theme -accountName=myAzureAccount -accountKey=cys6fvLEyk2VdUDb7P+WIyvmpv4XQ8SnpCn2PgZH0gg==

*Tip: Instead of having to remember the command above, add the command to the `scripts` object in `package.json`, example below.*

	"scripts": {
	    "dist": "npm install & grunt dist",
	    "develop": "npm install & grunt",
	    "prod": "npm install && grunt dist -cdnUrl=http://az123456.vo.msecnd.net -container=theme -accountName=myAzureAccount -accountKey=cys6fvLEyk2VdUDb7P+WIyvmpv4XQ8SnpCn2PgZH0gg=="
    }
  
 *Running `npm run prod` will create a distributable version of the theme whose assets are served from a CDN.*
