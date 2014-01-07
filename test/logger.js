var bridgetownApi = require('../lib/bridgetown-api'),
    hook = require('./dependencies/hook_stdout'),
    Response = require('../lib/Response');

require('chai').should();

describe('Application Logger', function(){
    'use strict';

    var logger = {
            name: 'test'
        },
        mockResponse = {
            writeHead: function(){},
            write: function(){},
            end: function(){}
        };

    it('should pass in a custom logger implementation to api and pass if custom property is found.', function(done) {
        bridgetownApi.configure(function(){
            this.debug = true;
            this.useLogger(logger);
            this.logger.name.should.equal('test');
            done();
        });
    });

    it('logger should output the test log.', function(done) {
        var response = new Response(mockResponse),
            unhook = hook.setup(function(string){
                string.should.contain('[DEBUG]  200 - "this is a test"');
                unhook();
                done();
            });

        response.write(200, 'this is a test');

    });
});