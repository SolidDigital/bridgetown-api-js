'use strict';

/**
 * Common logger prototype that is used to log out information from the api.
 * @type {{}}
 */
var logger = module.exports = {};

function formatMessage(message, pretty){
    var msg = '',
        ObjProto = Object.prototype,
        toString = ObjProto.toString;

    if(typeof message === 'string' || message instanceof String){
        msg = message;
    }
    else if(toString.call(message) == '[object Array]' || message === Object(message)){
        msg = pretty ? JSON.stringify(message, null, 4) : JSON.stringify(message);
    }
    else {
        msg = message;
    }

    return msg;
}

function write(type, message, pretty){
    var now = new Date(),
        timeStamp = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear() +
            ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds(),
        entry = '[' + timeStamp + '] [' + type.toUpperCase() + ']  ' + formatMessage(message, pretty);

    console.log(entry);
}

logger.trace = function(message, pretty) {
    this.write('TRACE', message, pretty);
};

logger.info = function(message, pretty) {
    this.write('INFO', message, pretty);
};

logger.fatal = function(message, pretty) {
    this.write('FATAL', message);
    throw new Error(message, pretty);
};

logger.error = function(message, pretty) {
    this.write('ERROR', message, pretty);
};

logger.debug = function(message, pretty) {
    this.write('DEBUG', message, pretty);
};

// write is customizable so that  you can replace it with right logs, loggly, etc.
logger.write = write;