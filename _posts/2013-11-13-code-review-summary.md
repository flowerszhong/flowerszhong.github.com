---
layout: post
title: 1st-code-review summary
description: code review
keyword: code review
---
每次做code review，先贤谆谆教诲便在耳畔响起:   
>“There are only two hard problems in Computer Science: cache invalidation and naming things.” —Phil Karlton  

将发现的问题整理如下:
             
####*Hard Code*    
这个永远是容易发现，也是最容易出现的问题，主要集中在 :     

+ 配置项    
    {% highlight javascript %}     
        this.investmentList = [{
            id: "ALL",
            name: "All Investments"
        }, {
            id: "FE",
            name: "ETF"
        }, {
            id: "FV",
            name: "Insurance Product Fund"
        }, {
            id: "FO",
            name: "Open-End Fund"
        }, {
            id: "SA",
            name: "Separate Account"
        }];   
    {% endhighlight %}   

+ Labels    
    {% highlight javascript %} 
        if (data.length == 0) { // no ma    nager info
            this.showMsgBox("No valid manager data available for the strategy.", true);
            this.hideBodyEl();
        }     
    {% endhighlight %}    

+ 逻辑标识   
    {% highlight javascript %}      
        if (dataType == 1) { // dataType == what 
            //compare the number type
        }
    {% endhighlight %}        


                     
####*单var模式与多var模式*      
#####[单var模式][single-var-mode]  

在函数的顶部使用唯一一个var语句是非常推荐的一种模式，它有如下一些好处：

* 可以在同一个位置找到函数所需的所有变量   
* 避免在变量声明之前使用这个变量时产生的逻辑错误（参考下一小节“声明提前：分散的var带来的问题”）  
* 提醒你不要忘记声明变量，顺便减少潜在的全局变量     
* 代码量更少（输入代码更少且更易做代码优化）    

单var模式看起来像这样：

{% highlight javascript %}      
function func() {
    var a = 1,
        b = 2,
        sum = a + b,
        myobject = {},
        i,
        j;
    // 函数体…
}  
{% endhighlight %}   

对于单 var 模式和多 var 模式，建议不做强行约定，但同一个文件里，风格必须一致。   
                  
####*命名规范*
+ 引入外部资源  
    * 应对引入的资源分组并以空行隔开，如mercury资源与mr资源，chartComponent资源与Grid资源，类与object...
    * 类名大驼峰，变量小驼峰，常量全大写     
    * 不用给一些常用工具类起不同于exports的别名，如系统中是这样配置jquery,underscorejs      
    {% highlight javascript %} 
    'jquery': {
      deps: [],
      exports: '$',
      init: function() {
        return this.$.noConflict();
      }
    },  
    'underscore': {
      deps: [],
      exports: '_',
      init: function () {
        return this._.noConflict();
      }
    }
    {% endhighlight %}          
+ 方法名    
    * 方法名拼写错误,如restFilterOption..
    * 太多的方法名以draw，load开头,有些名字不是很顾名思义   
       

####*方法参数不需要带下划线*  
这一点我还没查到具体文档，待讨论   
{% highlight javascript %}      
 renderUI: function(_el) { //_el => el
    _el.append(HTML);
    this.initParam();
    this._loadRequestParam();
    this.drawHeader();
    this._tableTemplate = null;
    this._tableData = null;
}
{% endhighlight %}  

          
####*多用$el.empty().append(value),少用$el.html(value)*  
[$().html(value) vs $().empty().append(value)比较][html-vs-empty-append]
                
refs :    

[single-var-mode][single-var-mode]    
[html-vs-empty-append][html-vs-empty-append]    
[requireJs-config](http://requirejs.org/docs/api.html#config)   


[single-var-mode]: https://github.com/TooBug/javascript.patterns/blob/master/chapter2.markdown
[html-vs-empty-append]: http://flowerszhong.github.io/2013/10/07/jquery-html-vs-empty-append.html