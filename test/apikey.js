var http = require('http'),
    server = require('./server'),
    q = require('q');

require('chai').should();
describe('API-KEY Validation', function(){
    'use strict';

    var port = 3210;

    beforeEach(function() {
        server.start();
    });

    afterEach(function() {
        server.stop();
    });


    it('should receive a 403 because the api is trying to be used before registering an API-KEY precondition.',
        function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    'X-API-KEY': '12345890'
                }
            },
            body = '',
            req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end',function() {
                    var response = JSON.parse(body);

                    response.code.should.equal(403);
                    response.message.should.equal('API key validation method not registered.');

                    done();
                });
            });

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
            req = http.request(options);

        function validateApiKey(apiKey){
            var deferred = q.defer();

            apiKey.should.equal('1234567890');

            done();
            return deferred.promise;
        }

        server.configure(function(){
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
            body = '',
            req = http.request(options, function(res){
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    var response = JSON.parse(body);

                    response.message.should.equal('API Keys are invalid');

                    done();
                });
            });

        function validateApiKey(apiKey){
            var deferred = q.defer(),
                err = new Error('API Keys are invalid');

            err.errorCode = 403;

            apiKey.should.equal('12345890');

            deferred.reject(err);
            return deferred.promise;
        }

        server.configure(function(){
            this.validate.apiKey(validateApiKey);
        });

        req.end();
    });
});