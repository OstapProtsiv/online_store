const pool = require("../dbConn");
const ApiError = require("../error/ApiError");
const bcrypt = require('bcrypt');
const tokenService = require("./tokenService");
const { QueryTypes } = require('sequelize');
const sequelize = require('../dbConn/sequelizeConn');

function checkParams(email, password) {
    if (!(/@gmail.com|@ukr.net/).test(email)) {
        throw ApiError.BadRequest(401, 'Wrong email');
    }
    if (!(password.length >= 3 && password.length <= 10)) {
        throw ApiError.BadRequest(401, 'Wrong password length');
    }
}

function parseDbAnswer(answer, type) {
    if (type == 'select')
        return answer[0];
    if (type == 'insert')
        return answer[0][0];
}

class UserService {
    async registration(email, password, role) {
        checkParams(email, password);

        const candidate = await sequelize.query(
            'SELECT * FROM  users where email=?',
            {
                replacements: [email],
                type: QueryTypes.SELECT,
            }
        )

        if (candidate.length) {
            throw ApiError.BadRequest(401, 'User with such email already exists');
        }
        const hashPassword = await bcrypt.hash(password, 4);

        let user = await sequelize.query(
            'INSERT INTO users (email,password,role) VALUES (?,?,?) RETURNING *',
            { replacements: [email, hashPassword, role], type: QueryTypes.INSERT }
        );
        let userData = parseDbAnswer(user, 'insert');
        const { accessToken, refreshToken } = tokenService.createTokens({ email, id: userData.id, role });

        await sequelize.query(
            'INSERT INTO "userTokens" ("userId","refreshToken") VALUES (?,?) RETURNING *',
            {
                replacements: [userData.id, refreshToken],
                type: QueryTypes.INSERT
            }
        )
        await sequelize.query(
            'INSERT INTO baskets ("userId") VALUES (?)',
            {
                replacements: [userData.id],
                type: QueryTypes.INSERT
            }
        )
        userData.refreshToken = refreshToken;
        userData.accessToken = accessToken;
        return userData;
    }

    async login(email, password) {
        let user = await sequelize.query(
            'SELECT * FROM users WHERE email=?',
            {
                replacements: [email],
                type: QueryTypes.SELECT
            }
        )
        if (!user.length) {
            throw ApiError.BadRequest(401, `there is no user with email=${email}`);
        }

        let userData = parseDbAnswer(user, 'select');
        console.log(userData);
        let hashedPassword = userData.password;
        let isEqual = await bcrypt.compare(password, hashedPassword);
        if (!isEqual) {
            throw ApiError.BadRequest(401, `Wrong password entered`);
        }
        const { accessToken, refreshToken } = tokenService.createTokens({ email, id: userData.id, role: userData.role });

        await sequelize.query(
            'UPDATE "userTokens" SET "refreshToken" = ? WHERE id =?',
            {
                replacements: [refreshToken, userData.id]
            }
        )
        userData.refreshToken = refreshToken;
        userData.accessToken = accessToken;
        return userData;
    }

    async refresh(token) {
        let userData = tokenService.validateRefresh(token);
        // let oldToken = (await pool.query('SELECT refreshtoken FROM user_token where user_id=$1', [userData.id])).rows[0].refreshtoken;
        let oldToken = await sequelize.query(
            'SELECT "refreshToken" FROM "userTokens" WHERE "userId"=?',
            {
                replacements: [userData.id],
                type: QueryTypes.SELECT
            }
        )
        if (oldToken[0].refreshToken != token) {
            throw ApiError.BadRequest(401, 'wrong refresh token');
        }
        const tokens = tokenService.createTokens({ email: userData.email, id: userData.id, role: userData.role });
        await sequelize.query(
            'UPDATE "userTokens" SET "refreshToken" = ? WHERE id =?',
            {
                replacements: [tokens.refreshToken, userData.id]
            }
        )
        return tokens;

    }
}

module.exports = new UserService();