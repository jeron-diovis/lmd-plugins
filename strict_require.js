(function (sb) {
  /* throw errors in runtime if unexisting module required */

  var oldLmdRequire = lmd_require; // refers to variable from basic LMD scope
  lmd_require = function(moduleName) {
    var module = oldLmdRequire.apply(this, arguments);
    var err = "Module '" + moduleName + "' is undefined!";

    // is some another plugin suddenly exposes this useful info, use it
    if (sb.parentModule) {
      err += "\nCalled 'require(\"" + moduleName + "\")' from '" + sb.parentModule + "'";
    }

    if (module === undefined) {
      throw new Error(err);
    }

    return module;
  };

  // don't forget to restore properties, added by another plugins
  for (var prop in oldLmdRequire) {
    lmd_require[prop] = oldLmdRequire[prop];
  }

  sb.require = lmd_require;

}(sandbox));