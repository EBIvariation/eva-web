**European Variation Archive (EVA) Web Front-end**

Web front-end for the European Variation Archive (EVA), developed using technologies such as JavaScript and HTML5.

**Dependencies**

The EVA Web App has the following dependencies
    Jsorolla
    EBI-Framework
    
Jsorolla and EBI-Framework modules are attached with EVA as submodules


**Build**

We use npm modules and Grunt to copy files for production version.

eva-web/package.json lists the modules to be installed.


go to your web root directory run following commands

1. **_git clone https://github.com/EBIvariation/eva-web.git_**

2. **_git checkout develop_**

3. **_git submodule init_**  ()

4. **_git submodule update_** 

We use npm modules and Grunt to copy files for production version.
https://www.npmjs.com/

eva-web/package.json lists the modules to be installed.

note: npm should be installed in eva-web and in jsorolla

run following command in both eva-web and lib/jsorolla

**_npm install_** 

Gruntfile.js  has the configuration to build EVA Web App.

to build EVA web app run the following command in eva-web

**_grunt_** or grunt --env=(dev/staging/prod)

ex: for dev instance

**_grunt --env=dev_**

Default grunt points to production environment

and if everything okay you can access the web app in your browser
the main index file is in eva-web/src/index.html

if successful the production files are then copied in ex: eva-web/build/x.x.x/

these files are then copied to VMs.


Summary of steps to build EVA Web app:

1. **_git clone https://github.com/EBIvariation/eva-web.git_**

2. **_git checkout develop_**

3. run **_git submodule init_** in eva-web

4. run **_git submodule update_** in eva-web

5. run **_npm install_** in eva-web/lib/jsorolla

6. run **_npm install_** in eva-web/

7. **_grunt_**