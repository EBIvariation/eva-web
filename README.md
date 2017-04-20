# European Variation Archive (EVA) Web Front-end

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
 
 git checkout master

 git submodule init

 git submodule update
 ```

We use [npm](https://www.npmjs.com/) modules and [Grunt](https://gruntjs.com/) to build EVA web app.

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

 git checkout master

 git submodule init

 git submodule update

 cd eva-web/lib/jsorolla

 npm install

 cd ../..

 npm install
 
 grunt 
 
 ```
