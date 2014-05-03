---
layout: post
title: js quiz
description: javascript question
keyword: javascript question
category : javascript
tags : [javascript,quiz]
---
{% include JB/setup %}

### 找出字符串出现最多次数的字符

{% highlight javascript %}
var str = "sakfjksdjffffffff";

function getMostFrequenceLetter(str){
    var i = 0,
        len = str.length,
        dict = {},
        list = [];
    for (; i<len; i++) {
        var c = str[i];//char
        dict[c] = dict[c]? (dict[c]+1):1;
        list[dict[c]] = c;
    };

    return list.slice(-1);
}

getMostFrequenceLetter(str);
{% endhighlight %}


### 数组去重

{% highlight javascript %}
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

// usage example:
var a = ['a', 1, 'a', 2, '1'];
var unique = a.filter( onlyUnique )
{% endhighlight %}

### 求对称数

{% highlight javascript %}
function isSymmetry (num) {
    return num.toString().split('').reverse().join('') == num
}
{% endhighlight %}


### 字符串模板方法
{% highlight javascript %}
if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(
            /\{([^{}]*)\}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}
param = {domain: 'valvion.com', media: 'http://media.valvion.com/'};
url = "{media}logo.gif".supplant(param);//"http://media.valvion.com/logo.gif".
{% endhighlight %}

### 支持嵌套

{% highlight javascript %}
if (!String.prototype.supplant) {
    String.prototype.supplant = function(o) {
        return this.replace(
            /\{([^{}]*)\}/g,
            function(a, b) {
                var p = b.split('.');
                var r = o;
                try {
                    p.forEach(function(v, k) {
                        r = r[v]
                    })
                } catch (e) {
                    r = a;
                }
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}
param = {domain: 'valvion.com', c:{a:{media: 'http://media.valvion.com/'}};
url = "{c.a.media}logo.gif".supplant(param);//"http://media.valvion.com/logo.gif".
{% endhighlight %}



[unique-values-in-an-array]:http://stackoverflow.com/questions/1960473/unique-values-in-an-array

[Operator_Precedence]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence

[stringsupplant]:http://www.justise.com/2007/12/28/stringsupplant-a-jewel-from-douglas-crockford/
[javascript-remedial]:http://javascript.crockford.com/remedial.html

[string-supplant]:http://stackoverflow.com/questions/6857552/regular-expression-in-crockfords-string-supplant


