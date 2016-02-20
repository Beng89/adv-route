var mocha = require("mocha")
var should = require("chai").should()
var express = require("express")

describe("routeParser", function() {
  var parser = require("../lib/route-parser")
  
  it("should throw an exception when there are not enough tokens", function(done) {
    should.throw(parser)
    done()
  })
  
  it("should append process.cwd() to the controller path by default", function(done) {
    function test() {
      var route = parser("get /myroute controller.method")
      
      should.equal(route.method, "get")
      should.equal(route.path, "/myroute")
      should.equal(route.controller, process.cwd() + "/controller")
      should.equal(route.target, "method")
      
      done()
    }
    
    should.not.throw(test)
  })
  
  it("should not append process.cwd() to the controller path when it starts with @", function(done) {
    function test() {
      var route = parser("get /myroute @controller.method")
      
      should.equal(route.method, "get")
      should.equal(route.path, "/myroute")
      should.equal(route.controller, "controller")
      should.equal(route.target, "method")
      
      done()
    }
    
    should.not.throw(test)
  })
  
  it("should correctly parse all tokens", function(done) {
    function test() {
      var route = parser("get /myroute controller.method")
      
      should.equal(route.method, "get")
      should.equal(route.path, "/myroute")
      should.equal(route.controller, process.cwd() + "/controller")
      should.equal(route.target, "method")
      
      done()
    }
    
    should.not.throw(test)
  })
  
  
  
  it("should ignore white space", function(done) {
    function test() {
      var route = parser("  get     /myroute controller.method")
      
      should.equal(route.method, "get")
      should.equal(route.path, "/myroute")
      should.equal(route.controller, process.cwd() + "/controller")
      should.equal(route.target, "method")
      
      done()
    }
    
    should.not.throw(test)
  })
  
  it("should succeed when the method token is missing", function(done) {
    function test() {
      var route = parser("  get     /myroute controller")
      
      should.equal(route.method, "get")
      should.equal(route.path, "/myroute")
      should.equal(route.controller, process.cwd() + "/controller")
      should.not.exist(route.target)
      
      done()
    }
    
    should.not.throw(test)
  })
})


describe("route.mount", function() {
  var parser = require("../lib/route-parser")
  var router = express.Router()
  
  it("should throw an exception while mounting if the controller cannot be resolved", function(done) {
    var route = parser("get /route controllers/controller_dne")
    
    function test() {
      route.mount(router)
    }
    
    should.throw(test, /Cannot find module/)
    
    done()
  })

  it("should throw an exception if the target function doesn\"t exist on the controller", function(done) {
    var route = parser("get /route tests/controllers/controller-0.test")
    
    function test() {
      route.mount(router)
      
      
    }
    
    should.throw(test, "target function test does not exist on controller " + process.cwd() + "/tests/controllers/controller-0")
    
    done()
  })
  
  it("should throw an exception if the target function is not a function", function(done) {
    function mount() {
      route.mount(router)
    }
    
    var route = parser("get /route tests/controllers/controller-1")
    should.throw(mount, "controllers must resolve to a function")
    
    route = parser("get /route tests/controllers/controller-1.test")
    should.throw(mount, "controllers must resolve to a function")
    
    done()
  })
  
  it("should throw an exception when an unsupported method is provided", function(done) {
    var route = parser("gremlin /route tests/controllers/controller-2.test")
    function mount() {
      route.mount(router)
    }
    
    should.throw(mount, "unsupported method gremlin")
    
    done()
  })
  
  it("should not throw any exceptions if mounting succeeds", function(done) {
    var route = parser("get /route tests/controllers/controller-2.test")
    function mount() {
      route.mount(router)
    }
    
    should.not.throw(mount, "unsupported method bad")
    
    done()
  })
})

describe("fileParser", function() {
  var fileParser = require("../lib/file-parser")
  it("should provide an error in the cb method when the file does not exist", function(done) {
    function cb(err, routes) {
      should.exist(err)
      should.equal(err.message, "file " + process.cwd() + "/bad_file does not exist")
      done()
    }
    function test() {
      fileParser("bad_file", cb)
    }
    
    should.not.throw(test)
  })
  
  it("should pass an exception in the callback if one of the routes fails to parse", function(done) {
    function cb(err, routes) {
      should.exist(err)
      should.equal(err.message, "line 0: incorrect number of tokens 13; routes require a method, a path and a controller")
      done()
    }
    function test() {
      fileParser("tests/route-files/bad", cb)
    }
    
    should.not.throw(test)
  })
  
  it("should ignore empty lines", function(done) {
    function cb(err, routes) {
      should.not.exist(err)
      should.equal(routes.length == 6, true)

      done()
    }
    function test() {
      fileParser("tests/route-files/whitespace", cb)
    }
    
    should.not.throw(test)
  })
  
  it("should ignore lines that start with #", function(done) {
    function cb(err, routes) {
      should.not.exist(err)
      should.equal(routes.length == 7, true)

      should.equal(routes[0].path, '/#/see')

      done()
    }
    function test() {
      fileParser("tests/route-files/comments", cb)
    }
    
    should.not.throw(test)
  })
  
  it("should correctly parse a file if it exists", function(done) {
    function cb(err, routes) {
      should.not.exist(err)
      should.equal(routes.length == 3, true)
      
      should.equal(routes[0].method, "get")
      should.equal(routes[0].path, "/something")
      should.equal(routes[0].controller, process.cwd() + "/special")
      should.not.exist(routes[0].target)
      
      should.equal(routes[1].method, "post")
      should.equal(routes[1].path, "/dosomething")
      should.equal(routes[1].controller, process.cwd() + "/class")
      should.equal(routes[1].target, "method")
      
      should.equal(routes[2].method, "put")
      should.equal(routes[2].path, "/morestuff")
      should.equal(routes[2].controller, "stuff")
      should.equal(routes[2].target, "explode")
      
      done()
    }
    function test() {
      fileParser("tests/route-files/good", cb)
    }
    
    should.not.throw(test)
  })
})

describe("createExpressApp", function() {
  var createExpressApp = require("../lib/create-express-app")
  
  it("should create an express app", function(done) {
    createExpressApp("tests/route-files/actual", (err, app) => {      
      should.not.exist(err)
      should.exist(app)
      
      done()
    })
  })
})

describe("createExpressRouter", function() {
  var createExpressRouter = require("../lib/create-express-router")
  
  it("should create an express app", function(done) {
    createExpressRouter("tests/route-files/actual", (err, app) => {      
      should.not.exist(err)
      should.exist(app)
      
      done()
    })
  })
})