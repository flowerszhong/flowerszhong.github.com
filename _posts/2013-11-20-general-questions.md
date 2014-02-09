---
layout: post
title: General Questions:Front-end Developer Interview Questions
description: General Questions:Front-end Developer Interview Questions
keyword: General Questions:Front-end Developer Interview Questions
---
{% include JB/setup %}

### What did you learn yesterday/this week?  
Learning Angular.

### What excites or interests you about coding?  
* Cool
* Reduce the boring & repeating works
* The learning process is happiness

### What UI, Security, Performance, SEO, Maintainability or Technology considerations do you make while building a web application or site?  
So big question...

### Talk about your preferred development environment. (OS, Editor, Browsers, Tools etc.)  
* win/Unix(Mac OS)
* sublime text 2/3, visual studio,vi
* chrome/firefox/ie9
* browsers devTools,git,node

### Can you describe your workflow when you create a web page?
* study prototype
* set structures(html tag)
* render with style
* add interactive by scripts

### Can you describe the difference between progressive enhancement and graceful degradation?    
Bonus points for describing feature detection   

** Graceful degradation **

Providing an alternative version of your functionality or making the user aware of shortcomings of a product as a safety measure to ensure that the product is usable.

** Progressive enhancement**   

Starting with a baseline of usable functionality, then increasing the richness of the user experience step by step by testing for support for enhancements before applying them.

I agree with progressive enhancement, and increaseing user experience with feature detection.For example,once i detectived that the browser support round-corner or shadow text,i will apply the futures to pages.

### Explain what "Semantic HTML" means.

>Semantic HTML is the use of HTML markup to reinforce the semantics, or meaning, of the information in webpages rather than merely to define its presentation or look. Semantic HTML is processed by regular web browsers as well as by many other user agents. CSS is used to suggest its presentation to human users.

>As an example, recent HTML standards discourage use of the tag `<i>` (italic, a typeface)[1] in preference of more accurate tags such as `<em>` (emphasis); the CSS stylesheet should then specify whether emphasis is denoted by an italic font, a bold font, underlining, slower or louder audible speech etc. This is because italics are used for purposes other than emphasis, such as citing a source; for this, HTML 4 provides the tag `<cite>`.[2] Another use for italics is foreign phrases or loanwords; web designers may use built-in XHTML language attributes[3] or specify their own semantic markup by choosing appropriate names for the class attribute values of HTML elements (e.g. class="loanword"). Marking emphasis, citations and loanwords in different ways makes it easier for web agents such as search engines and other software to ascertain the significance of the text.

Semantic = Meaning.

Semantic elements = Elements with meaning.

#### How to write 'Semantic HTML'?
* write correct tags
* Semantics applies to IDs and Classnames as well as tags
* html first, then css
* always separate style from content



### How would you optimize a websites assets/resources?
Looking for a number of solutions which can include:

* File concatenation
* File minification
* CDN Hosted
* Caching
* ...

### Why is it better to serve site assets from multiple domains?    
How many resources will a browser download from a given domain at a time?

Multiple domains could increase the number of parallel downloads that the browser can perform.

about 4 to 6 connections per domain

Not all browsers are restricted to just two parallel downloads per hostname. Opera 9+ and Safari 3+ do four downloads per hostname. Internet Explorer 8, Firefox 3, and Chrome 1+ do six downloads per hostname. Sharding across two domains is a good compromise that improves performance in all browsers.

[The optimal number of domains to shard across is 2-4. After 4 domains, response time degrades.][yui-perfomance-research]

### Name 3 ways to decrease page load. (perceived or actual load time)

* Reduce the number of requests
* Minimize HTTP Requests
	* optimize images
	* minify css&js file
	* compress(gzip)
* yahoo 14 rules 


### If you jumped on a project and they used tabs and you used spaces, what would you do?
* Suggest the project utilize something like EditorConfig (http://editorconfig.org)
* Conform to the conventions (stay consistent)
* issue :retab! command (sublime text retab setting)

### Write a simple slideshow page  
Bonus points if it does not use JS.

### What tools do you use to test your code's performance?
* Profiler
* JSPerf
* Dromaeo
* chrome devTool(profiles panel)

### If you could master one technology this year, what would it be?
Ruby On Rails. For a good job.

### Explain the importance of standards and standards bodies.

### What is FOUC? How do you avoid FOUC?
FOUC meaning flash of unstyled content.



[graceful-degraduation-vs-progressive-enhancement]:http://dev.opera.com/articles/view/graceful-degradation-progressive-enhancement/


[semantic-html]:http://en.wikipedia.org/wiki/Semantic_HTML

[write-better-semantic-html]:http://www.webdesignfromscratch.com/html-css/write-better-semantic-html/

[semantic-markup]:http://www.adobe.com/cn/devnet/html5/articles/semantic-markup.html

[external-domains]:http://webmasters.stackexchange.com/questions/26753/why-do-big-sites-host-their-images-css-on-external-domains

[yui-perfomance-research]:http://yuiblog.com/blog/2007/04/11/performance-research-part-4/

[separate-domain]:http://webmasters.stackexchange.com/questions/25087/what-is-the-advantage-to-hosting-static-resources-on-a-separate-domain

[browser-requests-number]:http://stackoverflow.com/questions/7456325/get-number-of-concurrent-requests-by-browser

[roundup-on-parallel-connections]:http://www.stevesouders.com/blog/2008/03/20/roundup-on-parallel-connections/

[the-innovations-of-internet-explorer]:http://www.nczonline.net/blog/2012/08/22/the-innovations-of-internet-explorer/



