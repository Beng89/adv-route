# adv-route

### An easy to use module for separating express application, routing and server logic.

___

## API

- createExpressApp(filepath: string, cb: (err?: Error, app?: express.Application) => void)
  - creates an express application from the specified routefile
- createExpressRoute(filepath: string, cb: (err? Error, router?: express.Router) => void)
  - creates an express roouter from the specified routefile
- parseFile(path: string, cb: (err?: Error, routes?: Array<Route>) => void)
  - parses a route file into an array of Route objects asynchronously
- Route(method: string, path: string, controller: string, target?: string)
  - Creates an instance of a route object
  - mount(router: express.Application | express.Router)
    - mounts this route onto the specified router.
- parseRoute(str: string): Route
  - parses a route from the given string 

___

## Typescript Definitions

Typescript definitions can be installed using typings after adv-route has been installed.

```Shell
typings install --save file:/node_modules/adv-route
```

___

## The Basics

The goal of adv-route is to provide an easy to use syntax for 
sementically separatingapplication, route and server logic. 

Take the following example:

```Javascript
// file:index.js
// description: The main entry point for my website.

var app = require("express")()

app.get("/", function homePage(req, res, next) {
  /**
   * perform logic for rendering the homepage...
   */
})

app.get("/info", function infoPage(req, res, next) {
  /**
   * perform logic for rendering the info page...
   */
})

/**
 * define any further routes...
 */
 
app.listen(3000, function() {
  console.info("my site is listening @ port 3000")
}
```

Notice how the application logic is directly tied to the routing 
and server logic? 

adv-route separates this logic by encapsulating middleware into 
controllers and providing a syntax for mapping routes to controllers

With adv-route the above example would look like:

```
# file: routes
# description: contains the route definitions 

# page-routes
get   /       controllers/pages/home
get   /info   controllers/pages/info

# any other routes can be easily added here
```

### The page logic is then separated into controller files:

```Javascript
// file: pages/home
// description: Contains the logic for rendering the homepage

module.exports = function(req, res, next) {
  /**
   * perform logic for rendering the homepage...
   */
}
```

```Javascript
// file: pages/info
// description: Contains the logic for rendering the info page

module.exports = function(req, res, next) {
  /**
   * perform logic for rendering the info page...
   */
}
```

### The main entry point for the server

```Javascript
// file: index.js
// description: The main entry point for my website

var advRoute = require("adv-route")

advRoute.createExpressApp("routes", function(err, app) {
  if(err) {
    return console.error(err);
  }
  
  app.listen(3000, function() {
    console.info("my site is listening @ port 3000")
  }
})
```

___

## Route File Details

### Comments

- lines that start with a '#' are considered comments
- comments can also tail routes
  - ie. get / controllers/home # this is a valid route entry 
  
### routes can target a controller module 

- METHOD ROUTE_PATH CONTROLLER_PATH
  
### routes can target a specific function from the controller module

- METHOD ROUTE_PATH CONTROLLER_PATH.CONTROLLER_FUNCTION

### Supported REST methods:

- ALL
- GET
- POST
- PUT
- DELETE
- PATCH
- HEAD

### Express route params are preserved
- ie. /:param/test will have access to req.params.test 

### Controller paths
- by default, CONTROLLER_PATH is relative to process.cwd()
  - ie. my-middleware will be interpreted as process.cwd() + "/my-middleware"
- to specify a literal CONTROLER_PATH prefix it with the '@' symbol
  - ie. @my-middleware will be interpreted literally as "my-middleware"

___

## Complex Example

### This example illustrates the use of route files for a complex website that

- uses marko templates for rendering html content.
- maintains sessions for users
- allows users to reigster for an account
- allows users to log into and out of their account
- exposes login and account functionality via a REST api

### Project Directory Structure:

* complex-site/
  * index.js
  * routes/
    * api
    * pages
  * assets/
    * browser.js
    * styles.css
  * controllers/
    * api/
      * v1/
        * logout.js
        * login.js
        * account.js
    * pages/
      * account/
        * index.js
        * template.marko
      * home/
        * index.js
        * template.marko
      * login/
        * index.js
        * template.marko
      * register
        * index.js
        * template.marko
      * errors/
        * not-found
          * index.js
          * template.marko
        * internal-error
          * index.js
          * template.marko
    * public.js
    * session.js

### Server Entry Point

```Javascript
// file: index.js
// description: the main entry point for complex-example.com's web server

var express = require("express")
var advRoute = require("adv-route")

var app = express()

// create and mount the api router
advRoute.createExpressRouter("routes/api", function(err, router) {
  app.use("/api/v1", router)
  
  // add the pages router here so that it is added after the api router
  advRoute.createExpressRouter("routes/pages", function(err, router) {
    app.use(router)
    
    app.listen(3000, function() {
      console.info("server listening @3000")
    })
  })
})
```

### Route Files

```
# file: routes/pages
# description: route file for complex-example.com web pages

# requests made to /public/** will be treated as static asset requests
get   /public/**         controllers/public

# ensure that all pages have a session attached to them
all   *           controllers/session.ensure

# homepage
get   /           controllers/pages/home                  # render the homepage template

# account
get   /account    controllers/session.redirectAnyonymous  # redirect users that are not logged in
get   /account    controllers/pages/account               # render the users account page template

# login 
get   /login      controllers/session.redirectLoggedIn    # redirect users that are already logged in
get   /login      controllers/pages/login                 # render the login page template

# registration
get   /register   controllers/session.redirectLoggedIn    # redirect users that are already logged in
get   /register   controllers/pages/register              # render the registration page template

# errors
all   *           controllers/errors/not-found            # catch any requests that are not mapped
all   *           controllers/errors/internal-error       # catch internal server errors
```

```
# file: routes/api
# description: route file for complex-example.com/api/v1

# actively forces requests to have a session (requests without an attached session will be rejected)
all   **        controllers/session.force   

get   account   controllers/api/v1/account.details      # gets the user's account details; returns 200 for success or 401 if the user is not logged in
post  account   controllers/api/v1/account.create       # handle registration requests; returns 200 for success or 409 if the user already exists
put   account   controllers/api/v1/account.update       # handle account modifications; returns 200 for success or 401 if the user is not logged in
post  login     controllers/api/v1/login                # handle login requests; returns 200 for success or 401 if login fails
post  logout    controllers/api/v1/logout               # handle logout requests; returns 200 for success or 401 if the user is not logged in
```

### Application Logic

for the sake of simplicity, the logic for the controllers is not shown but if
this were a real site you would expect to find said logic at their respective
locations.

___

## Future Ideas
- allow paths to use regular expressions
- watch controller files and reload routes
- a synchronous method for loading route files
- Other Ideas? Open an issue!

___

## LICENSE

The MIT License (MIT)

Copyright (c) Dockerfile Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
