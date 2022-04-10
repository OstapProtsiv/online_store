const ApiError = require("../error/ApiError");

function errorMiddleware(err, req, res, next) {
    console.log(err);
    if (err instanceof ApiError) {
        return err;
    }
    return ApiError.Unknown('Some unknown error :(')
}

let objToExport = { errorMiddleware };

module.exports = objToExport;