![Bridgetown API](https://s3.amazonaws.com/SolidInteractive/images/bridgetown/bridgetown-api-logo.png)

--------------------------------------------------------------------------------------------------------------

[![Build Status](https://travis-ci.org/Solid-Interactive/bridgetown-api-js.png?branch=master)](https://travis-ci.org/Solid-Interactive/bridgetown-api-js)  - v.1.0.3

Anytime you build applications for the modern web, at some point you will have to build an API. APIs power all of our single page web apps, mobile and entertainment applications as well as integrating systems together on the server side.

Every time you build an API the same problems have to be solved.

* Application Access (API Key management)
* Authorization (Authentication header is mandatory)
* Authentication Token Validation
* Domain Security
* Access to Domain Objects

Some of these problems are going to be different for every project but some of them are the same every time. This project is designed to apply the patterns required to facilitate building an API covering the above concepts.

This project does not depend on express, and it can be used with NodeJS's basic HttpRequest/Response objects. The middleware uses express methods if available, so the suggested use is as [https://github.com/visionmedia/express](express) middleware.

This library is most useful when using the built in middleware objects and taking advantage of express' ability to chain or layer middleware for a route. Here is a route example:


```javascript
var middleware = require('bridgetown-api').middleware;

app.get('/resource', [
    middleware.initialize(),
    middleware.authorization(),
    routes.resource.get]);
```

The above code will check to see if there is an authentication header available. If there is then `routes.resource.get` gets called. If not then an error response is sent.

------------------------------------------------------------------------------------------

## Migrating from 1.0.0 to 2.0.0

The overall functionality of bridgetown remained the same across the major version bump. Backward incompatibilities were introduced to make bridgetown usable access multiple routers and routes and to make the configuration of its middleware more typical for express users.

The three middleware methods are created by calling the middleware setup methods with you configuration. The middleware is made up of curried methods. This allows use of different instances of the middlewares on different routes and routers.

Examples:

```javascript
var initializeMiddleware = bridgetownApi.middleware.initialize(optionalLogger);
var apiKeyMiddleware = bridgetwonApi.middleware.apiKey(apiKeyValidator);
var authenticateMiddleware = bridgetownApi.middleware.authenticate(authenticationValidator);
```

## Middleware

Bridgetown.middleware is a collection of three pieces of middleware to help add basic security to routes. Here is a typical pattern to grant access to a domain resource.

![Bridgetown API Domain Access](https://s3.amazonaws.com/SolidInteractive/images/bridgetown/bridge-town-middleware.png)

The available layers are:

* initialize - middleware that must be used upstream from all other bt middleware
* apiKey - middleware that checks existence and validity of api key header
* authorization - middleware that checks existence and validity of authorization header

### apiKey

This middleware allows you to require an API Key to access routes.
 This middleware allows you to supply a method to validate the API Key. It also checks to make sure that a `x-api-key` is supplied.

To use `bridgetown.middleware.apiKey`, first initialize bridgetown, then create the api key middlewarre by passing in an api key validator method.


```javascript
var bridgetown = require('bridgetown'),
    middleware = bridgetown.middleware;

function validateApiKey(apiKey, deferred){
    // ...Your code to validate the key should go here...
    // use deferred.resolve or deferred.reject//
}

app.get('/resource', [
    middleware.initialize(),
    middleware.apiKey(validateApiKey),
    routes.resource.get]);
```

### authorization

This middleware allows you to implement [basic access authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). Suggested usage is over https.

This middleware ensures that the `authorization` header is supplied and valid. If it is not then a failed response will be returned.

It is created by passing in a auth validator method. This method will be called with a token object and a deferred. The `tokenObject.method` is the auth method written into the authentication header. `tokenObject.token` is the decoded token in the authentication header.

The deferred can be used to signal valid or invalid auth headers.

```
var bridgetownApi = require('bridgetown-api'),
    middleware = bridgetownApi.middleware;

app.get('/resource', [
    middleware.authorization,
    routes.resource.get]);

```

### authToken

The auth token middleware would typically be paired up with the authorization middleware. You would supply a validation method to the library and if the token is valid the next middleware would be called, if not then an error would get sent back.

```
var bridgetownApi = require('bridgetown-api'),
    middleware = bridgetownApi.middleware,
    q = require('q');

function validateToken(apiKey){
    var deferred = q.defer();

    ...Your code to validate the token should go here...

    return deferred.promise;
}

bridgetownApi.configure(function(){
    this.validate.token(validateToken);
});

app.get('/resource', [middleware.authToken, routes.resource.get]);

```


### Combinations

The really great thing about these middlewares is that they can be used to create as secure of an API as you like. If you wanted to require and apiKey, authorization and authToken validation then the route definition would look like this.


```
var bridgetownApi = require('bridgetown-api'),
    middleware = bridgetownApi.middleware;

app.get('/resource', [middleware.apiKey, middleware.authorization, middleware.authToken, routes.resource.get]);

```


### Validation Methods

Validation methods are injected in the `.configure()` function call. There are no callbacks for these methods, they require the use of promises, we typically use the `q` node module to support this functionality. To read more about `q` and promises [https://github.com/kriskowal/q/wiki/API-Reference](Click Here).

------------------------------------------------------------------------------------------

## Responses

API responses can be pure insanity, there is no one standard and it seems that everyone does it differently. Since there is no right answer on how to handle responses, the most important thing is to be consistent. If you build lots of apps you want to come up with a response structure that you can use every time.


To return a response you will send the bridgetown Response module your HttpResponse object and use it's `write` method.

```
var Response = require('bridgetown-api').Response,
    response = new Response(httpResponse);

response.write(code, message);
```


* On Success

HTTP Status 200

```
{
    ...your data...
}
```

* On Error

HTTP Status <Error Code>

```
{
    code: code,
    status: "error",
    message: "Useful Error Message"
}
```

There are many ways to write out various default errors.

```
var err = new Error({Your error message});
err.errorCode = Response.statusCodes.{appropriate code};
response.writeError(err);
```

Or any of these

```
response.writeUnauthorized();
response.writeForbidden();
response.writeNotFound();
response.writeTimeout();
response.writeBadRequest();
response.writeServerError();
response.writeServiceUnavailable();
```

## Logging

We know debugging is important, so by default we added a VERY basic logger that prints to the console when the api is in `debug` mode.

You can turn on `debug` mode in the configure method.

```
bridgetownApi.configure(function(){
    this.debug = true;
    ... your other config code...
});
```

This logger is purposefully very simple, there are a ton of really good loggers out there and you are free to use any that you like. They just need to implment a `debug` few method. Many loggers out there support 'debug', 'info', 'trace', 'error', 'warn', etc so this should be pretty standard.

To use a custom logger you could do this using the following code.

```
var bridgetownApi = require('bridgetown-api'),
    //Chose solid logger as our custom logger.
    logger = require('solid-logger-js').init({
       adapters: [{
           type: "console",
           application: 'grasshopper-api',
           machine: 'dev-server'
       }]
    });

bridgetownApi.configure(function(){
    this.debug = true;
    this.useLogger(logger);
});
```

That's it. Should use the logger that you pass in instead of the default. This is beneficial so that you can write to the console, file, database or whatever your module supports.


## Running Tests

Fork git repo, then:

* npm install
* npm install -g grunt-cli
* npm install -g mocha

`grunt test` runs the tests.


## Contributors (`git shortlog -s -n`)

[https://github.com/Solid-Interactive/bridgetown-api-js/graphs/contributors](https://github.com/Solid-Interactive/bridgetown-api-js/graphs/contributors)

## License

(The MIT License)

Copyright (c) 2013 Solid Interactive - Travis McHattie

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
