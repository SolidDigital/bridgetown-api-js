'use strict';

/**
 * The logger module will create an object that has a very basic set of functionality. Then if you include your own
 * logger that functionality gets overwritten.
 *
 * This logger is a singleton across the app. It logs responses.
 * It will only log responses that use one of the bt write methods.
 *
 * @type {{}}
 */
var logger = module.exports = {},
    proto = require('./proto'),
    _ = require('lodash');

logger.init = function(implementation){
    _.extend(this, proto);

    if(implementation){
        _.extend(this, implementation);
    }

    return this;
};

