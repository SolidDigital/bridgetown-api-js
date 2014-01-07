'use strict';

var exports = module.exports;

exports.setup = function(callback) {
    var write = process.stdout.write;

    process.stdout.write = (function(write) {
        return function(string, encoding, fd) {
            write.apply(process.stdout, arguments);
            callback(string, encoding, fd);
        };
    })(process.stdout.write);

    return function() {
        process.stdout.write = write;
    };
};