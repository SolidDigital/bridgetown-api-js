var server = require('./server'),
    q = require('q');

require('chai').should();
describe('API-KEY Validation', function(){
    'use strict';

    var port = 3210,
        bridgetownApi = require('../lib/bridgetown-api'),
        request = require('./request'),
        middleware = bridgetownApi.middleware;

    afterEach(function() {
        server.stop();
    });


    it('should receive a 403 because the api is trying to be used before registering an API-KEY precondition.', function(done) { //jshint ignore:line
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    'X-API-KEY': '12345890'
                }
            };

        server.start( function(req, res) {
            middleware.apiKey(req, res, function(){
                throw new Error();
            });
        } );

        request(options).then(function(response){
            response.code.should.equal(403);
            response.message.should.equal('API key validation method not registered.');
        }).done(done);
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
            };

        function validateApiKey(apiKey){
            var deferred = q.defer();

            apiKey.should.equal('1234567890');
            deferred.resolve(true);
            return deferred.promise;
        }

        server.start( function(req, res) {
            middleware.apiKey(req, res, function(){
                done();
            });
        } );

        server.configure(function(){
            this.validate.apiKey(validateApiKey);
        });

        request(options).then(function(){
            //Test ends before getting here
            true.should.equal(false);
        }).done();
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
            };

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

        server.start( function(req, res) {
            middleware.apiKey(req, res, function(){
                throw new Error();
            });
        } );

        request(options).then(function(response){
            response.message.should.equal('API Keys are invalid');
        }).done(done);
    });
});