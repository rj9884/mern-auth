class ApiError extends Error {
    constructor(statusCode, data, message = "Error") {
        super(message); 
        this.statusCode = statusCode;
        this.data = data;
        this.success = statusCode < 400 ? true : false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { ApiError };