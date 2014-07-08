'use strict';

var Response = require('../Response');

/**
 * The file not found module is responsible for sending a 404.
 *
 */
module.exports = function(httpRequest, httpResponse){
    new Response(httpResponse).writeNotFound();
};