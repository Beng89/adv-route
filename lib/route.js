/**
 * Creates a route
 * @constructor
 * @param {string} method - The route method (ie. GET)
 * @param {string} path - The route path (ie. /myapi/v1/something/awesome)
 * @param {string} controller - The path to the controller (ie. controllers/something)
 * @param {string} target - The controller function (ie. .awesome). if null; the controller is called directly
 */
module.exports = function Route(method, path, controller, target) {
  this.method = method.toLocaleLowerCase();
  this.path = path.toLocaleLowerCase();
  this.controller = controller
  this.target = target
 
  /**
   * mounts this route on the provided router
   * @param {express.Router} router 
   */
  this.mount = (router) => {
    /**
     * load the controller
     * @type {Object|Function}
     */
    var controller = require(this.controller)

    // if there is a target method, check to see if it exists and replace the original controller with it
    if(this.target) {
      if(!controller.hasOwnProperty(this.target)) {
        throw new Error("target function " + this.target + " does not exist on controller " + this.controller)
      }
      controller = controller[this.target]
    }
    
    // if controller is not a function, throw an error
    if(typeof(controller) != "function") {
      throw new Error("controllers must resolve to a function")
    }

    // use a switch (rather than checking for the method) to prevent 
    // unwanted method calls (ie. router.route(this.path, controller) would not be good...)
    switch(this.method) {
      case "all":
        router.all(this.path, controller)
        break
      case "get": 
        router.get(this.path, controller)
        break
      case "put":
        router.put(this.path, controller)
        break
      case "post":
        router.post(this.path, controller)
        break
      case "delete":
        router.delete(this.path, controller)
        break
      case "patch":
        router.patch(this.path, controller)
        break
      default: 
        throw new Error("unsupported method " + this.method)
    }
  }
}