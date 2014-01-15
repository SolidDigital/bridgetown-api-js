var en = {
    http : {
        200 : 'Success',
        400 : 'Bad Request',
        401 : 'Unauthorized',
        404 : 'Not found',
        408 : 'Request Timeout',
        500 : 'Server Error',
        502 : 'Bad Gateway',
        403 : 'Forbidden',
        503 : 'Service Unavailable'
    },
    errors : {
        missing_credentials: 'Authorization credentials not provided.',
        missing_api_key: 'API key not provided.',
        missing_api_key_validation_method: 'API key validation method not registered.',
        unauthorized: "Unauthorized",
        forbidden: "Forbidden",
        not_found: "Not Found",
        timeout: "Request timed out",
        bad_request: "Bad Request",
        server_error: "Server Error",
        service_unavailable: "Service Unavailable"
    }
};

module.exports = en;