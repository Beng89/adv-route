import { Route } from "./route"

// ************* //
// ** formats ** //
// ************* //

// $METHOD $PATH $CONTROLLER
// - compiled => router.$METHOD($PATH, require($CONTROLLER))
// $METHOD $PATH $CONTROLLER.$METHOD
// - compiled => router.$METHOD($PATH, require($CONTROLLER).$METHOD)


// ************** //
// ** examples ** //
// ************** //

// GET  /api/v1/accounts        accounts.getAll
// => router.get("/api/v1/accounts", require("accounts").getAll)
//
// POST /api/v1/account/:name   accounts.addOne
// => router.post("/api/v1/account/:name", require("accounts").addOne)
//
// GET /index.html              pages/homepage
// => router.get("/index.html", require("pages/homepage))

export function parseRoute(str: string) {
  var tokens = str.split(" ")

  if(tokens.length != 3) {
    // if there are less than 3 tokens throw the exception automatically
    // if there are more than 3 tokens, check to see if it is a trailing comment
    if(tokens.length < 3 || tokens[3] != "#") {
      throw new Error("incorrect number of tokens " + tokens.length + "; routes require a method, a path and a controller")
    }  
  }
  
  var controller = tokens[2].split(".")
  
  // controller paths that start with @ will ne interpreted as literals, otherwise the cwd is appended to it
  return new Route(tokens[0], tokens[1], controller[0][0] == "@" ? controller[0].substr(1) : process.cwd() + "/" + controller[0], controller.length > 1 ? controller[1] : null)
}