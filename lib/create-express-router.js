var express = require("express")
var fileParser = require("./parse-file")

/**
 * Creates an express app from a route file
 * @param {string} filepath - the path to the route file (relative to process.cwd())
 * @param {Function} cb - the callback method that is called when the router is created
 */
module.exports = function createExpressRouter(filepath, cb) {
  var router = express.Router()
 
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
        route.mount(router)
      }
      catch(err) {
        cbCalled = true
        cb(err, null)
      }
    })
    
    if(!cbCalled) {
      cb(null, router)
    }
  })
}