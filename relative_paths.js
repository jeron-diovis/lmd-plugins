(function (sb) {

  /*
  * Allows LMD to process relative paths like RequireJS.
  *
  * It works only for modules whose names are repeat file tree structure -
  * that is, you should use naming expressions like this:
  *  "modules": { "<%= subdir %><%= file %>": "** /*.js" }
  *
  * The main purpose of using this is to implement in code a 'packages' architecture, when main package file requires it's neighboring files
  */
  var oldLmdRequire = lmd_require, // refers to variable from basic LMD scope
      path = ['main']; // LMD build always starts from 'main' module

  lmd_require = function(moduleName) {
    var parent = path[path.length - 1];

    var
      moduleNameParts = moduleName.split('/'),
      parentParts = parent.split('/'),
      stepsUpside = 0,
      isRelative = false,
      opts = sb.options.relative_paths || {},
      isLoggingEnabled = opts.log && global.console && global.console.group;

    path.push(moduleName);

    if (isLoggingEnabled) {
      var logGroup = 'Require ' + moduleName + ' from ' + parent;
      console.group(logGroup);
    }

    if (moduleNameParts[0] === '.') {
      isRelative = true;
      moduleNameParts.shift();
    }
    while (moduleNameParts[0] === '..') {
      stepsUpside++;
      moduleNameParts.shift();
    }
    isRelative = isRelative || stepsUpside > 0;

    if (isRelative) {
      // ++ to get out also last part, which is file name
      if (++stepsUpside > parentParts.length) {
        // path leads outside of tree, so module can't be found
        // do not throw exception as it contradicts with default LMD behavior (so 'undefined' will be returned after all)
        // instead, expose debug info so another plugin could use it
        sb.parentModule = parent;
      } else {
        moduleName = parentParts.slice(0, -stepsUpside).concat(moduleNameParts).join('/');
      }
    }

    var module = oldLmdRequire(moduleName);

    path.pop();

    if (isLoggingEnabled) {
      console.groupEnd(logGroup);
    }

    return module;
  };

  // don't forget to restore properties, added by another plugins
  for (var prop in oldLmdRequire) {
    lmd_require[prop] = oldLmdRequire[prop];
  }

  sb.require = lmd_require;

}(sandbox));