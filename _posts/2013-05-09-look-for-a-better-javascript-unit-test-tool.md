---
layout: post
title: Look For A Better JS Unit Test Framework
description: mzhong
keyword: mzhong site default page
---

##Javascript 单元测试框架比较 

###1.什么是单元测试？ 
>所谓‘单元测试’实质上是一段用来测试产品代码的代码--《Test-Driven Javascript Development》 

###2.xUnit
####什么是xUnit? 
>JUnit/SUnit 


###3.[Javascript Unit Test Framework知多少？](http://en.wikipedia.org/wiki/List_of_unit_testing_frameworks#JavaScript) 


###4.Comparisons

* 是否支持异步测试
* 是否支持浏览器
* 是否支持无头测试
* 测试运行速度
* 覆盖率计算
* 提供IDE插件
* 语言倾向性


###5.QUnit
QUnit focuses on testing JavaScript in the browser, while providing as much convenience to the developer as possible. Blurb from the site:

>QUnit is a powerful, easy-to-use JavaScript unit test suite. It's used by the jQuery, jQuery UI and jQuery Mobile projects and is capable of testing any generic JavaScript code

QUnit shares some history with TestSwarm (above):

>QUnit was originally developed by John Resig as part of jQuery. In 2008 it got its own home, name and API documentation, allowing others to use it for their unit testing as well. At the time it still dependended on jQuery. A rewrite in 2009 fixed that, now QUnit runs completelty standalone. QUnit's assertion methods follow the CommonJS Unit Testing specification, which was to some degree influenced by QUnit.

Project home: [http://qunitjs.com/](http://qunitjs.com/) 

###6.[JsTestDriver](http://code.google.com/p/js-test-driver/) 
Some people at Google have also started on a distributed JavaScript tool, JsTestDriver. It is similar to TestSwarm, that it has a server, and clients connected. But it also has support for running tests from command line and plugins for Eclipse and IntelliJ! 

####pros:  
 
* Supports all major browsers/operating systems
* Run on multiple clients at once
* Don't need to run server/clients on development computer (no need for IE)
* Run tests from command line (jar) (can be integrated in ant/maven)
* Eclipse plugin* 
* IntelliJ plugin
* Supports multiple JavaScript test frameworks

####cons:  
* Doesn't show results for os or browser version. Only browser names.* It does however print out the version in the test results.
* No history of previous test results
* Very low project activity


###7.[JsUnit](https://github.com/pivotal/jsunit)
####Pros  

* can be invoked from an ant build file
* launches browser to run the tests
* Eclipse plug-in

####Cons    

* launches browser to run the tests
* Does not support js file to write the unit test code: it has to be -embedded inside an html file
* it has not been updated for a few years

###8.[RhinoUnit](http://code.google.com/p/rhinounit)
####Pros  

* ant driven
* supports js file
* very simple to use

####Cons
 
* Simulation of JavaScript engine: not advanced enough to support our code: I tried to run test code working with JsUnit: I encountered issue when loading our common JavaScript files

###9.Jasmine  
This is a test-runner that might interest developers familiar with Ruby or Ruby on Rails. The syntax is based on RSpec that's used for testing in Rails projects.

>Jasmine is a behavior-driven development framework for testing your JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM.

Project home: [https://github.com/pivotal/jasmine/](https://github.com/pivotal/jasmine/)


####Read More 
* [Look for a better Javascript Unit Framework](http://stackoverflow.com/questions/300855/looking-for-a-better-javascript-unit-test-tool)




