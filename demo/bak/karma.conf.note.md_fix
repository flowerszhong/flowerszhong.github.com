Hi Vishwanath,
 
Attachment file is a demo base on your folder: jasmine-karma-trial, it can be work fine in my local PC, please try it in your side. You can compare them with your local files to see the difference.
As you have two test case file, and I just choose one file to make the demo, you can change another file according the ready one.
 
Here is my thought why I do these changes.
1.       I added all the new dependencies paths in file KarmaRequireSetting.js since we need to integrate all the dependencies ready before we run the karma (you can see these changes in your KarmaRequireSetting.js file). This may very inconvenient for us currently, and I have tried to map this part to our product so that we don’t need care this anymore, but I am failed, so, we can’t skip this step currently.
2.       I use local absolute address instead your localhost:8080, since localhost:8080 for the target files may bring some problems, like localhost:8080 will translate the address in tomcat, that may bring much files can’t find, it is hard for you to debug. Also, localhost:8080 has cross domain error sometimes, like using require("text!stockQuotes/html/stockQuotes.html") to load the html file, that may failed, It will link to file stockQuotes.html.js(use local absolute address can avoid this problem). But local absolute address have a weakness that you need to add these target files in karma.conf.js file, so, I make other dependencies as remote web files, like 'pushengine' : 'http://mercury-dev.morningstar.com/markets/trunk/components/pushengine',
 
By the way, I am not sure whether you found the debug tools in Chrome. You can find a DEBUG button in the top right, that is very helpful, click this button, it will generate a new page, and we can find the helpful error message from console panel.
 
Hope this is helpful, and let me know if you need other information.
