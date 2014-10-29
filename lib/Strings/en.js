var en = {
    http : {
        200 : 'Success',
        400 : 'Bad Request',
        401 : 'Unauthorized',
        403 : 'Forbidden',
        404 : 'Not found',
        408 : 'Request Timeout',
        500 : 'Server Error',
        502 : 'Bad Gateway',
        503 : 'Service Unavailable'
    },
    errors : {
        bad_request: 'Bad Request',
        forbidden: 'Forbidden',
        invalid_api_key: 'Invalid API key',
        missing_api_key: 'API key not provided.',
        missing_api_key_validation_method: 'API key validation method not registered.',
        missing_credentials: 'Authorization credentials not provided.',
        not_found: 'Not Found',
        server_error: 'Server Error',
        service_unavailable: 'Service Unavailable',
        timeout: 'Request timed out',
        unauthorized: 'Unauthorized'
    }
};

module.exports = en;