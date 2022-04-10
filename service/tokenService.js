const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');

class TokenService {
    createTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '20m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY, { expiresIn: '20h' });
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccess(token) {
        if (!token) {
            throw ApiError.BadRequest(401, 'wrong acess token');
        }
        try {
            console.log(jwt.verify(token, process.env.ACCESS_KEY));
            let userData = jwt.verify(token, process.env.ACCESS_KEY);
            console.log(userData);
            return userData;
        } catch (error) {
            throw ApiError.BadRequest(401, 'token not valid')
        }
    }

    validateRefresh(token) {
        if (!token) {
            throw ApiError.BadRequest(401, 'wrong acess token');
        }
        try {
            let userData = jwt.verify(token, process.env.REFRESH_KEY);
            console.log(userData);
            return userData;
        } catch (error) {
            throw ApiError.BadRequest(401, 'token not valid')
        }
    }
    // чи норм практика validateToken(token,typeOftoken){
    // if(typeOftoken=='refresh')...
    // if(typeOftoken=='access')...
    // }
}

module.exports = new TokenService();