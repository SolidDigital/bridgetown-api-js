var hook = require('./dependencies/hook_stdout'),
    Response = require('../lib/Response');

require('chai').should();

describe('Test common responses', function(){
    'use strict';

    var mockResponse = {
            writeHead: function(){},
            write: function(){},
            end: function(){}
        };


    it('should return unauthorized', function(done) {
        var response = new Response(mockResponse),
            unhook = hook.setup(function(string){
                unhook();
                string.should.contain('[DEBUG]  401 - {"code":401,"status":"error","message":"Unauthorized"}');
                done();
            });

        response.writeUnauthorized();
    });

    it('should return 404', function(done) {
        var response = new Response(mockResponse),
            unhook = hook.setup(function(string){
                unhook();
                string.should.contain('[DEBUG]  404 - {"code":404,"status":"error","message":"Not Found"}');
                done();
            });

        response.writeNotFound();
    });

    it('should return a bad request', function(done) {
        var response = new Response(mockResponse),
            unhook = hook.setup(function(string){
                unhook();
                string.should.contain('[DEBUG]  400 - {"code":400,"status":"error","message":"Bad Request"}');
                done();
            });

        response.writeBadRequest();
    });

    it('should return forbidden', function(done) {
        var response = new Response(mockResponse),
            unhook = hook.setup(function(string){
                unhook();
                string.should.contain('[DEBUG]  403 - {"code":403,"status":"error","message":"Forbidden"}');
                done();
            });

        response.writeForbidden();
    });

    it('should return server error', function(done) {
        var response = new Response(mockResponse),
            unhook = hook.setup(function(string){
                unhook();
                string.should.contain('[DEBUG]  500 - {"code":500,"status":"error","message":"Server Error"}');
                done();
            });

        response.writeServerError();
    });

    it('should return service unavailable', function(done) {
        var response = new Response(mockResponse),
            unhook = hook.setup(function(string){
                unhook();
                string.should.contain('[DEBUG]  503 - {"code":503,"status":"error","message":"Service Unavailable"}');
                done();
            });

        response.writeServiceUnavailable();
    });

    it('should return timeout', function(done) {
        var response = new Response(mockResponse),
            unhook = hook.setup(function(string){
                unhook();
                string.should.contain('[DEBUG]  408 - {"code":408,"status":"error","message":"Request timed out"}');
                done();
            });

        response.writeTimeout();
    });

    it('should use code and errorCode interchangably.', function(done) {
        var response = new Response(mockResponse),
            error = new Error('Unauthorized'),
            unhook = hook.setup(function(string){
                unhook();
                string.should.contain('[DEBUG]  401 - {"code":401,"status":"error","message":"Unauthorized"}');
                done();
            });

        error.code = 401;
        response.writeError(error);
    });
});