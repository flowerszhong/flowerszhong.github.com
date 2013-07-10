---
layout: post
title: Karma Document Copy
description: mzhong
keyword: mzhong site
---

##Karma
#####Spectacular Test Runner for JavaScript  

###Installation 
Karma runs on Node.js and is available as a node module via NPM.

####Requirements 

First, you need to install Node.js. There are installers for both Mac and Windows. On Linux, we recommend using NVM.  

####Global Installation

This is the recommended way. It will install Karma into your global node_modules directory and create a symlink to its binary. 
>$ npm install -g karma
>
>\#Start Karma
>$ karma start  

####Local Installation

A local installation will install Karma into your current directory's node_modules. That allows you to have different versions for different projects.
> $ npm install karma 
>
> \# Start Karma
> $ ./node_modules/.bin/karma start

### Configuration 
In order to serve you well, Karma needs to know about your project. That's done through a configuration file.  

For an example file, see test/client/karma.conf.js which contains most of the options. 

#### Generating the config file

You can write the config file by hand or copy paste it from another project. 
A third way is to use karma init to generate it.  
> \# This will ask you a few questions and generate a new config file
> \# called my.conf.js
> $ karma init my.conf.js  


####Starting Karma

When starting Karma, you can pass a path to the configuration file as an argument.  
By default, Karma will look for karma.conf.js in the current directory.  
> \# Start Karma using your configuration
> $ karma start my.conf.js

For more info about configuration file, see the [configuration file docs][config-file].



####Command line arguments

Some of the configurations can be specified as a command line argument, which overrides the configuration from the config file.
Try *karma start --help* if you want to see all available options.


### Troubleshooting
You are having some problems with the great Karma? Look no further. Known problems and solutions are collected here so you don't have to figure them out again and again.  
If you can't find solution to your problem here, feel free to ask on the [mailing list][mail-list].  
Before complaining, please make sure you are on the latest version.  




#### Windows  

##### Tips & Tricks  
* Use chocolatey for installation of tools. It helps. A lot. 
##### Specific problems
* Chrome won't start. (Issues: #202, #74)
    1.Set CHROME_BIN like this
        > \> export CHROME_BIN='C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
    2.Increase the timeout from 5000ms to 10000ms. At 5000ms, timeouts occurred and the retry logic kicks in and eventually resolves after two to three tries.  

#### Unix

#####Tips & Tricks
In the event that your tests fail or freeze, this may be the result of a browser having a display message show up, a browser update prompt or extension-related conflict that needs to be taken care of. 


###Configuration File
In order to serve you well, Karma needs to know about your project. That's done through a configuration file.   
For an example configuration, see [test/client/karma.conf.js][karma-config-js] which contains most of the options.   
This document contains a list of all available options, as well as their command line equivalents. 




[karma-config-js]: https://github.com/karma-runner/karma/blob/master/test/client/karma.conf.js
[config-file]: http://karma-runner.github.io/0.8/config/configuration-file.html
[mail-list]: https://groups.google.com/forum/#!forum/karma-users