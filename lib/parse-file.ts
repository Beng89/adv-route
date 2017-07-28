import * as fs from "fs"
import { EOL } from "os"
import { parseRoute } from "./parse-route"
import { Route } from "./route"
export function parseFile(path: string) {
  path = process.cwd() + "/" + path

  return new Promise<Array<Route>>((resolve, reject) => {
    fs.exists(path, (exists) => {
      if (!exists) {
        return reject(new Error("file " + path + " does not exist"))
      }
    })

    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        return reject(err)
      }

      var routes: Array<Route> = []
      var lines = data.split(EOL)

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i]

        // remove leading and trailing whitespace
        line = line.trim();
        // replace excessive whitespace with a single whitespace
        line = line.replace(/\s\s+/g, " ")

        // empty line
        if (line.length == 0) {
          continue
        }
        // comment
        else if (line[0] == "#") {
          continue
        }

        try {
          routes.push(parseRoute(line))
        }
        catch (err) {
          err.message = "line " + (i + 1) + ": " + err.message
          return reject(err)
        }
      }

      resolve(routes)
    })
  })
}