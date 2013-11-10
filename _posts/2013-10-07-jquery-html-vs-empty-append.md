---
layout: post
title: $().html(value) vs $().empty().append(value)
description: mzhong
keyword: jsPerf $.html vs empty().append
---

当需要清空某个dom结点内容时，我所知道的有两种方法：  
1.*Element.removeChild(child)*    
{% highlight javascript %}   
// Removing all children from an element  
var element = document.getElementById("test");  
while (element.firstChild) {  
  element.removeChild(element.firstChild);  
}     
{% endhighlight %}  

2.*Element.innerHTML=""*

第一种方式虽然可读性较好，但显然不如第二种方法简洁。   
理论上方式2会比方式1快很多，从代码上来分析也是如此，至少方式二不用做while循环，也不用判断属性。事实上也的确如此，但只限于子结点较少的情况下。  
在子结点个数多过的情况下，方式1是优于方式2的。性能测试之[killing a lots of kids][kill-lots-kids]　　　

jquery提供了两个类似的接口与之相对应:  
1.$().empty()   
2.$().html('')   

所以，替换dom内容也同样有两种方式:  
1.$().empty().append(HTMLString|HTMLElement|jQueryElement)    
2.$().html(HTMLString)  

jQuery 1.9.1 empty方法实现如下，与方式1相似     
{% highlight javascript %}      
empty: function() {
	var elem,
		i = 0;

	for ( ; (elem = this[i]) != null; i++ ) {
		// Remove element nodes and prevent memory leaks
		if ( elem.nodeType === 1 ) {
			jQuery.cleanData( getAll( elem, false ) );
		}

		// Remove any remaining nodes
		while ( elem.firstChild ) {
			elem.removeChild( elem.firstChild );
		}

		// If this is a select, ensure that it displays empty (#12336)
		// Support: IE<9
		if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
			elem.options.length = 0;
		}
	}

	return this;
}  
{% endhighlight %}   


jQuery 1.9.1 html方法的实现:  
{% highlight javascript %}    
html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

{% endhighlight %}
可以看到，当传入的参数不为html字符串时，会执行这样的语句:    
{% highlight javascript %}  
if ( elem ) {
	this.empty().append( value );
}  
{% endhighlight %}  
不言而喻，当传入的参数不为html字符串或html字符串较长时，$().empty().append(value)的性能会优于$().html(value),性能测试之[jquery html vs empty ppend][jquery-html-vs-empty-append];  
同时，基于代码可读性也建议优先使用*$().empty().append(value)*


refs :   
[jquery-html-vs-empty-append][jquery-html-vs-empty-append]   
[kill-lots-kids][kill-lots-kids]   
[deleting-child-nodes-of-a-div-node][deleting-child-nodes-of-a-div-node]  

[deleting-child-nodes-of-a-div-node]: http://stackoverflow.com/questions/9461301/deleting-child-nodes-of-a-div-node　　
[kill-lots-kids]: http://jsperf.com/killing-lots-of-kids
[jquery-html-vs-empty-append]: http://jsperf.com/jquery-html-vs-empty-append-test/6


