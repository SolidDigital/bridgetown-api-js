/**
 * Module that will load a resource file based off of a local
 * @param local Default should be 'en'
 */
var Strings = function(local){
    'use strict';

    var languages = {
            en: require('./en')
        },
        lang = (local) ? languages[local] : languages.en;

    this.group = function(name) {
        return lang[name];
    };
};

module.exports = Strings;