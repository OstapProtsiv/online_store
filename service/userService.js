const pool = require("../dbConn");
const ApiError = require("../error/ApiError");
const bcrypt = require('bcrypt');
const tokenService = require("./tokenService");

function checkParams(email, password) {
    if (!(/@gmail.com|@ukr.net/).test(email)) {
        throw ApiError.BadRequest(401, 'Wrong email');
    }
    if (!(password.length >= 3 && password.length <= 10)) {
        throw ApiError.BadRequest(401, 'Wrong password length');
    }
}

class UserService {
    async registration(email, password, role) {
        // check email and password with something like dto
        // when create user create his basket
        //check email.isemail() password length
        checkParams(email, password);
        const candidate = await pool.query('SELECT FROM user1 where email=$1', [email]);

        if (candidate.rows.length) {
            throw ApiError.BadRequest(401, 'User with such email already exists');
        }
        const hashPassword = await bcrypt.hash(password, 4);
        let user = await pool.query('INSERT INTO user1 (email,password,role) VALUES ($1,$2,$3) RETURNING *', [email, hashPassword, role]);
        const { accessToken, refreshToken } = tokenService.createTokens({ email, id: user.rows[0].id, role });
        let savedRefresh = await pool.query('INSERT INTO user_token (user_id,refreshtoken) VALUES ($1,$2)', [user.rows[0].id, refreshToken])// refreshtoken vse z maloi
        await pool.query('INSERT INTO basket (user_id) VALUES ($1)', [user.rows[0].id]);
        user.rows[0].refreshToken = refreshToken;
        user.rows[0].accessToken = accessToken;
        return user.rows;
    }

    async login(email, password) {
        let user = await pool.query('SELECT * FROM user1 WHERE email=$1', [email]);
        if (!user.rows.length) {
            throw ApiError.BadRequest(401, `there is no user with email=${email}`);
        }
        let hashedPassword = user.rows[0].password;
        let isEqual = await bcrypt.compare(password, hashedPassword);
        if (!isEqual) {
            throw ApiError.BadRequest(401, `Wrong password entered`);
        }
        const { accessToken, refreshToken } = tokenService.createTokens({ email, id: user.rows[0].id, role: user.rows[0].role });
        await pool.query('UPDATE user_token SET refreshtoken = $1 where id =$2', [refreshToken, user.rows[0].id]);
        user.rows[0].refreshToken = refreshToken;
        user.rows[0].accessToken = accessToken;
        return user.rows;
    }

    async refresh(token) {
        let userData = tokenService.validateRefresh(token);
        let oldToken = (await pool.query('SELECT refreshtoken FROM user_token where user_id=$1', [userData.id])).rows[0].refreshtoken;
        if (oldToken != token) {
            throw ApiError.BadRequest(401, 'wrong refresh token');
        }
        const tokens = tokenService.createTokens({ email: userData.email, id: userData.id, role: userData.role });
        return tokens;
        // let oldToken=await pool.query('SELECT refreshtoken FROM user_token where')
    }
}

module.exports = new UserService();