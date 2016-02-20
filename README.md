# adv-route

### An easy to use module that maps routes to controllers

___

## Usage:

```
# Comments start with a '#' character

# Routes need to be in the one of the following forms:
# METHOD PATH CONTROLLER_PATH.CONTROLLER_METHOD 
# -- or --
# METHOD PATH CONTROLLER_PATH

# there must be one or more spaces between the tokens
# ie. GET/user will not work

# empty lines and excessive spaces are ignored
      # even comments way over here are ignored
GET     /user             controllers/user.getOne           # this comment will be ignored
GET     /users            controllers/user.getAll

# express's route parameters are preserved and will be visible to the controller
# if the incoming request was /user/billy
# req.params.name would be 'billy'
POST    /user/:name       controllers/user.addOne
POST    /users            controllers/user.addGroup

PUT     /user/:name       controllers/user.addOrReplaceOne
PUT     /users            controllers/user.addOrReplaceGroup

DELETE  /user/:name       controllers/users.deleteOne
DELETE  /user             controllers/users.deleteRange

# CONTROLLER_PATH is relative to process.cwd() unless it begins with the @ symbol.
GET     /literal          @lieral.see
# => router.use('/literal', require('literal').see)
```
___

## Supported REST methods:
  - ALL
  - GET
  - POST
  - PUT
  - DELETE
  - PATCH
  - HEAD

___

## Future Ideas
- allow paths to use regular expressions
- watch controller files and reload routes
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