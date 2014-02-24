项目中使用karma-runner来执行前端javascript测试用例。

项目包含多个基于MVC(backbone) + AMD(requirejs)的子项目，其目录结构大致为： 

+ DIR
	+ _FRAMEWORK
		+ framework
		+ framework-component
		+ framework-lib
		+ framework-vendor
	+ APP_A
	+ APP_B
	+ APP_C

其中`framework`项目可看作是一个可运行的空的APP,它依赖于`framework-lib`和`framework-vendor`,但它不依赖于`framework-component`.可以把`framework-component`看作一个演示系统组件的APP.  
`APP_A` `APP_B` `APP_C` 是负责具体业务逻辑的APP,它们都依赖于`framework`和`framework-component`以及其自身的依赖.   
根据karma官方文档 [karma + requirejs][karma + requirejs],要run`framework` 和`framework-component`的cases比较容易,而`APP_A` `APP_B` `APP_C`相对麻烦.

具体麻烦在哪里，需要先了解几个karma API:

#### Karma `/base` Directory    
Karma serves files under the `/base directory`. So, on the server requests to files will be served up under `http://localhost:9876/base/*`.   
The Require.js config for `baseUrl` gives a starting context for modules that load with relative paths. When setting this value for the Karma server it will need to start with /base. We want the baseUrl for our tests to be the same folder as the base url we have in `src/main.js`, so that relative requires in the source won’t need to change. So, as we want our base url to be at `src/`, we need to write `/base/src`.   
而这个`/base`是在karma.config.js `basePath`字段设置的.  

#### basePath  
**Type**: String    
**Default**: ' '  
**Description**: Base path, that will be used to resolve all relative paths defined in files and exclude. If basePath is a relative path, it will be resolved to the __dirname of the configuration file.  

当basePath为‘ ’时，就以karma.config.js文件所在目录为起始目录.如果basePath为相对路径时, karma serve 的`/base`目录将会是以karma.config.js文件所在目录为基础的相对路径上的目录.而这时仍可通过`__dirname`知道karma.config.js文件所在目录.

###问题  

当构建APP_A的测试环境,不可避免要配置所有依赖文件路径.karma.config.js文件自然而然会放在APP_A目录下，那basePath应当定位在哪个目录呢？  
有两个方案:     

* APP_A目录 - 这种方式karma server只能访问APP_A自身目录下的文件，访问不到_FRAMEWORK目录下的文件.想要访问,需要把`framework`和`framework-component`作为server运行起来，APP_A通过HTTP请求访问依赖.而这里又存在跨域问题,如[require.js text plugin adds “.js” to the file name][require-js-text-plugin-adds-js-to-the-file-name]

* DIR目录 
	这种方式没有上述问题.


[karma + requirejs][karma + requirejs]
[require-js-text-plugin-adds-js-to-the-file-name][require-js-text-plugin-adds-js-to-the-file-name]
[karma-issues][karma-issues]
[karma-requirejs-demo][karma-requirejs]
[reuqire-text-plugin-xhr-restrictions][karma-requirejs]
[preprocessors][preprocessors]
[coverage][coverage]
[karma-coverage-project][karma-coverage-project]

[karma-coverage-project]:https://github.com/karma-runner/karma-coverage
[karma + requirejs]: http://karma-runner.github.io/0.8/plus/RequireJS.html
[require-js-text-plugin-adds-js-to-the-file-name]: http://stackoverflow.com/questions/10607370/require-js-text-plugin-adds-js-to-the-file-name
[karma-issues]:https://github.com/karma-runner/karma/issues/740
[karma-requirejs]:https://github.com/kjbekkelund/karma-requirejs
[xhr-restrictions]:https://github.com/requirejs/text#xhr-restrictions
[preprocessors]:http://karma-runner.github.io/0.10/config/preprocessors.html
[coverage]:http://karma-runner.github.io/0.8/config/coverage.html