var bridgetownApi = require('../lib/bridgetown-api'),
    Response = require('../lib/Response'),
    sinon = require('sinon'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    utilities = require('./utilities');

chai.should();
chai.use(sinonChai);

require('chai').should();

describe('Application Logger', function(){
    'use strict';

    var logger = {
            name: 'test',
            write : sinon.spy()
        };

    it('should pass in a custom logger implementation to api and pass if custom property is found.', function() {
        bridgetownApi.debug = true;
        bridgetownApi.useLogger(logger);
        bridgetownApi.logger.name.should.equal('test');
    });

    it('logger should output the test log.', function() {
        var response = new Response(utilities.getMockResponse());

        response.write(200, 'this is a test');
        logger.write.should.have.been.calledWith('DEBUG', '200 - "this is a test"', undefined);
        bridgetownApi.debug = false;
    });
});
