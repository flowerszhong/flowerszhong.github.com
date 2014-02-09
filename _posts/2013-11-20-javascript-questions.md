---
layout: post
title: JS Questions:Front-end Developer Interview Questions
description: JS Questions:Front-end Developer Interview Questions
keyword: JS Questions:Front-end Developer Interview Questions
---
{% include JB/setup %}

### Explain event delegation 
Event delegation allows us to attach a single event listener, to a parent element, that will fire for all children matching a selector, whether those children exist now or are added in the future.the underlying cause is browser's *event bubbling* ;


### Explain how `this` works in JavaScript
The `this` object is bound at runtime based on the context in which a function is executed:

* when used inside global functions,this is equal to *window* in nostrict mode and *undefined* in strict mode.
* whereas `this` is equal to the object when called as an object method.
* as a constructor
* call and apply
* bound functions
* as dom event handler

### Explain how prototypal inheritance works  
Whenever a function is created, its prototype property is also created according to a specific set of rules.    
When it comes to inheritance, JavaScript only has one construct: objects. Each object has an internal link to another object called its prototype. That prototype object has a *prototype* of its own, and so on until an object is reached with null as its prototype. null, by definition, has no prototype, and acts as the final link in this *prototype chain*.


### How do you go about testing your JavaScript?   
Grunt/Karma + Jasmine/QUnit  

### AMD vs. CommonJS?

### What's a hashtable?  
Hashtable is a data structure that associates keys with values;


### Explain why the following doesn't work as an [IIFE][IIFE]: `function foo(){ }();`.   
What needs to be changed to properly make it an IIFE?   

The most widely accepted way to tell the parser to expect a function expression is just to wrap in in parens, because in JavaScript, parens can’t contain statements. At this point, when the parser encounters the function keyword, it knows to parse it as a function expression and not a function declaration.


### What's the difference between a variable that is: `null`, `undefined` or `undeclared`?
How would you go about checking for any of these states?

the `undefined` variable is a declared but has a value of undefined. To use a undeclared variable will cause an error.


### What is a closure, and how/why would you use one? 
Closures are functions that have access to variables from anthor function's scope.   
This is often accomplished by creating a function inside a function.

### What's a typical use case for anonymous functions?
* event handler
* [IIFE][IIFE]   



### Explain the "JavaScript module pattern" and when you'd use it.
#### Bonus points for mentioning clean namespacing.
#### What if your modules are namespace-less?

The module pattern use a anonymous function that returns a object.   
Inside of the anonymous function, the private variables and functions are defined first.  
After that, an object literal is returned as the function value. That object literal contains only properties and methods that should be public.
Since the object is defined inside the anonymous function, all of the public methods have access to the private variables and functions.

### How do you organize your code? (module pattern, classical inheritance?)
I developing SPA with requirejs and MVC Framework recently. So I organize my code with AMD.

### What's the difference between host objects and native objects?
* **Native objects** are those objects supplied by JavaScript. Examples of these are String, Number, Array, Image, Date, Math, etc.

* **Host objects** are objects that are supplied to JavaScript by the browser environment. Examples of these are window, document, forms, etc.

### Difference between:
```javascript
function Person(){} 
var person = Person() 
var person = new Person()
```
[var-functionname-function-vs-function-functionname][var-functionname-function-vs-function-functionname]


### What's the difference between `.call` and `.apply`?
These methods both call the function with a specific `this` value.
* the **apply()** method accepts two arguments: the value of `this` and an array of arguments.
* the **call()** method exhibits the same behavior as apply(),but arguments are passed to it differently.Using call() arguments must be enumerated specifically.

### explain `Function.prototype.bind`? 
ECMAScript 5 defines an addition method called 'bind()'.the 'bind()' method create a new function instance whose *this* value is bound to the value to that was passed into 'bind()'.

### When do you optimize your code?
For release, we will compress and combine code.  
Whenever I have a time I will review my code and refactor it.    

### Can you explain how inheritance works in JavaScript?



### When would you use `document.write()`?   
#### Most generated ads still utilize `document.write()` although its use is frowned upon
Use less as far as possible   

### What's the difference between feature detection, feature inference, and using the UA string
* Feature Detection is to identify the browser's capabilities.   
* Feature Inference is guess whether browser has certain feature through others feature or UA string.
	* One inappropriate use of feature detection is called feature inference. Feature inference attempts to use multiple features after validating the presence of only one. The presence of one feature is inferred by the presence of another. The problem is, of course, that inference is an assumption rather than a fact, and that can lead to maintenance issues. 
* UA String is User-Agent Detection.  

### Explain AJAX in as much detail as possible 
AJAX is short for Asynchronous Javascript + XML. The technique consisted of making server requests for additional data without unloading the page,resulting in a better user experience.  

### Explain how JSONP works (and how it's not really AJAX)

### Have you ever used JavaScript templating?
#### If so, what libraries have you used? (Mustache.js, Handlebars etc.)

* Handlebars
* _.tmpl
* $.tmpl


### Explain "hoisting".
There is a preproccess or precompile in javascript runtime. and 'Hoisting' occur in the preproccess.

Function declarations and variable declarations are always moved (“hoisted”) invisibly to the top of their containing scope by the JavaScript interpreter. This means that code like this:

{% highlight javascript %}
function foo() {
    bar();
    var x = 1;
}
{% endhighlight %}

is actually interpreted like this:
{% highlight javascript %}
function foo() {
    var x;
    bar();
    x = 1;
}
{% endhighlight %}

[JavaScript-Scoping-and-Hoisting][JavaScript-Scoping-and-Hoisting]

### Describe event bubbling.  
**Event Flow** describles the order in which events are received on the page.An event has three phases to its life cycle: capture, target, and bubbling.  
**Event Bubbling** mean that an event start at the most specific element(the deepest possible point to the document tree) and then flow upward toward the least specific node(the document);


### What's the difference between an "attribute" and a "property"?

Often an attribute is used to describe the mechanism or real-world thing. 

A property is used to describe the model. 


In HTML / Javascript the terms get confused because DOM Elements have attributes (per the HTML source) which are backed by properties when those elements are represented as Javascript objects.

To further confuse things, changes to the properties can sometimes update the attributes.

For example, changing the `element.href` property will update the href attribute on the element, and that'll be reflected in a call to `element.getAttribute('href')`.

However if you subsequently read that property, it will have been normalised to an absolute URL, even though the attribute might be a relative URL! 


### Why is extending built in JavaScript objects not a good idea?
Depend on the way of extending.

### Why is extending built ins a good idea?
Depend on the way of extending.

### Difference between document load event and document ready event?
* ready means DOM is ready.  
* load means the page fully loaded. Includes inner frames, images etc. 


### What is the difference between `==` and `===`?
The `==` operator will compare for equality after doing any necessary type conversions. The `===` operator will not do the conversion, so if two values are not the same type `===` will simply return false. It's this case where `===` will be faster, and may return a different result than `==`. In all other cases performance will be the same.

### Explain how you would get a query string parameter from the browser window's URL.
1.var queryString = location.search
2.parse queryString
	* queryString.split("=")
	* regExp
3.return specific parameter.


### Explain the same-origin policy with regards to JavaScript.


### Describe inheritance patterns in JavaScript.

* Make this work:
```javascript
[1,2,3,4,5].duplicate(); // [1,2,3,4,5,1,2,3,4,5]
```
### Describe a strategy for memoization (avoiding calculation repetition) in JavaScript.

### Why is it called a Ternary expression, what does the word "Ternary" indicate?

### What is the arity of a function?

### What is `"use strict";`? 

what are the advantages and disadvantages to using it?


[javascript-this]:http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html
[MDN-javascript-this]:https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Operators/this
[inheritance-and-prototype-chain]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
[IIFE]:http://benalman.com/news/2010/11/immediately-invoked-function-expression/
[var-functionname-function-vs-function-functionname]:http://stackoverflow.com/questions/336859/var-functionname-function-vs-function-functionname

[why-is-document-write-considered-a-bad-practice]:http://stackoverflow.com/questions/802854/why-is-document-write-considered-a-bad-practice
[attribute-property]:http://omiga.org/blog/archives/2055
[what-is-the-difference-between-attribute-and-property]:http://stackoverflow.com/questions/258469/what-is-the-difference-between-attribute-and-property
[ways-to-circumvent-the-same-origin-policy]:http://stackoverflow.com/questions/3076414/ways-to-circumvent-the-same-origin-policy
[JavaScript-Scoping-and-Hoisting]:http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html



