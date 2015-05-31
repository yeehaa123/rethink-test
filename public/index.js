'use strict';

var Client = require('react-engine/lib/client');

// Include all view files. Browerify doesn't do
// this automatically as it can only operate on
// static require statements.
require('./views/**/*.jsx', {glob: true});


// boot options
var options = {
  // supply a function that can be called
  // to resolve the file that was rendered.
  viewResolver: function(viewName) {
    return require('./views/' + viewName);
  }
};

document.addEventListener('DOMContentLoaded', function onLoad() {
  Client.boot(options);
});
