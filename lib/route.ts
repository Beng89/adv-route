import { Router } from "express"

export class Route {
  constructor(method: string, path: string, controller: string, target?: string) {
    this.method = method
    this.path = path
    this.controller = controller
    this.target = target
  }

  method: string
  path: string
  controller: string
  target: string

  mount(router: Router) {
    var controller = require(this.controller)

    // if there is a target method, check to see if it exists and replace the original controller with it
    if (this.target) {
      if (!controller.hasOwnProperty(this.target)) {
        throw new Error("target function " + this.target + " does not exist on controller " + this.controller)
      }
      controller = controller[this.target]
    }

    // if controller is not a function, throw an error
    if (typeof (controller) != "function") {
      throw new Error("controllers must resolve to a function")
    }

    process.stdout.write(`(${this.method}) (${this.path}) (${this.controller}) (${this.target}) \n`);

    // use a switch (rather than checking for the method) to prevent 
    // unwanted method calls (ie. router.route(this.path, controller) would not be good...)
    switch (this.method.toLowerCase()) {
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
      case "use":
        if (typeof this.path === "string") {
          router.use(this.path, controller);
        } else {
          router.use(controller);
        }
        break;
      case "param":
        if (typeof this.path === "string") {
          router.param(this.path, controller);
        } else {
          router.param(controller);
        }
        break;
      default:
        throw new Error("unsupported method " + this.method)
    }
  }
}