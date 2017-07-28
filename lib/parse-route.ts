import { Route } from "./route"
import * as pathModule from "path";
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
//
// DELETE /index.html           pages/homepage

const Parsers = [
  // USE
  [/^use\s+(?:(\/[^\s]*)\s+)?([^\s.]+)[.]?([^\s]+)??\s*(?:[#].*)?$/, (match: RegExpMatchArray) => {
    console.error(match);
    const method = "use";

    // Path is optional
    let path = match[1];

    // Controller can be relative or absolute
    let controller = match[2];
    if (controller[0] === "@") {
      controller = controller.substr(1);
    } else {
      controller = pathModule.join(process.cwd(), controller);
    }

    // Target is optional
    let target = match[3];

    return new Route(method, path, controller, target);
  }],
  // Standard HTTP Methods
  // https://regex101.com/r/5ddAJF/8
  [/^(all|get|post|put|delete|patch|head)\s+(\/[^\s]*)\s+([^\s.]+)[.]?([^\s]+)??\s*(?:[#].*)?$/i, (match: RegExpMatchArray) => {
    const method = match[1];
    const path = match[2];

    // Controller can be relative or absolute
    let controller = match[3];
    if (controller[0] === "@") {
      controller = controller.substr(1);
    } else {
      controller = pathModule.join(process.cwd(), controller);
    }

    // Target is optional
    let target = match[4];

    return new Route(method, path, controller, target);
  }]
] as Array<[RegExp, (match: RegExpMatchArray) => Route]>;

export function parseRoute(str: string) {
  var tokens = str.split(" ")

  let route = null;
  for (let i = 0; i < Parsers.length; i++) {
    const parser = Parsers[i];

    const match = str.match(parser[0]);
    if (Array.isArray(match)) {
      route = parser[1](match);
      break;
    }
  }

  if (route instanceof Route) {
    return route;
  } else {
    return new Route(null, null, null, null);
  }
}