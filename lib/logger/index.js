'use strict';
/**
 * The logger module will create an object that has a very basic set of functionality. Then if you include your own
 * logger that functionality gets overwritten.
 * @type {{}}
 */
var logger = module.exports = {},
    proto = require('./proto');

function merge(a, b){
    if (a && b) {
        for (var key in b) {
            a[key] = b[key];
        }
    }
    return a;
}

logger.init = function(implementation){
    merge(this, proto);

    if(implementation){
        merge(this, implementation);
    }

    return this;
};

