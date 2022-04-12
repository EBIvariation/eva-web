# European Variation Archive (EVA) Web Front-end [![Build Status](https://github.com/EBIvariation/eva-web/actions/workflows/tests.yml/badge.svg)](https://github.com/EBIvariation/eva-web/actions)


Web front-end for the European Variation Archive (EVA), developed using technologies such as JavaScript and HTML5.

## Dependencies

The EVA Web App has the following dependencies
   * Jsorolla
   * EBI-Framework
    
[Jsorolla](https://github.com/opencb/jsorolla) and [EBI-Framework](https://github.com/ebiwd/EBI-Framework) libraries are attached with EVA as submodules.

## Build 

Go to your web root directory and run the following commands:

 ```
 git clone https://github.com/EBIvariation/eva-web.git
 
 cd eva-web
 
 git checkout master 

 git submodule init

 git submodule update
 ```

We use [Node.js](https://nodejs.org/en/) version ﻿>= 7.0, [npm](https://www.npmjs.com/) modules and [Grunt](https://gruntjs.com/) to build EVA web app.

_eva-web/package.json_ lists the dependency npm modules to be installed.

**Note:** npm modules should be installed in both eva-web and in Jsorolla. 

Run following command inside _eva-web_ and _lib/jsorolla_ folders:

```npm install```

_eva-web/Gruntfile.js_ has the configuration to build EVA Web App.

To build EVA web app run the following command in eva-web folder:

```grunt``` or grunt --env=(dev/staging/prod)

Example: for _dev_ instance run the following command:

```grunt --env=dev```

Default ```grunt``` points to production environment.

After successful build the files are then copied to a folder of the form _eva-web/build/x.x.x/_.

### Summary of steps to build EVA Web app

 ```
 git clone https://github.com/EBIvariation/eva-web.git
 
 cd eva-web

 git checkout master

 git submodule init

 git submodule update

 cd lib/jsorolla

 npm install

 cd ../..

 npm install
 
 grunt  
 ```


## Testing

Currently we build and run tests using [Gitlab CI](https://gitlab.ebi.ac.uk/EBIvariation/eva-web/-/pipelines).

### Test design

We use Mocha as test framework and Chai as test assertion library. The tests are run as Grunt tasks. We use a specific version of Chrome to run those tests in Gitlab CI (look at .gitlab-ci.yml to see which specific version). There are acceptance tests and unit tests.

### When a test fails

As the whole test suite takes some minutes to complete, you can run only some tests adding a property `grep: "<substring of test description>"` (e.g. `grep: "Variant Browser"`) in gruntfile.js in the `mochaTest.acceptanceTest.options` object, and run as `env BROWSER=chrome grunt --env=staging mochaTest:acceptanceTest`.

