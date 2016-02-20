var express = require("express")
var fileParser = require("./file-parser")

/**
 * Creates an express app from a route file
 * @param {string} filepath - the path to the route file (relative to process.cwd())
 * @param {Function} cb - the callback method that is called when the app is created
 */
module.exports = function createExpressApp(filepath, cb) {
  var app = express()
 
  fileParser(filepath, function(err, routes) {
    if(err) {
      return cb(err)
    }
    
    var cbCalled = false
    routes.forEach(function(route, i) {
      if(cbCalled) {
        return
      }
      
      try {
        route.mount(app)
      }
      catch(err) {
        cbCalled = true
        cb(err, null)
      }
    })
    
    if(!cbCalled) {
      cb(null, app)
    }
  })
}