lmd-plugins
===========

Some simple plugins for LMD loader

Read [this page](https://github.com/azproduction/lmd/wiki/User-made-plugins) to learn how to install and configure plugins.

# List of plugins

### Relative paths
  Relative paths support like in RequireJS
```JavaScript
require('./siblingModule');
require('../../parentModule');
```

**NOTE**, that it will work only if your modules names repeats files tree structure. That is, you should configure your modules like this:
```JavaScript
{
    modules: {
      "<%= subdir %><%= file %>": "**/*.js"
    }
}
```
However, probably, most projects use this approach, aren't they?
 
##### Options:
  Option | Values | Description
  ------ | ------ | ------
  log | boolean | Set to true to enable logging a tree of 'require' calls. It uses browser's ```console.group``` / ```console.groupEnd``` methods, and will be silently disabled if these methods are absent.

##### Features:
 * Single dot at the beginning is always allowed. On root level it is just skipped.
 * Mixing and splitting relative paths is not allowed. After all, normally it is unlikely you will need to write something like this:
```JavaScript 
require('../../someDir/./.././someModule')
```
 * Paths leading outside of file tree do not throw exceptions.
It's because LMD itself does not reacts anyhow if you require unexisting module in runtime. Maybe, it is a bug, but for now we must use same approach.
So, just ```undefined``` will be returned in this case.
If you don't like this, next plugin is for you.

===
### "Strict" require
Overrides default LMD behavior, by modifying "require" function so it throws exception if required module was not found. Just like RequireJS.

**NOTE**, 'not found' means 'returns undefined', so if you explicitly assign ```module.exports = undefined``` - you will get an exception.

##### Features:
 * when combined with "relative paths" plugin, this plugin will show additional error details when your relative path leads outside of file tree:
```Javascript
Uncaught Error: Module '../../../unexisting' is undefined!
Called 'require("../../../unexisting")' from 'packages/test/main' 
```
It is done to simplify further debugging.

===
### Expose require
This plugin just exports 'require' function to global scope.
It contradicts with origin LMD approach, and you definitely should not use it in production build. But for developing and debugging it can very useful.

##### Features:
 * if you also use some of plugins above, be sure that you place this plugin the last in plugins list in your LMD config:
```JavaScript 
{ 
       plugins: {
           "relative_paths": "/path/to/plugin",
           ... more plugins ...
           "expose_require": "/path/to/plugin",
       }
}
```
Otherwise, not fully-patched 'require' will be exposed, so your app and console will behave differently.
