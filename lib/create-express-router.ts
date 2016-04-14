import * as express from "express"
import { parseFile } from "./parse-file"

export function createExpressRouter(path: string, cb: Function) {
  var router = express.Router()
  
  parseFile(path).then((routes) => {
    for(var i = 0; i < routes.length; i++) {
      try {
        routes[i].mount(router)
      }
      catch(error) {
        return cb(error, null)
      }
    }
    cb(null, router)
  }).catch(error => {
    cb(error, null)
  })
}
export async function createExpressRouterAsync(path: string) {
  var router = express.Router()
  
  var routes = await parseFile(path)
  
  for(var i = 0; i < routes.length; i++) {
    routes[i].mount(router)
  }
  
  return router
}