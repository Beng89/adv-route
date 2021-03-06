var mocha = require("mocha")
var should = require("chai").should()
var express = require("express")
var module = require("..")

describe("parseRoute", function () {
  var parseRoute = require("..").parseRoute

  it("should throw an error when a route does not match any known parsers", function (done) {
    should.throw(parseRoute.bind(null, "Failed to parse"));
    done();
  });
  it("should throw an exception when there are not enough tokens", function (done) {
    should.throw(parseRoute.bind(null, "only two"))
    done()
  })

  it("should throw an exception when there are too many tokens", function (done) {
    should.throw(parseRoute.bind(null, "get /myroute /test/lots.tokens see what happens when there are too many tokens?"));
    done()
  })

  it("should prepend process.cwd() to the controller path by default", function (done) {
    should.not.throw(function () {
      var route = parseRoute("get /myroute controller.method")

      should.equal(route.method, "get")
      should.equal(route.path, "/myroute")
      should.equal(route.controller, process.cwd() + "/controller")
      should.equal(route.target, "method")

      done()
    })
  })

  it("should not prepend process.cwd() to the controller path when it starts with @", function (done) {
    should.not.throw(function () {
      var route = parseRoute("get /myroute @controller.method")

      should.equal(route.method, "get")
      should.equal(route.path, "/myroute")
      should.equal(route.controller, "controller")
      should.equal(route.target, "method")

      done()
    })
  })

  it("should correctly parse all tokens", function (done) {
    should.not.throw(function () {
      var route = parseRoute("get /myroute controller.method")

      should.equal(route.method, "get")
      should.equal(route.path, "/myroute")
      should.equal(route.controller, process.cwd() + "/controller")
      should.equal(route.target, "method")

      done()
    })
  })

  it("should succeed when the method token is missing", function (done) {
    should.not.throw(function () {
      var route = parseRoute("get /myroute controller")

      should.equal(route.method, "get")
      should.equal(route.path, "/myroute")
      should.equal(route.controller, process.cwd() + "/controller")
      should.not.exist(route.target)

      done()
    })
  })
})

describe("route.mount", function () {
  var parseRoute = require("..").parseRoute
  var router = express.Router()

  it("should throw an exception while mounting if the controller cannot be resolved", function (done) {
    // controllers/controller_dne should never exist...
    var route = parseRoute("get /route controllers/controller_dne")
    should.throw(route.mount.bind(route, router), /Cannot find module/)
    done()
  })

  it("should throw an exception if the target function doesn't exist on the controller module", function (done) {
    var route = parseRoute("get /route tests/controllers/invalid/function-dne.test")
    should.throw(route.mount.bind(route, router), "target function test does not exist on controller " + process.cwd() + "/tests/controllers/invalid/function-dne")
    done()
  })

  it("should throw an exception if the target controller module is not a function", function (done) {
    var route = parseRoute("get /route tests/controllers/invalid/module-not-a-function")
    should.throw(route.mount.bind(route, router), "controllers must resolve to a function")
    done()
  })

  it("should throw an exception if the target controller module.function is not a function", function (done) {
    var route = parseRoute("get /route tests/controllers/invalid/module-target-not-a-function.test")
    should.throw(route.mount.bind(route, router), "controllers must resolve to a function")
    done()
  })

  it("should not throw any exceptions when mounting a valid module level controller", function (done) {
    var route = parseRoute("get /route tests/controllers/valid/module")
    should.not.throw(route.mount.bind(route, router))
    done()
  })

  it("should not throw any exceptions when mounting a valid module.target level contorller", function (done) {
    var route = parseRoute("get /route/test tests/controllers/valid/function.test")
    should.not.throw(route.mount.bind(route, router))
    done()
  })
})

describe("parseFile", function () {
  var parseFile = require("..").parseFile
  it("should reject the promise when the file does not exist", function (done) {
    should.not.throw(() => {
      parseFile("bad_file").then(routes => {
        should.not.exist(routes)
      }).catch(error => {
        should.exist(error)
        done()
      })
    })
  })

  it("should ignore empty lines", function (done) {
    should.not.throw(() => {
      parseFile("tests/route-files/whitespace").then(routes => {
        should.exist(routes)
        should.equal(routes.length == 6, true)
        done()
      }).catch(error => {
        should.not.exist(error)
      })
    })
  })

  it("should ignore lines that start with #", function (done) {
    should.not.throw(() => {
      parseFile("tests/route-files/comments").then(routes => {
        should.equal(routes.length == 7, true)
        done()
      }).catch(error => {
        should.not.exist(error)
      })
    })
  })

  it("should not ignore routes that contain #", function (done) {
    should.not.throw(() => {
      parseFile("tests/route-files/comments").then(routes => {
        should.equal(routes[0].path, "/#/see")
        done()
      }).catch(error => {
        should.not.exist(error)
      })
    })
  })

  // This will require some rework to report again.
  // it("should report the correct line number that an error occurs on", function (done) {
  //   should.not.throw(() => {
  //     parseFile("tests/route-files/line-4-bad").then(routes => {
  //       should.not.exist(routes)
  //     }).catch(error => {
  //       should.exist(error)
  //       should.exist(error.message)
  //       should.exist(error.message.match(/line 4/));
  //       done()
  //     })
  //   })
  // })

  it("should correctly parse a file if it exists", function (done) {
    should.not.throw(() => {
      parseFile("tests/route-files/valid").then(routes => {
        try {
          should.equal(routes.length, 9);

          should.equal(routes[0].method, "get")
          should.equal(routes[0].path, "/less")
          should.equal(routes[0].controller, process.cwd() + "/tests/controllers/less")
          should.not.exist(routes[0].target)

          should.equal(routes[1].method, "post")
          should.equal(routes[1].path, "/more")
          should.equal(routes[1].controller, process.cwd() + "/tests/controllers/more")
          should.equal(routes[1].target, "evenMore")

          should.equal(routes[2].method, "delete")
          should.equal(routes[2].path, "/enough")
          should.equal(routes[2].controller, process.cwd() + "/tests/controllers/enough")
          should.not.exist(routes[2].target);

          should.equal(routes[3].method, "use")
          should.equal(routes[3].path, "/user")
          should.equal(routes[3].controller, process.cwd() + "/tests/controllers/less")
          should.not.exist(routes[3].target)

          should.equal(routes[4].method, "use")
          should.equal(routes[4].path, "/user2")
          should.equal(routes[4].controller, process.cwd() + "/tests/controllers/more")
          should.equal(routes[4].target, "evenMore");

          should.equal(routes[5].method, "use")
          should.not.exist(routes[5].path);
          should.equal(routes[5].controller, process.cwd() + "/tests/controllers/less")
          should.not.exist(routes[5].target)

          should.equal(routes[6].method, "use")
          should.not.exist(routes[6].path);
          should.equal(routes[6].controller, process.cwd() + "/tests/controllers/more")
          should.equal(routes[6].target, "evenMore");

          should.equal(routes[7].method, "param")
          should.equal(routes[7].path, "id");
          should.equal(routes[7].controller, process.cwd() + "/tests/controllers/less")
          should.not.exist(routes[7].target)

          should.equal(routes[8].method, "param")
          should.equal(routes[8].path, "id");
          should.equal(routes[8].controller, process.cwd() + "/tests/controllers/more")
          should.equal(routes[8].target, "evenMore");

        } catch (err) {
          done(err);
          return;
        }

        done()
      }).catch(error => {
        should.not.exist(error)
      })
    })
  })
})

describe("createExpressApp", function () {
  var createExpressApp = require("..").createExpressApp

  it("should create an express app", function (done) {
    createExpressApp("tests/route-files/valid", (err, app) => {
      if (err) {
        done(err);
        return;
      }

      should.exist(app)
      done();
    })
  })
})

describe("createExpressRouter", function () {
  var createExpressRouter = require("..").createExpressRouter

  it("should create an express router", function (done) {
    createExpressRouter("tests/route-files/valid", (err, router) => {
      if (err) {
        done(err);
        return;
      }

      should.exist(router)
      done()
    })
  })
})

describe("createExpressAppAsync", function () {
  var createExpressAppAsync = require("..").createExpressAppAsync

  it("should create an express app", function (done) {
    createExpressAppAsync("tests/route-files/valid").then(app => {
      should.exist(app)
      done()
    }).catch(error => {
      done(error);
    })
  })
})

describe("createExpressRouterAsync", function () {
  var createExpressRouterAsync = require("..").createExpressRouterAsync

  it("should create an express router", function (done) {
    createExpressRouterAsync("tests/route-files/valid").then(router => {
      should.exist(router)
      done()
    }).catch(error => {
      done(error);
    })
  })
})