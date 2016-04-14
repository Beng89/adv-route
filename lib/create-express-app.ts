import * as express from "express"
import { parseFile } from "./parse-file"

export function createExpressApp(path: string, cb: Function) {
  var app = express()

  parseFile(path).then((routes) => {
    for(var i = 0; i < routes.length; i++) {
      try {
        routes[i].mount(app)
      }
      catch(error) {
        return cb(error, null)
      }
    }
    cb(null, app)
  }).catch((error) => {
    cb(error, null)
  })
}
export async function createExpressAppAsync(path: string) {
  var app = express()
  
  var routes = await parseFile(path)
  
  for(var i = 0; i < routes.length; i++) {
    routes[i].mount(app)
  }
  
  return app
}