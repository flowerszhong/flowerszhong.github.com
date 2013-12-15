---
layout: post
title: jQuery Questions:Front-end Developer Interview Questions
description: jQuery Questions:Front-end Developer Interview Questions
keyword: jQuery Questions:Front-end Developer Interview Questions
---

### Explain "chaining".
Chaining allows us to run multiple jQuery methods (on the same element) within a single statement.like this:
`$(selector).doA().doB().doC()`


### Explain "deferreds".
>The Deferred object, introduced in jQuery 1.5, is a chainable utility object created by calling the jQuery.Deferred() method. It can register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.

>The Deferred object is chainable, similar to the way a jQuery object is chainable, but it has its own methods. After creating a Deferred object, you can use any of the methods below by either chaining directly from the object creation or saving the object in a variable and invoking one or more methods on that variable.

Simplely,the deferred object is the salution of callback function and aslo a asynchronous task runner.

### What are some jQuery specific optimizations you can implement?
* selector optimization
* event delegation
* Cache jQuery selector results
* Minimize DOM operations
* Avoid repeated object creation
* Stop using jQuery when you only need selectors(you can import selector only)

### What does .end() do?
End the most recent filtering operation in the current chain and return the set of matched elements to its previous state.

### How, and why, would you namespace a bound event handler?
Event namespacing provides a way to manage specific event handlers. For example, a plugin could namespace its event handlers to make them easier to unbind while still using anonymous functions. To namespace an event, just suffix the event type with a period and a name 


### Name 4 different values you can pass to the jQuery method.
* Selector (string)
* HTML (string) 
* Callback (function)
* HTMLElement 
* object
* array
* element array 
* jQuery Object etc.

### What is the effects (or fx) queue?
Show or manipulate the queue of functions to be executed on the matched elements.

### What is the difference between .get(), [], and .eq()?
* .get() return a raw DOM element
* [] equal .get()
	* .get(index):index could be a negative number
	* [index]:index >=0 
* .eq() return a jquery element

### What is the difference between .bind(), .live(), and .delegate()?
* Using the .bind() method is very costly as it attaches the same event handler to every item matched in your selector.
* You should stop using the .live() method as it is deprecated and has a lot of problems with it.
* The .delegate() method gives a lot of "bang for your buck" when dealing with performance and reacting to dynamically added elements.
* That the new .on() method is mostly syntax sugar that can mimic .bind(), .live(), or .delegate() depending on how you call it.
* The new direction is to use the new .on method. Get familiar with the syntax and start using it on all your jQuery 1.7+ projects.

### What is the difference between $ and $.fn? Or just what is $.fn.
```javascript
$ = function(){}
$.fn = $.prototype = {};
```

### Optimize this selector: javascript $(".foo div#bar:eq(0)")
`$("#bar")`

refs:  
[deferred-object][deferred-object]  
[differences-between-jquery-bind-vs-live-vs-delegate-vs-on][differences-between-jquery-bind-vs-live-vs-delegate-vs-on]  
[queue][queue]


[deferred-object]:http://api.jquery.com/category/deferred-object/
[differences-between-jquery-bind-vs-live-vs-delegate-vs-on]:http://www.elijahmanor.com/differences-between-jquery-bind-vs-live-vs-delegate-vs-on/
[queue]:http://api.jquery.com/queue/