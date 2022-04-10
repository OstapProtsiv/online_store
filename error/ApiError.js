class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }

    static BadRequest(status, message) {
        return new ApiError(status, message);
    }
    static Forbidden(message) {
        return new ApiError(403, message);
    }
    static Unknown(message) {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;