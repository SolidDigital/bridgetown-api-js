var should = require('chai').should(),
    http = require('http'),
    bridgetownApi = require('../lib/bridgetown-api'),
    middleware = bridgetownApi.middleware,
    q = require('q');

describe('API-KEY Validation', function(){
    "use strict";

    var port = 3210;

    it('should receive a 403 because the api is trying to be used before registering an API-KEY precondition.', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    'X-API-KEY': '12345890'
                }
            },
            req = http.request(options, function(res){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    var response = JSON.parse(chunk);

                    response.code.should.equal(403);
                    response.message.should.equal('API key validation method not registered.');

                    server.close();
                    done();
                });
            }),

            server = http.createServer(function (req, res) {
                middleware.apiKey(req, res, function(){
                    // This should not happen.
                    "Should not have passed".should.equal("This was an invalid API Key");
                    done();
                });
            });

        server.listen(port);

        req.end();
    });

    it('should successfully create a server and validate an API key using the precondition function.', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    'X-API-KEY': '1234567890'
                }
            },
            req = http.request(options),

            server = http.createServer(function (req, res) {
                middleware.apiKey(req, res, function(){
                    // If we get here then success
                    server.close();
                    done();
                });
            });

        server.listen(port);

        function validateApiKey(apiKey){
            var deferred = q.defer();

            apiKey.should.equal('1234567890');

            deferred.resolve(true);
            return deferred.promise;
        }

        bridgetownApi.configure(function(){
            this.validate.apiKey(validateApiKey);
        });

        req.end();
    });

    it('should receive a 403 error because the API validation routine returned a failed promise.', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    'X-API-KEY': '12345890'
                }
            },
            req = http.request(options, function(res){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    var response = JSON.parse(chunk);
                    response.message.should.equal('API Keys are invalid');
                    server.close();
                    done();
                });
            }),

            server = http.createServer(function (req, res) {
                middleware.apiKey(req, res, function(){
                    // This should not happen.
                    "Should not have passed".should.equal("This was an invalid API Key");
                    done();
                });
            });

        server.listen(port);

        function validateApiKey(apiKey){
            var deferred = q.defer(),
                err = new Error('API Keys are invalid');

            err.errorCode = 403;

            apiKey.should.equal('12345890');

            deferred.reject(err);
            return deferred.promise;
        }

        bridgetownApi.configure(function(){
            this.validate.apiKey(validateApiKey);
        });

        req.end();
    });
});