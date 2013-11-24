---
layout: post
title: HTML Questions:Front-end Developer Interview Questions
description: HTML Questions:Front-end Developer Interview Questions
keyword: HTML Questions:Front-end Developer Interview Questions
---


###What's a doctype do?
Instruct the browser to render the page.

###What's the difference between standards mode and quirks mode?  
Obviously,the css box model.


###What are the limitations when serving XHTML pages?
####Are there any problems with serving pages as application/xhtml+xml?
The XHTML page must be well formed.If you forgot to closed a element and the browser will not to closed it and cause error.

For "application/xhtml+xml", some old browsers no supports.



###How do you serve a page with content in multiple languages?
####What kind of things must you be wary of when design or developing for multilingual sites?
Use i18n framework.



###What are data- attributes good for?

The W3C specification for data-attributes states that:

>Custom data attributes are intended to store custom data private to the page or application, for which there are no more appropriate attributes or elements.

Custom data- attributes are a great way to simplify the storage of application data in your web pages. 


###Consider HTML5 as an open web platform. What are the building blocks of HTML5?
* more semantic text markup
* new form elements
* vedio and audio
* new javascript API
* canvas and SVG
* new communication API
* geolocation API
* web worker API
* new data storage


###Describe the difference between cookies, sessionStorage and localStorage.

Now there are such way to keep data on front-end side. 

* HTML5 web storage
	* HTML5 local Storage
	* HTML5 session storage
	* HTML5 web database
* Cookies

localStorage - stores data with no expiration date
sessionStorage - stores data for one session

 - HTML5 web storage = generic umbrella term for the new client-side data storage options:
 	- Web Storage is more secure and faster. The data is not included with every server request, but used ONLY when asked for. It is also possible to store large amounts of data, without affecting the website's performance.
    - Local Storage = persistant and scoped to the domain(store data with no expiration date). At the moment two flavors are usually mentioned:
        - 'default' = stores things in name/value pairs
        - Web SQL (aka Web Database) = uses a SQL database 
    - Session Storage = non persistent and scoped only to the current window(stores data for one session)
 - Cookies = the old school way of doing all of the above. Stores name/value pairs per domain. 






