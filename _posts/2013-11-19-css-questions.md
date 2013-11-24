---
layout: post
title: CSS Questions:Front-end Developer Interview Questions
description: CSS Questions:Front-end Developer Interview Questions
keyword: CSS Questions:Front-end Developer Interview Questions
---

###Describe what a "reset" CSS file does and how it's useful.
* What Is A CSS Reset?   
A CSS Reset (or “Reset CSS”) is a short, often compressed (minified) set of CSS rules that resets the styling of all HTML elements to a consistent baseline. 
In a word,reset.css is used to normalize browser's default styles. 
* Why USE A CSS Reset?    
Browser have different "built-in" styles which they apply to different html-elements. These styledefinitions may vary accross different browsers.   
* Which CSS Reset Should I Use?   
	
	*   [Normalize.css](https://github.com/necolas/normalize.css/) is a customisable CSS file that makes browsers render all elements more consistently and in line with modern standards.  
	*   If you’re working with HTML5, use the [HTML5 Doctor Reset CSS](http://www.cssreset.com/scripts/html5-doctor-css-reset-stylesheet "HTML5 Doctor CSS Reset")
	*   If you’re doing some quick prototyping and testing, or building a non-HTML5 page, use [Eric Meyer’s Reset CSS](http://www.cssreset.com/scripts/eric-meyer-reset-css/ "Eric Meyer Reset CSS").
	*   If you want a CSS Reset that acts more as a framework, un-resetting styles after the CSS Reset, use the [Tripoli CSS Reset](http://www.cssreset.com/scripts/tripoli-css-reset-david-hellsing/ "Tripoli CSS Reset - David Hellsing") or the [Vanilla CSS Un-Reset](http://www.cssreset.com/scripts/vanilla-css-un-reset/ "Vanilla CSS Un-Reset")
	*   If you want a full-featured CSS Framework, try using and abusing all the modules of the [YUI 3 CSS Library](http://www.cssreset.com/scripts/yahoo-css-reset-yui-3/ "Yahoo! YUI 3 CSS Reset")
	*   Generally speaking, don’t use the [Universal Selector ‘*’ CSS Reset](http://www.cssreset.com/scripts/universal-selector-css-reset/ "Universal Selector ")

###Describe Floats and how they work.   
A float element in page like a boat in water.      
###What are the various clearing techniques and which is appropriate for what context?
*   **The Empty Div Method** is, quite literally, an empty div. <tt>&lt;div style="clear: both;"&gt;&lt;/div&gt;</tt>. Sometimes you'll see a &lt;br /&gt; element or some other random element used, but div is the most common because it has no brower default styling, doesn't have any special function, and is unlikely to be generically styled with CSS. This method is scorned by semantic purists since its presence has no contexual meaning at all to the page and is there purely for presentation. Of course in the strictest sense they are right, but it gets the job done right and doesn't hurt anybody.
*   **The Overflow Method** relies on setting the overflow CSS property on a parent element. If this property is set to auto or hidden on the parent element, the parent will expand to contain the floats, effectively clearing it for succeeding elements. This method can be beautifully semantic as it may not require an additional elements. However if you find yourself adding a new div just to apply this, it is equally as unsemantic as the empty div method and less adaptable. Also bear in mind that the overflow property isn't specifically for clearing floats. Be careful not to hide content or trigger unwanted scrollbars.
*   **The Easy Clearing Method** uses a clever CSS pseudo selector (<tt>:after</tt>) to clear floats. Rather than setting the overflow on the parent, you apply an additional class like "clearfix" to it. Then apply this CSS:
	{% highlight css %}
    .clearfix:after {       
	    content: ".";       
	    visibility: hidden;       
	    display: block;       
	    height: 0;       
	    clear: both;
    }
	{% endhighlight %}

	This will apply a small bit of content, hidden from view, after the parent element which clears the float. This isn't quite the [whole story](http://www.positioniseverything.net/easyclearing.html), as additional code needs to be used to accomodate for older browsers.


###Explain CSS sprites, and how you would implement them on a page or site.  
CSS sprites are a way to reduce the number of HTTP requests made for image resources referenced by your site. Images are combined into one larger image at defined X and Y coorindates. Having assigned this generated image to relevant page elements the background-position CSS property can then be used to shift the visible area to the required component image.(Css sprites is a technology to combin many image into one, and use css background-position to find which part you want)   

CSS Sprites are the preferred method for reducing the number of image requests. Combine your background images into a single image and use the CSS background-image and background-position properties to display the desired image segment.  

###What are your favourite image replacement techniques and which do you use when?   
**CSS image replacement** is a technique of replacing a text element (usually a header tag) with an *image*.   
[css-image-replacement][css-image-replacement]   

###CSS property hacks, conditionally included .css files, or... something else?   

###How do you serve your pages for feature-constrained browsers?  
####What techniques/processes do you use? 

* Progressive Enhancement  
* Graceful Degradation     

###What are the different ways to visually hide content (and make it available only for screen readers)?
[css media types][css2-media]  

###Have you ever used a grid system, and if so, what do you prefer?
Of course yes.

* [gridpak](http://gridpak.com/). A simple grid system.
* Bootstrap Grid System
* Grid960
* YUI CSS Grid

I prefer Bootstrap grid.  

###Have you used or implemented media queries or mobile specific layouts/CSS?  
Of course yes.   
I implemented media queries on [my gitbub pages](http://flowerszhong.github.io).the site works fine on all media included handle devices.

###Any familiarity with styling SVG?
[SVG styling][SVG-styling]   

###How do you optimize your webpages for print?

* Create A Stylesheet For Print  
* Avoid Unnecessary HTML Tables
* Hiding Needless Element For Print
* Size Page For Print
* Use Page Break  

###What are some of the "gotchas" for writing efficient CSS?  

* Use efficient CSS selectors
	* Avoid a universal key selector.  
		Allow elements to inherit from ancestors, or use a class to apply a style to multiple elements.  
	* Make your rules as specific as possible.    
		Prefer class and ID selectors over tag selectors.  
	* Remove redundant qualifiers.   
		These qualifiers are redundant:   
		* ID selectors qualified by class and/or tag selectors  
		* Class selectors qualified by tag selectors (when a class is only used for one tag, which is a good design practice anyway).   
	* Avoid using descendant selectors, especially those that specify redundant ancestors.  
		For example, the rule body ul li a {...} specifies a redundant body selector, since all elements are descendants of the body tag.    
	* Use class selectors instead of descendant selectors.  
* Avoid CSS expressions
* Put CSS in the document head

###What are the advantages/disadvantages of using CSS preprocessors? (SASS, Compass, Stylus, LESS)   
If so, describe what you like and dislike about the CSS preprocessors you have used.  



###How would you implement a web design comp that uses non-standard fonts?
	Webfonts (font services like: Google Webfonts, Typekit etc.)  

###Explain how a browser determines what elements match a CSS selector?  

As the browser parses HTML, it constructs an internal document tree representing all the elements to be displayed. It then matches elements to styles specified in various stylesheets, according to the standard CSS cascade, inheritance, and ordering rules. In Mozilla's implementation (and probably others as well), for each element, the CSS engine searches through style rules to find a match. The engine evaluates each rule *from right to left*, starting from the rightmost selector (called the "key") and moving through each selector until it finds a match or discards the rule. (The "selector" is the document element to which the rule should apply.)  

###Explain your understanding of the box model and how you would tell the browser in CSS to render your layout in different box models.  

All HTML elements can be considered as boxes. In CSS, the term "box model" is used when talking about design and layout.

The CSS box model is essentially a box that wraps around HTML elements, and it consists of: margins, borders, padding, and the actual content.

*Important:* When you set the width and height properties of an element with CSS, you just set the width and height of the *content area*. To calculate the full size of an element, you must also add the padding, borders and margins.

IE8 and earlier versions of IE, included padding and border in the width property.  
To fix this problem, add a `<!DOCTYPE html>` to the HTML page.

The `box-sizing` [CSS](/en-US/docs/CSS "CSS/Common_CSS_Questions") property is used to alter the default [CSS box model](/en-US/docs/CSS/Box_model "CSS/Box_model") used to calculate widths and heights of elements. It is possible to use this property to emulate the behavior of browsers that do not correctly support the CSS box model specification.



[what-is-a-css-reset]:http://www.cssreset.com/what-is-a-css-reset/
[all-about-floats]:http://css-tricks.com/all-about-floats/
[css-sprites]:http://css-tricks.com/css-sprites/
[css-image-replacement]:http://css-tricks.com/css-image-replacement/
[understanding-progressive-enhancement]:http://alistapart.com/article/understandingprogressiveenhancement
[progressive-enhancement-graceful-degradation-basics]:http://www.sitepoint.com/progressive-enhancement-graceful-degradation-basics/

[css2-media]:http://www.w3.org/TR/CSS2/media.html
[SVG-styling]:http://www.w3.org/TR/SVG/styling.html
[optimizing-structure-print-css]:http://davidwalsh.name/optimizing-structure-print-css
[css-print-page-tricks]:http://slodive.com/web-development/css-print-page-tricks/

[Make-the-Web-Faster]:https://developers.google.com/speed/docs/best-practices/rendering?hl=zh-CN&csw=1
[Writing-efficient-CSS]:https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS?redirectlocale=en-US&redirectslug=CSS%2FWriting_Efficient_CSS
[w3c-css-box]:http://www.w3.org/TR/CSS2/box.html


