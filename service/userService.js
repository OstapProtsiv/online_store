const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');
const tokenService = require('./tokenService');

const models = require('../models');

function checkParams(email, password) {
    if (!(/@gmail.com|@ukr.net/).test(email)) {
        throw ApiError.BadRequest(401, 'Wrong email');
    }
    if (!(password.length >= 3 && password.length <= 10)) {
        throw ApiError.BadRequest(401, 'Wrong password length');
    }
}

function parseDbAnswer(answer) {
    return answer.dataValues;
}

class UserService {
    async registration(email, password, role) {
        checkParams(email, password);

        const candidate = models.user.findAll({
            where: {
                email,
            },
        });

        if (candidate.length) {
            throw ApiError.BadRequest(401, 'User with such email already exists');
        }
        const hashPassword = await bcrypt.hash(password, 4);

        const user = await models.user.create({
            email,
            password: hashPassword,
            role,
        });

        const userData = parseDbAnswer(user);

        const {
            accessToken,
            refreshToken,
        } = tokenService.createTokens({ email, id: userData.id, role });

        await models.userToken.create({
            userId: userData.id,
            refreshToken,
        });

        await models.basket.create({
            userId: userData.id,
        });
        userData.refreshToken = refreshToken;
        userData.accessToken = accessToken;
        return userData;
    }

    async login(email, password) {
        const user = await models.user.findAll({
            where: {
                email,
            },
        });

        if (!user.length) {
            throw ApiError.BadRequest(401, `there is no user with email=${email}`);
        }

        const userData = parseDbAnswer(user[0]);

        const hashedPassword = userData.password;
        const isEqual = await bcrypt.compare(password, hashedPassword);
        if (!isEqual) {
            throw ApiError.BadRequest(401, 'Wrong password entered');
        }
        const {
            accessToken,
            refreshToken,
        } = tokenService.createTokens({ email, id: userData.id, role: userData.role });

        await models.userToken.update({ refreshToken }, {
            where: {
                userId: userData.id,
            },
        });

        userData.refreshToken = refreshToken;
        userData.accessToken = accessToken;
        return userData;
    }

    async refresh(token) {
        const userData = tokenService.validateRefresh(token);
        const oldToken = await models.refreshToken.findAll({
            attributes: ['refreshToken'],
            where: {
                userId: userData.id,
            },
        });

        if (oldToken[0].refreshToken !== token) {
            throw ApiError.BadRequest(401, 'wrong refresh token');
        }
        const {
            accessToken,
            refreshToken,
        } = tokenService.createTokens(
            { email: userData.email, id: userData.id, role: userData.role },
        );

        await models.userToken.update(
            { refreshToken },
            {
                where: {
                    userId: userData.id,
                },
            },
        );
        return { refreshToken, accessToken };
    }

    async delete(email) {
        const userToDelete = parseDbAnswer(await models.user.findOne({
            where: {
                email,
            },
        }));
        await models.basket.destroy({
            where: {
                userId: userToDelete.id,
            },
        });
        await models.userToken.destroy({
            where: {
                userId: userToDelete.id,
            },
        });
        const deletedUser = await models.user.destroy({
            where: {
                id: userToDelete.id,
            },
        });
        return deletedUser;
    }
}

module.exports = new UserService();
