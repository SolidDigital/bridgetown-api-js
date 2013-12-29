![Bridgetown API](https://s3.amazonaws.com/SolidInteractive/images/bridgetown/bridgetown-api-logo.png)

--------------------------------------------------------------------------------------------------------------

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
var middleware = require('../lib/bridgetown-api').middleware;

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
var bridgetownApi = require('../lib/bridgetown-api'),
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
var bridgetownApi = require('../lib/bridgetown-api'),
    middleware = bridgetownApi.middleware;

app.get('/resource', [middleware.authorization, routes.resource.get]);

```

### authToken

The auth token middleware would typically be paired up with the authorization middleware. You would supply a validation method to the library and if the token is valid the next middleware would be called, if not then an error would get sent back.

```
var bridgetownApi = require('../lib/bridgetown-api'),
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

app.get('/resource', [middleware.apiKey, routes.resource.get]);

```


### Combinations

The really great thing about these middlewares is that they can be used to create as secure of an API as you like. If you wanted to require and apiKey, authorization and authToken validation then the route definition would look like this.


```
var bridgetownApi = require('../lib/bridgetown-api'),
    middleware = bridgetownApi.middleware;

app.get('/resource', [middleware.apiKey, middleware.authorization, middleware.authToken, routes.resource.get]);

```


### Validation Methods

Validation methods are injected in the `.configure()` function call. There are no callbacks for these methods, they require the use of promises, we typically use the `q` node module to support this functionality. To read more about `q` and promises [https://github.com/kriskowal/q/wiki/API-Reference](Click Here).

------------------------------------------------------------------------------------------

## Responses

API responses can be pure insanity, there is no one standard and it seems that everyone does it differently. Since there is no right answer on how to handle responses, the most important thing is to be consistent. If you build lots of apps you want to come up with a response structure that you can use every time.

The structure that we use is:

* On Success

HTTP Status 200

```
{
    status: "success",
    data: [json data]
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

