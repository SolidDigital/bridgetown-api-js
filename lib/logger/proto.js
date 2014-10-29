'use strict';

/**
 * Common logger prototype that is used to log out information from the api.
 * @type {{}}
 */
module.exports = {
    debug: debug,
    error: error,
    fatal: fatal,
    info: info,
    trace: trace,

    // write is customizable so that  you can replace it with write logs, loggly, etc.
    write: write
};

function write(type, message, pretty){
    var now = new Date(),
        timeStamp = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear() +
            ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds(),
        entry = '[' + timeStamp + '] [' + type.toUpperCase() + ']  ' + formatMessage(message, pretty);

    console.log(entry);
}

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

function trace(message, pretty) {
    this.write('TRACE', message, pretty);
}

function info(message, pretty) {
    this.write('INFO', message, pretty);
}

function fatal(message, pretty) {
    this.write('FATAL', message);
    throw new Error(message, pretty);
}

function error(message, pretty) {
    this.write('ERROR', message, pretty);
}

function debug(message, pretty) {
    this.write('DEBUG', message, pretty);
}

