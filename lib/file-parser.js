var fs = require("fs")
var routeParser = require("./route-parser")

var EOL = require("os").EOL;

/**
 * Parses the file into an array of routes
 * @param {string} path - The path (relative to process.cwd())
 * @param {Function} cb - The callback method
 */
module.exports = function fileParser(path, cb) {
  path = process.cwd() + "/" + path

  fs.exists(path, function(exists) {
    if(!exists) {
      return cb(new Error("file " + path + " does not exist"), null)
    }
    
    fs.readFile(path, "utf-8", function(err, data) {
      if(err) {
        return cb(err, null)
      }
      
      var routes = []
      var cbCalled = false
      var lines = data.split(EOL)
      lines.forEach(function(line, i) {
        if(cbCalled) {
          return
        }
        
        // support empty lines and comments
        line = line.replace(/^\s\s+/, "");
        if(line.length == 0 || line[0] == '#') {
          return
        }
        
        try {
          routes.push(routeParser(line))
        }
        catch(err) {
          cbCalled = true
          err.message = "line " + (i + 1) + ": " + err.message 
          cb(err, null)
        }
      })
      
      if(!cbCalled) {
        cb(null, routes)
      }
    })
  })
}