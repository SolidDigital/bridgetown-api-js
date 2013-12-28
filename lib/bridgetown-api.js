var Response = require('./Response'),
    Strings = require('./Strings'),
    Preconditions = {
        Authorization: require('./Preconditions/Authorization'),
        Authentication: require('./Preconditions/Authentication'),
        ApiKey: require('./Preconditions/ApiKey')
    };


module.exports.Api = (function(){
    "use strict";

    var api = {};

    api.register = {};
    api.register.validation = {};

    api.register.validation.token = function(method){
        Preconditions.Authorization.prototype.validate = method;
    };

    api.register.validation.apiKey = function(method){
        Preconditions.ApiKey.prototype.validate = method;
    };

    api.register.validation.authentication = function(method){
        Preconditions.Authentication.prototype.validate = method;
    };

    return api;
})();


module.exports.Preconditions = Preconditions;
module.exports.Response = Response;
module.exports.Strings  = Strings;