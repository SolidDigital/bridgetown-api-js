![Bridgetown API](https://s3.amazonaws.com/SolidInteractive/images/bridgetown/bridgetown-api-logo.png)

--------------------------------------------------------------------------------------------------------------

[![Build Status](https://travis-ci.org/Solid-Interactive/bridgetown-api-js.png?branch=master)](https://travis-ci.org/Solid-Interactive/bridgetown-api-js)  - v.0.0.3-alpha

Anytime you build applications for the modern web, at some point you will have to build an API. APIs power all of our single page web apps, mobile and entertainment applications as well as integrating systems together on the server side.

Every time you build an API the same problems have to be solved.

* Application Access (API Key management)
* Authorization (Authentication header is mandatory)
* Authentication Token Validation
* Domain Security
* Access to Domain Objects

Some of these problems are going to be different for every project but some of them are the same every time. This project is designed to apply the patterns required to facilitate building an API covering the above concepts.

This project does not have any dependecies and can be used with NodeJS's basic HttpRequest/Response objects but typically we would pair this with [https://github.com/visionmedia/express](Express).

This library is most useful when using the built in Middleware objects and taking advantage of Express' ability to chain middle ware for a route. Here is a route example:


```
var middleware = require('bridgetown-api').middleware;

app.get('/resource', [middleware.authorization, routes.resource.get]);
```

The above code will check to see if there is an authentication header available. If there is then `routes.resource.get` gets called. If not then an error response comes back.

------------------------------------------------------------------------------------------

## Middleware

There is a collection of usefull middleware that you can use to protect your routes. Here is a typical pattern to grant access to a domain resource.

![Bridgetown API Domain Access](https://s3.amazonaws.com/SolidInteractive/images/bridgetown/bridge-town-middleware.png)


### apiKey

If your API requires an API Key to allow access then you can use this middleware. This middleware requires you to supply a method to validate the API Key. It also checks to make sure that a `x-api-key` is supplied.


```
var bridgetownApi = require('bridgetown-api'),
    middleware = bridgetownApi.middleware,
    q = require('q');

function validateApiKey(apiKey){
    var deferred = q.defer();

    ...Your code to validate the key should go here...

    return deferred.promise;
}

bridgetownApi.configure(function(){
    this.validate.apiKey(validateApiKey);
});

app.get('/resource', [middleware.apiKey, routes.resource.get]);

```

### authorization

If your API requires authentication then you should be using the authorization middleware. This middleware ensures that the `authorization` header is supplied. If it is not then a failed response will be returned.

```
var bridgetownApi = require('bridgetown-api'),
    middleware = bridgetownApi.middleware;

app.get('/resource', [middleware.authorization, routes.resource.get]);

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
