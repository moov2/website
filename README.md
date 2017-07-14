# Orchard Development

This project is used by [Moov2](http://moov2.com) to assist with developing & deploying solutions utilising [Orchard CMS](http://www.orchardproject.net/).

## Prerequisites

In order to work with this project you'll need to make sure you have the following tools.

### Grunt

At Moov2, Grunt is our preferred automation tool. It's easy to get started with and extensible with hundreds of [plugins available via NPM](http://gruntjs.com/plugins) and it's straight forward creating your own. In this project Grunt is used to automate obtaining Orchard source files, managing custom modules, themes & configuration and deploying Orchard (with a focus on deploying to Azure).   

In order to install Grunt you'll need to have Node.JS installed to give you access to the node package manager (NPM). The command below will install Grunt globally and make `grunt` available on the command line. This project was developed against Grunt `v0.4.x`.

`npm install -g grunt-cli`

### NodeJS.

As mentioned above, Grunt is used heavily in this project therefore Node.JS is required. The version of Grunt this project is using is compatible with stable Node.js versions >= `0.8.0`. To install Node.JS [visit the homepage](https://nodejs.org/), which will display options to install (recommend "Stable").

### Yarn

[Yarn](https://yarnpkg.com/) is a package manager that superceeds NPM providing faster performance. Yarn has a fairly simple [installation](https://yarnpkg.com/en/docs/install) process. This dependency is not a requirement, you can continue to use `npm`, however the shortcut batch files within the project all reference Yarn.

### Orchard Development Environment

Orchard is built on the ASP.NET MVC platform therefore an environment for developing and running .NET solutions locally is required. In most cases, [Visual Studio](https://www.visualstudio.com/) is the preferred IDE for developing .NET solutions.

## Getting Started

The first step is to obtain the source files from this repository by cloning this project, below is an example of the command for Git.

    git clone git://github.com/moov2/website.git website
    
Once you've got the source files on your local machine, you'll need to obtain various git sub modules that are used for custom Orchard modules. Below is the command that will pull down all git sub modules in the project.

    git submodule update --init --recursive

Now you've obtained all the project files it's time to get Orchard setup. Open a command prompt, ensuring to "Run as administrator", in the root of the project and run the command below. This will firstly download all the dependencies for the setup command, then run `grunt setup`, which will download a fresh copy of Orchard (saved to the`/local` directory) and configure our custom modules, themes and overrides. There is a useful batch file, `setup.cmd` in the root of the project that acts as a shortcut for this set up step.

    npm install

*If you have yarn installed then feel free to use `yarn install` instead of `npm install`.*

The custom theme within `themes/Moov2` also requires a build step in order to retrieve third part dependencies and compile front end assets. Navigate to this folder and run the command below.

    npm run develop

Once complete, it will continue to watch theme files for changes in order to trigger compilation of the front end assets.

You're now in a position to get Orchard up and running. Open `/local/1.10.1/src/Orchard.sln` using Visual Studio, then build the solution. It would be a wide idea to change the port that your local environment will use to run the site, to do this right click `Orchard.Web`, go to `Properties` then with `Web` change the `Project Url` and click "Create Virtual Directory". Run the website, once loaded you should be presented with a familiar Orchard setup screen. When setting up Orchard, make sure you select the **Local Development** recipe. This recipe will enable various features and also create various content items that should be enough to get up and running. This will not necessarily replect the content that is on the development/[live](http://moov2.com). To get a replica of the content on those environment, you'll need to log in to the appropriate environment and run an export, then run an import on your local environment using the export file.

## Project Structure

Below is a description of the directories & files that come with this project by default. The directory names can be changed from within the `gruntfile.js`, at the top of the file is a `config` object that contains a `paths` object that defines names of directories within the project.

### Deployment

The `deployment` directory contains sub directories that describe the different environments that the project can be deployed to. An `example` of a deployment environment configuration can be found by default, use this as a template when setting up your own environment.

### Modules

When developing on an Orchard project it is common that you'll need to extend the core functionality through the use of modules. These custom modules should be placed within the `modules` directory. Modules inside this directory will be added to the local copy of Orchard when the `grunt setup` command is run.

### Overrides

When developing an Orchard project it is often desirable to overwrite Orchard source files (e.g. providing a custom configuration with `Web.config`). Any files or directories placed inside this folder will be copied over the local Orchard files that are downloaded during `grunt setup`. Ensure that the files match the path relative to the root of the Orchard source. By default, the msdeploy manifest & parameters are overridden to assist with the `grunt deploy` command. Also our preferred `Web.config` for an Orchard project is included and a `robots.txt` that by default prevents robots from visiting the site.

### Themes

Themes define the appearance of an Orchard website and allows you to give a custom look and feel to your site. Any custom themes should be placed within the `themes` directory. Themes inside this directory will be added to the local copy of Orchard when the `grunt setup` command is run.

### config.json

This file defines the configuration for the project. This is where you specify which Orchard version you'd like the project to use, using the `version` property. 

### gruntfile.js

Defines useful tasks used to assist with developing & deploying Orchard. See the [Grunt Tasks](#grunt-tasks) section for more information.

## Grunt Tasks

The crux of this project is the useful grunt tasks to assist with developing & deploying Orchard. The primary tasks that should be run via the command line are listed below.

### Setup

`grunt setup` will download the configured version of Orchard and set up custom modules, themes and overrides. Orchard will only be downloaded if there a directory named with the version number doesn't exist inside the `local` directory. Custom modules & themes have creating symbolic links created between the `modules` & `themes` directory within the project and the `Modules` & `Themes` directory with the downloaded version of Orchard. Modules are also added to the `Orchard.sln` file to ensure the modules appear when the solution is opened using Visual Studio.

When adding new modules or themes into the project, the `grunt setup` task should be run in order to add the module or theme into the locally version of Orchard.

*In order to create the module & theme symbolic links, this command should be run as administrator.

### Build Locally

`grunt build-locally` will build a pre-compiled version of Orchard ready to be distributed. The artifacts for this task will be saved in a directory within the root directory named `dist`.

### Deploy

As described in the [Deploying to Azure](#deploy-to-azure) section, `grunt deploy` will deploy a pre-compiled version of Orchard to a specified environment. This task will fail if the `grunt deploy` command doesn't contain all required deployment parameters described in the deploying to Azure section.

## Deploying to Azure

One of the primary goals with this project is to make it easier to deploy Orchard to Microsoft Azure. The `deployment` directory should contain environment specific files, by default the project contains files for a development environment. The `grunt deploy` command requires various arguments that describe the Azure environment to deploy to.

* `-target` - Matches name of a directory in the `deployment` folder used for configuring environment.
* `-applicationName` - Name of the Azure site.
* `-computerName` - Used by msdeploy to define the destination that files should be deployed to. This can be obtained via the publish profile if you're deploying to an Azure web app.
* `-username` - Used by msdeploy to authenticate depoyment. This can be obtained via the publish profile if you're deploying to an Azure web app.
* `-password` - Used by msdeploy to authenticate depoyment. This can be obtained via the publish profile if you're deploying to an Azure web app.

Below is an example command that deploys to an Azure web app named `orchard-development`.

    grunt deploy -target=dev -applicationName=orchard-development -computerName=https://orchard-development.scm.azurewebsites.net:443/msdeploy.axd?site=orchard-development -username=$orchard-development -password=w3M3JLgEhoHq5rMTJmFwlPG4QR3SW0dtkTz9hkQbc7oXJ1PJ8NC6MX9gxpxj