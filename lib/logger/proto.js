'use strict';

/**
 * Common logger prototype that is used to log out information from the api.
 * @type {{}}
 */
var logger = module.exports = {};

function formatMessage(message){
    var msg = '',
        ObjProto = Object.prototype,
        toString = ObjProto.toString;

    if(typeof message === 'string' || message instanceof String){
        msg = message;
    }
    else if(toString.call(message) == '[object Array]' || message === Object(message)){
        msg = JSON.stringify(message);
    }
    else {
        msg = message;
    }

    return msg;
}

function write(type, message){
    var now = new Date(),
        timeStamp = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear() +
            ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds(),
        entry = '[' + timeStamp + '] [' + type.toUpperCase() + ']  ' + formatMessage(message);

    console.log(entry);
}

logger.trace = function(message) {
    write('TRACE', message);
};

logger.info = function(message) {
    write('INFO', message);
};

logger.fatal = function(message) {
    write('FATAL', message);
    throw new Error(message);
};

logger.error = function(message) {
    write('ERROR', message);
};

logger.debug = function(message) {
    write('DEBUG', message);
};