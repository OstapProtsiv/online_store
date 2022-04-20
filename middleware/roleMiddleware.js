const ApiError = require("../error/ApiError");
const tokenService = require("../service/tokenService");

function checkRole(roles) {
    return (req, res, next) => {
        // try {
        //     if (!req.headers.authorization) {
        //         throw ApiError.BadRequest(401, 'no token')
        //     }
        //     const token = req.headers.authorization.split(' ')[1];
        //     let userData = tokenService.validateAccess(token);
        //     if (!userData) {
        //         throw ApiError.BadRequest(401, 'wrong access token');
        //     }
        //     const userRole = userData.role;
        //     if (!roles.includes(userRole)) {
        //         throw ApiError.Forbidden('access is denied');
        //     }
        //     next();
        // } catch (error) {
        //     next(error);
        // }
    }
}
let exportObj = { checkRole };

module.exports = exportObj;