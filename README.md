Web front-end for the European Variation Archive (EVA), developed using technologies such as JavaScript and HTML5.

To install EVA -Web app do the following steps.

go to your web root directory run following commands

1. **_git clone https://github.com/EBIvariation/eva-web.git_**

2. **_git checkout develop_**

3. **_git submodule init_**  (jsorolla  module is attached with EVA as submodule  this step has to be done only the the first time whenever you clone a EVA repository)

4. **_git submodule update_** 

We use npm modules and Grunt to copy files for production version.
https://www.npmjs.com/

eva-web/package.json lists the modules to be installed.

note: npm should be installed in eva-web and in jsorolla

run following command in both eva-web and lib/jsorolla

**_npm install_** 

Gruntfile.js  has the configuration to build EVA Web App.

to build EVA web app run the following command in eva-web

**_grunt_** or grunt --env=(dev/stage/prod)

ex: for dev instance

**_grunt --env=dev_**

Default grunt points to production environment

and if everything okay you can access the web app in your browser
the main index file is in eva-web/src/index.html

if successful the production files are then copied in ex: eva-web/build/x.x.x/

these files are then copied to  dev or stage VMs.


Summary of steps  to build EVA Web app:

1. **_git clone https://github.com/EBIvariation/eva-web.git_**

2. **_git checkout develop_**

3. run **_git submodule init_** in eva-web

4. run **_git submodule update_** in eva-web

5. run **_npm install_** in eva-web/lib/jsorolla

6. run **_npm install_** in eva-web/

7. **_grunt_**